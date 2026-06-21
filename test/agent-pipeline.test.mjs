import assert from "node:assert/strict";
import test from "node:test";
import { demoReceipt } from "../src/data/demo-receipt.js";
import { runAgentPipeline } from "../shared/agent-pipeline.mjs";
import { CDPWalletProvider, cdpSafeAccountName, SimulatedWalletProvider } from "../shared/agent-wallets.mjs";

test("CDP account names are deterministic and satisfy provider limits", () => {
  const longName = "zero-beneficiary-EVT-LABOCANA-2024-0518";
  const first = cdpSafeAccountName(longName, "owner");
  const second = cdpSafeAccountName(longName, "owner");

  assert.equal(first, second);
  assert.match(first, /^[a-z0-9-]{2,36}$/);
  assert.notEqual(first, cdpSafeAccountName(longName, "smart"));
});

test("CDP provider reuses a smart account already owned by an agent", async () => {
  const provider = new CDPWalletProvider();
  const existing = {
    address: "0x2222222222222222222222222222222222222222",
    owners: ["0x1111111111111111111111111111111111111111"],
  };
  const cdp = {
    evm: {
      listSmartAccounts: async () => ({ accounts: [existing] }),
    },
  };

  assert.equal(
    await provider.findSmartAccountByOwner(cdp, existing.owners[0].toUpperCase()),
    existing,
  );
});

test("all ZERO agents complete a deterministic traceable settlement", async () => {
  const first = await runAgentPipeline(demoReceipt, { walletProvider: new SimulatedWalletProvider() });
  const second = await runAgentPipeline(demoReceipt, { walletProvider: new SimulatedWalletProvider() });

  assert.equal(first.status, "COMPLETED");
  assert.equal(first.timeline.length, 9);
  assert.deepEqual(first.wallets, second.wallets);
  assert.equal(first.receiptHash, second.receiptHash);
  assert.equal(first.settlement.transactionHash, second.settlement.transactionHash);
  assert.equal(first.x402.challenge.status, 402);
  assert.equal(first.x402.payment.status, "CONFIRMED");
  assert.equal(first.token.realWorldValue, false);
  assert.match(first.wallets.beneficiary.address, /^0x[0-9a-f]{40}$/);
});

test("verification agent blocks insufficient evidence", async () => {
  const invalid = {
    ...demoReceipt,
    evidence: demoReceipt.evidence.slice(0, 2),
    model: { ...demoReceipt.model, confidence: 0.62 },
  };
  await assert.rejects(runAgentPipeline(invalid, { walletProvider: new SimulatedWalletProvider() }), /rejected/);
});
