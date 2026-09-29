import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { runDailyAutomation } from './src/services/automation.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'CampusFlow API',
    hasGeminiKey: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// 1. AI Event Plan Generation Endpoint
app.post('/api/gemini/plan-event', async (req: Request, res: Response) => {
  const { title, date, description, teamMembers, eventType, budget } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Event title and description are required.' });
  }

  const prompt = `
You are the AI Event Planner for "CampusFlow", an elite college event management platform.
A college organizing team wants to plan the following event:

Event Title: "${title}"
Event Date: "${date || 'To be decided'}"
Event Type: "${eventType || 'General Campus Event'}"
Estimated Budget: "${budget || 'Not specified'}"
Available Team Members / Roles: ${Array.isArray(teamMembers) && teamMembers.length > 0 ? teamMembers.join(', ') : 'Student Volunteers, Tech Team, Logistics, Design, PR'}

Event Description & Requirements:
"${description}"

Analyze the event description thoroughly and break it down into an organized, professional event plan.
Produce a comprehensive JSON response matching the following schema:
{
  "summary": "Crisp 2-3 sentence executive summary of the event objectives and scale.",
  "tasks": [
    {
      "title": "Specific, actionable task title (e.g., 'Design high-res posters & social media banners')",
      "description": "Details, deliverables, and requirements for this task.",
      "deadline": "Suggested deadline date (YYYY-MM-DD or relative like '2026-10-05', prior to event date ${date})",
      "priority": "High | Medium | Low",
      "role": "Suggested team or role (e.g., 'Design Team', 'Logistics', 'Tech Team', 'Hospitality', 'PR & Outreach')",
      "assignedTo": "Suggested team member name from the provided list if available, else a role lead",
      "status": "pending"
    }
  ],
  "prepSteps": [
    {
      "title": "Essential preparation or compliance requirement (e.g. Dean permissions, audio check)",
      "category": "permits | equipment | outreach | catering | safety | general",
      "isDone": false
    }
  ],
  "blindSpots": [
    {
      "risk": "A potential overlooked risk or missing task that college organizers often forget",
      "recommendation": "Concrete mitigation step",
      "severity": "high | medium | low"
    }
  ],
  "timeline": [
    {
      "phaseName": "Phase name (e.g. 'Phase 1: Foundation & Approvals')",
      "timeframe": "Time interval (e.g. '3 weeks before')",
      "keyDeliverables": ["Deliverable 1", "Deliverable 2"]
    }
  ]
}

Provide 6 to 10 practical tasks covering posters/branding, logistics/venue, approvals, budget/catering, registration, technical/AV setup, social outreach, and day-of-event coordination.
Be realistic, specific to college campus operations, and ensure suggested deadlines precede the event date.
`;

  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment.');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  deadline: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                  role: { type: Type.STRING },
                  assignedTo: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ['pending', 'in-progress', 'completed', 'overdue'] },
                },
                required: ['title', 'description', 'deadline', 'priority', 'role', 'status'],
              },
            },
            prepSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ['permits', 'equipment', 'outreach', 'catering', 'safety', 'general'] },
                  isDone: { type: Type.BOOLEAN },
                },
                required: ['title', 'category', 'isDone'],
              },
            },
            blindSpots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  risk: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
                },
                required: ['risk', 'recommendation', 'severity'],
              },
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseName: { type: Type.STRING },
                  timeframe: { type: Type.STRING },
                  keyDeliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['phaseName', 'timeframe', 'keyDeliverables'],
              },
            },
          },
          required: ['summary', 'tasks', 'prepSteps', 'blindSpots', 'timeline'],
        },
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.warn('Gemini API call error in /api/gemini/plan-event, applying smart heuristic planner:', err?.message);

    // Resilient fallback plan generator based on prompt inputs
    const evtDate = date || '2026-10-20';
    const parsedDate = new Date(evtDate);
    const formatDate = (daysBefore: number) => {
      const d = new Date(parsedDate);
      d.setDate(d.getDate() - daysBefore);
      return d.toISOString().split('T')[0];
    };

    const team = (teamMembers && teamMembers.length > 0) ? teamMembers : ['Alex Chen', 'Priya Sharma', 'Sarah Miller', 'Marcus Brody'];
    const getAssignee = (idx: number) => team[idx % team.length];

    const fallbackPlan = {
      summary: `Automated plan for "${title}". A comprehensive roadmap covering venue logistics, registration workflows, volunteer delegation, outreach campaigns, and real-time operational execution for campus success.`,
      tasks: [
        {
          title: 'Design event posters, banners & digital promo kits',
          description: 'Create high-resolution graphics for campus digital display boards, printed noticeboard flyers, and Instagram story carousels.',
          deadline: formatDate(14),
          priority: 'High',
          role: 'Design & Media',
          assignedTo: getAssignee(0),
          status: 'pending',
        },
        {
          title: 'Configure registration portal & badge check-in QR codes',
          description: 'Launch Google Form or ticket portal, test automated confirmation email responses, and prepare CSV check-in rosters.',
          deadline: formatDate(12),
          priority: 'High',
          role: 'Tech Lead',
          assignedTo: getAssignee(1),
          status: 'pending',
        },
        {
          title: 'Confirm venue booking, acoustics & seating layout',
          description: 'Obtain facility director sign-off, verify podium microphones, projector HDMI cords, and electrical extension boxes.',
          deadline: formatDate(10),
          priority: 'High',
          role: 'Logistics',
          assignedTo: getAssignee(2),
          status: 'pending',
        },
        {
          title: 'Recruit and assign student volunteer coordinators',
          description: 'Hold a 30-minute orientation briefing, delegate roles across attendee registration, VIP escort, and technical troubleshooting.',
          deadline: formatDate(7),
          priority: 'Medium',
          role: 'Student Council',
          assignedTo: getAssignee(3),
          status: 'pending',
        },
        {
          title: 'Arrange refreshments, snacks & speaker water bottles',
          description: 'Coordinate catering quantities, confirm dietary restrictions (vegetarian/vegan), and schedule delivery 45 minutes prior.',
          deadline: formatDate(5),
          priority: 'Medium',
          role: 'Hospitality',
          assignedTo: getAssignee(0),
          status: 'pending',
        },
        {
          title: 'Prepare participant certificates & mementos',
          description: 'Design merit and participation certificates, verify attendee name roster, and obtain Dean’s approval signature.',
          deadline: formatDate(4),
          priority: 'High',
          role: 'Media & Awards',
          assignedTo: getAssignee(1),
          status: 'pending',
        },
        {
          title: 'Social media countdown campaign & club shoutouts',
          description: 'Run 3-day countdown stories, partner with campus society discord servers, and announce keynote topics.',
          deadline: formatDate(2),
          priority: 'Medium',
          role: 'PR & Outreach',
          assignedTo: getAssignee(2),
          status: 'pending',
        },
        {
          title: 'Final participant roster freeze & emergency dry-run',
          description: 'Conduct audio-visual rehearsal, print offline attendee rosters, and test backup microphones.',
          deadline: formatDate(1),
          priority: 'High',
          role: 'Admin Lead',
          assignedTo: getAssignee(3),
          status: 'pending',
        },
      ],
      prepSteps: [
        { title: 'Submit faculty advisor and security clearance permit', category: 'permits', isDone: false },
        { title: 'Test AV sound board, wireless mics, and projector lumens', category: 'equipment', isDone: false },
        { title: 'Establish emergency first-aid station and security desk contact', category: 'safety', isDone: false },
        { title: 'Verify dietary numbers with catering vendor', category: 'catering', isDone: false },
      ],
      blindSpots: [
        {
          risk: 'Campus Wi-Fi connectivity bottlenecks during live demo or sign-in',
          recommendation: 'Coordinate with Campus IT for a temporary dedicated staff SSID or offline roster backups.',
          severity: 'high',
        },
        {
          risk: 'Delay in faculty dean physical signature for awards/certificates',
          recommendation: 'Submit certificate batch proofs to the dean’s office at least 5 business days early.',
          severity: 'high',
        },
        {
          risk: 'Walk-in registrant overflow exceeding hall chair capacity',
          recommendation: 'Keep 30 folding chairs and extra nametags on standby in the adjacent corridor.',
          severity: 'medium',
        },
      ],
      timeline: [
        {
          phaseName: 'Phase 1: Approvals & Branding',
          timeframe: '2-3 Weeks Before',
          keyDeliverables: ['Venue reservation', 'Branding finalized', 'Registration form published'],
        },
        {
          phaseName: 'Phase 2: Outreach & Logistics',
          timeframe: '1-2 Weeks Before',
          keyDeliverables: ['Volunteer briefing', 'Catering finalized', 'Certificates ordered'],
        },
        {
          phaseName: 'Phase 3: Countdown & Dry Run',
          timeframe: '3 Days Before',
          keyDeliverables: ['AV soundcheck', 'Participant list finalized', 'Name badges printed'],
        },
        {
          phaseName: 'Phase 4: Event Day',
          timeframe: 'Day of Event',
          keyDeliverables: ['Welcome desk check-ins', 'Stage coordination', 'Certificates distribution'],
        },
      ],
    };

    return res.json(fallbackPlan);
  }
});

// 2. AI Event Assistant with Function Calling Support
app.post('/api/gemini/assistant', async (req: Request, res: Response) => {
  const { messages, eventContext, allTasks } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  const latestUserMessage = messages[messages.length - 1]?.content || '';

  const systemPrompt = `
You are the AI Assistant for CampusFlow, a collegiate event management workspace.
You have real-time visibility into the current event and its tasks.

CURRENT EVENT CONTEXT:
${eventContext ? JSON.stringify(eventContext, null, 2) : 'No specific event selected'}

CURRENT TASK LIST:
${allTasks ? JSON.stringify(allTasks, null, 2) : 'No tasks provided'}

You are equipped with tools to execute user actions:
- completeTask(taskIdOrTitle)
- createTask(title, priority, deadline, role, assignedTo, description)
- updateTask(taskIdOrTitle, updates)
- assignTask(taskIdOrTitle, assignee)
- getOverdueTasks()
- generateReminder(audience, urgentOnly)

GUIDELINES:
1. If the user asks an analytical question (e.g. "What should we finish today?", "Which tasks are overdue?", "Give me a progress report"), analyze the current tasks and provide a concise, encouraging, formatted markdown response.
2. If the user asks to perform an action (e.g. "Mark the poster task as complete", "Add a task to print volunteer badges by tomorrow", "Assign refreshments to Jordan"), trigger the corresponding tool function call.
3. If the user asks for a volunteer reminder message, format a ready-to-copy WhatsApp/Discord announcement.
4. Keep answers punchy, helpful, and tailored to college team leads.
`;

  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY missing');
    }

    const tools = [
      {
        functionDeclarations: [
          {
            name: 'completeTask',
            description: 'Mark a task as completed in the event workspace.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                taskIdOrTitle: { type: Type.STRING, description: 'The ID or substring of the task title to complete' },
              },
              required: ['taskIdOrTitle'],
            },
          },
          {
            name: 'createTask',
            description: 'Add a new task to the current event.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Task title' },
                priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                deadline: { type: Type.STRING, description: 'Deadline date in YYYY-MM-DD' },
                role: { type: Type.STRING, description: 'Team or role' },
                assignedTo: { type: Type.STRING, description: 'Assigned member' },
                description: { type: Type.STRING, description: 'Detailed instructions' },
              },
              required: ['title', 'priority', 'deadline', 'role'],
            },
          },
          {
            name: 'assignTask',
            description: 'Assign a task to a specific team member.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                taskIdOrTitle: { type: Type.STRING, description: 'Task ID or title' },
                assignee: { type: Type.STRING, description: 'Person name to assign to' },
              },
              required: ['taskIdOrTitle', 'assignee'],
            },
          },
          {
            name: 'getOverdueTasks',
            description: 'Retrieve all currently overdue tasks across the event.',
            parameters: {
              type: Type.OBJECT,
              properties: {},
            },
          },
          {
            name: 'generateReminder',
            description: 'Draft a student-friendly reminder message for team members or volunteers.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                audience: { type: Type.STRING, description: 'Volunteers, core team, or specific role' },
                urgentOnly: { type: Type.BOOLEAN, description: 'Whether to focus solely on overdue tasks' },
              },
              required: ['audience'],
            },
          },
        ],
      },
    ];

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt + '\n\nUser Question: ' + latestUserMessage }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        tools: tools as any,
      },
    });

    const candidate = response.candidates?.[0];
    const functionCalls = candidate?.content?.parts?.filter(p => p.functionCall);

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0].functionCall;
      return res.json({
        reply: `Action executed: invoking ${call?.name}`,
        toolCall: {
          name: call?.name,
          args: call?.args,
        },
      });
    }

    const text = response.text || "I've reviewed your event plan and tasks. Let me know what you'd like to adjust or check next!";
    return res.json({ reply: text });
  } catch (err: any) {
    console.warn('Gemini Assistant fallback triggered:', err?.message);

    // Intelligent local assistant fallback for common prompts
    const lower = latestUserMessage.toLowerCase();
    const tasks = allTasks || [];

    if (lower.includes('finish today') || lower.includes('due today')) {
      const urgent = tasks.filter((t: any) => t.status !== 'completed' && (t.priority === 'High' || t.status === 'overdue'));
      return res.json({
        reply: `### 🎯 Priority Focus for Today\n\nHere are the top tasks requiring your attention:\n\n${
          urgent.length > 0
            ? urgent.slice(0, 3).map((t: any) => `* **${t.title}** (${t.priority} Priority) — Assigned to *${t.assignedTo || t.role}* (Due: ${t.deadline})`).join('\n')
            : '✨ You are in great shape! No urgent high-priority tasks are due immediately.'
        }\n\n*Tip: Check the badges and certificates first to prevent last-minute delays.*`,
      });
    }

    if (lower.includes('overdue')) {
      const overdue = tasks.filter((t: any) => t.status === 'overdue' || (t.deadline && t.deadline < '2026-09-27' && t.status !== 'completed'));
      return res.json({
        reply: `### ⚠️ Overdue Task Alert\n\n${
          overdue.length > 0
            ? `There ${overdue.length === 1 ? 'is' : 'are'} **${overdue.length} overdue task${overdue.length === 1 ? '' : 's'}**:\n\n` +
              overdue.map((t: any) => `* 🔴 **${t.title}** — Was due on **${t.deadline}** (Assigned to: *${t.assignedTo || t.role}*)`).join('\n') +
              `\n\n*Action suggested:* Ping the assignee to get an updated completion ETA or reassign.`
            : '✅ Excellent news! There are currently **0 overdue tasks** in this project.'
        }`,
      });
    }

    if (lower.includes('complete') || lower.includes('mark')) {
      // Find matching task
      const match = tasks.find((t: any) => lower.includes(t.title.toLowerCase().slice(0, 8)));
      if (match) {
        return res.json({
          reply: `Done! I've updated **${match.title}** to completed.`,
          toolCall: {
            name: 'completeTask',
            args: { taskIdOrTitle: match.id },
          },
        });
      }
    }

    if (lower.includes('reminder') || lower.includes('volunteer')) {
      return res.json({
        reply: `### 📢 Ready-to-Send Volunteer Reminder\n\nCopy & paste this into your WhatsApp or Discord announcement channel:\n\n\`\`\`text\nHey Team! 👋 Quick reminder about ${eventContext?.title || 'our upcoming campus event'}:\n\n🗓️ Date: ${eventContext?.date || 'Coming soon'}\n⚡ Current Progress: ${eventContext?.progress || '70'}% completed\n\n📌 Please make sure to check off your assigned items in CampusFlow before this Friday. If you need any equipment, badge access, or budget approvals, reply in the coordination channel.\n\nThank you for making this event happen! 🚀\n\`\`\``,
      });
    }

    if (lower.includes('progress') || lower.includes('report')) {
      const completed = tasks.filter((t: any) => t.status === 'completed').length;
      const total = tasks.length;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      return res.json({
        reply: `### 📊 Event Health & Progress Report\n\n* **Event:** ${eventContext?.title || 'Campus Event'}\n* **Overall Completion:** **${pct}%** (${completed}/${total} tasks finished)\n* **Active Tasks:** ${total - completed} remaining\n\nYour timeline is tracking steadily towards the event on **${eventContext?.date || 'October 15, 2026'}**. Keep up the momentum!`,
      });
    }

    return res.json({
      reply: `I'm analyzing **${eventContext?.title || 'your event'}**. With ${tasks.length} total tasks registered, you can ask me to find overdue tasks, draft volunteer announcements, or automatically mark items completed!`,
    });
  }
});

// 3. Automation Endpoint (Ready for Vercel Cron trigger)
app.post('/api/automation/daily-check', (req: Request, res: Response) => {
  const { events, referenceDate } = req.body;
  if (!events || !Array.isArray(events)) {
    return res.status(400).json({ error: 'Valid events array required.' });
  }

  const result = runDailyAutomation(events, referenceDate);
  res.json(result);
});

// 4. n8n AI Agent Webhook Proxy Endpoint
const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  'https://hasinich.app.n8n.cloud/webhook/4e208ad8-a989-4e3a-88e6-b74c707abc06/chat';

app.post('/api/n8n/chat', async (req: Request, res: Response) => {
  const { message, chatInput, sessionId, context } = req.body;
  const textToSend = chatInput || message || '';

  if (!textToSend.trim()) {
    return res.status(400).json({ error: 'Message or chatInput is required.' });
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatInput: textToSend,
        sessionId: sessionId || 'campusflow-web-session',
        context: context || {},
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('n8n webhook error response:', errText);
      return res.status(response.status).json({
        error: `n8n webhook responded with status ${response.status}`,
        details: errText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    console.error('Failed to proxy to n8n webhook:', err);
    return res.status(500).json({
      error: 'Failed to communicate with n8n agent webhook.',
      details: err.message,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 CampusFlow Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
