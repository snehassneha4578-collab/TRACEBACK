---
doc: checklist
status: approved
---

# Build Checklist

Build mode: Fast

## Slices

- [x] **1. Diagnose the gain-drop case and inspect an evidence-linked reasoning trace**
  Becomes usable: A running TRACEBACK lab where a student starts the one case, enters free-text reasoning, gets empty/insufficient-response handling, and sees deterministic statement-to-dependency evidence with Demonstrated, Incomplete, Inconsistent, or Unverified states.
  Why now: This implements the unique kernel early: diagnosis must explain why a reasoning link is missing before the experiment and re-test can be meaningful. Bootstrapping is included in this first end-to-end slice.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Active Case and Reasoning Input`, `prd.md > Reasoning Trace and Gap Diagnosis`, `prd.md > Screens and Layout`, `prd.md > Look and Feel`
  Spec ref: `spec.md > How This Works, In Plain Language`, `spec.md > Where It Runs and How Someone Tries It`, `spec.md > Look and Feel`, `spec.md > Components`, `spec.md > Deterministic Reasoning Criteria`, `spec.md > End-to-End Acceptance Criteria`, `spec.md > File Structure`
  Build: Scaffold `web/` per spec. Implement the responsive lab shell and authored case/map; create in-memory typed session state; implement the sufficiency gate and deterministic dependency evaluator; render student statements, evidence, reasons, map statuses, and the path-ordered target gap. Use the specified premium dark engineering-lab visual direction from the start.
  Verify (mechanical): Run `npm run build` in `web/`; start `npm run dev`, request `http://localhost:3000`, and confirm the route serves successfully. Manually submit empty, vague, and authored sufficient reasoning in a browser; verify empty/vague do not create a trace or diagnosis and sufficient reasoning produces the expected four edge statuses with cited statements.
  Learner check: Open the lab, start the diagnostic, submit the authored example, and inspect whether each status follows from the cited statement and dependency. Try an empty or vague response and confirm it asks for more detail without diagnosing.
  Commit: `Build evidence-linked diagnostic trace`

- [x] **2. Complete the bias experiment, bounded re-test loop, verification, and session summary**
  Becomes usable: The student can change a controlled bias preset, observe Q-Point and region changes, explain the effect, re-test on the related case, and reach a repaired or unresolved summary with all session evidence preserved.
  Why now: The diagnostic from Slice 1 now drives the intervention target. This closes the entire locked concept-to-verification loop and lets us validate the two-re-test stopping rule against real state transitions.
  PRD ref: `prd.md > Targeted Micro-Experiment`, `prd.md > Re-test, Verification, and Session Summary`, `prd.md > States and Boundaries`, `prd.md > Screens and Layout`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Case Model and Circuit Values`, `spec.md > Diagnostic, Re-test, and Follow-up Content`, `spec.md > End-to-End Acceptance Criteria`, `spec.md > Components and Session Data`, `spec.md > File Structure`, `spec.md > Important Failure Modes`
  Build: Implement the fixed five-preset circuit model and original-versus-selected readings; record experiment observations and explanation; add the related re-test and trace comparison; implement `MAX_RETESTS = 2`, exactly one focused intervention after a failed first re-test, repaired verification on a demonstrated target dependency, and the unresolved summary after a failed second re-test. Keep everything in current-session React memory and finish responsive cockpit styling and state transitions.
  Verify (mechanical): Run `npm run build`; run the app and exercise complete repaired and unresolved journeys. Confirm the 2.00 V / 1.17 V / 1.50 V / 0.60 V / 5.70 V readings match the authored table, empty/vague re-test responses do not increment the count, failed Re-Test 1 offers exactly one intervention, failed Re-Test 2 stops, successful verification compares traces, and refresh starts an empty session.
  Learner check: In the browser, move the bias control and compare the readings; then complete one repaired path and one unresolved path. Check that the before/after trace and final map tell you why the outcome was reached and that refresh clears the session.
  Commit: `Complete experiment and verification loop`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after Slice 1; learner reviewed the diagnostic and found no changes needed
- [x] Final kick-the-tires exploration and feedback completed — learner reviewed the app in a browser and requested focused landing-screen changes for repeated labels, CTA hierarchy, dependency count, gain-drop readability, footer weight, spacing, and responsive polish. Those changes were applied and the learner later approved Stage 5. The learner feedback record is limited to the browser review and requested changes; the repaired/unresolved journeys, empty/vague gates, and mobile widths were separately exercised in headless browser verification.

## Final Review

- [x] Final review complete — the requested landing polish was applied without changing the diagnostic/session logic; lint, production build, headless learner journeys, and mobile overflow checks passed; learner explicitly approved Stage 5 Build.

Review record: The learner identified repeated case labels, weak primary-action hierarchy, an unclear gain comparison, footer emphasis, and general spacing/responsive refinements from their browser review. These were addressed in the final landing screen. No product-scope or diagnostic-rule changes were made. The learner's explicit sign-off was: “Stage 5 Build is approved.”

## Code Tour and App Map

- [x] Learning activity complete — brief, evidence-based reference recap of how the sufficiency gate, authored edge rules, and reducer transitions connect to the visible trace and verification; no learning outcome is inferred
- [x] Optional edit and transfer reflection addressed — no additional code-tour edit was needed; one optional transfer question is offered in the Stage 5 handoff
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Brief evidence-based recap ties the approved requirement for evidence-linked explanations to `web/src/lib/diagnosis.ts` (`checkSufficiency`, `evaluateEdge`, `diagnoseReasoning`) and `web/src/lib/session.ts` (`sessionReducer`, `SUBMIT_INITIAL`, `SUBMIT_RETEST`). Prior headless browser verification covered empty/vague gates, initial trace, live preset readings, repaired and unresolved outcomes, focused follow-up, session trace preservation, and mobile overflow. No personal learning outcome is claimed.
Route and stops: Reference-only route in `devpost/app-map.html`: `web/src/components/DiagnosticLab.tsx` (`DiagnosticLab`) → `web/src/lib/diagnosis.ts` and `web/src/lib/session.ts` (evidence gate/rules/state transitions) → `web/src/components/BiasExperiment.tsx`, `web/src/lib/circuitModel.ts`, and `web/src/components/SessionSummary.tsx` (intervention and result). This route was prepared, not recorded as an interactive learner tour.
Edit outcome: Not applicable for the wrap-up; no extra learning edit was made. The separately requested landing-screen polish is part of the completed Slice 2 commit.
Reflection: Optional transfer question offered in the Stage 5 handoff; response not yet recorded. Personal reflection remains in the ignored learner profile only if the learner chooses to add it.
Activity mode: Brief evidence-based recap with a reference-only code route and standalone app map.

## Revisions
