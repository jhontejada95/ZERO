# ZERO checkpoint — 2026-06-21

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
- The deterministic agent pipeline completes in CDP mode. A reference EAS attestation and escrow settlement are real on Base Sepolia; the UI trace, x402 purchasing, and human approval are still simulated at the orchestration layer.
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

## Verified reference settlement

- Status: `SETTLED`; escrow program status `3`.
- Program ID: `0x492df59c1297d0da4351a017a982a08e0c26419ceddea3defddc61fdcb891ed4`.
- Receipt hash: `0x2283de8e774b989c84268bce1aa3a4938d42468d309e3daf0dd0617173ea8598`.
- EAS attestation UID: `0x586c4e3b19e204ce09eace285a1881bd318d9cf816b297b0989981510653aa72`.
- Beneficiary: `0xe5C43B4AC4147f8Aab8A161E4259252618d7102b`.
- Payment: `2,400,000 ZERO`; beneficiary balance matches, treasury retains `97,600,000 ZERO`, and escrow balance is zero.
- [Funding transaction](https://sepolia.basescan.org/tx/0x8a8d2dadd6f681418a54da97518bfa12c9a86a34007c05626b74a9e57b6f3180), [EAS attestation](https://sepolia.basescan.org/tx/0x8cefd61be25cd203d08fdfaa1c4a4f9adee10f3263e3b06ca84333504c642535), and [settlement](https://sepolia.basescan.org/tx/0x346becdf17c0025f39acbf5353a406d26dcb2205d70d23e7683949e5b54b7f26).
- Independent RPC reads confirmed the program fields, schema, attester, recipient, encoded amount/token, consumed attestation, and all three token balances.
- Approval mode was `SIMULATED`; this transaction proves the wallet/EAS/escrow rail, not yet a human authorization workflow.

## Security posture

- Coinbase credentials and Wallet Secret exist only as Vercel Sensitive environment variables.
- The contract deployer key was exported only into an ephemeral protected server function because CDP contract-creation signing was unavailable through `sendTransaction`; it was never printed or persisted.
- The temporary deploy endpoint and `ZERO_DEPLOY_KEY` are removed at this checkpoint.
- The temporary settlement endpoint and `ZERO_SETTLEMENT_KEY` were also removed after execution; production returns `404` for that route.
- `.env*`, `.vercel`, logs, dependencies, build output, and local caches are excluded from Git.
- The ZERO token is a testnet demonstration asset, not money, a stablecoin, or a claim on fiat.

## Next priorities

1. Add explicit human approval/signature before attestation and settlement.
2. Connect the UI agent trace to the persisted real settlement and explorer links.
3. Replace the local x402 simulator with a live testnet facilitator and paid evidence endpoint.
4. Connect DeepSeek or Groq for live verification narratives; fallback remains deterministic.
5. Verify and publish Solidity source code on BaseScan.
6. Add policy limits, rate limiting, replay protection at the API layer, and operational monitoring.
7. Produce the Devpost submission, architecture graphic, demo script, and judge-facing evidence.

## Restart commands

```bash
npm install
npm test
npm run build
npm run contracts:compile
npm run dev
```

No secret is required for local simulation. Live CDP and AWS behavior requires the Vercel environment configured for the production project.
