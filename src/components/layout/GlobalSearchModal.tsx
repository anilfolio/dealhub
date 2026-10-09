"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Car,
  Gavel,
  Heart,
  FileText,
  User,
  LayoutDashboard,
  Users,
  Clock,
  Sparkles,
  Command,
  ArrowRight,
  CornerDownLeft,
} from 'lucide-react';
import { getAllVehicles, getVehiclePhoto, isCarVehicle } from '@/lib/dealerStore';
import { HeiwaVehicle, calculateLandedCost, getVehicleListingType } from '@/lib/heiwaData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  type: 'page';
  title: string;
  subtitle: string;
  href: string;
  icon: React.ElementType;
  category: 'Pages';
}

interface VehicleItem {
  id: string;
  type: 'vehicle';
  vehicle: HeiwaVehicle;
  category: 'Vehicles';
}

type SearchResultItem = NavItem | VehicleItem;

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Available primary navigation routes
  const navItems: NavItem[] = useMemo(() => [
    {
      id: 'page-browse',
      type: 'page',
      title: 'Browse Vehicles',
      subtitle: 'Explore live Japan auction stock and fixed reserve cars',
      href: '/browse-vehicles',
      icon: Car,
      category: 'Pages',
    },
    {
      id: 'page-wishlist-matches',
      type: 'page',
      title: 'Wishlist Matches',
      subtitle: 'Live matching inventory based on your dealer criteria',
      href: '/browse-vehicles?tab=wishlist',
      icon: Heart,
      category: 'Pages',
    },
    {
      id: 'page-bids',
      type: 'page',
      title: 'My Bids',
      subtitle: 'Active proxy bids, leading status and auction lots',
      href: '/my-bids',
      icon: Gavel,
      category: 'Pages',
    },
    {
      id: 'page-watchlist',
      type: 'page',
      title: 'Saved Watchlist',
      subtitle: 'Bookmarked vehicles and tracked auction lots',
      href: '/watchlist',
      icon: Heart,
      category: 'Pages',
    },
    {
      id: 'page-purchases',
      type: 'page',
      title: 'Purchases & Logistics',
      subtitle: '5-stage RoRo transit and Port of Auckland pipeline',
      href: '/purchases',
      icon: FileText,
      category: 'Pages',
    },
    {
      id: 'page-profile',
      type: 'page',
      title: 'Dealer Sourcing Profile',
      subtitle: 'Account details, registered trader number and settings',
      href: '/profile',
      icon: User,
      category: 'Pages',
    },
    {
      id: 'page-admin-overview',
      type: 'page',
      title: 'Admin Command Center',
      subtitle: 'Heiwa auction supply and demand matching overview',
      href: '/admin',
      icon: LayoutDashboard,
      category: 'Pages',
    },
    {
      id: 'page-admin-vehicles',
      type: 'page',
      title: 'Admin Lots Inventory',
      subtitle: 'Detailed FOB pricing, margins and inventory management',
      href: '/admin/vehicles',
      icon: Car,
      category: 'Pages',
    },
    {
      id: 'page-admin-dealers',
      type: 'page',
      title: 'Dealers Network',
      subtitle: 'NZ registered motor trader sourcing profiles',
      href: '/admin/dealers',
      icon: Users,
      category: 'Pages',
    },
    {
      id: 'page-admin-wishlists',
      type: 'page',
      title: 'Dealer Wish Lists',
      subtitle: 'Monitor dealer target criteria and notify lots',
      href: '/admin/wishlists',
      icon: Sparkles,
      category: 'Pages',
    },
  ], []);

  // Popular quick search chips
  const quickFilters = ['Toyota', 'Aqua', 'Prius', 'Honda', 'Nissan', 'Hybrid', 'Reserve'];

  // All cars cached for search
  const allCars = useMemo(() => {
    return getAllVehicles().filter(isCarVehicle);
  }, [isOpen]);

  // Filtered results based on search query
  const filteredResults: SearchResultItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // Match pages
    const matchedPages = navItems.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q)
    );

    // Match vehicles (make, model, year, chassis, stockId, color)
    const matchedCars = allCars.filter((v) => {
      const make = v.make.toLowerCase();
      const model = v.model.toLowerCase();
      const year = v.year.toString();
      const chassis = v.chassis.toLowerCase();
      const stockId = v.stockId.toLowerCase();
      const fuel = v.fuelType === 'H' ? 'hybrid' : v.fuelType === 'E' ? 'electric' : 'petrol';
      return (
        make.includes(q) ||
        model.includes(q) ||
        `${year} ${make} ${model}`.toLowerCase().includes(q) ||
        year.includes(q) ||
        chassis.includes(q) ||
        stockId.includes(q) ||
        fuel.includes(q)
      );
    }).slice(0, 8); // Top 8 vehicle matches

    const vehicleItems: VehicleItem[] = matchedCars.map((v) => ({
      id: `v-${v.stockId}-${v.chassis}`,
      type: 'vehicle',
      vehicle: v,
      category: 'Vehicles',
    }));

    return [...matchedPages, ...vehicleItems];
  }, [query, navItems, allCars]);

  // Reset or adjust selection index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input on open and lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Global keyboard shortcut (Ctrl+K, Meta+K, or Slash key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(); // toggle or open
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Modal-specific navigation keys
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (filteredResults.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        e.preventDefault();
        onClose();
        router.push(`/browse-vehicles?search=${encodeURIComponent(query.trim())}`);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredResults[selectedIndex];
      if (current) {
        handleSelectItem(current);
      } else if (query.trim()) {
        onClose();
        router.push(`/browse-vehicles?search=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    onClose();
    if (item.type === 'page') {
      router.push(item.href);
    } else {
      const listingType = getVehicleListingType(item.vehicle);
      router.push(`/vehicles/${encodeURIComponent(item.vehicle.chassis)}?type=${listingType}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
      >
        {/* ─── Search Input Header Bar ─── */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search size={20} className="text-[#94A3B8] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search make, model, stock ID, chassis, or jump to page..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#111827] placeholder:text-[#94A3B8] outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#94A3B8] hover:text-[#111827] rounded-lg hover:bg-slate-200/60 transition-colors mr-1 cursor-pointer"
              title="Clear search"
            >
              <X size={16} />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold text-[#64748B] bg-slate-200/70 hover:bg-slate-300 rounded border border-slate-300 transition-colors cursor-pointer"
            title="Press Esc to close"
          >
            ESC
          </button>
          <button
            onClick={onClose}
            className="sm:hidden p-1 text-[#64748B] hover:text-[#111827] rounded-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── Scrollable Dialog Content ─── */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {/* Quick Filters / Empty State */}
          {!query.trim() ? (
            <div className="space-y-4 py-1">
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-2">
                  Popular Searches
                </span>
                <div className="flex flex-wrap items-center gap-1.5 mt-2 px-1">
                  {quickFilters.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#111827] rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Search size={12} className="text-[#94A3B8]" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-2">
                  Quick Navigation
                </span>
                <div className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200/80 overflow-hidden bg-white">
                  {navItems.slice(0, 6).map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#1E3A5F] flex items-center justify-center shrink-0 group-hover:bg-[#E11D48]/10 group-hover:text-[#E11D48] transition-colors">
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-[#111827] truncate">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-[#64748B] truncate">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-[#CBD5E1] group-hover:text-[#111827] transition-colors shrink-0 ml-2" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            /* No Results Found */
            <div className="py-12 text-center">
              <Car size={36} className="mx-auto text-slate-300 mb-2" />
              <div className="text-sm font-bold text-[#111827]">
                No direct matches found for &quot;{query}&quot;
              </div>
              <p className="text-xs text-[#64748B] mt-1 mb-4">
                Press Enter to run a full inventory search across all Heiwa auction lots.
              </p>
              <button
                onClick={() => {
                  onClose();
                  router.push(`/browse-vehicles?search=${encodeURIComponent(query.trim())}`);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <span>Search All Stock for &quot;{query}&quot;</span>
                <CornerDownLeft size={13} />
              </button>
            </div>
          ) : (
            /* Results List */
            <div className="space-y-1">
              {filteredResults.map((item, index) => {
                const isSelected = index === selectedIndex;

                if (item.type === 'page') {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50/70 border border-rose-200 text-[#111827]'
                          : 'hover:bg-slate-50 text-[#111827] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#E11D48] text-white' : 'bg-slate-100 text-[#1E3A5F]'
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#64748B] truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-[#64748B] shrink-0 ml-2">
                        Page
                      </span>
                    </button>
                  );
                }

                // Vehicle Item
                const v = item.vehicle;
                const photo = getVehiclePhoto(v);
                const landed = calculateLandedCost(v.priceFob);
                const listingType = getVehicleListingType(v);
                const isReserve = listingType === 'reserve';

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50/70 border border-rose-200'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={photo}
                        alt={`${v.year} ${v.make} ${v.model}`}
                        className="w-14 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-extrabold text-[#111827] truncate">
                            {v.year} {v.make} {v.model}
                          </span>
                          {isReserve ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-emerald-100 text-emerald-800">
                              <Clock size={9} />
                              Reserve
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-blue-100 text-blue-800">
                              <Gavel size={9} />
                              Auction
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#64748B] truncate font-mono mt-0.5">
                          Stock #{v.stockId} · {v.chassis} · {v.kms.toLocaleString()} km
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Landed NZD</div>
                      <div className="text-xs sm:text-sm font-extrabold text-[#111827] font-mono">
                        NZ${landed.totalLanded.toLocaleString()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Footer Controls & Hints ─── */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-[#64748B]">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-semibold text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-semibold text-[10px]">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-semibold text-[10px]">↵</kbd>
              <span>select</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-semibold text-[10px]">esc</kbd>
              <span>close</span>
            </span>
          </div>

          {query.trim() && (
            <button
              onClick={() => {
                onClose();
                router.push(`/browse-vehicles?search=${encodeURIComponent(query.trim())}`);
              }}
              className="text-[#E11D48] hover:underline font-bold"
            >
              Search all stock →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
