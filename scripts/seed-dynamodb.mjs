import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { demoReceipt } from "../src/data/demo-receipt.js";

const tableName = process.env.ZERO_TABLE_NAME;
if (!tableName) throw new Error("Set ZERO_TABLE_NAME before seeding DynamoDB");

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" }));
const PK = `EVENT#${demoReceipt.eventId}`;
const receiptPayload = Object.fromEntries(Object.entries(demoReceipt).filter(([key]) => !["model", "evidence", "storage"].includes(key)));
const items = [
  { PK, SK: `RECEIPT#${demoReceipt.receiptId}`, entityType: "RECEIPT", payload: receiptPayload },
  { PK, SK: "MODEL#synthetic-control-v1", entityType: "MODEL_RUN", payload: demoReceipt.model },
  ...demoReceipt.evidence.map((item) => ({ PK, SK: `EVIDENCE#${item.source}`, entityType: "EVIDENCE", ...item })),
];

await client.send(new BatchWriteCommand({
  RequestItems: { [tableName]: items.map((Item) => ({ PutRequest: { Item } })) },
}));
console.log(`Seeded ${items.length} ZERO records into ${tableName}`);

