import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Sparkles,
  Bot,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'n8n';
  text: string;
  timestamp: string;
}

export const N8nChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('campusflow_n8n_chat_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        id: 'init-msg',
        sender: 'n8n',
        text: "👋 Hi! I'm your **CampusFlow n8n AI Agent**. I can help you plan events, organize committee tasks, draft volunteer messages, and track deadlines. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId] = useState<string>(() => {
    let sid = localStorage.getItem('campusflow_n8n_session_id');
    if (!sid) {
      sid = 'session-' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('campusflow_n8n_session_id', sid);
    }
    return sid;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('campusflow_n8n_chat_history', JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const quickPrompts = [
    'How do I organize TechFest 2026?',
    'What tasks should we finish today?',
    'Draft a WhatsApp reminder for volunteers',
    'Which tasks are usually forgotten in a college fest?',
  ];

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.sendN8nMessage(textToSend, sessionId);
      const botMessage: ChatMessage = {
        id: `n8n-${Date.now()}`,
        sender: 'n8n',
        text: res.output || "I processed your request, but didn't receive any output text.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'n8n',
        text: `⚠️ Error contacting n8n agent: ${err.message || 'Please check that the n8n workflow is active.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    const initial: ChatMessage[] = [
      {
        id: 'init-msg',
        sender: 'n8n',
        text: "Conversation reset. Hi! I'm your **CampusFlow n8n AI Agent**. How can I assist you with your campus event today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(initial);
    localStorage.removeItem('campusflow_n8n_chat_history');
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-stone-800 text-xs font-semibold shadow-lg border border-stone-200 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Chat with n8n Agent</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle n8n Agent Chat"
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#EA4B71] to-[#FF6B4A] hover:opacity-95 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group active:scale-95 cursor-pointer ring-4 ring-white/80"
        >
          {isOpen ? (
            <ChevronDown className="w-6 h-6 transition-transform" />
          ) : (
            <>
              <div className="relative">
                {/* Custom n8n workflow nodes icon */}
                <svg
                  className="w-7 h-7 text-white fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
              </div>
            </>
          )}
        </button>
      </div>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#EA4B71] to-[#FF6B4A] flex items-center justify-center text-white shadow-sm font-bold text-sm">
                n8n
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-bold text-sm text-white">
                    n8n CampusFlow Agent
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-stone-300 truncate max-w-[210px]">
                  hasinich.app.n8n.cloud
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-700/60 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-700/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2.5 bg-stone-50 border-b border-stone-200/80 overflow-x-auto">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 pl-1">
                Suggested:
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-stone-200 hover:border-stone-300 text-stone-700 hover:text-stone-950 font-medium transition-colors cursor-pointer shadow-2xs shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF9F5]">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[86%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#4E785F] text-white rounded-tr-xs shadow-2xs'
                      : 'bg-white text-stone-900 rounded-tl-xs border border-stone-200/90 shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal space-y-1">
                    {msg.text}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
                  {msg.sender === 'n8n' && (
                    <button
                      onClick={() => copyText(msg.text, msg.id)}
                      className="text-[10px] text-stone-400 hover:text-stone-700 flex items-center gap-0.5 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl max-w-[70%] text-stone-500 text-xs border border-stone-200 shadow-2xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#EA4B71]" />
                <span>n8n agent is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-stone-200">
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
                placeholder="Ask your n8n AI agent anything..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#EA4B71]/40 bg-stone-50/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#EA4B71] to-[#FF6B4A] hover:opacity-95 text-white disabled:opacity-50 transition-all cursor-pointer shadow-sm shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-stone-400 mt-2 px-1">
              <span>Connected via n8n webhook</span>
              <a
                href="https://hasinich.app.n8n.cloud/webhook/4e208ad8-a989-4e3a-88e6-b74c707abc06/chat"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 hover:text-stone-700"
              >
                <span>Endpoint</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
