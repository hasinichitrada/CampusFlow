import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventPlan, Task, NotificationItem, AutomationResult, Priority, TaskStatus } from '../types';
import { INITIAL_EVENTS, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { api, PlanEventPayload } from '../services/api';
import { runDailyAutomation } from '../services/automation';

export type NavigationTab = 'landing' | 'dashboard' | 'events' | 'event-detail' | 'tasks' | 'calendar' | 'assistant' | 'automation';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface EventContextType {
  events: EventPlan[];
  selectedEventId: string | null;
  currentEvent: EventPlan | null;
  activeTab: NavigationTab;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  isGenerating: boolean;
  isAutomating: boolean;
  lastAutomationResult: AutomationResult | null;
  toast: ToastState | null;

  // Actions
  setActiveTab: (tab: NavigationTab) => void;
  setSelectedEventId: (id: string | null) => void;
  selectEventAndNavigate: (id: string) => void;
  createEventPlan: (payload: PlanEventPayload) => Promise<EventPlan>;
  toggleTaskComplete: (eventId: string, taskId: string) => void;
  updateTask: (eventId: string, taskId: string, updates: Partial<Task>) => void;
  addTask: (eventId: string, task: Omit<Task, 'id' | 'eventId'>) => void;
  deleteTask: (eventId: string, taskId: string) => void;
  togglePrepStep: (eventId: string, stepId: string) => void;
  runAutomation: () => Promise<AutomationResult>;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetDemoData: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  executeToolCall: (name: string, args: any) => void;
}

const STORAGE_KEY = 'campusflow_events_v1';
const NOTIF_KEY = 'campusflow_notifications_v1';

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading stored events', e);
    }
    return INITIAL_EVENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIF_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading stored notifications', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('landing');
  const [selectedEventId, setSelectedEventId] = useState<string | null>('evt-techfest-2026');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutomating, setIsAutomating] = useState(false);
  const [lastAutomationResult, setLastAutomationResult] = useState<AutomationResult | null>(() => {
    return runDailyAutomation(INITIAL_EVENTS);
  });
  const [toast, setToast] = useState<ToastState | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  }, [notifications]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(current => (current?.id === id ? null : current));
    }, 4000);
  };

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0] || null;

  const selectEventAndNavigate = (id: string) => {
    setSelectedEventId(id);
    setActiveTab('event-detail');
  };

  const calculateEventProgress = (tasks: Task[]): number => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  const toggleTaskComplete = (eventId: string, taskId: string) => {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id !== eventId) return evt;
        const updatedTasks = evt.tasks.map(t => {
          if (t.id !== taskId) return t;
          const isComp = t.status === 'completed';
          const newStatus: TaskStatus = isComp ? 'pending' : 'completed';
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        });
        const progress = calculateEventProgress(updatedTasks);
        return {
          ...evt,
          tasks: updatedTasks,
          progress,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast('Task status updated', 'success');
  };

  const updateTask = (eventId: string, taskId: string, updates: Partial<Task>) => {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id !== eventId) return evt;
        const updatedTasks = evt.tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t));
        const progress = calculateEventProgress(updatedTasks);
        return {
          ...evt,
          tasks: updatedTasks,
          progress,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast('Task updated successfully', 'success');
  };

  const addTask = (eventId: string, taskData: Omit<Task, 'id' | 'eventId'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      eventId,
    };
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id !== eventId) return evt;
        const updatedTasks = [newTask, ...evt.tasks];
        const progress = calculateEventProgress(updatedTasks);
        return {
          ...evt,
          tasks: updatedTasks,
          progress,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast(`Added: "${newTask.title}"`, 'success');
  };

  const deleteTask = (eventId: string, taskId: string) => {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id !== eventId) return evt;
        const updatedTasks = evt.tasks.filter(t => t.id !== taskId);
        const progress = calculateEventProgress(updatedTasks);
        return {
          ...evt,
          tasks: updatedTasks,
          progress,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast('Task removed', 'info');
  };

  const togglePrepStep = (eventId: string, stepId: string) => {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id !== eventId) return evt;
        const updatedSteps = evt.prepSteps.map(ps => (ps.id === stepId ? { ...ps, isDone: !ps.isDone } : ps));
        return {
          ...evt,
          prepSteps: updatedSteps,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const createEventPlan = async (payload: PlanEventPayload): Promise<EventPlan> => {
    setIsGenerating(true);
    try {
      const aiResponse = await api.planEvent(payload);

      const newEventId = `evt-${Date.now()}`;
      const mappedTasks: Task[] = (aiResponse.tasks || []).map((t: any, idx: number) => ({
        id: `task-${Date.now()}-${idx}`,
        eventId: newEventId,
        title: t.title || 'Event task',
        description: t.description || '',
        deadline: t.deadline || payload.date,
        priority: (t.priority as Priority) || 'Medium',
        role: t.role || 'Event Team',
        assignedTo: t.assignedTo || (payload.teamMembers.length > 0 ? payload.teamMembers[idx % payload.teamMembers.length] : undefined),
        status: (t.status as TaskStatus) || 'pending',
      }));

      const newEvent: EventPlan = {
        id: newEventId,
        title: payload.title,
        date: payload.date,
        description: payload.description,
        eventType: payload.eventType,
        budget: payload.budget || 'Not specified',
        teamMembers: payload.teamMembers.length > 0 ? payload.teamMembers : ['Organizing Lead'],
        summary: aiResponse.summary || `Event plan for ${payload.title}`,
        tasks: mappedTasks,
        prepSteps: (aiResponse.prepSteps || []).map((ps: any, idx: number) => ({
          id: `ps-${Date.now()}-${idx}`,
          title: ps.title,
          category: ps.category || 'general',
          isDone: !!ps.isDone,
        })),
        blindSpots: (aiResponse.blindSpots || []).map((bs: any, idx: number) => ({
          id: `bs-${Date.now()}-${idx}`,
          risk: bs.risk,
          recommendation: bs.recommendation,
          severity: bs.severity || 'medium',
        })),
        timeline: aiResponse.timeline || [],
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setEvents(prev => [newEvent, ...prev]);
      setSelectedEventId(newEventId);
      setActiveTab('event-detail');
      showToast(`✨ Generated ${mappedTasks.length} tasks for "${newEvent.title}"!`, 'success');
      return newEvent;
    } catch (err: any) {
      showToast(err.message || 'Failed to generate plan. Please try again.', 'error');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const runAutomation = async (): Promise<AutomationResult> => {
    setIsAutomating(true);
    try {
      let result: AutomationResult;
      try {
        result = await api.triggerAutomation(events);
      } catch {
        result = runDailyAutomation(events);
      }
      setLastAutomationResult(result);

      // Generate new notifications from overdue and high-urgency actions
      const newNotifs: NotificationItem[] = [];
      result.recommendedActions.slice(0, 3).forEach(rec => {
        newNotifs.push({
          id: `notif-auto-${Date.now()}-${rec.id}`,
          title: rec.action,
          message: rec.reason,
          type: rec.urgency === 'high' ? 'alert' : 'warning',
          timestamp: new Date().toISOString(),
          read: false,
          eventId: rec.eventId,
          taskId: rec.taskId,
        });
      });

      if (newNotifs.length > 0) {
        setNotifications(prev => [...newNotifs, ...prev]);
      }

      showToast(`⚡ Daily automation finished. Health score: ${result.healthScore}/100`, 'info');
      return result;
    } finally {
      setIsAutomating(false);
    }
  };

  const executeToolCall = (name: string, args: any) => {
    if (!currentEvent) return;

    if (name === 'completeTask') {
      const query = (args?.taskIdOrTitle || '').toLowerCase();
      const task = currentEvent.tasks.find(
        t => t.id === args?.taskIdOrTitle || t.title.toLowerCase().includes(query)
      );
      if (task) {
        toggleTaskComplete(currentEvent.id, task.id);
        showToast(`AI marked "${task.title}" as completed`, 'success');
      }
    } else if (name === 'createTask') {
      addTask(currentEvent.id, {
        title: args.title || 'New AI Task',
        description: args.description || '',
        deadline: args.deadline || currentEvent.date,
        priority: (args.priority as Priority) || 'Medium',
        role: args.role || 'Volunteer Team',
        assignedTo: args.assignedTo,
        status: 'pending',
      });
      showToast(`AI added task: "${args.title}"`, 'success');
    } else if (name === 'assignTask') {
      const query = (args?.taskIdOrTitle || '').toLowerCase();
      const task = currentEvent.tasks.find(
        t => t.id === args?.taskIdOrTitle || t.title.toLowerCase().includes(query)
      );
      if (task && args.assignee) {
        updateTask(currentEvent.id, task.id, { assignedTo: args.assignee });
        showToast(`AI assigned "${task.title}" to ${args.assignee}`, 'success');
      }
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('All notifications cleared', 'info');
  };

  const resetDemoData = () => {
    setEvents(INITIAL_EVENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedEventId('evt-techfest-2026');
    setLastAutomationResult(runDailyAutomation(INITIAL_EVENTS));
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NOTIF_KEY);
    showToast('Reset to demo events & tasks', 'info');
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <EventContext.Provider
      value={{
        events,
        selectedEventId,
        currentEvent,
        activeTab,
        notifications,
        unreadNotificationCount,
        isGenerating,
        isAutomating,
        lastAutomationResult,
        toast,
        setActiveTab,
        setSelectedEventId,
        selectEventAndNavigate,
        createEventPlan,
        toggleTaskComplete,
        updateTask,
        addTask,
        deleteTask,
        togglePrepStep,
        runAutomation,
        markNotificationRead,
        clearAllNotifications,
        resetDemoData,
        showToast,
        executeToolCall,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvents must be used within an EventProvider');
  return context;
};
