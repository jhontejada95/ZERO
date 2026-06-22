import { CdpClient } from "@coinbase/cdp-sdk";
import { Contract, Interface, JsonRpcProvider, verifyTypedData } from "ethers";
import artifact from "../artifacts/ZEROSettlementEscrow.json" with { type: "json" };

const ESCROW = "0x4E719831f1e81730499B5E7e8a1f4B8A6E865d2E";
const APPROVER = "0x5d8B442bfe432C06328Afc2a4E4b9Bb609301bB5";
const TREASURY = "0x0834dE5d9bF523db274C77874ad3B1C4ec0e614C";
const PROGRAM_ID = "0x69a738a47a227698f90e62499963026105c5ece46419b200d80f8acf288df0f8";
const ATTESTATION_UID = "0xe2f7a9b141c6e36334b03db9e1d0e9588c610d11540e189fba3004e269726599";
const RECEIPT_HASH = "0x89f75b051814ce66882cfbd33e9177505456da27e168036c4e7edebf0f872ed5";
const BENEFICIARY = "0xe5C43B4AC4147f8Aab8A161E4259252618d7102b";
const AMOUNT = 1_000_000n;
const DOMAIN = { name: "ZERO Settlement Escrow", version: "2", chainId: 84532, verifyingContract: ESCROW };
const TYPES = { SettlementApproval: [
  { name: "programId", type: "bytes32" },
  { name: "attestationUID", type: "bytes32" },
  { name: "beneficiary", type: "address" },
  { name: "amount", type: "uint256" },
  { name: "receiptHash", type: "bytes32" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint256" },
] };

function valueFor(nonce, deadline) {
  return { programId: PROGRAM_ID, attestationUID: ATTESTATION_UID, beneficiary: BENEFICIARY, amount: AMOUNT.toString(), receiptHash: RECEIPT_HASH, nonce: nonce.toString(), deadline: deadline.toString() };
}

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });
  response.setHeader("Cache-Control", "no-store");
  try {
    const provider = new JsonRpcProvider("https://sepolia.base.org", 84532, { staticNetwork: true });
    const escrow = new Contract(ESCROW, artifact.abi, provider);
    const program = await escrow.getProgram(PROGRAM_ID);
    const nonce = await escrow.approvalNonces(APPROVER);

    if (request.method === "GET") {
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);
      return response.status(200).json({
        status: program.status === 3n ? "SETTLED" : "AWAITING_SIGNATURE",
        approver: APPROVER,
        amountDisplay: "1 ZERO safety canary",
        rationale: "Validates human authorization without paying the historical receipt twice.",
        domain: DOMAIN,
        types: TYPES,
        value: valueFor(nonce, deadline),
      });
    }

    if (program.status === 3n) return response.status(200).json({ status: "SETTLED", alreadySettled: true });
    if (program.status !== 2n) return response.status(409).json({ error: "Canary is not funded" });
    const signature = request.body?.signature;
    const deadline = BigInt(request.body?.deadline || 0);
    const now = BigInt(Math.floor(Date.now() / 1000));
    if (!signature || deadline < now || deadline > now + 1200n) return response.status(400).json({ error: "Invalid or expired approval" });
    const value = valueFor(nonce, deadline);
    let recovered;
    try {
      recovered = verifyTypedData(DOMAIN, TYPES, value, signature);
    } catch {
      return response.status(403).json({ error: "Invalid approval signature" });
    }
    if (recovered.toLowerCase() !== APPROVER.toLowerCase()) return response.status(403).json({ error: "Wrong approver" });

    const cdp = new CdpClient();
    const owner = await cdp.evm.getOrCreateAccount({ name: "zero-climate-fund-owner" });
    const smartAccount = await cdp.evm.getSmartAccount({ address: TREASURY, owner });
    const contractInterface = new Interface(artifact.abi);
    const operation = await cdp.evm.prepareAndSendUserOperation({
      smartAccount,
      network: "base-sepolia",
      calls: [{
        to: ESCROW,
        value: 0n,
        data: contractInterface.encodeFunctionData("settle", [PROGRAM_ID, ATTESTATION_UID, nonce, deadline, signature]),
      }],
    });
    const completed = await cdp.evm.waitForUserOperation({
      smartAccountAddress: smartAccount.address,
      userOpHash: operation.userOpHash,
      waitOptions: { timeoutSeconds: 60 },
    });
    if (completed.status !== "complete") throw new Error("Settlement user operation failed");
    return response.status(200).json({ status: "SETTLED", transactionHash: completed.transactionHash, explorer: `https://sepolia.basescan.org/tx/${completed.transactionHash}` });
  } catch (error) {
    console.error("Human approval failed", error?.message);
    return response.status(500).json({ error: "Human approval failed", detail: error?.message });
  }
}
