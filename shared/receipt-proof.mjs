export function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .filter(([, item]) => item !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonicalize(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function proofPayload(receipt) {
  return {
    receiptId: receipt.receiptId,
    eventId: receipt.eventId,
    issuedAt: receipt.issuedAt,
    intervention: receipt.intervention,
    observedOutcome: receipt.observedOutcome,
    counterfactual: receipt.counterfactual,
    evidenceCount: receipt.evidenceCount,
    beneficiary: receipt.beneficiary,
    payment: receipt.payment,
    model: receipt.model,
    evidence: receipt.evidence,
  };
}

export async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(typeof value === "string" ? value : canonicalize(value));
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function calculateIntegrityHash(receipt) {
  return sha256Hex(proofPayload(receipt));
}

export async function verifyIntegrity(receipt) {
  if (!receipt?.proof?.integrityHash) return false;
  return (await calculateIntegrityHash(receipt)) === receipt.proof.integrityHash;
}

