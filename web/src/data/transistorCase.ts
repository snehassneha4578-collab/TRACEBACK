export type DependencyId =
  | "bias-qpoint"
  | "qpoint-region"
  | "region-small-signal"
  | "small-signal-gain";

export type ReasoningStatus = "demonstrated" | "incomplete" | "inconsistent" | "unverified";

export const dependencyPath: { id: string; title: string; short: string; color: string }[] = [
  { id: "bias", title: "Biasing", short: "BIAS", color: "cyan" },
  { id: "qpoint", title: "Q-Point", short: "Q-POINT", color: "blue" },
  { id: "region", title: "Operating Region", short: "REGION", color: "purple" },
  { id: "model", title: "Small-Signal Model", short: "MODEL", color: "pink" },
  { id: "gain", title: "Gain", short: "GAIN", color: "magenta" },
];

export const dependencyLabels: Record<DependencyId, string> = {
  "bias-qpoint": "Biasing → Q-Point",
  "qpoint-region": "Q-Point → Operating Region",
  "region-small-signal": "Operating Region → Small-Signal Model",
  "small-signal-gain": "Small-Signal Model → Gain",
};

export const initialDiagnostic = "The amplifier gain suddenly dropped from 50 to 18. Diagnose what could have caused it.";

export const dependencyRules: Record<DependencyId, { expected: string; why: Record<ReasoningStatus, string> }> = {
  "bias-qpoint": {
    expected: "A change in DC base bias changes the transistor's collector current and moves its Q-Point.",
    why: {
      demonstrated: "The explanation connects a base-bias change to a directional change in the DC operating point.",
      incomplete: "Bias and collector current or the Q-Point are both mentioned, but the cause-and-effect link between them is not stated.",
      inconsistent: "The explanation reverses or denies the relationship between base bias and the DC operating point.",
      unverified: "There is not enough evidence here to determine how bias relates to the Q-Point.",
    },
  },
  "qpoint-region": {
    expected: "Use the DC Q-Point values, especially IC and VCE, to classify cutoff, forward-active, or saturation.",
    why: {
      demonstrated: "The explanation uses the DC operating values to support an operating-region classification.",
      incomplete: "The explanation mentions operating-point values or a region, but does not connect the values to the classification.",
      inconsistent: "The stated region conflicts with the case's displayed DC conditions or region thresholds.",
      unverified: "There is not enough evidence to determine how the Q-Point establishes the operating region.",
    },
  },
  "region-small-signal": {
    expected: "Apply this case's small-signal gain model only while the transistor is forward-active.",
    why: {
      demonstrated: "The explanation makes small-signal model validity depend on the operating region.",
      incomplete: "The region and model are both mentioned, but their validity relationship is not explained.",
      inconsistent: "The explanation applies the active-region model in cutoff/saturation, or rejects it for the case's active condition.",
      unverified: "There is not enough evidence to determine when the small-signal model is valid.",
    },
  },
  "small-signal-gain": {
    expected: "In forward-active operation, lower IC lowers gm (gm ≈ IC/VT), reducing the gain magnitude (|Av| ≈ gm × RC).",
    why: {
      demonstrated: "The explanation connects collector current through gm to the gain change in the correct direction.",
      incomplete: "Current, the model, or gain is mentioned, but the causal link to the gain change is skipped.",
      inconsistent: "The explanation reverses or denies the current-to-gm-to-gain relationship used in this case.",
      unverified: "There is not enough evidence to determine how the small-signal model explains gain.",
    },
  },
};
