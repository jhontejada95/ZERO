import test from "node:test";
import assert from "node:assert/strict";
import { assembleReceipt } from "../api/_lib/receipt.js";
import { verifyIntegrity } from "../shared/receipt-proof.mjs";
import { demoReceipt } from "../src/data/demo-receipt.js";

test("DynamoDB event records reconstruct a verifiable receipt", async () => {
  const PK = `EVENT#${demoReceipt.eventId}`;
  const payload = Object.fromEntries(Object.entries(demoReceipt).filter(([key]) => !["model", "evidence", "storage"].includes(key)));
  const items = [
    { PK, SK: `RECEIPT#${demoReceipt.receiptId}`, entityType: "RECEIPT", payload },
    { PK, SK: "MODEL#synthetic-control-v1", entityType: "MODEL_RUN", payload: demoReceipt.model },
    ...demoReceipt.evidence.map((evidence) => ({ PK, SK: `EVIDENCE#${evidence.source}`, entityType: "EVIDENCE", ...evidence })),
  ];

  const receipt = assembleReceipt(items);
  assert.equal(receipt.storage, "DYNAMODB");
  assert.equal(receipt.evidence.length, 4);
  assert.equal(await verifyIntegrity(receipt), true);
});
