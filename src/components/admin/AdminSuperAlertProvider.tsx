'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import Link from 'next/link';
import {
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Printer,
  Phone,
  MapPin,
  MessageCircle,
  Package,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types/database';
import WhatsAppOutreachModal from '@/components/admin/WhatsAppOutreachModal';
import { supabase } from '@/lib/supabase/client';

interface AdminAlertContextType {
  pendingCount: number;
  recentOrders: Order[];
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  triggerTestAlert: () => void;
  superAlertOrder: Order | null;
  dismissSuperAlert: () => void;
  openWhatsAppModal: (order: Order) => void;
  refreshNotices: () => Promise<void>;
  desktopPerm: NotificationPermission;
  requestDesktopPermission: () => Promise<void>;
}

const AdminAlertContext = createContext<AdminAlertContextType | null>(null);

export function useAdminAlert() {
  const ctx = useContext(AdminAlertContext);
  if (!ctx) {
    throw new Error('useAdminAlert must be used within an AdminSuperAlertProvider');
  }
  return ctx;
}

export default function AdminSuperAlertProvider({ children }: { children: React.ReactNode }) {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [desktopPerm, setDesktopPerm] = useState<NotificationPermission>('default');

  // Super Alert State (Modal + Visual Alarm)
  const [superAlertOrder, setSuperAlertOrder] = useState<Order | null>(null);

  // WhatsApp Outreach Modal state
  const [whatsAppOrder, setWhatsAppOrder] = useState<Order | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  const prevCountRef = useRef<number>(-1);
  const seenOrderIdsRef = useRef<Set<string>>(new Set());
  const soundCooldownRef = useRef<number>(0);

  // Load sound preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem('as_admin_sound_enabled');
      if (savedSound !== null) {
        setSoundEnabled(savedSound === 'true');
      }
      if ('Notification' in window) {
        setDesktopPerm(Notification.permission);
      }
    }
  }, []);

  const handleSetSoundEnabled = (val: boolean) => {
    setSoundEnabled(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('as_admin_sound_enabled', String(val));
    }
  };

  // Unlock AudioContext on initial admin interaction
  useEffect(() => {
    const unlockAudio = () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const dummy = new AudioCtx();
          dummy.resume().then(() => dummy.close()).catch(() => {});
        }
      } catch (_) {}
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Request browser desktop push permission
  const requestDesktopPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setDesktopPerm(perm);
      } catch (_) {}
    }
  };

  // Synthesize Loud, Celebratory Cash-Register / Fanfare Super Alert Sound
  const playSuperAlertChime = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;

    // Prevent audio overlap within 1 second
    const now = Date.now();
    if (now - soundCooldownRef.current < 1000) return;
    soundCooldownRef.current = now;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Melodic notes sequence: Fast ascending arpeggio + double celebratory bell
      const notes = [
        { freq: 523.25, time: 0.0, duration: 0.12, gain: 0.4 },    // C5
        { freq: 659.25, time: 0.1, duration: 0.12, gain: 0.45 },   // E5
        { freq: 783.99, time: 0.2, duration: 0.14, gain: 0.5 },    // G5
        { freq: 1046.5, time: 0.32, duration: 0.35, gain: 0.65 },  // C6
        { freq: 880.0, time: 0.65, duration: 0.18, gain: 0.55 },   // A5
        { freq: 1318.51, time: 0.8, duration: 0.55, gain: 0.7 },   // E6 bell
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3800, ctx.currentTime);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + n.time);
        gain.gain.exponentialRampToValueAtTime(n.gain, ctx.currentTime + n.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + n.time);
        osc.stop(ctx.currentTime + n.time + n.duration);
      });

      // Shimmering overtone chime for unmistakable presence
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(1760, ctx.currentTime + 0.8);
      shimmerGain.gain.setValueAtTime(0.001, ctx.currentTime + 0.8);
      shimmerGain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.82);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

      shimmer.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);
      shimmer.start(ctx.currentTime + 0.8);
      shimmer.stop(ctx.currentTime + 1.4);
    } catch (e) {
      console.warn('Audio play notice:', e);
    }
  }, [soundEnabled]);

  // Trigger Full Super Alert
  const triggerSuperAlert = useCallback((order: Order) => {
    setSuperAlertOrder(order);

    // 1. Play sound immediately
    playSuperAlertChime();

    // 2. Browser Desktop Push Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const orderNum = order.order_number || `AS-${order.id.slice(0, 6).toUpperCase()}`;
        const notif = new Notification(`🚨 NEW ORDER #${orderNum} (${formatPrice(order.total_amount)})`, {
          body: `${order.customer_name} from ${order.city || 'Pakistan'} just ordered!\nClick to confirm on WhatsApp.`,
          icon: '/images/as-store-logo.png',
          tag: order.id,
        });
        notif.onclick = () => {
          window.focus();
          setWhatsAppOrder(order);
          setIsWhatsAppModalOpen(true);
        };
      } catch (_) {}
    }
  }, [playSuperAlertChime]);

  // Dismiss / Silence Super Alert
  const dismissSuperAlert = useCallback(() => {
    setSuperAlertOrder(null);
  }, []);

  // Flash Document Title when Super Alert is active
  useEffect(() => {
    if (!superAlertOrder) return;
    const originalTitle = document.title;
    let toggle = false;

    const interval = setInterval(() => {
      toggle = !toggle;
      const orderNum = superAlertOrder.order_number || `AS-${superAlertOrder.id.slice(0, 6)}`;
      document.title = toggle
        ? `🚨 (NEW ORDER) ${formatPrice(superAlertOrder.total_amount)} - ${orderNum}`
        : `⚡ AS GADGETS ADMIN SUITE`;
    }, 850);

    return () => {
      clearInterval(interval);
      document.title = originalTitle;
    };
  }, [superAlertOrder]);

  // Polling fetch for notices
  const fetchNotices = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const newCount = data.pendingCount || 0;
        const fetchedOrders: Order[] = data.latestOrders || [];

        // Check if there is a newly arrived order
        if (fetchedOrders.length > 0) {
          const newest = fetchedOrders[0];

          // If this is not the initial load and we haven't seen this order ID yet
          if (prevCountRef.current !== -1 && !seenOrderIdsRef.current.has(newest.id)) {
            triggerSuperAlert(newest);
          }

          // Populate seen cache
          fetchedOrders.forEach((o) => seenOrderIdsRef.current.add(o.id));
        }

        prevCountRef.current = newCount;
        setPendingCount(newCount);
        setRecentOrders(fetchedOrders);
      }
    } catch (_) {}
  }, [triggerSuperAlert]);

  // Initial load + Realtime Supabase Channel + Polling Fallback
  useEffect(() => {
    fetchNotices();

    // Supabase Realtime for <1s instant trigger
    const channel = supabase
      .channel('admin-orders-realtime-global')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const freshOrder = payload.new as Order;
          if (freshOrder && freshOrder.id) {
            seenOrderIdsRef.current.add(freshOrder.id);
            triggerSuperAlert(freshOrder);
            fetchNotices();
          }
        }
      )
      .subscribe();

    // Polling every 7 seconds for bulletproof reliability
    const interval = setInterval(fetchNotices, 7000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchNotices, triggerSuperAlert]);

  const openWhatsAppModal = useCallback((order: Order) => {
    setWhatsAppOrder(order);
    setIsWhatsAppModalOpen(true);
    setSuperAlertOrder(null);
  }, []);

  // Test Super Alert Generator
  const triggerTestAlert = useCallback(() => {
    const mockOrder: Order = {
      id: `test-${Date.now()}`,
      order_number: `AS-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      customer_id: null,
      customer_name: 'Muhammad Abdullah (Test Buyer)',
      phone: '03201042634',
      city: 'Lahore',
      address: 'Shop 14, Hafeez Centre, Main Boulevard, Gulberg III',
      subtotal: 9999,
      delivery_charges: 0,
      coupon_discount: 0,
      bundle_discount: 0,
      total_amount: 9999,
      payment_status: 'pending',
      payment_method: 'Cash on Delivery',
      order_source: 'web',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      admin_notes: 'Test Alert Generation',
      order_items: [
        {
          id: 'item-1',
          order_id: 'test-1',
          product_id: null,
          product_name: 'J-Cell J-143 50,000mAh Power Bank (Super Fast)',
          variant_name: 'Cyber Black',
          unit_price: 9999,
          quantity: 1,
          line_total: 9999,
          created_at: new Date().toISOString(),
        },
      ],
    };

    triggerSuperAlert(mockOrder);
  }, [triggerSuperAlert]);

  return (
    <AdminAlertContext.Provider
      value={{
        pendingCount,
        recentOrders,
        soundEnabled,
        setSoundEnabled: handleSetSoundEnabled,
        triggerTestAlert,
        superAlertOrder,
        dismissSuperAlert,
        openWhatsAppModal,
        refreshNotices: fetchNotices,
        desktopPerm,
        requestDesktopPermission,
      }}
    >
      {children}

      {/* =========================================================================
          🔥 SUPER ALERT MODAL (UNMISSABLE EXECUTIVE OVERLAY WHEN ORDER ARRIVES)
          ========================================================================= */}
      {superAlertOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-14 p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#070D1E] text-white rounded-3xl border-2 border-rose-500 shadow-[0_0_60px_rgba(244,63,94,0.45)] ring-4 ring-rose-500/20 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Top Flashing Urgent Header Banner */}
            <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
                </span>
                <div>
                  <h3 className="font-display font-black text-sm tracking-wider uppercase">
                    🚨 SUPER ALERT: NEW ORDER RECEIVED!
                  </h3>
                  <span className="text-[10px] text-white/90 font-bold block">
                    Real-time storefront checkout captured
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Replay chime */}
                <button
                  type="button"
                  onClick={playSuperAlertChime}
                  className="px-2 py-1 rounded-lg bg-black/30 hover:bg-black/50 text-white font-bold text-[10px] flex items-center gap-1 transition"
                  title="Re-play chime"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Replay</span>
                </button>
                <button
                  type="button"
                  onClick={dismissSuperAlert}
                  className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition"
                  title="Close Alert"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Order Amount & Reference Highlight */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Grand Total
                  </span>
                  <div className="font-display text-2xl sm:text-3xl font-black text-[#06B6D4] mt-0.5">
                    {formatPrice(superAlertOrder.total_amount)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider">
                    {superAlertOrder.payment_method || 'Cash on Delivery'}
                  </span>
                  <div className="font-mono text-xs font-bold text-slate-300 mt-1">
                    #{superAlertOrder.order_number || `AS-${superAlertOrder.id.slice(0, 8).toUpperCase()}`}
                  </div>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="p-4 rounded-2xl bg-[#0B152E] border border-cyan-900/40 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-slate-300">Customer Details:</span>
                  <span className="text-[11px] text-cyan-400 font-semibold">
                    {new Date(superAlertOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Buyer Name</span>
                    <div className="font-bold text-white text-sm truncate">{superAlertOrder.customer_name}</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Phone Contact</span>
                    <div className="font-mono font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{superAlertOrder.phone}</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Destination Address</span>
                    <div className="text-slate-200 font-medium flex items-start gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>{superAlertOrder.city}</strong> — {superAlertOrder.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ordered Items Preview */}
              {superAlertOrder.order_items && superAlertOrder.order_items.length > 0 && (
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
                    Items In Consignment ({superAlertOrder.order_items.length}):
                  </span>
                  <div className="max-h-28 overflow-y-auto divide-y divide-slate-800/60">
                    {superAlertOrder.order_items.map((item, idx) => (
                      <div key={item.id || idx} className="py-1.5 px-1 flex items-center justify-between text-xs">
                        <div className="truncate pr-2">
                          <span className="font-bold text-white">
                            {item.quantity}x {item.product_name}
                          </span>
                          {item.variant_name && (
                            <span className="text-[10px] text-slate-400 ml-1.5">({item.variant_name})</span>
                          )}
                        </div>
                        <span className="font-mono text-cyan-300 font-bold shrink-0">
                          {formatPrice(item.line_total)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* High-Impact Actions */}
              <div className="space-y-2 pt-1">
                {/* 1-Click WhatsApp Confirmation (Primary Highlight) */}
                <button
                  type="button"
                  onClick={() => openWhatsAppModal(superAlertOrder)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm transition shadow-lg shadow-emerald-950/40 hover:scale-102 active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-white" />
                  <span>Confirm Buyer on WhatsApp (1-Click)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {/* Print Packing Slip */}
                  <Link
                    href={`/admin/orders/${superAlertOrder.id}/slip`}
                    target="_blank"
                    onClick={dismissSuperAlert}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 text-center"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>Print Slip</span>
                  </Link>

                  {/* Acknowledge & Dismiss */}
                  <button
                    type="button"
                    onClick={dismissSuperAlert}
                    className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition border border-slate-700 cursor-pointer"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Outreach Modal */}
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
    </AdminAlertContext.Provider>
  );
}
