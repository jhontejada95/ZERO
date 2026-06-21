import { calculateIntegrityHash, verifyIntegrity } from "../../shared/receipt-proof.mjs";
import { demoReceipt } from "./demo-receipt.js";

async function sealedDemoReceipt() {
  return {
    ...demoReceipt,
    proof: {
      algorithm: "SHA-256",
      integrityHash: await calculateIntegrityHash(demoReceipt),
      generatedAt: new Date().toISOString(),
    },
  };
}

export async function loadReceipt(receiptId) {
  try {
    const response = await fetch(`/api/receipts/${encodeURIComponent(receiptId)}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Receipt API returned ${response.status}`);
    return await response.json();
  } catch {
    return sealedDemoReceipt();
  }
}

export { verifyIntegrity };

