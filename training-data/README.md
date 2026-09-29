# CampusFlow AI Agent Training & Fine-Tuning Kit 🎓🤖

This directory contains clean, structured datasets formatted in standard **JSONL** (JSON Lines) to fine-tune, train, or few-shot prompt AI agents for collegiate event and task operations.

---

## 📂 Datasets Included

| File | Description | Purpose | Format |
| :--- | :--- | :--- | :--- |
| `campusflow_event_planner_dataset.jsonl` | Natural language event descriptions → Structured JSON event plans | Fine-tuning the core Event Planner (tasks, deadlines, roles, prep steps, blind spots, timelines) | Chat JSONL (`system`, `user`, `assistant`) |
| `campusflow_function_calling_dataset.jsonl` | Co-pilot queries, state lookups, and function calling tool triggers | Fine-tuning the interactive assistant (`completeTask`, `createTask`, `assignTask`, etc.) | Tool Calling JSONL |

---

## 1. Event Planner Output Schema

When training your model, enforce the following structured output schema:

```json
{
  "summary": "Crisp 2-3 sentence executive summary of the event objectives and scale.",
  "tasks": [
    {
      "title": "Actionable task name",
      "description": "Granular instructions and deliverables",
      "deadline": "YYYY-MM-DD",
      "priority": "High | Medium | Low",
      "role": "Assigned team/committee (e.g. Logistics, PR, Tech)",
      "assignedTo": "Student name if provided",
      "status": "pending | in-progress | completed | overdue"
    }
  ],
  "prepSteps": [
    {
      "title": "Institutional compliance or safety clearance",
      "category": "permits | equipment | outreach | catering | safety | general",
      "isDone": false
    }
  ],
  "blindSpots": [
    {
      "risk": "Common collegiate operational risk",
      "recommendation": "Concrete mitigation strategy",
      "severity": "high | medium | low"
    }
  ],
  "timeline": [
    {
      "phaseName": "Phase name",
      "timeframe": "Cadence relative to event day",
      "keyDeliverables": ["Deliverable 1", "Deliverable 2"]
    }
  ]
}
```

---

## 2. System Instructions for Your Agent

```text
You are the CampusFlow AI Event Planning Agent. You convert unstructured college event descriptions into a structured, execution-ready JSON roadmap with tasks, suggested deadlines, priority tiers, role assignments, preparation compliance checklists, potential blind spots, and milestone timelines.
Always ensure suggested deadlines precede the actual event date, allocate realistic collegiate roles (Design, Tech Lead, Hospitality, PR & Outreach, Logistics, Student Council), and identify high-impact institutional risks (sound curfews, Wi-Fi bottlenecks, dean approval delays).
```

---

## 3. How to Fine-Tune on Google AI Studio / Gemini

1. Open [Google AI Studio](https://aistudio.google.com/).
2. Navigate to **Tuning** → **Create Tuned Model**.
3. Select your base model: **Gemini 2.5 Flash** or **Gemini 1.5 Flash**.
4. Upload `training-data/campusflow_event_planner_dataset.jsonl`.
5. Set Hyperparameters:
   - **Epochs:** 4 to 8
   - **Learning Rate Multiplier:** 1.0
   - **Batch Size:** 4 or 8
6. Click **Tune Model**. Once completed, your tuned model ID can be plugged directly into `server.ts`!
