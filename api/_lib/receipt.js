import { createHash } from "node:crypto";
import { canonicalize, proofPayload } from "../../shared/receipt-proof.mjs";

export function assembleReceipt(items) {
  const receiptItem = items.find((item) => item.entityType === "RECEIPT");
  const modelItem = items.find((item) => item.entityType === "MODEL_RUN");
  const evidence = items
    .filter((item) => item.entityType === "EVIDENCE")
    .sort((left, right) => left.source.localeCompare(right.source))
    .map(({ source, name, detail, hash }) => ({ source, name, detail, hash }));

  if (!receiptItem || !modelItem) return null;
  const receipt = { ...receiptItem.payload, model: modelItem.payload, evidence, storage: "DYNAMODB" };
  const integrityHash = createHash("sha256").update(canonicalize(proofPayload(receipt))).digest("hex");
  return {
    ...receipt,
    proof: { algorithm: "SHA-256", integrityHash, generatedAt: new Date().toISOString() },
  };
}

