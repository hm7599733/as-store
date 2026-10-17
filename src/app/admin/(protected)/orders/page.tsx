'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  Eye,
  Search,
  PhoneCall,
  FileText,
  Printer,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  MapPin,
  Package,
  Calendar,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types/database';

function getInitials(name: string): string {
  if (!name) return 'C';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

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

  const handleApprove = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/approve`, { method: 'POST' });
      if (res.ok) {
        await fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel / reject this order?')) return;
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/reject`, { method: 'POST' });
      if (res.ok) {
        await fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = order.customer_name?.toLowerCase().includes(q);
      const matchPhone = order.phone?.includes(q);
      const matchNumber = order.order_number?.toLowerCase().includes(q) || false;
      const matchCity = order.city?.toLowerCase().includes(q);
      const matchAddress = order.address?.toLowerCase().includes(q);
      return matchName || matchPhone || matchNumber || matchCity || matchAddress;
    }
    return true;
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const approvedCount = orders.filter((o) => o.status === 'approved').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const rejectedCount = orders.filter((o) => o.status === 'rejected').length;

  const totalFilteredRevenue = filteredOrders
    .filter((o) => o.status !== 'rejected')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* SaaS Header & Live Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Logistics & Consignments
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">
              Cash on Delivery (COD)
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Order Fulfillment Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify buyer details, dispatch parcels, and generate official courier packing slips.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs active:scale-95 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Orders Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Volume</span>
          <div className="font-display text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {orders.length} <span className="text-xs font-normal text-slate-400">orders</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">Pending Call</span>
          <div className="font-display text-xl sm:text-2xl font-black text-amber-600 mt-1">
            {pendingCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">Approved / Packing</span>
          <div className="font-display text-xl sm:text-2xl font-black text-blue-600 mt-1">
            {approvedCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-extrabold text-cyan-600 uppercase tracking-wider">With Courier</span>
          <div className="font-display text-xl sm:text-2xl font-black text-cyan-600 mt-1">
            {shippedCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Delivered</span>
          <div className="font-display text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            {deliveredCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by buyer name, phone, city, or order #..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition"
          />
          <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Tabs with Live Badges */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Orders', count: orders.length },
            { id: 'pending', label: 'Pending', count: pendingCount },
            { id: 'approved', label: 'Approved', count: approvedCount },
            { id: 'shipped', label: 'Shipped', count: shippedCount },
            { id: 'delivered', label: 'Delivered', count: deliveredCount },
            { id: 'rejected', label: 'Rejected', count: rejectedCount },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-[#06B6D4] text-slate-950 font-black' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span>Fetching customer orders from database...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs space-y-2">
            <Package className="w-8 h-8 mx-auto text-slate-300" />
            <div className="font-bold text-slate-700">No matching orders found</div>
            <p className="text-slate-400 text-[11px]">
              Try adjusting your search criteria or switching to a different status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Ref Number</th>
                  <th className="p-4">Buyer Details</th>
                  <th className="p-4">Delivery Destination</th>
                  <th className="p-4">Items Summary</th>
                  <th className="p-4">COD Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Fulfillment Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const displayId = order.order_number || `AS-${order.id.slice(0, 8).toUpperCase()}`;
                  const isProcessing = actionLoading === order.id;
                  const cleanPhone = order.phone ? order.phone.replace(/\D/g, '') : '';
                  const initials = getInitials(order.customer_name);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition">
                      {/* Ref */}
                      <td className="p-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{displayId}</span>
                        </div>
                        <span className="block text-[10px] text-slate-400 font-sans mt-0.5">
                          {new Date(order.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#0B132B] to-[#1E293B] text-[#06B6D4] font-black text-[11px] flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{order.customer_name}</div>
                            {cleanPhone ? (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 font-mono mt-0.5"
                                title="Chat on WhatsApp"
                              >
                                <PhoneCall className="w-3 h-3" />
                                <span>{order.phone}</span>
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-mono">{order.phone}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="p-4 max-w-xs">
                        <div className="line-clamp-2 text-slate-700 leading-snug">{order.address}</div>
                        <span className="font-bold text-cyan-700 text-[11px] inline-flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{order.city}</span>
                        </span>
                      </td>

                      {/* Items */}
                      <td className="p-4 max-w-xs">
                        <div className="space-y-1">
                          {(order.order_items || []).map((item, idx) => (
                            <div key={idx} className="line-clamp-1 text-slate-700 text-[11px] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                              <span className="font-medium truncate">{item.product_name}</span>
                              <span className="text-slate-400 font-mono text-[10px]">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-bold text-slate-900 font-display whitespace-nowrap">
                        <div className="text-sm">{formatPrice(order.total_amount)}</div>
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                          {order.payment_method || 'COD'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.status === 'approved'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : order.status === 'shipped'
                              ? 'bg-cyan-100 text-cyan-800'
                              : order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.status === 'approved'
                                ? 'bg-blue-600'
                                : order.status === 'rejected'
                                ? 'bg-rose-600'
                                : order.status === 'shipped'
                                ? 'bg-cyan-600'
                                : order.status === 'delivered'
                                ? 'bg-emerald-600'
                                : 'bg-amber-600'
                            }`}
                          />
                          <span>{order.status.toUpperCase()}</span>
                        </span>
                      </td>

                      {/* Actions & Print Slip */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Printing Courier Slip Button */}
                          <Link
                            href={`/admin/orders/${order.id}/slip`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B132B] hover:bg-slate-900 text-white font-bold text-[11px] transition shadow-2xs hover:scale-105"
                            title="Print Courier Packing Slip"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#06B6D4]" />
                            <span>Print Slip</span>
                          </Link>

                          {/* Quick Invoice Link */}
                          <Link
                            href={`/invoice/${order.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                            title="View Standard Invoice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </Link>

                          {/* Workflow status advancement buttons */}
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(order.id)}
                                disabled={isProcessing}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-2xs disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(order.id)}
                                disabled={isProcessing}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition shadow-2xs disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {order.status === 'approved' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'shipped')}
                              disabled={isProcessing}
                              className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-[11px] transition shadow-2xs disabled:opacity-50"
                            >
                              Dispatch
                            </button>
                          )}

                          {order.status === 'shipped' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'delivered')}
                              disabled={isProcessing}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-2xs disabled:opacity-50"
                            >
                              Delivered
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
