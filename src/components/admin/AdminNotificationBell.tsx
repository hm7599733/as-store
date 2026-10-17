'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, ShoppingBag, Clock, Volume2, VolumeX, CheckCircle, ExternalLink } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderNotice {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  city: string;
}

export default function AdminNotificationBell() {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<OrderNotice[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
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
        if (newCount > prevCountRef.current && prevCountRef.current !== 0) {
          playChime();
        }
        prevCountRef.current = newCount;
        setPendingCount(newCount);
        setRecentOrders(data.latestOrders || []);
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

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
        title="Order Notifications"
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
              <span className="font-bold text-xs text-slate-900">Notifications</span>
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
                return (
                  <Link
                    key={ord.id}
                    href="/admin/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="block p-3 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {ord.customer_name}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                            isPending ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {ord.city} • <strong className="text-slate-800">{formatPrice(ord.total_amount)}</strong>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {ord.order_number || ord.id.slice(0, 6)}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-center">
            <Link
              href="/admin/orders"
              onClick={() => setDropdownOpen(false)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
            >
              Go to Order Management →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
