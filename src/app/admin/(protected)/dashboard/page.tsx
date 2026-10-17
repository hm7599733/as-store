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
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  Boxes,
  Sparkles,
  BarChart3,
  CircleDot,
  Check,
} from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import type { Order, Product } from '@/types/database';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = createServiceClient();

  const [ordersRes, productsRes, couponsRes] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
    supabase.from('products').select('id, name, slug, price, stock_status, active').order('created_at', { ascending: false }),
    supabase.from('coupons').select('id, code, discount_type, discount_value, active, times_used'),
  ]);

  const allOrders: Order[] = ordersRes.data || [];
  const products: Product[] = (productsRes.data as Product[]) || [];
  const coupons = couponsRes.data || [];

  // Metrics aggregation
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter((o) => o.status === 'pending');
  const approvedOrders = allOrders.filter((o) => o.status === 'approved');
  const shippedOrders = allOrders.filter((o) => o.status === 'shipped');
  const deliveredOrders = allOrders.filter((o) => o.status === 'delivered');
  const rejectedOrders = allOrders.filter((o) => o.status === 'rejected');

  const validOrders = allOrders.filter((o) => o.status !== 'rejected');
  const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const averageOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.active).length;
  const inStockProducts = products.filter((p) => p.stock_status === 'in_stock').length;
  const lowOrOutStock = products.filter((p) => p.stock_status === 'low_stock' || p.stock_status === 'out_of_stock');

  const activeCoupons = coupons.filter((c) => c.active).length;
  const recentOrders = allOrders.slice(0, 8);

  // Fulfillment pipeline percentages
  const activePipelineTotal = (pendingOrders.length + approvedOrders.length + shippedOrders.length + deliveredOrders.length) || 1;
  const pendingPct = Math.round((pendingOrders.length / activePipelineTotal) * 100);
  const approvedPct = Math.round((approvedOrders.length / activePipelineTotal) * 100);
  const shippedPct = Math.round((shippedOrders.length / activePipelineTotal) * 100);
  const deliveredPct = Math.round((deliveredOrders.length / activePipelineTotal) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top SaaS Header & Command Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Operations Online
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-500 text-xs font-medium">Karachi Hub • Pakistan</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Store Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time analytics, courier dispatch queue, and inventory control for <strong>AS Store</strong>.
          </p>
        </div>

        {/* Global SaaS Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-900 text-white font-bold text-xs transition shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#06B6D4]" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs transition shadow-2xs active:scale-95"
          >
            <Truck className="w-4 h-4 text-cyan-600" />
            <span>Courier Dispatch ({pendingOrders.length} Pending)</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
            title="Open customer storefront in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Storefront</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Total Gross Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-slate-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Gross Volume (COD)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {formatPrice(totalRevenue)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">{validOrders.length} confirmed orders</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">100% Real-time</span>
          </div>
        </div>

        {/* Metric 2: Pending Dispatch Queue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-amber-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Pending Verification</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
            {pendingOrders.length}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Awaiting call confirmation</span>
            <Link href="/admin/orders" className="text-amber-700 font-bold hover:underline flex items-center gap-1">
              <span>Process now</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Metric 3: Active Catalogue & Stock */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-cyan-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Inventory Health</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {inStockProducts} <span className="text-sm font-normal text-slate-400">/ {totalProducts} items</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">{activeProducts} live on site</span>
            <span className="text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-md">
              {totalProducts > 0 ? Math.round((inStockProducts / totalProducts) * 100) : 100}% in stock
            </span>
          </div>
        </div>

        {/* Metric 4: Average Order Value (AOV) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-indigo-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Average Basket (AOV)</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {formatPrice(averageOrderValue)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">{activeCoupons} active discount codes</span>
            <Link href="/admin/coupons" className="text-indigo-700 font-bold hover:underline flex items-center gap-1">
              <span>View codes</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Fulfillment Pipeline Progress Widget */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display font-black text-base text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-600" />
              <span>Logistics & Fulfillment Pipeline</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status breakdown of customer consignments across Pakistan
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Manage All Dispatches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Segmented Pipeline Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5 p-0.5">
          <div
            style={{ width: `${Math.max(pendingPct, 4)}%` }}
            className="h-full bg-amber-400 rounded-l-full transition-all duration-500"
            title={`Pending: ${pendingOrders.length} orders`}
          />
          <div
            style={{ width: `${Math.max(approvedPct, 4)}%` }}
            className="h-full bg-blue-500 transition-all duration-500"
            title={`Approved for packing: ${approvedOrders.length} orders`}
          />
          <div
            style={{ width: `${Math.max(shippedPct, 4)}%` }}
            className="h-full bg-cyan-500 transition-all duration-500"
            title={`With courier: ${shippedOrders.length} orders`}
          />
          <div
            style={{ width: `${Math.max(deliveredPct, 4)}%` }}
            className="h-full bg-emerald-500 rounded-r-full transition-all duration-500"
            title={`Delivered: ${deliveredOrders.length} orders`}
          />
        </div>

        {/* Pipeline 4-Stage Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900">1. Verification</span>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <div className="font-display text-xl font-black text-amber-900 mt-1">
              {pendingOrders.length}
            </div>
            <span className="text-[10px] text-amber-700">Need confirmation</span>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-900">2. Ready to Pack</span>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <div className="font-display text-xl font-black text-blue-900 mt-1">
              {approvedOrders.length}
            </div>
            <span className="text-[10px] text-blue-700">Slips ready to print</span>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-900">3. In Transit</span>
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
            </div>
            <div className="font-display text-xl font-black text-cyan-900 mt-1">
              {shippedOrders.length}
            </div>
            <span className="text-[10px] text-cyan-700">With rider / courier</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-900">4. Delivered</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="font-display text-xl font-black text-emerald-900 mt-1">
              {deliveredOrders.length}
            </div>
            <span className="text-[10px] text-emerald-700">Payment received</span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Stock Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Order Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-black text-base text-slate-900">
                Recent Customer Orders
              </h2>
              <p className="text-[11px] text-slate-500">Live order queue with 1-click printable courier packing slips</p>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-700 transition"
            >
              <span>View All ({totalOrders})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
            {recentOrders.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No orders recorded yet. They will appear here immediately upon customer checkout.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Reference</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Dispatch Slip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentOrders.map((ord) => {
                      const displayId = ord.order_number || `AS-${ord.id.slice(0, 8).toUpperCase()}`;
                      const cleanPhone = ord.phone ? ord.phone.replace(/\D/g, '') : '';

                      return (
                        <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                          {/* Ref */}
                          <td className="p-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {displayId}
                            <span className="block text-[10px] text-slate-400 font-sans mt-0.5">
                              {new Date(ord.created_at).toLocaleDateString()}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{ord.customer_name}</div>
                            {cleanPhone ? (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 font-mono mt-0.5"
                                title="Chat on WhatsApp"
                              >
                                <PhoneCall className="w-3 h-3" />
                                <span>{ord.phone}</span>
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-mono">{ord.phone}</span>
                            )}
                          </td>

                          {/* Destination */}
                          <td className="p-4 text-slate-700 font-medium">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-bold text-[11px] text-slate-800">
                              {ord.city || 'Pakistan'}
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="p-4 font-bold font-display text-slate-900 whitespace-nowrap">
                            {formatPrice(ord.total_amount)}
                            <span className="block text-[10px] text-slate-400 font-normal uppercase">
                              {ord.payment_method || 'COD'}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-4 whitespace-nowrap">
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

                          {/* 1-Click Print Slip */}
                          <td className="p-4 text-right whitespace-nowrap">
                            <Link
                              href={`/admin/orders/${ord.id}/slip`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B132B] hover:bg-slate-900 text-white font-bold text-[11px] transition shadow-2xs hover:scale-105"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#06B6D4]" />
                              <span>Print Slip</span>
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

        {/* Right 1 Col: Inventory & Quick Operations Widget */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-black text-base text-slate-900">
                Inventory Alerts
              </h2>
              <p className="text-[11px] text-slate-500">Stock monitor & quick actions</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-cyan-600 hover:text-cyan-700"
            >
              All Items
            </Link>
          </div>

          {/* Quick Operations Action Box */}
          <div className="p-5 rounded-2xl bg-[#0B132B] text-white shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#06B6D4]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-cyan-300">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/15 transition text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#06B6D4]" />
                  <span>Add New Product Listing</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/15 transition text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-[#06B6D4]" />
                  <span>Batch Print Courier Slips</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/admin/coupons"
                className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/15 transition text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#06B6D4]" />
                  <span>Create Discount Voucher</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Stock Monitor List */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Stock Status Overview</span>
            </h3>

            {lowOrOutStock.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All {totalProducts} products are currently well-stocked.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {lowOrOutStock.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div className="pr-2 min-w-0">
                      <div className="font-bold text-slate-900 truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{formatPrice(item.price)}</div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        item.stock_status === 'out_of_stock'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.stock_status === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
