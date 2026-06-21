# ZERO checkpoint — 2026-06-20

This document is the restart point for the next development session.

## Product thesis

ZERO makes prevention visible, auditable, and financeable. It issues a Prevention Receipt that combines evidence, counterfactual estimation, verification, human-readable impact, and outcome-linked settlement for disasters that were prevented rather than merely counted afterward.

## Working production system

- Live application: https://zero-plum-eta.vercel.app
- React/Vite receipt experience deployed on Vercel.
- DynamoDB single-table receipt storage in `us-east-2`.
- Vercel-to-AWS OIDC role: `zero-vercel-production`; no AWS static keys in Vercel.
- Agent runs persist one summary plus nine immutable milestones in DynamoDB.
- Coinbase CDP creates and reuses real EOA and smart-wallet addresses for program, treasury, procurement, verifier, and beneficiary agents.
- The deterministic agent pipeline completes in CDP mode; x402 purchasing, attestation issuance, and settlement hashes are still simulated at the orchestration layer.
- Fourteen automated tests pass, including escrow authorization, altered-receipt rejection, revoked-attestation rejection, double-settlement prevention, counterfactual determinism, and DynamoDB receipt reconstruction.

## Base Sepolia deployment

The public deployment manifest is [`deployments/base-sepolia.json`](./deployments/base-sepolia.json).

- ZERO Test Token: `0xe5546454f7Be4796d2CF65d5F0399501Dca21aab`
- ZERO Settlement Escrow: `0x7f6510C4cD6Edc5F59F49ccD5792258e13Bad3D6`
- Native Base EAS: `0x4200000000000000000000000000000000000021`
- Schema UID: `0x1097b2cc70edfec6b92d7affc0b5a72cab554c0f45345a150218858d01417734`
- Treasury smart wallet: `0x0834dE5d9bF523db274C77874ad3B1C4ec0e614C`
- Verifier EOA: `0x6bFAcC1f21E06843A189b540520614F9abfccd94`
- Supply: `100,000,000 ZERO`, six decimals, explicitly testnet-only and without real-world value.

On-chain verification completed successfully:

- Token and escrow bytecode exist.
- Treasury owns the full initial supply.
- Escrow references the deployed token, native Base EAS, and the correct schema UID.
- Verifier EOA holds `VERIFIER_ROLE`.

## Security posture

- Coinbase credentials and Wallet Secret exist only as Vercel Sensitive environment variables.
- The contract deployer key was exported only into an ephemeral protected server function because CDP contract-creation signing was unavailable through `sendTransaction`; it was never printed or persisted.
- The temporary deploy endpoint and `ZERO_DEPLOY_KEY` are removed at this checkpoint.
- `.env*`, `.vercel`, logs, dependencies, build output, and local caches are excluded from Git.
- The ZERO token is a testnet demonstration asset, not money, a stablecoin, or a claim on fiat.

## Next priorities

1. Replace orchestration-layer settlement hashes with real Base Sepolia transactions.
2. Implement treasury smart-account approval and fund the escrow with `2,400,000 ZERO`.
3. Create a real EAS attestation from the verifier EOA and execute `settle` end to end.
4. Add explicit human approval/signature before attestation and settlement.
5. Replace the local x402 simulator with a live testnet facilitator and paid evidence endpoint.
6. Connect DeepSeek or Groq for live verification narratives; fallback remains deterministic.
7. Surface contract addresses, explorer links, wallet roles, and transaction status in the UI.
8. Verify and publish Solidity source code on BaseScan.
9. Add policy limits, rate limiting, replay protection at the API layer, and operational monitoring.
10. Produce the Devpost submission, architecture graphic, demo script, and judge-facing evidence.

## Restart commands

```bash
npm install
npm test
npm run build
npm run contracts:compile
npm run dev
```

No secret is required for local simulation. Live CDP and AWS behavior requires the Vercel environment configured for the production project.
