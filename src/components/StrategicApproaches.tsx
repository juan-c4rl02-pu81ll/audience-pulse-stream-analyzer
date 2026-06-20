import React from 'react';
import { StrategicApproach } from '../types';
import { Lightbulb, Target, ArrowRight, Zap, Play, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface StrategicApproachesProps {
  approaches: StrategicApproach[];
  onApplyPreset?: (text: string) => void;
}

export default function StrategicApproaches({ approaches, onApplyPreset }: StrategicApproachesProps) {
  
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'low': return 'bg-slate-500/10 text-slate-400 border border-slate-800';
    }
  };

  const getContentTypeEmoji = (type: string) => {
    switch (type) {
      case 'shorts': return '📱 Vertical Short';
      case 'followup_video': return '🎥 Video de Seguimiento';
      case 'community_post': return '💬 Post de Comunidad';
      case 'newsletter': return '✉️ Newsletter';
      case 'live_event': return '🔴 Próximo Evento Live';
      default: return '💡 Estrategia';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl animate-fade-in flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-white font-display font-semibold text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Posibles Enfoques Estratégicos Inteligentes
            </h3>
            <p className="text-xs text-slate-400">
              Derivados automáticamente a partir de los picos y caídas de interés de tu audiencia.
            </p>
          </div>
          <span className="p-1.5 bg-slate-950 text-slate-400 rounded-lg border border-slate-800">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
          </span>
        </div>

        {/* List of actions */}
        <div className="space-y-3.5">
          {approaches.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No hay enfoques generados para el video actual.</p>
          ) : (
            approaches.map((ap) => (
              <div 
                key={ap.id}
                className="bg-slate-950/70 p-4 rounded-xl border border-slate-850 hover:border-slate-700 hover:bg-slate-950 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-sans font-semibold text-slate-350 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                      {getContentTypeEmoji(ap.contentType)}
                    </span>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityColor(ap.priority)}`}>
                      Prioridad {ap.priority === 'high' ? 'Crítica' : ap.priority === 'medium' ? 'Media' : 'Opcional'}
                    </span>
                  </div>

                  <h4 className="text-slate-100 font-sans font-semibold text-xs mt-2.5">
                    {ap.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    {ap.description}
                  </p>
                </div>

                {/* Expected engagement impact display */}
                <div className="pt-2 border-t border-slate-900/80 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-mono text-emerald-400 font-medium">Impacto esperado:</span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-sans text-right line-clamp-1">{ap.expectedImpact}</span>
                </div>

                {/* Quick actions callback query tool to AI */}
                {onApplyPreset && (
                  <button
                    type="button"
                    onClick={() => onApplyPreset(`¿Cómo puedo estructurar paso a paso la sugerencia: "${ap.title}"?`)}
                    className="w-full text-center py-1.5 bg-slate-900 hover:bg-slate-850 hover:text-emerald-400 border border-slate-800 text-[10px] text-slate-400 rounded-lg transition-all font-sans cursor-pointer mt-1 flex items-center justify-center gap-1"
                  >
                    💬 Consultar Plan de Ejecución con Co-Piloto AI
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-5 p-3.5 rounded-xl bg-slate-950 border border-slate-850/80 flex items-center gap-3">
        <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></div>
        <p className="text-[11px] text-slate-400 leading-normal">
          <span className="font-semibold text-slate-200">Recomendación General:</span> Los creadores premium con mayor crecimiento cortan al menos 3 shorts verticales de cada video largo de más de 20 minutos donde se detectan picos en el chat.
        </p>
      </div>

    </div>
  );
}
