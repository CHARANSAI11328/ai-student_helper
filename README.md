# Learnova AI — AI-Powered Socratic Learning Companion for School Students

🌐 **Live Website:** [https://charansai11328.github.io/ai-student_helper/](https://charansai11328.github.io/ai-student_helper/)  
📂 **GitHub Repository:** [https://github.com/CHARANSAI11328/ai-student_helper](https://github.com/CHARANSAI11328/ai-student_helper)  

> **National Hackathon Challenge:** *AI-Powered Learning Companion for School Children (Grades 6–12)*  
> **Core Focus:** Mathematics, Physics, Chemistry

---

## 1. Product Vision & Educational Mission

Most AI tools for students act as **homework solvers** that dump direct answers, encouraging passive copying and eroding conceptual retention.

**Learnova AI** is built on a different philosophy: **Socratic, step-by-step guidance**. It acts as an inspiring personal tutor that:
1. Deconstructs complex questions into foundational principles.
2. Reads handwritten equations, circuit diagrams, and textbook snippets via a dedicated **Multimodal Vision Lab**.
3. Understands and speaks in **English, Telugu (తెలుగు), and Hindi (हिन्दी)** while strictly preserving international scientific and mathematical notation ($E = mc^2$, $H_2SO_4$, $V = IR$).
4. Feeds student quiz mistakes into an **Observable Adaptive Mastery Engine** that updates the student's personalized syllabus roadmap in real time.
5. Works seamlessly in low-bandwidth Indian school environments with **PWA offline caching** for formula sheets and saved revision notes.

---

## 2. Differentiating Highlights for Hackathon Judging

| Feature | Generic Chatbots | Learnova AI |
|---|---|---|
| **Pedagogy** | Direct answer dumping | **Structured 9-Part Socratic Framework** (Intent, Concepts, Steps, Verification, Why it works, Analogy, Common Pitfall, MCQ Check, Next Topic) |
| **Vision & Blackboard Slate** | Hallucinates unclear ink / no drawing | **Digital Blackboard Slate Canvas** + Transcription Reviewer & Ambiguity Detection (draw freehand with chalk or upload photos) |
| **STEM Simulators** | Static text only | **Interactive STEM Visual Laboratories** (Parabola plotter, Gravity projectile cannon, Stoichiometric balancer) |
| **Adaptive Loop** | Stateless; forgets errors | **Observable Mastery Engine** (Quiz mistakes trigger prerequisite lessons & adapt the learning tree) |
| **STEM Notation** | Messy plaintext formulas | **Crisp KaTeX LaTeX Typesetting** for mathematics and chemistry |
| **Language & Voice** | Awkward machine translation | **Native Multilingual Prompting** + Web Speech API (Dictate questions & listen aloud in English, Telugu, Hindi) |
| **Gamification & Print** | Generic scores | **Interactive Confetti + XP Rewards** & Print-Optimized Exam Revision Cheat Sheets |
| **Zero-Config + Live AI** | Fails without API credentials | **Dual-Engine Architecture**: 1-click In-Browser Gemini API key activation with latency ping + Zero-Config Offline Socratic Engine |

---

## 3. Recommended Architecture & Tech Stack

```
ai-learn_for_school_students/
├── client/                     # Frontend Application (React 18, Vite, TypeScript, Tailwind)
│   ├── src/
│   │   ├── api/                # Typed REST client
│   │   ├── components/         # Navbar, Footer, KaTeX MathRenderer
│   │   ├── context/            # AppContext (Profile, i18n, Offline, Toasts)
│   │   ├── i18n/               # Multilingual dictionaries (English, Telugu, Hindi)
│   │   ├── pages/              # 10 Full Application Pages
│   │   └── types/              # Domain TypeScript types
├── server/                     # Backend Application (Node.js, Express, TypeScript)
│   ├── src/
│   │   ├── ai/                 # Multi-model Router, Gemini Provider, Socratic Prompts
│   │   ├── routes/             # Tutor, Quiz, Learning, Progress, Notes, Profile routes
│   │   ├── services/           # Adaptive Engine, Math Verifier, DataStore
│   │   └── eval/               # Evaluation benchmark runner & fine-tuning exporter
├── database/                   # Database Layer
│   ├── schema.sql              # Production PostgreSQL / Supabase Schema (RLS enabled)
│   └── seed.sql                # Grades 9-10 STEM curriculum seed data
├── eval/                       # Benchmark Datasets & Results
│   ├── datasets/               # Math, Physics, Chemistry, Multimodal benchmark cases
│   └── results/                # Automated evaluation summary reports
└── docs/                       # Comprehensive Engineering Guides
    ├── ARCHITECTURE.md         # Full architectural design & Mermaid diagrams
    ├── API.md                  # REST API contract specifications
    ├── EVALUATION.md           # Pedagogical evaluation methodology & rubrics
    ├── FINE_TUNING.md          # Google AI Studio fine-tuning dataset & training guide
    └── DEMO_GUIDE.md           # 3-Minute Judge Evaluation Walkthrough
```

---

## 4. Quickstart & How to Run

### Prerequisites
- Node.js >= 18.0 (Tested on Node.js v24)
- npm >= 9.0

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Configuration (Optional)
```bash
cp .env.example .env
```
*Note: Learnova AI runs immediately in **Zero-Config Demo Mode** even without an API key! If you provide a `GEMINI_API_KEY`, it automatically unlocks live Gemini model inference.*

### Step 3: Run the Application
Open two terminals (or use the root script):

**Terminal 1 (Backend Server):**
```bash
node node_modules/tsx/dist/cli.mjs server/src/index.ts
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
node node_modules/vite/bin/vite.js client
# Frontend runs on http://localhost:5173
```

---

## 5. Automated Verification & Evaluation

### A. Run Integration API Sanity Tests
```bash
npm run test
# Or: node node_modules/tsx/dist/cli.mjs server/src/test/apiSanity.ts
```
Verifies health, student profile, learning roadmaps, Socratic tutoring, vision analysis, adaptive quiz submission, and progress analytics.

### B. Run Pedagogical Benchmark Evaluation
```bash
npm run test:eval
# Or: node node_modules/tsx/dist/cli.mjs server/src/eval/runEvaluation.ts
```
Evaluates 16 curriculum test cases across Math, Physics, Chemistry, Multilingual (Telugu/Hindi), and Multimodal Vision.

### C. Export Gemini Fine-Tuning Dataset
```bash
npm run export:finetune
# Or: node node_modules/tsx/dist/cli.mjs server/src/eval/finetuningExport.ts
```
Generates `eval/finetuning/learnova_stem_finetuning.jsonl` adhering to official Google Gen AI multi-turn fine-tuning format.

---

## 6. The 10 Complete Application Pages

1. **Landing Page (`/`):** Hero, value proposition, interactive Socratic sandbox, chatbot comparison table, and 1-click judge tour.
2. **Student Dashboard (`/dashboard`):** Streaks, study minutes, subject mastery rings, active adaptive alerts (*"Needs Revision: Quadratic Equations"*), and quick ask bar.
3. **AI Tutor Workspace (`/tutor`):** 9-part pedagogical card, KaTeX formulas, Web Speech API dictation and read-aloud, copy answer, save to notes, and follow-up check MCQs.
4. **Vision & Handwriting Lab (`/vision-lab`):** Upload photos of handwritten equations or textbook diagrams, transcription reviewer with ambiguity detection, and side-by-side solver.
5. **Subject Learning Hub (`/learning-hub`):** Chapters for Math, Physics, and Chemistry, interactive formula reference sheets, and worked examples.
6. **Personalized Learning Path (`/learning-path`):** Interactive visual roadmap displaying topic nodes as *Mastered*, *In Progress*, or *Needs Revision* with explainable reasons.
7. **Practice & Quiz Center (`/quiz`):** Adaptive diagnostic quizzes, instant feedback on wrong answers, timed/untimed mode, confetti celebration, and real-time mastery updates.
8. **Progress & Analytics (`/analytics`):** Real accuracy metrics, subject mastery comparisons, and weak concept logs.
9. **Saved Notes (`/notes`):** Searchable notebook for bookmarked explanations with full LaTeX rendering and custom note creation.
10. **Settings & Accessibility (`/settings`):** Grade level, explanation style, language switch, large text, high contrast, and judge demo profile reload.

---

## 7. Child Safety & Responsible AI Architecture

- **Zero Sensitive Data Extraction:** Learnova does not request addresses, phone numbers, or passwords from school children.
- **Safety Filtering:** Strict system prompt guardrails prohibit hazardous chemical reactions, explosives, weapons, or harmful content.
- **Pedagogical Integrity:** Refuses requests to "just write my homework essay" and redirects the student to solve problems step-by-step.
- **Server-Side API Key Isolation:** Client code never touches Gemini API keys or database service role secrets.

---

## 8. License & Acknowledgments

Created for the Educational AI Hackathon Challenge.  
Empowering equitable STEM learning for every school student.
