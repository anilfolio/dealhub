"use client";

import React from 'react';
import Link from 'next/link';

export type LogoVariant = 'full' | 'mark' | 'horizontal' | 'icon';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type LogoMode = 'vector' | 'hd-image';

export interface DealHubLogoProps {
  variant?: LogoVariant;
  size?: LogoSize | number;
  mode?: LogoMode;
  theme?: 'dark' | 'light';
  subBadge?: string;
  subBadgeColor?: 'sky' | 'rose' | 'emerald' | 'amber';
  subtitle?: string;
  showSubtitle?: boolean;
  href?: string;
  glow?: boolean;
  className?: string;
  isMini?: boolean;
  onClick?: () => void;
}

const sizeMap: Record<LogoSize, { box: number; markSize: string; textSize: string; subSize: string; badgeSize: string }> = {
  xs: { box: 28, markSize: 'w-7 h-7', textSize: 'text-sm', subSize: 'text-[7.5px]', badgeSize: 'text-[7.5px] px-1 py-0.2' },
  sm: { box: 34, markSize: 'w-8.5 h-8.5', textSize: 'text-base', subSize: 'text-[8.5px]', badgeSize: 'text-[8px] px-1.5 py-0.5' },
  md: { box: 40, markSize: 'w-10 h-10', textSize: 'text-[17px]', subSize: 'text-[9.5px]', badgeSize: 'text-[8.5px] px-1.5 py-0.5' },
  lg: { box: 48, markSize: 'w-12 h-12', textSize: 'text-xl', subSize: 'text-[10.5px]', badgeSize: 'text-[9px] px-2 py-0.5' },
  xl: { box: 60, markSize: 'w-15 h-15', textSize: 'text-2xl', subSize: 'text-xs', badgeSize: 'text-[10px] px-2.5 py-1' },
  '2xl': { box: 80, markSize: 'w-20 h-20', textSize: 'text-3xl', subSize: 'text-sm', badgeSize: 'text-xs px-3 py-1' },
};

const badgeColorMap = {
  sky: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
  rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

/**
 * HD Vector SVG Mark for DealHub
 * Features precision geometric D+H monogram, ascending market telemetry pulse,
 * and aerodynamic automotive speed blade contours.
 */
export function DealHubVectorMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DealHub HD Emblem"
    >
      <defs>
        <linearGradient id="dh_bg_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#141E33" />
          <stop offset="50%" stopColor="#0B1220" />
          <stop offset="100%" stopColor="#050811" />
        </linearGradient>

        <linearGradient id="dh_crimson_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF385C" />
          <stop offset="45%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>

        <linearGradient id="dh_blue_grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>

        <linearGradient id="dh_rim_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="40%" stopColor="#E11D48" />
          <stop offset="70%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <filter id="dh_shadow_filter" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#E11D48" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* 1. Squircle Base Frame */}
      <rect
        x="10"
        y="10"
        width="180"
        height="180"
        rx="46"
        ry="46"
        fill="url(#dh_bg_grad)"
        stroke="url(#dh_rim_grad)"
        strokeWidth="3.5"
        filter="url(#dh_shadow_filter)"
      />

      {/* Inner highlight line */}
      <rect
        x="15"
        y="15"
        width="170"
        height="170"
        rx="41"
        ry="41"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.09"
        strokeWidth="1.2"
      />

      {/* 2. Bold 'D' Monogram in Crimson */}
      <g>
        <path
          d="M 44 54 
             C 44 48, 48 44, 54 44 
             L 88 44 
             C 114 44, 132 58, 132 84 
             C 132 100, 122 114, 108 122 
             L 94 112 
             C 106 106, 112 96, 112 84 
             C 112 68, 100 60, 84 60 
             L 64 60 
             L 64 138 
             C 64 144, 60 148, 54 148 
             L 48 148 
             C 45 148, 44 145, 44 142 
             Z"
          fill="url(#dh_crimson_grad)"
        />

        {/* Inner aerodynamic bowl negative space */}
        <path
          d="M 64 74 L 84 74 C 95 74, 102 81, 102 91 C 102 99, 96 105, 87 106 L 64 88 Z"
          fill="#0B1220"
          opacity="0.95"
        />
      </g>

      {/* 3. Interlocking 'H' Stem & Market Surge Arrow in Electric Blue */}
      <g>
        <path
          d="M 126 148 
             C 120 148, 116 144, 116 138 
             L 116 94 
             L 100 94 
             L 100 114 
             L 88 102 
             L 88 82 
             L 116 82 
             L 116 66 
             L 136 66 
             L 136 138 
             C 136 144, 132 148, 126 148 Z"
          fill="url(#dh_blue_grad)"
        />

        {/* Telemetry Trajectory Line */}
        <path
          d="M 52 116 L 78 94 L 96 108 L 134 68 L 156 46"
          fill="none"
          stroke="url(#dh_blue_grad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Arrow head */}
        <polygon points="156,38 158,54 144,48 138,40" fill="#60A5FA" />

        {/* Intelligence Data Nodes */}
        <circle cx="78" cy="94" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
        <circle cx="96" cy="108" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
        <circle cx="134" cy="68" r="4.5" fill="#FFFFFF" stroke="#E11D48" strokeWidth="2.5" />
      </g>

      {/* 4. Lower Automotive Speed Blade */}
      <path d="M 38 156 L 162 156 L 148 163 L 52 163 Z" fill="url(#dh_crimson_grad)" opacity="0.85" />

      {/* Spark highlight */}
      <circle cx="158" cy="40" r="2.5" fill="#FFFFFF" opacity="0.95" />
      <circle cx="158" cy="40" r="6" fill="#38BDF8" opacity="0.4" />
    </svg>
  );
}

/**
 * DealHub HD Logo Component
 * Primary brand emblem and typography system for DealHub Dealer Intelligence Platform.
 */
export function DealHubLogo({
  variant = 'full',
  size = 'md',
  mode = 'vector',
  theme = 'dark',
  subBadge = 'DEALER',
  subBadgeColor = 'sky',
  subtitle = 'INTELLIGENCE PLATFORM',
  showSubtitle = true,
  href,
  glow = true,
  className = '',
  isMini = false,
  onClick,
}: DealHubLogoProps) {
  const currentSizeConfig = typeof size === 'string' ? sizeMap[size] || sizeMap.md : null;
  const pixelSize = typeof size === 'number' ? size : currentSizeConfig ? currentSizeConfig.box : 40;
  const isLight = theme === 'light';

  // The emblem icon mark (vector or HD raster asset)
  const renderEmblem = () => {
    return (
      <div
        className={`relative flex items-center justify-center shrink-0 transition-all duration-300 ${
          glow ? 'hover:shadow-lg hover:shadow-rose-950/40' : ''
        }`}
        style={{ width: pixelSize, height: pixelSize }}
      >
        {mode === 'hd-image' ? (
          <div className="w-full h-full rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-[#E11D48] via-[#1E293B] to-[#38BDF8] shadow-md shadow-rose-950/50">
            <img
              src="/dealhub-emblem-hd.jpg"
              alt="DealHub HD Logo"
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
        ) : (
          <DealHubVectorMark size={pixelSize} />
        )}
      </div>
    );
  };

  // If icon-only or mini mode requested
  if (variant === 'mark' || variant === 'icon' || isMini) {
    const markContent = renderEmblem();
    if (href) {
      return (
        <Link
          href={href}
          onClick={onClick}
          className={`inline-flex items-center justify-center group ${className}`}
          title="DealHub · Dealer Intelligence Platform"
        >
          <div className="group-hover:scale-105 transition-transform">{markContent}</div>
        </Link>
      );
    }
    return <div className={`inline-flex items-center justify-center ${className}`}>{markContent}</div>;
  }

  // Full and Horizontal layouts with typography
  const textContent = (
    <div className="flex items-center gap-3 group min-w-0">
      <div className="group-hover:scale-105 transition-transform shrink-0">
        {renderEmblem()}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight leading-none ${
              isLight ? 'text-[#0A1322]' : 'text-white'
            } ${currentSizeConfig ? currentSizeConfig.textSize : 'text-[17px]'}`}
          >
            Deal<span className="text-[#E11D48]">Hub</span>
          </span>

          {subBadge && (
            <span
              className={`rounded font-extrabold uppercase tracking-wide border leading-none ${
                badgeColorMap[subBadgeColor] || badgeColorMap.sky
              } ${currentSizeConfig ? currentSizeConfig.badgeSize : 'text-[8.5px] px-1.5 py-0.5'}`}
            >
              {subBadge}
            </span>
          )}
        </div>

        {showSubtitle && subtitle && (
          <span
            className={`font-extrabold tracking-[0.16em] uppercase block mt-1 leading-none truncate ${
              isLight ? 'text-[#2563EB]' : 'text-[#60A5FA]'
            } ${currentSizeConfig ? currentSizeConfig.subSize : 'text-[9.5px]'}`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={`inline-flex items-center min-w-0 ${className}`}>
        {textContent}
      </Link>
    );
  }

  return <div className={`inline-flex items-center min-w-0 ${className}`}>{textContent}</div>;
}

// Convenient alias for "HDLogo"
export { DealHubLogo as HDLogo };
export default DealHubLogo;
