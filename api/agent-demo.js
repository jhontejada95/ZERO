import { demoReceipt } from "../src/data/demo-receipt.js";
import { runAgentPipeline } from "../shared/agent-pipeline.mjs";
import { persistAgentRun } from "./_lib/agent-store.js";

function safeErrorChain(error) {
  const chain = [];
  let current = error;

  for (let depth = 0; current && depth < 4; depth += 1) {
    chain.push({
      name: current.name || "Error",
      code: current.code || current.statusCode || current.status || undefined,
      message: current.message || "Unknown error",
    });
    current = current.cause;
  }

  return chain;
}

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  }
  try {
    const run = await runAgentPipeline(demoReceipt, { approvalMode: "SIMULATED" });
    const persistence = process.env.ZERO_AGENT_WRITES_ENABLED === "true"
      ? await persistAgentRun(demoReceipt.eventId, run)
      : { storage: "IN_MEMORY", itemCount: 0 };
    response.setHeader("Cache-Control", "no-store");
    return response.status(200).json({ ...run, persistence });
  } catch (error) {
    console.error("ZERO agent pipeline failure", safeErrorChain(error));
    return response.status(500).json({ error: "Agent pipeline failed", detail: error.message });
  }
}
