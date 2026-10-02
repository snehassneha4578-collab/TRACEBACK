---
doc: spec
status: approved
---

# TRACEBACK — Technical Spec

**Review state: Ready for review.** The document remains `status: draft` until the learner approves it.

## Locked MVP Rules

These requirements are fixed from the approved PRD and must not be relaxed during implementation:

1. `MAX_RETESTS = 2`. The initial diagnostic is not a re-test.
2. Preserve the initial reasoning trace, Re-Test 1 trace, and Re-Test 2 trace if reached, including the exact student text, numbered statements, evidence mappings, and status explanations.
3. If a re-test demonstrates the target dependency, mark it **Repaired**, complete verification, and show the before/after reasoning traces and map states.
4. If Re-Test 1 does not demonstrate the target dependency, show the re-test evidence and explain the still-missing link. Offer exactly one focused follow-up intervention, then allow Re-Test 2.
5. If Re-Test 2 still does not demonstrate the target dependency, stop. Mark it **Unresolved**, show a concise summary naming the unsupported dependency and evidence, and offer no further intervention or re-test.
6. Empty reasoning does not run diagnosis, create a trace, or consume an attempt.
7. Too-vague or insufficient reasoning remains **Unverified**, does not run gap diagnosis, and requests more evidence. It does not consume an attempt.
8. Only sufficient reasoning may proceed in this order: **REASONING → EVIDENCE MAPPING → GAP DIAGNOSIS**.
9. Session data exists for the current browser session only.
10. No accounts, backend, database, cross-session history, or long-term learner tracking.
11. During the active session, preserve all reasoning traces, evidence mappings, experiment observations, intervention results, and final verification state.
12. Keep the single transistor-amplifier MVP boundary. Do not add cases or broader platform features.

## How This Works, In Plain Language

The app is one browser page. A set of authored case rules holds the transistor values and the evidence needed for each reasoning link. When a student submits numbered free-text steps, a small rule checker looks for both the relevant ideas and the relationship between them. It keeps the student's exact statements beside each result. If the wording does not match a rule clearly enough, the app says **Unverified** and asks for more reasoning instead of pretending to understand.

The circuit panel uses a small fixed model with a few base-bias settings. Selecting a setting shows its pre-authored collector current, collector-emitter voltage, operating region, and (only in the active region) estimated gain. This demonstrates the relationship between bias, Q-Point, operating region, the small-signal model, and gain; it is not a general circuit simulator.

The app keeps the current diagnostic in the browser's working memory while the learner moves between views. There is no server, account, database, AI service, or saved history. Refreshing or closing the page ends that session. This shape keeps the proof focused and makes its diagnosis rules inspectable.

## The Core Journey Through the System

```text
Open the lab
  → Read the gain-drop challenge and see the five-node map
  → Enter free-text reasoning
  → Split it into numbered statements
  → Match statements to authored evidence rules
  → See cited evidence, statuses, and the first unresolved dependency
  → Change base-bias preset and observe Q-Point/region
  → Explain the observation
  → Submit a different but related re-test
  → Compare its trace with the original
  → Repaired, or one focused follow-up and a second re-test
  → Repaired or Unresolved session summary
```

PRD ref: `prd.md > The Core Journey`, `prd.md > Reasoning Trace and Gap Diagnosis`, `prd.md > Targeted Micro-Experiment`, and `prd.md > Re-test, Verification, and Session Summary`.

## Stack

**Recommendation for learner agreement:** Next.js App Router with TypeScript, built as a client-side single-page lab. This uses the learner's reported Next.js and TypeScript experience. Next.js is more framework than a static React-only page needs, but it gives the app a familiar structure and a straightforward local demo; no Next.js server features, API routes, or server actions are needed. Use one plain CSS file for shared design tokens and app classes, plus native SVG for the graph and circuit, rather than adding a UI, chart, or diagram dependency.

- **Next.js 16.x App Router** — route and project structure. The current official docs describe the App Router and the official setup command. [App Router docs](https://nextjs.org/docs/app), [installation](https://nextjs.org/docs/app/getting-started/installation).
- **React** — the interactive lab UI. Use the compatible React version installed by the official current `create-next-app` CLI. [React documentation](https://react.dev/learn).
- **TypeScript** — the learner has used it; use the compatible version installed by the official scaffold and keep exact dependency versions in `web/package-lock.json`. [TypeScript handbook](https://www.typescriptlang.org/docs/).
- **Node.js 20.9 or newer and npm** — required for the current Next.js line. [Next.js system requirements](https://nextjs.org/docs/app/getting-started/installation#system-requirements).

Versions move over time. At this spec's date (2026-10-02), Next.js 16.3 and React 19.3 are current official releases; scaffold at build time with `create-next-app@latest` and keep the generated lockfile as the exact compatibility record. Do not upgrade dependencies mid-build without need. [Next.js 16.3](https://nextjs.org/blog), [React 19.3](https://react.dev/blog/2026/09/09/react-19-3).

## Where It Runs and How Someone Tries It

- Run locally in a modern desktop or mobile browser; no deployment is required for the demo.
- Create the new app in its own `web/` directory with `npx create-next-app@latest web --typescript --app --src-dir --use-npm --no-tailwind`; this avoids collisions with the curriculum and `devpost/` files at the repository root. Keep the source entirely new; do not copy NEXUS code or assets.
- From the repository root, enter `web/`, install the locked dependencies with `npm ci`, then run `npm run dev` and open `http://localhost:3000`.
- The demo can be recorded locally. The submission still needs a short demo video and a public GitHub repository; a deployed URL is optional.
- No API keys, accounts, external services, or network calls from the app are required. Dependency installation needs network access once; the running diagnostic does not.

## Look and Feel

Translate `prd.md > Look and Feel` into a near-black/navy interface with CSS color tokens for cyan, electric blue, purple, pink, and magenta accents. Use restrained glow and translucent panel surfaces; keep small text readable and avoid low-contrast neon. Make the dependency map and statement-to-evidence links the visual focus. Draw the dependency graph and simplified circuit with inline SVG, with text labels and a stacked layout on narrow screens. Use a system sans-serif for reading and a system monospace face for measurements and telemetry; no remote fonts or decorative asset service. Motion is subtle and can be disabled with the browser's reduced-motion preference.

## Components

### Lab Shell and Session Controller

Owns the current phase and in-memory session record. It switches the single lab view between the case, reasoning input, trace, experiment, re-test, and summary. It does not write to `localStorage`, `sessionStorage`, cookies, or a server.

PRD ref: `prd.md > Screens and Layout`, `prd.md > States and Boundaries`, `prd.md > Re-test, Verification, and Session Summary`.

### Authored Case and Dependency Map

Holds the fixed case prompt, circuit constants, base-bias presets, dependency edges, evidence rules, re-test prompt, follow-up prompts, and explanatory copy. Renders the five concept nodes and four directed dependencies. The map always distinguishes node understanding from a bare score by showing statuses and evidence links.

PRD ref: `prd.md > Active Case and Reasoning Input`, `prd.md > Reasoning Trace and Gap Diagnosis`.

### Reasoning Input and Trace View

Captures only text typed by the student, splits non-empty lines into numbered statements, and displays each saved statement verbatim with its evidence mapping. The placeholder is visual guidance only and is never passed to the rule checker. Empty submissions do not create a trace attempt.

PRD ref: `prd.md > Active Case and Reasoning Input`, `prd.md > Reasoning Trace and Gap Diagnosis`.

### Deterministic Evidence Evaluator

Applies authored cue and relationship rules to the student's numbered statements. It returns node statuses, edge statuses, cited statement IDs, concise explanations, and the first target dependency in path order. It does not call an LLM or claim general natural-language understanding.

PRD ref: `prd.md > Reasoning Trace and Gap Diagnosis`.

### Circuit Model and Bias Experiment

Maps one of five allowed base-bias presets to precomputed circuit readings. It updates the displayed Q-Point, operating region, and active-region gain estimate immediately, compares the selected state with the original state, and records the student's observation and explanation.

PRD ref: `prd.md > Targeted Micro-Experiment`.

### Re-test, Follow-up, and Session Summary

Applies the authored related re-test prompt, compares the newly evaluated target dependency with its earlier trace, and increments the re-test counter only after sufficient reasoning passes the evidence gate and is evaluated. `MAX_RETESTS = 2`: a failed first re-test produces exactly one edge-specific follow-up intervention; a failed second re-test ends **Unresolved** with no further loop. A demonstrated target edge ends **Repaired** with completed verification. The summary shows before/after reasoning and reads all observations from the same current-session record.

PRD ref: `prd.md > Re-test, Verification, and Session Summary`.

## Case Model and Circuit Values

**Proposed fixed educational model for review.** It is a predictable teaching aid, not a SPICE model or a claim about a particular transistor part. The case uses an NPN common-emitter stage with:

- Supply `VCC = 10 V`
- Collector resistor `RC = 1.0 kΩ`
- Emitter resistor `RE = 1.0 kΩ`
- Emitter bypass capacitor `CE = 100 μF`; for the midband gain estimate, treat it as an AC short
- Controlled base voltage `VB` at the base node
- Simplified turn-on voltage `VBE = 0.70 V`, saturated base-emitter drop `VBE,sat = 0.90 V`, thermal voltage `VT = 26 mV`, and forward-active / saturation boundary `VCE = 0.40 V`
- High-beta approximation `IC ≈ IE`; ignore Early effect, loading, tolerances, temperature, and transistor-to-transistor variation

The active-region estimate is `IE = (VB − 0.70 V) / RE`, `IC ≈ IE`, `VE = IE × RE`, `VC = VCC − IC × RC`, and `VCE = VC − VE`. The simplified region rule is: cutoff at `VB ≤ 0.70 V`; forward active above turn-on while the active estimate has `VCE > 0.40 V`; saturation when the active estimate reaches `VCE ≤ 0.40 V`. For the saturated display row, use the simplified load line: `IC ≈ (VCC − VCEsat) / (RC + RE) = 4.80 mA`, `VE = IC × RE = 4.80 V`, `VC = VE + VCEsat = 5.20 V`. Clamp the displayed saturation point to the load line. The 0.40 V boundary is an explicit model convention drawn from Berkeley EE 105's teaching example for the boundary between deep saturation and forward active; it is not a universal transistor threshold. [Berkeley EE 105 common-emitter prelab](https://people.eecs.berkeley.edu/~wu/ee105/Lab_Solutions/Lab4_Prelab_Solutions.pdf).

For a forward-active state, estimate `gm = IC / VT` and voltage-gain magnitude `|Av| ≈ gm × RC`. This relies on the emitter bypass assumption and ignores loading. A common-emitter stage inverts the signal; TRACEBACK displays gain magnitude to match the case's positive “50 to 18” wording. Berkeley EE 105 likewise connects the Q-Point to small-signal parameters and gain, and uses `gm = IC/VT`. [Berkeley EE 105 small-signal prelab](https://people.eecs.berkeley.edu/~wu/ee105/Lab_Solutions/Lab4_Prelab_Solutions.pdf), [MIT OCW BJT operating regions](https://ocw.mit.edu/courses/6-071j-introduction-to-electronics-signals-and-measurement-spring-2006/resources/20_bjt_2/).

| Preset | `VB` | Displayed `IC` | Displayed `VC` | Displayed `VE` | Displayed `VCE` | Region | Estimated `|Av|` |
|---|---:|---:|---:|---:|---:|---|---:|
| Cutoff | 0.60 V | 0.00 mA | 10.00 V | 0.00 V | 10.00 V | Cutoff | Not applicable |
| Gain-drop state | 1.17 V | 0.47 mA | 9.53 V | 0.47 V | 9.06 V | Forward active | 18.1 |
| Re-test state | 1.50 V | 0.80 mA | 9.20 V | 0.80 V | 8.40 V | Forward active | 30.8 |
| Original reference | 2.00 V | 1.30 mA | 8.70 V | 1.30 V | 7.40 V | Forward active | 50.0 |
| Saturation | 5.70 V | 4.80 mA | 5.20 V | 4.80 V | 0.40 V | Saturation | Not applicable |

The table is the runtime source of truth: an accessible discrete slider has five stops, mapped to these five bias settings, and shows the voltage and preset name at each stop. It does not permit arbitrary circuit design. The displayed outputs come from the matching authored row. The equations document why the rows have those values. The original-vs-new comparison always shows the original reference beside the selected setting. The 1.17 V and 2.00 V settings reproduce gain magnitudes near 18 and 50 within the intentionally simplified model; cutoff/saturation illustrate when the active-region gain estimate must not be used.

## Deterministic Reasoning Criteria

The five map nodes connect through four evaluated dependencies. The evaluator uses small, authored sets of concept terms, relation cues, and contradiction cues; it evaluates all numbered lines together so a relationship may be stated across adjacent steps. A term match alone never demonstrates a dependency. A demonstrated relation needs the relevant ideas plus an explicit, correct relationship. The app quotes the student's matching line(s), shows the authored expected relationship, and labels unsupported wording **Unverified** rather than guessing.

| Dependency | Demonstrated: required concepts and relationship cues | Incomplete: related ideas appear, dependency is skipped | Inconsistent: explicit contradiction cues |
|---|---|---|---|
| Biasing → Q-Point | A base/bias term and operating-point/current term are connected by a directional relation, e.g. “lower base bias lowers collector current and moves the Q-Point” or “changing the bias changes the DC point.” For the preset comparisons, decreasing `VB` from 2.00 V to 1.17 V reduces `IC` from 1.30 mA to 0.47 mA and raises `VCE` from 7.40 V to 9.06 V. | Mentions bias, collector current, or Q-Point but has no causal/directional link, e.g. “I would check bias and collector current.” | A recognized reverse or denied relationship, e.g. “lower base bias increases collector current” or “base bias cannot change the Q-Point.” |
| Q-Point → Operating Region | States that the measured/calculated DC operating values classify the region, and applies the case rule: `VB ≤ 0.70 V` is cutoff; otherwise `VCE > 0.40 V` is forward active; `VCE ≤ 0.40 V` is saturation. | Mentions `IC`, `VCE`, or Q-Point but does not use the values to name/classify a region. | Names a region that contradicts the shown values or rules, e.g. calls the 1.17 V state (9.06 V `VCE`) saturation or calls the 5.70 V state (0.40 V `VCE`) forward active. |
| Operating Region → Small-Signal Model | Connects model validity to region: the case's gain estimate applies in forward active; cutoff and saturation invalidate this active-region estimate. | Mentions a region and the model but does not say whether the region permits the model. | Says the active-region estimate remains valid in cutoff/saturation, or says it is invalid for the case's forward-active state. |
| Small-Signal Model → Gain | Connects `gm ≈ IC/VT` and `|Av| ≈ gm × RC` (or an equivalent correct explanation) to the observation that lower active-region `IC` reduces gain magnitude, e.g. 1.30 mA → about 50 and 0.47 mA → about 18. | Mentions gain, current, or the model but skips the causal relationship. | Claims gain is independent of `IC` under this case model or explicitly reverses the direction. |

Status resolution for each dependency is deterministic: a recognized contradictory cue wins if it conflicts with a supporting cue; otherwise a fully supported relationship is **Demonstrated**; related concepts without the edge are **Incomplete**; no usable evidence or unrecognized phrasing is **Unverified**. Every final status points to the relevant response line(s). For natural-language evaluation, use a small allowlist of term aliases and relation patterns for these four rows, including simple negative cues (“not,” “doesn't,” “cannot”) and directional words (“lower,” “higher,” “increase,” “decrease”). Evaluate each full statement and adjacent pair of statements; do not infer from isolated keywords. Do not claim arbitrary paraphrase understanding. If the relationship is not covered clearly by an authored pattern, return **Unverified** and let the student clarify. A node is displayed **Demonstrated** only when the evidence for its relevant adjacent dependencies is demonstrated; if one is inconsistent, the node is inconsistent; otherwise an incomplete dependency makes it incomplete; insufficient evidence makes it unverified. The edge remains the canonical target for intervention and verification. The four statuses are the only diagnostic confidence display; do not add a probability or composite score.

**Sufficiency gate:** ignore blank lines and the visual placeholder. If the response is empty, remain on the input view and say: “Your explanation is too short to trace your reasoning. Add a few steps describing what you would check and why.” Do not create a trace, run diagnosis, or consume an attempt. If non-empty text is too vague (fewer than two non-empty reasoning lines, or no recognized case-related idea/measurement cue), remain on the input view, mark affected dependencies **Unverified**, explain that there is not enough evidence to determine understanding, and ask: “What would you check first, what would you expect to change, and how would that affect the amplifier?” Do not run gap diagnosis or increment the re-test count. Once sufficient reasoning passes the gate, persist the trace and perform, in sequence, **REASONING → EVIDENCE MAPPING → GAP DIAGNOSIS**. Edges with no direct evidence after that gate are **Unverified**. This encourages the PRD's 3–6 step format without making students fill a rigid form.

Unmatched or ambiguous wording never defaults to Demonstrated or Inconsistent; mark the edge Unverified and ask the student to restate the relationship. If a response contains both a recognized correct and incorrect claim about one edge, the incorrect claim wins and both supporting and conflicting statement citations are shown.

For the visible manual walkthrough, use this response as typed demo input (never as placeholder or prefilled answer):

1. “The gain drop could come from bias, and I would check collector current.”
2. “I would call it saturated because VCE is high.”
3. “The active-region small-signal model still applies even then.”
4. “Gain depends on collector current; lower IC lowers gm and gain.”

Expected result: **Biasing → Q-Point: Incomplete** (bias and current are mentioned but their relationship is not stated); **Q-Point → Operating Region: Inconsistent** (high VCE is mislabeled saturation); **Operating Region → Small-Signal Model: Inconsistent** (the response applies the active-region model despite claiming saturation); **Small-Signal Model → Gain: Demonstrated** (the current-to-gm-to-gain direction is explicit). Each result cites its corresponding line(s).

## Diagnostic, Re-test, and Follow-up Content

### Initial diagnostic

Keep the prompt exactly as approved: **“The amplifier gain suddenly dropped from 50 to 18. Diagnose what could have caused it.”** Show the reference circuit context (the fixed values, original 2.00 V base setting, and that the observed gain is magnitude) without identifying a weak concept. A built-in demonstration response, if used for presentation, must be explicitly labeled as a demonstration and must not appear in the student input placeholder.

### Related but different re-test

Use this authored prompt: **“An otherwise identical amplifier now has its base-bias setting at 1.50 V. Its DC readings are IC ≈ 0.80 mA and VCE ≈ 8.40 V. Explain what this operating condition means for its response and whether a small-signal gain estimate is appropriate. Show how you reached your conclusion.”** This is a different bias condition and readings from the gain-drop prompt. It requires the student to use the targeted relationship in their own reasoning; it does not reveal the expected result. The expected forward-active gain magnitude is about 30.8, but do not show this as a hint before submission.

### Follow-up after failed Re-test 1

Repeat the same controlled experiment and target only the first unresolved dependency in path order (Biasing → Q-Point → Operating Region → Small-Signal Model → Gain). Do not introduce another circuit or case. Use the appropriate focused prompt:

- **Biasing → Q-Point:** compare 2.00 V with 1.17 V and ask what changes in the DC point and why.
- **Q-Point → Operating Region:** compare the 0.60 V cutoff and 5.70 V saturation readings; ask how the displayed DC values support a region label.
- **Operating Region → Small-Signal Model:** compare the 2.00 V active and 5.70 V saturated states; ask when the case's gain estimate is valid.
- **Small-Signal Model → Gain:** compare the 2.00 V and 1.17 V forward-active states; ask how their `IC` readings affect `gm` and gain magnitude.

These are prompts for investigating the dependency, not answer text. After a sufficient Re-Test 1 response fails to demonstrate its target dependency, explain the remaining link using the student's cited re-test evidence, then offer exactly one edge-specific follow-up intervention. The prompts above are alternatives selected by the target dependency, not a sequence of interventions. After that one follow-up, permit Re-Test 2 only. If it does not demonstrate the target edge, mark it **Unresolved**, preserve both reached re-test traces and all session evidence, show the unsupported dependency and why in a concise summary, and stop with no further intervention or re-test.

## End-to-End Acceptance Criteria

Use these as visible, manual acceptance checks in `5-build`; they do not require a separate testing framework.

1. **Start:** Opening the app shows the single gain-drop mission, the exact approved prompt, circuit context, five-node map, and **Start Diagnostic**. No other cases or dashboard metrics appear.
2. **Input:** Starting the mission opens the free-text reasoning view. Empty text requests reasoning and creates no attempt. Placeholder text is excluded from saved trace data. Insufficient or unsupported wording produces Unverified evidence and a clarification request, never a false Incorrect result.
3. **Diagnosis:** Submitting the authored evidence example creates a numbered trace. Every one of the four dependency edges has a deterministic status and statement citation; at least one supported, one skipped, and one explicitly contradictory relation are visibly distinguishable with reasons.
4. **Circuit:** The original setting is 2.00 V with approximately `IC=1.30 mA`, `VCE=7.40 V`, forward-active, and gain magnitude 50. Selecting 1.17 V shows approximately `IC=0.47 mA`, `VCE=9.06 V`, forward-active, and gain magnitude 18.1; the original and selected readings appear together. Selecting 0.60 V shows cutoff; selecting 5.70 V shows saturation at the 0.40 V model boundary. Readouts always come from the authored model/table.
5. **Targeted intervention:** The micro-experiment highlights the selected unresolved dependency, records the selected bias and resulting readings, and accepts a student explanation. It does not show the expected answer before submission.
6. **Successful verification:** A sufficient re-test answer that satisfies the target edge's positive evidence rule marks the target **Repaired**, completes verification, preserves the initial and applicable re-test traces plus experiment observations, and shows before/after reasoning traces and map states in the session summary. This works on either Re-Test 1 or Re-Test 2.
7. **Failed verification:** If sufficient Re-Test 1 reasoning lacks or contradicts the target edge, cite the evidence, explain the still-missing link, and offer exactly one edge-specific follow-up intervention. If sufficient Re-Test 2 reasoning still does not demonstrate the edge, end **Unresolved**, name that dependency and evidence in a concise summary, and offer no third intervention or re-test.
8. **Session boundary:** Moving among all views preserves the current session data: initial and reached re-test traces, evidence mappings, experiment observations, intervention results, and final verification. Refreshing or opening a new page starts the first-use view with a new empty session. No account data or prior session data are loaded or stored.
9. **Strict boundary:** The complete check uses only this transistor-amplifier case and fixed readings; no API, database, external model, extra scenario, or arbitrary circuit design is needed.

## Components and Session Data

### Data types

```ts
type DependencyId = "bias-qpoint" | "qpoint-region" | "region-small-signal" | "small-signal-gain";
type Status = "demonstrated" | "incomplete" | "inconsistent" | "unverified";
type AttemptKind = "initial" | "retest-1" | "retest-2";

type EvidenceMapping = {
  statementId: string;
  dependencyId: DependencyId;
  status: Status;
  matchedText: string;
  explanation: string;
};

type ReasoningTrace = {
  attempt: AttemptKind;
  rawText: string;
  statements: { id: string; text: string }[];
  evidence: EvidenceMapping[];
};

type ExperimentObservation = {
  biasPresetId: string;
  baseVoltage: number;
  collectorCurrent: number;
  collectorEmitterVoltage: number;
  region: "cutoff" | "forward-active" | "saturation";
  studentExplanation: string;
  targetedDependency: DependencyId;
};

type DiagnosticSession = {
  caseId: "transistor-amplifier-gain-drop";
  phase: "landing" | "diagnostic-input" | "trace" | "experiment" | "retest-input" | "summary";
  reTestCount: 0 | 1 | 2;
  maxReTests: 2;
  currentBiasPresetId: string;
  traces: ReasoningTrace[];
  dependencyStatuses: Record<DependencyId, Status>;
  conceptStatuses: Record<string, Status>;
  selectedDependency: DependencyId | null;
  experimentObservations: ExperimentObservation[];
  interventionResults: { afterAttempt: 1 | 2; dependencyId: DependencyId; result: "repaired" | "still-unresolved"; evidenceStatementIds: string[] }[];
  verification: "in-progress" | "repaired" | "unresolved";
  unresolvedSummary: { dependencyId: DependencyId; explanation: string; evidenceStatementIds: string[] } | null;
};
```

The fixed case, dependency graph, rule cues, bias table, and prompts are authored constants, not session data. `maxReTests` is always `2`; the initial diagnostic is not counted. `reTestCount` increments only when a sufficient re-test answer passes the evidence gate and its trace is evaluated; empty or too-vague responses do not create a trace, run diagnosis, or consume a re-test. Keep the initial trace first and any reached re-test traces in order. Keep evidence IDs tied to statement IDs so each status remains auditable. Experiment observations include selected bias and resulting readings, targeted dependency, and the student's explanation. `interventionResults` records each evaluated re-test outcome; `unresolvedSummary` is populated only when Re-Test 2 fails. Do not clear the record while changing phases.

On a new session, initialize every dependency and concept status as `unverified`, `selectedDependency` and `unresolvedSummary` as `null`, arrays as empty, `reTestCount` as `0`, `maxReTests` as `2`, verification as `in-progress`, and the bias preset as the 2.00 V reference. Current session means this in-memory browser app instance only: no local or session storage, cookies, backend, database, account, synchronization, or cross-session tracking. Reload/close discards the record by design.

### Where the data lives

The `DiagnosticSession` lives only in a React reducer inside the client-side lab component. Inputs update the in-memory session; the rule evaluator returns trace/status data to that reducer; experiment selection appends a reading and explanation; summary reads the same record. The UI's phase changes do not clear the record. Reloading, closing the tab, or opening a new page starts a fresh session. There is no browser storage, account, database, server, or synchronization.

## File Structure

```text
TRACEBACK/
├── devpost/
│   ├── learner-profile.md       # Personal workflow context; ignored by Git
│   ├── scope.md                 # Approved project scope
│   ├── prd.md                   # Approved product behavior
│   └── spec.md                  # This implementation blueprint
├── web/                         # New app; no NEXUS code or assets
│   ├── src/app/
│   │   ├── layout.tsx           # Page shell, metadata, global styles
│   │   ├── page.tsx             # Entry route renders the lab
│   │   └── globals.css          # Responsive theme and shared tokens
│   ├── src/components/
│   │   ├── DiagnosticLab.tsx    # Client-side flow and reducer
│   │   ├── ConceptMap.tsx       # Five nodes, four dependencies, statuses
│   │   ├── ReasoningInput.tsx   # Neutral prompt and free-text input
│   │   ├── ReasoningTrace.tsx   # Statements, evidence, and rationale
│   │   ├── BiasExperiment.tsx   # Preset control, readings, explanation
│   │   └── SessionSummary.tsx   # Before/after traces and final status
│   ├── src/data/transistorCase.ts # Fixed prompt, model table, evidence cues
│   ├── src/lib/circuitModel.ts  # Reading selection and gain calculation
│   ├── src/lib/diagnosis.ts     # Deterministic evidence evaluation
│   ├── src/lib/session.ts       # Session types and reducer transitions
│   ├── package.json             # Scripts and dependencies
│   ├── package-lock.json        # Exact installed dependency versions
│   └── .gitignore               # Generated app files and local secrets
└── .gitignore                   # Repository ignore rules
```

## External Services and Dependencies

There are no runtime external services, calls, credentials, costs, or rate limits. The npm registry is needed to create/install the app dependencies; the app itself runs locally without a network connection. Use native SVG and CSS, not a chart package or hosted model.

Primary references for the proposed stack and case model:

- [Next.js App Router and setup](https://nextjs.org/docs/app/getting-started/installation)
- [React documentation](https://react.dev/learn)
- [TypeScript handbook](https://www.typescriptlang.org/docs/)
- [Berkeley EE 105 common-emitter and small-signal prelab](https://people.eecs.berkeley.edu/~wu/ee105/Lab_Solutions/Lab4_Prelab_Solutions.pdf)
- [MIT OCW BJT operating-region notes](https://ocw.mit.edu/courses/6-071j-introduction-to-electronics-signals-and-measurement-spring-2006/resources/20_bjt_2/)

## Important Failure Modes

- **Student uses an unrecognized paraphrase** → show the unmatched statement and mark its relationship **Unverified**; invite clarification rather than falsely marking it wrong.
- **Bias selector or reading is unavailable** → keep the last valid preset and show a plain message; do not record a fabricated experiment observation.
- **Browser refresh or tab close** → start a fresh diagnostic; the prior in-memory session is gone by design. This is the agreed session-only boundary.

## What Was Simplified and Why

- Use five authored bias states instead of arbitrary circuit design — the table demonstrates active, cutoff, and saturation behavior without a general simulator.
- Use an idealized piecewise transistor model instead of SPICE or a physical device model — predictable readings make the reasoning criteria reproducible; real devices vary with part and conditions.
- Use authored deterministic text cues instead of an LLM or advanced AI/ML scorer — the student can inspect why a rule fired, and the MVP avoids API keys, costs, and unvalidated scores. The tradeoff is that unfamiliar paraphrases may remain Unverified.
- Keep all case data and session state in the frontend — this proves the current-session loop without accounts, database, or server work.

## Decisions and Open Issues

- **Learner's fixed product decisions:** one transistor-amplifier case, five-node chain, deterministic evidence rules, exact initial diagnostic prompt, targeted experiment, two re-tests maximum, repaired/unresolved ending, and current-session-only state; no accounts, persistent history, arbitrary simulator, additional cases, or complex AI/ML scoring.
- **Stack recommendation requiring learner agreement:** Next.js App Router + TypeScript, one client-side lab, CSS, and native SVG. Reason: familiar technologies and straightforward local demo. Tradeoff: more framework structure than a static React app needs. No backend is used.
- **Proposed engineering assumptions requiring learner review:** fixed component values, idealized `VBE`, `VT`, and `VCE` thresholds; five base-bias presets; gain estimate and re-test/follow-up wording in this spec. These are explicitly educational assumptions, not a general transistor model.
- **Multiple-gap rule for agreement:** show every diagnosed link, but target the first non-demonstrated dependency in path order so the intervention addresses the earliest missing prerequisite. Non-target gaps keep their statuses in the summary.
- **Useful uncertainty and how to investigate it:** how to diagnose free-text reliably without claiming general language understanding. The agreed direction is explicit relationship rules and statement citations; unmatched wording stays Unverified. During build, manually inspect a small set of clear, incomplete, contradictory, and paraphrased sample responses against the rules and revise the authored cues before the demo.
- **Before the build:** agree on the stack recommendation, circuit assumptions/presets and threshold, rule table, retest/follow-up wording, and first-gap targeting rule. If you change any proposed detail, keep the one-case boundary fixed.
