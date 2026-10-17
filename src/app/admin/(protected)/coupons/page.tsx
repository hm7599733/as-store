import React from 'react';
import { Tag, CheckCircle2, Ticket, Sparkles, Plus, ArrowUpRight } from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import type { Coupon } from '@/types/database';

export const revalidate = 0;

export default async function AdminCouponsPage() {
  const supabase = createServiceClient();
  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  const typedCoupons = (coupons as Coupon[]) || [];
  const activeCount = typedCoupons.filter((c) => c.active).length;
  const totalRedemptions = typedCoupons.reduce((sum, c) => sum + (c.times_used || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* SaaS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Marketing & Promotions
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">
              Checkout Discounts
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Discount Vouchers & Promo Codes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active discount codes and promotional vouchers applied at customer checkout for <strong>AS Store</strong>.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Coupons</span>
          <div className="font-display text-2xl font-black text-slate-900 mt-1">
            {typedCoupons.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Configured promotional vouchers</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Active Deals</span>
          <div className="font-display text-2xl font-black text-emerald-600 mt-1">
            {activeCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Redeemable at customer checkout</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-extrabold text-cyan-600 uppercase tracking-wider">Total Redemptions</span>
          <div className="font-display text-2xl font-black text-cyan-600 mt-1">
            {totalRedemptions}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Times successfully used by shoppers</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Voucher Code</th>
                <th className="p-4">Discount Type</th>
                <th className="p-4">Savings Value</th>
                <th className="p-4">Minimum Order</th>
                <th className="p-4">Usage Count</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {typedCoupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 text-xs">
                    No promo codes found in the database.
                  </td>
                </tr>
              ) : (
                typedCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-[#06B6D4] font-mono font-black text-xs tracking-wider shadow-2xs">
                        <Ticket className="w-3.5 h-3.5 text-[#06B6D4]" />
                        <span>{coupon.code}</span>
                      </div>
                    </td>
                    <td className="p-4 capitalize text-slate-700 font-semibold">
                      {coupon.discount_type}
                    </td>
                    <td className="p-4 font-bold text-slate-900 font-display text-sm">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}% OFF`
                        : `${formatPrice(coupon.discount_value)} OFF`}
                    </td>
                    <td className="p-4 text-slate-600">
                      {coupon.minimum_order ? formatPrice(coupon.minimum_order) : 'No Minimum'}
                    </td>
                    <td className="p-4 text-slate-800 font-mono font-bold">
                      {coupon.times_used || 0} times
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          coupon.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            coupon.active ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        <span>{coupon.active ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
