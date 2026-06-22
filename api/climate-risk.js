import { CdpClient } from "@coinbase/cdp-sdk";
import { HTTPFacilitatorClient, x402HTTPResourceServer, x402ResourceServer } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";

const NETWORK = "eip155:84532";
const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || "https://x402.org/facilitator";

let serverPromise;

async function evidenceProviderAddress() {
  const cdp = new CdpClient();
  const account = await cdp.evm.getOrCreateAccount({ name: "zero-evidence-provider-owner" });
  return account.address;
}

async function resourceServer() {
  if (!serverPromise) {
    serverPromise = (async () => {
      const facilitator = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
      const core = new x402ResourceServer(facilitator).register(NETWORK, new ExactEvmScheme());
      await core.initialize();
      return new x402HTTPResourceServer(core, {
        "GET /api/climate-risk": {
          accepts: { scheme: "exact", price: "$0.001", network: NETWORK, payTo: evidenceProviderAddress },
          description: "Independent La Bocana river-risk observation",
          mimeType: "application/json",
          unpaidResponseBody: async () => ({
            contentType: "application/json",
            body: { error: "Payment required", protocol: "x402", network: NETWORK },
          }),
        },
      });
    })();
  }
  return serverPromise;
}

function adapter(request) {
  return {
    getHeader: name => {
      const value = request.headers[name.toLowerCase()];
      return Array.isArray(value) ? value[0] : value;
    },
    getMethod: () => request.method,
    getPath: () => "/api/climate-risk",
    getUrl: () => `https://${request.headers.host || "zero-plum-eta.vercel.app"}/api/climate-risk`,
    getAcceptHeader: () => request.headers.accept || "application/json",
    getUserAgent: () => request.headers["user-agent"] || "ZERO agent",
  };
}

function sendInstructions(response, instructions) {
  for (const [name, value] of Object.entries(instructions.headers || {})) response.setHeader(name, value);
  return response.status(instructions.status).send(instructions.body);
}

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed" });
  response.setHeader("Cache-Control", "no-store");
  try {
    const server = await resourceServer();
    const context = { adapter: adapter(request), path: "/api/climate-risk", method: "GET" };
    const result = await server.processHTTPRequest(context);
    if (result.type === "payment-error") return sendInstructions(response, result.response);

    const resource = {
      sensorId: "RIV-01",
      observedAt: "2024-05-18T13:55:00.000Z",
      riverLevelMeters: 6.82,
      evacuationThresholdMeters: 5.4,
      observationCount: 48,
      provider: "La Bocana Independent Sensor Cooperative",
      provenance: "x402-paid",
    };
    const settlement = await server.processSettlement(
      result.paymentPayload,
      result.paymentRequirements,
      result.declaredExtensions,
    );
    if (!settlement.success) return sendInstructions(response, settlement.response);
    for (const [name, value] of Object.entries(settlement.headers || {})) response.setHeader(name, value);
    return response.status(200).json(resource);
  } catch (error) {
    console.error("x402 resource failure", error?.message);
    return response.status(502).json({ error: "x402 resource unavailable", detail: error?.message });
  }
}
