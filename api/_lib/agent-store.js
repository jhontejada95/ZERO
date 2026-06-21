import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { getDocumentClient } from "./dynamo.js";

const tableName = process.env.ZERO_TABLE_NAME;

export function agentRunItems(eventId, run) {
  const pk = `EVENT#${eventId}`;
  const summary = {
    PK: pk,
    SK: `AGENT#${run.runId}#SUMMARY`,
    entityType: "AGENT_RUN",
    runId: run.runId,
    status: run.status,
    mode: run.mode,
    network: run.network,
    programId: run.programId,
    receiptHash: run.receiptHash,
    settlement: run.settlement,
    token: run.token,
  };
  const milestones = run.timeline.map((milestone) => ({
    PK: pk,
    SK: `AGENT#${run.runId}#STEP#${String(milestone.index).padStart(2, "0")}`,
    entityType: "AGENT_MILESTONE",
    runId: run.runId,
    ...milestone,
  }));
  return [summary, ...milestones];
}

export async function persistAgentRun(eventId, run) {
  if (!tableName) throw new Error("ZERO_TABLE_NAME is not configured");
  const requests = agentRunItems(eventId, run).map((Item) => ({ PutRequest: { Item } }));
  await getDocumentClient().send(new BatchWriteCommand({ RequestItems: { [tableName]: requests } }));
  return { storage: "DYNAMODB", itemCount: requests.length };
}
