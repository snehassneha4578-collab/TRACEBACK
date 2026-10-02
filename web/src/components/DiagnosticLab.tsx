"use client";

import { useReducer, useState } from "react";
import ConceptMap from "@/components/ConceptMap";
import CircuitDiagram from "@/components/CircuitDiagram";
import ReasoningInput from "@/components/ReasoningInput";
import ReasoningTrace from "@/components/ReasoningTrace";
import { initialDiagnostic } from "@/data/transistorCase";
import { createSession, sessionReducer } from "@/lib/session";

function BrandMark() {
  return <div className="brand-mark" aria-hidden="true"><span /><span /><span /><span /></div>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand-lockup" href="#home" aria-label="TRACEBACK home"><BrandMark /><span>TRACE<span className="brand-accent">BACK</span><small>ENGINEERING COGNITION</small></span></a>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Workspace">
          <a href="#lab" className="nav-item nav-active"><span className="nav-glyph">⌘</span><span>Diagnostic Lab</span><i className="nav-indicator" /></a>
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-case-card"><span className="case-card-orbit">◉</span><div><small>ACTIVE CASE</small><strong>Gain Drop</strong><span>ANALOG ELECTRONICS</span></div><span className="case-live" /></div>
        <div className="sidebar-footer"><span className="user-orb">E</span><div><strong>Engineering Lab</strong><small>LOCAL SESSION</small></div><span className="footer-dots">•••</span></div>
      </aside>
      <main className="main-shell" id="lab">
        <header className="topbar"><div className="breadcrumbs"><span>TRACEBACK</span><b>/</b><strong>KNOWLEDGE DIAGNOSTIC LAB</strong></div><div className="topbar-right"><span className="system-status"><i /> SYSTEM READY</span><span className="topbar-divider" /><span className="session-chip"><span>◉</span> SESSION ONLY</span></div></header>
        {children}
      </main>
    </div>
  );
}

function MissionHeader({ small = false }: { small?: boolean }) {
  return <div className={`mission-heading ${small ? "mission-heading-small" : ""}`}><div className="eyebrow"><span className="mission-dot" /> ACTIVE ENGINEERING CASE <span className="eyebrow-slash">/</span> ECE–01</div><h1>TRANSISTOR <span>AMPLIFIER</span></h1><div className="mission-subtitle"><span className="mission-icon">⌁</span> DIAGNOSTIC MISSION <b>GAIN DROP</b><span className="mission-tag">ANALOG ELECTRONICS</span></div></div>;
}

function CircuitPanel() {
  return <section className="panel circuit-panel"><div className="panel-heading compact-heading"><div><div className="eyebrow">CIRCUIT / CE–01</div><h2>Signal path</h2></div><span className="schematic-badge">SCHEMATIC</span></div><CircuitDiagram compact /><div className="circuit-spec-row"><span><i className="spec-cyan" /> VCC <b>10 V</b></span><span><i className="spec-purple" /> RC <b>1 kΩ</b></span><span><i className="spec-pink" /> RE <b>1 kΩ</b></span></div></section>;
}

function SideTelemetry({ hasTrace }: { hasTrace: boolean }) {
  return <div className="side-stack"><CircuitPanel /><section className="panel side-note-panel"><div className="eyebrow">HOW TRACEBACK WORKS</div><div className="side-note-icon">⟶</div><p>We trace the <em>reasoning path</em>, not only the final answer.</p><div className="trace-mini-flow"><span>CLAIM</span><i>→</i><span>EVIDENCE</span><i>→</i><span>GAP</span></div></section>{hasTrace && <div className="session-note"><span>◈</span><p>Trace stored in this active session. Refreshing starts a new session.</p></div>}</div>;
}

export default function DiagnosticLab() {
  const [session, dispatch] = useReducer(sessionReducer, undefined, createSession);
  const [reasoning, setReasoning] = useState("");
  const isLanding = session.phase === "landing";
  const isInput = session.phase === "diagnostic-input";
  const trace = session.traces[0];

  if (isLanding) return <Shell><div className="landing-view">
    <div className="landing-topline"><span><i className="live-dot" /> KNOWLEDGE DIAGNOSTIC LAB</span><span className="run-id">RUN ID <b>TB–ECE–001</b></span></div>
    <div className="hero-grid">
      <section className="hero-copy"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> REASONING INTELLIGENCE / 01</div><h2>Don&apos;t just find<br />the answer.<br /><span>Find the missing<br className="mobile-break" /> link.</span></h2><p className="hero-description">A gain drop is just the signal. TRACEBACK finds where your mental model breaks the chain.</p><div className="hero-cta-row"><button className="button button-primary button-start" onClick={() => dispatch({ type: "START_DIAGNOSTIC" })}>Start diagnostic <span className="button-arrow">↗</span></button><span className="hero-duration"><span className="duration-glyph">◷</span> 4–6 MIN <b>·</b> ONE LIVE CASE</span></div><div className="hero-index"><span>01</span><i /> <span>04</span><small>CASE SEQUENCE</small></div></section>
      <section className="mission-card panel"><div className="mission-card-glow" /><div className="mission-card-top"><span className="mission-card-label"><i /> LIVE ENGINEERING CASE</span><span className="mission-card-index">01 <i>/</i> 01</span></div><MissionHeader />
        <div className="gain-visualization"><div className="gain-chart-label"><span>AMPLIFIER RESPONSE</span><span>EXPECTED <b>50</b><i>→</i> OBSERVED <b className="gain-low">18</b></span></div><svg viewBox="0 0 620 145" className="gain-chart" role="img" aria-label="Illustrative gain response drops from 50 to 18"><defs><linearGradient id="gain-line" x1="0" x2="1"><stop stopColor="#28e9f5"/><stop offset=".55" stopColor="#688aff"/><stop offset="1" stopColor="#d34bff"/></linearGradient><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#41cfff" stopOpacity=".18"/><stop offset="1" stopColor="#41cfff" stopOpacity="0"/></linearGradient><filter id="chart-glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>{[24,57,90,123].map((y)=><line key={y} x1="20" x2="604" y1={y} y2={y} stroke="#22344d" strokeDasharray="2 8"/>)}<path d="M20 24 C95 25 118 30 178 32 S255 35 310 39 S380 50 416 67 C448 85 460 108 488 111 S553 118 604 122 L604 137 L20 137Z" fill="url(#chart-fill)"/><path d="M20 24 C95 25 118 30 178 32 S255 35 310 39 S380 50 416 67 C448 85 460 108 488 111 S553 118 604 122" fill="none" stroke="url(#gain-line)" strokeWidth="3" filter="url(#chart-glow)"/><circle cx="20" cy="24" r="5" fill="#32e8f3"/><circle cx="488" cy="111" r="5" fill="#dc52ff"/><circle cx="488" cy="111" r="10" fill="none" stroke="#dc52ff" opacity=".45"/><text x="22" y="16" fill="#8deaf6" fontSize="10" fontFamily="monospace">50×</text><text x="498" y="105" fill="#ec7aff" fontSize="10" fontFamily="monospace">18×</text><text x="22" y="143" fill="#596c84" fontSize="8" fontFamily="monospace">t₀ / REFERENCE</text><text x="518" y="143" fill="#596c84" fontSize="8" fontFamily="monospace">t₁ / NOW</text></svg></div>
        <div className="mission-card-foot"><span><i className="foot-wave">⌁</i> TRANSISTOR AMPLIFIER</span><span>DIAGNOSTIC MISSION <b>↗</b></span></div>
      </section>
    </div>
    <div className="landing-map-label"><span>THE CONCEPT CHAIN</span><i /><small>FIVE DEPENDENCIES · ONE REASONING PATH</small></div><ConceptMap statuses={session.conceptStatuses} compact />
    <div className="landing-bottom"><span>TRACEBACK / COGNITIVE CIRCUITRY</span><span>SIMULATED READINGS · EXPLAINABLE RULESET</span><span>V 0.1.0</span></div>
  </div></Shell>;

  return <Shell><div className="workspace-view">
    <div className="workspace-title-row"><MissionHeader small /><div className={`phase-chip ${session.phase === "trace" ? "phase-traced" : ""}`}><span />{session.phase === "trace" ? "TRACE GENERATED" : "DIAGNOSTIC IN PROGRESS"}</div></div>
    <div className="workspace-grid"><div className="workspace-primary">
      {isInput ? <><div className="challenge-banner"><div className="challenge-icon">⚡</div><div><span className="eyebrow">DIAGNOSTIC CHALLENGE / GAIN DROP</span><p>“{initialDiagnostic}”</p><span className="challenge-context">Common-emitter stage <i>·</i> Reference gain |Av| ≈ 50 <i>·</i> Observed |Av| ≈ 18</span></div><span className="challenge-corner">01 / 01</span></div>
        <ReasoningInput prompt="How would you diagnose the gain drop? Explain what you would check first, what relationship you expect, and how each observation leads to your next step." value={reasoning} onChange={setReasoning} onSubmit={() => dispatch({ type: "SUBMIT_INITIAL", rawText: reasoning })} feedback={session.inputFeedback} />
        <div className="input-bottomline"><span><i /> DETERMINISTIC DIAGNOSTIC RULESET ACTIVE</span><span>YOUR WORDS · YOUR TRACE</span></div>
      </> : trace && <><div className="trace-intro-banner"><div className="trace-intro-symbol">⌁</div><div><span className="eyebrow">DIAGNOSIS COMPLETE / EVIDENCE LINKED</span><p>Every status points back to a statement and a dependency.</p></div><span className="trace-intro-status"><i /> AUDITABLE TRACE</span></div><ReasoningTrace trace={trace} target={session.selectedDependency} /><div className="next-action-card"><div className="next-action-orbit">↳</div><div><span className="eyebrow">NEXT / TARGETED MICRO-EXPERIMENT</span><p>{session.selectedDependency ? "The earliest unsupported link becomes the next experiment target." : "All reasoning links are demonstrated. Review the trace to confirm the evidence."}</p></div><button className="button button-primary" disabled={!session.selectedDependency}>Investigate the gap <span className="button-arrow">↗</span></button><span className="coming-tag">SLICE 02</span></div></>}
    </div><aside className="workspace-secondary"><SideTelemetry hasTrace={Boolean(trace)} /><ConceptMap statuses={session.conceptStatuses} edgeStatuses={session.dependencyStatuses} active={session.selectedDependency} /></aside></div>
  </div></Shell>;
}
