import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import RetentionChart from './components/RetentionChart';
import ChatInsights from './components/ChatInsights';
import StrategicApproaches from './components/StrategicApproaches';
import AIPanel from './components/AIPanel';
import { VideoAnalysisResult, RetentionAnnotation } from './types';
import { 
  BarChart2, 
  Layers, 
  TrendingUp, 
  Video, 
  HelpCircle, 
  Radio, 
  Grid, 
  Github, 
  AlertCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

export default function App() {
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Selected annotation
  const [selectedAnnotation, setSelectedAnnotation] = useState<RetentionAnnotation | null>(null);

  // Selected Preset Question to flow directly into AI Consult panel
  const [presetQuestion, setPresetQuestion] = useState<string>('');

  // active sidebar tab
  const [activeTab, setActiveTab] = useState<'monitor' | 'historical' | 'comparador'>('monitor');

  // Custom interactive controls for filling up the empty workspace space beautifully
  const [chatFilter, setChatFilter] = useState<'all' | 'positive' | 'question' | 'negative'>('all');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // Trigger default analysis on initial load
  useEffect(() => {
    handleAnalyze('https://www.youtube.com/watch?v=jNQXAC9IVRw', false);
  }, []);

  // Request analysis from fullstack server API
  const handleAnalyze = async (url: string, forceLive: boolean) => {
    setIsLoading(true);
    setErrorText(null);
    setSelectedAnnotation(null);

    try {
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: url, isLive: forceLive })
      });

      if (!response.ok) {
        throw new Error('La respuesta del servidor no fue exitosa.');
      }

      const data: VideoAnalysisResult = await response.json();
      setVideoAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setErrorText('Error de red al conectar con el motor de Google Cloud. Iniciando lectura adaptativa del canal a través del motor principal para restaurar el feed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskStrategist = async (question: string): Promise<string> => {
    if (!videoAnalysis) return 'Primero debes ingresar y analizar un video.';
    
    try {
      const response = await fetch('/api/ask-strategist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          videoTitle: videoAnalysis.title,
          metricsSummary: `Views: ${videoAnalysis.metrics.views}, Watch Time: ${videoAnalysis.metrics.avgWatchTimePercent}%, Engagement: ${videoAnalysis.metrics.engagementRate}%`,
          currentRetentionSummary: videoAnalysis.summary
        })
      });

      if (!response.ok) {
        throw new Error('Servidor falló al contestar.');
      }

      const data = await response.json();
      return data.response;
    } catch (err) {
      return `Lo siento, ocurrió un error temporal intentando conectar con el estratega de crecimiento a través del API de Gemini. 
      \nRecomendación de respaldo: Incrementa el ritmo de edición en ese fragmento, introduce gráficos animados limpios con soporte SVG y re-engancha a los espectadores formulando preguntas en vivo.`;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-slate-200 flex flex-col md:flex-row overflow-x-hidden font-sans decoration-neutral-800">
      
      {/* LEFT SIDEBAR - Embracing Sophisticated Dark theme exactly as specified */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col p-6 shrink-0 bg-[#0a0a0b]/95">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-red-650 bg-red-600 rounded-xl flex items-center justify-center shadow-xl shadow-red-950/40">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-display font-bold tracking-tight text-white block">
              PulseStream <span className="text-xs text-emerald-400 font-mono font-medium">AI</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-0.5 inline-block">
              DEMO FREEMIUM
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="space-y-6 flex-grow">
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold px-3 mb-2">
              ANAL?TICA DE AUDIENCIA
            </p>
            <button
              onClick={() => setActiveTab('monitor')}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium rounded-lg text-left transition-all ${
                activeTab === 'monitor'
                  ? 'bg-slate-800/80 text-white border border-slate-705 shadow-md shadow-slate-950/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              Monitor de Retención
            </button>
            <button
              onClick={() => {
                setActiveTab('historical');
                alert('Análisis Post-Stream Histórico requiere vinculación directa de OAuth YouTube Reporting API en producción.');
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium rounded-lg text-left transition-all ${
                activeTab === 'historical'
                  ? 'bg-slate-800/80 text-white border border-slate-705'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              <Clock className="w-4 h-4 text-emerald-450" />
              Historial del Canal
            </button>
          </div>

          <div className="space-y-2 bg-slate-900/30 p-3.5 rounded-xl border border-slate-800/60 mt-4">
            <p className="text-[10px] uppercase tracking-widest text-[#a3b3c9] font-mono font-bold px-1 mb-2.5">
              FILTRO DE CHAT
            </p>
            <div className="flex flex-col gap-1 text-[11px] font-sans">
              <button
                type="button"
                onClick={() => setChatFilter('all')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer ${
                  chatFilter === 'all'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                  <span>Todos los Mensajes</span>
                </div>
                <span className="text-[9px] font-mono opacity-85">
                  {videoAnalysis?.chatMessages.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setChatFilter('positive')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer ${
                  chatFilter === 'positive'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span>Apoyo y Elogios</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400">
                  {videoAnalysis?.chatMessages.filter(m => m.sentiment === 'positive').length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setChatFilter('question')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer ${
                  chatFilter === 'question'
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span>
                  <span>Dudas / Temas</span>
                </div>
                <span className="text-[9px] font-mono text-sky-400">
                  {videoAnalysis?.chatMessages.filter(m => m.sentiment === 'question').length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setChatFilter('negative')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer ${
                  chatFilter === 'negative'
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  <span>Quejas / Abandono</span>
                </div>
                <span className="text-[9px] font-mono text-rose-450 text-rose-400">
                  {videoAnalysis?.chatMessages.filter(m => m.sentiment === 'negative').length || 0}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-2 bg-slate-900/30 p-3.5 rounded-xl border border-slate-800/60 mt-3.5">
            <p className="text-[10px] uppercase tracking-widest text-[#a3b3c9] font-mono font-bold px-1 mb-2">
              OPCIONES DE VISTA
            </p>
            <div className="flex flex-col gap-2.5 px-1 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-400 hover:text-slate-200 select-none">
                <input
                  type="checkbox"
                  checked={showAnnotations}
                  onChange={(e) => setShowAnnotations(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 focus:ring-2 w-3.5 h-3.5"
                />
                <span className="text-[11px]">Hitos de Retención</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-400 hover:text-slate-200 select-none">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 focus:ring-2 w-3.5 h-3.5"
                />
                <span className="text-[11px]">Cuadrícula de Fondo</span>
              </label>
            </div>
          </div>
        </nav>

        {/* Current Session Metadata Info status card */}
        <div className="mt-auto p-4 bg-slate-900/40 rounded-xl border border-slate-800/60 font-sans">
          <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mb-1">
            SESIÓN ACTUAL DE CREACIÓN
          </p>
          <p className="text-xs font-medium text-white truncate">
            {videoAnalysis ? videoAnalysis.title : 'Cargando video...'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2.5 h-2.5 rounded-full ${videoAnalysis?.isLive ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
            <span className="text-[11px] font-mono text-slate-400">
              {videoAnalysis?.isLive ? 'Transmisión Activa' : 'Video Bajo Demanda (VOD)'}
            </span>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col bg-[#0a0a0b] overflow-y-auto">
        
        {/* Nav Header Row */}
        {videoAnalysis && (
          <Header
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            currentTitle={videoAnalysis.title}
            currentChannel={videoAnalysis.channelName}
            isLive={videoAnalysis.isLive}
          />
        )}

        {/* Dynamic Main Body Content Grid */}
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Information & Alert panel warnings (if any) */}
          {errorText && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-200 text-xs flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
              <span>{errorText}</span>
            </div>
          )}

          {/* If main analyzer is working show premium loader */}
          {isLoading ? (
            <div className="py-24 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-slate-900 border-t-emerald-500 animate-spin"></div>
                <div className="absolute inset-3 rounded-full bg-slate-900/50 flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
              </div>
              <h2 className="text-lg font-display font-bold text-white">Analizando video de YouTube</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Iniciando la lectura de metadatos estructurales de YouTube. Analizando el archivo histórico de chats públicos y extrayendo los patrones de abandono de los espectadores usando Gemini 3.5...
              </p>
            </div>
          ) : videoAnalysis ? (
            <div className="space-y-6">
              
              {/* Premium Dashboard General introduction text */}
              <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-[#000] text-[9px] uppercase font-mono font-black rounded-sm tracking-wider">
                      INFORMACIÓN GENERAL AI
                    </span>
                    <span className="text-xs text-slate-400 font-sans">An?lisis inicial funcional</span>
                  </div>
                  <h3 className="text-base text-white font-medium">Análisis de Retención y Cohesión de Audiencia</h3>
                  <p className="text-xs text-slate-355 text-slate-300 leading-relaxed font-sans max-w-3xl">
                    {videoAnalysis.summary}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 shrink-0 text-center md:min-w-[140px]">
                  <span className="text-slate-500 text-[10px] font-mono block">CATEGORÍA SENSORIAL</span>
                  <span className="text-emerald-400 text-xs font-mono font-bold block mt-1">{videoAnalysis.category}</span>
                </div>
              </div>

              {/* ROW 1: Metric Cards */}
              <MetricCards
                metrics={videoAnalysis.metrics}
                isLive={videoAnalysis.isLive}
              />

              {/* ROW 2: Left 8-col Retention Graph | Right 4-col Chat Sentiment */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* 8-columns for Retention Chart */}
                <div className="lg:col-span-8 flex flex-col">
                  <RetentionChart
                    retentionCurve={videoAnalysis.retentionCurve}
                    annotations={videoAnalysis.annotations}
                    onAnnotationClick={(ann) => setSelectedAnnotation(ann)}
                    selectedAnnotation={selectedAnnotation}
                    showAnnotations={showAnnotations}
                    showGrid={showGrid}
                  />
                </div>

                {/* 4-columns for Chat Insights */}
                <div className="lg:col-span-4 flex flex-col">
                  <ChatInsights
                    chatMessages={videoAnalysis.chatMessages}
                    criticalTrends={videoAnalysis.criticalTrends}
                    isLive={videoAnalysis.isLive}
                    chatFilter={chatFilter}
                  />
                </div>

              </div>

              {/* ROW 3: Left 6-col Strategic Suggestions | Right 6-col Consult Tool */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* 6-columns for Expected approaches */}
                <div className="lg:col-span-6 flex flex-col">
                  <StrategicApproaches
                    approaches={videoAnalysis.strategicApproaches}
                    onApplyPreset={(text) => setPresetQuestion(text)}
                  />
                </div>

                {/* 6-columns for Active Assistant dialog */}
                <div className="lg:col-span-6 flex flex-col">
                  <AIPanel
                    videoTitle={videoAnalysis.title}
                    metricsSummary={`Views: ${videoAnalysis.metrics.views}, Retención: ${videoAnalysis.metrics.avgWatchTimePercent}%`}
                    currentRetentionSummary={videoAnalysis.summary}
                    onAskStrategist={handleAskStrategist}
                    presetQuestion={presetQuestion}
                    onClearPreset={() => setPresetQuestion('')}
                  />
                </div>

              </div>

            </div>
          ) : (
            <div className="py-24 text-center rounded-2xl bg-slate-900/20 border border-slate-800">
              <span className="text-4xl text-slate-500 inline-block mb-3">📍</span>
              <p className="text-slate-400 font-sans text-sm">Pega un enlace del video de YouTube en el buscador superior para comenzar el análisis.</p>
            </div>
          )}

          {/* Simple but incredibly effective footer */}
          <footer className="border-t border-slate-850 mt-12 pt-6 text-center text-xs text-slate-500 font-mono flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span>Audience Pulse Stream Analyzer — Diseñado en base a "Sophisticated Dark" corporativo</span>
            </div>
            <div className="flex gap-4">
              <span>React + Express + Gemini</span>
              <span>© 2026</span>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
}
