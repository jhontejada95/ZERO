import { configuredTableName } from "./_lib/dynamo.js";

export default function handler(_request, response) {
  return response.status(configuredTableName() ? 200 : 503).json({
    service: "ZERO Receipt API",
    database: "DynamoDB",
    configured: Boolean(configuredTableName()),
  });
}

