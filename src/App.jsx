import { useEffect, useState } from "react";
import {
  ArrowRight,
  Broadcast,
  Check,
  CheckCircle,
  CloudRain,
  Database,
  FileMagnifyingGlass,
  Fingerprint,
  FlowArrow,
  Robot,
  ShieldCheck,
  Wallet,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { demoReceipt } from "./data/demo-receipt.js";
import { loadReceipt, verifyIntegrity } from "./data/receipt-client.js";

const evidenceIcons = [CloudRain, UsersThree, Database, ShieldCheck];
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });

function formatIssuedAt(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC", timeZoneName: "short",
  }).format(new Date(value));
}

function StoryFrame({ label, caption, src, alt }) {
  return (
    <figure className="story-frame">
      <figcaption><span>{label}</span>{caption}</figcaption>
      <img src={src} alt={alt} />
    </figure>
  );
}

function CausalStep({ icon: Icon, title, children }) {
  return (
    <div className="causal-step">
      <div className="causal-icon"><Icon size={27} weight="thin" /></div>
      <div><strong>{title}</strong><p>{children}</p></div>
    </div>
  );
}

function Modal({ type, onClose, receipt }) {
  const isEvidence = type === "evidence";
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        <p className="eyebrow">{isEvidence ? "AUDITABLE EVIDENCE" : "MODEL VERIFICATION"}</p>
        <h2 id="modal-title">{isEvidence ? "Every claim has a source." : "The estimate survives scrutiny."}</h2>
        <p className="modal-intro">
          {isEvidence
            ? "ZERO preserves the provenance of every observation used to issue this receipt. Nothing is hidden behind a single AI score."
            : `A synthetic control built from ${receipt.model.donorCount} comparable communities estimates what would likely have happened without the early-warning intervention.`}
        </p>
        {isEvidence ? (
          <div className="evidence-list">
            {receipt.evidence.map(({ source, name, detail }, index) => {
              const Icon = evidenceIcons[index] || Database;
              return (
                <div className="evidence-row" key={source}>
                  <Icon size={25} weight="thin" />
                  <div><strong>{name}</strong><span>{source} · {detail}</span></div>
                  <CheckCircle size={20} weight="fill" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="model-panel">
            <div className="model-stat"><span>Pre-period fit</span><strong>{receipt.model.prePeriodRmse} RMSE</strong></div>
            <div className="model-stat"><span>Estimated lives protected</span><strong>{receipt.model.protectedPeople}</strong></div>
            <div className="model-stat"><span>Confidence interval</span><strong>{receipt.model.interval.low}–{receipt.model.interval.high}</strong></div>
            <div className="confidence-track" aria-label={`${Math.round(receipt.model.confidence * 100)} percent confidence`}><i /></div>
            <p><Check size={17} weight="bold" /> Placebo and sensitivity checks passed</p>
          </div>
        )}
        <button className="modal-primary" onClick={onClose}>Return to receipt <ArrowRight size={18} /></button>
      </section>
    </div>
  );
}

function shorten(value) {
  return value ? `${value.slice(0, 8)}…${value.slice(-6)}` : "—";
}

function AgentRunModal({ onClose }) {
  const [status, setStatus] = useState("idle");
  const [run, setRun] = useState(null);

  async function launch() {
    setStatus("running");
    try {
      const response = await fetch("/api/agent-demo", { method: "POST", headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Agent API returned ${response.status}`);
      setRun(await response.json());
      setStatus("complete");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal agent-modal" role="dialog" aria-modal="true" aria-labelledby="agent-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        <p className="eyebrow">AUTONOMOUS PREVENTION RUN</p>
        <h2 id="agent-modal-title">Watch every agent earn the right to settle.</h2>
        <p className="modal-intro">Wallet creation, paid data, evidence, verification, attestation and settlement are exposed as one auditable chain.</p>

        {status === "idle" && (
          <div className="agent-launch">
            <div><Robot size={34} weight="thin" /><span>9 bounded steps</span></div>
            <div><Wallet size={34} weight="thin" /><span>5 agent wallets</span></div>
            <div><FlowArrow size={34} weight="thin" /><span>1 traceable settlement</span></div>
          </div>
        )}

        {status === "running" && <div className="agent-running"><i /><span>Agents are assembling the prevention proof…</span></div>}
        {status === "failed" && <p className="agent-error">The agent run could not start. No funds or state were changed.</p>}

        {run && (
          <>
            <div className="run-summary">
              <div><span>RUN</span><strong>{run.runId}</strong></div>
              <div><span>MODE</span><strong>{run.mode}</strong></div>
              <div><span>SETTLEMENT</span><strong>{run.token.amount.toLocaleString("en-US")} ZERO</strong></div>
            </div>
            <ol className="agent-timeline">
              {run.timeline.map((event) => (
                <li key={event.index}>
                  <span className="timeline-index">{String(event.index).padStart(2, "0")}</span>
                  <div><strong>{event.agent}</strong><small>{event.action}</small><p>{event.detail}</p></div>
                  <CheckCircle size={18} weight="fill" />
                </li>
              ))}
            </ol>
            <div className="settlement-proof">
              <span>BENEFICIARY</span><strong>{shorten(run.settlement.beneficiary)}</strong>
              <span>TRANSACTION</span><strong>{shorten(run.settlement.transactionHash)}</strong>
              <span>ASSET</span><strong>ZERO · TESTNET · NO REAL-WORLD VALUE</strong>
            </div>
          </>
        )}

        <button className="modal-primary" onClick={status === "complete" ? onClose : launch} disabled={status === "running"}>
          {status === "complete" ? "Return to receipt" : status === "failed" ? "Retry agent run" : status === "running" ? "Running agents" : "Launch agent run"}
          <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
}

export function App() {
  const [modal, setModal] = useState(null);
  const [receipt, setReceipt] = useState(demoReceipt);
  const [verification, setVerification] = useState("idle");

  useEffect(() => {
    let active = true;
    loadReceipt(demoReceipt.receiptId).then((result) => {
      if (active) setReceipt(result);
    });
    return () => { active = false; };
  }, []);

  async function verifyReceipt() {
    setVerification("checking");
    setVerification((await verifyIntegrity(receipt)) ? "verified" : "failed");
  }

  const verificationLabel = verification === "checking"
    ? "Checking proof"
    : verification === "verified"
      ? "Receipt verified"
      : verification === "failed"
        ? "Verification failed"
        : "Verify identity";

  return (
    <main className="app-shell">
      <header className="brand-row">
        <a className="brand" href="#receipt" aria-label="ZERO home">ZERO</a>
        <div className="event-meta"><span>{receipt.storage === "DYNAMODB" ? "DYNAMODB LIVE" : "DEMO LEDGER"}</span><strong>{receipt.receiptId}</strong></div>
        <button className={`verification-pill ${verification === "verified" ? "is-verified" : ""}`} onClick={verifyReceipt} disabled={verification === "checking" || !receipt.proof}>
          <Fingerprint size={18} /> {verificationLabel}
        </button>
      </header>

      <section className="experience" id="receipt">
        <aside className="story-column" aria-label="Community story">
          <StoryFrame label="BEFORE" caption="Early warning issued" src="/assets/before-flood.png" alt="Riverside homes beneath storm clouds" />
          <div className="story-line" aria-hidden="true" />
          <StoryFrame label="DURING" caption="Evacuation in progress" src="/assets/during-evacuation.png" alt="Responders guiding families during evacuation" />
          <div className="story-line" aria-hidden="true" />
          <StoryFrame label="AFTER" caption="Community safe" src="/assets/after-safe.png" alt="Families safely watching the river valley at dawn" />
        </aside>

        <article className="receipt">
          <div className="receipt-top"><span>ZERO</span><span className="zero-mark">0</span></div>
          <h1>PREVENTION RECEIPT</h1>
          <p className="manifesto">A tragedy prevented is an outcome.</p>
          <dl className="receipt-fields">
            <div><dt>INTERVENTION</dt><dd>{receipt.intervention}</dd></div>
            <div><dt>OBSERVED OUTCOME</dt><dd className="hero-value">{receipt.observedOutcome.peopleProtected} people protected</dd></div>
            <div><dt>COUNTERFACTUAL ESTIMATE</dt><dd>{receipt.counterfactual.low}–{receipt.counterfactual.high} {receipt.counterfactual.unit}<br /><small>without this intervention</small></dd></div>
            <div className="confidence-row"><dt>CONFIDENCE BAND</dt><dd><strong>{Math.round(receipt.confidence * 100)}%</strong> confidence<div className="receipt-track"><i /></div><div className="track-labels"><span>90%</span><span>98%</span></div></dd></div>
            <div><dt>EVIDENCE COUNT</dt><dd>{receipt.evidenceCount} verified data points</dd></div>
            <div><dt>BENEFICIARY COMMUNITY</dt><dd>{receipt.beneficiary.community}<br /><small>{receipt.beneficiary.location}</small></dd></div>
            <div><dt>RELEASED PAYMENT</dt><dd className="payment">{money.format(receipt.payment.amount)} released</dd></div>
          </dl>
          <footer className="receipt-footer">
            <div><span>RECEIPT ID</span><strong>{receipt.receiptId}</strong></div>
            <div><span>ISSUED</span><strong>{formatIssuedAt(receipt.issuedAt)}</strong></div>
            <div><span>VERIFIED BY</span><strong>{receipt.verifiedBy}</strong></div>
            <div><span>STATUS</span><strong>{receipt.status}</strong></div>
          </footer>
          <div className="seal" aria-label="ZERO proof of rescue seal"><span>ZERO</span><strong>0</strong><small>PROOF OF RESCUE</small></div>
        </article>

        <aside className="causal-column" aria-label="Causal chain">
          <p className="eyebrow">CAUSAL CHAIN</p>
          <div className="causal-flow">
            <CausalStep icon={Broadcast} title="EARLY WARNING">Hazard detected and verified</CausalStep>
            <CausalStep icon={UsersThree} title="EVACUATION">Timely action by community and responders</CausalStep>
            <CausalStep icon={ShieldCheck} title="LIVES PROTECTED">Tragedy averted through prevention</CausalStep>
          </div>
          <div className="outcome-note"><span>OUTCOME</span><p>A tragedy prevented<br />is an outcome.</p></div>
        </aside>
      </section>

      <nav className="action-bar" aria-label="Receipt actions">
        <button onClick={() => setModal("evidence")}><span className="action-icon"><FileMagnifyingGlass size={28} weight="thin" /></span><span><strong>Inspect evidence</strong><small>Review data, sources, and audits</small></span><ArrowRight size={24} /></button>
        <button onClick={() => setModal("model")}><span className="action-icon"><ShieldCheck size={28} weight="thin" /></span><span><strong>Verify model</strong><small>Review assumptions and estimation</small></span><ArrowRight size={24} /></button>
        <button onClick={() => setModal("agents")}><span className="action-icon"><Robot size={28} weight="thin" /></span><span><strong>Trace settlement</strong><small>Run agents, wallets, x402 and payment</small></span><ArrowRight size={24} /></button>
      </nav>

      {modal === "agents" && <AgentRunModal onClose={() => setModal(null)} />}
      {modal && modal !== "agents" && <Modal type={modal} receipt={receipt} onClose={() => setModal(null)} />}
    </main>
  );
}
