<div align="center">

# ⚡ TRACEBACK

### ENGINEERING COGNITION DIAGNOSTIC LAB

**Don't just find the answer. Find the missing link.**

A structured engineering reasoning diagnostic for transistor-amplifier gain-drop analysis.

<br>

[![Live Demo](https://img.shields.io/badge/🚀_LIVE_DEMO-00E5FF?style=for-the-badge\&logo=netlify\&logoColor=white)](https://brilliant-cupcake-b8f2fc.netlify.app)
[![GitHub](https://img.shields.io/badge/GITHUB-7C3AED?style=for-the-badge\&logo=github\&logoColor=white)](https://github.com/snehassneha4578-collab/TRACEBACK)
[![Next.js](https://img.shields.io/badge/NEXT.JS-111827?style=for-the-badge\&logo=nextdotjs\&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/REACT-06B6D4?style=for-the-badge\&logo=react\&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TYPESCRIPT-2563EB?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## 🚀 Live Demo

**Production:** https://brilliant-cupcake-b8f2fc.netlify.app

**Repository:** https://github.com/snehassneha4578-collab/TRACEBACK

---

# 🧠 What is TRACEBACK?

TRACEBACK is an **Engineering Cognition Diagnostic Lab** designed to analyze *how* an engineering learner reasons through a circuit problem — not simply whether the final answer is correct.

The current prototype focuses on a **transistor amplifier gain-drop scenario**.

Instead of treating a wrong answer as the end of the analysis, TRACEBACK follows the learner's reasoning through a structured concept dependency chain:

```text
BIAS
  ↓
Q-POINT
  ↓
OPERATING REGION
  ↓
SMALL-SIGNAL MODEL
  ↓
GAIN
```

The system identifies where reasoning becomes unsupported, explains the evidence behind the diagnostic state, enables a controlled experiment, and performs a bounded re-test.

---

# 🎯 Problem

Traditional engineering learning systems often reduce a learner's performance to:

```text
QUESTION
    ↓
FINAL ANSWER
    ↓
CORRECT / INCORRECT
```

But an incorrect answer does not reveal **where the learner's engineering mental model broke**.

A learner may:

* understand equations but misunderstand biasing
* calculate gain using an invalid operating region
* identify a Q-point without connecting it to the small-signal model
* memorize formulas without understanding concept dependencies
* arrive at a correct result through unsupported reasoning

TRACEBACK therefore focuses on the **reasoning chain behind the answer**.

---

# 💡 Solution

TRACEBACK transforms the diagnostic process into:

```text
LEARNER REASONING
        ↓
EVIDENCE
        ↓
CONCEPT DEPENDENCIES
        ↓
DIAGNOSTIC STATE
        ↓
CONTROLLED EXPERIMENT
        ↓
OBSERVATION
        ↓
RE-TEST
        ↓
VERIFICATION
```

Instead of simply saying:

> Your answer is wrong.

TRACEBACK aims to identify:

> **Which reasoning link is unsupported, why it matters, and how the hypothesis can be tested.**

---

# 🔬 Current Diagnostic Case

## TRANSISTOR AMPLIFIER — GAIN DROP

| Parameter      |                    Value |
| -------------- | -----------------------: |
| Expected Gain  |                  **50×** |
| Observed Gain  |                  **18×** |
| Gain Drop      |                 **−64%** |
| Circuit        | **Common-emitter stage** |
| Concept Nodes  |                    **5** |
| Dependencies   |                    **4** |
| Reasoning Path |                    **1** |

### Concept Dependency Chain

```text
┌───────────────┐
│     BIAS      │
└───────┬───────┘
        ↓
┌───────────────┐
│    Q-POINT    │
└───────┬───────┘
        ↓
┌───────────────┐
│    REGION     │
└───────┬───────┘
        ↓
┌───────────────┐
│     MODEL     │
└───────┬───────┘
        ↓
┌───────────────┐
│     GAIN      │
└───────────────┘
```

A failure in an upstream concept can affect downstream reasoning.

---

# 🧩 Reasoning Intelligence

TRACEBACK represents engineering understanding as a **dependency graph** instead of a flat answer.

![TRACEBACK Dependency Map](devpost/traceback-dependency-map.png)

The diagnostic system exposes:

* concept status
* dependency relationships
* reasoning evidence
* unresolved links
* repaired links
* downstream effects
* diagnostic progression

![TRACEBACK Reasoning Trace](devpost/traceback-reasoning-trace.png)

---

# 🧪 Controlled Bias Experiment

When a reasoning gap is identified, TRACEBACK can use a **controlled bias experiment** to test the learner's hypothesis.

```text
HYPOTHESIS
    ↓
CONTROLLED CHANGE
    ↓
EXPECTED EFFECT
    ↓
OBSERVED EFFECT
    ↓
COMPARE
    ↓
RE-TEST
```

The experiment is intentionally bounded so that the diagnostic process remains interpretable and reproducible.

---

# 🔄 Repair → Re-test Loop

TRACEBACK closes the reasoning loop instead of stopping at diagnosis.

```text
┌──────────────────┐
│    REASONING     │
└────────┬─────────┘
         ↓
┌──────────────────┐
│    DIAGNOSE      │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ IDENTIFY MISSING │
│      LINK        │
└────────┬─────────┘
         ↓
┌──────────────────┐
│    EXPERIMENT    │
└────────┬─────────┘
         ↓
┌──────────────────┐
│     OBSERVE      │
└────────┬─────────┘
         ↓
┌──────────────────┐
│     RE-TEST      │
└────────┬─────────┘
         ↓
┌──────────────────┐
│    VERIFY        │
└──────────────────┘
```

The final diagnostic state is presented through the session summary.

![TRACEBACK Session Summary](devpost/traceback-session-summary.png)

---

# 🖥️ Product Showcase

## Main Dashboard

![TRACEBACK Dashboard](devpost/traceback-dashboard.png)

## Diagnostic Lab

![TRACEBACK Diagnostic Lab](devpost/traceback-diagnostic-lab.png)

The interface is designed as a **premium futuristic engineering-AI workspace** featuring:

* dark engineering-lab environment
* neon diagnostic indicators
* glassmorphism panels
* dependency visualization
* reasoning traces
* experiment controls
* structured status hierarchy
* responsive layouts
* engineering-focused visual language

---

# 🏗️ System Architecture

![TRACEBACK Architecture](devpost/traceback-architecture.png)

TRACEBACK is intentionally implemented as a lightweight client-side prototype.

```text
┌────────────────────────────────────┐
│             NEXT.JS UI             │
│                                    │
│ DiagnosticLab                      │
│ ReasoningInput                     │
│ ReasoningTrace                     │
│ ConceptMap                         │
│ CircuitDiagram                     │
│ BiasExperiment                     │
│ SessionSummary                     │
└──────────────────┬─────────────────┘
                   ↓
┌────────────────────────────────────┐
│        AUTHORED CASE MODEL         │
│                                    │
│ transistorCase.ts                  │
│ circuitModel.ts                    │
└──────────────────┬─────────────────┘
                   ↓
┌────────────────────────────────────┐
│       DETERMINISTIC RULES          │
│                                    │
│ diagnosis.ts                       │
└──────────────────┬─────────────────┘
                   ↓
┌────────────────────────────────────┐
│       CURRENT SESSION STATE        │
│                                    │
│ session.ts                         │
└────────────────────────────────────┘
```

---

# 🔄 End-to-End Workflow

![TRACEBACK Workflow](devpost/traceback-workflow.png)

```text
START CASE
    ↓
ENTER REASONING
    ↓
MAP REASONING TO CONCEPTS
    ↓
TRACE DEPENDENCIES
    ↓
IDENTIFY EVIDENCE GAP
    ↓
RUN CONTROLLED EXPERIMENT
    ↓
OBSERVE RESULT
    ↓
RE-TEST REASONING
    ↓
VERIFY
    ↓
SESSION SUMMARY
```

---

# ⚙️ How TRACEBACK Works

### 1. Start a Diagnostic Case

The learner begins with the transistor-amplifier gain-drop scenario.

### 2. Submit Reasoning

The learner explains their reasoning using free-text input.

### 3. Trace Concepts

The authored diagnostic rules map relevant reasoning evidence to the concept dependency chain.

### 4. Identify the Missing Link

The system identifies concepts whose evidence is currently unsupported or unresolved.

### 5. Examine Dependencies

The learner can see how an upstream concept affects downstream reasoning.

### 6. Run an Experiment

A controlled bias experiment provides a bounded way to test the hypothesis.

### 7. Re-test

The learner submits reasoning again after the intervention.

### 8. Review the Session

TRACEBACK summarizes the resulting diagnostic state.

---

# 🧠 Engineering Cognition Model

TRACEBACK models engineering understanding as connected concepts rather than isolated facts.

```text
             ┌─────────┐
             │  BIAS   │
             └────┬────┘
                  ↓
             ┌─────────┐
             │ Q-POINT │
             └────┬────┘
                  ↓
             ┌─────────┐
             │ REGION  │
             └────┬────┘
                  ↓
             ┌─────────┐
             │  MODEL  │
             └────┬────┘
                  ↓
             ┌─────────┐
             │  GAIN   │
             └─────────┘
```

This structure makes it possible to reason about **dependency failures** rather than only final-answer failures.

---

# 🛠️ Technology Stack

## Frontend

* **Next.js 16**
* **React 19**
* **TypeScript**
* Responsive CSS

## Engineering Logic

* authored transistor-amplifier case
* circuit model
* concept dependency model
* deterministic evidence rules
* controlled bias experiment
* bounded re-test logic
* browser-memory session state

## Deployment

* **Netlify**
* static Next.js export
* production deployment

---

# 📁 Project Structure

```text
TRACEBACK/
│
├── devpost/
│   ├── app-map.html
│   ├── checklist.md
│   ├── prd.md
│   ├── scope.md
│   ├── spec.md
│   │
│   ├── traceback-dashboard.png
│   ├── traceback-diagnostic-lab.png
│   ├── traceback-dependency-map.png
│   ├── traceback-reasoning-trace.png
│   ├── traceback-session-summary.png
│   ├── traceback-architecture.png
│   └── traceback-workflow.png
│
├── web/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── data/
│   │   └── lib/
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   └── README.md
│
├── netlify.toml
├── README.md
└── .gitignore
```

---

# 🚀 Run Locally

## Requirements

* Node.js **20.9+**
* npm

## Install dependencies

```powershell
cd web
npm ci
```

## Start development server

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

## Run validation

```powershell
npm run lint
npm run build
```

---

# 🌐 Deployment

TRACEBACK is deployed as a production static Next.js application.

### Production

**https://brilliant-cupcake-b8f2fc.netlify.app**

### GitHub

**https://github.com/snehassneha4578-collab/TRACEBACK**

---

# 🔒 Scope & Responsible Disclosure

TRACEBACK is currently a **focused engineering prototype**, not a general-purpose AI tutor.

The current implementation intentionally has clear boundaries:

* Uses **deterministic, authored evidence rules**
* Makes **no runtime AI/API calls**
* Does not claim general natural-language understanding
* Focuses on one transistor-amplifier gain-drop scenario
* Stores learner state only in **browser memory for the current session**
* Has no accounts
* Has no backend
* Has no database
* Has no cross-session learner history

These constraints make the current diagnostic behavior **inspectable, reproducible, and bounded**.

---

# 🔭 Future Research Direction

The current prototype establishes the diagnostic architecture and interaction model.

Possible future directions include:

```text
MULTIPLE CIRCUIT CASES
        ↓
RICHER CONCEPT GRAPHS
        ↓
ENGINEERING KNOWLEDGE MODELS
        ↓
ADVANCED REASONING ANALYSIS
        ↓
PERSONALIZED DIAGNOSTIC PATHS
        ↓
LONGITUDINAL LEARNING ANALYTICS
```

Future versions could extend the same reasoning architecture across additional ECE and engineering domains.

---

# 📈 From Answer Checking to Reasoning Diagnosis

Traditional approach:

```text
DATA
 ↓
ANSWER
 ↓
CORRECT / INCORRECT
```

TRACEBACK approach:

```text
REASONING
    ↓
CONCEPTS
    ↓
DEPENDENCIES
    ↓
EVIDENCE
    ↓
DIAGNOSIS
    ↓
EXPERIMENT
    ↓
RE-TEST
    ↓
VERIFICATION
```

The central idea is simple:

> **An engineering error is not always an isolated wrong answer. It can be a broken link in a chain of dependent concepts.**

TRACEBACK makes that chain visible.

---

# ✨ Key Features

| Feature                          | TRACEBACK |
| -------------------------------- | :-------: |
| Engineering diagnostic case      |     ✅     |
| Free-text learner reasoning      |     ✅     |
| Concept dependency chain         |     ✅     |
| Evidence-based diagnostic states |     ✅     |
| Dependency visualization         |     ✅     |
| Reasoning trace                  |     ✅     |
| Controlled bias experiment       |     ✅     |
| Bounded re-test loop             |     ✅     |
| Session summary                  |     ✅     |
| Responsive interface             |     ✅     |
| Production deployment            |     ✅     |
| Runtime AI/API dependency        |     ❌     |
| Backend/database                 |     ❌     |

---

# 🎓 Project Context

**TRACEBACK** is an undergraduate ECE engineering prototype exploring how engineering learning systems can move beyond final-answer evaluation toward **structured reasoning diagnosis**.

The project combines:

**Electronics + Engineering Reasoning + Knowledge Dependencies + Interactive Visualization + Explainable Diagnostic Logic**

---

<div align="center">

# ⚡ TRACEBACK

### ENGINEERING COGNITION DIAGNOSTIC LAB

**Don't just find the answer. Find the missing link.**

<br>

**Built with Next.js • React • TypeScript**

<br>

[🚀 Live Demo](https://brilliant-cupcake-b8f2fc.netlify.app) • [💻 GitHub](https://github.com/snehassneha4578-collab/TRACEBACK)

</div>
