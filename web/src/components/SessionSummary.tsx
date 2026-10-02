import ConceptMap from "@/components/ConceptMap";
import ReasoningTrace from "@/components/ReasoningTrace";
import TraceComparison from "@/components/TraceComparison";
import { dependencyLabels, type DependencyId } from "@/data/transistorCase";
import { getBiasPreset } from "@/lib/circuitModel";
import type { DiagnosticSession } from "@/lib/session";

function SessionReading({ item, index }: { item: DiagnosticSession["experimentObservations"][number]; index: number }) {
  const preset = getBiasPreset(item.biasPresetId);
  return <article className="observation-row"><div className="observation-order">{String(index + 1).padStart(2, "0")}</div><div className="observation-main"><div className="observation-topline"><span>{item.stage === "targeted" ? "TARGETED MICRO-EXPERIMENT" : "FOCUSED FOLLOW-UP"}</span><small>{dependencyLabels[item.targetedDependency]}</small></div><div className="observation-values"><b>VB {item.baseVoltage.toFixed(2)} V</b><span>IC {item.collectorCurrent.toFixed(2)} mA</span><span>VCE {item.collectorEmitterVoltage.toFixed(2)} V</span><span className={`observation-region region-text-${item.region}`}>{item.region.replace("forward-active", "FORWARD ACTIVE").toUpperCase()}</span></div><p>“{item.studentExplanation}”</p><div className="observation-preset">PRESET · {preset.name}</div></div></article>;
}

export default function SessionSummary({ session }: { session: DiagnosticSession }) {
  const target = session.selectedDependency as DependencyId;
  const outcome = session.verification as "repaired" | "unresolved";
  const finalTrace = session.traces[session.traces.length - 1];
  const targetEdge = finalTrace.edges.find((edge) => edge.dependencyId === target);
  return <div className="summary-view">
    <section className={`summary-hero summary-${outcome}`}><div className="summary-status-icon">{outcome === "repaired" ? "✓" : "×"}</div><div className="summary-copy"><div className="eyebrow">SESSION COMPLETE / VERIFICATION RESULT</div><h1>{outcome === "repaired" ? "Reasoning link repaired." : "Dependency unresolved."}</h1><p>{outcome === "repaired" ? <>Your re-test demonstrated <b>{dependencyLabels[target]}</b>. The dependency that was unsupported in your first trace is now connected by explicit reasoning.</> : <>Unresolved after 2 re-tests. {session.unresolvedSummary?.explanation} The final response does not establish <b>{dependencyLabels[target]}</b>.</>}</p></div><div className="summary-meta"><span>RE-TESTS USED</span><b>{session.reTestCount} / {session.maxReTests}</b><span>SESSION MEMORY ONLY</span></div></section>

    <section className="panel final-map-panel"><div className="panel-heading"><div><div className="eyebrow">FINAL KNOWLEDGE MAP / UPDATED AFTER VERIFICATION</div><h2>{outcome === "repaired" ? "Previously open link, now demonstrated." : "The unsupported link stays visible."}</h2></div><span className={`final-status-pill final-${outcome}`}>{outcome.toUpperCase()}</span></div><ConceptMap statuses={session.conceptStatuses} edgeStatuses={session.dependencyStatuses} active={target} /></section>

    <TraceComparison traces={session.traces} target={target} outcome={outcome} />

    <section className="panel observations-panel"><div className="panel-heading"><div><div className="eyebrow">EXPERIMENT LOG / SESSION ONLY</div><h2>What you observed</h2></div><span className="trace-id">{String(session.experimentObservations.length).padStart(2, "0")} OBSERVATIONS</span></div><div className="observation-list">{session.experimentObservations.map((item, index) => <SessionReading item={item} index={index} key={`${item.stage}-${index}`} />)}</div></section>

    <section className="full-trace-history"><div className="history-heading"><div><div className="eyebrow">FULL REASONING RECORD</div><h2>Every trace, preserved in order.</h2></div><span>{session.traces.length} TRACE{session.traces.length > 1 ? "S" : ""}</span></div>{session.traces.map((trace) => <div className="history-trace" key={trace.attempt}><div className="history-trace-label">{trace.attempt === "initial" ? "INITIAL DIAGNOSTIC" : `RE-TEST ${trace.attempt.slice(-1)}`}</div><ReasoningTrace trace={trace} target={target} /></div>)}</section>

    {targetEdge && <section className="summary-explanation"><span>WHY THIS OUTCOME</span><p>{outcome === "repaired" ? `The target dependency was demonstrated in the latest reasoning trace: ${targetEdge.explanation}` : `The target dependency remains ${targetEdge.status}: ${targetEdge.explanation}`}</p><small>TRACEBACK uses authored evidence rules, not a probability score or general-purpose AI judgment.</small></section>}
  </div>;
}
