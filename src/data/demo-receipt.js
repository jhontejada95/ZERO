import { runSyntheticControl } from "../../shared/counterfactual.mjs";

const donors = [
  { community: "Delta Norte", outcomeWithoutIntervention: 37, weight: 0.22 },
  { community: "Puerto Claro", outcomeWithoutIntervention: 39, weight: 0.18 },
  { community: "San Isidro", outcomeWithoutIntervention: 41, weight: 0.17 },
  { community: "Bahía Verde", outcomeWithoutIntervention: 43, weight: 0.16 },
  { community: "Nueva Esperanza", outcomeWithoutIntervention: 44, weight: 0.15 },
  { community: "Río Abajo", outcomeWithoutIntervention: 46, weight: 0.12 },
];

export const demoReceipt = {
  receiptId: "ZR-2024-05-18-000743",
  eventId: "EVT-LABOCANA-2024-0518",
  issuedAt: "2024-05-18T14:32:00.000Z",
  status: "FINAL",
  intervention: "Early warning and evacuation",
  observedOutcome: { peopleProtected: 37 },
  counterfactual: { low: 37, high: 46, unit: "lives at risk" },
  confidence: 0.94,
  evidenceCount: 127,
  beneficiary: { community: "Riverside District", location: "La Bocana, Colombia" },
  payment: { amount: 2400000, currency: "USD", status: "RELEASED" },
  model: runSyntheticControl({ donors, protectedPeople: 37 }),
  evidence: [
    { source: "RIV-01", name: "River sensor network", detail: "48 hourly observations", hash: "sha256:83e91b" },
    { source: "EVAC-07", name: "Evacuation registry", detail: "37 verified departures", hash: "sha256:2db610" },
    { source: "MOD-05", name: "Synthetic control", detail: "6 matched communities", hash: "sha256:ab981f" },
    { source: "AUD-02", name: "Independent audit", detail: "Assumptions reviewed", hash: "sha256:94ac77" },
  ],
  verifiedBy: "ZERO Verification Network",
  storage: "TESTNET_REFERENCE",
};
