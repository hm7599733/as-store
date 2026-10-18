'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  Send,
  Copy,
  Check,
  ExternalLink,
  Truck,
  PackageCheck,
  MapPin,
  PhoneMissed,
  Star,
  Gift,
  AlertCircle,
  Sparkles,
  Phone,
  RefreshCw,
} from 'lucide-react';
import {
  createWhatsAppUrl,
  generateTemplateMessage,
  COURIER_PARTNERS,
  WHATSAPP_TEMPLATES,
  WhatsAppTemplateId,
  normalizePakistaniPhone,
  OFFICIAL_STORE_PHONE,
} from '@/lib/whatsapp';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types/database';

interface WhatsAppOutreachModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: () => void;
  defaultTemplate?: WhatsAppTemplateId;
}

export default function WhatsAppOutreachModal({
  order,
  isOpen,
  onClose,
  onOrderUpdated,
  defaultTemplate = 'order_confirmation',
}: WhatsAppOutreachModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplateId>(defaultTemplate);
  const [courierName, setCourierName] = useState<string>('Trax Logistics');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [updateStatusToShipped, setUpdateStatusToShipped] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-detect best initial template based on order status when opened
  useEffect(() => {
    if (order && isOpen) {
      let initialTemplate: WhatsAppTemplateId = defaultTemplate;
      if (order.status === 'pending') {
        initialTemplate = 'order_confirmation';
      } else if (order.status === 'approved' || order.status === 'shipped') {
        initialTemplate = 'order_dispatched';
      } else if (order.status === 'delivered') {
        initialTemplate = 'delivered_feedback';
      }
      setSelectedTemplate(initialTemplate);

      // Pre-fill tracking if already present
      if (order.tracking_number) {
        setTrackingNumber(order.tracking_number);
      } else {
        setTrackingNumber('');
      }

      if (order.courier_name) {
        setCourierName(order.courier_name);
      }
    }
  }, [order, isOpen, defaultTemplate]);

  // Regenerate message when template, order, courier, or tracking number changes
  useEffect(() => {
    if (!order) return;

    const displayId = order.order_number || `AS-${order.id.slice(0, 8).toUpperCase()}`;
    const generated = generateTemplateMessage(selectedTemplate, {
      orderNumber: displayId,
      orderId: order.id,
      customerName: order.customer_name,
      phone: order.phone,
      city: order.city,
      address: order.address,
      totalAmount: order.total_amount,
      items: order.order_items || [],
      courierName: courierName,
      trackingNumber: trackingNumber,
    });

    setCustomMessage(generated);
  }, [order, selectedTemplate, courierName, trackingNumber]);

  if (!isOpen || !order) return null;

  const displayId = order.order_number || `AS-${order.id.slice(0, 8).toUpperCase()}`;
  const cleanPhone = normalizePakistaniPhone(order.phone);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(customMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleSendWhatsApp = async () => {
    // If dispatched template with tracking is chosen and update checkbox is checked
    if (selectedTemplate === 'order_dispatched' && updateStatusToShipped && trackingNumber.trim()) {
      setIsUpdatingOrder(true);
      try {
        const res = await fetch(`/api/admin/orders/${order.id}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'shipped',
            tracking_number: trackingNumber.trim(),
            courier_name: courierName,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          console.warn('Order status update warning:', data);
        } else {
          setFeedbackMsg({ type: 'success', text: 'Order marked as SHIPPED & tracking saved!' });
          if (onOrderUpdated) onOrderUpdated();
        }
      } catch (err: any) {
        console.error('Failed to update order tracking', err);
      } finally {
        setIsUpdatingOrder(false);
      }
    }

    // Launch WhatsApp Web / App
    const url = createWhatsAppUrl(order.phone, customMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
              <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-500/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-slate-900 text-sm sm:text-base leading-tight">
                  WhatsApp Customer Outreach
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Direct Channel
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pakistan COD optimized message templates with 1-click launch.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Order Snapshot Strip */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Recipient Customer
              </span>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2 mt-0.5">
                <span>{order.customer_name}</span>
                <span className="font-mono text-xs font-normal text-slate-500">({order.phone})</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Order Reference
                </span>
                <span className="font-mono font-bold text-cyan-700">{displayId}</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  COD Amount
                </span>
                <span className="font-bold text-slate-900">{formatPrice(order.total_amount)}</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  City
                </span>
                <span className="font-bold text-slate-700">{order.city || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Template Selection Pills */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
              Select Message Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WHATSAPP_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`flex items-start gap-2 p-2.5 rounded-xl text-left border transition text-xs ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20 text-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tmpl.id === 'order_confirmation' && <PackageCheck className="w-3.5 h-3.5" />}
                      {tmpl.id === 'order_dispatched' && <Truck className="w-3.5 h-3.5" />}
                      {tmpl.id === 'address_request' && <MapPin className="w-3.5 h-3.5" />}
                      {tmpl.id === 'missed_call' && <PhoneMissed className="w-3.5 h-3.5" />}
                      {tmpl.id === 'delivered_feedback' && <Star className="w-3.5 h-3.5" />}
                      {tmpl.id === 'vip_promo' && <Gift className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-[11px] leading-tight truncate">{tmpl.title}</div>
                      <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">{tmpl.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Courier & Tracking CN Details (Shown when Dispatch template is active) */}
          {selectedTemplate === 'order_dispatched' && (
            <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-700" />
                <span className="text-xs font-bold text-cyan-900">Courier Dispatch Logistics</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Courier Partner
                  </label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                  >
                    {COURIER_PARTNERS.map((cp) => (
                      <option key={cp.id} value={cp.name}>
                        {cp.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Tracking / CN Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. 77391823901 or TR-998"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>

              {order.status !== 'shipped' && (
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={updateStatusToShipped}
                    onChange={(e) => setUpdateStatusToShipped(e.target.checked)}
                    className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                  />
                  <span>
                    Auto-mark order status as <strong className="text-cyan-700">SHIPPED</strong> and save tracking
                    details in database when opening WhatsApp.
                  </span>
                </label>
              )}
            </div>
          )}

          {/* Live Message Preview & Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span>Message Preview & Editor</span>
                <span className="text-[10px] font-normal lowercase text-slate-400">(live editable)</span>
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md hover:bg-slate-200 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={8}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full p-3.5 text-xs font-sans rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-2xs leading-relaxed"
              placeholder="Write your WhatsApp message here..."
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span>Variables pre-filled from customer order. You can edit freely before launching.</span>
              <span>{customMessage.length} characters</span>
            </div>
          </div>

          {feedbackMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Target: <strong className="font-mono text-slate-700">+{cleanPhone}</strong></span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              disabled={isUpdatingOrder}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isUpdatingOrder ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <MessageCircle className="w-4 h-4 fill-white text-white" />
              )}
              <span>Launch WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
