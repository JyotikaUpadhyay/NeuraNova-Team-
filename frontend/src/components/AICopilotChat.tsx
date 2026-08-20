import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  ChevronDown,
  ChevronRight,
  Wrench,
  Zap,
  Flame,
  FileText
} from 'lucide-react';
import { ChatMessage } from '../types/index.js';
import { api } from '../services/api.js';

interface AICopilotChatProps {
  onScenarioTriggered?: (scenarioId: string) => void;
}

export const AICopilotChat: React.FC<AICopilotChatProps> = ({ onScenarioTriggered }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadChatHistory = async () => {
    try {
      const history = await api.getChatHistory();
      setMessages(history);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.sendMessage(messageText);
      setMessages((prev) => [...prev, response.message]);

      if (response.actionTaken?.type === 'TRIGGER_SCENARIO' && response.actionTaken.payload?.scenarioId) {
        onScenarioTriggered?.(response.actionTaken.payload.scenarioId);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Failed to query AI Copilot: ${err.message || 'Network error'}. Please try again.`,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await api.clearChat();
      setMessages([
        {
          id: `init-${Date.now()}`,
          role: 'assistant',
          content: 'Conversation history reset. How can I assist with your supply chain resilience operations?',
          timestamp: new Date().toISOString(),
          suggestedActions: [
            'Trigger Strait of Hormuz Blockade',
            'Simulate Red Sea Missile Escalation',
            'Show Strategic Petroleum Reserve (SPR) status',
            'Find alternative crude suppliers'
          ]
        }
      ]);
    } catch (err) {
      console.error('Failed to clear chat:', err);
    }
  };

  const toggleThought = (id: string) => {
    setExpandedThoughts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Simple Markdown renderer for headings, tables, bold text, and lists
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    let inTable = false;
    let tableRows: string[][] = [];

    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Table line
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        const cols = trimmed
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        
        // Skip separator line like |---|---|
        if (!cols.every((c) => c.match(/^:?-+:?$/))) {
          tableRows.push(cols);
        }
        return;
      } else if (inTable) {
        // Render accumulated table
        inTable = false;
        elements.push(
          <div key={`tbl-${index}`} className="my-3 overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/80">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-slate-800/90 text-slate-300 uppercase font-mono text-[10px]">
                <tr>
                  {tableRows[0]?.map((th, i) => (
                    <th key={i} className="px-3 py-2 border-b border-slate-700 font-bold">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
                {tableRows.slice(1).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/40">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-1.5">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }

      // Headers
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h4 key={index} className="text-sm font-bold text-white mt-3 mb-1.5 flex items-center gap-1.5">
            {trimmed.replace('### ', '')}
          </h4>
        );
      } else if (trimmed.startsWith('#### ')) {
        elements.push(
          <h5 key={index} className="text-xs font-bold text-cyan-300 mt-2 mb-1">
            {trimmed.replace('#### ', '')}
          </h5>
        );
      } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        elements.push(
          <div key={index} className="flex items-start gap-2 text-xs text-slate-300 ml-2 my-1">
            <span className="text-blue-400 mt-0.5">•</span>
            <span dangerouslySetInnerHTML={{ __html: formatBold(trimmed.substring(2)) }} />
          </div>
        );
      } else if (trimmed.match(/^\d+\.\s/)) {
        elements.push(
          <div key={index} className="flex items-start gap-2 text-xs text-slate-300 ml-2 my-1">
            <span className="text-cyan-400 font-bold font-mono">{trimmed.match(/^\d+\./)?.[0]}</span>
            <span dangerouslySetInnerHTML={{ __html: formatBold(trimmed.replace(/^\d+\.\s/, '')) }} />
          </div>
        );
      } else if (trimmed === '---') {
        elements.push(<hr key={index} className="border-slate-800 my-2" />);
      } else if (trimmed) {
        elements.push(
          <p key={index} className="text-xs text-slate-200 leading-relaxed my-1" dangerouslySetInnerHTML={{ __html: formatBold(trimmed) }} />
        );
      }
    });

    if (inTable && tableRows.length > 0) {
      elements.push(
        <div key="tbl-end" className="my-3 overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/80">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-800 text-slate-300 uppercase font-mono text-[10px]">
              <tr>
                {tableRows[0]?.map((th, i) => (
                  <th key={i} className="px-3 py-2 border-b border-slate-700 font-bold">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
              {tableRows.slice(1).map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/40">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-1.5">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return elements;
  };

  const formatBold = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
  };

  return (
    <div className="flex flex-col h-[680px] bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      {/* Copilot Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0b1120] border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">NeuraNova AI Copilot</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
                Conversational Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Powered by Multi-Agent Tool Orchestration</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition text-xs flex items-center gap-1"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isThoughtOpen = !!expandedThoughts[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}

              <div className={`max-w-2xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                
                {/* Agent Thought Accordion (if present) */}
                {!isUser && msg.thoughtProcess && msg.thoughtProcess.length > 0 && (
                  <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden text-xs">
                    <button
                      onClick={() => toggleThought(msg.id)}
                      className="w-full px-3 py-1.5 text-left text-slate-400 hover:text-slate-200 flex items-center justify-between font-mono text-[11px] transition"
                    >
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <Wrench className="w-3 h-3" />
                        Chain of Thought ({msg.thoughtProcess.length} steps)
                      </span>
                      {isThoughtOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    {isThoughtOpen && (
                      <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800 space-y-1 font-mono text-[10px] text-slate-400">
                        {msg.thoughtProcess.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-cyan-500">↳</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tool Invocations Badge */}
                {!isUser && msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {msg.toolCalls.map((tool, idx) => (
                      <div
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-blue-950/80 border border-blue-800/60 text-[10px] text-blue-300 font-mono flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span>{tool.toolName}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg'
                  }`}
                >
                  {isUser ? (
                    <p className="text-xs leading-relaxed font-medium">{msg.content}</p>
                  ) : (
                    <div>{renderMarkdown(msg.content)}</div>
                  )}

                  <div className="mt-2 text-[10px] text-right opacity-60 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Suggested Action Chips */}
                {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(action)}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition flex items-center gap-1 shadow-sm"
                      >
                        <Flame className="w-3 h-3 text-amber-400" />
                        <span>{action}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2 font-mono">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>Querying energy agents & calculating resilience paths...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-[#0b1120] border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-2xl px-3 py-2 focus-within:border-blue-500 transition shadow-inner"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Copilot (e.g., 'What happens if Hormuz is closed?', 'Calculate SPR buffer', 'Rank alternate suppliers')..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none px-2"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition shadow-md shadow-blue-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
