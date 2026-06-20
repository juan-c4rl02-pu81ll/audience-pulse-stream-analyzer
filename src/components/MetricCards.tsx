import React from 'react';
import { Eye, Clock, Users, Flame, Percent, ThumbsUp, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { VideoMetrics } from '../types';

interface MetricCardsProps {
  metrics: VideoMetrics;
  isLive: boolean;
  currentViewerCap?: number; // animated live viewer fluctuations
}

export default function MetricCards({ metrics, isLive, currentViewerCap }: MetricCardsProps) {
  // Format long numbers
  const numberFormatter = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Convert seconds to readable min:sec
  const secondsToLabel = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Live or static values
  const activeViewersVal = currentViewerCap || metrics.peakConcurrentViewers || 0;
  const originalPeakViewers = metrics.peakConcurrentViewers || 24500;

  // Let's draw an elegant SVG sparkline based on local math to display inline within metric cards
  const drawSparkline = (points: number[]) => {
    const maxVal = Math.max(...points, 1);
    const minVal = Math.min(...points, 0);
    const range = maxVal - minVal;
    const width = 100;
    const height = 30;
    const svgCoords = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((p - minVal) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-16 h-8 text-emerald-500 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={svgCoords}
        />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* CARD 1: Views / Concurrent Views */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-[#0d0d0e]/95 p-5 rounded-2xl border border-slate-800/85 hover:border-slate-700/80 transition-all shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans text-slate-400 font-medium uppercase tracking-wider">
            {isLive ? 'Espectadores En Vivo' : 'Visualizaciones Totales'}
          </span>
          <div className={`p-2.5 rounded-xl ${isLive ? 'bg-red-950/40 text-red-400 border border-red-900/30' : 'bg-slate-900/60 text-slate-300 border border-slate-800/50'}`}>
            <Eye className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white animate-fade-in">
            {isLive ? numberFormatter(activeViewersVal) : numberFormatter(metrics.views)}
          </span>
          {isLive && (
            <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider bg-red-950/30 px-1.5 py-0.5 rounded border border-red-900/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block animate-ping"></span>
              LIVE
            </span>
          )}
        </div>
        <div className="mt-4 border-t border-slate-850/50 pt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{isLive ? `Pico: ${numberFormatter(originalPeakViewers)}` : `Meta de audiencia: 1M`}</span>
          {isLive ? (
            <span className="text-emerald-400 font-medium font-mono">Fluctuando</span>
          ) : (
            <span className="text-emerald-400 font-medium font-mono">+12% este mes</span>
          )}
        </div>
      </motion.div>

      {/* CARD 2: Retention Watch Time */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-[#0d0d0e]/95 p-5 rounded-2xl border border-slate-800/85 hover:border-slate-700/80 transition-all shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans text-slate-400 font-medium uppercase tracking-wider">
            Retención Promedio
          </span>
          <div className="p-2.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white">
              {metrics.avgWatchTimePercent}%
            </span>
            <p className="text-[11px] font-mono text-slate-400">
              ~{secondsToLabel(metrics.avgWatchTimeSeconds)} min de video
            </p>
          </div>
          {/* Mini elegant SVG circular track bar representing percentage watch-time ratio */}
          <div className="relative w-11 h-11">
            <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
              <path
                className="text-slate-800/60"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray={`${metrics.avgWatchTimePercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-300">
              {metrics.avgWatchTimePercent}%
            </div>
          </div>
        </div>
        <div className="mt-4 border-t border-slate-850/50 pt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Excelente salud (Top 10%)</span>
          {drawSparkline([80, 85, 87, 86, 92, 94])}
        </div>
      </motion.div>

      {/* CARD 3: Engagement Rating */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-[#0d0d0e]/95 p-5 rounded-2xl border border-slate-800/85 hover:border-slate-700/80 transition-all shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans text-slate-400 font-medium uppercase tracking-wider">
            Tasa de Engagement
          </span>
          <div className="p-2.5 bg-amber-950/40 text-amber-400 border border-amber-900/30 rounded-xl">
            <Flame className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white">
            {metrics.engagementRate}%
          </span>
          <span className="text-xs font-medium text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/40">
            Excelente
          </span>
        </div>
        <div className="mt-4 border-t border-slate-850/50 pt-2 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3 text-emerald-400" />
            {metrics.likesRatio}% likes ración
          </span>
          {drawSparkline([5, 6, 5.8, 6.2, 7.1, 7.8, 8.4])}
        </div>
      </motion.div>

      {/* CARD 4: Subs gained or Chat Rate */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-[#0d0d0e]/95 p-5 rounded-2xl border border-slate-800/85 hover:border-slate-700/80 transition-all shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans text-slate-400 font-medium uppercase tracking-wider">
            {isLive ? 'Chat por Minuto' : 'Nuevos Suscriptores'}
          </span>
          <div className="p-2.5 bg-indigo-950/40 text-indigo-450 border border-indigo-900/30 rounded-xl">
            {isLive ? <MessageSquare className="w-5 h-5" /> : <Users className="w-5 h-5" />}
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white">
            {isLive 
              ? `${metrics.chatRatePerMinute || 145} c/m`
              : `+${numberFormatter(metrics.subscriberGain)}`}
          </span>
          <span className="text-[11px] font-sans text-emerald-400 font-medium">
            KPI Objetivo
          </span>
        </div>
        <div className="mt-4 border-t border-slate-850/50 pt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{isLive ? 'Frecuencia explosiva' : 'Conversión óptima'}</span>
          {drawSparkline([100, 120, 115, 130, 145, 142])}
        </div>
      </motion.div>

    </div>
  );
}
