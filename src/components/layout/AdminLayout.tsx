"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Car,
  Users,
  Bell,
  Search,
  Menu,
  X,
  RefreshCw,
  LogOut,
  Shield,
  LayoutDashboard,
  Heart,
  ChevronUp,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import GlobalSearchModal from '@/components/layout/GlobalSearchModal';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userToggled, setUserToggled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Responsive sidebar default handling
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (!userToggled) {
        if (width >= 1280) {
          setIsCollapsed(false); // Default Open on XL Screen
        } else if (width >= 1024) {
          setIsCollapsed(true); // Default Mini Sidebar on Laptop
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [userToggled]);

  // Global Ctrl+K / Cmd+K / Slash search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement?.tagName || ''))
      ) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
    setUserToggled(true);
  };

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      router.push(`/admin/vehicles?search=${encodeURIComponent(headerSearchQuery.trim())}`);
    } else {
      router.push('/admin/vehicles');
    }
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Dealers', href: '/admin/dealers', icon: Users, badge: '3' },
    { label: 'Wish Lists', href: '/admin/wishlists', icon: Heart, },
    { label: 'Heiwa Vehicles', href: '/admin/vehicles', icon: Car, badge: '38' },
  ];

  const handleRefreshFeeds = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Mini mode is active ONLY when collapsed and not viewing the mobile drawer overlay
  const isMini = isCollapsed && !mobileMenuOpen;

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#111C2D] font-sans antialiased overflow-hidden">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ─── Sidebar - Modern High-Contrast Navy Blue ─── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 bg-[#0A1322] border-r border-[#1B2A42] text-slate-200 flex flex-col justify-between shrink-0 transition-[width,transform] duration-200 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0 w-[268px]' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-[76px]' : 'lg:w-[268px]'}
      `}>
        {/* ─── 1. Top Brand Header (Aligned to 68px) ─── */}
        <div className={`h-[68px] px-3.5 flex items-center border-b border-white/[0.08] bg-white/[0.02] shrink-0 ${isMini ? 'justify-center' : 'justify-between'}`}>
          <Link
            href="/admin"
            className="flex items-center gap-3 group min-w-0"
            onClick={() => setMobileMenuOpen(false)}
            title={isMini ? "DealHub Admin Operations" : undefined}
          >
            {/* DealHub Logo Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#BE123C] p-0.5 flex items-center justify-center shadow-lg shadow-rose-950/50 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                <img
                  src="/dealhub-logo.jpg"
                  alt="DealHub"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Brand Titles (Hidden in mini mode) */}
            {!isMini && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[16px] font-extrabold text-white tracking-tight leading-none">DealHub</span>
                  <span className="text-[8.5px] px-1.5 py-0.5 rounded font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wide leading-none">
                    ADMIN OPS
                  </span>
                </div>
                <span className="block text-[9.5px] font-extrabold text-[#60A5FA] tracking-[0.16em] uppercase mt-1 leading-none">
                  INTELLIGENCE PLATFORM
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button (< lg) */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── 2. Scrollable Navigation Menus ─── */}
        <div className={`flex-1 overflow-y-auto ${isMini ? 'px-2 py-4' : 'px-3.5 py-4'} space-y-5`}>
          {/* Main Admin Menu */}
          <div>
            {!isMini ? (
              <div className="px-3 pb-2 flex items-center justify-between">
                <span className="text-[10.5px] font-extrabold text-[#94A3B8] uppercase tracking-[0.14em]">
                  Admin Management
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80"></span>
              </div>
            ) : (
              <div className="flex justify-center pb-2">
                <div className="w-6 h-px bg-white/10" />
              </div>
            )}

            <nav className={isMini ? "space-y-2.5" : "space-y-3"}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

                if (isMini) {
                  return (
                    <div key={item.href} className="relative group flex justify-center">
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center relative transition-all duration-150 ${isActive
                            ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-semibold shadow-lg shadow-rose-950/40 ring-1 ring-white/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                          }`}
                      >
                        <Icon
                          size={19}
                          className={isActive ? 'text-white stroke-[2.2]' : 'text-slate-400 group-hover:text-white transition-colors'}
                        />

                        {/* Badge Indicator in Mini Mode */}
                        {item.badge && (
                          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#E11D48] text-white text-[9.5px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#0A1322] shadow-xs">
                            {item.badge.includes(' ') ? item.badge.split(' ')[0] : item.badge}
                          </span>
                        )}
                      </Link>

                      {/* Tooltip on Hover */}
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#0F1B2E] text-white text-xs font-semibold rounded-lg shadow-2xl border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 flex items-center gap-2 top-1/2 -translate-y-1/2">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${isActive
                        ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-semibold shadow-lg shadow-rose-950/40 ring-1 ring-white/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className={isActive ? 'text-white stroke-[2.2]' : 'text-slate-400 group-hover:text-white transition-colors'}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${isActive
                          ? 'bg-white text-[#BE123C] shadow-xs'
                          : 'bg-white/15 text-slate-200 group-hover:bg-white/20'
                        }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ─── 3. Elevated Docked Bottom Card (Clearly Separated) ─── */}
        <div className={`${isMini ? 'p-2' : 'p-3'} shrink-0 relative`}>
          {/* Super Admin Profile Dropdown Popup Menu */}
          {profileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div
                className={`absolute mb-2 bg-[#0F1B2E] border border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-150 ${isMini ? 'bottom-0 left-full ml-3 w-56' : 'bottom-full left-3 right-3'
                  }`}
              >
                <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                  <div className="text-[12.5px] font-bold text-white">Super Admin</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Shield size={11} className="text-rose-400 shrink-0" />
                    <span>DealHub Operations</span>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-medium text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <User size={15} className="text-slate-400" />
                  <span>Profile Settings</span>
                </Link>
                <div className="border-t border-white/[0.08] my-1" />
                <Link
                  href="/login"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </Link>
              </div>
            </>
          )}

          {isMini ? (
            <div className="flex justify-center">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#2B5885] text-white flex items-center justify-center font-bold text-xs shadow-md ring-1 ring-white/20 hover:ring-rose-500/50 hover:scale-105 transition-all cursor-pointer relative group"
                title="Super Admin - Operations"
              >
                DH
                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#0F1B2E] text-white text-xs font-semibold rounded-lg shadow-2xl border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 top-1/2 -translate-y-1/2">
                  Super Admin Profile
                </div>
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.09] p-3 space-y-3 backdrop-blur-md shadow-xl">
              {/* Super Admin Profile Trigger Row */}
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-full flex items-center justify-between gap-2 text-left group p-1 -m-1 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#2B5885] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ring-1 ring-white/20">
                    DH
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-bold text-white group-hover:text-rose-400 transition-colors truncate leading-tight">
                      Super Admin
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium truncate flex items-center gap-1 mt-0.5">
                      <Shield size={11} className="text-rose-400 shrink-0" />
                      <span>DealHub Operations</span>
                    </div>
                  </div>
                </div>

                <div className="p-1 text-slate-400 group-hover:text-white transition-colors shrink-0">
                  <ChevronUp
                    size={15}
                    className={`transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180 text-rose-400' : ''
                      }`}
                  />
                </div>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ─── Main Content Viewport ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar — Aligned to 68px */}
        <header className="h-[68px] bg-white border-b border-[#E5E7EB] px-3 sm:px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl min-w-0">
            {/* Phone/iPad Menu Toggle (< 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#4B5563] hover:text-[#111827] rounded-xl hover:bg-slate-100 transition-colors shrink-0"
              title="Open navigation menu"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            {/* Laptop/Desktop Sidebar Toggle (>= 1024px) */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex items-center justify-center p-2 text-[#4B5563] hover:text-[#111827] rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer group shrink-0"
              title={isCollapsed ? "Expand sidebar" : "Collapse to mini sidebar"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse to mini sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen size={20} className="group-hover:scale-105 transition-transform text-slate-600" />
              ) : (
                <PanelLeftClose size={20} className="group-hover:scale-105 transition-transform text-slate-600" />
              )}
            </button>

            {/* Mobile View: Single Search Icon Button (no text input) */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="sm:hidden p-2 text-[#4B5563] hover:text-[#111827] rounded-xl hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
              title="Search (Ctrl+K)"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Tablet & Desktop View: Global Search Bar Trigger */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="hidden sm:flex items-center justify-between w-full pl-3.5 pr-2.5 py-2 bg-white hover:bg-slate-50 border border-[#E5E7EB] hover:border-slate-300 rounded-xl text-left text-xs sm:text-sm text-[#9CA3AF] transition-all group shadow-2xs cursor-pointer"
              title="Search models, dealers, VINs, pages (Ctrl+K)"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Search size={15} className="text-[#9CA3AF] group-hover:text-[#111827] transition-colors shrink-0" />
                <span className="truncate text-xs sm:text-[13px] text-slate-500 group-hover:text-slate-800">
                  Search models, dealers, VINs or lots...
                </span>
              </div>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-[#64748B] bg-slate-100 border border-[#E5E7EB] rounded tracking-wide shrink-0">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Right Header: Feeds Sync + Notification */}
          <div className="flex items-center gap-1.5 sm:gap-3 ml-2 sm:ml-4 shrink-0">
            {/* Feeds Refresh Button */}
            <button
              onClick={handleRefreshFeeds}
              className={`p-2 text-[#4B5563] hover:text-[#111827] hover:bg-slate-100 rounded-full transition-colors ${isRefreshing ? 'text-rose-600' : ''
                }`}
              title="Sync Live Heiwa Feeds"
            >
              <RefreshCw size={17} className={isRefreshing ? 'animate-spin' : ''} />
            </button>

            {/* Notification Bell */}
            <button
              className="relative p-2 text-[#4B5563] hover:text-[#111827] hover:bg-slate-100 rounded-full transition-colors"
              title="Notifications"
            >
              <Bell size={19} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E11D48] rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Page Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-3.5 sm:p-8 lg:p-10 pb-24 lg:pb-10">
          <div className="max-w-[1520px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* ─── Ultra-Premium Admin Mobile Bottom Navigation Dock (< lg) ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A1322]/95 backdrop-blur-xl border-t border-[#1B2A42] px-2 py-1 flex items-center justify-around safe-area-pb shadow-2xl">
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/admin' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard size={19} />
          <span className="text-[10px] mt-0.5 tracking-tight">Overview</span>
        </Link>

        <Link
          href="/admin/vehicles"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            pathname.startsWith('/admin/vehicles') ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Car size={19} />
          <span className="text-[10px] mt-0.5 tracking-tight">Lots</span>
        </Link>

        <Link
          href="/admin/dealers"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            pathname.startsWith('/admin/dealers') ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users size={19} />
          <span className="text-[10px] mt-0.5 tracking-tight">Dealers</span>
        </Link>

        <Link
          href="/admin/wishlists"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            pathname.startsWith('/admin/wishlists') ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart size={19} />
          <span className="text-[10px] mt-0.5 tracking-tight">Wishlists</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          title="Open menu"
        >
          <Menu size={19} />
          <span className="text-[10px] mt-0.5 tracking-tight">Menu</span>
        </button>
      </nav>

      {/* Global Search Dialog (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
}
