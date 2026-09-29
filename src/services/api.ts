import { EventPlan, Task, AutomationResult, ChatMessage } from '../types';

export interface PlanEventPayload {
  title: string;
  date: string;
  description: string;
  teamMembers: string[];
  eventType: string;
  budget?: string;
}

export interface AssistantPayload {
  messages: { role: string; content: string }[];
  eventContext: EventPlan | null;
  allTasks: Task[];
}

export interface AssistantResponse {
  reply: string;
  toolCall?: {
    name: 'completeTask' | 'createTask' | 'updateTask' | 'assignTask' | 'getOverdueTasks' | 'generateReminder';
    args: any;
  };
}

export const api = {
  /**
   * Request Gemini to convert natural language event description to structured plan
   */
  async planEvent(payload: PlanEventPayload): Promise<any> {
    const res = await fetch('/api/gemini/plan-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to generate plan' }));
      throw new Error(err.error || `Server responded with ${res.status}`);
    }

    return await res.json();
  },

  /**
   * Communicate with event-level AI assistant with function calling
   */
  async askAssistant(payload: AssistantPayload): Promise<AssistantResponse> {
    const res = await fetch('/api/gemini/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Assistant failed to respond' }));
      throw new Error(err.error || `Server responded with ${res.status}`);
    }

    return await res.json();
  },

  /**
   * Run automated deadline and task monitoring
   */
  async triggerAutomation(events: EventPlan[], referenceDate?: string): Promise<AutomationResult> {
    const res = await fetch('/api/automation/daily-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events, referenceDate }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Automation run failed' }));
      throw new Error(err.error || `Server responded with ${res.status}`);
    }

    return await res.json();
  },

  /**
   * Check backend server health
   */
  async checkHealth(): Promise<{ status: string; hasGeminiKey: boolean }> {
    const res = await fetch('/api/health');
    return await res.json();
  },

  /**
   * Send a chat message to the n8n AI Agent webhook
   */
  async sendN8nMessage(message: string, sessionId?: string): Promise<{ output: string }> {
    const directWebhookUrl =
      'https://hasinich.app.n8n.cloud/webhook/4e208ad8-a989-4e3a-88e6-b74c707abc06/chat';

    try {
      // First try via local backend proxy
      const res = await fetch('/api/n8n/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatInput: message, sessionId }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          output:
            data.output ||
            data.response ||
            data.text ||
            (typeof data === 'string' ? data : JSON.stringify(data)),
        };
      }
    } catch (e) {
      console.warn('Backend proxy unreachable, falling back to direct n8n webhook', e);
    }

    // Direct fallback
    const directRes = await fetch(directWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatInput: message,
        sessionId: sessionId || 'campusflow-web-session',
      }),
    });

    if (!directRes.ok) {
      const err = await directRes.text().catch(() => 'n8n webhook error');
      throw new Error(`n8n Agent error: ${directRes.status} - ${err}`);
    }

    const data = await directRes.json();
    return {
      output:
        data.output ||
        data.response ||
        data.text ||
        (typeof data === 'string' ? data : JSON.stringify(data)),
    };
  },
};
