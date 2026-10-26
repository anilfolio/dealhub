"use client";

import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import DealHubLogo, { DealHubVectorMark } from "@/components/common/DealHubLogo";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Palette,
  Type,
  LayoutGrid,
  Check,
  Copy,
  Gavel,
  Heart,
  TrendingUp,
  Clock,
  Car,
  Ship,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Shield,
  FileText,
  Sliders,
  SlidersHorizontal,
  ChevronRight,
  Search,
  ExternalLink,
  Info,
} from "lucide-react";

type ActiveTab = "layouts" | "components" | "colors" | "typography";
type LayoutDemo = "70-30-cockpit" | "kpi-grid" | "landed-split";

export default function StyleguidePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("layouts");
  const [activeLayoutDemo, setActiveLayoutDemo] = useState<LayoutDemo>("70-30-cockpit");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Interactive Landed Cost simulator state for Pattern 3
  const [fobJpy, setFobJpy] = useState<number>(1850000);
  const [exchangeRate, setExchangeRate] = useState<number>(91.5);
  const [targetMargin, setTargetMargin] = useState<number>(4500);

  // Calculations for interactive Landed Cost
  const fobNzd = Math.round(fobJpy / exchangeRate);
  const maritimeFreightNzd = 2450;
  const mafBiosecurityNzd = 680;
  const complianceNzd = 1250;
  const subtotalBeforeGst = fobNzd + maritimeFreightNzd + mafBiosecurityNzd + complianceNzd;
  const gstNzd = Math.round(subtotalBeforeGst * 0.15);
  const totalLandedCostNzd = subtotalBeforeGst + gstNzd;
  const tradeMeRetailCompNzd = 34500;
  const grossProfitMarginNzd = tradeMeRetailCompNzd - totalLandedCostNzd;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const COLOR_TOKENS = [
    {
      group: "Primary Brand Tokens",
      colors: [
        { name: "Crimson Velocity", hex: "#E11D48", class: "bg-[#E11D48]", desc: "Primary brand accent, live bids & badges" },
        { name: "Crimson Vivid", hex: "#FF385C", class: "bg-[#FF385C]", desc: "Glow effects, hover states" },
        { name: "Crimson Dark", hex: "#BE123C", class: "bg-[#BE123C]", desc: "Shadow gradients, pressed states" },
        { name: "Obsidian Navy", hex: "#0A1322", class: "bg-[#0A1322]", desc: "Dark theme base canvas, sidebar" },
        { name: "Obsidian Card", hex: "#0F1B2E", class: "bg-[#0F1B2E]", desc: "Cockpit surfaces & modals" },
      ],
    },
    {
      group: "Intelligence & Financial Tokens",
      colors: [
        { name: "Electric Blue", hex: "#2563EB", class: "bg-[#2563EB]", desc: "Forex rates, Landed calculators" },
        { name: "Electric Sky", hex: "#60A5FA", class: "bg-[#60A5FA]", desc: "Technical subheadings & tags" },
        { name: "Arbitrage Green", hex: "#059669", class: "bg-[#059669]", desc: "Gross margin spread & profits" },
        { name: "Auction Alert Amber", hex: "#D97706", class: "bg-[#D97706]", desc: "Thin margin & countdown warning" },
        { name: "Surface Daylight", hex: "#F8FAFC", class: "bg-[#F8FAFC]", desc: "Light theme background" },
      ],
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#070D18] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
              <Sparkles size={13} />
              <span>DealHub Design System & Layout Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              UI Styleguide & High-Density Layout Standards
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Specification blueprints for the 70/30 Cockpit split, Landed Cost Economics Engine, 4-Column Metric Strip, and unified design tokens.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/brand"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-slate-200 text-xs font-bold transition-all"
            >
              <span>HD Logo Assets</span>
              <ExternalLink size={13} />
            </Link>
            <a
              href="/STYLEGUIDE.md"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-950/50 transition-all"
            >
              <FileText size={13} />
              <span>View STYLEGUIDE.md</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto">
          {[
            { id: "layouts", label: "Better Layout Patterns", icon: LayoutGrid },
            { id: "components", label: "Component Library", icon: Layers },
            { id: "colors", label: "Color Tokens & Palette", icon: Palette },
            { id: "typography", label: "Typography Scale", icon: Type },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                  isActive
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-md shadow-rose-950/40"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── TAB 1: BETTER LAYOUT ARCHITECTURAL PATTERNS ─── */}
        {activeTab === "layouts" && (
          <div className="space-y-6">
            {/* Pattern Switcher Pills */}
            <div className="bg-[#0B1322] border border-white/[0.08] p-2 rounded-2xl flex flex-wrap gap-2">
              {[
                { id: "70-30-cockpit", label: "Pattern 1: The 70/30 Auction Cockpit", desc: "Lot queue + Sticky telemetry rail" },
                { id: "kpi-grid", label: "Pattern 2: 4-Column Dealer KPI Strip", desc: "Counters with trend indicators" },
                { id: "landed-split", label: "Pattern 3: Landed Cost Dual Engine", desc: "Inspection photo + Real-time economics" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveLayoutDemo(p.id as LayoutDemo)}
                  className={`flex-1 min-w-[240px] text-left p-3 rounded-xl border transition-all ${
                    activeLayoutDemo === p.id
                      ? "bg-rose-500/15 border-rose-500/40 text-white shadow-md shadow-rose-950/30"
                      : "bg-white/[0.02] border-transparent text-slate-400 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="text-xs font-extrabold text-white">{p.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>

            {/* Pattern 1 Demo: 70/30 Cockpit Split */}
            {activeLayoutDemo === "70-30-cockpit" && (
              <div className="space-y-4">
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-rose-300 font-semibold">
                    <Info size={15} className="shrink-0" />
                    <span>
                      <strong>The 70/30 Cockpit Split</strong> separates high-volume vehicle exploration (70%) from persistent telemetry, live currency locks, and quick-bid adjustments (30%).
                    </span>
                  </div>
                  <span className="hidden sm:inline-block font-mono text-[11px] text-slate-400">
                    lg:grid-cols-12 (lg:col-span-8 + lg:col-span-4)
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column (70%): Sourcing Grid */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Simulated Filter Bar */}
                    <div className="bg-[#0B1322] border border-white/[0.08] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <SlidersHorizontal size={14} className="text-sky-400" />
                        <span>Filter Japan Auction Lots</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px]">1,248 Live Lots</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold">
                          Grade 4.5+
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 font-bold">
                          Hybrid Only
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                          Auckland Delivery
                        </span>
                      </div>
                    </div>

                    {/* 2-wide Card Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Simulated Lot 1 */}
                      <div className="bg-[#0B1322] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all group">
                        <div className="h-44 bg-slate-900 relative">
                          <img
                            src="/vehicles/toyota-harrier-hybrid-1.jpg"
                            alt="Toyota Harrier"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-rose-600/90 text-white font-mono text-[10.5px] font-bold backdrop-blur-md flex items-center gap-1">
                            <Clock size={11} /> 01h 22m
                          </div>
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white font-bold text-[10.5px] backdrop-blur-md">
                            Grade 4.5/B
                          </div>
                          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-slate-200 text-[10px] font-mono">
                            USS Tokyo · Lot #4812
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <div>
                            <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                              2021 Toyota Harrier Hybrid
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              G Leather Package · 28,400 km · 2.5L e-Four
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.06] flex items-center justify-between text-xs">
                            <div>
                              <div className="text-[10px] text-slate-400">FOB Price</div>
                              <div className="font-mono font-bold text-white">¥2,850,000</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-slate-400">Est. Landed NZD</div>
                              <div className="font-mono font-bold text-rose-400">$38,950 NZD</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <TrendingUp size={11} /> +$5,800 Margin
                            </span>
                            <button className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors">
                              Inspect Lot
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Simulated Lot 2 */}
                      <div className="bg-[#0B1322] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all group">
                        <div className="h-44 bg-slate-900 relative">
                          <img
                            src="/vehicles/honda-vezel-hybrid-1.jpg"
                            alt="Honda Vezel"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-600/90 text-white font-mono text-[10.5px] font-bold backdrop-blur-md flex items-center gap-1">
                            <Clock size={11} /> 03h 48m
                          </div>
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white font-bold text-[10.5px] backdrop-blur-md">
                            Grade 4.0/A
                          </div>
                          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-slate-200 text-[10px] font-mono">
                            TAA Chubu · Lot #9201
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <div>
                            <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                              2020 Honda Vezel e:HEV
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              Z Package · 41,200 km · 1.5L Hybrid
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.06] flex items-center justify-between text-xs">
                            <div>
                              <div className="text-[10px] text-slate-400">FOB Price</div>
                              <div className="font-mono font-bold text-white">¥1,640,000</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-slate-400">Est. Landed NZD</div>
                              <div className="font-mono font-bold text-rose-400">$24,600 NZD</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <TrendingUp size={11} /> +$4,200 Margin
                            </span>
                            <button className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors">
                              Inspect Lot
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (30%): Sticky Cockpit Rail */}
                  <div className="lg:col-span-4 space-y-4">
                    {/* Live FX Rate Lock Card */}
                    <div className="bg-[#0B1322] border border-white/[0.08] p-5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Interbank FX Lock
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                          <Check size={11} /> Locked 48h
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black font-mono text-white">¥91.50</span>
                        <span className="text-xs text-slate-400 font-semibold">= 1.00 NZD</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        All landed calculations are indexed to this locked hedge rate. Eliminates forex volatility between bid and vessel departure.
                      </p>
                    </div>

                    {/* Quick Proxy Bid Escalator */}
                    <div className="bg-[#0B1322] border border-white/[0.08] p-5 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 text-white font-bold text-xs">
                        <Gavel size={15} className="text-rose-400" />
                        <span>Quick Proxy Bid Escalator</span>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] text-slate-400 font-semibold block">
                          Auto-Escalate Active Bids Under Reserve:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {["+¥30,000", "+¥50,000", "+¥100,000"].map((inc, i) => (
                            <button
                              key={i}
                              className="py-1.5 px-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-mono text-slate-200 transition-colors"
                            >
                              {inc}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs space-y-1">
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Active Leading Bids:</span>
                          <span className="font-bold text-emerald-400">4 Lots</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Outbid / Under Reserve:</span>
                          <span className="font-bold text-rose-400">2 Lots</span>
                        </div>
                      </div>
                    </div>

                    {/* Wishlist Buy-Box Radar */}
                    <div className="bg-[#0B1322] border border-white/[0.08] p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-white font-bold text-xs">
                        <Sparkles size={14} className="text-amber-400" />
                        <span>Wishlist Buy-Box Radar</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Heiwa crawler scanned <strong>4,120 auction lots</strong> in the last 60 minutes. 3 new matches found meeting your Auckland yard criteria.
                      </p>
                      <button className="w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-slate-200 border border-white/10 transition-colors">
                        View 3 Matches ➔
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pattern 2 Demo: 4-Column Dealer KPI Strip */}
            {activeLayoutDemo === "kpi-grid" && (
              <div className="space-y-4">
                <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-sky-300 font-semibold">
                    <Info size={15} className="shrink-0" />
                    <span>
                      <strong>The 4-Column Dealer KPI Metric Strip</strong> normalizes executive high-level metrics into a dense, high-impact scannable surface with trend deltas.
                    </span>
                  </div>
                  <span className="hidden sm:inline-block font-mono text-[11px] text-slate-400">
                    grid-cols-2 lg:grid-cols-4 gap-4
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1 */}
                  <div className="bg-[#0B1322] border border-white/[0.08] p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Active Proxy Bids
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                        <Gavel size={16} />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-white">12</div>
                      <div className="text-xs text-slate-400 mt-1">4 Leading · 2 Outbid</div>
                    </div>
                    <div className="pt-2 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                      <TrendingUp size={12} />
                      <span>+3 lots placed today</span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#0B1322] border border-white/[0.08] p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Stock on Water (RoRo)
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                        <Ship size={16} />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-white">$284,500</div>
                      <div className="text-xs text-slate-400 mt-1">8 Vehicles · Armacup Carrier</div>
                    </div>
                    <div className="pt-2 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-sky-400 font-bold">
                      <Clock size={12} />
                      <span>Next Auckland Port: 4 Days</span>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#0B1322] border border-white/[0.08] p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Projected Gross Margin
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <DollarSign size={16} />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">+$46,200</div>
                      <div className="text-xs text-slate-400 mt-1">Avg $3,850 NZD per lot</div>
                    </div>
                    <div className="pt-2 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                      <TrendingUp size={12} />
                      <span>18.4% Return on Sourcing</span>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-[#0B1322] border border-white/[0.08] p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Wishlist Buy-Boxes
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <Sparkles size={16} />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-white">9 Lots</div>
                      <div className="text-xs text-slate-400 mt-1">Matched 3 Saved Rules</div>
                    </div>
                    <div className="pt-2 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-amber-300 font-bold">
                      <Clock size={12} />
                      <span>USS Tokyo ends 18:00 NZST</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pattern 3 Demo: Dual-Engine Landed Cost Inspection Split */}
            {activeLayoutDemo === "landed-split" && (
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <Info size={15} className="shrink-0" />
                    <span>
                      <strong>The Landed Cost Economics Engine Split</strong> pairs vehicle condition inspection (55%) with a real-time landed cost audit & Trade Me margin spread (45%).
                    </span>
                  </div>
                  <span className="hidden sm:inline-block font-mono text-[11px] text-slate-400">
                    55% Left Physical · 45% Right Financial
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column (55%): Vehicle Inspection Specs */}
                  <div className="lg:col-span-7 bg-[#0B1322] border border-white/[0.08] rounded-2xl p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                      <div>
                        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                          Lot #7721 · USS Nagoya
                        </span>
                        <h3 className="text-lg font-black text-white mt-0.5">
                          2021 Toyota RAV4 Hybrid G 4WD
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-lg bg-white/10 text-white font-mono font-bold text-xs border border-white/20">
                          Grade 4.5 / A
                        </span>
                      </div>
                    </div>

                    {/* Inspection Sheet Simulator */}
                    <div className="h-56 rounded-xl bg-slate-900 border border-white/[0.06] flex items-center justify-center p-4 relative overflow-hidden group">
                      <img
                        src="/vehicles/toyota-rav4-hybrid-1.jpg"
                        alt="Toyota RAV4 Hybrid"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                        <div className="text-xs text-slate-200">
                          <span className="font-bold text-white">Chassis:</span> AXAH54-2049182 ·{" "}
                          <span className="font-bold text-white">Odo:</span> 31,450 km ·{" "}
                          <span className="font-bold text-white">Color:</span> Pearl White (070)
                        </div>
                      </div>
                    </div>

                    {/* Inspection Checklist */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06]">
                        <span className="text-slate-400 text-[10px] block">Body scratches</span>
                        <span className="font-bold text-emerald-400">A1 Minor (Buffable)</span>
                      </div>
                      <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06]">
                        <span className="text-slate-400 text-[10px] block">Dents & Dings</span>
                        <span className="font-bold text-emerald-400">None Reported</span>
                      </div>
                      <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06]">
                        <span className="text-slate-400 text-[10px] block">Interior Smell</span>
                        <span className="font-bold text-emerald-400">Grade A (Non-Smoker)</span>
                      </div>
                      <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06]">
                        <span className="text-slate-400 text-[10px] block">Tyre Tread</span>
                        <span className="font-bold text-white">Front 6mm / Rear 6mm</span>
                      </div>
                      <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06]">
                        <span className="text-slate-400 text-[10px] block">Service History</span>
                        <span className="font-bold text-sky-400">Toyota Dealer Stamped</span>
                      </div>
                      <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06]">
                        <span className="text-slate-400 text-[10px] block">Keys Included</span>
                        <span className="font-bold text-white">2 Smart Key Fobs</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (45%): Interactive Economics & Landed Cost Simulator */}
                  <div className="lg:col-span-5 bg-[#0B1322] border border-white/[0.08] rounded-2xl p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-emerald-400" />
                        <h4 className="font-extrabold text-white text-sm">Interactive Landed Cost Audit</h4>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">NZD Locked @ 91.5 JPY</span>
                    </div>

                    {/* Interactive FOB JPY Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">Simulate Proxy Bid (FOB JPY):</span>
                        <span className="font-mono font-bold text-white text-sm">
                          ¥{fobJpy.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1200000"
                        max="3000000"
                        step="50000"
                        value={fobJpy}
                        onChange={(e) => setFobJpy(parseInt(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>¥1,200,000</span>
                        <span>¥2,100,000 (Avg)</span>
                        <span>¥3,000,000</span>
                      </div>
                    </div>

                    {/* Line-by-Line Itemized Landed Cost Audit */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2 font-mono text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>1. FOB Converted:</span>
                        <span className="font-bold text-white">${fobNzd.toLocaleString()} NZD</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[11.5px]">
                        <span>2. Maritime RoRo Shipping:</span>
                        <span>+${maritimeFreightNzd.toLocaleString()} NZD</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[11.5px]">
                        <span>3. MAF Biosecurity & Heat:</span>
                        <span>+${mafBiosecurityNzd.toLocaleString()} NZD</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[11.5px]">
                        <span>4. Compliance & Entry Cert:</span>
                        <span>+${complianceNzd.toLocaleString()} NZD</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[11.5px]">
                        <span>5. Import GST (15%):</span>
                        <span>+${gstNzd.toLocaleString()} NZD</span>
                      </div>

                      <div className="pt-2 border-t border-white/[0.1] flex justify-between text-sm text-white font-extrabold">
                        <span>Total All-Inclusive Landed:</span>
                        <span className="text-rose-400">${totalLandedCostNzd.toLocaleString()} NZD</span>
                      </div>
                    </div>

                    {/* Trade Me Benchmarking & Spread */}
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-semibold">Trade Me NZ Comparable:</span>
                        <span className="font-mono font-bold text-white">
                          ${tradeMeRetailCompNzd.toLocaleString()} NZD
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-black">
                        <span className="text-emerald-300">Projected Dealer Spread:</span>
                        <span className="font-mono text-emerald-400 text-base">
                          +${grossProfitMarginNzd.toLocaleString()} NZD
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-lg shadow-rose-950/50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
                      <Gavel size={14} />
                      <span>Authorize Proxy Bid of ¥{fobJpy.toLocaleString()}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: COMPONENT LIBRARY ─── */}
        {activeTab === "components" && (
          <div className="space-y-8">
            {/* Buttons Matrix */}
            <div className="bg-[#0B1322] border border-white/[0.08] p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
                Action Button Hierarchy
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-lg shadow-rose-950/40 transition-all">
                  Primary Auction Action
                </button>
                <button className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-950/30 transition-all">
                  Approve / Lock Landed Cost
                </button>
                <button className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 font-bold text-xs transition-all">
                  Secondary Neutral Action
                </button>
                <button className="px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs transition-all">
                  Retract Proxy Bid
                </button>
              </div>
            </div>

            {/* Badges Matrix */}
            <div className="bg-[#0B1322] border border-white/[0.08] p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
                Operational Status & Margin Badges
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <TrendingUp size={12} /> +$5,400 NZD High Arbitrage
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <CheckCircle2 size={12} /> Leading Bidder (USS Tokyo)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <Clock size={12} /> Reserve Not Met · Ends 42m
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  Outbid Alert
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white/10 text-white border border-white/20">
                  Grade 4.5 / Interior B
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: COLOR PALETTE & TOKENS ─── */}
        {activeTab === "colors" && (
          <div className="space-y-6">
            {COLOR_TOKENS.map((group, idx) => (
              <div key={idx} className="bg-[#0B1322] border border-white/[0.08] p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
                  {group.group}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {group.colors.map((c, i) => (
                    <div
                      key={i}
                      onClick={() => copyToClipboard(c.hex, c.name)}
                      className="p-3.5 rounded-xl bg-[#070D18] border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer group"
                    >
                      <div className={`w-full h-14 rounded-lg ${c.class} mb-3 shadow-md group-hover:scale-102 transition-transform`} />
                      <div className="flex items-center justify-between">
                        <div className="font-extrabold text-white text-xs truncate">{c.name}</div>
                        {copiedToken === c.name ? (
                          <Check size={12} className="text-emerald-400 shrink-0" />
                        ) : (
                          <Copy size={12} className="text-slate-500 group-hover:text-white shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">{c.hex}</div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-tight">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── TAB 4: TYPOGRAPHY SCALE ─── */}
        {activeTab === "typography" && (
          <div className="bg-[#0B1322] border border-white/[0.08] p-6 rounded-2xl space-y-6">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              Inter & Monospace Financial Scale
            </h3>

            <div className="space-y-6 divide-y divide-white/[0.06]">
              <div className="pt-2">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Display Hero (36px, Inter 900)</div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                  Source Smarter from Japan to New Zealand.
                </div>
              </div>

              <div className="pt-4">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Page Title (24px, Inter 800)</div>
                <div className="text-2xl font-extrabold text-white tracking-tight mt-1">
                  Vehicle Procurement & Landed Cost Intelligence
                </div>
              </div>

              <div className="pt-4">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Tabular Financial Monospace (24px, Inter Mono 900)</div>
                <div className="text-2xl font-black font-mono text-rose-400 tabular-nums mt-1">
                  $38,950.00 NZD (¥2,850,000 FOB)
                </div>
              </div>

              <div className="pt-4">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Body Medium (14px, Inter 500)</div>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl mt-1">
                  Connect directly with live Heiwa auction inventory, automate wishlist buy-box matching, and calculate landed FOB-to-NZD cost margins in real-time.
                </p>
              </div>

              <div className="pt-4">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Corridor Sourcing Tag (10px, Inter 800 Tracking 0.16em)</div>
                <div className="text-[10px] font-extrabold text-sky-400 uppercase tracking-[0.16em] mt-1">
                  JAPAN AUCTION LIVE FEEDS & LANDED COST ARBITRAGE
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
