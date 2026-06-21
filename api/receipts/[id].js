import { getEventAggregate } from "../_lib/dynamo.js";
import { assembleReceipt } from "../_lib/receipt.js";

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  const receiptId = request.query.id;
  const eventId = request.query.eventId || process.env.ZERO_DEMO_EVENT_ID;
  if (!eventId) return response.status(400).json({ error: "EVENT_ID_REQUIRED" });

  try {
    const receipt = assembleReceipt(await getEventAggregate(eventId));
    if (!receipt || receipt.receiptId !== receiptId) return response.status(404).json({ error: "RECEIPT_NOT_FOUND" });
    response.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=300");
    return response.status(200).json(receipt);
  } catch (error) {
    return response.status(503).json({ error: "RECEIPT_BACKEND_UNAVAILABLE", message: error.message });
  }
}

