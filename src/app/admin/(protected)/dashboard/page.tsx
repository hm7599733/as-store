import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  Package,
  CheckCircle2,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types/database';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = createServiceClient();

  const [ordersRes, productsRes, couponsRes] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('products').select('id, active', { count: 'exact' }),
    supabase.from('coupons').select('id', { count: 'exact' }),
  ]);

  const recentOrders: Order[] = ordersRes.data || [];
  const totalProducts = productsRes.count || 0;
  const activeProducts = productsRes.data?.filter((p) => p.active).length || 0;
  const totalCoupons = couponsRes.count || 0;

  // Aggregate order metrics
  const totalOrders = recentOrders.length;
  const pendingOrders = recentOrders.filter((o) => o.status === 'pending').length;
  const approvedOrders = recentOrders.filter((o) => o.status === 'approved' || o.status === 'delivered').length;
  const totalRevenue = recentOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
          Store Operations Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time summary of sales, orders, and catalogue status for <strong>AS Store</strong>.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-[#0E1526] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Revenue (Recent)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-white">
            {formatPrice(totalRevenue)}
          </div>
          <span className="text-[11px] text-slate-500">From recent recorded orders</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1526] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Pending Verification</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-amber-400">
            {pendingOrders}
          </div>
          <Link href="/admin/orders?status=pending" className="text-[11px] text-blue-400 hover:underline">
            Review pending orders →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1526] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Active Products</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-white">
            {activeProducts} / {totalProducts}
          </div>
          <Link href="/admin/products" className="text-[11px] text-blue-400 hover:underline">
            Manage inventory →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1526] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Active Coupons</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-white">
            {totalCoupons}
          </div>
          <Link href="/admin/coupons" className="text-[11px] text-blue-400 hover:underline">
            View promo codes →
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-3xl bg-[#0E1526] border border-slate-800 overflow-hidden">
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="font-display font-bold text-base text-white">Recent Orders</h2>
            <p className="text-xs text-slate-400">Latest customer checkouts awaiting dispatch</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No orders recorded yet. Place a test checkout to see orders live here!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-bold">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentOrders.map((order) => {
                  const displayId = order.order_number || `AS-${order.id.slice(0, 8).toUpperCase()}`;
                  return (
                    <tr key={order.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-4 font-mono font-bold text-white">
                        {displayId}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{order.customer_name}</div>
                        <span className="text-[11px] text-slate-400 font-mono">{order.phone}</span>
                      </td>
                      <td className="p-4 text-slate-300">{order.city}</td>
                      <td className="p-4 font-bold text-blue-400 font-display">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : order.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400'
                            : order.status === 'shipped'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/invoice/${order.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </Link>
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
