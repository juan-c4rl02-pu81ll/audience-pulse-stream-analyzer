import React, { useState } from 'react';
import { Search, Radio, Youtube, Sparkles } from 'lucide-react';

interface HeaderProps {
  onAnalyze: (url: string, isLive: boolean) => void;
  isLoading: boolean;
  currentTitle: string;
  currentChannel: string;
  isLive: boolean;
}

export default function Header({
  onAnalyze,
  isLoading,
  currentTitle,
  currentChannel,
  isLive
}: HeaderProps) {
  const [urlInput, setUrlInput] = useState('https://www.youtube.com/watch?v=jNQXAC9IVRw');
  const [forceLive, setForceLive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onAnalyze(urlInput, forceLive);
    }
  };

  return (
    <header className="w-full bg-[#0d0d0e] border-b border-slate-800 sticky top-0 z-40 shadow-xs px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-950/40 text-red-500 rounded-xl border border-red-900/40 flex items-center justify-center">
            <Youtube className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-display font-medium tracking-tight text-white">
                Audience <span className="font-semibold text-red-500">Pulse</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold font-mono tracking-wider px-2 py-0.5 bg-slate-800/80 text-slate-350 rounded border border-slate-700/50">
                Freemium
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Métricas de Retención, Chat y Tendencias en Tiempo Real
            </p>
          </div>
        </div>

        {/* Search Bar / Input */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-4xl w-full flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="youtube-url-input"
              placeholder="Pega una URL p?blica de YouTube..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900/65 rounded-xl border border-slate-800 text-sm font-sans text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-slate-905 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              id="submit-analysis-btn"
              disabled={isLoading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-[#0c0c0d] text-xs font-sans font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isLoading ? 'Analizando...' : 'Analizar demo'}
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800/60 mt-4 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Currently active statistics info metadata banner */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {isLive ? (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-red-950/40 text-red-400 border border-red-900/40 rounded-md text-[11px] font-mono font-bold animate-pulse-slow">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block animate-ping"></span>
                TRANSMISIÓN EN VIVO
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 rounded-md text-[11px] font-mono font-bold">
                VOD / DEMO
              </span>
            )}
          </div>
          <div>
            <h2 className="text-sm font-sans font-semibold text-white line-clamp-1">
              {currentTitle}
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Canal: <span className="font-medium text-emerald-400">{currentChannel}</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
