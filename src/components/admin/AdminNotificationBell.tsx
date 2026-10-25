'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Volume2,
  VolumeX,
  MessageCircle,
  Sparkles,
  Package,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types/database';
import { useAdminAlert } from './AdminSuperAlertProvider';

export default function AdminNotificationBell() {
  const {
    pendingCount,
    recentOrders,
    soundEnabled,
    setSoundEnabled,
    triggerTestAlert,
    openWhatsAppModal,
    desktopPerm,
    requestDesktopPermission,
  } = useAdminAlert();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenWhatsApp = (order: Order, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setDropdownOpen(false);
    openWhatsAppModal(order);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`relative p-2.5 rounded-xl transition ${
          pendingCount > 0
            ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 ring-2 ring-rose-500/20'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title="Order Notifications & Super Alerts"
        aria-label="Order Notifications"
      >
        <Bell className={`w-5 h-5 ${pendingCount > 0 ? 'animate-bounce text-rose-600' : ''}`} />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-black shadow-md animate-pulse">
            {pendingCount > 99 ? '99+' : pendingCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-900 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-[#06B6D4] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white leading-tight">Order Alerts & Notices</h4>
                  <span className="text-[10px] text-slate-400">Live order stream</span>
                </div>
              </div>

              {/* Sound Mute Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-lg border transition ${
                  soundEnabled
                    ? 'bg-cyan-950/80 border-cyan-800 text-cyan-400'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                title={soundEnabled ? 'Alert audio is ON' : 'Alert audio is MUTED'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Status pill & Desktop Push request */}
            <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-300 font-semibold">
                  {pendingCount} Pending Fulfillment
                </span>
              </div>

              {desktopPerm !== 'granted' && (
                <button
                  type="button"
                  onClick={requestDesktopPermission}
                  className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 underline"
                >
                  Enable Desktop Push
                </button>
              )}
            </div>
          </div>

          {/* Test Alert Action Banner */}
          <div className="px-4 py-2.5 bg-cyan-950/40 border-b border-cyan-900/30 flex items-center justify-between">
            <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Super Alert Simulation</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                triggerTestAlert();
              }}
              className="px-2.5 py-1 rounded-lg bg-[#06B6D4] hover:bg-cyan-400 text-slate-950 font-black text-[10px] transition shadow-xs hover:scale-105 active:scale-95"
            >
              Test Sound & Alert
            </button>
          </div>

          {/* List of recent orders */}
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <span>No orders recorded yet.</span>
              </div>
            ) : (
              recentOrders.map((ord) => {
                const isPending = ord.status === 'pending';
                const displayId = ord.order_number || `AS-${ord.id.slice(0, 6).toUpperCase()}`;

                return (
                  <div
                    key={ord.id}
                    className="p-3.5 hover:bg-slate-50 transition flex items-center justify-between gap-2.5"
                  >
                    <Link
                      href="/admin/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="min-w-0 flex-1 space-y-0.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {ord.customer_name}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase shrink-0 ${
                            isPending ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {ord.city || 'Pakistan'} •{' '}
                        <strong className="text-slate-800">{formatPrice(ord.total_amount)}</strong>
                        <span className="text-[10px] text-slate-400 font-mono ml-2">({displayId})</span>
                      </div>
                    </Link>

                    {/* Instant WhatsApp Action Button on Order */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenWhatsApp(ord, e)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-bold transition shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                      title="Open WhatsApp Outreach Modal"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
            <Link
              href="/admin/orders"
              onClick={() => setDropdownOpen(false)}
              className="font-bold text-cyan-700 hover:underline flex items-center gap-1"
            >
              <span>Orders Fulfillment</span>
              <span>→</span>
            </Link>
            <Link
              href="/admin/whatsapp"
              onClick={() => setDropdownOpen(false)}
              className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3 text-emerald-600" />
              <span>WhatsApp Hub</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
