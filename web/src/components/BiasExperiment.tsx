"use client";

import { useState, type CSSProperties } from "react";
import { dependencyLabels, type DependencyId } from "@/data/transistorCase";
import { biasPresets, getBiasPreset, ORIGINAL_PRESET } from "@/lib/circuitModel";
import CircuitDiagram from "@/components/CircuitDiagram";
import ConceptMap from "@/components/ConceptMap";
import QPointPlot from "@/components/QPointPlot";
import type { DiagnosticSession } from "@/lib/session";

const followUpPrompts: Record<DependencyId, string> = {
  "bias-qpoint": "Compare the original and changed readings. What changed in the DC operating point, and what base-bias change could account for it?",
  "qpoint-region": "Use the displayed IC and VCE values to classify this operating condition. Which observation supports your classification?",
  "region-small-signal": "Given the region shown for this bias state, what does that imply about using a small-signal gain estimate? Explain the link.",
  "small-signal-gain": "With the transistor in its displayed region, how could the changed collector current affect gm and the gain estimate? Connect the steps.",
};

function RegionBadge({ region }: { region: string }) {
  return <span className={`region-badge region-${region}`}><i />{region === "forward-active" ? "FORWARD ACTIVE" : region.toUpperCase()}</span>;
}

function ReadingCard({ preset, label, tone }: { preset: ReturnType<typeof getBiasPreset>; label: string; tone: string }) {
  return <div className={`reading-card reading-${tone}`}><div className="reading-label">{label}</div><div className="reading-bias">VB <b>{preset.baseVoltage.toFixed(2)} V</b><span>{preset.name}</span></div><div className="reading-values"><div><small>IC</small><strong>{preset.collectorCurrent.toFixed(2)}<i>mA</i></strong></div><div><small>VCE</small><strong>{preset.collectorEmitterVoltage.toFixed(2)}<i>V</i></strong></div></div><RegionBadge region={preset.region} />{preset.gainMagnitude !== null && <div className="reading-gain">EST. |Av| <b>≈ {preset.gainMagnitude}</b></div>}</div>;
}

export default function BiasExperiment({ session, onBiasChange, onRecord, feedback }: {
  session: DiagnosticSession;
  onBiasChange: (id: string) => void;
  onRecord: (explanation: string) => void;
  feedback: string | null;
}) {
  const [explanation, setExplanation] = useState("");
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);
  const selected = getBiasPreset(session.currentBiasPresetId);
  const isFollowUp = session.experimentStage === "follow-up";
  const target = session.selectedDependency;
  const prompt = isFollowUp && target ? followUpPrompts[target] : "What changed in the Q-point and operating region, and why could this affect the validity of the small-signal gain model?";
  const sliderValue = biasPresets.findIndex((preset) => preset.id === selected.id);
  const submitObservation = () => {
    if (selected.id === ORIGINAL_PRESET.id) {
      setLocalFeedback("Move the base-bias control to another preset so you can observe a changed operating point.");
      return;
    }
    if (!explanation.trim()) {
      setLocalFeedback("Add a short explanation of what you observed before continuing to the re-test.");
      return;
    }
    setLocalFeedback(null);
    onRecord(explanation);
  };

  return <div className="experiment-view">
    <div className={`experiment-banner ${isFollowUp ? "followup-banner" : ""}`}><div className="experiment-icon">{isFollowUp ? "↻" : "⌁"}</div><div><span className="eyebrow">{isFollowUp ? "FOCUSED FOLLOW-UP / ONE REMAINING INVESTIGATION" : "TARGETED MICRO-EXPERIMENT / BIAS SHIFT"}</span><h2>{isFollowUp ? "Stay with the missing link." : "Shift the bias. Trace the change."}</h2><p>{isFollowUp && target ? <>Target: <b>{dependencyLabels[target]}</b>. {prompt}</> : <>Investigate what happens when the base-bias condition changes. Observe the circuit first; explain the connection in your own words.</>}</p></div><div className="experiment-step">{isFollowUp ? "02" : "01"}<small>/ 02</small></div></div>

    <section className="panel bias-control-panel">
      <div className="panel-heading"><div><div className="eyebrow">CONTROLLED PARAMETER <span className="live-dot" /></div><h2>Base-bias voltage <span className="bias-vb">VB</span></h2></div><div className="bias-value"><b>{selected.baseVoltage.toFixed(2)}</b><span>V</span></div></div>
      <div className="bias-slider-wrap"><div className="slider-track-labels"><span>LOW / CUTOFF</span><span>REFERENCE</span><span>HIGH / SATURATION</span></div><input type="range" min="0" max={biasPresets.length - 1} step="1" value={sliderValue} onChange={(event) => { onBiasChange(biasPresets[Number(event.target.value)].id); setLocalFeedback(null); }} aria-label="Change base bias preset" style={{ "--range-progress": `${(sliderValue / (biasPresets.length - 1)) * 100}%` } as CSSProperties} /><div className="preset-markers">{biasPresets.map((preset, index) => <button type="button" key={preset.id} onClick={() => { onBiasChange(preset.id); setLocalFeedback(null); }} className={index === sliderValue ? "preset-selected" : ""} aria-label={`Set base bias to ${preset.baseVoltage.toFixed(2)} volts (${preset.name})`}><i /><span>{preset.baseVoltage.toFixed(2)}V</span></button>)}</div></div>
      <div className="bias-readings"><ReadingCard preset={ORIGINAL_PRESET} label="ORIGINAL OPERATING POINT" tone="original" /><div className="reading-shift">Δ<span>→</span></div><ReadingCard preset={selected} label="NEW OPERATING POINT" tone="selected" /></div>
      <div className="plot-wrap"><div className="plot-title"><span>Q-POINT MOVEMENT</span><span>FIXED CASE / LOAD-LINE VIEW</span></div><QPointPlot original={ORIGINAL_PRESET} selected={selected} /></div>
      <div className="model-disclaimer">PRE-AUTHORED CASE MODEL <i>·</i> Fixed component values; no arbitrary circuit simulation.</div>
    </section>

    <section className="panel experiment-response"><div className="experiment-response-title"><div className="response-number">02</div><div><div className="eyebrow">OBSERVATION → EXPLANATION</div><h3>Make the connection.</h3></div></div><p className="experiment-question">{prompt}</p><label htmlFor="experiment-explanation" className="visually-hidden">Explain the experiment observation</label><textarea id="experiment-explanation" value={explanation} onChange={(event) => { setExplanation(event.target.value); setLocalFeedback(null); }} placeholder="Describe what you observed, then connect it to what you would investigate next…" rows={3} /><div className="experiment-submit-row">{localFeedback || feedback ? <span className="input-feedback inline-feedback" role="alert">{localFeedback || feedback}</span> : <span className="privacy-note">◈ Observation saved in this session</span>}<button className="button button-primary" type="button" onClick={submitObservation}>{isFollowUp ? "Begin Re-Test 2" : "Re-test my reasoning"}<span className="button-arrow">↗</span></button></div></section>
    <div className="experiment-footnote"><span><i /> LIVE PRESET RESPONSE</span><span>MEASUREMENTS UPDATE WITH THE BIAS CONTROL</span></div>
  </div>;
}

export function ExperimentSidePanel({ session }: { session: DiagnosticSession }) {
  return <div className="side-stack experiment-side-stack"><section className="panel circuit-panel experiment-circuit"><div className="panel-heading compact-heading"><div><div className="eyebrow">CIRCUIT / CE–01</div><h2>Common-emitter stage</h2></div><span className="schematic-badge">LIVE CASE</span></div><CircuitDiagram compact baseVoltage={getBiasPreset(session.currentBiasPresetId).baseVoltage} /><div className="circuit-spec-row"><span><i className="spec-cyan" /> VCC <b>10 V</b></span><span><i className="spec-purple" /> RC <b>1 kΩ</b></span><span><i className="spec-pink" /> RE <b>1 kΩ</b></span></div></section><ConceptMap statuses={session.conceptStatuses} edgeStatuses={session.dependencyStatuses} active={session.selectedDependency} /><section className="panel experiment-focus"><div className="eyebrow">INVESTIGATING</div><strong>{session.selectedDependency ? dependencyLabels[session.selectedDependency] : "No unsupported link"}</strong><p>The highlighted dependency is the current verification target.</p></section></div>;
}
