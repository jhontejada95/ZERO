import test from "node:test";
import assert from "node:assert/strict";
import { calculateIntegrityHash, canonicalize, verifyIntegrity } from "../shared/receipt-proof.mjs";
import { demoReceipt } from "../src/data/demo-receipt.js";

test("canonical form is independent from object key order", () => {
  assert.equal(canonicalize({ b: 2, a: 1 }), canonicalize({ a: 1, b: 2 }));
});

test("receipt integrity detects a modified outcome", async () => {
  const integrityHash = await calculateIntegrityHash(demoReceipt);
  const sealed = { ...demoReceipt, proof: { integrityHash } };
  assert.equal(await verifyIntegrity(sealed), true);
  assert.equal(await verifyIntegrity({ ...sealed, evidenceCount: 128 }), false);
});

