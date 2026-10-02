import { dependencyLabels, type DependencyId, type ReasoningStatus } from "@/data/transistorCase";
import type { ReasoningTrace } from "@/lib/session";

const statusIcon: Record<ReasoningStatus, string> = { demonstrated: "✓", incomplete: "!", inconsistent: "×", unverified: "○" };

export default function TraceComparison({ traces, target, outcome }: { traces: ReasoningTrace[]; target: DependencyId; outcome: "repaired" | "unresolved" }) {
  const before = traces[0];
  const after = traces[traces.length - 1];
  const beforeTarget = before.edges.find((edge) => edge.dependencyId === target)?.status ?? "unverified";
  const afterTarget = after.edges.find((edge) => edge.dependencyId === target)?.status ?? "unverified";
  return <section className="panel comparison-panel">
    <div className="panel-heading"><div><div className="eyebrow">REASONING DELTA / BEFORE → AFTER</div><h2>Trace the change in your thinking.</h2></div><span className={`comparison-verdict verdict-${outcome}`}>{outcome === "repaired" ? "LINK CONNECTED" : "LINK STILL OPEN"}</span></div>
    <div className="comparison-target"><span>TARGET DEPENDENCY</span><strong>{dependencyLabels[target]}</strong></div>
    <div className="comparison-columns">
      {[{ label: "INITIAL DIAGNOSTIC", trace: before, status: beforeTarget }, { label: `RE-TEST ${after.attempt.slice(-1)}`, trace: after, status: afterTarget }].map((column, index) => (
        <article className={`comparison-column compare-${index === 0 ? "before" : "after"}`} key={column.label}>
          <div className="comparison-column-label"><span>{column.label}</span><b className={`status-text-${column.status}`}>{statusIcon[column.status]} {column.status.toUpperCase()}</b></div>
          <p className="comparison-quote">{(() => { const evidence = column.trace.statements.filter((statement) => column.trace.evidence.some((mapping) => mapping.statementId === statement.id && mapping.dependencyId === target)); return evidence.length ? evidence.map((statement) => `“${statement.text}”`).join(" · ") : "No direct statement established this dependency."; })()}</p>
          <div className="comparison-tail">{index === 0 ? "REASONING BEFORE INTERVENTION" : outcome === "repaired" ? "THE PREVIOUSLY MISSING LINK IS NOW DEMONSTRATED" : "THE SAME DEPENDENCY REMAINS UNSUPPORTED"}</div>
        </article>
      ))}
    </div>
    <div className="dependency-delta"><div className="delta-line"><span className={`delta-node delta-${beforeTarget}`}>{statusIcon[beforeTarget]}</span><i /><b>{dependencyLabels[target]}</b><i /><span className={`delta-node delta-${afterTarget}`}>{statusIcon[afterTarget]}</span></div><p>{outcome === "repaired" ? "The second trace explicitly connects the dependency that was unsupported in the initial explanation." : "The latest trace still does not establish the targeted dependency. TRACEBACK keeps the gap visible instead of marking it repaired."}</p></div>
  </section>;
}
