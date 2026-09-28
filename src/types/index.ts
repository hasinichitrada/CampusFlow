export type Priority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD or readable string
  priority: Priority;
  role: string; // e.g. "Design Team", "Logistics", "Tech Lead"
  assignedTo?: string; // e.g. "Priya Sharma"
  status: TaskStatus;
  dependencies?: string[];
  completedAt?: string;
}

export interface PrepStep {
  id: string;
  title: string;
  description?: string;
  isDone: boolean;
  category: 'permits' | 'equipment' | 'outreach' | 'catering' | 'safety' | 'general';
}

export interface BlindSpot {
  id: string;
  risk: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
}

export interface TimelinePhase {
  phaseName: string;
  timeframe: string; // e.g., "3 weeks before event"
  keyDeliverables: string[];
}

export interface EventPlan {
  id: string;
  title: string;
  date: string; // ISO date string or formatted date
  description: string;
  eventType: string; // e.g. "Technical Fest", "Hackathon", "Seminar", "Cultural Night"
  budget?: string;
  teamMembers: string[];
  summary: string;
  tasks: Task[];
  prepSteps: PrepStep[];
  blindSpots: BlindSpot[];
  timeline: TimelinePhase[];
  progress: number; // 0 - 100
  createdAt: string;
  updatedAt: string;
}

export interface RecommendedAction {
  id: string;
  action: string;
  reason: string;
  urgency: 'high' | 'medium' | 'low';
  taskId?: string;
  eventId?: string;
}

export interface AutomationResult {
  checkedAt: string;
  totalEvents: number;
  totalTasks: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  inProgressTasksCount: number;
  overdueTasksCount: number;
  approachingTasksCount: number;
  overdueTasks: Task[];
  approachingTasks: Task[];
  overallProgress: number;
  healthScore: number; // 0 - 100
  executiveSummary: string;
  recommendedActions: RecommendedAction[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  eventId?: string;
  taskId?: string;
}

export interface ToolCallAction {
  name: 'completeTask' | 'createTask' | 'updateTask' | 'assignTask' | 'getOverdueTasks' | 'generateReminder';
  args: any;
  result?: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCall?: ToolCallAction;
}
