import React, { useRef, useEffect } from 'react';
import { ChatMessage, DiscussionTrend } from '../types';
import { MessageSquare, Heart, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatInsightsProps {
  chatMessages: ChatMessage[];
  criticalTrends: DiscussionTrend[];
  isLive: boolean;
  chatFilter?: 'all' | 'positive' | 'question' | 'negative';
}

export default function ChatInsights({
  chatMessages,
  criticalTrends,
  isLive,
  chatFilter = 'all'
}: ChatInsightsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter messages based on interactive user selection
  const visibleMessages = chatFilter !== 'all'
    ? chatMessages.filter(m => m.sentiment === chatFilter)
    : chatMessages;

  // Auto scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages.length]);

  // Calculate sentiment distribution from raw messages
  const totalVis = chatMessages.length || 1;
  const positiveCount = chatMessages.filter(m => m.sentiment === 'positive').length;
  const positivePct = Math.round((positiveCount / totalVis) * 100);

  // Group by sentiment for stats banner
  const sentimentStats = {
    positive: Math.round((chatMessages.filter(m => m.sentiment === 'positive').length / totalVis) * 100),
    question: Math.round((chatMessages.filter(m => m.sentiment === 'question').length / totalVis) * 100),
    negative: Math.round((chatMessages.filter(m => m.sentiment === 'negative').length / totalVis) * 100),
    neutral: Math.round((chatMessages.filter(m => m.sentiment === 'neutral').length / totalVis) * 100),
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col h-full animate-fade-in">
      
      {/* Container Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-white font-display font-semibold text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Análisis de Chat y Sentimiento
          </h3>
          <p className="text-xs text-slate-400">
            {isLive ? 'Flujo del stream en tiempo real' : 'Interacciones indexadas'}
          </p>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
          positivePct >= 65 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {positivePct}% Positivo
        </span>
      </div>

      {/* Sentiment Gauge Micro-bars */}
      <div className="grid grid-cols-4 gap-1.5 mb-4 text-[10px]">
        <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 flex flex-col items-center">
          <span className="text-emerald-400 font-bold">{sentimentStats.positive}%</span>
          <span className="text-slate-500 uppercase font-mono tracking-wider text-[8px]">Positivo</span>
        </div>
        <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 flex flex-col items-center">
          <span className="text-sky-450 font-bold text-sky-400">{sentimentStats.question}%</span>
          <span className="text-slate-500 uppercase font-mono tracking-wider text-[8px]">Dudas</span>
        </div>
        <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 flex flex-col items-center">
          <span className="text-rose-400 font-bold">{sentimentStats.negative}%</span>
          <span className="text-slate-500 uppercase font-mono tracking-wider text-[8px]">Quejas</span>
        </div>
        <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 flex flex-col items-center">
          <span className="text-slate-300 font-bold">{sentimentStats.neutral}%</span>
          <span className="text-slate-500 uppercase font-mono tracking-wider text-[8px]">Neutro</span>
        </div>
      </div>

      {/* Styled Chat Terminal */}
      <div 
        ref={scrollRef}
        className="flex-grow bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 min-h-[300px] overflow-y-auto space-y-3 font-mono text-xs text-slate-300"
      >
        {visibleMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4 text-center text-slate-500">
            <span>No hay mensajes de la comunidad indexados para este video.</span>
          </div>
        ) : (
          visibleMessages.map((msg) => {
            // Sentiment label color
            let sentimentLabel = 'POS';
            let sentimentColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            if (msg.sentiment === 'negative') {
              sentimentLabel = 'QUEJA';
              sentimentColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
            } else if (msg.sentiment === 'question') {
              sentimentLabel = 'DUDA';
              sentimentColor = 'text-sky-400 bg-sky-500/10 border-sky-500/30';
            } else if (msg.sentiment === 'neutral') {
              sentimentLabel = 'NEU';
              sentimentColor = 'text-slate-400 bg-slate-800 border-slate-705';
            }

            return (
              <div 
                key={msg.id} 
                className="group border-b border-slate-900/60 pb-2 hover:bg-slate-900/20 px-1 py-0.5 rounded transition-colors"
              >
                <div className="flex items-center justify-between gap-1 mb-1 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-bold">{msg.timestampLabel}</span>
                    <span className="text-white font-sans font-bold bg-slate-800/80 px-1.5 py-0.2 rounded hover:text-emerald-400 transition-colors">
                      @{msg.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[8px] font-bold px-1.5 rounded border ${sentimentColor}`}>
                      {sentimentLabel}
                    </span>
                    <span className="text-[8px] px-1 bg-slate-900 border border-slate-850 text-slate-400 rounded" title="Nivel de Impacto en Retención">
                      IMP: {msg.impactScore}/10
                    </span>
                  </div>
                </div>
                <p className="font-sans text-[12px] text-slate-200 leading-snug break-words">
                  {msg.message}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Trending Topics & Keywords (extracted from YouTube analytics rules) */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-2">Temas Populares en el Chat</p>
        <div className="space-y-2">
          {criticalTrends.map((t, idx) => (
            <div key={idx} className="bg-slate-950 p-2 rounded-lg border border-slate-800.5 flex items-start justify-between gap-2">
              <div className="flex-grow">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-brand-primary rounded-full inline-block"></span>
                  <span className="text-xs text-white font-sans font-medium line-clamp-1">{t.topic}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">{t.description}</p>
              </div>
              <div className="text-right shrink-0 flex flex-col items-end">
                <span className="text-slate-350 font-bold text-[11px] font-mono">{t.volumePercentage}%</span>
                <span className="text-[8px] text-slate-500 uppercase tracking-wider">Volumen</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
