# ZERO — Medium image placement guide

## Cover image

Use the custom 3:2 ZERO thumbnail created for Devpost. If it is unavailable, use `../final/01-landing-hero.png` and remove the first repeated body image.

Cover caption: **ZERO — Prevention is an outcome.**

## Image 1 — Opening thesis

Place after the paragraph ending: **“That paradox became the starting point for ZERO.”**

File: `../final/01-landing-hero.png`

Caption: **ZERO reframes prevention as a verifiable and financeable outcome.**

Alt text: **ZERO landing page presenting the statement Prevention is an outcome.**

## Image 2 — Prevention Receipt and coordinated flows

Place immediately after the section **“The Prevention Receipt”**, following the numbered list of its eight components.

File: `../final/02-section-8-proof-capital-flow.png`

Caption: **ZERO separates the proof flow from the capital flow, connecting both through a Prevention Receipt.**

Alt text: **Diagram showing evidence becoming a Prevention Receipt and committed capital becoming an onchain settlement.**

## Image 3 — Architecture

Place after this sentence in **“Two coordinated flows”**: **“Agent proposes. Human authorizes. Contract settles. Auditor reconstructs.”**

File: `zero-architecture.png`

Caption: **ZERO’s architecture preserves separation between evidence, human authority, settlement and public audit.**

Alt text: **ZERO architecture diagram connecting stakeholders, Vercel, DynamoDB, CDP wallets, x402, EAS and Base Sepolia contracts.**

## Image 4 — Stakeholder separation

Place after introducing the five roles in **“Five stakeholders, five different products.”**

File: `../final/03-stakeholder-access.png`

Caption: **Every stakeholder enters through a role-scoped identity with explicit permissions.**

Alt text: **ZERO stakeholder gateway for fund managers, operators, verifiers, communities and public auditors.**

Optional: create a Medium carousel immediately after this image with files `08-role-fund-manager.png` through `12-role-public-auditor.png`. Do not insert all five as full-width images because it makes the article unnecessarily long.

## Image 5 — Deployed contracts

Place in **“A functional testnet implementation”**, after listing the deployed blockchain boundary.

File: `../final/13-proof-deployed-contracts.png`

Caption: **ZERO token, settlement escrow and approval escrow deployed independently on Base Sepolia.**

Alt text: **BaseScan proof of ZERO’s three deployed Base Sepolia contracts.**

## Image 6 — Confirmed transactions

Place directly after Image 5 and the paragraph explaining x402, EAS and EIP-712.

File: `../final/14-proof-onchain-transactions.png`

Caption: **Confirmed x402 payment, EAS attestation, EIP-712 authorization canary and escrow settlement.**

Alt text: **Four successful Base Sepolia transactions forming ZERO’s prevention settlement chain.**

## Optional final image

Place before **“What we learned”** only if the article needs a stronger technical close.

File: `../final/15-proof-functional-stack.png`

Caption: **One reconstructable execution stack across CDP wallets, x402, DynamoDB, Vercel, EAS and EIP-712.**

## Recommended total

- 1 cover image.
- 6 body images.
- 1 optional final technology image.
- Avoid uploading the DynamoDB console screenshot to Medium; reserve it for the private Devpost database-proof field.
