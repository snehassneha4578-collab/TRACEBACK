import {
  dependencyRules,
  type DependencyId,
  type ReasoningStatus,
} from "@/data/transistorCase";

export type ReasoningStatement = { id: string; text: string };
export type EvidenceMapping = {
  statementId: string;
  dependencyId: DependencyId;
  status: ReasoningStatus;
  matchedText: string;
  explanation: string;
};
export type EdgeDiagnosis = {
  dependencyId: DependencyId;
  status: ReasoningStatus;
  evidence: ReasoningStatement[];
  expected: string;
  explanation: string;
};
export type Diagnosis = {
  sufficiency: "empty" | "insufficient" | "sufficient";
  message?: string;
  statements: ReasoningStatement[];
  edges: EdgeDiagnosis[];
  mappings: EvidenceMapping[];
};

const patterns: Record<DependencyId, { relevant: RegExp; supports: RegExp[]; contradicts: RegExp[] }> = {
  "bias-qpoint": {
    relevant: /\b(bias|base|collector current|\bIC\b|q[ -]?point|operating point)\b/i,
    supports: [
      /\b(bias|base voltage)\b.{0,90}\b(change|shift|move|lower|decrease|reduce|increase|raise)\b.{0,70}\b(q[ -]?point|operating point|collector current|\bIC\b)\b/i,
      /\b(lower|decrease|reduce|increase|raise)\b.{0,35}\b(base bias|bias|base voltage)\b.{0,65}\b(collector current|\bIC\b|q[ -]?point|operating point)\b/i,
      /\b(changing|change in)\b.{0,20}\bbias\b.{0,45}\b(moves|changes|shifts)\b.{0,20}\b(q[ -]?point|operating point)\b/i,
    ],
    contradicts: [
      /\b(lower|decrease|reduce)\b.{0,35}\b(bias|base voltage)\b.{0,55}\b(increase|raise)\b.{0,25}\b(collector current|\bIC\b)\b/i,
      /\bbias\b.{0,35}\b(cannot|does not|doesn't|never)\b.{0,30}\b(change|move|affect).{0,15}\b(q[ -]?point|operating point|collector current)\b/i,
    ],
  },
  "qpoint-region": {
    relevant: /\b(q[ -]?point|operating point|\bIC\b|\bVCE\b|operating region|forward.active|saturat\w*|cutoff)\b/i,
    supports: [
      /\b(VCE|IC|q[ -]?point|operating point|DC readings?)\b.{0,100}\b(so|therefore|means|indicates|classif\w*|shows|because|above|below)\b.{0,90}\b(forward.active|active region|saturat\w*|cutoff)\b/i,
      /\b(forward.active|active region|saturat\w*|cutoff)\b.{0,100}\b(because|when|if|since|as)\b.{0,100}\b(VCE|IC|q[ -]?point|operating point|DC readings?)\b/i,
      /\bVCE\b.{0,30}(>|above|greater than|<=|≤|below|less than|0\.4).{0,60}\b(forward.active|active region|saturat\w*|cutoff)\b/i,
    ],
    contradicts: [
      /\b(saturat\w*|cutoff)\b.{0,55}\b(because|since|when)\b.{0,55}\b(high|large|above|greater).{0,20}\bVCE\b/i,
      /\b(high|large|above|greater).{0,20}\bVCE\b.{0,55}\b(saturat\w*|cutoff)\b/i,
      /\bVCE\b.{0,40}(?:0\.4|≤|<=|below|less than).{0,50}\b(forward.active|active region)\b/i,
      /\bVCE\b.{0,40}(?:>|above|greater than|8\.|9\.).{0,50}\b(saturat\w*|cutoff)\b/i,
    ],
  },
  "region-small-signal": {
    relevant: /\b(operating region|forward.active|active region|saturat\w*|cutoff|small[ -]?signal|gain model)\b/i,
    supports: [
      /\b(forward.active|active region)\b.{0,90}\b(model|small[ -]?signal|gain estimate)\b.{0,40}\b(valid|appl\w*|appropriate|can use)\b/i,
      /\b(model|small[ -]?signal|gain estimate)\b.{0,80}\b(valid|appl\w*|appropriate|can use)\b.{0,70}\b(forward.active|active region)\b/i,
      /\b(saturat\w*|cutoff)\b.{0,80}\b(model|small[ -]?signal|gain estimate)\b.{0,45}\b(not valid|invalid|cannot|can't|does not apply|not appropriate)\b/i,
      /\b(model|small[ -]?signal|gain estimate)\b.{0,80}\b(not valid|invalid|cannot|can't|does not apply|not appropriate)\b.{0,70}\b(saturat\w*|cutoff)\b/i,
    ],
    contradicts: [
      /\b(saturat\w*|cutoff|even then|outside (?:the )?active region)\b.{0,80}\b(model|small[ -]?signal|gain estimate)\b.{0,40}\b(still|valid|appl\w*|appropriate|can use)\b/i,
      /\b(model|small[ -]?signal|gain estimate)\b.{0,80}\b(still valid|always valid|applies everywhere|works in any region)\b/i,
      /\b(forward.active|active region)\b.{0,80}\b(model|small[ -]?signal|gain estimate)\b.{0,50}\b(not valid|invalid|cannot|does not apply)\b/i,
    ],
  },
  "small-signal-gain": {
    relevant: /\b(small[ -]?signal|gain|collector current|\bIC\b|\bgm\b|\bVT\b|transconductance)\b/i,
    supports: [
      /\b(lower|decrease|reduce|less)\b.{0,45}\b(collector current|\bIC\b)\b.{0,90}\b(lower|decrease|reduce|less)\b.{0,35}\b(gain|\bgm\b|transconductance)\b/i,
      /\b(collector current|\bIC\b)\b.{0,80}\b(proportional|sets|determines|controls|affects)\b.{0,55}\b(gain|\bgm\b|transconductance)\b/i,
      /\b(gm|transconductance)\b.{0,55}\b(IC|collector current|VT)\b.{0,70}\b(gain|lower|reduc|decreas)\w*\b/i,
      /\blower IC\b.{0,40}\blower gm\b.{0,50}\b(lower|reduce|decrease)\w* gain\b/i,
    ],
    contradicts: [
      /\b(lower|decrease|reduce|less)\b.{0,50}\b(collector current|\bIC\b)\b.{0,90}\b(increase|raise|higher)\b.{0,35}\b(gain|\bgm\b)\b/i,
      /\b(gain|\bgm\b)\b.{0,55}\b(independent of|unaffected by|does not depend on|doesn't depend on)\b.{0,40}\b(collector current|\bIC\b)\b/i,
    ],
  },
};

const statusOrder: Record<ReasoningStatus, number> = {
  demonstrated: 0,
  unverified: 1,
  incomplete: 2,
  inconsistent: 3,
};

export function splitStatements(rawText: string): ReasoningStatement[] {
  return rawText
    .split(/\r?\n/)
    .map((text) => text.trim().replace(/^\s*(?:\d+\s*[.)-]|[-*•])\s*/, "").trim())
    .filter(Boolean)
    .map((text, index) => ({ id: `s${index + 1}`, text }));
}

export function checkSufficiency(rawText: string): { kind: "empty" | "insufficient" | "sufficient"; message?: string } {
  if (!rawText.trim()) {
    return { kind: "empty", message: "Your explanation is too short to trace your reasoning. Add a few steps describing what you would check and why." };
  }
  const statements = splitStatements(rawText);
  const hasCaseCue = /\b(amplifier|gain|transistor|collector|base|bias|current|VCE|Q[ -]?point|operating region|small[ -]?signal|gm)\b/i.test(rawText);
  if (statements.length < 2 || !hasCaseCue) {
    return {
      kind: "insufficient",
      message: "There is not enough reasoning evidence to trace your understanding yet. What would you check first, what would you expect to change, and how would that affect the amplifier?",
    };
  }
  return { kind: "sufficient" };
}

function evaluateEdge(dependencyId: DependencyId, statements: ReasoningStatement[]): EdgeDiagnosis {
  const rule = patterns[dependencyId];
  const matching = statements.filter(({ text }) => rule.relevant.test(text));
  const combined = statements.map(({ text }) => text).join(" ");
  const impliedRegionConflict = dependencyId === "region-small-signal"
    && /\b(saturat\w*|cutoff)\b/i.test(combined)
    && /\b(small[ -]?signal|gain model)\b.{0,85}\b(still applies|still valid|applies even then)\b/i.test(combined);
  const conflict = impliedRegionConflict || rule.contradicts.some((pattern) => pattern.test(combined));
  const support = rule.supports.some((pattern) => pattern.test(combined));
  let status: ReasoningStatus;
  if (conflict) status = "inconsistent";
  else if (support) status = "demonstrated";
  else if (matching.length > 0) status = "incomplete";
  else status = "unverified";

  const evidence = matching.length ? matching : [];
  return {
    dependencyId,
    status,
    evidence,
    expected: dependencyRules[dependencyId].expected,
    explanation: dependencyRules[dependencyId].why[status],
  };
}

const edgeOrder: DependencyId[] = ["bias-qpoint", "qpoint-region", "region-small-signal", "small-signal-gain"];

export function diagnoseReasoning(rawText: string): Diagnosis {
  const gate = checkSufficiency(rawText);
  const statements = splitStatements(rawText);
  if (gate.kind !== "sufficient") {
    return { sufficiency: gate.kind, message: gate.message, statements: [], edges: [], mappings: [] };
  }

  const edges = edgeOrder.map((dependencyId) => evaluateEdge(dependencyId, statements));
  const mappings = edges.flatMap((edge) => edge.evidence.map((statement) => ({
    statementId: statement.id,
    dependencyId: edge.dependencyId,
    status: edge.status,
    matchedText: statement.text,
    explanation: edge.explanation,
  })));
  return { sufficiency: "sufficient", statements, edges, mappings };
}

export function combineStatuses(statuses: ReasoningStatus[]): ReasoningStatus {
  return statuses.reduce((worst, status) => statusOrder[status] > statusOrder[worst] ? status : worst, "demonstrated");
}
