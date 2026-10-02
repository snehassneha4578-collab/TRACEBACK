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

- [ ] **2. Complete the bias experiment, bounded re-test loop, verification, and session summary**
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
- [ ] Final kick-the-tires exploration and feedback completed — after Slice 2; learner tries repaired and unresolved paths, responsive layout, and awkward inputs

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — focused investigation of how dependency evidence drives status and verification
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions
