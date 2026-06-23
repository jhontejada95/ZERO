import { useEffect, useState } from "react";
import {
  ArrowDown, ArrowRight, Bank, Buildings, CaretDown, Check, CheckCircle,
  Cloud, Coins, Database, FileText, Fingerprint, FlowArrow, Globe, HandCoins,
  Heartbeat, List, LockKey, Robot, ShieldCheck, SignIn, Strategy, TrendUp,
  UserFocus, UsersThree, Wallet, Warning, X,
} from "@phosphor-icons/react";

const steps = [
  ["Collect evidence", "Agents package field observations, sensor data and intervention records.", Database],
  ["Build the counterfactual", "Scientific methods estimate what would likely have happened without action.", Strategy],
  ["Independently verify", "Qualified reviewers challenge the evidence, assumptions and confidence.", ShieldCheck],
  ["Human authorization", "An accountable person approves the exact outcome before value can move.", UserFocus],
];

const actors = [
  ["Funders & insurers", "Commit capital to a defined prevention objective.", Bank],
  ["Implementers", "Deliver preventive action where risk is real.", Buildings],
  ["Evidence providers", "Report field, sensor and institutional data.", Database],
  ["Bounded agents", "Collect, package and assess evidence under policy.", Robot],
  ["Independent verifiers", "Challenge methods and reproduce results.", ShieldCheck],
  ["Authorized humans", "Review the complete claim and authorize outcomes.", UserFocus],
  ["Smart contracts", "Enforce conditions and execute settlement.", LockKey],
  ["Communities", "Receive protection and the value tied to prevention.", UsersThree],
  ["Public auditors", "Inspect lineage, authorization and system integrity.", Fingerprint],
];

const layers = [
  { number: "12", title: "Stakeholder & product layer", icon: UsersThree, summary: "The human operating model", body: "Defines who may fund, implement, verify, approve, receive and audit. Role-specific workspaces keep responsibilities separate while every handoff remains attributable.", detail: "Program design · Evidence intake · Review queues · Human approvals · Receipts · Settlement reporting" },
  { number: "13", title: "Agent orchestration layer", icon: Robot, summary: "Bounded automation, visible handoffs", body: "Agents coordinate evidence collection and analysis, but every action is scoped. They can propose and prepare; they cannot change policy, impersonate reviewers or release capital.", detail: "CDP agent wallets · Collection agents · Analysis agents · Verification agents · Compliance guards · Audit traces" },
  { number: "14", title: "Scientific & data layer", icon: Database, summary: "Credible methods, reproducible claims", body: "Evidence is validated, versioned and compared with an explicit risk baseline. Counterfactual methods estimate the outcome that did not occur and report uncertainty rather than hiding it.", detail: "Synthetic control · Sensitivity analysis · Independent verification · DynamoDB evidence ledger · Full provenance" },
  { number: "15", title: "Settlement & trust layer", icon: LockKey, summary: "Conditional value, immutable proof", body: "Authorization is bound to the precise program, beneficiary, amount and receipt. Contracts release value only when conditions and human approval agree.", detail: "CDP wallets · x402 / USDC · EIP-712 signatures · ZERO escrow · EAS attestations · Base Sepolia" },
];

const uses = [
  ["Flood risk reduction", "Early warning, evacuation and resilient infrastructure.", "/assets/before-flood.png"],
  ["Extreme heat protection", "Alerts and public-health interventions before exposure.", "/assets/during-evacuation.png"],
  ["Public health prevention", "Measurable early action before outbreaks accelerate.", "/assets/after-safe.png"],
  ["Food security", "Interventions that reduce the probability of acute loss.", "/assets/before-flood.png"],
  ["Conflict prevention", "Evidence-led action that reduces harm before violence.", "/assets/during-evacuation.png"],
  ["Infrastructure resilience", "Preventive maintenance tied to avoided disruption.", "/assets/after-safe.png"],
];

function Chapter({ number, kicker, id, className = "", children }) {
  return <section id={id} className={`landing-chapter ${className}`}>
    <div className="chapter-meta"><b>{number}</b><span>{kicker}</span></div>
    {children}
  </section>;
}

function FlowArrowIcon() { return <ArrowRight className="flow-arrow" size={26} weight="thin" aria-hidden="true" />; }

function Receipt({ compact = false }) {
  return <article className={`landing-receipt ${compact ? "compact" : ""}`}>
    <header><span>ZERO</span><span>DISASTER PREVENTION RECEIPT</span><b>0</b></header>
    <h3>PREVENTION RECEIPT</h3>
    <blockquote>A tragedy prevented is an outcome.</blockquote>
    <dl>
      <div><dt>INTERVENTION</dt><dd>Early warning and evacuation</dd></div>
      <div><dt>OBSERVED OUTCOME</dt><dd><strong>37 people protected</strong></dd></div>
      <div><dt>COUNTERFACTUAL</dt><dd>37–46 lives at risk</dd></div>
      <div><dt>CONFIDENCE</dt><dd className="receipt-cyan">94% confidence</dd></div>
      <div><dt>EVIDENCE</dt><dd>127 verified data points</dd></div>
      <div><dt>RELEASED VALUE</dt><dd className="receipt-amber">$2.4M released</dd></div>
    </dl>
    <footer><span>ZR-2024-05-18-000743</span><span>FINAL</span></footer>
  </article>;
}

function ArchitectureLayer({ layer, open, onToggle }) {
  const Icon = layer.icon;
  return <section className="architecture-layer">
    <div className="layer-heading">
      <span>{layer.number}</span><Icon size={34} weight="thin" />
      <div><p>ARCHITECTURE LAYER</p><h3>{layer.title}</h3><em>{layer.summary}</em></div>
    </div>
    <p className="layer-copy">{layer.body}</p>
    <button aria-expanded={open} onClick={onToggle}>Inspect technical details <CaretDown size={17} /></button>
    {open && <div className="layer-detail"><Fingerprint size={22} /><p>{layer.detail}</p></div>}
  </section>;
}

export function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openLayer, setOpenLayer] = useState(0);
  const [active, setActive] = useState("essence");

  useEffect(() => {
    const nodes = [...document.querySelectorAll(".landing-chapter[id]")];
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-30% 0px -60%", threshold: [0, .1, .3] });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const go = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  return <div className="landing-shell">
    <header className="landing-nav">
      <a className="landing-logo" href="/" aria-label="ZERO home">ZERO</a>
      <button className="landing-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X size={22} /> : <List size={22} />}</button>
      <nav className={menuOpen ? "open" : ""} aria-label="Landing navigation">
        <button onClick={() => go("protocol")}>Protocol</button><button onClick={() => go("how-it-works")}>How it works</button>
        <button onClick={() => go("trust")}>Trust</button><button onClick={() => go("architecture")}>Architecture</button>
        <button onClick={() => go("applications")}>Use cases</button>
      </nav>
      <a className="enter-platform" href="/app">Enter platform <ArrowRight size={16} /></a>
    </header>

    <aside className="chapter-rail" aria-label="Page chapters">
      {[["essence","01"],["problem","02"],["protocol","03–05"],["actors","07"],["trust","09"],["example","10"],["architecture","11–15"],["traceability","16"],["business","17"],["applications","18"],["future","19"]].map(([id,label]) => <button key={id} className={active === id ? "active" : ""} onClick={() => go(id)}><span>{label}</span>{id}</button>)}
    </aside>

    <main className="landing-main">
      <Chapter number="01" kicker="ESSENCE / CATEGORY DEFINITION" id="essence" className="landing-hero">
        <div className="hero-copy"><h1>PREVENTION<br />IS AN OUTCOME.</h1><p className="hero-definition">ZERO is a protocol that turns verified prevention into auditable outcomes and conditional payments.</p><p className="hero-clarifier">It does not predict disasters or replace responders. It proves when preventive action reduced harm—and coordinates who may fund, verify, approve and receive value.</p><div className="hero-actions"><button onClick={() => go("protocol")}>Understand the protocol <ArrowDown size={17} /></button><a href="/app">Enter the platform <ArrowRight size={17} /></a></div></div>
        <div className="essence-model">
          <div><span>INPUTS</span><p><CheckCircle size={18} /> Prevention objective</p><p><Database size={18} /> Intervention evidence</p><p><Warning size={18} /> Risk baseline</p></div><FlowArrowIcon />
          <div className="zero-core"><b>Z</b><span>ZERO PROTOCOL</span></div><FlowArrowIcon />
          <div><span>OUTPUTS</span><p><FileText size={18} /> Prevention Receipt</p><p><HandCoins size={18} /> Conditional settlement</p><p><Fingerprint size={18} /> Permanent audit trail</p></div>
          <footer><span>Proof flow</span><span>Capital flow</span></footer>
        </div>
      </Chapter>

      <Chapter number="02" kicker="THE UNIVERSAL PROBLEM" id="problem" className="problem-chapter">
        <div className="chapter-thesis"><h2>Prevention creates<br />an evidence paradox.</h2><p>We are excellent at counting loss. We are almost blind to prevention.</p></div>
        <div className="paradox-sequence"><article><b>01</b><h3>When nothing bad happens, success leaves no obvious record.</h3><p>The absence of tragedy looks identical to the absence of risk.</p></article><article><b>02</b><h3>Without proof, there is no credible claim.</h3><p>Communities may act, but their impact remains invisible to institutions.</p></article><article><b>03</b><h3>Without a claim, capital keeps rewarding reaction.</h3><p>Relief is visible and payable. Prevention stays structurally underfunded.</p></article></div>
      </Chapter>

      <Chapter number="03" kicker="THE GENERAL MODEL / INPUTS" id="protocol" className="inputs-chapter">
        <div className="chapter-intro"><p>WHAT ENTERS THE PROTOCOL</p><h2>A claim begins with<br />an explicit objective.</h2><span>ZERO never asks the system to trust a vague promise. Every outcome starts with a measurable commitment.</span></div>
        <div className="three-principles"><article><CheckCircle size={36} weight="thin" /><b>01</b><h3>Funded prevention objective</h3><p>What will be done, for whom, with what intent and under which rules.</p></article><article><Database size={36} weight="thin" /><b>02</b><h3>Intervention evidence</h3><p>Activities, deployments, observations and data collected before and during action.</p></article><article><Warning size={36} weight="thin" /><b>03</b><h3>Risk baseline</h3><p>An agreed measure of risk that makes subsequent change testable.</p></article></div>
      </Chapter>

      <Chapter number="04" kicker="THE GENERAL MODEL / TRANSFORMATION" id="how-it-works" className="transformation-chapter">
        <div className="chapter-intro"><p>WHAT ZERO DOES</p><h2>Evidence becomes<br />a defensible outcome.</h2><span>Automation moves the work forward. Scientific review, human judgment and contractual rules create trust.</span></div>
        <div className="transformation-flow">{steps.map(([title, copy, Icon], index) => <div className="step-wrap" key={title}><article className={index === 3 ? "human-step" : ""}><span>{String(index + 1).padStart(2,"0")}</span><Icon size={34} weight="thin" /><h3>{title}</h3><p>{copy}</p></article>{index < steps.length - 1 && <FlowArrowIcon />}</div>)}</div>
        <div className="flow-legend"><span>Proof flow — evidence and verification</span><span>Capital flow — conditional, never autonomous</span></div>
      </Chapter>

      <Chapter number="05" kicker="THE GENERAL MODEL / OUTPUTS" className="outputs-chapter">
        <div className="output-definition"><p>THE UNIT ZERO CREATES</p><h2>What is a<br />Prevention Receipt?</h2><blockquote>An auditable claim that a defined intervention measurably reduced a defined risk for specified beneficiaries, under stated confidence.</blockquote><p>It is independently verified and authorized by humans. It can trigger a conditional payment and creates a permanent public record.</p></div>
        <div className="output-list"><article><FileText size={34} /><h3>Prevention Receipt</h3><p>A legible record of what changed, for whom and with what confidence.</p></article><article><HandCoins size={34} /><h3>Conditional settlement</h3><p>Value moves only when approved conditions are satisfied.</p></article><article><Fingerprint size={34} /><h3>Permanent audit trail</h3><p>Evidence, methods, decisions and authorization remain inspectable.</p></article></div>
      </Chapter>

      <Chapter number="06" kicker="CATEGORY BOUNDARIES" className="boundaries-chapter">
        <div><h2>ZERO is</h2><p><Check /> A verification and settlement protocol for prevention outcomes.</p><p><Check /> A coordination layer connecting funders, verifiers, implementers and communities.</p><p><Check /> An auditable evidence standard for measurable impact.</p></div><div><h2>ZERO is not</h2><p><X /> A disaster prediction oracle or early-warning product.</p><p><X /> An autonomous fund controller. Human and contractual authorization are required.</p><p><X /> A replacement for governments, responders or scientific review.</p></div>
      </Chapter>

      <Chapter number="07" kicker="ACTORS & RESPONSIBILITIES" id="actors" className="actors-chapter">
        <div className="chapter-intro"><p>WHO MAKES THE PROTOCOL REAL</p><h2>Different powers.<br />One accountable system.</h2><span>ZERO separates duties so no participant needs unchecked authority.</span></div>
        <div className="actor-grid">{actors.map(([title, copy, Icon], index) => <article key={title} className={index === 5 ? "actor-human" : ""}><Icon size={30} weight="thin" /><span>{String(index + 1).padStart(2,"0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </Chapter>

      <Chapter number="08" kicker="PROOF FLOW & CAPITAL FLOW" className="flows-chapter">
        <div className="chapter-intro"><p>HOW THE SYSTEM CIRCULATES TRUST</p><h2>Evidence travels forward.<br />Accountability travels back.</h2></div>
        <div className="flow-map"><div className="flow-row proof"><span>PROOF</span>{["Field action","Evidence","Agents","Verifier","Human","Receipt"].map((label,index) => <div key={label}><i>{index + 1}</i><b>{label}</b>{index < 5 && <ArrowRight size={22} />}</div>)}</div><div className="flow-row capital"><span>CAPITAL</span>{["Funder","Escrow","Authorization","Community"].map((label,index) => <div key={label}><i>{index + 1}</i><b>{label}</b>{index < 3 && <ArrowRight size={22} />}</div>)}</div></div>
      </Chapter>

      <Chapter number="09" kicker="TRUST MODEL" id="trust" className="trust-chapter">
        <div className="trust-statement"><h2>Agents may propose.<br /><em>Only humans and contracts authorize.</em></h2><p>ZERO gains speed from automation without surrendering judgment or control.</p></div>
        <div className="trust-stages">{[["Agents","May collect and propose",Robot],["Verifiers","May challenge and reproduce",ShieldCheck],["Authorized humans","Must approve the outcome",UserFocus],["Smart contracts","May execute exact rules",LockKey],["Public record","Makes every handoff inspectable",Fingerprint]].map(([title,copy,Icon], index) => <article key={title} className={index === 2 ? "trust-human" : ""}><Icon size={34} weight="thin" /><h3>{title}</h3><p>{copy}</p></article>)}</div>
        <div className="safeguards"><p><ShieldCheck size={21} /> No agent can move funds.</p><p><ShieldCheck size={21} /> No single verifier can approve.</p><p><ShieldCheck size={21} /> No settlement occurs without human authorization and contractual conditions.</p></div>
      </Chapter>

      <Chapter number="10" kicker="A PROTOCOL MADE CONCRETE" id="example" className="example-chapter">
        <div className="chapter-intro"><p>ONE INSTANCE OF THE GENERAL MODEL</p><h2>La Bocana Flood<br />Early Warning</h2><span>Putumayo, Colombia</span></div>
        <div className="story-strip">{[["BEFORE","Risk identified","/assets/before-flood.png"],["INTERVENTION","Early warning and evacuation","/assets/during-evacuation.png"],["AFTER","Reduced flooding impact","/assets/after-safe.png"]].map(([stage,title,image]) => <figure key={stage}><img src={image} alt={`${stage}: La Bocana prevention program`} /><figcaption><span>{stage}</span><h3>{title}</h3></figcaption></figure>)}</div>
        <div className="example-proof"><div><p>THE CLAIM</p><h3>This is not what ZERO is.<br />It is one instance of the protocol.</h3><p>Every future program follows the same general model, permission boundaries and audit standard.</p><a href="/app">Open this program in the platform <ArrowRight size={17} /></a></div><Receipt /></div>
      </Chapter>

      <Chapter number="11" kicker="UNDER THE HOOD" id="architecture" className="architecture-intro">
        <div><p>THE COMPLETE SYSTEM</p><h2>Four layers.<br />One chain of accountability.</h2></div><p>Each layer answers a different question: who acts, how work moves, how claims become credible and how value settles safely.</p>
      </Chapter>
      <div className="architecture-stack">{layers.map((layer,index) => <ArchitectureLayer key={layer.number} layer={layer} open={openLayer === index} onToggle={() => setOpenLayer(openLayer === index ? -1 : index)} />)}</div>

      <Chapter number="16" kicker="TRACEABILITY / LIVE PROOF" id="traceability" className="traceability-chapter">
        <div className="chapter-intro"><p>FROM FIELD OBSERVATION TO PUBLIC RECORD</p><h2>Every claim has a lineage.</h2><span>Evidence can be challenged because every transformation and decision is recorded.</span></div>
        <div className="lineage"><h3>Evidence lineage</h3><div>{["127 field points","Validation checks","Counterfactual model","Verifier report","Human approval","Prevention Receipt"].map((item,index) => <span key={item}><i>{index+1}</i>{item}{index < 5 && <ArrowRight size={19} />}</span>)}</div></div>
        <div className="transaction-ledger"><header><h3>Recent on-chain activity</h3><a href="https://sepolia.basescan.org" target="_blank" rel="noreferrer">View explorer <ArrowRight size={15} /></a></header>{[["Human authorization · La Bocana","0x15bec1…c4d36"],["Escrow release · 2.4M ZERO","0x7a1b…c2d4"],["Evidence bundle verified · 127 points","0xe0b0…3c6d"],["x402 payment · data purchase","0x5af11d…1ea9"]].map(([event,hash]) => <div key={event}><span>{event}</span><code>{hash}</code><b><CheckCircle weight="fill" /> Confirmed</b></div>)}</div>
      </Chapter>

      <Chapter number="17" kicker="BUSINESS MODEL" id="business" className="business-chapter">
        <div className="chapter-intro"><p>WHO PAYS — AND WHY</p><h2>A sustainable infrastructure<br />for prevention finance.</h2><span>ZERO earns when credible outcomes move through the protocol—not when a token appreciates.</span></div>
        <div className="business-grid"><article><Coins size={32} weight="thin" /><h3>Protocol & transaction fees</h3><p>Small, transparent fees on verified settlements and institutional workflows.</p></article><article><Database size={32} weight="thin" /><h3>Evidence services</h3><p>Pay-per-evidence acquisition, analysis, verification and quality assurance.</p></article><article><Buildings size={32} weight="thin" /><h3>Institutional agreements</h3><p>Platform access, governance, reporting and support for public and private portfolios.</p></article></div>
      </Chapter>

      <Chapter number="18" kicker="UNIVERSAL APPLICATIONS" id="applications" className="applications-chapter">
        <div className="chapter-intro"><p>ONE PROTOCOL, MANY FRONTIERS</p><h2>Prevention is larger<br />than disaster response.</h2><span>These are future domains for the general protocol—not claims of completed deployments.</span></div>
        <div className="use-grid">{uses.map(([title,copy,image]) => <figure key={title}><img src={image} alt="" /><figcaption><h3>{title}</h3><p>{copy}</p></figcaption></figure>)}</div>
      </Chapter>

      <Chapter number="19" kicker="THE FUTURE WE PREVENT" id="future" className="manifesto-chapter">
        <img src="/assets/after-safe.png" alt="Community members after a prevention program" />
        <div><p>ONE PROTOCOL. MANY CONTEXTS. ALWAYS THE SAME STANDARD.</p><h2>The future will not only be measured by what survived.<br /><em>It will be measured by what we prevented.</em></h2><a href="/app">Enter the platform <ArrowRight size={18} /></a></div>
      </Chapter>
    </main>
    <footer className="landing-footer"><a href="/">ZERO</a><span>Prevention finance. Proven.</span><nav><button onClick={() => go("protocol")}>Protocol</button><button onClick={() => go("trust")}>Trust & safety</button><a href="/app">Platform</a></nav></footer>
  </div>;
}
