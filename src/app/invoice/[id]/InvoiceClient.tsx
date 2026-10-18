'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Printer, ArrowLeft } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types/database';

export default function InvoiceClient({ order }: { order: Order }) {
  const displayId = order.order_number || `AS-${order.id.slice(0, 8).toUpperCase()}`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 print:p-0 print:bg-white print:text-black">
      {/* Print Controls (Hidden when printing) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-glow"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Invoice Card Container */}
      <div className="max-w-3xl mx-auto rounded-3xl border border-slate-800 bg-[#0E1526] p-6 sm:p-10 shadow-2xl print:border-none print:shadow-none print:bg-white print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-6 gap-4 print:border-slate-300">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-20 flex items-center justify-center p-1 rounded-xl bg-[#060C1B] border border-cyan-900/40 print:border print:border-black shrink-0">
              <Image
                src="/images/as-store-logo.png"
                alt="AS Gadgets Logo"
                width={893}
                height={507}
                className="h-full w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="font-display font-black text-xl tracking-tight leading-none print:text-black">
                AS GADGETS
              </h1>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-cyan-400 print:text-slate-600">
                Official Order Invoice
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1">
            <div className="font-mono font-bold text-sm text-blue-400 print:text-black">
              {displayId}
            </div>
            <div className="text-slate-400 print:text-slate-600 text-[11px]">
              Date: {new Date(order.created_at).toLocaleDateString('en-PK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
            <div className="text-slate-400 print:text-slate-600 text-[11px]">
              Payment: <strong className="text-white print:text-black">{order.payment_method || 'Cash on Delivery'}</strong>
            </div>
          </div>
        </div>

        {/* Sender & Receiver Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-800/80 print:border-slate-300 text-xs">
          {/* Customer Ship-To */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 print:text-slate-700 block">
              Ship To:
            </span>
            <div className="font-bold text-sm text-white print:text-black">
              {order.customer_name}
            </div>
            <div className="text-slate-300 print:text-slate-800 leading-snug">
              {order.address}
            </div>
            <div className="text-slate-300 print:text-slate-800 font-semibold">
              {order.city}, Pakistan
            </div>
            <div className="text-blue-400 print:text-slate-800 font-mono pt-1">
              📞 {order.phone}
            </div>
          </div>

          {/* Store Info */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 print:text-slate-700 block">
              Dispatched From:
            </span>
            <div className="font-bold text-sm text-white print:text-black">
              AS Store Logistics
            </div>
            <div className="text-slate-300 print:text-slate-800">
              Lahore Hub, Punjab, Pakistan
            </div>
            <div className="text-slate-300 print:text-slate-800">
              Official Helpline: +92 320 1042634
            </div>
            <div className="text-slate-400 print:text-slate-600 text-[11px] pt-1">
              Web: www.asstore.pk
            </div>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="py-6 border-b border-slate-800/80 print:border-slate-300">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-700 text-left">
                <th className="py-2.5 font-bold">Item Description</th>
                <th className="py-2.5 text-center font-bold">Qty</th>
                <th className="py-2.5 text-right font-bold">Unit Price</th>
                <th className="py-2.5 text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 print:divide-slate-200">
              {(order.order_items || []).map((item) => (
                <tr key={item.id} className="text-slate-300 print:text-black">
                  <td className="py-3">
                    <span className="font-bold text-white print:text-black block">
                      {item.product_name}
                    </span>
                    {item.variant_name && (
                      <span className="text-[11px] text-blue-400 print:text-slate-600">
                        {item.variant_name}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">{formatPrice(item.unit_price)}</td>
                  <td className="py-3 text-right font-bold text-white print:text-black">
                    {formatPrice(item.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary & COD Collection Total */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="text-xs text-slate-400 print:text-slate-600 space-y-1">
            <p className="font-semibold text-white print:text-black">Thank you for shopping with AS Store!</p>
            <p>Every order is backed by our 7-Day Replacement Guarantee.</p>
            <p className="text-[11px] text-slate-500">For returns or questions: support@asstore.pk</p>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400 print:text-slate-700">
              <span>Subtotal:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {(order.coupon_discount > 0 || order.bundle_discount > 0) && (
              <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                <span>Discount:</span>
                <span>-{formatPrice((order.coupon_discount || 0) + (order.bundle_discount || 0))}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400 print:text-slate-700">
              <span>Delivery Fee:</span>
              <span>{order.delivery_charges === 0 ? 'FREE' : formatPrice(order.delivery_charges)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800 print:border-slate-300 text-sm font-black">
              <span className="text-white print:text-black">C.O.D Amount:</span>
              <span className="text-blue-400 print:text-black font-display text-base">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
