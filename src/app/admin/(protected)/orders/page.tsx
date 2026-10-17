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
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types/database';

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
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (orderId: string) => {
    if (!confirm('Are you sure you want to reject this order?')) return;
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/reject`, { method: 'POST' });
      if (res.ok) {
        fetchOrders();
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
        fetchOrders();
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
      const matchName = order.customer_name.toLowerCase().includes(q);
      const matchPhone = order.phone.includes(q);
      const matchNumber = order.order_number?.toLowerCase().includes(q) || false;
      const matchCity = order.city.toLowerCase().includes(q);
      return matchName || matchPhone || matchNumber || matchCity;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
            Order Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review, approve, reject, and update customer shipments for <strong>AS Store</strong>.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0E1526] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, phone, or city..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['all', 'pending', 'approved', 'shipped', 'delivered', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-glow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-[#0E1526] border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs animate-pulse">
            Loading orders from database...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">
            No orders match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-bold">
                <tr>
                  <th className="p-4">Ref Number</th>
                  <th className="p-4">Customer & Phone</th>
                  <th className="p-4">Delivery Address</th>
                  <th className="p-4">Items Ordered</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Order Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((order) => {
                  const displayId = order.order_number || `AS-${order.id.slice(0, 8).toUpperCase()}`;
                  const isProcessing = actionLoading === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-slate-900/40 transition">
                      {/* Ref */}
                      <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                        {displayId}
                        <span className="block text-[10px] text-slate-500 font-sans mt-0.5">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <div className="font-bold text-white">{order.customer_name}</div>
                        <a
                          href={`https://wa.me/${order.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-mono mt-0.5"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>{order.phone}</span>
                        </a>
                      </td>

                      {/* Address */}
                      <td className="p-4 max-w-xs">
                        <div className="line-clamp-2 text-slate-300">{order.address}</div>
                        <span className="font-semibold text-slate-400 text-[11px] block mt-0.5">
                          {order.city}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="p-4 max-w-xs">
                        {(order.order_items || []).map((item, idx) => (
                          <div key={idx} className="line-clamp-1 text-slate-300 text-[11px]">
                            • {item.product_name} <span className="text-slate-500">x{item.quantity}</span>
                          </div>
                        ))}
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-bold text-blue-400 font-display whitespace-nowrap">
                        {formatPrice(order.total_amount)}
                        <span className="block text-[10px] text-slate-500 font-normal">
                          {order.payment_method || 'COD'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : order.status === 'rejected'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : order.status === 'shipped'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : order.status === 'delivered'
                              ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(order.id)}
                                disabled={isProcessing}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(order.id)}
                                disabled={isProcessing}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition shadow-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {order.status === 'approved' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'shipped')}
                              disabled={isProcessing}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition shadow-sm"
                            >
                              Dispatch
                            </button>
                          )}

                          {order.status === 'shipped' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'delivered')}
                              disabled={isProcessing}
                              className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] transition shadow-sm"
                            >
                              Delivered
                            </button>
                          )}

                          <Link
                            href={`/invoice/${order.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                            title="Print Invoice"
                          >
                            <FileText className="w-4 h-4" />
                          </Link>
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
