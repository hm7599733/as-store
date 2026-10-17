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
        <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
          Coupons & Promo Codes
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Active discount codes applicable during customer checkout.
        </p>
      </div>

      <div className="rounded-3xl bg-[#0E1526] border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-bold">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount Type</th>
                <th className="p-4">Value</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Times Used</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {typedCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                    {coupon.code}
                  </td>
                  <td className="p-4 capitalize text-slate-300">
                    {coupon.discount_type}
                  </td>
                  <td className="p-4 font-bold text-white">
                    {coupon.discount_type === 'percentage'
                      ? `${coupon.discount_value}%`
                      : formatPrice(coupon.discount_value)}
                  </td>
                  <td className="p-4 text-slate-400">
                    {coupon.minimum_order ? formatPrice(coupon.minimum_order) : 'None'}
                  </td>
                  <td className="p-4 text-slate-300 font-mono">
                    {coupon.times_used || 0}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      coupon.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
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
