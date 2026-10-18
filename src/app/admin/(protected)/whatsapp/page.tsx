'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  PhoneCall,
  Search,
  Filter,
  RefreshCw,
  Send,
  Copy,
  Check,
  ExternalLink,
  PackageCheck,
  Truck,
  MapPin,
  PhoneMissed,
  Star,
  Gift,
  AlertCircle,
  Users,
  ChevronRight,
  Clock,
  Sparkles,
  Phone,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import {
  OFFICIAL_STORE_PHONE,
  OFFICIAL_STORE_PHONE_CLEAN,
  WHATSAPP_TEMPLATES,
  COURIER_PARTNERS,
  WhatsAppTemplateId,
  normalizePakistaniPhone,
  createWhatsAppUrl,
  generateTemplateMessage,
} from '@/lib/whatsapp';
import type { Order } from '@/types/database';
import WhatsAppOutreachModal from '@/components/admin/WhatsAppOutreachModal';

export default function AdminWhatsAppCenterPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSegment, setFilterSegment] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
  
  // Custom Phone Composer State
  const [composerPhone, setComposerPhone] = useState('');
  const [composerName, setComposerName] = useState('');
  const [composerTemplate, setComposerTemplate] = useState<WhatsAppTemplateId>('order_confirmation');
  const [composerMessage, setComposerMessage] = useState('');
  const [composerCopied, setComposerCopied] = useState(false);

  // Modal State for Orders
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data) {
        setOrders(data as Order[]);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update composer message when template or name changes
  useEffect(() => {
    const text = generateTemplateMessage(composerTemplate, {
      customerName: composerName || 'Valued Customer',
      phone: composerPhone,
      orderNumber: 'AS-SAMPLE',
      city: 'Pakistan',
      address: 'Delivery Address',
      totalAmount: 2999,
      items: [{ product_name: 'Premium Wireless Earbuds', quantity: 1 }],
      courierName: 'Trax Logistics',
      trackingNumber: 'TR-1029384',
    });
    setComposerMessage(text);
  }, [composerTemplate, composerName, composerPhone]);

  const handleOpenOutreachForOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleComposerLaunch = () => {
    if (!composerPhone.trim()) {
      alert('Please enter a valid Pakistani phone number (e.g. 03201042634).');
      return;
    }
    const url = createWhatsAppUrl(composerPhone, composerMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleComposerCopy = async () => {
    try {
      await navigator.clipboard.writeText(composerMessage);
      setComposerCopied(true);
      setTimeout(() => setComposerCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadTemplateIntoComposer = (templateId: WhatsAppTemplateId) => {
    setComposerTemplate(templateId);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const filteredOrders = orders.filter((order) => {
    if (filterSegment === 'pending' && order.status !== 'pending') return false;
    if (filterSegment === 'shipped' && order.status !== 'shipped') return false;
    if (filterSegment === 'delivered' && order.status !== 'delivered') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = order.customer_name?.toLowerCase().includes(q);
      const matchPhone = order.phone?.includes(q);
      const matchCity = order.city?.toLowerCase().includes(q);
      const matchNumber = order.order_number?.toLowerCase().includes(q);
      return matchName || matchPhone || matchCity || matchNumber;
    }
    return true;
  });

  const pendingVerificationCount = orders.filter((o) => o.status === 'pending').length;
  const readyToShipCount = orders.filter((o) => o.status === 'approved').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live WhatsApp Channel
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono text-slate-500">
              Official Helpline: <strong>{OFFICIAL_STORE_PHONE}</strong>
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>WhatsApp Customer Outreach Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Streamlined outreach desk for Pakistan COD orders: instant order verification, courier dispatch tracking notifications, address completion, and customer retention.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-auto">
          <a
            href={`https://wa.me/${OFFICIAL_STORE_PHONE_CLEAN}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition shadow-2xs hover:shadow-md active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white text-white" />
            <span>Open Store WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </a>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Orders</span>
          </button>
        </div>
      </div>

      {/* Metrics Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Pending COD Verification</span>
            <PackageCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-display text-2xl font-black text-amber-600">
            {pendingVerificationCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Requires confirmation message</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Ready for Dispatch</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="font-display text-2xl font-black text-blue-600">
            {readyToShipCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Ready for packing & courier CN#</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">In Courier Transit</span>
            <Truck className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="font-display text-2xl font-black text-cyan-600">
            {shippedCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Tracking dispatched to buyers</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Delivered & Satisfied</span>
            <Star className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-display text-2xl font-black text-emerald-600">
            {deliveredCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Eligible for 7-day warranty review</p>
        </div>
      </div>

      {/* Main Split: Quick Dial Composer + Template Bank */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Quick Dial & Custom Phone Composer (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display font-black text-slate-900 text-base">Quick WhatsApp Composer</h2>
                <p className="text-[11px] text-slate-400">Direct message any Pakistani number</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Direct Dial
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Recipient Phone Number (Pakistani Mobile)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={composerPhone}
                  onChange={(e) => setComposerPhone(e.target.value)}
                  placeholder="e.g. 03201042634 or +92 320 1042634"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              {composerPhone && (
                <span className="text-[10px] font-mono text-emerald-700 block mt-1">
                  Normalized: +{normalizePakistaniPhone(composerPhone)}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Customer Name (Optional)
              </label>
              <input
                type="text"
                value={composerName}
                onChange={(e) => setComposerName(e.target.value)}
                placeholder="e.g. Muhammad Ali"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Pre-load Template
              </label>
              <select
                value={composerTemplate}
                onChange={(e) => setComposerTemplate(e.target.value as WhatsAppTemplateId)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {WHATSAPP_TEMPLATES.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-600">
                  Message Content (Editable)
                </label>
                <button
                  type="button"
                  onClick={handleComposerCopy}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {composerCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{composerCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={7}
                value={composerMessage}
                onChange={(e) => setComposerMessage(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
              />
            </div>

            <button
              type="button"
              onClick={handleComposerLaunch}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition shadow-md active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-white text-white" />
              <span>Launch WhatsApp Chat</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </div>

        {/* Right: Pakistani E-Commerce Template Bank (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <h2 className="font-display font-black text-slate-900 text-base">Pakistani E-Commerce Template Bank</h2>
                <p className="text-[11px] text-slate-400">High-converting Roman Urdu / English scripts</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-100">
              6 Built-in Scripts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WHATSAPP_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col justify-between space-y-2.5"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                      {tmpl.id === 'order_confirmation' && <PackageCheck className="w-3 h-3 text-emerald-600" />}
                      {tmpl.id === 'order_dispatched' && <Truck className="w-3 h-3 text-cyan-600" />}
                      {tmpl.id === 'address_request' && <MapPin className="w-3 h-3 text-amber-600" />}
                      {tmpl.id === 'missed_call' && <PhoneMissed className="w-3 h-3 text-rose-600" />}
                      {tmpl.id === 'delivered_feedback' && <Star className="w-3 h-3 text-amber-500" />}
                      {tmpl.id === 'vip_promo' && <Gift className="w-3 h-3 text-purple-600" />}
                    </span>
                    <span className="font-bold text-xs text-slate-900 leading-snug">{tmpl.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{tmpl.description}</p>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => handleLoadTemplateIntoComposer(tmpl.id)}
                    className="flex-1 text-center py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                  >
                    Load into Composer
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const msg = generateTemplateMessage(tmpl.id, {
                        customerName: 'Valued Customer',
                        orderNumber: 'AS-SAMPLE',
                        city: 'Lahore',
                        address: 'Model Town, Block C',
                        totalAmount: 3499,
                        courierName: 'Trax Logistics',
                        trackingNumber: 'TRX-782190',
                      });
                      await navigator.clipboard.writeText(msg);
                      alert(`Copied "${tmpl.title}" script to clipboard!`);
                    }}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                    title="Copy Raw Script"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Courier Portals Quick Access */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Official Pakistan Courier Tracking Portals
              </span>
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COURIER_PARTNERS.slice(0, 6).map((courier) => (
                <a
                  key={courier.id}
                  href={courier.trackingUrl('')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-cyan-300 transition flex items-center gap-1 border border-slate-700"
                >
                  <span>{courier.name}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Orders Outreach Directory (Live Supabase Table) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden space-y-0">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <h2 className="font-display font-black text-slate-900 text-lg">Customer Outreach Directory</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any customer to launch pre-populated WhatsApp message with exact order details & tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, city..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 w-52 sm:w-64"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {/* Segment Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterSegment('all')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterSegment === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterSegment('pending')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterSegment === 'pending' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({pendingVerificationCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterSegment('shipped')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterSegment === 'shipped' ? 'bg-white text-cyan-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Shipped ({shippedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterSegment('delivered')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterSegment === 'delivered' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Delivered ({deliveredCount})
              </button>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading customer outreach contacts...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-1">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <div className="font-bold text-slate-700">No customers found</div>
            <p className="text-[11px]">Try adjusting your search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Customer Contact</th>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Order Value</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Instant Outreach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const displayId = order.order_number || `AS-${order.id.slice(0, 8).toUpperCase()}`;
                  const cleanPhone = normalizePakistaniPhone(order.phone);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition">
                      {/* Customer */}
                      <td className="p-4">
                        <div className="font-bold text-slate-900 text-sm">{order.customer_name}</div>
                        <a
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 hover:underline mt-0.5"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>{order.phone}</span>
                        </a>
                      </td>

                      {/* Order Ref & Items */}
                      <td className="p-4 font-mono">
                        <span className="font-bold text-slate-900">{displayId}</span>
                        <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                          {(order.order_items || []).length} item(s) •{' '}
                          {new Date(order.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </td>

                      {/* City */}
                      <td className="p-4">
                        <div className="font-medium text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-600 shrink-0" />
                          <span>{order.city || 'Pakistan'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                          {order.address}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="p-4 font-display font-black text-slate-900">
                        {formatPrice(order.total_amount)}
                        <span className="block text-[9px] font-sans font-normal text-slate-400">
                          {order.payment_method || 'COD'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'approved'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'shipped'
                              ? 'bg-cyan-100 text-cyan-800'
                              : order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.status === 'pending'
                                ? 'bg-amber-600'
                                : order.status === 'approved'
                                ? 'bg-blue-600'
                                : order.status === 'shipped'
                                ? 'bg-cyan-600'
                                : order.status === 'delivered'
                                ? 'bg-emerald-600'
                                : 'bg-rose-600'
                            }`}
                          />
                          <span>{order.status.toUpperCase()}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenOutreachForOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-bold transition shadow-2xs hover:scale-105 active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
                          <span>Outreach Hub</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Outreach Modal */}
      <WhatsAppOutreachModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        onOrderUpdated={fetchOrders}
      />
    </div>
  );
}
