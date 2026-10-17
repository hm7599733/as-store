import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  Package,
  CheckCircle2,
  ArrowRight,
  Printer,
  Tag,
  Plus,
  Truck,
  ExternalLink,
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
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Store Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time sales, order dispatches, and catalogue inventory for <strong>AS Store Pakistan</strong>.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-900 text-white font-bold text-xs transition shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#06B6D4]" />
            <span>Manage Products</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs transition shadow-2xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#06B6D4]" />
            <span>Process Orders</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Recorded Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-slate-900">
            {formatPrice(totalRevenue)}
          </div>
          <span className="text-[11px] text-slate-400 block font-medium">Recent processed customer orders</span>
        </div>

        {/* Pending Orders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Pending Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-amber-600">
            {pendingOrders}
          </div>
          <Link href="/admin/orders" className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
            <span>Verify & dispatch orders</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Catalogue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Active Inventory</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-slate-900">
            {activeProducts} / {totalProducts}
          </div>
          <Link href="/admin/products" className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
            <span>Update pricing & stock</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Active Coupons */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Discount Codes</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-slate-900">
            {totalCoupons} Active
          </div>
          <Link href="/admin/coupons" className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
            <span>Manage discount vouchers</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-black text-base text-slate-900">
              Recent Incoming Orders
            </h2>
            <p className="text-[11px] text-slate-500">Live order queue with 1-click printable courier packing slips</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-700 transition"
          >
            <span>View All Orders ({totalOrders})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-2xs">
          {recentOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No orders have been recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Total COD</th>
                    <th className="p-4">Order Status</th>
                    <th className="p-4 text-right">Dispatch Slip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {ord.order_number || ord.id.slice(0, 8)}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{ord.customer_name}</div>
                        <span className="text-[11px] text-slate-400 font-mono">{ord.phone}</span>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">
                        {ord.city}
                      </td>
                      <td className="p-4 font-bold font-display text-slate-900">
                        {formatPrice(ord.total_amount)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : ord.status === 'shipped'
                              ? 'bg-cyan-100 text-cyan-800'
                              : ord.status === 'delivered'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/orders/${ord.id}/slip`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B132B] hover:bg-slate-900 text-white font-bold text-[11px] transition shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#06B6D4]" />
                          <span>Print Slip</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
