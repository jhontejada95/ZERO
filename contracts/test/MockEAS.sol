// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IEAS} from "../interfaces/IEAS.sol";

contract MockEAS is IEAS {
    mapping(bytes32 => Attestation) private attestations;

    function setAttestation(Attestation calldata attestation) external {
        attestations[attestation.uid] = attestation;
    }

    function revoke(bytes32 uid) external {
        attestations[uid].revocationTime = uint64(block.timestamp);
    }

    function getAttestation(bytes32 uid) external view returns (Attestation memory) {
        return attestations[uid];
    }
}
