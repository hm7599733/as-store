'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bell,
  ShoppingBag,
  Clock,
  Volume2,
  VolumeX,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types/database';
import WhatsAppOutreachModal from '@/components/admin/WhatsAppOutreachModal';

export default function AdminNotificationBell() {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Real-time toast state for new order alert
  const [toastOrder, setToastOrder] = useState<Order | null>(null);

  // WhatsApp Modal state
  const [whatsAppOrder, setWhatsAppOrder] = useState<Order | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  const prevCountRef = useRef<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Synthesize Web Audio chime
  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        const newCount = data.pendingCount || 0;
        const fetchedOrders: Order[] = data.latestOrders || [];

        if (newCount > prevCountRef.current && prevCountRef.current !== 0) {
          playChime();
          // Trigger floating new order toast with the newest order
          if (fetchedOrders.length > 0) {
            setToastOrder(fetchedOrders[0]);
          }
        }
        prevCountRef.current = newCount;
        setPendingCount(newCount);
        setRecentOrders(fetchedOrders);
      }
    } catch (err) {
      // Background poll silently fails
    }
  };

  useEffect(() => {
    fetchNotices();
    const interval = setInterval(fetchNotices, 15000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Auto-dismiss toast after 15 seconds
  useEffect(() => {
    if (toastOrder) {
      const timer = setTimeout(() => {
        setToastOrder(null);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [toastOrder]);

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

  const handleOpenWhatsAppFromNotification = (order: Order, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setWhatsAppOrder(order);
    setIsWhatsAppModalOpen(true);
    setDropdownOpen(false);
    setToastOrder(null);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          title="Order Notifications & WhatsApp Alerts"
          aria-label="Order Notifications"
        >
          <Bell className="w-5 h-5" />
          {pendingCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-black shadow-sm animate-pulse">
              {pendingCount > 99 ? '99+' : pendingCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">Order Alerts & WhatsApp</span>
                {pendingCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                    {pendingCount} Pending
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                    All Clear
                  </span>
                )}
              </div>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-slate-500 hover:text-slate-800 transition"
                title={soundEnabled ? 'Mute alert sounds' : 'Enable alert sounds'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            {/* List of orders */}
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No orders recorded yet.
                </div>
              ) : (
                recentOrders.map((ord) => {
                  const isPending = ord.status === 'pending';
                  const displayId = ord.order_number || `AS-${ord.id.slice(0, 6).toUpperCase()}`;

                  return (
                    <div
                      key={ord.id}
                      className="p-3 hover:bg-slate-50 transition flex items-center justify-between gap-2.5"
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
                        onClick={(e) => handleOpenWhatsAppFromNotification(ord, e)}
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
            <div className="p-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <Link
                href="/admin/orders"
                onClick={() => setDropdownOpen(false)}
                className="font-bold text-cyan-700 hover:underline"
              >
                Orders Fulfillment →
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

      {/* Real-time Floating Toast Alert When New Order Arrives */}
      {toastOrder && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-[#0B132B] text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/30 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  New Order Received!
                </span>
                <div className="font-bold text-sm text-white leading-tight">
                  {toastOrder.customer_name}
                </div>
              </div>
            </div>
            <button
              onClick={() => setToastOrder(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {toastOrder.city} • <strong className="text-white">{formatPrice(toastOrder.total_amount)}</strong> (COD)
            </span>
            <span className="font-mono text-[10px] text-cyan-400">
              {toastOrder.order_number || `AS-${toastOrder.id.slice(0, 6)}`}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => handleOpenWhatsAppFromNotification(toastOrder)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white text-white" />
              <span>Confirm on WhatsApp</span>
            </button>
            <Link
              href="/admin/orders"
              onClick={() => setToastOrder(null)}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              View Queue
            </Link>
          </div>
        </div>
      )}

      {/* Proper WhatsApp Outreach Modal */}
      <WhatsAppOutreachModal
        order={whatsAppOrder}
        isOpen={isWhatsAppModalOpen}
        onClose={() => {
          setIsWhatsAppModalOpen(false);
          setWhatsAppOrder(null);
        }}
        onOrderUpdated={fetchNotices}
        defaultTemplate="order_confirmation"
      />
    </>
  );
}
