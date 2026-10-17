import React from 'react';
import { Tag, CheckCircle2 } from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import type { Coupon } from '@/types/database';

export const revalidate = 0;

export default async function AdminCouponsPage() {
  const supabase = createServiceClient();
  const { data: coupons } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });

  const typedCoupons = (coupons as Coupon[]) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
          Coupons & Promo Codes
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Active discount codes and promotional vouchers for <strong>AS Store</strong> customer checkout.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount Type</th>
                <th className="p-4">Value</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Times Used</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {typedCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-4 font-mono font-bold text-blue-600 text-sm">
                    {coupon.code}
                  </td>
                  <td className="p-4 capitalize text-slate-700 font-medium">
                    {coupon.discount_type}
                  </td>
                  <td className="p-4 font-bold text-slate-900 font-display">
                    {coupon.discount_type === 'percentage'
                      ? `${coupon.discount_value}%`
                      : formatPrice(coupon.discount_value)}
                  </td>
                  <td className="p-4 text-slate-600">
                    {coupon.minimum_order ? formatPrice(coupon.minimum_order) : 'No Minimum'}
                  </td>
                  <td className="p-4 text-slate-700 font-mono font-semibold">
                    {coupon.times_used || 0}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      coupon.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
