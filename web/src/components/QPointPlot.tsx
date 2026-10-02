import type { BiasPreset } from "@/lib/circuitModel";

function point(preset: BiasPreset) {
  return { x: 48 + (preset.collectorEmitterVoltage / 10) * 270, y: 140 - (preset.collectorCurrent / 5) * 100 };
}

export default function QPointPlot({ original, selected }: { original: BiasPreset; selected: BiasPreset }) {
  const a = point(original);
  const b = point(selected);
  return (
    <svg className="qpoint-plot" viewBox="0 0 350 183" role="img" aria-label={`Q-point plot. Original IC ${original.collectorCurrent} milliamps, VCE ${original.collectorEmitterVoltage} volts. New IC ${selected.collectorCurrent} milliamps, VCE ${selected.collectorEmitterVoltage} volts, ${selected.region}.`}>
      <defs><linearGradient id="loadline" x1="0" x2="1"><stop stopColor="#e45cff"/><stop offset="1" stopColor="#35e6f3"/></linearGradient><filter id="pointglow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <rect x="48" y="29" width="11" height="111" fill="rgba(231,72,144,.07)"/><rect x="59" y="29" width="237" height="111" fill="rgba(47,181,217,.045)"/><rect x="296" y="29" width="22" height="111" fill="rgba(164,113,255,.08)"/>
      {[0,1,2,3,4,5].map((v)=>{const y=140-(v/5)*100;return <g key={`y${v}`}><line x1="48" y1={y} x2="318" y2={y} stroke="#26384e" strokeDasharray="2 6"/><text x="38" y={y+3} textAnchor="end" fill="#71849c" fontSize="8" fontFamily="monospace">{v}</text></g>;})}
      {[0,2,4,6,8,10].map((v)=>{const x=48+(v/10)*270;return <g key={`x${v}`}><line x1={x} y1="29" x2={x} y2="140" stroke="#26384e" strokeDasharray="2 6"/><text x={x} y="153" textAnchor="middle" fill="#71849c" fontSize="8" fontFamily="monospace">{v}</text></g>;})}
      <line x1="48" y1="140" x2="318" y2="140" stroke="#63768d"/><line x1="48" y1="29" x2="48" y2="140" stroke="#63768d"/>
      <text x="52" y="22" fill="#d486cf" fontSize="7" fontFamily="monospace">SAT.</text><text x="174" y="22" textAnchor="middle" fill="#62bfcf" fontSize="7" fontFamily="monospace">FORWARD ACTIVE</text><text x="306" y="22" textAnchor="middle" fill="#b496fa" fontSize="7" fontFamily="monospace">CUTOFF</text>
      <line x1="59" y1="40" x2="318" y2="140" stroke="url(#loadline)" strokeWidth="1.5" strokeDasharray="5 4" opacity=".7"/>
      <circle cx={a.x} cy={a.y} r="6" fill="#101b2b" stroke="#5aaeff" strokeWidth="2"/><circle cx={a.x} cy={a.y} r="12" fill="none" stroke="#5aaeff" opacity=".3"/><text x={a.x-7} y={a.y-10} textAnchor="end" fill="#81bfff" fontSize="8" fontFamily="monospace">ORIGINAL</text>
      {selected.id !== original.id ? <g filter="url(#pointglow)"><circle cx={b.x} cy={b.y} r="6" fill="#ff65d4" stroke="#ffe3fa" strokeWidth="1.5"/><circle cx={b.x} cy={b.y} r="12" fill="none" stroke="#ff65d4" opacity=".45"/><text x={b.x-7} y={b.y+16} textAnchor="end" fill="#ff9ae2" fontSize="8" fontFamily="monospace">NEW</text></g> : null}
      <text x="185" y="172" textAnchor="middle" fill="#95a8be" fontSize="8" fontFamily="monospace">VCE / COLLECTOR–EMITTER (V)</text><text transform="translate(12 90) rotate(-90)" textAnchor="middle" fill="#95a8be" fontSize="8" fontFamily="monospace">IC (mA)</text>
    </svg>
  );
}
