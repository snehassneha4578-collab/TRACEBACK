import { dependencyPath, type DependencyId, type ReasoningStatus } from "@/data/transistorCase";

const statusMeta: Record<ReasoningStatus, { symbol: string; label: string }> = {
  demonstrated: { symbol: "✓", label: "DEMONSTRATED" },
  incomplete: { symbol: "!", label: "INCOMPLETE" },
  inconsistent: { symbol: "×", label: "INCONSISTENT" },
  unverified: { symbol: "○", label: "UNVERIFIED" },
};

type Props = {
  statuses: Record<string, ReasoningStatus>;
  edgeStatuses?: Partial<Record<DependencyId, ReasoningStatus>>;
  active?: DependencyId | null;
  compact?: boolean;
};

export default function ConceptMap({ statuses, edgeStatuses, active, compact = false }: Props) {
  return (
    <section className={`panel map-panel ${compact ? "map-panel-compact" : ""}`} aria-label="Concept dependency map">
      <div className="panel-heading">
        <div>
          <div className="eyebrow">DEPENDENCY MAP <span className="live-dot" /></div>
          <h2>Reasoning pathway</h2>
        </div>
        <span className="map-version">PATH / 05</span>
      </div>
      <div className="dependency-chain">
        {dependencyPath.map((node, index) => {
          const status = statuses[node.id] ?? "unverified";
          const edgeId = ["bias-qpoint", "qpoint-region", "region-small-signal", "small-signal-gain"][index - 1] as DependencyId;
          const edgeStatus = index > 0 ? edgeStatuses?.[edgeId] : undefined;
          const meta = statusMeta[status];
          return (
            <div className="chain-step" key={node.id}>
              {index > 0 && (
                <div className={`chain-link ${edgeStatus ? `link-${edgeStatus}` : ""} ${active === edgeId ? "link-active" : ""}`} aria-hidden="true">
                  <span />
                  <i>{edgeStatus === "demonstrated" ? "✓" : edgeStatus === "inconsistent" ? "×" : edgeStatus === "incomplete" ? "!" : ""}</i>
                  <span />
                </div>
              )}
              <div className={`concept-node node-${node.color} status-${status} ${active && active === edgeId ? "node-active" : ""}`}>
                <div className="node-orbit"><span className="node-core">{index + 1}</span></div>
                <div className="node-copy">
                  <span className="node-kicker">{node.short}</span>
                  <strong>{node.title}</strong>
                  <span className={`node-status status-text-${status}`}><b>{meta.symbol}</b> {meta.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="map-legend" aria-label="Status legend">
        <span className="legend-demonstrated">✓ Demonstrated</span>
        <span className="legend-incomplete">! Incomplete</span>
        <span className="legend-inconsistent">× Inconsistent</span>
        <span className="legend-unverified">○ Unverified</span>
      </div>
    </section>
  );
}
