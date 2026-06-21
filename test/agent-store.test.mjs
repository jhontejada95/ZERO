import assert from "node:assert/strict";
import test from "node:test";
import { demoReceipt } from "../src/data/demo-receipt.js";
import { runAgentPipeline } from "../shared/agent-pipeline.mjs";
import { SimulatedWalletProvider } from "../shared/agent-wallets.mjs";
import { agentRunItems } from "../api/_lib/agent-store.js";

test("agent run maps to one DynamoDB summary and nine immutable milestones", async () => {
  const run = await runAgentPipeline(demoReceipt, { walletProvider: new SimulatedWalletProvider() });
  const items = agentRunItems(demoReceipt.eventId, run);

  assert.equal(items.length, 10);
  assert.equal(items[0].entityType, "AGENT_RUN");
  assert.equal(items[1].SK.endsWith("STEP#01"), true);
  assert.equal(items.at(-1).SK.endsWith("STEP#09"), true);
  assert.equal(new Set(items.map((item) => item.SK)).size, items.length);
});
