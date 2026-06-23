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

Vercel has environment variables configured. Before deploying:

- Ensure PR/branch has expected changes.
- If using Vercel CLI, verify project link with `.vercel`.
- Do not print secret env values.

Next deployment task:

- Merge PR #1 or deploy `codex/protocol-landing` to preview/production.
- Verify `/` and `/app` on deployed URL.

## Current top pending tasks

1. Merge or promote PR #1 and deploy landing to Vercel.
2. Implement role-separated product IA and screens.
3. Replace placeholder screens for Programs, Approvals, Evidence and Audit.
4. Wire visible human approval flow to the testnet/on-chain proof already prepared.
5. Add clearer transaction/attestation explorer links in the audit view.
6. Create hackathon demo script and pitch narrative.
7. Create final Devpost submission content.
8. Optional polish: unique imagery for future applications, Spanish/English toggle, better reduced-motion rules.

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
