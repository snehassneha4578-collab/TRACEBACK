"use client";

import { useReducer, useState } from "react";
import ConceptMap from "@/components/ConceptMap";
import CircuitDiagram from "@/components/CircuitDiagram";
import ReasoningInput from "@/components/ReasoningInput";
import ReasoningTrace from "@/components/ReasoningTrace";
import BiasExperiment, { ExperimentSidePanel } from "@/components/BiasExperiment";
import SessionSummary from "@/components/SessionSummary";
import { initialDiagnostic } from "@/data/transistorCase";
import { checkSufficiency } from "@/lib/diagnosis";
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
        <div className="sidebar-case-card"><span className="case-card-orbit">◉</span><div><small>ACTIVE CASE</small><strong>Gain Drop</strong></div><span className="case-live" /></div>
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
  const [retestReasoning, setRetestReasoning] = useState("");
  const isLanding = session.phase === "landing";
  const isInput = session.phase === "diagnostic-input";
  const isExperiment = session.phase === "experiment";
  const isRetest = session.phase === "retest-input";
  const isSummary = session.phase === "summary";
  const trace = session.traces[0];

  if (isLanding) return <Shell><div className="landing-view">
    <div className="hero-grid">
      <section className="hero-copy"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> REASONING INTELLIGENCE / 01</div><h2>Don&apos;t just find<br />the answer.<br /><span>Find the missing<br className="mobile-break" /> link.</span></h2><p className="hero-description">TRACEBACK finds where your mental model breaks the chain.</p><div className="hero-cta-row"><button className="button button-primary button-start" onClick={() => dispatch({ type: "START_DIAGNOSTIC" })}>Start diagnostic <span className="button-arrow">↗</span></button><span className="hero-duration"><span className="duration-glyph">◷</span> 4–6 MIN <b>·</b> ONE LIVE CASE</span></div><div className="hero-index"><span>01</span><i /> <span>04</span><small>CASE SEQUENCE</small></div></section>
      <section className="mission-card panel"><div className="mission-card-glow" /><div className="mission-card-top"><span className="mission-card-label"><i /> TRANSISTOR AMPLIFIER</span><span className="mission-card-index">ECE <i>/</i> 01</span></div>
        <h3 className="landing-case-title">Gain drop <span>·</span> Common-emitter stage</h3>
        <div className="gain-visualization"><div className="gain-readout" aria-label="Expected gain 50 times, observed gain 18 times, a 64 percent drop"><div className="gain-value gain-expected"><span>EXPECTED GAIN</span><strong>50<span>×</span></strong></div><div className="gain-drop-arrow" aria-hidden="true">↓</div><div className="gain-value gain-observed"><span>OBSERVED GAIN</span><strong>18<span>×</span></strong></div><div className="gain-drop-percent">−64% <span>GAIN DROP</span></div></div><svg viewBox="0 0 620 145" preserveAspectRatio="none" className="gain-chart" role="img" aria-label="Illustrative gain response falls over time"><defs><linearGradient id="gain-line" x1="0" x2="1"><stop stopColor="#28e9f5"/><stop offset=".55" stopColor="#688aff"/><stop offset="1" stopColor="#d34bff"/></linearGradient><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#41cfff" stopOpacity=".18"/><stop offset="1" stopColor="#41cfff" stopOpacity="0"/></linearGradient><filter id="chart-glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>{[24,57,90,123].map((y)=><line key={y} x1="20" x2="604" y1={y} y2={y} stroke="#22344d" strokeDasharray="2 8"/>)}<path d="M20 24 C95 25 118 30 178 32 S255 35 310 39 S380 50 416 67 C448 85 460 108 488 111 S553 118 604 122 L604 137 L20 137Z" fill="url(#chart-fill)"/><path d="M20 24 C95 25 118 30 178 32 S255 35 310 39 S380 50 416 67 C448 85 460 108 488 111 S553 118 604 122" fill="none" stroke="url(#gain-line)" strokeWidth="3" filter="url(#chart-glow)"/><circle cx="20" cy="24" r="5" fill="#32e8f3"/><circle cx="488" cy="111" r="5" fill="#dc52ff"/><circle cx="488" cy="111" r="10" fill="none" stroke="#dc52ff" opacity=".45"/><text x="22" y="143" fill="#596c84" fontSize="8" fontFamily="monospace">t₀ / REFERENCE</text><text x="518" y="143" fill="#596c84" fontSize="8" fontFamily="monospace">t₁ / NOW</text></svg></div>
      </section>
    </div>
    <div className="landing-map-label"><span>THE CONCEPT CHAIN</span><i /><small>5 CONCEPT NODES · 4 DEPENDENCIES · 1 REASONING PATH</small></div><ConceptMap statuses={session.conceptStatuses} compact />
    <div className="landing-bottom"><span>TRACEBACK / COGNITIVE CIRCUITRY</span><span>SIMULATED READINGS · EXPLAINABLE RULESET</span><span>V 0.1.0</span></div>
  </div></Shell>;

  return <Shell><div className="workspace-view">
        <div className="workspace-title-row"><MissionHeader small /><div className={`phase-chip ${session.phase === "trace" || isSummary ? "phase-traced" : ""}`}><span />{isSummary ? "SESSION COMPLETE" : session.phase === "trace" ? "TRACE GENERATED" : "DIAGNOSTIC IN PROGRESS"}</div></div>
    <div className={`workspace-grid ${isSummary ? "workspace-summary-grid" : ""}`}><div className="workspace-primary">
      {isInput ? <><div className="challenge-banner"><div className="challenge-icon">⚡</div><div><span className="eyebrow">DIAGNOSTIC CHALLENGE / GAIN DROP</span><p>“{initialDiagnostic}”</p><span className="challenge-context">Common-emitter stage <i>·</i> Reference gain |Av| ≈ 50 <i>·</i> Observed |Av| ≈ 18</span></div><span className="challenge-corner">01 / 01</span></div>
        <ReasoningInput prompt="How would you diagnose the gain drop? Explain what you would check first, what relationship you expect, and how each observation leads to your next step." value={reasoning} onChange={setReasoning} onSubmit={() => dispatch({ type: "SUBMIT_INITIAL", rawText: reasoning })} feedback={session.inputFeedback} />
        <div className="input-bottomline"><span><i /> DETERMINISTIC DIAGNOSTIC RULESET ACTIVE</span><span>YOUR WORDS · YOUR TRACE</span></div>
      </> : session.phase === "trace" && trace ? <><div className="trace-intro-banner"><div className="trace-intro-symbol">⌁</div><div><span className="eyebrow">DIAGNOSIS COMPLETE / EVIDENCE LINKED</span><p>Every status points back to a statement and a dependency.</p></div><span className="trace-intro-status"><i /> AUDITABLE TRACE</span></div><ReasoningTrace trace={trace} target={session.selectedDependency} /><div className="next-action-card"><div className="next-action-orbit">↳</div><div><span className="eyebrow">NEXT / TARGETED MICRO-EXPERIMENT</span><p>{session.selectedDependency ? "The earliest unsupported link becomes the next experiment target." : "All reasoning links are demonstrated. Review the trace and revisit your explanation."}</p></div>{session.selectedDependency ? <button className="button button-primary" onClick={() => dispatch({ type: "START_EXPERIMENT" })}>Run targeted experiment <span className="button-arrow">↗</span></button> : <button className="button button-primary" onClick={() => dispatch({ type: "RETURN_TO_REASONING" })}>Revise my reasoning <span className="button-arrow">↗</span></button>}</div></>
        : isExperiment ? <BiasExperiment session={session} onBiasChange={(presetId) => dispatch({ type: "SET_BIAS", presetId })} onRecord={(studentExplanation) => dispatch({ type: "RECORD_EXPERIMENT", studentExplanation })} feedback={session.inputFeedback} />
        : isRetest ? <>
          <div className="challenge-banner retest-banner"><div className="challenge-icon">↻</div><div><span className="eyebrow">RE-TEST {session.reTestCount + 1} / RELATED CASE</span><p>“An otherwise identical amplifier now has its base-bias setting at 1.50 V. Its DC readings are IC ≈ 0.80 mA and VCE ≈ 8.40 V. Explain what this operating condition means for its response and whether a small-signal gain estimate is appropriate. Show how you reached your conclusion.”</p><span className="challenge-context">Different bias condition <i>·</i> Rebuild the reasoning link in your own words</span></div><span className="challenge-corner">RE-TEST 0{session.reTestCount + 1}</span></div>
          {trace && <div className="retest-compare-strip"><div><span>BEFORE / {session.reTestCount === 0 ? "INITIAL" : "RE-TEST 1"}</span><b>{session.selectedDependency?.replaceAll("-", " ").toUpperCase()}</b><small>{session.reTestCount === 0 ? trace.edges.find((edge) => edge.dependencyId === session.selectedDependency)?.status : session.traces.at(-1)?.edges.find((edge) => edge.dependencyId === session.selectedDependency)?.status}</small></div><i>→</i><div><span>NOW / REASON AGAIN</span><b>RELATED CONDITION</b><small>Need explicit dependency evidence</small></div></div>}
          <section className="panel retest-input-panel"><div className="panel-heading"><div><div className="eyebrow"><span className="step-index">0{session.reTestCount + 2}</span> YOUR RE-TEST REASONING</div><h2>Show the connection this time.</h2></div><span className="retest-limit">ATTEMPT {session.reTestCount + 1} OF 2</span></div><p className="challenge-prompt">Use the new DC conditions to reason through the case. TRACEBACK will check whether your explanation now establishes <b>{session.selectedDependency?.replaceAll("-", " → ")}</b>, not just whether you name the right region.</p><label className="visually-hidden" htmlFor="retest-reasoning">Your re-test reasoning</label><textarea id="retest-reasoning" value={retestReasoning} onChange={(event) => setRetestReasoning(event.target.value)} placeholder={'Example format:\n1. I would first check…\n2. I would expect to observe…\n3. If that changes, I would then investigate…\n4. This could affect the amplifier because…'} rows={7} />{session.inputFeedback && <div className="input-feedback" role="alert"><span>!</span>{session.inputFeedback}</div>}<div className="reasoning-footer"><span className="privacy-note">◈ Empty or vague input does not use this re-test</span><button className="button button-primary" type="button" onClick={() => { const check = checkSufficiency(retestReasoning); dispatch({ type: "SUBMIT_RETEST", rawText: retestReasoning }); if (check.kind === "sufficient") setRetestReasoning(""); }}>Re-test my reasoning <span className="button-arrow">↗</span></button></div></section>
        </>
        : isSummary ? <SessionSummary session={session} />
        : null}
    </div><aside className="workspace-secondary">{isExperiment ? <ExperimentSidePanel session={session} /> : <><SideTelemetry hasTrace={Boolean(trace)} />{isRetest ? <><section className="panel retest-data-card"><div className="eyebrow">GIVEN OPERATING POINT</div><div className="retest-data-grid"><span>VB <b>1.50 V</b></span><span>IC <b>0.80 mA</b></span><span>VCE <b>8.40 V</b></span></div><p>These are the case readings. Explain what they mean; no gain result is supplied.</p></section><ConceptMap statuses={session.conceptStatuses} edgeStatuses={session.dependencyStatuses} active={session.selectedDependency} /></> : session.phase === "trace" ? <ConceptMap statuses={session.conceptStatuses} edgeStatuses={session.dependencyStatuses} active={session.selectedDependency} /> : null}</>}</aside></div>
  </div></Shell>;
}
