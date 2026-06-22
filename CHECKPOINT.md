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
- Coinbase CDP creates and reuses six real EOA and smart-wallet addresses for program, treasury, procurement, evidence provider, verifier, and beneficiary agents.
- The deterministic agent pipeline completes in CDP mode. Reference EAS/escrow settlement, EIP-712 human authorization, and the x402 USDC evidence purchase are real on Base Sepolia.
- Sixteen automated tests pass, including human signature authorization, expiry and mutation rejection, replay prevention, altered-receipt rejection, revoked-attestation rejection, counterfactual determinism, and DynamoDB reconstruction.

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

## Verified human authorization

- Approval escrow: `0x4E719831f1e81730499B5E7e8a1f4B8A6E865d2E`.
- Authorized human approver: `0x5d8B442bfe432C06328Afc2a4E4b9Bb609301bB5`.
- EIP-712 binds program, attestation, beneficiary, amount, receipt hash, nonce, deadline, chain, and escrow address.
- A `1 ZERO` safety canary was used to validate authorization without paying the historical prevention receipt twice.
- [Funding](https://sepolia.basescan.org/tx/0x1dad6318419c09d9f27014160ee38712c5babe7563a68e7cebf12d37aa68f477), [attestation](https://sepolia.basescan.org/tx/0xa0689d79a5e8a7f370432a95e522c914c98212ce14c96f43df4274e29f251ba5), and [human-approved settlement](https://sepolia.basescan.org/tx/0x15bec10706faa00d891f78467fb2c37d9feed745edd6b5e0c4849a10515c4d36).
- Independent reads confirmed program status `3`, approval nonce `1`, authorized approver role, matching attestation UID, beneficiary balance increase of `1 ZERO`, and zero escrow balance.

## Verified x402 evidence purchase

- Protocol: x402 v2 on Base Sepolia (`eip155:84532`).
- Paid resource: `/api/climate-risk`; an unauthenticated request returns HTTP `402` with a machine-readable payment requirement.
- Procurement payer: `0x4ce18f7303CF69844bf8e1E6F83a220e64875F73`.
- Independent evidence provider: `0x96Df7fa9aC0f4dd1A6a493Df7743e0f3E816E334`.
- Payment: exactly `0.001 USDC` (`1000` base units), [confirmed on BaseScan](https://sepolia.basescan.org/tx/0x5af11df3fa44a89a01d50caf0d65c6d16786a2eedec0712be112eed64f771ea9).
- CDP signs the EIP-3009 authorization; the x402 facilitator verifies and settles it without exposing a private key.
- Independent RPC reads confirmed receipt status `1`, the USDC contract, sender, recipient, and exact transfer amount.

## Security posture

- Coinbase credentials and Wallet Secret exist only as Vercel Sensitive environment variables.
- The contract deployer key was exported only into an ephemeral protected server function because CDP contract-creation signing was unavailable through `sendTransaction`; it was never printed or persisted.
- The temporary deploy endpoint and `ZERO_DEPLOY_KEY` are removed at this checkpoint.
- The temporary settlement endpoint and `ZERO_SETTLEMENT_KEY` were also removed after execution; production returns `404` for that route.
- Temporary human-approval deployment/preparation endpoints and keys were removed after use; only the signature-verifying public API remains.
- `.env*`, `.vercel`, logs, dependencies, build output, and local caches are excluded from Git.
- The ZERO token is a testnet demonstration asset, not money, a stablecoin, or a claim on fiat.

## Next priorities

1. Separate the product into role-specific journeys and permissions for funders, operators, verifiers, beneficiaries, and auditors.
2. Connect the complete UI agent trace to persisted real settlements and explorer links.
3. Connect DeepSeek or Groq for live verification narratives; fallback remains deterministic.
4. Verify and publish Solidity source code on BaseScan.
5. Add policy limits, rate limiting, operational monitoring, and a production approval policy/multisig.
6. Produce the Devpost submission, architecture graphic, demo script, and judge-facing evidence.

## Restart commands

```bash
npm install
npm test
npm run build
npm run contracts:compile
npm run dev
```

No secret is required for the local fallback. Live CDP, x402, and AWS behavior requires the Vercel environment configured for the production project.
