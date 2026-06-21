import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";

const tableName = process.env.ZERO_TABLE_NAME;
let documentClient;

export function getDocumentClient() {
  if (!tableName) throw new Error("ZERO_TABLE_NAME is not configured");
  if (!documentClient) {
    const roleArn = process.env.AWS_ROLE_ARN;
    documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-2",
      ...(roleArn ? { credentials: awsCredentialsProvider({ roleArn }) } : {}),
    }), {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return documentClient;
}

export async function getEventAggregate(eventId) {
  const result = await getDocumentClient().send(new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: { ":pk": `EVENT#${eventId}` },
    ConsistentRead: true,
  }));
  return result.Items || [];
}

export function configuredTableName() {
  return tableName || null;
}
