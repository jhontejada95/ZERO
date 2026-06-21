import assert from "node:assert/strict";
import test from "node:test";
import ganache from "ganache";
import { BrowserProvider, ContractFactory, AbiCoder, id, parseUnits } from "ethers";
import { compileContracts } from "../scripts/compile-contracts.mjs";

const compiled = compileContracts();

function artifact(file, name) {
  const output = compiled[file][name];
  return { abi: output.abi, bytecode: `0x${output.evm.bytecode.object}` };
}

async function deploy(factoryArtifact, signer, args = []) {
  const contract = await new ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode, signer).deploy(...args);
  await contract.waitForDeployment();
  return contract;
}

async function fixture() {
  const rpc = ganache.provider({ logging: { quiet: true }, chain: { chainId: 31337 }, wallet: { totalAccounts: 6 } });
  const provider = new BrowserProvider(rpc);
  const [admin, treasury, beneficiary, verifier, settlement] = await Promise.all([0, 1, 2, 3, 4].map((index) => provider.getSigner(index)));
  const adminAddress = await admin.getAddress();
  const treasuryAddress = await treasury.getAddress();
  const beneficiaryAddress = await beneficiary.getAddress();
  const verifierAddress = await verifier.getAddress();
  const settlementAddress = await settlement.getAddress();
  const schemaUID = id("ZERO_PREVENTION_RECEIPT_V1");
  const supply = parseUnits("100000000", 6);
  const amount = parseUnits("2400000", 6);

  const eas = await deploy(artifact("contracts/test/MockEAS.sol", "MockEAS"), admin);
  const token = await deploy(artifact("contracts/ZEROTestToken.sol", "ZEROTestToken"), admin, [adminAddress, treasuryAddress, supply]);
  const escrow = await deploy(artifact("contracts/ZEROSettlementEscrow.sol", "ZEROSettlementEscrow"), admin, [
    adminAddress,
    await token.getAddress(),
    await eas.getAddress(),
    schemaUID,
  ]);
  await (await escrow.grantRole(await escrow.VERIFIER_ROLE(), verifierAddress)).wait();
  await (await escrow.grantRole(await escrow.SETTLEMENT_ROLE(), settlementAddress)).wait();

  return {
    provider, admin, treasury, beneficiary, verifier, settlement,
    eas, token, escrow, schemaUID, supply, amount,
    adminAddress, treasuryAddress, beneficiaryAddress, verifierAddress, settlementAddress,
  };
}

async function createFundedProgram(context, suffix = "demo") {
  const programId = id(`PROGRAM:${suffix}`);
  const receiptHash = id(`RECEIPT:${suffix}`);
  await (await context.escrow.createProgram(
    programId,
    context.beneficiaryAddress,
    context.treasuryAddress,
    context.amount,
    receiptHash,
  )).wait();
  await (await context.token.connect(context.treasury).approve(await context.escrow.getAddress(), context.amount)).wait();
  await (await context.escrow.connect(context.treasury).fundProgram(programId, context.amount)).wait();
  return { programId, receiptHash };
}

async function issueAttestation(context, { programId, receiptHash, suffix = "demo", attester, dataReceiptHash = receiptHash } = {}) {
  const uid = id(`ATTESTATION:${suffix}`);
  const coder = AbiCoder.defaultAbiCoder();
  const data = coder.encode(
    ["bytes32", "bytes32", "uint256", "address"],
    [programId, dataReceiptHash, context.amount, await context.token.getAddress()],
  );
  await (await context.eas.setAttestation([
    uid,
    context.schemaUID,
    BigInt(Math.floor(Date.now() / 1000)),
    0,
    0,
    "0x" + "00".repeat(32),
    context.beneficiaryAddress,
    attester || context.verifierAddress,
    true,
    data,
  ])).wait();
  return uid;
}

test("ZERO settles 2.4M test tokens only after an authorized attestation", async () => {
  const context = await fixture();
  const program = await createFundedProgram(context);
  const uid = await issueAttestation(context, program);

  const storedProgram = await context.escrow.getProgram(program.programId);
  const storedAttestation = await context.eas.getAttestation(uid);
  assert.equal(storedProgram.status, 2n);
  assert.equal(storedProgram.fundedAmount, context.amount);
  assert.equal(storedAttestation.uid, uid);
  assert.equal(storedAttestation.schema, context.schemaUID);
  assert.equal(storedAttestation.recipient, context.beneficiaryAddress);
  assert.equal(storedAttestation.attester, context.verifierAddress);
  assert.equal(await context.escrow.hasRole(await context.escrow.VERIFIER_ROLE(), context.verifierAddress), true);
  assert.equal(await context.escrow.hasRole(await context.escrow.SETTLEMENT_ROLE(), context.settlementAddress), true);
  assert.equal(await context.token.balanceOf(await context.escrow.getAddress()), context.amount);

  await (await context.escrow.connect(context.settlement).settle(program.programId, uid)).wait();

  assert.equal(await context.token.balanceOf(context.beneficiaryAddress), context.amount);
  assert.equal((await context.escrow.getProgram(program.programId)).status, 3n);
  assert.equal(await context.escrow.consumedAttestations(uid), true);
});

test("ZERO rejects a receipt hash changed after funding", async () => {
  const context = await fixture();
  const program = await createFundedProgram(context, "tampered");
  const uid = await issueAttestation(context, { ...program, suffix: "tampered", dataReceiptHash: id("ALTERED") });

  await assert.rejects(
    context.escrow.connect(context.settlement).settle(program.programId, uid),
    /wrong receipt|missing revert data/,
  );
});

test("ZERO rejects attestations from an unauthorized wallet", async () => {
  const context = await fixture();
  const program = await createFundedProgram(context, "unauthorized");
  const uid = await issueAttestation(context, { ...program, suffix: "unauthorized", attester: context.adminAddress });

  await assert.rejects(
    context.escrow.connect(context.settlement).settle(program.programId, uid),
    /unauthorized verifier|missing revert data/,
  );
});

test("ZERO rejects revoked attestations and cannot pay twice", async () => {
  const context = await fixture();
  const first = await createFundedProgram(context, "revoked");
  const revokedUID = await issueAttestation(context, { ...first, suffix: "revoked" });
  await (await context.eas.revoke(revokedUID)).wait();
  await assert.rejects(
    context.escrow.connect(context.settlement).settle(first.programId, revokedUID),
    /attestation revoked|missing revert data/,
  );

  const second = await createFundedProgram(context, "once");
  const validUID = await issueAttestation(context, { ...second, suffix: "once" });
  await (await context.escrow.connect(context.settlement).settle(second.programId, validUID)).wait();
  await assert.rejects(
    context.escrow.connect(context.settlement).settle(second.programId, validUID),
    /not funded|missing revert data/,
  );
});
