import React, { useState, useRef, useEffect } from 'react';
import { useEvents } from '../../context/EventContext';
import { ChatMessage } from '../../types';
import { api } from '../../services/api';
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  Copy,
  Check,
  CheckCircle,
  FolderKanban,
  Calendar,
  MessageSquare,
} from 'lucide-react';

export const StandaloneAssistantPage: React.FC = () => {
  const { events, currentEvent, setSelectedEventId, executeToolCall, showToast } = useEvents();

  const [engine, setEngine] = useState<'gemini' | 'n8n'>('n8n');
  const [selectedEvtId, setSelectedEvtId] = useState(currentEvent?.id || events[0]?.id || '');
  const activeEvt = events.find(e => e.id === selectedEvtId) || currentEvent;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content: `👋 Welcome! I am connected to your **n8n AI Workflow Agent** (hosted on \`hasinich.app.n8n.cloud\`). You can also switch to the Gemini co-pilot using the toggle above.\n\nAsk me anything about planning events, tracking tasks, organizing volunteers, or preparing fests!`,
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

  const quickPrompts = [
    'What should we finish today?',
    'Which tasks are overdue across our committees?',
    'What are the most critical tasks for this week?',
    'Create an energetic volunteer reminder message for WhatsApp.',
    'Give me an executive progress report for our faculty advisor.',
  ];

  const handleSend = async (customPrompt?: string) => {
    const text = (customPrompt || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    if (engine === 'n8n') {
      try {
        const res = await api.sendN8nMessage(text, `standalone-${selectedEvtId || 'main'}`);
        const assistantMsg: ChatMessage = {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          content: res.output,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, assistantMsg]);
      } catch (err: any) {
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `⚠️ Could not reach n8n agent: ${err.message || 'Please check workflow connection.'}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const response = await api.askAssistant({
        messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        eventContext: activeEvt,
        allTasks: activeEvt?.tasks || [],
      });

      if (response.toolCall) {
        executeToolCall(response.toolCall.name, response.toolCall.args);
      }

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        toolCall: response.toolCall ? {
          name: response.toolCall.name as any,
          args: response.toolCall.args,
        } : undefined,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I had trouble generating a response. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied reminder to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight flex items-center gap-2">
            <Bot className="w-7 h-7 text-[#4E785F]" />
            <span>CampusFlow AI Co-Pilot</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Natural language event intelligence, automated broadcasts, and tool execution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Agent Selector (n8n vs Gemini) */}
          <div className="flex items-center p-1 bg-stone-200/70 rounded-2xl">
            <button
              onClick={() => setEngine('n8n')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                engine === 'n8n'
                  ? 'bg-gradient-to-r from-[#EA4B71] to-[#FF6B4A] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>⚡ n8n Agent</span>
              <span className="text-[9px] px-1 py-0.2 bg-white/25 rounded-sm">Webhook</span>
            </button>
            <button
              onClick={() => setEngine('gemini')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                engine === 'gemini'
                  ? 'bg-[#4E785F] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Gemini 2.5</span>
            </button>
          </div>

          {/* Event Context Switcher */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-2xl border border-stone-200/90 shadow-2xs">
            <FolderKanban className="w-4 h-4 text-stone-400" />
            <span className="text-xs font-semibold text-stone-700">Context:</span>
            <select
              value={selectedEvtId}
              onChange={e => {
                setSelectedEvtId(e.target.value);
                setSelectedEventId(e.target.value);
              }}
              className="text-xs font-bold text-stone-900 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {events.map(e => (
                <option key={e.id} value={e.id}>
                  {e.title} ({e.progress}%)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Chat Card */}
      <div className="rounded-3xl bg-white border border-stone-200/80 shadow-2xs overflow-hidden flex flex-col h-[600px]">
        {/* Quick Suggestion Chips */}
        <div className="p-3.5 border-b border-stone-100 bg-stone-50/70">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#4E785F]" />
            <span>Suggested prompts for {activeEvt?.title}:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSend(q)}
                className="text-xs px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-stone-700 hover:text-stone-950 font-medium transition-colors cursor-pointer shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#FAF9F5]/40">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#4E785F] text-white rounded-tr-xs shadow-2xs'
                    : 'bg-white text-stone-900 rounded-tl-xs border border-stone-200 shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-line font-normal space-y-1">
                  {msg.content}
                </div>

                {msg.toolCall && (
                  <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Tool Executed: {msg.toolCall.name}</span>
                  </div>
                )}
              </div>

              {msg.role === 'assistant' && msg.content.includes('```') && (
                <button
                  onClick={() => {
                    const match = msg.content.match(/```(?:\w+)?\n([\s\S]*?)```/);
                    const toCopy = match ? match[1] : msg.content;
                    copyToClipboard(toCopy, msg.id);
                  }}
                  className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  {copiedId === msg.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied reminder message</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy formatted announcement</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl max-w-[60%] text-stone-500 text-xs border border-stone-200">
              <Loader2 className="w-4 h-4 animate-spin text-[#4E785F]" />
              <span>Gemini is analyzing event deadlines and tasks...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-stone-200/80 bg-white">
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
              placeholder={`Ask Gemini anything about ${activeEvt?.title || 'your event'} or issue commands...`}
              className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4E785F]/30 bg-stone-50/40"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-2xl bg-[#4E785F] hover:bg-[#3D634C] text-white disabled:opacity-50 transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
