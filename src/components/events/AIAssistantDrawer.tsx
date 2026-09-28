import React, { useState, useRef, useEffect } from 'react';
import { useEvents } from '../../context/EventContext';
import { EventPlan, ChatMessage } from '../../types';
import { api } from '../../services/api';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Loader2,
  Copy,
  Check,
  CheckCircle,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

interface Props {
  event: EventPlan;
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantDrawer: React.FC<Props> = ({ event, isOpen, onClose }) => {
  const { executeToolCall, showToast } = useEvents();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `Hello! I'm your **CampusFlow Co-Pilot** for **${event.title}**. You can ask me what needs to be finished today, request overdue task breakdowns, draft reminder messages for volunteers, or ask me to mark tasks completed!`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickQuestions = [
    'What should we finish today?',
    'Which tasks are overdue?',
    'What are the most important tasks?',
    'Create a reminder message for the volunteers.',
    'Give me a short progress report.',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.askAssistant({
        messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        eventContext: event,
        allTasks: event.tasks,
      });

      // Check if tool call returned
      if (response.toolCall) {
        executeToolCall(response.toolCall.name, response.toolCall.args);
      }

      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        toolCall: response.toolCall ? {
          name: response.toolCall.name as any,
          args: response.toolCall.args,
        } : undefined,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I ran into an issue connecting to the AI co-pilot. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    showToast('Copied reminder to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 md:w-[420px] bg-white border-l border-stone-200/90 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-stone-200/80 bg-[#FAF9F5] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#4E785F] text-white flex items-center justify-center shadow-2xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <span>Event AI Co-Pilot</span>
              <span className="text-[10px] bg-[#EAE8E0] text-[#2F4A38] px-1.5 py-0.2 rounded-full font-bold">
                Context-Aware
              </span>
            </h3>
            <p className="text-[11px] text-stone-500 truncate max-w-[200px]">
              {event.title}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Chips */}
      <div className="p-3 border-b border-stone-100 bg-stone-50/50">
        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#4E785F]" />
          <span>Quick Prompts:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-stone-300 text-stone-700 hover:text-stone-900 transition-colors text-left font-medium cursor-pointer shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#4E785F] text-white rounded-tr-xs'
                  : 'bg-stone-100 text-stone-900 rounded-tl-xs border border-stone-200/60'
              }`}
            >
              <div className="whitespace-pre-line font-normal space-y-1">
                {msg.content}
              </div>

              {/* Tool call badge */}
              {msg.toolCall && (
                <div className="mt-2 pt-2 border-t border-stone-200/80 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Executed action: {msg.toolCall.name}</span>
                </div>
              )}
            </div>

            {/* Quick copy for assistant reminder texts */}
            {msg.role === 'assistant' && msg.content.includes('```') && (
              <button
                onClick={() => {
                  const match = msg.content.match(/```(?:\w+)?\n([\s\S]*?)```/);
                  const toCopy = match ? match[1] : msg.content;
                  copyToClipboard(toCopy, msg.id);
                }}
                className="mt-1 flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-900"
              >
                {copiedId === msg.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy message</span>
                  </>
                )}
              </button>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-stone-100 rounded-2xl max-w-[70%] text-stone-500 text-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4E785F]" />
            <span>Analyzing event data & tasks...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-stone-200/80 bg-white">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask AI or say: 'Mark poster task complete'..."
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4E785F]/30 bg-stone-50/40"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#4E785F] hover:bg-[#3D634C] text-white disabled:opacity-50 transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-stone-400 text-center mt-2">
          Uses live tasks and deadlines to answer & perform actions
        </p>
      </div>
    </div>
  );
};
