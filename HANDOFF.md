# ZERO — AI handoff and continuation brief

Last updated: 2026-06-23, America/Bogota.

This file is the operational handoff for any AI or human continuing ZERO. Update it at the end of every meaningful task before committing/pushing.

## Project essence

ZERO is a hackathon MVP for a prevention-finance protocol. Its thesis:

> Prevention is an outcome. If an avoided tragedy can be evidenced, attributed, approved and settled, it can become fundable.

ZERO converts verified prevention into a `Prevention Receipt`: an auditable artifact that links evidence, scientific confidence, human authorization, agent orchestration and conditional settlement.

The project must feel ambitious, humane, serious and monetizable. The intended emotional frame is not “crypto dashboard” or “AI toy”; it is “humanity-scale public infrastructure for paying for avoided harm.”

## User direction and taste

The user wants:

- A transcendent, humanity-scale product.
- A serious narrative that explains ZERO from the essence of the protocol, not only from examples.
- Beautiful but credible product design.
- Clear separation between stakeholders and role-specific flows. The user explicitly disliked that the current Command Center exposes too much to everyone.
- Blockchain/testnet use for traceability and payments.
- Agentic infrastructure where agents can propose, coordinate and prepare actions, but humans/contracts authorize fund movement.
- Frequent GitHub checkpoints.
- This handoff file updated after every new task because credits/context may run out.

Communication style:

- Spanish.
- Direct, warm, decisive.
- Explain blockers plainly.
- Keep moving when safe.

## Current repository state

Workspace:

`C:\Users\HP\Desktop\Hacks\HACKS JUNIO\zero`

Remote:

`https://github.com/jhontejada95/ZERO.git`

Current branch at the time of this handoff:

`codex/protocol-landing`

Latest local/remote commit:

`6a30e4e build protocol landing`

Open PR:

`https://github.com/jhontejada95/ZERO/pull/1`

PR status:

- Draft PR.
- Base: `main`.
- Head: `codex/protocol-landing`.
- Includes the public protocol landing and QA artifacts.

Important note: this branch is not merged into `main` yet at the time of this handoff.

## What has been built

### Public landing

Route: `/`

Implemented in:

- `src/Landing.jsx`
- `src/styles.css`
- `src/App.jsx`

Purpose:

- Explain ZERO as a protocol.
- Explain the problem, solution, actors, trust boundaries, architecture, traceability, business model and future applications.
- Give judges/funders a clear narrative before entering the product.

Landing structure:

1. Protocol essence: “PREVENTION IS AN OUTCOME.”
2. Universal evidence paradox.
3. Inputs.
4. ZERO transformation.
5. Prevention Receipt output.
6. What ZERO is / is not.
7. Stakeholders and responsibilities.
8. Proof flow and capital flow.
9. Trust model: “Agents may propose. Only humans and contracts authorize.”
10. La Bocana example.
11. Architecture intro.
12. Stakeholder/product layer.
13. Agent orchestration layer.
14. Scientific/data layer.
15. Settlement/trust layer.
16. Traceability/live proof.
17. Business model.
18. Future applications.
19. Final manifesto.

Button behavior:

- `Enter platform` goes to `/app`.

### Command Center

Route: `/app`

Implemented primarily in:

- `src/App.jsx`
- `src/styles.css`
- `src/data/*`
- `api/*`
- `shared/*`

Current limitation:

- It looks polished, but it still behaves too much like a unified demo surface. The next product task is to separate stakeholder-specific flows and permissions into a believable product.

### Blockchain / trust infrastructure already referenced in the app

Network:

- Base Sepolia / Sepolia testnet context.

Known deployed/testnet items from prior work:

- ZERO Test Token: `0xe5546454f7Be4796d2CF65d5F0399501Dca21aab`
- ZERO Settlement Escrow: `0x7f6510C4cD6Edc5F59F49ccD5792258e13Bad3D6`
- Approval escrow: `0x4E719831f1e81730499B5E7e8a1f4B8A6E865d2E`
- Base Sepolia EAS: `0x4200000000000000000000000000000000000021`
- Human approver wallet: `0x5d8B442bfe432C06328Afc2a4E4b9Bb609301bB5`
- Human EIP-712 safety canary tx: `0x15bec10706faa00d891f78467fb2c37d9feed745edd6b5e0c4849a10515c4d36`
- x402 evidence purchase tx: `0x5af11df3fa44a89a01d50caf0d65c6d16786a2eedec0712be112eed64f771ea9`
- USDC Base Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

Do not put private keys, API secrets or wallet secrets in this file.

### Environment variables

The user has configured sensitive variables in Vercel. Names known:

- `CDP_API_KEY_ID`
- `CDP_API_KEY_SECRET`
- `CDP_WALLET_SECRET`
- `ZERO_DEMO_EVENT_ID`
- `ZERO_TABLE_NAME`
- `AWS_ROLE_ARN`
- `AWS_REGION`

Local `.env.example` includes placeholders only. Never commit real secret values.

## Validation already run

For commit `6a30e4e`:

- `npm run build` passed.
- `npm test` passed: 16/16 tests.
- Browser QA verified:
  - `/` renders the landing.
  - `/app` renders the Command Center.
  - `Enter platform` navigates to `/app`.
  - Mobile landing is usable.
  - Architecture accordion works.
  - Horizontal overflow was fixed.

Known harmless test warning:

- Ganache/µWS warning on Windows. Tests fall back to NodeJS implementation and still pass.

QA artifacts:

- `design-qa.md`
- `docs/landing-reference.png`
- `docs/landing-implementation.png`
- `docs/landing-bottom-implementation.png`
- `docs/landing-mobile-implementation.png`
- `docs/landing-qa-comparison.html`
- `docs/landing-qa-comparison.png`

## Stakeholders that should be separated in product UX

The next major product design/build should separate these roles:

1. Funders / insurers
   - Fund prevention programs.
   - See portfolio risk, expected avoided loss, evidence quality, release conditions and settlement receipts.
   - Should not edit field evidence.

2. Program operators / implementers
   - Manage field interventions.
   - Upload/coordinate evidence.
   - See tasks, milestones, community protection status and verification requests.
   - Should not release funds.

3. Evidence providers
   - Sensors, satellite data, local reports, NGOs, field teams.
   - Provide attestable evidence packets.
   - Should not authorize outcomes.

4. Verification agents
   - Analyze, cross-check and propose confidence.
   - Should expose reasoning, inputs and uncertainty.
   - Should not move money.

5. Independent verifiers / auditors
   - Review receipt, evidence chain, model confidence and settlement.
   - Need read-only audit trails.

6. Authorized humans
   - Sign EIP-712 approval or explicit human authorization.
   - Approve/reject agent-prepared release.
   - Must be clearly accountable.

7. Smart contracts / settlement layer
   - Hold/release funds based on valid receipt, attestation and authorization.
   - Provide on-chain traceability.

8. Communities / beneficiaries
   - Should see what was done, what was protected and why funds were released.
   - Should not see internal funder controls.

9. Public observers / judges
   - Need a clean public audit view and landing.

## Product UX next move

Priority: make ZERO feel like a real multi-stakeholder platform.

Progress update:

- Added a first role-separated product layer in `src/App.jsx`.
- Each demo role now has a distinct product surface, thesis, allowed actions and forbidden actions.
- Portfolio now shows a role-specific workspace brief before shared program data.
- Placeholder pages now inherit the active role context instead of showing generic copy.
- Action queue now explains why non-funder roles cannot authorize fund movement.
- Added `/enter` as an intermediate demo-login/stakeholder selection route between the landing and `/app`.
- Removed the mutable role selector from the app sidebar; `/app` now reads the selected role from `?role=` or `localStorage`.
- Landing CTAs now point to `/enter` instead of directly to `/app`.
- Reworked landing chapter 08 from a cramped inline diagram into two readable rails: proof flow and capital flow.

Recommended next implementation:

1. Preserve `/` landing.
2. Preserve `/app` as authenticated/product area.
3. Add role-aware product surfaces under `/app`:
   - `/app/funder`
   - `/app/operator`
   - `/app/verifier`
   - `/app/auditor`
   - optionally `/app/community`
4. Replace generic section placeholders with role-specific screens:
   - Funders see portfolio, capital commitments, release queue and receipts.
   - Operators see program execution, evidence tasks and field timeline.
   - Verifiers see evidence review, confidence scoring and agent run details.
   - Auditors see immutable trace, hashes, attestations, tx links and receipt reconstruction.
   - Community sees human-readable prevention status and released support.
5. Keep “agent proposes, human approves, contract settles” as the central interaction.

If time is short, implement this as front-end role routing with credible static/demo data. It is better for the hackathon to feel product-real than to overbuild backend depth now.

## Business model narrative

ZERO can monetize through:

- Protocol fee on successful prevention settlements.
- Verification and audit SaaS for insurers, donors, governments and resilience funds.
- Outcome marketplace where funders subscribe to prevention programs.
- Data/evidence APIs for auditors and underwriters.
- Enterprise deployments for climate adaptation, public health, logistics resilience and humanitarian finance.

Important framing:

- ZERO is not a charity donation page.
- ZERO is not just a prediction model.
- ZERO is not an agent that moves money autonomously.
- ZERO is infrastructure for making prevented harm legible, verifiable and payable.

## Commands

Install dependencies:

```powershell
npm install
```

Run dev:

```powershell
npm run dev
```

Build:

```powershell
npm run build
```

Test:

```powershell
npm test
```

Check git:

```powershell
git status -sb
```

Push current branch:

```powershell
git push -u origin <branch-name>
```

## GitHub workflow preference

The user likes frequent GitHub updates.

Recommended workflow:

1. Update this `HANDOFF.md`.
2. Run relevant checks.
3. Commit task changes.
4. Push branch.
5. If not on `main`, open/update PR.

At the moment, GitHub app/connector can create PRs. Local `git push` worked successfully.

## Vercel / deployment

Known production URL from earlier:

`https://zero-plum-eta.vercel.app`

Latest production deployment performed from branch `codex/protocol-landing`:

- Deployment URL: `https://zero-kyim8zfb4-jhontejada95s-projects.vercel.app`
- Production alias: `https://zero-plum-eta.vercel.app`
- Vercel status: Ready.
- `/` returned 200 after deploy.
- `/app` initially returned Vercel `NOT_FOUND`; fix added in `vercel.json` with rewrites for `/app` and `/app/:path*` to `/`.
- Second deployment after routing fix: `https://zero-3armd1bkx-jhontejada95s-projects.vercel.app`
- Production alias after second deploy: `https://zero-plum-eta.vercel.app`
- Verified after second deploy: `/` returns 200 and `/app` returns 200.
- Third deployment after role-separated workspace update: `https://zero-keed7y279-jhontejada95s-projects.vercel.app`
- Production alias after third deploy: `https://zero-plum-eta.vercel.app`
- Verified after third deploy: `/app` returns 200 and production JS bundle contains `Capital release desk`, confirming the role-separated UI is live.
- Fourth deployment after stakeholder gateway and chapter 08 fix: `https://zero-ps7epo407-jhontejada95s-projects.vercel.app`
- Production alias after fourth deploy: `https://zero-plum-eta.vercel.app`
- Verified after fourth deploy: `/`, `/enter`, and `/app?role=funder` return 200. Production JS bundle contains `Enter as a stakeholder` and `What makes the prevention claim credible`.

Vercel has environment variables configured. Before deploying:

- Ensure PR/branch has expected changes.
- If using Vercel CLI, verify project link with `.vercel`.
- Do not print secret env values.

Next deployment task:

- Merge PR #1 or deploy `codex/protocol-landing` to preview/production.
- Verify `/` and `/app` on deployed URL.

## Current top pending tasks

1. PR #1 was merged into `main` with squash commit `4fd0a6141fea3312c01148d8e2de64fb5d868926`.
2. Final closure work is now on branch `codex/final-blockchain-demo`.
3. Programs, Approvals, Settlements, Evidence and Audit now render on-chain sections instead of generic placeholders.
4. Visible human approval flow now points to EIP-712 canary proof on Base Sepolia.
5. Audit view now exposes contracts, EAS, x402, settlement and explorer links.
6. Hackathon pitch/demo script is in `HACKATHON_DELIVERY.md`.
7. Security scan and delivery controls are in `SECURITY_CHECK.md`.
8. Remaining priority: run final build/tests, deploy, verify production routes and open/merge final PR.

## Design principles to preserve

- Serious, not gimmicky.
- More institutional than “crypto.”
- Documentary, human and high-trust.
- Clear separation of powers.
- Every actor sees only what they should see.
- Agents are powerful but bounded.
- Money movement requires human authorization and contract rules.
- The Prevention Receipt is the star artifact.

## Latest handoff update log

- 2026-06-23: Created this handoff after landing PR #1 was opened. Next agent should prioritize deployment/merge and role-separated product UX.
- 2026-06-23: Deployed branch `codex/protocol-landing` to Vercel production. Found `/app` 404 due SPA routing and added explicit Vercel rewrites for `/app`.
- 2026-06-23: Redeployed after route fix. Production alias `https://zero-plum-eta.vercel.app` now serves both `/` and `/app` with 200 responses.
- 2026-06-23: Implemented first pass of role-separated Command Center surfaces for funder, operator, verifier, beneficiary/community and auditor.
- 2026-06-23: Deployed role-separated Command Center update to production and verified the new bundle is live.
- 2026-06-23: Added `/enter` stakeholder gateway, removed sidebar role switching, pointed landing CTAs to `/enter`, and rebuilt section 08 as a clearer proof/capital flow map.
- 2026-06-23: Deployed stakeholder gateway and chapter 08 fix to production; verified `/`, `/enter`, `/app?role=funder`, and production bundle text.
- 2026-06-23: Merged PR #1 to `main`, created branch `codex/final-blockchain-demo`, added on-chain proof data source, replaced internal placeholders with blockchain-backed role sections, changed `/api/agent-demo` to return confirmed Base Sepolia proof timeline, added architecture blueprint, delivery kit and security check.
- 2026-06-23: Deployed branch `codex/final-blockchain-demo` to production. Alias `https://zero-plum-eta.vercel.app` points to `https://zero-qkbejguo8-jhontejada95s-projects.vercel.app`. Verified `/`, `/enter`, `/app?role=funder` all return 200. Verified `/api/agent-demo` returns `COMPLETED_ONCHAIN`, `CONFIRMED_TESTNET_REFERENCE`, and settlement tx `0x346becdf17c0025f39acbf5353a406d26dcb2205d70d23e7683949e5b54b7f26`.
- 2026-06-23: Final polish on `main`: changed `/enter` copy from demo login to testnet/reference access, added full video pitch script and direct recording links to `HACKATHON_DELIVERY.md`, added screenshots under `docs/final/`, deployed from `main`, and verified direct section links return 200.
- 2026-06-28: Added and visually verified five production screenshots for Devpost, one per stakeholder role: Fund Manager, Program Operator, Independent Verifier, Community Representative and Public Auditor. Files are `docs/final/08-role-fund-manager.png` through `docs/final/12-role-public-auditor.png`. Use these after the protocol/flow images in the Devpost gallery to demonstrate real role separation.
- 2026-06-28: Added paste-ready English captions (under Devpost's 140-character limit) for all 12 gallery screenshots to `HACKATHON_DELIVERY.md`.
- 2026-06-28: Created a technology proof pack for the final three Devpost gallery slots: deployed contracts, confirmed onchain transactions, and functional cloud/agent stack. Final 3:2 boards are `docs/final/13-proof-deployed-contracts.png`, `14-proof-onchain-transactions.png`, and `15-proof-functional-stack.png`; original BaseScan and product captures plus the reproducible HTML layout are under `docs/final/technology/`.
- 2026-06-28: Prepared final Devpost organizer fields in `docs/submission/DEVPOST_FIELDS.md`, generated the required 1600×1000 architecture diagram (`zero-architecture.png` plus editable SVG), and recorded the Vercel Team ID from the linked project. The only manual required artifact is an authentic AWS Console screenshot of DynamoDB table `zero-events` in `us-east-2` showing Active status.
- 2026-06-28: Received and archived the authentic AWS Console proof as `docs/submission/aws-dynamodb-proof.png`. It visibly confirms DynamoDB table `zero-events`, Active status, on-demand capacity, PK/SK schema, Ohio region and 28 items. The AWS upload requirement is complete.
- 2026-06-28: Wrote the full English Medium launch article (`docs/submission/MEDIUM_ARTICLE.md`) and a 15-post X/Twitter thread (`docs/submission/X_THREAD.md`). Both include the required H01 disclosure and `#H01Hackathon`; replace `[MEDIUM_LINK]` in the thread after publishing.
- 2026-06-28: Added `docs/submission/MEDIUM_PUBLISHING_GUIDE.md` with exact image placement, file paths, captions, alt text, cover guidance and the recommended maximum number of images.
- 2026-06-28: Inserted visible cover and image markers directly into `MEDIUM_ARTICLE.md`, including exact local file paths, captions and deletion instructions for the Medium publishing workflow.
- 2026-06-28: Published Medium article URL was inserted into `X_THREAD.md`. Added contextual official mentions for `@vercel`, `@AWSCloud`, `@Devpost`, `@CoinbaseDev`, `@base`, and `@eas_eth`; tags are distributed by contribution rather than repeated indiscriminately.
- 2026-06-28: Rebuilt `X_THREAD.md` entirely in the third person with primary-source evidence: UNDRR GAR 2025 ($2.3T annual disaster costs), UNDRR prevention-finance allocation (97% response / under 3% prevention), WMO early-warning returns ($1→$9 and 24h→30% lower damage), World Bank resilient-infrastructure returns ($1→$4; $4.2T benefits), and UNEP's 2025 adaptation-finance gap ($310–365B need vs $26B flows). Each statistic links to the primary source.
- 2026-06-28: Fixed MIME/extension mismatch in the architecture diagram and every browser-generated `.png`. Sixteen files had JPEG bytes behind PNG filenames; all were re-encoded as true PNG, signatures verified (`89 50 4E 47`), and confirmed below Devpost's size limits. Rebuild `ZERO_JUDGE_PACKET.zip` after conversion.
