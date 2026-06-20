import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Brain, Bot, Lock, Send, Sparkles } from 'lucide-react';

interface AIPanelProps {
  videoTitle: string;
  metricsSummary: string;
  currentRetentionSummary: string;
  onAskStrategist: (question: string) => Promise<string>;
  presetQuestion?: string;
  onClearPreset?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

const FREEMIUM_SUGGESTIONS = [
  { text: '?Cu?l es el primer punto de ca?da que deber?a revisar?' },
  { text: 'Resume una acci?n r?pida para mejorar la retenci?n.' },
  { text: '?Qu? pieza corta conviene extraer del pico principal?' }
];

export default function AIPanel({
  videoTitle,
  metricsSummary,
  currentRetentionSummary,
  onAskStrategist,
  presetQuestion,
  onClearPreset
}: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Modo freemium activo. Ya tengo una lectura inicial de "${videoTitle}".\n\nPuedes hacer una consulta ejecutiva breve. Los planes paso a paso, guiones completos, priorizaci?n por impacto y comparativas avanzadas quedan reservados para la versi?n premium.`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!presetQuestion) return;
    setInputValue(presetQuestion);
    handleSend(presetQuestion);
    onClearPreset?.();
  }, [presetQuestion]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const handleSend = async (textToSend?: string) => {
    const questionText = textToSend || inputValue;
    if (!questionText.trim() || isSending) return;

    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: questionText }]);

    if (!textToSend) {
      setInputValue('');
    }

    setIsSending(true);

    try {
      const answer = await onAskStrategist(questionText);
      setMessages((prev) => [...prev, { id: `bot-${Date.now()}`, sender: 'bot', text: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'No pude procesar la consulta en este momento. La demo freemium conserva el an?lisis inicial; el asesor premium completo se mantiene privado.'
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col h-[520px] justify-between animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-850">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-display font-semibold text-sm">Consultor AI Freemium</h3>
            <p className="text-[11px] text-slate-400">Consulta ejecutiva limitada sobre el rendimiento</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 text-[10px] text-amber-300 font-mono">
          <Lock className="w-3 h-3" />
          PREMIUM CAPADO
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <span className="text-slate-500 uppercase tracking-widest font-mono">Contexto</span>
          <p className="mt-1 text-slate-300 line-clamp-2">{metricsSummary}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <span className="text-slate-500 uppercase tracking-widest font-mono">L?mite</span>
          <p className="mt-1 text-slate-300 line-clamp-2">Respuestas breves. Playbooks y guiones completos son premium.</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow my-4 overflow-y-auto space-y-3.5 pr-1 text-xs">
        {messages.map((message) => {
          const isBot = message.sender === 'bot';
          return (
            <div key={message.id} className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}>
              {isBot ? (
                <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
                  <Brain className="w-3.5 h-3.5" />
                </div>
              ) : null}
              <div className={`max-w-[85%] rounded-xl p-3 leading-relaxed whitespace-pre-line font-sans border ${
                isBot
                  ? 'bg-slate-950 border-slate-850 text-slate-200'
                  : 'bg-emerald-500/10 text-emerald-100 border-emerald-500/30'
              }`}>
                {message.text}
              </div>
            </div>
          );
        })}

        {isSending ? (
          <div className="flex items-center gap-2.5 justify-start">
            <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            </div>
            <div className="bg-slate-950 border border-slate-850 text-slate-400 rounded-xl p-3 animate-pulse">
              Generando una respuesta ejecutiva freemium...
            </div>
          </div>
        ) : null}
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {FREEMIUM_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.text}
              type="button"
              onClick={() => handleSend(suggestion.text)}
              disabled={isSending}
              className="px-2.5 py-1 bg-slate-950 text-slate-400 hover:text-white border border-slate-850 hover:border-slate-700 rounded-full text-[10px] font-sans transition-all text-left cursor-pointer disabled:opacity-50 flex items-center gap-1"
            >
              <ArrowRight className="w-2.5 h-2.5 shrink-0 text-emerald-400" />
              {suggestion.text}
            </button>
          ))}
        </div>

        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            type="text"
            id="ai-consultant-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Pregunta algo breve al asesor freemium..."
            disabled={isSending}
            className="flex-grow bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-200 rounded-xl px-3 py-2.5 text-xs font-sans focus:outline-hidden focus:border-emerald-500 placeholder:text-slate-500 disabled:bg-slate-900"
          />
          <button
            type="submit"
            id="send-ai-consult-btn"
            disabled={!inputValue.trim() || isSending}
            className="p-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-[#0a0a0b] disabled:text-slate-600 rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="mt-2 text-[10px] text-slate-500 leading-relaxed">
          Extracto del resumen: {currentRetentionSummary.slice(0, 120)}{currentRetentionSummary.length > 120 ? '...' : ''}
        </p>
      </div>
    </div>
  );
}
