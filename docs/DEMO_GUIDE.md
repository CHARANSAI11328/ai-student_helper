# Learnova AI — Judge Demonstration Walkthrough & Evaluation Guide

Welcome Judges! This guide walks through the 3-minute evaluation sequence demonstrating Learnova's core innovations: **Socratic Multimodal Guidance**, **Visible Adaptive Loop**, and **Native Multilingual Voice**.

---

## Zero-Friction Demo Mode & Live API Key Switcher
Learnova AI includes an intelligent **Zero-Config Socratic Pedagogical Engine**. If no `GEMINI_API_KEY` is provided, the platform operates out of the box in **Zero-Config Offline Mode**, answering STEM questions step-by-step, analyzing handwritten equations, and executing the full adaptive feedback loop.

⚡ **Real-Time Live Gemini Activation for Judges:**
- Click the **"AI Engine"** badge in the top navbar (or open Settings).
- Paste your personal Google Gemini API key.
- Click **"Test Connection & Ping"** to inspect live round-trip latency and discover available models (`gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash`).
- Save to activate live multimodal AI immediately without restarting any servers!

---

## 5-Minute Comprehensive Judge Evaluation Sequence

### Step 1: Launch and Observe the Dashboard (0:00 - 0:45)
1. Navigate to `http://localhost:5173/` or launch the app.
2. Click **"Launch Interactive Judge Demo"** on the hero banner.
3. Observe student profile **Aarav Sharma (Class 10 STEM)**:
   - 4-Day Learning Streak, 185 Study Minutes tracked, XP counter
   - Subject Mastery: Mathematics 68%, Physics 76%, Chemistry 85%
   - **Adaptive Alert:** *Needs Revision: Quadratic Equations — "Discriminant signs when b is negative"*.

---

### Step 2: Interactive Digital Blackboard Slate Canvas (0:45 - 1:30)
*(A unique, student-first touch & drawing experience)*
1. Open **"Vision & Handwriting Lab"** or the **AI Tutor** page.
2. Switch mode to **"Digital Slate Canvas"**.
3. Pick a chalk color (White, Amber, Cyan, Emerald), adjust stroke width, or toggle the coordinate graph grid.
4. Sketch any formula or geometry shape (e.g., $y = x^2$ or a circuit diagram) with your mouse or touchscreen.
5. Click **"⚡ Solve This Drawing with AI"** — Learnova extracts the ink canvas as high-resolution PNG, transcribes the handwritten equation, and solves it Socratic step-by-step!

---

### Step 3: Interactive STEM Visual Simulators (1:30 - 2:30)
*(True educational engagement beyond text and chat)*
1. Navigate to **"Learning Hub"** (`/learning-hub`).
2. Scroll to the **"Interactive STEM Visual Laboratories"** section:
   - **Math Parabola Plotter:** Drag sliders for coefficients $a, b, c$. Observe the real-time SVG parabolic curve morph, discriminant $\Delta = b^2 - 4ac$ calculate dynamically, and real roots displayed with vertex markers.
   - **Physics Projectile Motion Cannon:** Adjust launch velocity (10–50 m/s), launch angle (15°–75°), and switch gravity between **Earth ($9.8 m/s^2$)**, **Moon ($1.6 m/s^2$)**, and **Mars ($3.7 m/s^2$)**. Click **"Fire Simulation"** to watch the animated projectile trace its parabolic trajectory with real-time range and maximum height calculations.
   - **Chemistry Reaction Balancer & Periodic Element Inspector:** Select chemical equations (e.g., $Fe + O_2 \rightarrow Fe_2O_3$, $H_2 + O_2 \rightarrow H_2O$, $CH_4 + O_2 \rightarrow CO_2 + H_2O$) and inspect stoichiometric coefficients and periodic table electron shells.

---

### Step 4: Test the Observable Adaptive Tutoring Loop (2:30 - 3:30)
1. Click **"Practice & Quizzes"** in the top navigation (or click "Practice Targeted Quiz" from the dashboard alert).
2. Choose **"Quadratic Equations"**.
3. Deliberately select an answer that neglects the negative sign in $-b$.
4. **Instant Socratic Feedback** triggers: explains why the mistake occurred:
   *Remember: when $b = -7$, evaluating $-b$ becomes $-(-7) = +7$.*
5. Complete and submit the quiz.
6. Watch the **Adaptive Engine recalculate**:
   - The mastery score updates.
   - The status updates to **Needs Revision**.
   - An explainable next step is generated: recommending prerequisite review in Linear Expressions.
7. Open **"Learning Path"** to see the node roadmaps update in real time with dynamic status badges!

---

### Step 5: Test Socratic Tutor, Concept Check & Voice (3:30 - 4:30)
1. Navigate to **"AI Tutor"** (`/tutor`).
2. Ask any question or use quick chips (*"Derive Snell's Law"*, *"Why does ice float on water?"*).
3. Toggle between **"Step-by-Step Guidance"** and **"Full Walkthrough"** to experience true Socratic scaffolding.
4. Answer the interactive **"Concept Check Question"** at the bottom of the card — answer correctly to trigger a **confetti burst** and earn **+25 XP**!
5. In the top navigation bar, change the language selector to **తెలుగు (Telugu)** or **हिन्दी (Hindi)**.
6. Click the **Listen (Audio) button** to hear the Socratic explanation read aloud via the Web Speech API!

---

### Step 6: Printable Exam Revision Cheat Sheet (4:30 - 5:00)
1. Navigate to **"Saved Notes"** (`/notes`).
2. Click the **"🖨️ Print Revision Sheet"** button.
3. Observe the print preview styling: navbars and sidebars disappear, while high-density, crisp KaTeX formulas and notes are organized cleanly for student exam revision printouts.

---

## Fast Reset
To reset demo data back to the clean baseline at any time, click **"Demo Profile"** in the top header or navigate to **Settings -> "Reload Judge Demo Data"**.
