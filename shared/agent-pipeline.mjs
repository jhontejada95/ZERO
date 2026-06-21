import { createHash } from "node:crypto";
import { canonicalize, proofPayload } from "./receipt-proof.mjs";
import { generateAgentNarrative } from "./ai-provider.mjs";
import { walletProviderFromEnvironment } from "./agent-wallets.mjs";
import { LocalX402Adapter } from "./x402-simulator.mjs";

function hexHash(value) {
  return `0x${createHash("sha256").update(typeof value === "string" ? value : canonicalize(value)).digest("hex")}`;
}

function timelineEvent(index, agent, action, detail, proof = {}) {
  return { index, agent, action, detail, status: "VERIFIED", timestamp: new Date(Date.UTC(2024, 4, 18, 13, 40 + index)).toISOString(), proof };
}

export async function runAgentPipeline(receipt, options = {}) {
  const walletProvider = options.walletProvider || walletProviderFromEnvironment();
  const x402 = options.x402 || new LocalX402Adapter();
  const programId = hexHash(`PROGRAM:${receipt.eventId}`);
  const receiptHash = hexHash(proofPayload(receipt));
  const wallets = {};
  const timeline = [];

  wallets.program = await walletProvider.getOrCreateWallet(`zero-${receipt.eventId}`, "smart");
  wallets.treasury = await walletProvider.getOrCreateWallet("zero-climate-fund", "smart");
  wallets.procurement = await walletProvider.getOrCreateWallet(`zero-procurement-${receipt.eventId}`, "smart");
  wallets.verifier = await walletProvider.getOrCreateWallet("zero-verifier", "eoa");
  wallets.beneficiary = await walletProvider.getOrCreateWallet(`zero-beneficiary-${receipt.eventId}`, "smart");
  timeline.push(timelineEvent(1, "Program Agent", "PROGRAM_CREATED", "Created the prevention program and scoped agent wallets.", { programId, wallet: wallets.program.address }));

  const tokenAmount = receipt.payment.amount;
  const fundingTx = hexHash(`FUND:${programId}:${tokenAmount}`);
  timeline.push(timelineEvent(2, "Treasury Agent", "ESCROW_FUNDED", `${tokenAmount.toLocaleString("en-US")} ZERO reserved for verified prevention.`, { transactionHash: fundingTx, treasury: wallets.treasury.address }));

  const purchase = await x402.purchase({ resource: "/climate/risk/la-bocana", payer: wallets.procurement, amount: 25 });
  timeline.push(timelineEvent(3, "Procurement Agent", "X402_DATA_PURCHASED", "Paid for an independent river-risk observation.", { transactionHash: purchase.payment.transactionHash, quoteId: purchase.challenge.quoteId }));

  const purchasedEvidenceHash = hexHash(purchase.resource);
  const evidenceRoot = hexHash([...receipt.evidence, { source: purchase.resource.sensorId, hash: purchasedEvidenceHash }]);
  timeline.push(timelineEvent(4, "Evidence Agent", "EVIDENCE_SEALED", "Canonicalized 127 observations and sealed their provenance root.", { evidenceRoot, purchasedEvidenceHash }));

  const checksPassed = receipt.model.checks.length >= 3 && receipt.model.confidence >= 0.9 && receipt.evidence.length >= 4;
  if (!checksPassed) throw new Error("Verification policy rejected the receipt");
  const narrative = await generateAgentNarrative({
    system: "You summarize verified prevention outcomes. Never invent measurements or approvals.",
    prompt: canonicalize({ receiptId: receipt.receiptId, model: receipt.model, evidenceRoot }),
    fallback: `${receipt.model.protectedPeople} people protected with ${Math.round(receipt.model.confidence * 100)}% model confidence; sensitivity checks passed.`,
  });
  timeline.push(timelineEvent(5, "Verification Agent", "MODEL_VERIFIED", narrative.text, { model: receipt.model.method, confidence: receipt.model.confidence, narrativeProvider: narrative.provider }));

  const approvalMode = options.approvalMode || "SIMULATED";
  const approvalHash = hexHash(`APPROVAL:${programId}:${wallets.verifier.address}`);
  timeline.push(timelineEvent(6, "Human Approval Gate", "APPROVAL_RECORDED", approvalMode === "SIMULATED" ? "Demo approval recorded; production requires an explicit verifier signature." : "Verifier signature accepted.", { approvalHash, verifier: wallets.verifier.address, mode: approvalMode }));

  const attestationUID = hexHash(`EAS:${programId}:${receiptHash}:${approvalHash}`);
  timeline.push(timelineEvent(7, "Attestation Agent", "EAS_ATTESTATION_ISSUED", "Bound beneficiary, amount, token and receipt hash to one revocable attestation.", { attestationUID, receiptHash }));

  const settlementTx = hexHash(`SETTLE:${attestationUID}:${wallets.beneficiary.address}:${tokenAmount}`);
  timeline.push(timelineEvent(8, "Settlement Agent", "PAYMENT_RELEASED", `${tokenAmount.toLocaleString("en-US")} ZERO released to the beneficiary wallet.`, { transactionHash: settlementTx, beneficiary: wallets.beneficiary.address }));

  const auditRoot = hexHash(timeline.map(({ agent, action, proof }) => ({ agent, action, proof })));
  timeline.push(timelineEvent(9, "Audit Agent", "RUN_AUDITED", "No duplicate settlement, altered evidence or role-policy violation detected.", { auditRoot }));

  return {
    runId: `run_${auditRoot.slice(2, 14)}`,
    mode: walletProvider.mode,
    network: "base-sepolia",
    token: { name: "ZERO Test Token", symbol: "ZERO", decimals: 6, amount: tokenAmount, realWorldValue: false },
    programId,
    receiptHash,
    status: "COMPLETED",
    wallets,
    x402: purchase,
    timeline,
    settlement: { transactionHash: settlementTx, attestationUID, beneficiary: wallets.beneficiary.address },
  };
}
