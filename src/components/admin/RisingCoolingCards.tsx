"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Flame, Snowflake, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { RISING_MODELS, COOLING_MODELS, TrendModel } from '@/lib/demandIntelligenceData';

export default function RisingCoolingCards() {
  const renderSparkline = (points: number[], isUp: boolean) => {
    const width = 110;
    const height = 36;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const pathPoints = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * (width - 10) + 5;
      const y = height - 6 - ((p - min) / range) * (height - 12);
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');

    const strokeColor = isUp ? '#10B981' : '#F43F5E';
    const fillGradientId = isUp ? 'sparkline-up-grad' : 'sparkline-down-grad';

    return (
      <svg width={width} height={height} className="overflow-visible shrink-0">
        <defs>
          <linearGradient id="sparkline-up-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="sparkline-down-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path
          d={pathPoints}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* End dot */}
        {points.length > 0 && (
          <circle
            cx={width - 5}
            cy={height - 6 - ((points[points.length - 1] - min) / range) * (height - 12)}
            r="3"
            fill={strokeColor}
          />
        )}
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      
      {/* Rising Demand Card */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
              <Flame size={18} />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Surging Demand Models
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  High Sourcing Urgency
                </span>
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Biggest request spikes across dealer wish lists this month.
              </p>
            </div>
          </div>
          <ArrowUpRight size={20} className="text-emerald-500 hidden sm:block" />
        </div>

        <div className="space-y-3.5">
          {RISING_MODELS.map((item, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">{item.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                    <TrendingUp size={10} /> +{item.pctChange}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium hidden md:inline">
                    {item.segment}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">
                  {item.driver}
                </p>
              </div>

              <div className="self-end sm:self-center">
                {renderSparkline(item.sparkline, true)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cooling Demand Card */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-rose-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
              <Snowflake size={18} />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Cooling Demand Models
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  Trim Bids
                </span>
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Models slowing in inquiry volume; avoid aggressive auction stock.
              </p>
            </div>
          </div>
          <ArrowDownRight size={20} className="text-rose-500 hidden sm:block" />
        </div>

        <div className="space-y-3.5">
          {COOLING_MODELS.map((item, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-rose-50/40 hover:border-rose-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">{item.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-0.5">
                    <TrendingDown size={10} /> {item.pctChange}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium hidden md:inline">
                    {item.segment}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">
                  {item.driver}
                </p>
              </div>

              <div className="self-end sm:self-center">
                {renderSparkline(item.sparkline, false)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
