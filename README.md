# CampusFlow 🎓⚡
> **AI-Powered College Event & Task Management Platform**

CampusFlow transforms messy natural language event ideas into structured, actionable event roadmaps with deadlines, priorities, assignments, automated deadline monitoring, and a contextual AI co-pilot.

---

## 🌟 Key Features

1. **AI Event Planner (Gemini AI)**:
   - Provide an event name, target date, budget, and description.
   - Generates structured tasks with priorities, suggested roles/assignees, deadlines, institutional preparation/compliance checklists, and potential blind spots.
2. **Operations Dashboard**:
   - Executive metrics: Active Events, Pending Tasks, Overdue Items, Overall Progress bar.
   - Filterable action items (All, In Progress, Pending, Overdue, Completed).
   - Urgent notifications banner ("🔔 3 tasks need attention").
3. **Event Workspace & Details**:
   - Detailed task management with inline editing (deadlines, priority badges, assignments).
   - Preparation steps checklist (permits, safety, catering, audio equipment).
   - Potential blind spots & contingency mitigation strategies.
   - Suggested execution phase timeline.
4. **Context-Aware AI Assistant & Tool Execution**:
   - In-app event co-pilot powered by Gemini.
   - Quick prompts: "What should we finish today?", "Which tasks are overdue?", "Create a volunteer reminder message".
   - Tool calling: AI can mark tasks completed, assign members, or add new deliverables directly.
5. **Automated Workflows & Vercel Cron Ready**:
   - `runDailyAutomation()` monitors approaching milestones and flags overdue tasks.
   - Calculates real-time system health scores (0-100).
   - Configured for automated daily execution via Vercel Cron (`cron.json` / `vercel.json`).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Express full-stack server with Vite middleware integration
- **AI SDK**: `@google/genai` (Gemini 2.5 Flash)
- **Deployment**: Prepared for GitHub & Vercel deployment with serverless cron capabilities

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/campusflow.git
cd campusflow
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
├── server.ts                       # Express backend with Gemini API & cron endpoints
├── vercel.json                     # Vercel deployment & daily cron configuration
├── src/
│   ├── types/index.ts              # TypeScript definitions for EventPlan, Task, etc.
│   ├── data/mockData.ts            # Pre-configured demo data (TechFest 2026, etc.)
│   ├── services/
│   │   ├── api.ts                  # Client-side API bridge
│   │   └── automation.ts           # Modular runDailyAutomation logic
│   ├── context/
│   │   └── EventContext.tsx        # React Context & state persistence
│   ├── components/
│   │   ├── layout/                 # Sidebar, Navbar
│   │   ├── landing/                # SaaS Landing Page & Demo preview
│   │   ├── dashboard/              # Metrics, upcoming events, task board
│   │   ├── events/                 # Event details, tasks, planner modal
│   │   ├── tasks/                  # Universal cross-event task table
│   │   ├── calendar/               # Deadline calendar view
│   │   ├── assistant/              # Standalone AI assistant workspace
│   │   ├── automation/             # Automation hub & audit engine
│   │   └── common/                 # Toast, notification dropdowns
│   ├── App.tsx                     # Main application entry point
│   ├── main.tsx
│   └── index.css                   # Tailwind v4 configuration
```
