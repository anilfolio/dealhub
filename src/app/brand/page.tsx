"use client";

import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import DealHubLogo, { DealHubVectorMark, LogoSize, LogoMode } from "@/components/common/DealHubLogo";
import {
  Download,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Layers,
  Palette,
  ExternalLink,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function BrandIdentityPage() {
  const [selectedSize, setSelectedSize] = useState<LogoSize>("lg");
  const [selectedMode, setSelectedMode] = useState<LogoMode>("vector");
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "light">("dark");
  const [selectedBadge, setSelectedBadge] = useState<string>("DEALER");
  const [badgeColor, setBadgeColor] = useState<"sky" | "rose" | "emerald" | "amber">("sky");
  const [copiedCode, setCopiedCode] = useState(false);

  const logoSizes: LogoSize[] = ["xs", "sm", "md", "lg", "xl", "2xl"];

  const generatedJsx = `<DealHubLogo
  variant="full"
  size="${selectedSize}"
  mode="${selectedMode}"
  theme="${selectedTheme}"
  subBadge="${selectedBadge}"
  subBadgeColor="${badgeColor}"
  glow={true}
/>`;

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(generatedJsx);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#070D18] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
              <Sparkles size={13} />
              <span>Official Brand Identity Master</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              DealHub High Definition (HD) Logo System
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Scalable vector master graphics, 4K glossy app icon emblems, and unified design tokens for DealHub Dealer Intelligence Platform.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/dealhub-logo-full.svg"
              download="dealhub-logo-full.svg"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download size={14} />
              Download Master Vector SVG
            </a>
          </div>
        </div>

        {/* ─── 1. Interactive Logo Sandbox / Playground ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Preview Canvas */}
          <div className="lg:col-span-7 bg-[#0B1322] border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold tracking-wider uppercase text-slate-400 flex items-center gap-2">
                  <Layers size={14} className="text-rose-400" />
                  Live Component Canvas
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-slate-300 font-mono">
                  {selectedSize.toUpperCase()} · {selectedMode.toUpperCase()} · {selectedTheme.toUpperCase()}
                </span>
              </div>

              {/* The interactive stage */}
              <div
                className={`min-h-[260px] rounded-2xl border transition-colors flex items-center justify-center p-8 ${
                  selectedTheme === "dark"
                    ? "bg-[#050811] border-white/[0.08]"
                    : "bg-slate-100 border-slate-300 shadow-inner"
                }`}
              >
                <DealHubLogo
                  variant="full"
                  size={selectedSize}
                  mode={selectedMode}
                  theme={selectedTheme}
                  subBadge={selectedBadge}
                  subBadgeColor={badgeColor}
                  glow={true}
                />
              </div>
            </div>

            {/* Code Generator & Copy */}
            <div className="mt-6 pt-5 border-t border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Ready-to-use React JSX
                </span>
                <button
                  onClick={copyCodeToClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-slate-200 transition-colors"
                >
                  {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedCode ? "Copied!" : "Copy JSX"}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-[11px] font-mono text-rose-300 overflow-x-auto">
                {generatedJsx}
              </pre>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-5 bg-[#0B1322] border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-white/[0.08]">
              <Sliders size={16} className="text-sky-400" />
              <h2 className="text-base font-extrabold text-white">Customization Controls</h2>
            </div>

            {/* Size Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Emblem Scale
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {logoSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      selectedSize === sz
                        ? "bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-950/40"
                        : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {sz.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode: Vector vs 3D HD Master */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Rendering Engine
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedMode("vector")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedMode === "vector"
                      ? "bg-sky-500/15 border-sky-400/50 text-white"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="font-extrabold text-xs">Vector SVG (Sharp)</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Infinite resolution, 0 latency</div>
                </button>
                <button
                  onClick={() => setSelectedMode("hd-image")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedMode === "hd-image"
                      ? "bg-rose-500/15 border-rose-400/50 text-white"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="font-extrabold text-xs">4K Glossy Master</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">3D metallic luster aesthetic</div>
                </button>
              </div>
            </div>

            {/* Background Theme */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Background Contrast
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedTheme("dark")}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectedTheme === "dark"
                      ? "bg-slate-900 border-white/30 text-white"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400"
                  }`}
                >
                  Dark Obsidian
                </button>
                <button
                  onClick={() => setSelectedTheme("light")}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectedTheme === "light"
                      ? "bg-white border-white text-slate-900"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400"
                  }`}
                >
                  Crisp Light
                </button>
              </div>
            </div>

            {/* Sub-badge Customization */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Contextual Portal Badge
              </label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {["DEALER", "ADMIN OPS", "NZ IMPORT", "AUCTION"].map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setSelectedBadge(b);
                      if (b === "ADMIN OPS") setBadgeColor("rose");
                      else if (b === "DEALER") setBadgeColor("sky");
                      else if (b === "NZ IMPORT") setBadgeColor("emerald");
                      else setBadgeColor("amber");
                    }}
                    className={`py-2 px-3 text-xs font-extrabold rounded-lg border text-center transition-all ${
                      selectedBadge === b
                        ? "bg-white/10 border-white/40 text-white"
                        : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2. All Brand Identity Formats & Download Grid ─── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} className="text-rose-400" />
            <h2 className="text-xl font-black text-white tracking-tight">
              Export Ready Brand Assets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {/* Card 1: Full Horizontal Vector Logo */}
            <div className="bg-[#0B1322] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all group">
              <div>
                <div className="h-36 rounded-xl bg-[#050811] border border-white/[0.06] flex items-center justify-center p-4 mb-4 overflow-hidden">
                  <img
                    src="/dealhub-logo-full.svg"
                    alt="DealHub Full Vector Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h3 className="font-extrabold text-white text-sm">Full Horizontal Logo</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Primary banner vector for documentation, investor presentations, and web navigation.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">SVG · Vector</span>
                <a
                  href="/dealhub-logo-full.svg"
                  download="dealhub-logo-full.svg"
                  className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold"
                >
                  <Download size={13} /> Download
                </a>
              </div>
            </div>

            {/* Card 2: Squircle Vector Emblem */}
            <div className="bg-[#0B1322] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all group">
              <div>
                <div className="h-36 rounded-xl bg-[#050811] border border-white/[0.06] flex items-center justify-center p-4 mb-4">
                  <div className="w-20 h-20">
                    <DealHubVectorMark size={80} />
                  </div>
                </div>
                <h3 className="font-extrabold text-white text-sm">Squircle Vector Emblem</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Standalone mark with precision D+H monogram, rising telemetry pulse, and speed blades.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">SVG · 200x200</span>
                <a
                  href="/dealhub-emblem.svg"
                  download="dealhub-emblem.svg"
                  className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold"
                >
                  <Download size={13} /> Download
                </a>
              </div>
            </div>

            {/* Card 3: 4K 3D Glossy App Icon Master */}
            <div className="bg-[#0B1322] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all group">
              <div>
                <div className="h-36 rounded-xl bg-[#050811] border border-white/[0.06] flex items-center justify-center p-4 mb-4">
                  <img
                    src="/dealhub-emblem-hd.jpg"
                    alt="DealHub 4K Glossy Master"
                    className="w-20 h-20 rounded-2xl object-cover shadow-lg shadow-rose-950/60"
                  />
                </div>
                <h3 className="font-extrabold text-white text-sm">3D Glossy HD Master</h3>
                <p className="text-xs text-slate-400 mt-1">
                  High-definition raster icon with metallic crimson rim, sports car curves, and glowing spark.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">JPG · 1024x1024</span>
                <a
                  href="/dealhub-emblem-hd.jpg"
                  download="dealhub-emblem-hd.jpg"
                  className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold"
                >
                  <Download size={13} /> Download
                </a>
              </div>
            </div>

            {/* Card 4: Web Favicon & App Icon */}
            <div className="bg-[#0B1322] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all group">
              <div>
                <div className="h-36 rounded-xl bg-[#050811] border border-white/[0.06] flex items-center justify-center p-4 mb-4 gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-2">
                    <img src="/favicon.svg" alt="Favicon" className="w-8 h-8" />
                  </div>
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/20 shadow-md">
                    <img src="/apple-touch-icon.png" alt="Touch Icon" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="font-extrabold text-white text-sm">Favicon & Touch Icon</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Optimized browser tabs, PWA homescreen launch icons, and mobile bookmark emblems.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">SVG & PNG</span>
                <a
                  href="/favicon.svg"
                  download="favicon.svg"
                  className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold"
                >
                  <Download size={13} /> Download
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3. Brand Color Palette Tokens ─── */}
        <div className="bg-[#0B1322] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} className="text-sky-400" />
            <h2 className="text-xl font-black text-white tracking-tight">
              Color Tokens & Visual Identity Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#070D18] border border-white/[0.06]">
              <div className="w-full h-12 rounded-lg bg-gradient-to-r from-[#FF385C] to-[#E11D48] mb-3 shadow-md shadow-rose-950/40" />
              <div className="font-extrabold text-white text-sm">Crimson Velocity</div>
              <div className="text-[11px] font-mono text-rose-400 mt-0.5">#E11D48 · #FF385C</div>
              <div className="text-xs text-slate-400 mt-1">Primary accent, urgency, and live auction bids.</div>
            </div>

            <div className="p-4 rounded-xl bg-[#070D18] border border-white/[0.06]">
              <div className="w-full h-12 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#60A5FA] mb-3 shadow-md shadow-blue-950/40" />
              <div className="font-extrabold text-white text-sm">Electric Intelligence</div>
              <div className="text-[11px] font-mono text-sky-400 mt-0.5">#2563EB · #60A5FA</div>
              <div className="text-xs text-slate-400 mt-1">Data metrics, arbitrage telemetry, and NZ landed costs.</div>
            </div>

            <div className="p-4 rounded-xl bg-[#070D18] border border-white/[0.06]">
              <div className="w-full h-12 rounded-lg bg-gradient-to-r from-[#141E33] to-[#050811] border border-white/10 mb-3 shadow-md" />
              <div className="font-extrabold text-white text-sm">Obsidian Navy</div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">#070D18 · #0B1322</div>
              <div className="text-xs text-slate-400 mt-1">Deep background canvas and executive cockpit contrast.</div>
            </div>

            <div className="p-4 rounded-xl bg-[#070D18] border border-white/[0.06]">
              <div className="w-full h-12 rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] mb-3 shadow-md shadow-emerald-950/40" />
              <div className="font-extrabold text-white text-sm">Arbitrage Alpha</div>
              <div className="text-[11px] font-mono text-emerald-400 mt-0.5">#10B981 · #059669</div>
              <div className="text-xs text-slate-400 mt-1">Gross profit margin spread and matched wishlist alert.</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
