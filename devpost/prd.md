---
doc: prd
status: approved
---

# TRACEBACK — Product Requirements

TRACEBACK is a focused knowledge-diagnostic lab for undergraduate ECE students. It traces a student's reasoning through one transistor-amplifier case, explains the evidence behind a knowledge-gap diagnosis, and verifies whether a focused intervention repairs the missing link.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`, and `scope.md > The POC Boundary`.

## The Core Journey

1. **Enter the lab.** The student sees the active case, **Transistor Amplifier — Gain Drop**, the challenge (“The amplifier gain suddenly dropped from 50 to 18. Diagnose what could have caused it.”), the dependency path, a brief explanation that TRACEBACK examines reasoning rather than only the final answer, and **Start Diagnostic**.
2. **Explain the diagnosis.** The student writes a short, step-by-step free-text explanation in their own words, guided to provide roughly 3–6 steps. A neutral placeholder suggests a structure without naming concepts or expected links. They submit with **Trace My Reasoning**.
3. **Inspect the trace.** For a response with enough evidence, TRACEBACK shows numbered student statements alongside Biasing → Q-Point → Operating Region → Small-Signal Model → Gain. It maps statements to relevant concepts and dependencies, assigns transparent statuses, and explains each non-demonstrated status with the evidence and missing or inconsistent relationship.
4. **Investigate the targeted gap.** The student chooses **Run Targeted Micro-Experiment**. In a controlled bias-shift experiment, they change base bias, observe the original and updated Q-point values (I_C and V_CE) and operating-region status, then explain what changed and why it may affect the small-signal gain model.
5. **Re-test.** The student uses **Re-Test My Reasoning** to explain a related but not identical diagnostic situation. TRACEBACK compares this trace with the initial one, focusing on the dependency selected for intervention.
6. **Verify or focus again.** If the target dependency is demonstrated, TRACEBACK marks it **Repaired** and shows before/after traces and the updated map. If it remains unsupported after the first re-test, TRACEBACK explains why and offers one focused follow-up intervention. After the second re-test, it either verifies the repair or marks the dependency **Unresolved** and stops the loop.
7. **Review the session.** The final summary shows the before/after reasoning traces, intervention observations, and final knowledge-map state. The session's information is available during this diagnostic session only; there are no accounts or cross-session history.

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`, and `scope.md > The POC Boundary`.

## Screens and Layout

TRACEBACK is one focused lab experience with views that change as the student progresses, rather than a general dashboard.

- **Knowledge Diagnostic Lab:** Presents the active case, gain-drop prompt, simplified concept dependency map, a short explanation of how reasoning is evaluated, and the primary **Start Diagnostic** action. Keep the visual hierarchy focused on the case; do not crowd this entry view with unrelated dashboard metrics.
- **Reasoning input:** Presents the diagnostic prompt and a large free-text area. Show a neutral numbered-step structure hint; do not reveal the target concepts or expected reasoning. The placeholder disappears on typing and is never treated as student evidence.
- **Reasoning Trace:** Shows numbered student statements beside the dependency map. Each statement maps to evidence, concept, dependency, and status. Selecting or viewing a non-demonstrated concept reveals the relevant student statement, expected relationship, what was missing or inconsistent, and why that led to the status.
- **Micro-Experiment:** Highlights the targeted dependency path and shows a controlled base-bias adjustment. The original and updated I_C, V_CE, and operating-region status are visible side by side. The student explains the observed change before re-testing.
- **Re-test and session summary:** Shows the related follow-up challenge, reasoning trace, comparison to the original, repaired or unresolved outcome, and updated dependency map. Preserve all traces and observations through the session and include them in the final summary.

Source: `scope.md > What "Working" Looks Like`, `scope.md > The POC Boundary`, and `scope.md > Inspiration & Identity`.

## Look and Feel

Use a premium, futuristic engineering-AI lab or cockpit identity: near-black/navy foundation, neon cyan, electric blue, purple, pink, and magenta accents, subtle glows, glass-like panels with luminous edges, engineering diagrams, dependency paths, and restrained telemetry/data visualization. Use futuristic typography while keeping prompts and reasoning evidence easy to read. Make the dependency graph and evidence the visual focus; avoid generic chatbot styling and unrelated dashboard metrics. The layout should adapt to smaller screens.

Source: `scope.md > Inspiration & Identity`.

## Features and Behavior

### Active Case and Reasoning Input

The single case is **Transistor Amplifier — Gain Drop**. It asks the student to diagnose the change in gain from 50 to 18. The student explains what they would check, what relationships they expect, and how observations lead to the next step. Encourage approximately 3–6 numbered steps, but keep the response in the student's own words; do not require concept selection or use multiple-choice answers.

The input placeholder may show only a neutral response structure, such as “I would first check… / I would expect to observe… / If that changes, I would then investigate… / This could affect the amplifier because…”. It disappears when the student types and is excluded from all reasoning evidence.

- **Acceptance criteria**
  - The entry view identifies the one case, states the challenge, displays the five-link dependency path, explains that reasoning is evaluated, and offers **Start Diagnostic**.
  - The reasoning view provides the challenge, free-text input, neutral structure hint, and **Trace My Reasoning** action.
  - An empty response is not analyzed and does not consume an attempt. The student is asked to add a few reasoning steps describing what they would check and why.
  - If evidence is insufficient, the relevant concepts remain **Unverified**; TRACEBACK does not label lack of evidence incorrect. It explains the limitation and asks what the student would check, what relationship they expect, and why. The normal diagnosis proceeds only once there is enough evidence.
  - The neutral placeholder never appears as a student claim in the trace.

Source: `scope.md > The Core Loop` and `scope.md > The POC Boundary`.

### Reasoning Trace and Gap Diagnosis

TRACEBACK evaluates the authored case against **Biasing → Q-Point → Operating Region → Small-Signal Model → Gain**. It processes meaningful response steps and makes the path from student statement to diagnosis visible:

**Student Statement → Evidence → Concept → Dependency → Status**

Statuses are defined as follows:

- **Demonstrated:** the required reasoning relationship is clearly present and correct.
- **Incomplete:** related concepts are mentioned, but an important reasoning link is skipped.
- **Inconsistent:** the explanation contains a contradiction or incorrect relationship.
- **Unverified:** the explanation does not provide enough evidence to determine understanding.

The prototype uses explicit, deterministic criteria authored for this case. A confidence indicator, if shown, is secondary and reflects the amount and quality of supporting evidence; it is not a scientifically validated probability score.

- **Acceptance criteria**
  - Every meaningful mapped statement can be followed from the student's words to the concept and dependency it supports or fails to support.
  - The map visibly distinguishes Demonstrated, Incomplete, Inconsistent, and Unverified concepts.
  - Every Incomplete, Inconsistent, or Unverified result includes the relevant student evidence, the expected relationship, the missing/skipped/contradictory point, and a concise explanation of why it received that status.
  - A diagnosis never consists solely of an unexplained score.
  - Given the authored demonstration response for the case, TRACEBACK shows the expected statuses and evidence-based rationale for the demonstrated, incomplete, and inconsistent links.

Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, and `scope.md > What "Working" Looks Like`.

### Targeted Micro-Experiment

The intervention focuses on the diagnosed dependency. For a Q-Point or operating-region gap, the student changes base bias in a controlled transistor-amplifier case, observes the change in Q-point and operating region, then explains why this may affect the small-signal gain model. It should help the student investigate rather than reveal the complete diagnosis.

- **Acceptance criteria**
  - The displayed experiment focuses on the diagnosed dependency and highlights the relevant path through the concept map.
  - Changing base bias updates the displayed I_C, V_CE, and operating-region status for the controlled case.
  - The original and changed operating points can be compared side by side.
  - The student can record a short explanation of what changed and why it may affect the small-signal gain model.
  - Experiment observations are preserved for comparison and the final session summary.
  - **Re-Test My Reasoning** starts a related but not identical diagnostic prompt; it does not reveal the complete answer.

Source: `scope.md > The Core Loop` and `scope.md > The POC Boundary`.

### Re-test, Verification, and Session Summary

TRACEBACK compares the original and re-test reasoning traces, especially the dependency addressed by the intervention. A repaired link must be supported in the student's reasoning; repeating a definition or reaching the same final answer is not sufficient.

- **Acceptance criteria**
  - A re-test that demonstrates the target link marks it **Repaired**, shows the before/after reasoning traces, and updates the knowledge map.
  - After an unsuccessful Re-test 1, the interface explains which evidence still fails to support the dependency, keeps its Incomplete or Inconsistent status, and offers one narrowly targeted follow-up intervention.
  - The student may complete **at most two re-tests**. After an unsuccessful Re-test 2, TRACEBACK offers no further loop, marks the target **Unresolved**, and shows the exact unsupported dependency with a concise evidence-based explanation.
  - The final session summary shows initial and later reasoning traces, experiment observations, the before/after map, and the final Repaired or Unresolved outcome.
  - All listed information remains available while the student progresses through the current diagnostic session; it is not saved as cross-session history.

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`, and `scope.md > The POC Boundary`.

## States and Boundaries

- **First use:** Show the single case and its challenge before the student starts.
- **Empty response:** Ask for a few reasoning steps; do not diagnose or consume an attempt.
- **Insufficient evidence:** Mark relevant concepts Unverified, explain that evidence is insufficient, and ask for a fuller explanation; do not mark these concepts incorrect.
- **Sufficient initial reasoning:** Show the evidence-linked trace and status for each concept/dependency.
- **Micro-experiment:** Preserve the diagnosis and observations while the student investigates the targeted link.
- **Repaired:** Show the before/after trace, update the map, and complete verification.
- **Unresolved after Re-test 1:** Explain what remains unsupported and offer one targeted follow-up intervention.
- **Unresolved after Re-test 2:** Stop; show an unresolved summary and preserve all session evidence.
- **Session end:** The diagnostic information is for the current session only; accounts, cross-session history, and long-term tracking are not provided.

Source: `scope.md > The Core Loop`, `scope.md > The POC Boundary`, and `scope.md > Explicitly Cut`.

## Product Decisions

- Focus the proof of concept on one authored transistor-amplifier gain-drop case and its five-concept dependency chain, because depth of diagnosis proves the idea better than scenario breadth.
- Show why a diagnosis was reached using the student's own statements and explicit evidence rules; keep any evidence confidence indicator secondary and do not represent it as validated probability.
- Use step-by-step free text in the student's own words, not multiple-choice questions or forced concept selection. Encourage roughly 3–6 steps.
- Keep the placeholder neutral, structure-only, transient, and excluded from evidence so it cannot teach the expected answer.
- Use a hands-on, controlled bias shift: change base bias, observe I_C, V_CE, and region, and explain the effect on the gain model.
- Allow at most two re-tests. After the first unsuccessful re-test, offer one focused follow-up; after the second, summarize the unresolved dependency and stop.
- Preserve full diagnostic information within the current session only. No account or persistent-history feature is needed to prove the loop.
- Use a focused lab interface with the dark futuristic engineering-AI aesthetic from scope, keeping maps and evidence prominent.

Source: decisions in this section develop `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > The POC Boundary`, and `scope.md > Explicitly Cut`.

## What We're Building

One focused TRACEBACK lab experience with an authored transistor-amplifier gain-drop challenge; step-by-step free-text diagnosis; an auditable, deterministic reasoning trace across five dependencies; a targeted bias-shift experiment; up to two re-tests; repaired or unresolved verification; and a complete current-session summary with before/after traces and an updated map.

## Deferred From the POC

- Additional ECE cases and other subjects — one case is enough to demonstrate the kernel.
- Sophisticated AI/ML scoring — transparent authored evidence criteria are more explainable and controllable for the first case.
- Persistent accounts, session history, saved profiles, and long-term knowledge tracking — the MVP proves one current-session loop.
- Arbitrary circuit design or a general-purpose simulator — the controlled bias experiment is sufficient to demonstrate the dependency.

## Possible Later Enhancements

Add carefully authored ECE cases and expand to other engineering subjects. Explore more sophisticated scoring only after the evidence-linked diagnostic has been demonstrated and evaluated. Add persistent learner progress only if a later product goal requires it.

## Non-Goals

- A broad learning-management or education platform — this proof is one case and one session.
- A generic chatbot or answer-giving tutor — the product must expose and repair a reasoning link.
- A simple quiz app — final-answer selection does not demonstrate the reasoning chain.
- Autonomous agents — the student supplies the reasoning and remains central to the loop.
- A statistically validated confidence model — the prototype's evidence criteria are explicit but not scientifically validated.
- Multiple-case coverage or arbitrary circuit simulation — both exceed the approved proof-of-concept boundary.

## Open Questions

- **Before build (resolve in `4-spec`):** Author and review the case's circuit values, supported base-bias settings and corresponding I_C/V_CE/operating-region outcomes, deterministic evidence criteria for each dependency, and the related-but-not-identical re-test prompt. These are content details for the one agreed case; the product behavior and status definitions are already set.
- **Can wait:** Whether a later version should add persistent history or advanced AI/ML scoring; both are deferred and do not affect this proof of concept.
