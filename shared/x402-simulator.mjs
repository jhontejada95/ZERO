import { createHash } from "node:crypto";

function hash(value) {
  return `0x${createHash("sha256").update(value).digest("hex")}`;
}

/// Local adapter that models the x402 challenge/payment/resource exchange.
/// It is deliberately labelled SIMULATED until a facilitator and CDP wallet are connected.
export class LocalX402Adapter {
  async purchase({ resource, payer, amount, token = "ZERO" }) {
    const quoteId = hash(`QUOTE:${resource}:${amount}:${token}`);
    const paymentTx = hash(`PAYMENT:${quoteId}:${payer.address}`);
    return {
      protocol: "x402-simulation",
      challenge: { status: 402, resource, amount, token, quoteId },
      payment: { payer: payer.address, transactionHash: paymentTx, status: "CONFIRMED" },
      resource: {
        sensorId: "RIV-01",
        observedAt: "2024-05-18T13:55:00.000Z",
        riverLevelMeters: 6.82,
        evacuationThresholdMeters: 5.4,
        observationCount: 48,
        provider: "La Bocana Open Sensor Network",
      },
    };
  }
}
