# ZERO — Devpost final fields

## Existing project disclosure

Not applicable. ZERO was designed and built during the hackathon submission period. We started with the prevention-finance thesis and implemented the role-scoped product, Vercel deployment, DynamoDB persistence, Coinbase Developer Platform wallet integration, x402 evidence payment, Base Sepolia contracts, EAS attestation, EIP-712 human authorization, automated tests and public audit trail during this period.

## Testing instructions for judges

1. Open `https://zero-plum-eta.vercel.app` and review the protocol narrative.
2. Select **Enter the platform**, or open `https://zero-plum-eta.vercel.app/enter` directly.
3. Choose any reference stakeholder identity. The testnet email and passcode are displayed on screen; no private account is required.
4. Recommended funder flow: choose **Fund Manager**, open **Approvals**, and inspect the EIP-712 authorization packet and Base Sepolia canary transaction.
5. Recommended evidence flow: return to `/enter`, choose **Independent Verifier**, open **Evidence**, and inspect the confirmed x402 USDC evidence payment.
6. Recommended audit flow: return to `/enter`, choose **Public Auditor**, open **Audit**, and follow the contract, EAS attestation, approval and settlement links on BaseScan.
7. The confirmed agent-proof endpoint is `https://zero-plum-eta.vercel.app/api/agent-demo`. It returns `COMPLETED_ONCHAIN` and `CONFIRMED_TESTNET_REFERENCE` with the reconstructed Base Sepolia timeline.
8. All blockchain activity uses Base Sepolia testnet. Judges do not need a wallet and should not send funds.

## Track

Monetizable B2B app

## Published Vercel link

`https://zero-plum-eta.vercel.app`

## Vercel Team ID

`team_6TDLddJLNjizt9eMo9fpE9cD`

## Database

Amazon DynamoDB

## Required uploads

- Architecture diagram: `zero-architecture.png`
- AWS database proof: `aws-dynamodb-proof.png`. It shows table `zero-events` in `us-east-2`, Active status, PK/SK schema, on-demand capacity and 28 persisted items.

## Optional bonus-content field

Leave blank unless a public post or video was created specifically for this hackathon. The public content must explicitly say: **This project and content were created for the H0 Hackathon. #H0Hackathon** Then paste the public post URL into the field.

## Additional judge file

Upload `ZERO_JUDGE_PACKET.zip` if desired. It contains the architecture and compact visual technology proof; the public repository remains the authoritative source.
