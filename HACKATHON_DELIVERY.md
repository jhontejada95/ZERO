# ZERO — final hackathon delivery kit

## 90-second pitch

Prevention is one of humanity's biggest accounting failures. When a disaster happens, the loss is visible and money moves. When prevention works, the tragedy disappears — and so does the proof.

ZERO turns verified prevention into an auditable outcome. A field intervention becomes evidence. Evidence becomes a counterfactual claim. Agents organize the work, but they cannot move funds. Independent verification and human authorization bind the claim to a Prevention Receipt. Smart contracts then release value only when the exact on-chain conditions are satisfied.

In this MVP, La Bocana is the concrete case: 37 people protected, 127 evidence points, 94% confidence, and 2.4M ZERO released on Base Sepolia. The system includes a paid x402 evidence purchase, EAS attestation, EIP-712 human approval, escrow settlement, role-scoped stakeholder views and a public audit trail.

ZERO is monetizable as the verification and settlement layer for insurers, resilience funds, governments, humanitarian organizations and climate-finance portfolios. We are not selling a donation page. We are building infrastructure for making prevented harm legible, trustworthy and payable.

## Demo route

1. Open production: `https://zero-plum-eta.vercel.app`
2. Show the thesis: “Prevention is an outcome.”
3. Scroll to chapter 08 and explain proof flow vs capital flow.
4. Show architecture blueprint: agent proposes, human authorizes, contract settles, auditor reconstructs.
5. Click `Enter platform`.
6. Select `Fund Manager` in `/enter`.
7. Open `/app`; show role-scoped access.
8. Go to `Approvals`; show EIP-712, receipt hash, beneficiary, amount and canary settlement.
9. Go to `Evidence`; show x402 paid evidence.
10. Go to `Audit`; show reconstruction order and Base Sepolia txs.
11. Open `Trace settlement`; show confirmed on-chain agent timeline.

## What is real today

- Public Vercel deployment.
- DynamoDB receipt architecture with live production path when AWS env is configured.
- Base Sepolia ZERO test token.
- Base Sepolia settlement escrow.
- Base Sepolia approval escrow.
- Native Base Sepolia EAS integration.
- Confirmed x402 evidence payment in Base Sepolia USDC.
- Confirmed EAS attestation transaction.
- Confirmed escrow settlement transaction.
- Confirmed EIP-712 human authorization canary.
- Role-scoped stakeholder UI.
- Tests for contracts, receipt integrity, counterfactual, agent pipeline and DynamoDB reconstruction.

## Testnet proof links

- App: `https://zero-plum-eta.vercel.app`
- Token: `https://sepolia.basescan.org/address/0xe5546454f7Be4796d2CF65d5F0399501Dca21aab`
- Settlement escrow: `https://sepolia.basescan.org/address/0x7f6510C4cD6Edc5F59F49ccD5792258e13Bad3D6`
- Approval escrow: `https://sepolia.basescan.org/address/0x4E719831f1e81730499B5E7e8a1f4B8A6E865d2E`
- x402 payment: `https://sepolia.basescan.org/tx/0x5af11df3fa44a89a01d50caf0d65c6d16786a2eedec0712be112eed64f771ea9`
- EAS attestation: `https://sepolia.basescan.org/tx/0x8cefd61be25cd203d08fdfaa1c4a4f9adee10f3263e3b06ca84333504c642535`
- Escrow settlement: `https://sepolia.basescan.org/tx/0x346becdf17c0025f39acbf5353a406d26dcb2205d70d23e7683949e5b54b7f26`
- EIP-712 canary settlement: `https://sepolia.basescan.org/tx/0x15bec10706faa00d891f78467fb2c37d9feed745edd6b5e0c4849a10515c4d36`

## Judge framing

ZERO is novel because it changes the unit of finance: from damage after the fact to verified prevention before tragedy. The product is not merely a dashboard; it is a protocol for evidence, authorization, settlement and auditability.
