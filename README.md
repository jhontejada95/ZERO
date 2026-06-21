# ZERO

ZERO makes prevention visible, auditable, and financeable.

Today, institutions can count a disaster after it happens, but they struggle to prove the value of the tragedy that never occurred. ZERO combines verified observations with counterfactual estimation to issue a **Prevention Receipt**: a human-readable, auditable record of lives and losses protected by an intervention.

## Demo

The prototype tells one complete story: a riverside community receives an early warning, evacuates before a flood, and ZERO reconstructs the likely outcome without the intervention. The receipt connects the evidence, estimate, confidence band, beneficiary community, and released resilience payment.

Live production demo: [zero-plum-eta.vercel.app](https://zero-plum-eta.vercel.app)

Run locally:

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:4173/`.

## Why it can become a business

ZERO can be the verification layer for parametric insurance, climate-resilience bonds, disaster-response funding, humanitarian aid, and public-sector prevention programs. Buyers pay for auditable measurement, independent verification, portfolio monitoring, and outcome-linked settlement.

## Full-stack implementation

The React interface is backed by a Vercel Receipt API and a deliberate DynamoDB single-table model. One strongly consistent event query reconstructs the receipt, its versioned model run, and every evidence record. The API calculates an integrity proof which the browser independently verifies before displaying `Receipt verified`.

The local experience safely falls back to a sealed demonstration ledger when AWS is not configured. Production uses short-lived Vercel OIDC credentials to assume the read-only `zero-vercel-production` AWS role; no long-lived AWS access keys are stored in Vercel. A successful database response identifies itself as `DYNAMODB LIVE`, making the integration visible during judging.

ZERO now includes a settlement layer deployed on Base Sepolia:

- `ZERO Test Token`, a six-decimal ERC-20 with no real-world value, deployed at [`0xe554...1aab`](https://sepolia.basescan.org/address/0xe5546454f7Be4796d2CF65d5F0399501Dca21aab).
- `ZERO Settlement Escrow`, deployed at [`0x7f65...d3D6`](https://sepolia.basescan.org/address/0x7f6510C4cD6Edc5F59F49ccD5792258e13Bad3D6) and connected to native Base EAS.
- An EAS-gated escrow that rejects altered receipts, revoked attestations, unauthorized verifiers, and duplicate settlements.
- Program, treasury, procurement, evidence, verification, attestation, settlement, and audit agents.
- Automatic CDP EVM/smart-wallet creation when Coinbase credentials are configured.
- An OpenAI-compatible model adapter for DeepSeek or Groq.
- A clearly labelled local x402 simulation, ready to be replaced by a live facilitator.

Open `Trace settlement` to execute the agent run. Production uses five real CDP wallet addresses, while the current `2,400,000 ZERO` orchestration trace remains simulated and does not yet broadcast the final escrow settlement.

```bash
npm test
npm run build
npm run contracts:compile
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the data model, AWS provisioning steps, and deployment environment.
See [CHECKPOINT.md](./CHECKPOINT.md) for the verified implementation state and prioritized next work.
