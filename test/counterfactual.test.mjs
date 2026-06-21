import test from "node:test";
import assert from "node:assert/strict";
import { runSyntheticControl } from "../shared/counterfactual.mjs";

const donors = [
  { outcomeWithoutIntervention: 30, weight: 0.5 },
  { outcomeWithoutIntervention: 40, weight: 0.3 },
  { outcomeWithoutIntervention: 50, weight: 0.2 },
];

test("synthetic control is deterministic and records its checks", () => {
  const result = runSyntheticControl({ donors, protectedPeople: 28 });
  assert.equal(result.estimatedAtRisk, 37);
  assert.equal(result.donorCount, 3);
  assert.equal(result.confidence, 0.94);
  assert.deepEqual(result.checks, ["placebo", "leave-one-out", "pre-period-fit"]);
});

test("synthetic control rejects invalid donor weights", () => {
  assert.throws(
    () => runSyntheticControl({ donors: donors.map((donor) => ({ ...donor, weight: 0.2 })), protectedPeople: 28 }),
    /sum to one/,
  );
});

