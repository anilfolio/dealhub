"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  Gavel,
  Ship,
  Sparkles,
  TrendingUp,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useSyncStore, DealerNotification } from '@/lib/syncStore';

interface NotificationDropdownProps {
  role?: 'dealer' | 'admin';
}

export default function NotificationDropdown({ role = 'dealer' }: NotificationDropdownProps) {
  const router = useRouter();
  const { state: syncState, markNotificationAsRead } = useSyncStore();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = syncState.dealerNotifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const displayedNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAllAsRead = () => {
    notifications.forEach((n) => {
      if (!n.isRead) markNotificationAsRead(n.id);
    });
  };

  const handleItemClick = (n: DealerNotification) => {
    if (!n.isRead) {
      markNotificationAsRead(n.id);
    }
    setIsOpen(false);
    if (n.actionUrl) {
      router.push(n.actionUrl);
    }
  };

  const getNotificationIcon = (type: DealerNotification['type']) => {
    switch (type) {
      case 'bid_won':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} />
          </div>
        );
      case 'bid_outbid':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={16} />
          </div>
        );
      case 'bid_alert':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <Gavel size={16} />
          </div>
        );
      case 'logistics_update':
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Ship size={16} />
          </div>
        );
      case 'sourcing_match':
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
        );
      case 'fx_update':
        return (
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <TrendingUp size={16} />
          </div>
        );
      case 'reserve_approved':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} />
          </div>
        );
      case 'request_alert':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Bell size={16} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Bell size={16} />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative p-2 rounded-full transition-all cursor-pointer ${
          isOpen ? 'bg-slate-100 text-[#111827]' : 'text-[#4B5563] hover:text-[#111827] hover:bg-slate-100'
        }`}
        title={`Notifications (${unreadCount} unread)`}
        aria-label="Toggle notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 bg-[#E11D48] text-white text-[9.5px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[360px] sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#111827] tracking-tight">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <CheckCheck size={13} />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 bg-white text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filter === 'all' ? 'bg-[#0F1B2E] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filter === 'unread' ? 'bg-[#0F1B2E] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {displayedNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell size={28} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold">No notifications</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {filter === 'unread' ? 'You have read all your alerts!' : 'No activity logged yet.'}
                </p>
              </div>
            ) : (
              displayedNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                    !n.isRead ? 'bg-rose-50/30 hover:bg-rose-50/60' : 'bg-white hover:bg-slate-50/80'
                  }`}
                >
                  {getNotificationIcon(n.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-xs font-bold leading-snug line-clamp-1 ${
                          !n.isRead ? 'text-[#111827]' : 'text-slate-700'
                        }`}
                      >
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">{n.timestamp}</span>
                    </div>

                    <p className="text-[11.5px] text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                      {n.body}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between">
                      {n.actionUrl && (
                        <span className="text-[10.5px] font-bold text-rose-600 group-hover:underline flex items-center gap-1">
                          View details <ExternalLink size={10} />
                        </span>
                      )}
                      {!n.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] ml-auto shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Quick Links */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-medium">Live sync connected</span>
            {role === 'dealer' ? (
              <Link
                href="/my-bids"
                onClick={() => setIsOpen(false)}
                className="font-bold text-[#E11D48] hover:underline"
              >
                Go to My Bids →
              </Link>
            ) : (
              <Link
                href="/admin/requests"
                onClick={() => setIsOpen(false)}
                className="font-bold text-[#E11D48] hover:underline"
              >
                Go to Requests & Bids →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
