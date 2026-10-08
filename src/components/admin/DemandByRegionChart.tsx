"use client";

import React, { useState } from 'react';
import { DEMAND_BY_REGION, RegionDemand } from '@/lib/demandIntelligenceData';
import { MapPin, Users, PieChart, Sparkles } from 'lucide-react';

interface DemandByRegionChartProps {
  selectedRegion?: string;
  onSelectRegion?: (region: string) => void;
}

export default function DemandByRegionChart({ 
  selectedRegion = 'All', 
  onSelectRegion 
}: DemandByRegionChartProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const maxUnits = Math.max(...DEMAND_BY_REGION.map(r => r.units));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 sm:p-7">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              Regional Geography
            </span>
            <span className="text-xs text-slate-400 font-medium">New Zealand Metro & Regional Breakdown</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Vehicle Demand by NZ Region
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Concentration of unmet vehicle demand across major New Zealand dealership clusters (hover to see segment breakdown).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-center">
          <MapPin size={13} className="text-purple-600" />
          <span>5 Key Territories</span>
        </div>
      </div>

      {/* Regional Bars */}
      <div className="pt-6 space-y-4">
        {DEMAND_BY_REGION.map((item) => {
          const isSelected = selectedRegion === item.region;
          const isHovered = hoveredRegion === item.region;
          const widthPct = Math.round((item.units / maxUnits) * 100);

          return (
            <div
              key={item.region}
              onMouseEnter={() => setHoveredRegion(item.region)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => onSelectRegion && onSelectRegion(isSelected ? 'All' : item.region)}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/50 border-purple-300 shadow-xs ring-2 ring-purple-500/20'
                  : isHovered
                  ? 'bg-slate-50 border-slate-300'
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-slate-900 text-sm">
                    {item.region}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    ({item.activeDealers} dealers)
                  </span>
                  <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    {item.topSegment}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 text-sm">{item.units}</span>
                  <span className="text-slate-500 text-xs ml-1">units ({item.pct}%)</span>
                </div>
              </div>

              {/* Bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${widthPct}%` }}
                />
              </div>

              {/* Segment Breakdown on Hover or Selection */}
              {(isHovered || isSelected) && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 animate-in fade-in duration-150">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Segment Preference Distribution:</span>
                    <span className="text-purple-700 font-semibold">{item.region} Yard Telemetry</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-100/70 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">HYBRID SUV</span>
                      <strong className="text-slate-900 text-xs">{item.segments.hybrid}%</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-100/70 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">MID / AWD SUV</span>
                      <strong className="text-slate-900 text-xs">{item.segments.suv}%</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-100/70 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">COMPACT HATCH</span>
                      <strong className="text-slate-900 text-xs">{item.segments.compact}%</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-100/70 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">SEDAN / WAGON</span>
                      <strong className="text-slate-900 text-xs">{item.segments.sedan}%</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
