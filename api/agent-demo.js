import deployment from "../deployments/base-sepolia.json" with { type: "json" };

function event(index, agent, action, detail, proof = {}) {
  return {
    index,
    agent,
    action,
    detail,
    status: "CONFIRMED_ON_BASE_SEPOLIA",
    timestamp: new Date(Date.UTC(2026, 5, 21, 15, index)).toISOString(),
    proof,
  };
}

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { contracts, settlement, humanApproval, x402, transactions } = deployment;
  const timeline = [
    event(1, "Program Agent", "PROGRAM_CREATED", "Created the prevention program in the settlement escrow.", { transactionHash: settlement.transactions.createProgram, programId: settlement.programId }),
    event(2, "Treasury Agent", "ESCROW_FUNDED", `${settlement.amountDisplay} funded into the escrow contract.`, { transactionHash: settlement.transactions.funding, escrow: contracts.zeroSettlementEscrow }),
    event(3, "Procurement Agent", "X402_DATA_PURCHASED", `${x402.amountDisplay || x402.asset.amountDisplay} paid in Base Sepolia USDC for independent evidence.`, { transactionHash: x402.paymentTransaction, protocol: x402.protocol, payer: x402.payer, payTo: x402.payTo }),
    event(4, "Evidence Agent", "EVIDENCE_SEALED", "Evidence and counterfactual materials were bound to the receipt hash.", { receiptHash: settlement.receiptHash }),
    event(5, "Verification Agent", "EAS_ATTESTATION_ISSUED", "Verifier issued the EAS attestation used by the escrow.", { transactionHash: settlement.transactions.attestation, attestationUID: settlement.attestationUID }),
    event(6, "Human Approval Gate", "EIP712_AUTHORIZATION_PROVEN", "Designated human approver signed and settled the safety canary rail.", { transactionHash: humanApproval.canary.settlementTransaction, approver: humanApproval.approver, digest: humanApproval.canary.approvalDigest }),
    event(7, "Settlement Agent", "PAYMENT_RELEASED", `${settlement.amountDisplay} released to the beneficiary on Base Sepolia.`, { transactionHash: settlement.transactions.settlement, beneficiary: settlement.beneficiary }),
    event(8, "Audit Agent", "RUN_AUDITED", "Contracts, attestation, approval digest, x402 payment and settlement transactions are publicly reconstructable.", { explorer: deployment.explorer }),
  ];

  response.setHeader("Cache-Control", "no-store");
  return response.status(200).json({
    runId: `base-sepolia-${settlement.transactions.settlement.slice(2, 10)}`,
    mode: "CONFIRMED_TESTNET_REFERENCE",
    network: deployment.network,
    token: deployment.token,
    programId: settlement.programId,
    receiptHash: settlement.receiptHash,
    status: "COMPLETED_ONCHAIN",
    contracts,
    wallets: {
      treasury: { address: deployment.treasury },
      verifier: { address: deployment.verifier },
      beneficiary: { address: settlement.beneficiary },
      procurement: { address: x402.payer },
      evidenceProvider: { address: x402.payTo },
      humanApprover: { address: humanApproval.approver },
    },
    x402,
    timeline,
    settlement: {
      transactionHash: settlement.transactions.settlement,
      attestationUID: settlement.attestationUID,
      beneficiary: settlement.beneficiary,
    },
    transactions,
  });
}
