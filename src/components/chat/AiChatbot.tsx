import React, { useState, useRef, useEffect } from 'react';
import { StudentProfile } from '../../types';
import {
  Bot,
  Send,
  X,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface AiChatbotProps {
  studentProfile: StudentProfile;
  isOpen: boolean;
  onToggle: () => void;
  currentTopic?: string;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({
  studentProfile,
  isOpen,
  onToggle,
  currentTopic,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello **${studentProfile.nickname || studentProfile.name}**! 👋\n\nI am your **PeerSolve AI Study Assistant**. How can I help you excel in your peer learning journey today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        '💡 Explain React Hooks with an example',
        '📝 Give me a 3-question quiz on DBMS',
        '🔒 How does zero-trust privacy protect me?',
        '📅 Help organize my study timetable'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          studentProfile,
          currentTopic
        })
      });

      const data = await res.json();

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I am ready to assist you!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.suggestions || [
          'Give me a 3-question practice quiz',
          'Explain another concept',
          'How can I level up my Skill Passport?'
        ]
      };

      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: 'I had a momentary connection hiccup. Please try asking again!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        role: 'assistant',
        content: `Chat history cleared. How can I assist you with **${currentTopic || 'your learning goals'}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          '💡 Explain React Hooks with an example',
          '📝 Give me a 3-question quiz on DBMS',
          '🔒 How does zero-trust privacy protect me?'
        ]
      }
    ]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 text-white shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group"
        title="Open PeerSolve AI Tutor"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-xs font-extrabold pr-1 tracking-wide hidden sm:inline-block">
          AI Tutor
        </span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl rounded-3xl flex flex-col transition-all duration-300 ${
        isExpanded
          ? 'w-[92vw] sm:w-[680px] h-[82vh]'
          : 'w-[92vw] sm:w-[420px] h-[580px]'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/80 rounded-t-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 p-[2px] shadow-md shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white tracking-tight">PeerSolve AI Assistant</h3>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Zero-Trust Private Session</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
            title={isExpanded ? 'Minimize Window' : 'Expand Window'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
              <span>{msg.role === 'user' ? 'You' : 'PeerSolve AI'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-bl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {msg.content}
              </div>

              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleCopy(msg.id, msg.content)}
                  className="absolute top-2 right-2 p-1 rounded-md bg-slate-900/60 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy Text"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>

            {/* Suggestions Chips */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[92%]">
                {msg.suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug)}
                    disabled={isLoading}
                    className="px-2.5 py-1 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white text-[11px] font-semibold transition-all text-left flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                    <span>{sug}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-indigo-300 p-2 rounded-xl bg-slate-800/40 border border-slate-800 w-fit animate-pulse">
            <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
            <span>AI Tutor is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 rounded-b-3xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about React, Python, DBMS, or peer study..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
          <span>PeerSolve AI Assistant v2.5</span>
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Powered by Gemini AI
          </span>
        </div>
      </div>
    </div>
  );
};
