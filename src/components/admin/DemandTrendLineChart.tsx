"use client";

import React, { useState } from 'react';
import { TREND_TOP_5, WEEKS_LABELS } from '@/lib/demandIntelligenceData';
import { TrendingUp, Activity, HelpCircle } from 'lucide-react';

export default function DemandTrendLineChart() {
  const [hoveredWeekIdx, setHoveredWeekIdx] = useState<number | null>(11); // default to W12
  const [activeModelId, setActiveModelId] = useState<string | null>(null);

  // Chart dimensions & scaling
  const chartWidth = 720;
  const chartHeight = 260;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const minY = 50;
  const maxY = 200;

  const getX = (index: number) => {
    return paddingLeft + (index / (WEEKS_LABELS.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return paddingTop + innerHeight - ((clamped - minY) / (maxY - minY)) * innerHeight;
  };

  // Generate SVG path for a model
  const getLinePath = (values: number[]) => {
    return values.map((val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Velocity Telemetry
            </span>
            <span className="text-xs text-slate-400 font-medium">12-Week Rolling Trend</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Top 5 Models Demand Trajectory
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Weekly request count trend over the past quarter (hover to view precise weekly values).
          </p>
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {TREND_TOP_5.map((model) => {
            const isFaded = activeModelId && activeModelId !== model.id;
            return (
              <button
                key={model.id}
                onClick={() => setActiveModelId(activeModelId === model.id ? null : model.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                  activeModelId === model.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : isFaded
                    ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-50'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: model.color }}
                />
                <span className="text-[11px]">{model.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Multi-Line Chart Canvas */}
      <div className="relative pt-6">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[620px]">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-auto overflow-visible select-none"
            >
              {/* Horizontal Grid lines & Y Axis labels */}
              {[50, 100, 150, 200].map((tickVal) => {
                const yPos = getY(tickVal);
                return (
                  <g key={tickVal}>
                    <line
                      x1={paddingLeft}
                      y1={yPos}
                      x2={chartWidth - paddingRight}
                      y2={yPos}
                      stroke="#F1F5F9"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={yPos + 4}
                      textAnchor="end"
                      className="text-[10px] font-bold fill-slate-400"
                    >
                      {tickVal}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Week Labels */}
              {WEEKS_LABELS.map((week, idx) => {
                const xPos = getX(idx);
                const isHovered = hoveredWeekIdx === idx;
                return (
                  <g key={week}>
                    <text
                      x={xPos}
                      y={chartHeight - 10}
                      textAnchor="middle"
                      className={`text-[11px] font-bold transition-colors ${
                        isHovered ? 'fill-slate-900 font-black' : 'fill-slate-400'
                      }`}
                    >
                      {week}
                    </text>
                  </g>
                );
              })}

              {/* Lines for each model */}
              {TREND_TOP_5.map((model) => {
                const isHighlighted = activeModelId === model.id;
                const isFaded = activeModelId && !isHighlighted;
                const pathData = getLinePath(model.values);

                return (
                  <g key={model.id} className="transition-opacity duration-200" opacity={isFaded ? 0.2 : 1}>
                    <path
                      d={pathData}
                      fill="none"
                      stroke={model.color}
                      strokeWidth={isHighlighted ? 3.5 : 2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all"
                    />

                    {/* Data dots */}
                    {model.values.map((val, idx) => {
                      const cx = getX(idx);
                      const cy = getY(val);
                      const isHoveredDot = hoveredWeekIdx === idx;

                      return (
                        <circle
                          key={idx}
                          cx={cx}
                          cy={cy}
                          r={isHoveredDot ? 5 : 2.5}
                          fill={isHoveredDot ? '#ffffff' : model.color}
                          stroke={model.color}
                          strokeWidth={isHoveredDot ? 2.5 : 1.5}
                          className="transition-all duration-150"
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Vertical Guide Line on Hover */}
              {hoveredWeekIdx !== null && (
                <line
                  x1={getX(hoveredWeekIdx)}
                  y1={paddingTop}
                  x2={getX(hoveredWeekIdx)}
                  y2={chartHeight - paddingBottom}
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {/* Interactive overlay columns for hover detection */}
              {WEEKS_LABELS.map((_, idx) => {
                const colWidth = innerWidth / (WEEKS_LABELS.length - 1);
                const colX = getX(idx) - colWidth / 2;

                return (
                  <rect
                    key={idx}
                    x={Math.max(0, colX)}
                    y={paddingTop}
                    width={colWidth}
                    height={innerHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredWeekIdx(idx)}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Hover telemetry card display */}
        {hoveredWeekIdx !== null && (
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                {WEEKS_LABELS[hoveredWeekIdx]}
              </span>
              <span className="text-slate-500 font-medium">Exact demand snapshot:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3.5">
              {TREND_TOP_5.map((model) => (
                <div key={model.id} className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }}></span>
                  <span className="text-slate-600 font-semibold">{model.name.replace('Toyota ', '').replace('Honda ', '').replace('Mazda ', '')}:</span>
                  <strong className="text-slate-900">{model.values[hoveredWeekIdx]}</strong>
                </div>
              ))}
              <div className="pl-2 border-l border-slate-300">
                <span className="text-slate-500 font-medium">Week Total: </span>
                <strong className="text-blue-900 font-black">
                  {TREND_TOP_5.reduce((sum, m) => sum + m.values[hoveredWeekIdx], 0)} units
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
