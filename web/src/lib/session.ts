import {
  dependencyPath,
  type DependencyId,
  type ReasoningStatus,
} from "@/data/transistorCase";
import {
  diagnoseReasoning,
  type Diagnosis,
  type EvidenceMapping,
  type ReasoningStatement,
} from "@/lib/diagnosis";

export type AttemptKind = "initial" | "retest-1" | "retest-2";
export type Phase = "landing" | "diagnostic-input" | "trace" | "experiment" | "retest-input" | "summary";

export type ReasoningTrace = {
  attempt: AttemptKind;
  rawText: string;
  statements: ReasoningStatement[];
  edges: Diagnosis["edges"];
  evidence: EvidenceMapping[];
};

export type DiagnosticSession = {
  caseId: "transistor-amplifier-gain-drop";
  phase: Phase;
  reTestCount: 0 | 1 | 2;
  maxReTests: 2;
  currentBiasPresetId: string;
  traces: ReasoningTrace[];
  dependencyStatuses: Record<DependencyId, ReasoningStatus>;
  conceptStatuses: Record<string, ReasoningStatus>;
  selectedDependency: DependencyId | null;
  experimentObservations: {
    biasPresetId: string;
    baseVoltage: number;
    collectorCurrent: number;
    collectorEmitterVoltage: number;
    region: "cutoff" | "forward-active" | "saturation";
    studentExplanation: string;
    targetedDependency: DependencyId;
  }[];
  interventionResults: { afterAttempt: 1 | 2; dependencyId: DependencyId; result: "repaired" | "still-unresolved"; evidenceStatementIds: string[] }[];
  verification: "in-progress" | "repaired" | "unresolved";
  unresolvedSummary: { dependencyId: DependencyId; explanation: string; evidenceStatementIds: string[] } | null;
  inputFeedback: string | null;
};

const initialDependencies: Record<DependencyId, ReasoningStatus> = {
  "bias-qpoint": "unverified",
  "qpoint-region": "unverified",
  "region-small-signal": "unverified",
  "small-signal-gain": "unverified",
};

export function createSession(): DiagnosticSession {
  return {
    caseId: "transistor-amplifier-gain-drop",
    phase: "landing",
    reTestCount: 0,
    maxReTests: 2,
    currentBiasPresetId: "reference",
    traces: [],
    dependencyStatuses: { ...initialDependencies },
    conceptStatuses: Object.fromEntries(dependencyPath.map((node) => [node.id, "unverified"])),
    selectedDependency: null,
    experimentObservations: [],
    interventionResults: [],
    verification: "in-progress",
    unresolvedSummary: null,
    inputFeedback: null,
  };
}

function deriveConceptStatuses(edges: Diagnosis["edges"]): Record<string, ReasoningStatus> {
  const statusFor = (ids: DependencyId[]) => {
    const rows = edges.filter((edge) => ids.includes(edge.dependencyId));
    if (rows.some((edge) => edge.status === "inconsistent")) return "inconsistent";
    if (rows.some((edge) => edge.status === "incomplete")) return "incomplete";
    if (rows.length && rows.every((edge) => edge.status === "demonstrated")) return "demonstrated";
    return "unverified";
  };
  return {
    bias: statusFor(["bias-qpoint"]),
    qpoint: statusFor(["bias-qpoint", "qpoint-region"]),
    region: statusFor(["qpoint-region", "region-small-signal"]),
    model: statusFor(["region-small-signal", "small-signal-gain"]),
    gain: statusFor(["small-signal-gain"]),
  };
}

export type SessionAction =
  | { type: "START_DIAGNOSTIC" }
  | { type: "SUBMIT_INITIAL"; rawText: string }
  | { type: "RETURN_TO_REASONING" };

export function sessionReducer(state: DiagnosticSession, action: SessionAction): DiagnosticSession {
  if (action.type === "START_DIAGNOSTIC") {
    return { ...state, phase: "diagnostic-input", inputFeedback: null };
  }
  if (action.type === "RETURN_TO_REASONING") {
    return { ...state, phase: "diagnostic-input", inputFeedback: null };
  }
  if (action.type === "SUBMIT_INITIAL") {
    const result = diagnoseReasoning(action.rawText);
    if (result.sufficiency !== "sufficient") {
      return { ...state, phase: "diagnostic-input", inputFeedback: result.message ?? null };
    }
    const trace: ReasoningTrace = {
      attempt: "initial",
      rawText: action.rawText,
      statements: result.statements,
      edges: result.edges,
      evidence: result.mappings,
    };
    const dependencyStatuses = Object.fromEntries(result.edges.map((edge) => [edge.dependencyId, edge.status])) as Record<DependencyId, ReasoningStatus>;
    const selectedDependency = result.edges.find((edge) => edge.status !== "demonstrated")?.dependencyId ?? null;
    return {
      ...state,
      phase: "trace",
      traces: [trace],
      dependencyStatuses,
      conceptStatuses: deriveConceptStatuses(result.edges),
      selectedDependency,
      inputFeedback: null,
    };
  }
  return state;
}
