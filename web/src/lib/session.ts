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
import { getBiasPreset, type OperatingRegion } from "@/lib/circuitModel";

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
  experimentStage: "targeted" | "follow-up";
  traces: ReasoningTrace[];
  dependencyStatuses: Record<DependencyId, ReasoningStatus>;
  conceptStatuses: Record<string, ReasoningStatus>;
  selectedDependency: DependencyId | null;
  experimentObservations: {
    stage: "targeted" | "follow-up";
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
    experimentStage: "targeted",
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
  const statusFor = (id: DependencyId) => edges.find((edge) => edge.dependencyId === id)?.status ?? "unverified";
  return {
    bias: statusFor("bias-qpoint"),
    qpoint: statusFor("bias-qpoint"),
    region: statusFor("qpoint-region"),
    model: statusFor("small-signal-gain"),
    gain: statusFor("small-signal-gain"),
  };
}

export type SessionAction =
  | { type: "START_DIAGNOSTIC" }
  | { type: "SUBMIT_INITIAL"; rawText: string }
  | { type: "RETURN_TO_REASONING" }
  | { type: "START_EXPERIMENT" }
  | { type: "SET_BIAS"; presetId: string }
  | { type: "RECORD_EXPERIMENT"; studentExplanation: string }
  | { type: "SUBMIT_RETEST"; rawText: string };

function answerForTarget(edges: Diagnosis["edges"], target: DependencyId): Diagnosis["edges"][number] {
  return edges.find((edge) => edge.dependencyId === target)!;
}

function makeTrace(attempt: AttemptKind, rawText: string): ReasoningTrace {
  const result = diagnoseReasoning(rawText);
  return { attempt, rawText, statements: result.statements, edges: result.edges, evidence: result.mappings };
}

function statusesFrom(edges: Diagnosis["edges"]): Record<DependencyId, ReasoningStatus> {
  return Object.fromEntries(edges.map((edge) => [edge.dependencyId, edge.status])) as Record<DependencyId, ReasoningStatus>;
}

export function sessionReducer(state: DiagnosticSession, action: SessionAction): DiagnosticSession {
  if (action.type === "START_DIAGNOSTIC") {
    if (state.phase !== "landing") return state;
    return { ...state, phase: "diagnostic-input", inputFeedback: null };
  }
  if (action.type === "RETURN_TO_REASONING") {
    if (state.phase !== "trace") return state;
    return { ...state, phase: "diagnostic-input", inputFeedback: null };
  }
  if (action.type === "START_EXPERIMENT") {
    if (state.phase !== "trace" || !state.selectedDependency || state.verification !== "in-progress") return state;
    return { ...state, phase: "experiment", experimentStage: "targeted", currentBiasPresetId: "reference", inputFeedback: null };
  }
  if (action.type === "SET_BIAS") {
    if (state.phase !== "experiment") return state;
    return { ...state, currentBiasPresetId: getBiasPreset(action.presetId).id };
  }
  if (action.type === "RECORD_EXPERIMENT") {
    if (state.phase !== "experiment" || !state.selectedDependency) return state;
    if (!action.studentExplanation.trim()) {
      return { ...state, inputFeedback: "Add a short explanation of what you observed before moving to the re-test." };
    }
    const preset = getBiasPreset(state.currentBiasPresetId);
    const observation = {
      stage: state.experimentStage,
      biasPresetId: preset.id,
      baseVoltage: preset.baseVoltage,
      collectorCurrent: preset.collectorCurrent,
      collectorEmitterVoltage: preset.collectorEmitterVoltage,
      region: preset.region as OperatingRegion,
      studentExplanation: action.studentExplanation.trim(),
      targetedDependency: state.selectedDependency,
    };
    return {
      ...state,
      phase: "retest-input",
      experimentObservations: [...state.experimentObservations, observation],
      inputFeedback: null,
    };
  }
  if (action.type === "SUBMIT_INITIAL") {
    if (state.phase !== "diagnostic-input") return state;
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
  if (action.type === "SUBMIT_RETEST") {
    if (state.phase !== "retest-input") return state;
    const result = diagnoseReasoning(action.rawText);
    if (result.sufficiency !== "sufficient") {
      return { ...state, phase: "retest-input", inputFeedback: result.message ?? null };
    }
    if (!state.selectedDependency || state.reTestCount >= state.maxReTests) return state;
    const nextCount = (state.reTestCount + 1) as 1 | 2;
    const attempt: AttemptKind = nextCount === 1 ? "retest-1" : "retest-2";
    const trace = makeTrace(attempt, action.rawText);
    const targetEdge = answerForTarget(result.edges, state.selectedDependency);
    const repaired = targetEdge.status === "demonstrated";
    const evidenceStatementIds = targetEdge.evidence.map((statement) => statement.id);
    const currentStatuses = statusesFrom(result.edges);
    const interventionResult = {
      afterAttempt: nextCount,
      dependencyId: state.selectedDependency,
      result: repaired ? "repaired" as const : "still-unresolved" as const,
      evidenceStatementIds,
    };
    const base = {
      ...state,
      traces: [...state.traces, trace],
      reTestCount: nextCount as 0 | 1 | 2,
      dependencyStatuses: currentStatuses,
      conceptStatuses: deriveConceptStatuses(result.edges),
      interventionResults: [...state.interventionResults, interventionResult],
      inputFeedback: null,
    };
    if (repaired) {
      return {
        ...base,
        phase: "summary",
        dependencyStatuses: { ...currentStatuses, [state.selectedDependency]: "demonstrated" },
        conceptStatuses: deriveConceptStatuses(result.edges),
        verification: "repaired",
        unresolvedSummary: null,
      };
    }
    if (nextCount === 1) {
      return { ...base, phase: "experiment", experimentStage: "follow-up", currentBiasPresetId: "reference" };
    }
    return {
      ...base,
      phase: "summary",
      verification: "unresolved",
      unresolvedSummary: {
        dependencyId: state.selectedDependency,
        explanation: targetEdge.explanation,
        evidenceStatementIds,
      },
    };
  }
  return state;
}
