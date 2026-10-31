"use client";

import React from 'react';
import Link from 'next/link';

export type LogoVariant = 'full' | 'mark' | 'horizontal' | 'icon';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface DealHubLogoProps {
  variant?: LogoVariant;
  size?: LogoSize | number;
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
 * Official Attached Auto Auction Hub Logo Emblem
 * Stylized red letter 'D' with auto auction road trajectory & market telemetry graph nodes.
 */
export function DealHubVectorMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative rounded-xl bg-gradient-to-br from-[#FF385C] via-[#E11D48] to-[#9F1239] p-0.5 flex items-center justify-center shadow-md shadow-rose-950/40 shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden p-0.5">
        <img
          src="/dealhub-emblem.svg"
          alt="DealHub Auto Auction Hub"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}

/**
 * DealHub Official Brand Logo Component
 * Renders the official attached auto auction hub logo icon with consistent styling across all panels.
 */
export function DealHubLogo({
  variant = 'full',
  size = 'md',
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

  // The official attached logo icon inside a squircle emblem container
  const renderEmblem = () => {
    return (
      <div
        className={`relative flex items-center justify-center shrink-0 transition-all duration-300 ${
          glow ? 'hover:shadow-lg hover:shadow-rose-950/50' : ''
        }`}
        style={{ width: pixelSize, height: pixelSize }}
      >
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#FF385C] via-[#E11D48] to-[#9F1239] p-0.5 flex items-center justify-center shadow-md shadow-rose-950/50 group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden p-0.5">
            <img
              src="/dealhub-emblem.svg"
              alt="DealHub Auto Auction Hub"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
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
          title="DealHub · Auto Auction Hub & Dealer Intelligence Platform"
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

export { DealHubLogo as HDLogo };
export default DealHubLogo;
