# Learnova AI — Fine-Tuning Readiness & Custom Model Adaptation Guide

## 1. Overview & Ethical AI Grounding

In compliance with hackathon execution rules:
> *"Do not claim that Gemini or any other model has been fine-tuned unless a real training job has completed and the resulting model has been evaluated."*

Learnova AI is architected with a **Fine-Tuning Readiness Pipeline** that standardizes prompt templates, versioned datasets, and model provider adapters. This architecture allows developers to train and plug in custom subject-specific models (e.g., custom fine-tuned Gemini Flash or open-source Llama/Mistral models) without modifying frontend or application business logic.

---

## 2. Dataset Format & Exporter

We provide an automated dataset exporter (`server/src/eval/finetuningExport.ts`) that transforms curated STEM problems into the official Google GenAI Fine-Tuning multi-turn format:

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are Learnova AI, an expert Socratic tutor for school students in Grade 10. Always explain with structured steps, clear conceptual grounding, and clean LaTeX formulas."
    },
    {
      "role": "user",
      "content": "Find the roots of 2x^2 - 7x + 3 = 0 using the quadratic formula. State the discriminant first."
    },
    {
      "role": "model",
      "content": "{\n  \"questionIntent\": \"Find the roots of 2x^2 - 7x + 3 = 0\",\n  \"requiredConcepts\": [\"Quadratic formula\", \"Discriminant\"],\n  \"stepByStepReasoning\": [...],\n  \"finalAnswer\": \"x = 3 and x = 1/2\",\n  ...\n}"
    }
  ]
}
```

### Export Command:
```bash
npm run export:finetune
# Generates: eval/finetuning/learnova_stem_finetuning.jsonl
```

---

## 3. Step-by-Step Training Instructions for Google AI Studio

To fine-tune a Gemini model using the generated dataset:

1. **Navigate to Google AI Studio:** Go to [Google AI Studio Model Tuning](https://aistudio.google.com/).
2. **Select Base Model:** Choose `gemini-1.5-flash-001` or `gemini-1.5-flash-002`.
3. **Upload Dataset:** Upload `eval/finetuning/learnova_stem_finetuning.jsonl`.
4. **Set Hyperparameters:**
   - Epochs: `4` to `8`
   - Batch size: `4`
   - Learning rate multiplier: `1.0`
5. **Start Tuning:** Run the fine-tuning job and record the resulting Tuned Model Resource Name (e.g., `tunedModels/learnova-stem-v1-abc123xyz`).

---

## 4. Connecting a Fine-Tuned Model Endpoint via Adapter

Once fine-tuning completes, simply update `.env`:
```env
# Switch from baseline model to tuned model endpoint
GEMINI_MODEL_TEXT=tunedModels/learnova-stem-v1-abc123xyz
```

The Learnova Model Router (`server/src/ai/modelRouter.ts`) immediately connects to the tuned endpoint with zero code changes required.

---

## 5. Comparative Evaluation Methodology

Before deploying a customized model to school students, run the standardized evaluation benchmark:

```bash
npm run test:eval
```

Compare the tuned model against the baseline on:
1. **Numerical Correctness** (Calculations & units)
2. **Pedagogical Explanation Clarity** (Socratic reasoning vs direct answer dumping)
3. **LaTeX Formatting Quality** (Valid KaTeX expressions)
4. **Child Safety & Ethical Guardrails** (Resistance to homework shortcuts)
