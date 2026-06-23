import { useEffect, useState } from "react";
import {
  ArrowLeft, ArrowRight, Buildings, Check, CheckCircle, Clock,
  Database, FileMagnifyingGlass, Fingerprint, FlowArrow, Gauge, Globe,
  HandCoins, List, MapPin, Robot, ShieldCheck, SignOut, SquaresFour,
  UserCircle, UsersThree, Wallet, X,
} from "@phosphor-icons/react";
import { demoReceipt } from "./data/demo-receipt.js";
import { loadReceipt, verifyIntegrity } from "./data/receipt-client.js";
import { Landing } from "./Landing.jsx";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
const roles = {
  funder: { label: "Fund Manager", org: "Global Resilience Fund", initials: "FM", canApprove: true, accent: "amber" },
  operator: { label: "Program Operator", org: "La Bocana Resilience Office", initials: "PO", canApprove: false, accent: "cyan" },
  verifier: { label: "Independent Verifier", org: "Riverside District", initials: "IV", canApprove: false, accent: "cyan" },
  beneficiary: { label: "Community Representative", org: "La Bocana Community", initials: "CR", canApprove: false, accent: "cyan" },
  auditor: { label: "Public Auditor", org: "Open Climate Ledger", initials: "PA", canApprove: false, accent: "cyan" },
};

const programs = [
  { id: "PRG-001", name: "La Bocana Flood Early Warning", place: "Putumayo, Colombia", hazard: "Flood", risk: "High", stage: "Implementation", progress: 75, integrity: 99.2, reserved: "$2.4M", total: "$3.0M", next: "Human approval", image: "/assets/before-flood.png", live: true },
  { id: "PRG-002", name: "Mindanao Storm Shelters", place: "Davao del Sur, Philippines", hazard: "Storm", risk: "High", stage: "Construction", progress: 60, integrity: 97.8, reserved: "$6.2M", total: "$8.0M", next: "Milestone review", image: "/assets/during-evacuation.png" },
  { id: "PRG-003", name: "Dhaka Heat Alert", place: "Dhaka, Bangladesh", hazard: "Heat", risk: "Medium", stage: "Operations", progress: 90, integrity: 99.1, reserved: "$1.8M", total: "$2.0M", next: "Data review", image: "/assets/after-safe.png" },
];

const navItems = [
  ["portfolio", "Portfolio", SquaresFour], ["programs", "Programs", Buildings],
  ["approvals", "Approvals", CheckCircle], ["settlements", "Settlements", Wallet],
  ["evidence", "Evidence", Database], ["audit", "Audit", FileMagnifyingGlass],
];

const roleWorkspaces = {
  funder: { surface: "Capital release desk", thesis: "Funders see risk, evidence quality, committed capital and the exact human approval required before money moves.", can: ["Fund programs", "Review receipt integrity", "Authorize conditional releases"], cannot: ["Edit field evidence", "Change verification scores", "Bypass contract rules"], primary: "Review authorization", secondary: "Open audit trail" },
  operator: { surface: "Field execution room", thesis: "Operators coordinate intervention delivery, evidence tasks and community readiness without seeing funder-only controls.", can: ["Coordinate milestones", "Submit field evidence", "Track readiness"], cannot: ["Release funds", "Self-verify outcomes", "Alter receipt hashes"], primary: "Open evidence tasks", secondary: "View program timeline" },
  verifier: { surface: "Verification bench", thesis: "Verifiers inspect evidence provenance, counterfactual confidence and agent reasoning before an outcome can become payable.", can: ["Review evidence packets", "Challenge confidence", "Publish verification notes"], cannot: ["Move funds", "Represent beneficiaries", "Edit program execution"], primary: "Inspect evidence", secondary: "Review agent run" },
  beneficiary: { surface: "Community receipt", thesis: "Communities see what was promised, what was protected, what evidence supports the claim and what value was released.", can: ["Read the prevention receipt", "Confirm community impact", "See public settlement state"], cannot: ["Approve fund release", "Change evidence", "Access funder controls"], primary: "View receipt", secondary: "See settlement status" },
  auditor: { surface: "Public audit trail", thesis: "Auditors reconstruct the receipt from immutable evidence, attestations, signatures, contracts and transaction links.", can: ["Trace hashes", "Inspect attestations", "Reconstruct settlement"], cannot: ["Trigger actions", "Modify claims", "Access private operations"], primary: "Reconstruct receipt", secondary: "Open explorer links" },
};

function shorten(value) { return value ? `${value.slice(0, 8)}…${value.slice(-6)}` : "—"; }

const demoIdentities = {
  funder: { email: "maya@globalresilience.fund", passcode: "funder-demo", promise: "Authorize capital only when the receipt, evidence and human signature agree." },
  operator: { email: "ops@labocana.org", passcode: "operator-demo", promise: "Coordinate field execution and evidence tasks without fund controls." },
  verifier: { email: "verifier@riverside.review", passcode: "verify-demo", promise: "Challenge claims, inspect provenance and publish verification notes." },
  beneficiary: { email: "community@labocana.org", passcode: "community-demo", promise: "See what was protected, what was released and why." },
  auditor: { email: "audit@openclimate.ledger", passcode: "audit-demo", promise: "Reconstruct every claim from evidence to settlement." },
};

function getInitialRole() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("role");
  const fromStorage = window.localStorage?.getItem("zero-demo-role");
  return roles[fromQuery] ? fromQuery : roles[fromStorage] ? fromStorage : null;
}

function enterAs(roleKey) {
  window.localStorage?.setItem("zero-demo-role", roleKey);
  window.location.href = `/app?role=${roleKey}`;
}

function Sidebar({ roleKey, section, setSection, mobileOpen, setMobileOpen }) {
  if (!roleKey) return <RoleGateway />;
  const role = roles[roleKey];
  return <aside className={`product-sidebar ${mobileOpen ? "is-open" : ""}`}>
    <div className="sidebar-brand">ZERO<button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={20} /></button></div>
    <nav aria-label="Product navigation">
      {navItems.map(([key, label, Icon]) => <button key={key} className={section === key ? "active" : ""} onClick={() => { setSection(key); setMobileOpen(false); }}>
        <Icon size={20} weight="thin" /><span>{label}</span>{key === "approvals" && <b>4</b>}
      </button>)}
    </nav>
    <div className="role-panel">
      <span>AUTHENTICATED ROLE</span>
      <div className="role-identity"><i>{role.initials}</i><div><strong>{role.label}</strong><small>{role.org}</small></div></div>
      <p>{role.canApprove ? "Can review and authorize fund movements." : `${role.label} permissions are intentionally restricted.`}</p>
      <button className="sign-out" onClick={() => { window.localStorage?.removeItem("zero-demo-role"); window.location.href = "/enter"; }}><SignOut size={17} /> Change demo identity</button>
    </div>
  </aside>;
}

function Stat({ value, label, detail, tone }) { return <div className={`portfolio-stat ${tone || ""}`}><strong>{value}</strong><span>{label}</span><small>{detail}</small></div>; }

function StakeholderBrief({ roleKey, onOpen, onReview }) {
  const workspace = roleWorkspaces[roleKey];
  const role = roles[roleKey];
  return <section className={`stakeholder-brief ${role.accent}`}>
    <div>
      <p>ROLE-SPECIFIC SURFACE</p>
      <h2>{workspace.surface}</h2>
      <blockquote>{workspace.thesis}</blockquote>
      <div className="role-actions"><button onClick={role.canApprove ? onReview : onOpen}>{workspace.primary}<ArrowRight size={16} /></button><button onClick={onOpen}>{workspace.secondary}<ArrowRight size={16} /></button></div>
    </div>
    <div className="permission-matrix">
      <article><span>THIS ROLE CAN</span>{workspace.can.map(item => <p key={item}><CheckCircle size={14} weight="fill" />{item}</p>)}</article>
      <article><span>THIS ROLE CANNOT</span>{workspace.cannot.map(item => <p key={item}><X size={14} />{item}</p>)}</article>
    </div>
  </section>;
}

function ProgramRow({ program, onOpen }) {
  return <button className="program-row" onClick={() => onOpen(program)}>
    <div className="program-name"><img src={program.image} alt="" /><div><strong>{program.name}</strong><small><MapPin size={12} /> {program.place}</small><em>{program.id} · ON-CHAIN <CheckCircle size={13} weight="fill" /></em></div></div>
    <div><span>{program.risk}</span><small>{program.hazard}</small></div>
    <div className="stage-cell"><span>{program.stage}</span><div className="progress-track"><i style={{ width: `${program.progress}%` }} /></div><small>{program.progress}% complete</small></div>
    <div className="integrity-cell"><strong>{program.integrity}%</strong><small>Verified <CheckCircle size={13} weight="fill" /></small></div>
    <div className="capital-cell"><strong>{program.reserved}</strong><small>of {program.total}</small></div>
    <div className="next-cell"><strong>{program.next}</strong><small>{program.live ? "Release 2.4M ZERO" : "Open program"}</small><ArrowRight size={18} /></div>
  </button>;
}

function ActionQueue({ role, onReview }) {
  const restrictedCopy = role.label === "Program Operator" ? "Operators can prepare evidence but cannot release funds." : role.label === "Independent Verifier" ? "Verifiers can challenge claims but cannot move capital." : role.label === "Public Auditor" ? "Auditors get read-only reconstruction, not execution rights." : "Community view is transparent, not administrative.";
  return <aside className="action-queue">
    <header><h2>Action queue <b>4</b></h2><button>View all</button></header>
    <div className="priority-action">
      <span>HUMAN APPROVAL REQUIRED</span><h3>La Bocana Flood<br />Early Warning</h3><p><MapPin size={14} /> Putumayo, Colombia</p>
      <strong>Release 2.4M ZERO</strong><small>TO</small><p>Asociación de Juntas de Acción Comunal de La Bocana</p>
      <div className="queue-proof"><span>Evidence verified</span><b><CheckCircle size={16} weight="fill" /> 99.2% integrity</b><span>On-chain</span><b>Tx 0x7a1b…c2d4 <em>Confirmed</em></b></div>
      <button className="review-button" onClick={onReview} disabled={!role.canApprove}>{role.canApprove ? "Review authorization" : "Restricted for this role"}<ArrowRight size={18} /></button>
      {!role.canApprove && <p className="restriction-note">{restrictedCopy}</p>}
    </div>
    <div className="other-actions"><span>OTHER PENDING</span>{["Mindanao Storm Shelters", "Dhaka Heat Alert", "Kenya Drought Finance"].map((item, index) => <button key={item}><span>{item}<small>{["Milestone review", "Data review", "Outcome verification"][index]}</small></span><ArrowRight size={14} /></button>)}</div>
    <footer><ShieldCheck size={18} /><p>All actions are auditable.<br />Human approvals are required for fund movements.</p></footer>
  </aside>;
}

function Portfolio({ roleKey, onOpen, onReview }) {
  const role = roles[roleKey];
  return <div className="portfolio-layout">
    <main className="portfolio-main">
      <header className="portfolio-header"><div><p>PREVENTION PORTFOLIO</p><h1>Prevention portfolio</h1><blockquote>What did not happen still deserves proof.</blockquote></div><span>As of 22 Jun 2026, 09:42 COT</span></header>
      <StakeholderBrief roleKey={roleKey} onOpen={() => onOpen(programs[0])} onReview={onReview} />
      <section className="stats-grid"><Stat value="$18.4M" label="Protected capital" detail="Across 12 programs" tone="amber" /><Stat value="12" label="Active programs" detail="In 7 countries" /><Stat value="4" label="Approvals waiting" detail="$6.1M at risk" tone="amber" /><Stat value="98.7%" label="Evidence integrity" detail="7d weighted average" /></section>
      <section className="program-table"><div className="table-head"><span>PROGRAM</span><span>RISK</span><span>STAGE</span><span>EVIDENCE HEALTH</span><span>CAPITAL RESERVED</span><span>NEXT ACTION</span></div>{programs.map(program => <ProgramRow key={program.id} program={program} onOpen={onOpen} />)}<button className="view-link" onClick={() => onOpen(programs[0])}>View all programs <ArrowRight size={16} /></button></section>
      <section className="portfolio-lower"><div><h2>Recent evidence from the field</h2><div className="evidence-strip">{programs.map(p => <button key={p.id} onClick={() => onOpen(p)}><img src={p.image} alt={p.name} /><span>{p.place}</span></button>)}</div></div><div><h2>On-chain status</h2>{programs.map(p => <p className="chain-row" key={p.id}><i />{p.name}<code>Tx 0x{p.id.slice(-3)}b…c2d4</code><strong>Confirmed</strong></p>)}<button className="view-link">View all on-chain activity <ArrowRight size={16} /></button></div></section>
    </main>
    <ActionQueue role={role} onReview={onReview} />
  </div>;
}

function ReceiptCard({ receipt }) {
  return <article className="workspace-receipt">
    <div className="receipt-kicker"><span>ZERO</span><span>DISASTER PREVENTION RECEIPT</span><b>0</b></div><h2>PREVENTION RECEIPT</h2><blockquote>A tragedy prevented is an outcome.</blockquote>
    <dl><div><dt>INTERVENTION</dt><dd>{receipt.intervention}</dd></div><div><dt>OBSERVED OUTCOME</dt><dd><strong>{receipt.observedOutcome.peopleProtected} people protected</strong></dd></div><div><dt>COUNTERFACTUAL</dt><dd>{receipt.counterfactual.low}–{receipt.counterfactual.high} {receipt.counterfactual.unit}</dd></div><div><dt>CONFIDENCE</dt><dd className="cyan">{Math.round(receipt.confidence * 100)}% confidence</dd></div><div><dt>EVIDENCE</dt><dd>{receipt.evidenceCount} verified data points</dd></div><div><dt>BENEFICIARY</dt><dd>{receipt.beneficiary.community}</dd></div><div><dt>RELEASED VALUE</dt><dd className="amber">{money.format(receipt.payment.amount)} released</dd></div></dl>
    <footer><span>{receipt.receiptId}</span><span>{receipt.status}</span></footer>
  </article>;
}

function ProgramWorkspace({ receipt, roleKey, onBack, openModal }) {
  const role = roles[roleKey];
  return <main className="program-workspace">
    <header className="workspace-header"><button onClick={onBack}><ArrowLeft size={18} /> Portfolio</button><div><p>PROGRAM · PRG-001</p><h1>La Bocana Flood Early Warning</h1><span><MapPin size={14} /> Putumayo, Colombia · Funded</span></div><div className="workspace-role"><span>YOUR ROLE</span><strong>{role.label}</strong><small>{role.canApprove ? "Can approve settlement" : "Cannot approve funds"}</small></div></header>
    <section className="workspace-grid">
      <aside className="lifecycle"><p>PROGRAM LIFECYCLE</p>{[["Program funded", "complete"], ["Evidence purchased", "complete"], ["Intervention verified", "active"], ["Counterfactual reviewed", "pending"], ["Human approval", role.canApprove ? "action" : "locked"], ["Settlement", "locked"]].map(([label, state], index) => <div className={state} key={label}><i>{state === "complete" ? <Check size={16} /> : index + 1}</i><span><strong>{label}</strong><small>{state === "complete" ? "Verified" : state === "active" ? "In progress" : state === "action" ? "Ready for you" : "Pending"}</small></span></div>)}</aside>
      <ReceiptCard receipt={receipt} />
      <aside className="workspace-actions"><p>ROLE WORKSPACE</p><section><Gauge size={24} /><span>EVIDENCE READINESS</span><strong>Ready for handoff</strong><small>All required evidence collected and quality-checked.</small></section><section><Robot size={24} /><span>AGENT ACTIVITY</span><strong>9 bounded steps</strong><small>Wallets, x402 and settlement trace available.</small><button onClick={() => openModal("agents")}>Trace settlement <ArrowRight size={15} /></button></section><section><ShieldCheck size={24} /><span>NEXT PERMITTED ACTION</span><strong>{role.canApprove ? "Human authorization" : "Review program evidence"}</strong><button onClick={() => openModal(role.canApprove ? "approval" : "evidence")}>{role.canApprove ? "Review authorization" : "Inspect evidence"}<ArrowRight size={15} /></button></section></aside>
    </section>
  </main>;
}

function EvidenceModal({ type, receipt, onClose }) {
  const approval = type === "approval";
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="modal" role="dialog" aria-modal="true" onMouseDown={e => e.stopPropagation()}><button className="icon-button" onClick={onClose}><X size={20} /></button><p className="eyebrow">{approval ? "HUMAN AUTHORIZATION" : "AUDITABLE EVIDENCE"}</p><h2>{approval ? "Review before value moves." : "Every claim has a source."}</h2><p className="modal-intro">{approval ? "The authorization is bound to the exact program, beneficiary, amount, receipt hash and expiry." : "ZERO preserves provenance for every observation used to issue this receipt."}</p>{approval ? <div className="approval-summary"><span>BENEFICIARY</span><strong>{receipt.beneficiary.community}</strong><span>AMOUNT</span><strong>2,400,000 ZERO</strong><span>APPROVAL RAIL</span><strong>EIP-712 · Base Sepolia</strong></div> : <div className="evidence-list">{receipt.evidence.map(item => <div className="evidence-row" key={item.source}><Database size={22} /><div><strong>{item.name}</strong><span>{item.source} · {item.detail}</span></div><CheckCircle size={19} weight="fill" /></div>)}</div>}<button className="modal-primary" onClick={onClose}>{approval ? "Authorization already settled" : "Return to program"}<ArrowRight size={18} /></button></section></div>;
}

function AgentModal({ onClose }) {
  const [status, setStatus] = useState("idle"); const [run, setRun] = useState(null);
  async function launch() { setStatus("running"); try { const response = await fetch("/api/agent-demo", { method: "POST", headers: { Accept: "application/json" } }); if (!response.ok) throw new Error(); setRun(await response.json()); setStatus("complete"); } catch { setStatus("failed"); } }
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="modal agent-modal" role="dialog" aria-modal="true" onMouseDown={e => e.stopPropagation()}><button className="icon-button" onClick={onClose}><X size={20} /></button><p className="eyebrow">AUTONOMOUS PREVENTION RUN</p><h2>Every agent earns the right to settle.</h2><p className="modal-intro">Wallet creation, paid data, verification and settlement remain one auditable chain.</p>{status === "idle" && <div className="agent-launch"><div><Robot size={30} /><span>9 bounded steps</span></div><div><Wallet size={30} /><span>6 agent wallets</span></div><div><FlowArrow size={30} /><span>1 settlement</span></div></div>}{status === "running" && <div className="agent-running"><i /><span>Assembling the prevention proof…</span></div>}{status === "failed" && <p className="agent-error">The run could not start. No funds or state were changed.</p>}{run && <ol className="agent-timeline">{run.timeline.map(event => <li key={event.index}><span>{String(event.index).padStart(2, "0")}</span><div><strong>{event.agent}</strong><small>{event.action}</small><p>{event.detail}</p></div><CheckCircle size={17} weight="fill" /></li>)}</ol>}<button className="modal-primary" disabled={status === "running"} onClick={status === "complete" ? onClose : launch}>{status === "complete" ? "Return to program" : status === "running" ? "Running agents" : "Launch agent run"}<ArrowRight size={18} /></button></section></div>;
}

function SectionPlaceholder({ section, roleKey, onBack }) { const labels = { programs: "All prevention programs", approvals: "Human approvals", settlements: "Settlement ledger", evidence: "Evidence registry", audit: "Public audit trail" }; const workspace = roleWorkspaces[roleKey]; return <main className="section-placeholder"><p>ZERO · {section.toUpperCase()} · {roles[roleKey].label.toUpperCase()}</p><h1>{labels[section]}</h1><blockquote>{workspace.thesis}</blockquote><div className="placeholder-permissions"><span>{workspace.surface}</span>{workspace.can.map(item => <p key={item}><CheckCircle size={14} weight="fill" />{item}</p>)}</div><button onClick={onBack}>Return to role home <ArrowRight size={18} /></button></main>; }

export function RoleGateway() {
  const [selected, setSelected] = useState("funder");
  const identity = demoIdentities[selected];
  return <main className="gateway-shell">
    <a className="gateway-back" href="/"><ArrowLeft size={17} /> Back to protocol</a>
    <section className="gateway-hero"><div><p>ZERO PRODUCT ACCESS</p><h1>Enter as a stakeholder.</h1><blockquote>For the demo, each identity is preconfigured. In production this becomes authenticated access, scoped permissions and organization-level policy.</blockquote></div><aside><span>DEMO LOGIN</span><strong>{identity.email}</strong><small>Passcode: {identity.passcode}</small><button onClick={() => enterAs(selected)}>Continue to {roles[selected].label}<ArrowRight size={17} /></button></aside></section>
    <section className="gateway-grid" aria-label="Choose stakeholder role">{Object.entries(roles).map(([key, role]) => <button key={key} className={selected === key ? "active" : ""} onClick={() => setSelected(key)}><i>{role.initials}</i><span>{role.label}</span><strong>{role.org}</strong><p>{demoIdentities[key].promise}</p></button>)}</section>
  </main>;
}

export function PlatformApp() {
  const [receipt, setReceipt] = useState(demoReceipt); const [roleKey] = useState(getInitialRole); const [section, setSection] = useState("portfolio"); const [programOpen, setProgramOpen] = useState(false); const [modal, setModal] = useState(null); const [mobileOpen, setMobileOpen] = useState(false); const [verified, setVerified] = useState(false);
  useEffect(() => { let active = true; loadReceipt(demoReceipt.receiptId).then(result => active && setReceipt(result)); return () => { active = false; }; }, []);
  const role = roles[roleKey];
  async function verify() { setVerified(await verifyIntegrity(receipt)); }
  return <div className="product-shell"><Sidebar {...{ roleKey, section, setSection, mobileOpen, setMobileOpen }} /><div className="product-content"><div className="mobile-topbar"><button aria-label="Open navigation" onClick={() => setMobileOpen(true)}><List size={22} /></button><strong>ZERO</strong><span>{role.initials}</span></div><div className="integrity-bar"><button onClick={verify}><Fingerprint size={16} />{verified ? "Receipt integrity verified" : receipt.storage === "DYNAMODB" ? "DYNAMODB LIVE" : "DEMO LEDGER"}</button><span><Globe size={15} /> Base Sepolia · Testnet</span></div>{programOpen ? <ProgramWorkspace receipt={receipt} roleKey={roleKey} onBack={() => setProgramOpen(false)} openModal={setModal} /> : section === "portfolio" ? <Portfolio roleKey={roleKey} onOpen={() => setProgramOpen(true)} onReview={() => setModal("approval")} /> : <SectionPlaceholder section={section} roleKey={roleKey} onBack={() => setSection("portfolio")} />}</div>{modal === "agents" ? <AgentModal onClose={() => setModal(null)} /> : modal && <EvidenceModal type={modal} receipt={receipt} onClose={() => setModal(null)} />}</div>;
}

export function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return path === "/enter" ? <RoleGateway /> : path === "/app" || path.startsWith("/app/") ? <PlatformApp /> : <Landing />;
}
