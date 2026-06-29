# ZERO — Final Demo Video Script

Target duration: **2:50–2:58**  
Language: **English**  
Format: **camera hook → screen demo → final statement**

## Before recording

Open these tabs in this exact order and wait for every page to load:

1. `https://zero-plum-eta.vercel.app`
2. `https://zero-plum-eta.vercel.app/#flows`
3. The local architecture image: `docs/submission/zero-architecture.png`
4. `https://zero-plum-eta.vercel.app/enter`
5. `https://zero-plum-eta.vercel.app/app?role=funder&section=approvals`
6. `https://zero-plum-eta.vercel.app/app?role=verifier&section=evidence`
7. `https://zero-plum-eta.vercel.app/app?role=auditor&section=audit`
8. The local DynamoDB proof: `docs/submission/aws-dynamodb-proof.png`
9. `https://sepolia.basescan.org/tx/0x346becdf17c0025f39acbf5353a406d26dcb2205d70d23e7683949e5b54b7f26`

Keep browser zoom at 90–100%. Hide bookmarks, notifications and unrelated tabs. Move the cursor slowly and never search or type during the recording.

---

## 0:00–0:23 — Camera: the hook

### Show

Full-screen camera. Neutral background, eye-level framing. No platform yet. Begin without music; introduce it softly after the first sentence.

### Say

> “The world knows how to pay after a tragedy, but it still does not know how to finance one that never happens.
>
> UNDRR estimates disasters now cost more than 2.3 trillion dollars every year. Yet 97 percent of humanitarian aid goes to response, while less than 3 percent funds prevention.
>
> ZERO was built to reverse that equation.”

Pause briefly after the first and last sentences.

## 0:23–0:40 — Landing hero: define ZERO

### Show

Cut cleanly to the landing hero. Keep **PREVENTION IS AN OUTCOME** centered. Move the cursor once toward **Explore the protocol**, but do not click.

### Say

> “ZERO is a prevention-finance protocol. It turns evidence, counterfactual analysis, independent verification and human authorization into a fundable, auditable and payable outcome: a Prevention Receipt.”

## 0:40–0:58 — Proof flow and capital flow

### Show

Switch to the pre-opened `/#flows` tab. Point first to the proof rail and then to the capital rail. Do not scroll rapidly.

### Say

> “The protocol separates proof from capital. Evidence demonstrates what happened. A transparent counterfactual estimates what was avoided. Only after independent verification and human authorization can a smart contract release value.”

## 0:58–1:14 — Architecture and trust boundaries

### Show

Display `zero-architecture.png` full screen. Move the cursor from stakeholders, through the application layer, toward Base Sepolia.

### Say

> “No component controls the entire system. Agent proposes. Human authorizes. Contract settles. Auditor reconstructs. DynamoDB preserves operational events, while Base Sepolia anchors payments, attestations, approvals and settlement.”

## 1:14–1:31 — Stakeholder gateway

### Show

Switch to `/enter`. Slowly move across the five identities. Select **Fund Manager** only if the page is not already showing it; otherwise point to the cards and continue.

### Say

> “Real prevention has different responsibilities. ZERO separates fund managers, program operators, independent verifiers, community representatives and public auditors. Each role sees only the information and actions permitted by its responsibility.”

## 1:31–1:51 — Fund Manager: human authorization

### Show

Switch to the pre-opened Fund Manager **Approvals** page. Point to the selected role, receipt, contract boundary and EIP-712 card. Open **Inspect approval packet** only if it is already rehearsed and loads instantly.

### Say

> “The Fund Manager reviews the exact authorization before value moves. EIP-712 binds the receipt hash, beneficiary, amount, nonce and expiry. Coinbase Developer Platform wallets enable bounded agent actions, but no agent can bypass the human signature or contract rules.”

## 1:51–2:09 — Independent Verifier: paid evidence

### Show

Switch to the Verifier **Evidence** page. Point to the x402 evidence card and confirmed transaction link.

### Say

> “The Independent Verifier inspects provenance and can challenge confidence. Here, an agent-controlled wallet paid for evidence through x402 in Base Sepolia USDC before the resource was delivered, leaving a verifiable procurement trail.”

## 2:09–2:27 — Public Auditor: reconstruction

### Show

Switch to the Auditor **Audit** page. Trace the reconstruction order: program, x402 payment, receipt hash, EAS attestation, EIP-712 approval and settlement.

### Say

> “The Public Auditor cannot trigger actions. It can reconstruct them. ZERO links the program, paid evidence, receipt hash, Ethereum Attestation Service record, human approval and escrow settlement into one public sequence.”

## 2:27–2:39 — AWS database proof

### Show

Switch to `aws-dynamodb-proof.png`. Keep the table name, Active status, PK/SK schema, Ohio region and 28 items visible.

### Say

> “Operational state is not hidden behind mock data. The live DynamoDB table stores 28 event records with a PK and SK structure, allowing the receipt and agent timeline to be reconstructed efficiently.”

## 2:39–2:51 — Confirmed onchain settlement

### Show

Switch to the pre-loaded BaseScan settlement transaction. Point to **Success**, the transaction hash and the ZERO transfer. Do not scroll unless the transfer is outside the viewport.

### Say

> “The reference program completes the chain on Base Sepolia: confirmed evidence payment, attestation, human authorization and 2.4 million ZERO released from escrow. This is a functional testnet proof—not a claim of a completed real-world deployment.”

## 2:51–2:59 — Final frame

### Show

Return to the landing hero or the manifesto section. End with **PREVENTION IS AN OUTCOME** visible. Stop moving the cursor.

### Say

> “ZERO is infrastructure for financing measurable risk reduction before irreversible harm occurs.
>
> Prevention is not the absence of an outcome. Prevention is an outcome.”

Hold the final frame for one second, then cut to black.

---

## Editing rules

- Keep the final exported video under 3:00; target 2:55.
- Use hard cuts between prepared tabs—no visible loading or typing.
- Add small lower-third labels only: `Proof Flow`, `Human Authorization`, `x402 Evidence`, `Public Audit`, `DynamoDB`, `Base Sepolia`.
- Do not add background music loud enough to compete with narration.
- Do not show wallet balances, API keys, Vercel environment values or unrelated browser tabs.
- Add English captions; many judges watch without sound.
- Do not accelerate the voice. Shorten pauses first if the recording exceeds three minutes.

## Recommended recording assets

- Architecture: `docs/submission/zero-architecture.png`
- AWS proof: `docs/submission/aws-dynamodb-proof.png`
- Optional B-roll: `docs/final/14-proof-onchain-transactions.png`
- Final URL card: `https://zero-plum-eta.vercel.app`

