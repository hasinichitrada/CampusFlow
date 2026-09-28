import { EventPlan, Task, AutomationResult, RecommendedAction } from '../types';

/**
 * Core Automation Engine for CampusFlow.
 * Can be run client-side on-demand, or server-side triggered by Vercel Cron / API routes.
 */
export function runDailyAutomation(events: EventPlan[], referenceDateStr?: string): AutomationResult {
  // Use 2026-09-27 as the reference date if none passed, matching app context
  const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date('2026-09-27T12:00:00Z');
  
  let allTasks: Task[] = [];
  events.forEach(evt => {
    allTasks = allTasks.concat(evt.tasks.map(t => ({ ...t, eventId: evt.id })));
  });

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'completed');
  
  // Categorize non-completed tasks
  const overdueTasks: Task[] = [];
  const approachingTasks: Task[] = [];
  const pendingTasks: Task[] = [];
  const inProgressTasks: Task[] = [];

  allTasks.forEach(task => {
    if (task.status === 'completed') return;

    if (task.status === 'in-progress') {
      inProgressTasks.push(task);
    } else {
      pendingTasks.push(task);
    }

    // Check deadline
    if (task.deadline) {
      const taskDeadline = new Date(task.deadline);
      // Normalized to day boundaries
      const diffTime = taskDeadline.getTime() - refDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0 || task.status === 'overdue') {
        overdueTasks.push(task);
      } else if (diffDays <= 3) {
        // Approaching within 3 days
        approachingTasks.push(task);
      }
    }
  });

  // Calculate overall progress across all events
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Calculate Health Score (100 base, penalize for overdue tasks heavily, and for approaching high-priority tasks)
  let healthScore = 100;
  healthScore -= overdueTasks.length * 15;
  healthScore -= approachingTasks.filter(t => t.priority === 'High').length * 8;
  healthScore -= approachingTasks.filter(t => t.priority !== 'High').length * 3;
  if (healthScore < 15) healthScore = 15;
  if (healthScore > 100) healthScore = 100;

  // Generate recommended actions
  const recommendedActions: RecommendedAction[] = [];

  // Overdue actions
  overdueTasks.forEach(task => {
    const parentEvent = events.find(e => e.id === task.eventId);
    recommendedActions.push({
      id: `rec-ovd-${task.id}`,
      action: `Expedite: "${task.title}"`,
      reason: `Overdue since ${task.deadline}. Assigned to ${task.assignedTo || task.role} for ${parentEvent?.title || 'event'}.`,
      urgency: 'high',
      taskId: task.id,
      eventId: task.eventId,
    });
  });

  // Approaching high-priority tasks
  approachingTasks.filter(t => t.priority === 'High').forEach(task => {
    const parentEvent = events.find(e => e.id === task.eventId);
    recommendedActions.push({
      id: `rec-app-${task.id}`,
      action: `Review status: "${task.title}"`,
      reason: `Deadline approaching within 72 hours for ${parentEvent?.title || 'event'}.`,
      urgency: 'medium',
      taskId: task.id,
      eventId: task.eventId,
    });
  });

  // Check missing prep steps across events
  events.forEach(evt => {
    const missingHighImpactPrep = evt.prepSteps.filter(ps => !ps.isDone && (ps.category === 'permits' || ps.category === 'safety'));
    if (missingHighImpactPrep.length > 0) {
      recommendedActions.push({
        id: `rec-prep-${evt.id}`,
        action: `Clear safety & permits for ${evt.title}`,
        reason: `${missingHighImpactPrep.length} critical compliance items are pending (${missingHighImpactPrep[0].title}).`,
        urgency: 'high',
        eventId: evt.id,
      });
    }
  });

  // Generate Executive Summary
  let summary = `CampusFlow Automation Run: Monitored ${events.length} active events with ${totalTasks} total tasks. `;
  if (overdueTasks.length > 0) {
    summary += `⚠️ Alert: ${overdueTasks.length} task${overdueTasks.length > 1 ? 's are' : ' is'} currently overdue and require immediate student lead intervention. `;
  } else {
    summary += `✅ All tasks are currently on or ahead of schedule. `;
  }

  if (approachingTasks.length > 0) {
    summary += `${approachingTasks.length} task${approachingTasks.length > 1 ? 's have' : ' has'} deadlines arriving within the next 72 hours. `;
  }
  summary += `Overall campus initiative completion is currently at ${overallProgress}%. System health is rated at ${healthScore}/100.`;

  return {
    checkedAt: refDate.toISOString(),
    totalEvents: events.length,
    totalTasks,
    completedTasksCount: completedTasks.length,
    pendingTasksCount: pendingTasks.length,
    inProgressTasksCount: inProgressTasks.length,
    overdueTasksCount: overdueTasks.length,
    approachingTasksCount: approachingTasks.length,
    overdueTasks,
    approachingTasks,
    overallProgress,
    healthScore,
    executiveSummary: summary,
    recommendedActions,
  };
}
