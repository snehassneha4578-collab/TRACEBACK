import { dependencyLabels, dependencyRules, type DependencyId, type ReasoningStatus } from "@/data/transistorCase";
import type { ReasoningTrace as Trace } from "@/lib/session";

const statusText: Record<ReasoningStatus, string> = {
  demonstrated: "DEMONSTRATED",
  incomplete: "INCOMPLETE",
  inconsistent: "INCONSISTENT",
  unverified: "UNVERIFIED",
};

export default function ReasoningTrace({ trace, target }: { trace: Trace; target: DependencyId | null }) {
  return (
    <section className="panel trace-panel">
      <div className="panel-heading">
        <div>
          <div className="eyebrow"><span className="trace-spark">✳</span> TRACEBACK / REASONING TRACE</div>
          <h2>Here&apos;s what your reasoning shows.</h2>
        </div>
        <div className="trace-id">TRACE <b>{trace.attempt === "initial" ? "00" : trace.attempt.slice(-1).padStart(2, "0")}</b></div>
      </div>
      <div className="trace-flow">
        <div className="trace-section-label"><span>01</span> STATEMENT → CONCEPT</div>
        {trace.statements.map((statement) => {
          const maps = trace.evidence.filter((mapping) => mapping.statementId === statement.id);
          return (
            <div className="statement-row" key={statement.id}>
              <span className="statement-number">{statement.id.replace("s", "").padStart(2, "0")}</span>
              <div className="statement-content">
                <p>“{statement.text}”</p>
                <div className="statement-tags">
                  {maps.length ? maps.map((mapping) => (
                    <span className={`concept-tag tag-${mapping.status}`} key={`${mapping.statementId}-${mapping.dependencyId}`}>
                      {dependencyLabels[mapping.dependencyId].split(" → ")[0]}
                    </span>
                  )) : <span className="concept-tag tag-neutral">No direct dependency match</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="diagnosis-section">
        <div className="trace-section-label"><span>02</span> DEPENDENCY → DIAGNOSIS</div>
        <div className="diagnosis-list">
          {trace.edges.map((edge, index) => {
            const label = dependencyLabels[edge.dependencyId];
            const active = edge.dependencyId === target;
            return (
              <article className={`diagnosis-row diagnosis-${edge.status} ${active ? "diagnosis-target" : ""}`} key={edge.dependencyId}>
                <div className={`diagnosis-marker marker-${edge.status}`}>{edge.status === "demonstrated" ? "✓" : edge.status === "incomplete" ? "!" : edge.status === "inconsistent" ? "×" : "○"}</div>
                <div className="diagnosis-body">
                  <div className="diagnosis-title-row">
                    <strong>{label}</strong>
                    <span className={`status-pill pill-${edge.status}`}>{statusText[edge.status]}</span>
                  </div>
                  {edge.status !== "demonstrated" && (
                    <div className="evidence-card">
                      <div className="evidence-label">{edge.evidence.length ? "YOUR EVIDENCE" : "EVIDENCE GAP"}</div>
                      {edge.evidence.length ? edge.evidence.map((statement) => <blockquote key={statement.id}>“{statement.text}” <small>— STEP {statement.id.slice(1)}</small></blockquote>) : <p className="no-evidence">No statement directly establishes this link.</p>}
                      <div className="expected-link"><span>EXPECTED LINK</span><p>{dependencyRules[edge.dependencyId].expected}</p></div>
                      <p className="diagnosis-explanation">{edge.explanation}</p>
                      {active && <div className="target-ribbon"><span>↳</span> FIRST LINK TO INVESTIGATE</div>}
                    </div>
                  )}
                  {edge.status === "demonstrated" && <p className="success-explanation">{edge.explanation}</p>}
                </div>
                <span className="edge-index">E{index + 1}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
