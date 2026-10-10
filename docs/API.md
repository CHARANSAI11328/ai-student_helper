# Learnova AI — REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. System Health & Configuration

### `GET /health`
Returns system status, active mode (`live_ai` or `demo_offline_engine`), and model availability.

**Response:**
```json
{
  "status": "ok",
  "service": "Learnova AI Backend",
  "version": "1.0.0",
  "geminiConfigured": true,
  "defaultModelText": "gemini-1.5-flash",
  "defaultModelVision": "gemini-1.5-flash",
  "mode": "live_ai",
  "timestamp": "2026-10-10T03:00:00.000Z"
}
```

---

## 2. Socratic AI Tutoring

### `POST /tutor/ask`
Submits a student question to the Socratic tutor.

**Request Body:**
```json
{
  "question": "Solve 2x^2 - 7x + 3 = 0 using quadratic formula",
  "subject": "math",
  "grade": 10,
  "language": "en",
  "style": "step_by_step",
  "forceComplexModel": false
}
```

**Response:**
```json
{
  "success": true,
  "explanation": {
    "questionIntent": "Find roots of quadratic equation 2x^2 - 7x + 3 = 0",
    "requiredConcepts": ["Quadratic formula", "Discriminant b^2 - 4ac"],
    "stepByStepReasoning": [
      {
        "stepNumber": 1,
        "title": "Identify coefficients",
        "explanation": "Compare with ax^2 + bx + c = 0",
        "mathExpression": "a = 2, b = -7, c = 3"
      }
    ],
    "finalAnswer": "x = 3 and x = 1/2",
    "whyMethodWorks": "Completes the square algebraically",
    "realWorldAnalogy": "Finding trajectory ground impacts",
    "commonMistakes": "Sign errors on -b",
    "understandingCheckQuestion": {
      "question": "If D = 0, what are the roots?",
      "options": ["Two equal real roots", "No real roots"],
      "correctOptionIndex": 0,
      "explanation": "Square root of 0 is 0."
    },
    "suggestedNextTopic": "Graphing Parabolas"
  },
  "verification": {
    "isVerifiable": true,
    "computedValue": "3",
    "isConsistent": true
  },
  "metadata": {
    "modelUsed": "gemini-1.5-flash",
    "isDemo": false,
    "executionTimeMs": 620
  }
}
```

---

## 3. Multimodal Vision Lab

### `POST /tutor/analyze-image`
Analyzes handwritten problems, circuit diagrams, or textbook pages.

**Multipart Form-Data or JSON Body:**
- `image`: File (JPG, PNG, WebP) OR `imageBase64`: Base64 string
- `subject`: `math` | `physics` | `chemistry`
- `grade`: number (6–12)
- `mode`: `solve` | `transcribe_only`

**Response:**
```json
{
  "success": true,
  "transcription": {
    "extractedText": "Solve: 3x^2 + 5x - 2 = 0",
    "identifiedSubject": "math",
    "equationsDetected": ["3x^2 + 5x - 2 = 0"],
    "confidenceLevel": "high",
    "clarificationNeeded": false
  },
  "solution": { ... },
  "metadata": {
    "modelUsed": "gemini-1.5-flash",
    "isDemo": false
  }
}
```

---

## 4. Adaptive Quizzes & Progress

### `POST /quiz/generate`
Generates an adaptive diagnostic quiz for a curriculum topic.

### `POST /quiz/submit`
Submits quiz score and triggers adaptive mastery recalculation.

**Request Body:**
```json
{
  "topicId": "math-alg-quad",
  "score": 1,
  "totalQuestions": 3,
  "wrongConcepts": ["Discriminant signs with negative b"]
}
```

**Response:**
```json
{
  "success": true,
  "evaluation": {
    "topicId": "math-alg-quad",
    "previousMastery": 0.65,
    "newMastery": 0.45,
    "newStatus": "needs_revision",
    "identifiedWeakConcepts": ["Discriminant signs with negative b"],
    "recommendation": {
      "recommendedTopicId": "math-alg-quad",
      "recommendedTopicTitle": "Quadratic Equations",
      "reason": "Targeted practice needed on negative coefficient signs.",
      "actionType": "concept_practice"
    }
  }
}
```

---

## 5. Notes, Curriculum & Profile

- `GET /learning/subjects` — List all subjects
- `GET /learning/topics` — List curriculum topics with key formulas
- `GET /learning/path` — Get student's personalized learning roadmap
- `GET /progress` — Overall metrics, accuracy, and streaks
- `GET /notes` — Retrieve student saved revision notes
- `POST /notes` — Save an explanation as a revision note
- `DELETE /notes/:id` — Delete a note
- `GET /profile` — Retrieve current student profile
- `PATCH /profile` — Update preferences (grade, language, goals, style)
- `POST /profile/demo` — Reset to Judge Demo Profile
