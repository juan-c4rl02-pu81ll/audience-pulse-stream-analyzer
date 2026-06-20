import React, { useState, useRef, useEffect } from 'react';
import { RetentionPoint, RetentionAnnotation } from '../types';
import { TrendingUp, AlertTriangle, HelpCircle, Activity } from 'lucide-react';

interface RetentionChartProps {
  retentionCurve: RetentionPoint[];
  annotations: RetentionAnnotation[];
  onAnnotationClick?: (annotation: RetentionAnnotation) => void;
  selectedAnnotation: RetentionAnnotation | null;
  showAnnotations?: boolean;
  showGrid?: boolean;
}

export default function RetentionChart({
  retentionCurve,
  annotations,
  onAnnotationClick,
  selectedAnnotation,
  showAnnotations = true,
  showGrid = true,
}: RetentionChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; value: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!retentionCurve || retentionCurve.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl flex items-center justify-center text-slate-400">
        No hay datos de retención disponibles.
      </div>
    );
  }

  // Calculate coordinates for SVG
  const width = 800;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 40;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max and min
  const maxSec = retentionCurve[retentionCurve.length - 1].timestampSeconds || 1;
  
  // Transform data points to SVG points
  const points = retentionCurve.map((p) => {
    const x = paddingLeft + (p.timestampSeconds / maxSec) * chartWidth;
    // Retention is 100% to 0%. So 100% is at paddingTop, 0% is at paddingTop + chartHeight
    const y = paddingTop + chartHeight - (p.retentionPercentage / 100) * chartHeight;
    return { x, y, original: p };
  });

  // Create path strings
  let linePath = '';
  let areaPath = '';

  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y} `;
    for (let i = 1; i < points.length; i++) {
      // Use cubic bezier curveto smooth it representing an elite professional platform!
      const prev = points[i - 1];
      const curr = points[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      linePath += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y} `;
    }

    // Fill area under line for elegant gradient look
    areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;
  }

  // Handle click or scrubbing to explore coordinates
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - svgRect.left;
    
    // Scale local click to coordinate space of viewBox
    const scaleX = width / svgRect.width;
    const svgX = clientX * scaleX;

    // Constrain SVG X within the active graph region
    if (svgX >= paddingLeft && svgX <= width - paddingRight) {
      const relativeXPercent = (svgX - paddingLeft) / chartWidth;
      const targetSeconds = relativeXPercent * maxSec;

      // Find closest retention point
      let closestPoint = retentionCurve[0];
      let minDiff = Math.abs(retentionCurve[0].timestampSeconds - targetSeconds);

      for (let i = 1; i < retentionCurve.length; i++) {
        const diff = Math.abs(retentionCurve[i].timestampSeconds - targetSeconds);
        if (diff < minDiff) {
          minDiff = diff;
          closestPoint = retentionCurve[i];
        }
      }

      const closestX = paddingLeft + (closestPoint.timestampSeconds / maxSec) * chartWidth;
      const closestY = paddingTop + chartHeight - (closestPoint.retentionPercentage / 100) * chartHeight;

      // Render tooltip positioning relative to SVG bounding client rect
      const localTooltipY = (closestY / scaleX) - 10;
      const localTooltipX = (closestX / scaleX);

      setHoveredPoint({
        x: closestX,
        y: closestY,
        label: closestPoint.timestampLabel,
        value: closestPoint.retentionPercentage
      });
    } else {
      setHoveredPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div ref={containerRef} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-white font-display font-semibold text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Curva de Retención de Audiencia Avanzada
          </h3>
          <p className="text-xs text-slate-400">
            Pasa el mouse sobre el gráfico para ver métricas por segundo o haz clic en los marcadores.
          </p>
        </div>
        <div className="flex gap-2 text-[11px] font-sans">
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
            Pico (+Interés)
          </span>
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block"></span>
            Mesetas
          </span>
          <span className="flex items-center gap-1 px-2 py-1 bg-rose-500/10 text-rose-400 rounded-md border border-rose-500/20">
            <span className="w-1.5 h-1.5 bg-rose-505 rounded-full inline-block"></span>
            Fuga / Caídas
          </span>
        </div>
      </div>

      {/* SVG Canvas Chart */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Definitions for Gradients, Shadows */}
          <defs>
            <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines (Y Axis) */}
          {[100, 75, 50, 25, 0].map((v) => {
            const y = paddingTop + chartHeight - (v / 100) * chartHeight;
            return (
              <g key={v} className="opacity-20">
                {showGrid && (
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#94a3b8"
                    strokeWidth="0.7"
                    strokeDasharray="4 4"
                  />
                )}
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94a3b8"
                  className="text-[10px] font-mono leading-none"
                >
                  {v}%
                </text>
              </g>
            );
          })}

          {/* Area under curve first */}
          {areaPath && (
            <path
              d={areaPath}
              className="transition-all duration-300 pointer-events-none"
              fill="url(#retentionGrad)"
            />
          )}

          {/* Main retention line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-300 pointer-events-none"
              filter="url(#glow)"
            />
          )}

          {/* Annotation markers (peaks, drops) */}
          {showAnnotations && annotations.map((ann, idx) => {
            const ratio = ann.timestampSeconds / maxSec;
            const x = paddingLeft + ratio * chartWidth;
            
            // Find relative height
            const closestPoint = retentionCurve.find(p => Math.abs(p.timestampSeconds - ann.timestampSeconds) < 200) || retentionCurve[Math.floor(ratio * (retentionCurve.length - 1))];
            const currentPct = closestPoint ? closestPoint.retentionPercentage : 50;
            const y = paddingTop + chartHeight - (currentPct / 100) * chartHeight;

            const isSelected = selectedAnnotation?.id === ann.id;
            
            // Marker styling based on type
            let color = '#3b82f6'; // default blue
            let iconBg = 'bg-blue-600';
            if (ann.type === 'peak') color = '#10b981'; // emerald
            if (ann.type === 'drop') color = '#f43f5e';  // rose
            if (ann.type === 'plateau') color = '#f59e0b'; // amber

            return (
              <g
                key={ann.id}
                className="cursor-pointer group"
                onClick={() => onAnnotationClick?.(ann)}
              >
                {/* Accent glow on selected */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill={color}
                    fillOpacity="0.25"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "8" : "6"}
                  fill={color}
                  stroke="#0a0a0b"
                  strokeWidth="2"
                  className="transition-all duration-200 group-hover:scale-125"
                />
                
                {/* Dynamic mini banner */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                  <rect
                    x={x - 60}
                    y={y - 34}
                    width="120"
                    height="20"
                    rx="4"
                    fill="#1e293b"
                    stroke={color}
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={y - 21}
                    textAnchor="middle"
                    fill="#ffffff"
                    className="text-[9px] font-sans font-semibold"
                  >
                    {ann.timestampLabel} • {ann.title}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Hover interactive coordinate crosshair details */}
          {hoveredPoint && (
            <g className="pointer-events-none">
              <line
                x1={hoveredPoint.x}
                y1={paddingTop}
                x2={hoveredPoint.x}
                y2={paddingTop + chartHeight}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="6"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="2"
              />
              {/* Tooltip background card inside SVG */}
              <rect
                x={hoveredPoint.x > width - 130 ? hoveredPoint.x - 110 : hoveredPoint.x + 10}
                y={hoveredPoint.y - 30}
                width="95"
                height="44"
                rx="6"
                fill="#121214"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <text
                x={hoveredPoint.x > width - 130 ? hoveredPoint.x - 100 : hoveredPoint.x + 20}
                y={hoveredPoint.y - 16}
                fill="#94a3b8"
                className="text-[9px] font-mono"
              >
                Tiempo: {hoveredPoint.label}
              </text>
              <text
                x={hoveredPoint.x > width - 130 ? hoveredPoint.x - 100 : hoveredPoint.x + 20}
                y={hoveredPoint.y - 4}
                fill="#34d399"
                className="text-[11px] font-sans font-bold"
              >
                Retención: {hoveredPoint.value}%
              </text>
            </g>
          )}

          {/* X Axis Labels */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={width - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="#1e293b"
            strokeWidth="1"
          />
          <g fill="#64748b" className="text-[10px] font-mono">
            {retentionCurve.filter((_, idx) => idx % 4 === 0 || idx === retentionCurve.length - 1).map((p) => {
              const x = paddingLeft + (p.timestampSeconds / maxSec) * chartWidth;
              return (
                <text key={p.timestampSeconds} x={x} y={paddingTop + chartHeight + 18} textAnchor="middle">
                  {p.timestampLabel}
                </text>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Selected Annotation Detail Box */}
      {selectedAnnotation ? (
        <div className="mt-5 p-4 rounded-xl bg-slate-900 border border-slate-800 animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className={`p-3 rounded-lg flex items-center justify-center shrink-0 ${
              selectedAnnotation.type === 'peak' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              selectedAnnotation.type === 'drop' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {selectedAnnotation.type === 'peak' ? <TrendingUp className="w-5 h-5" /> : 
               selectedAnnotation.type === 'drop' ? <AlertTriangle className="w-5 h-5" /> :
               <HelpCircle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {selectedAnnotation.timestampLabel}
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold ${
                  selectedAnnotation.type === 'peak' ? 'text-emerald-400' :
                  selectedAnnotation.type === 'drop' ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {selectedAnnotation.type === 'peak' ? 'PICO DE INTERÉS DE LA AUDIENCIA' :
                   selectedAnnotation.type === 'drop' ? 'PUNTO DE DESCONEXIÓN' : 'ZONA ESTABLE'}
                </span>
              </div>
              <h4 className="text-white font-sans font-semibold text-sm mt-1">
                {selectedAnnotation.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedAnnotation.description}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="create-short-from-peak-btn"
            onClick={() => alert(`Se ha agendado la exportación para cortar un short vertical centrado en la marca ${selectedAnnotation.timestampLabel} (${selectedAnnotation.title}).`)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#0a0a0b] text-xs font-sans font-bold rounded-lg shrink-0 transition-colors"
          >
            ✂️ Crear Clip Vertical
          </button>
        </div>
      ) : (
        <div className="mt-4 text-center py-4 rounded-xl bg-slate-900/30 border border-slate-850/60">
          <p className="text-xs text-slate-500">
            💡 Consejo: Haz clic en cualquiera de los círculos brillantes del gráfico para indagar en qué sucedió en ese minuto exacto.
          </p>
        </div>
      )}
    </div>
  );
}
