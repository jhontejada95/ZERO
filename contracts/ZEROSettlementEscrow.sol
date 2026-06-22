// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IEAS} from "./interfaces/IEAS.sol";

/// @notice Escrows ZERO test tokens and releases them only against a valid EAS attestation.
contract ZEROSettlementEscrow is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant PROGRAM_MANAGER_ROLE = keccak256("PROGRAM_MANAGER_ROLE");
    bytes32 public constant SETTLEMENT_ROLE = keccak256("SETTLEMENT_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant APPROVER_ROLE = keccak256("APPROVER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    enum ProgramStatus { None, Created, Funded, Settled, Cancelled }

    struct Program {
        address beneficiary;
        address refundAddress;
        uint256 targetAmount;
        uint256 fundedAmount;
        bytes32 receiptHash;
        bytes32 attestationUID;
        ProgramStatus status;
    }

    IERC20 public immutable token;
    IEAS public immutable eas;
    bytes32 public immutable preventionSchemaUID;
    mapping(bytes32 => Program) private programs;
    mapping(bytes32 => bool) public consumedAttestations;
    mapping(bytes32 => bool) public consumedApprovals;
    mapping(address => uint256) public approvalNonces;

    bytes32 public constant APPROVAL_TYPEHASH = keccak256(
        "SettlementApproval(bytes32 programId,bytes32 attestationUID,address beneficiary,uint256 amount,bytes32 receiptHash,uint256 nonce,uint256 deadline)"
    );
    bytes32 private constant DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );
    bytes32 private constant NAME_HASH = keccak256("ZERO Settlement Escrow");
    bytes32 private constant VERSION_HASH = keccak256("2");
    uint256 private constant SECP256K1_HALF_ORDER =
        0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0;

    event ProgramCreated(bytes32 indexed programId, address indexed beneficiary, uint256 targetAmount, bytes32 receiptHash);
    event ProgramFunded(bytes32 indexed programId, address indexed funder, uint256 amount, uint256 fundedAmount);
    event ProgramSettled(bytes32 indexed programId, address indexed beneficiary, uint256 amount, bytes32 indexed attestationUID);
    event SettlementApproved(bytes32 indexed programId, address indexed approver, bytes32 indexed approvalDigest, uint256 nonce);
    event ProgramCancelled(bytes32 indexed programId, address indexed refundAddress, uint256 refundedAmount);

    constructor(address admin, address initialApprover, IERC20 settlementToken, IEAS easContract, bytes32 schemaUID) {
        require(admin != address(0) && initialApprover != address(0) && address(settlementToken) != address(0) && address(easContract) != address(0), "ZERO: zero address");
        token = settlementToken;
        eas = easContract;
        preventionSchemaUID = schemaUID;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PROGRAM_MANAGER_ROLE, admin);
        _grantRole(SETTLEMENT_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(APPROVER_ROLE, initialApprover);
    }

    function createProgram(
        bytes32 programId,
        address beneficiary,
        address refundAddress,
        uint256 targetAmount,
        bytes32 receiptHash
    ) external onlyRole(PROGRAM_MANAGER_ROLE) whenNotPaused {
        require(programs[programId].status == ProgramStatus.None, "ZERO: program exists");
        require(beneficiary != address(0) && refundAddress != address(0), "ZERO: zero address");
        require(targetAmount > 0 && receiptHash != bytes32(0), "ZERO: invalid program");

        programs[programId] = Program({
            beneficiary: beneficiary,
            refundAddress: refundAddress,
            targetAmount: targetAmount,
            fundedAmount: 0,
            receiptHash: receiptHash,
            attestationUID: bytes32(0),
            status: ProgramStatus.Created
        });
        emit ProgramCreated(programId, beneficiary, targetAmount, receiptHash);
    }

    function fundProgram(bytes32 programId, uint256 amount) external nonReentrant whenNotPaused {
        Program storage program = programs[programId];
        require(program.status == ProgramStatus.Created || program.status == ProgramStatus.Funded, "ZERO: not fundable");
        require(amount > 0 && program.fundedAmount + amount <= program.targetAmount, "ZERO: invalid amount");

        token.safeTransferFrom(msg.sender, address(this), amount);
        program.fundedAmount += amount;
        if (program.fundedAmount == program.targetAmount) program.status = ProgramStatus.Funded;
        emit ProgramFunded(programId, msg.sender, amount, program.fundedAmount);
    }

    function settle(
        bytes32 programId,
        bytes32 attestationUID,
        uint256 nonce,
        uint256 deadline,
        bytes calldata approvalSignature
    )
        external
        onlyRole(SETTLEMENT_ROLE)
        nonReentrant
        whenNotPaused
    {
        Program storage program = programs[programId];
        require(program.status == ProgramStatus.Funded, "ZERO: not funded");
        require(!consumedAttestations[attestationUID], "ZERO: attestation consumed");

        IEAS.Attestation memory attestation = eas.getAttestation(attestationUID);
        require(attestation.uid == attestationUID && attestation.schema == preventionSchemaUID, "ZERO: wrong attestation");
        require(attestation.revocationTime == 0, "ZERO: attestation revoked");
        require(attestation.expirationTime == 0 || attestation.expirationTime > block.timestamp, "ZERO: attestation expired");
        require(attestation.recipient == program.beneficiary, "ZERO: wrong beneficiary");
        require(hasRole(VERIFIER_ROLE, attestation.attester), "ZERO: unauthorized verifier");

        (bytes32 attestedProgramId, bytes32 receiptHash, uint256 amount, address settlementToken) =
            abi.decode(attestation.data, (bytes32, bytes32, uint256, address));
        require(attestedProgramId == programId, "ZERO: wrong program");
        require(receiptHash == program.receiptHash, "ZERO: wrong receipt");
        require(amount == program.targetAmount && settlementToken == address(token), "ZERO: wrong settlement");

        (address approver, bytes32 approvalDigest) = _consumeApproval(
            program, programId, attestationUID, nonce, deadline, approvalSignature
        );

        consumedAttestations[attestationUID] = true;
        program.attestationUID = attestationUID;
        program.status = ProgramStatus.Settled;
        emit SettlementApproved(programId, approver, approvalDigest, nonce);
        token.safeTransfer(program.beneficiary, program.targetAmount);
        emit ProgramSettled(programId, program.beneficiary, program.targetAmount, attestationUID);
    }

    function _consumeApproval(
        Program storage program,
        bytes32 programId,
        bytes32 attestationUID,
        uint256 nonce,
        uint256 deadline,
        bytes calldata approvalSignature
    ) private returns (address approver, bytes32 approvalDigest) {
        require(block.timestamp <= deadline, "ZERO: approval expired");
        bytes32 approvalStructHash = keccak256(abi.encode(
            APPROVAL_TYPEHASH,
            programId,
            attestationUID,
            program.beneficiary,
            program.targetAmount,
            program.receiptHash,
            nonce,
            deadline
        ));
        bytes32 domainSeparator = keccak256(abi.encode(
            DOMAIN_TYPEHASH,
            NAME_HASH,
            VERSION_HASH,
            block.chainid,
            address(this)
        ));
        approvalDigest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, approvalStructHash));
        require(!consumedApprovals[approvalDigest], "ZERO: approval consumed");
        approver = _recover(approvalDigest, approvalSignature);
        require(hasRole(APPROVER_ROLE, approver), "ZERO: unauthorized approver");
        require(nonce == approvalNonces[approver], "ZERO: wrong approval nonce");
        consumedApprovals[approvalDigest] = true;
        approvalNonces[approver] = nonce + 1;
    }

    function _recover(bytes32 digest, bytes calldata signature) private pure returns (address signer) {
        require(signature.length == 65, "ZERO: invalid signature");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 32))
            v := byte(0, calldataload(add(signature.offset, 64)))
        }
        require(uint256(s) <= SECP256K1_HALF_ORDER && (v == 27 || v == 28), "ZERO: invalid signature");
        signer = ecrecover(digest, v, r, s);
        require(signer != address(0), "ZERO: invalid signature");
    }

    function cancelProgram(bytes32 programId) external onlyRole(PROGRAM_MANAGER_ROLE) nonReentrant {
        Program storage program = programs[programId];
        require(program.status == ProgramStatus.Created || program.status == ProgramStatus.Funded, "ZERO: not cancellable");
        uint256 refund = program.fundedAmount;
        program.fundedAmount = 0;
        program.status = ProgramStatus.Cancelled;
        if (refund > 0) token.safeTransfer(program.refundAddress, refund);
        emit ProgramCancelled(programId, program.refundAddress, refund);
    }

    function pause() external onlyRole(PAUSER_ROLE) { _pause(); }
    function unpause() external onlyRole(PAUSER_ROLE) { _unpause(); }

    function getProgram(bytes32 programId) external view returns (Program memory) {
        return programs[programId];
    }
}
