export default function CircuitDiagram({ compact = false, baseVoltage }: { compact?: boolean; baseVoltage?: number }) {
  return (
    <svg className={`circuit-svg ${compact ? "circuit-compact" : ""}`} viewBox="0 0 440 230" role="img" aria-labelledby="circuit-title circuit-desc">
      <title id="circuit-title">Simplified common-emitter transistor amplifier</title>
      <desc id="circuit-desc">A fixed 10 volt supply, collector and emitter resistors, base input, and NPN transistor used in the TRACEBACK case.</desc>
      <defs>
        <linearGradient id="wire" x1="0" x2="1"><stop stopColor="#25def6"/><stop offset="1" stopColor="#7868ff"/></linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g fill="none" stroke="url(#wire)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)">
        <path d="M220 32V53M220 32h80M300 32v28M220 32h-61v32M220 32v41"/>
        <path d="M220 98v20M220 118l32 33M220 118l-32 33M220 118v54"/>
        <path d="M188 151h-46v-29h-38M188 151v18h32M252 151h47V93h1"/>
        <path d="M220 172v17M194 189h52M201 197h38M209 205h22"/>
        <path d="M104 122v24M95 132l18 0M104 146v23"/>
        <path d="M300 61v20M291 81h18M294 88h12M298 95h4"/>
        <path d="M220 62l-7 13h14l-7 13" stroke="#e152ff"/>
      </g>
      <g fill="#9fb9d5" fontFamily="monospace" fontSize="10">
        <text x="202" y="24">VCC 10V</text>
        <text x="313" y="47">RC 1kΩ</text>
        <text x="149" y="51">CE 100µF</text>
        <text x="260" y="182">RE 1kΩ</text>
        <text x="49" y="118">BASE BIAS</text>
        <text x="60" y="162">VB {baseVoltage === undefined ? "ADJ" : `${baseVoltage.toFixed(2)}V`}</text>
        <text x="310" y="91">VC / VCE</text>
        <text x="133" y="114">NPN</text>
        <text x="200" y="218">COMMON-EMITTER STAGE</text>
      </g>
      <g fill="#22dff7">
        <circle cx="220" cy="32" r="3.5"/><circle cx="300" cy="61" r="3.5"/><circle cx="104" cy="122" r="3.5"/>
      </g>
      <g fill="#ee5dff" opacity=".85"><circle cx="220" cy="118" r="4"/></g>
      <path d="M242 145l12 5-12 5 2-5z" fill="#25def6"/>
    </svg>
  );
}
