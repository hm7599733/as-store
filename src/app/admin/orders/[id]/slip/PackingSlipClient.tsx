'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Printer, ArrowLeft, ShieldCheck, PhoneCall, CheckSquare } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Order, Settings } from '@/types/database';

export default function PackingSlipClient({
  order,
  settings,
}: {
  order: Order;
  settings: Settings | null;
}) {
  const displayId = order.order_number || `AS-${order.id.slice(0, 8).toUpperCase()}`;
  const helpline = settings?.whatsapp_number || '+92 320 1042634';
  const isCOD = (order.payment_method || 'cod').toLowerCase() === 'cod';

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-4 sm:p-8 print:p-0 print:bg-white print:text-black">
      {/* Control bar (hidden during print) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/admin/orders"
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders List</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Dispatch Slip (Ctrl + P)</span>
          </button>
        </div>
      </div>

      {/* Printable Dispatch & Packing Slip */}
      <div className="max-w-3xl mx-auto bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm print:shadow-none print:border print:border-black print:rounded-none print:p-6 print:m-0">
        {/* Header with Logo and Barcode */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-20 flex items-center justify-center p-1 rounded-xl bg-black print:border print:border-black shrink-0">
              <Image
                src="/images/as-store-logo.png"
                alt="AS Gadgets Logo"
                width={893}
                height={507}
                className="h-full w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="font-display font-black text-2xl tracking-tight text-slate-900 print:text-black leading-none">
                AS GADGETS
              </h1>
              <p className="text-[11px] font-bold tracking-widest uppercase text-blue-600 print:text-black mt-1">
                Dispatch & Courier Packing Slip
              </p>
            </div>
          </div>

          {/* Barcode Simulation */}
          <div className="text-right">
            <div className="inline-block p-1 bg-white border border-slate-300 print:border-black">
              {/* Simulated Barcode Lines */}
              <div className="flex items-center gap-[2px] h-10 px-2 justify-center">
                <span className="w-1 h-full bg-black block" />
                <span className="w-[1px] h-full bg-black block" />
                <span className="w-1.5 h-full bg-black block" />
                <span className="w-[1px] h-full bg-black block" />
                <span className="w-2 h-full bg-black block" />
                <span className="w-[1px] h-full bg-black block" />
                <span className="w-1 h-full bg-black block" />
                <span className="w-1.5 h-full bg-black block" />
                <span className="w-[2px] h-full bg-black block" />
                <span className="w-1 h-full bg-black block" />
                <span className="w-2 h-full bg-black block" />
                <span className="w-1 h-full bg-black block" />
                <span className="w-1.5 h-full bg-black block" />
                <span className="w-[1px] h-full bg-black block" />
                <span className="w-2 h-full bg-black block" />
                <span className="w-1 h-full bg-black block" />
              </div>
              <div className="font-mono text-center font-bold text-xs tracking-wider text-black mt-0.5">
                {displayId}
              </div>
            </div>
          </div>
        </div>

        {/* Consignment Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Order Reference</span>
            <span className="font-mono font-bold text-slate-900">{displayId}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Booking Date</span>
            <span className="font-semibold text-slate-800">
              {new Date(order.created_at).toLocaleDateString('en-PK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Payment Mode</span>
            <span className={`font-bold uppercase ${isCOD ? 'text-amber-700' : 'text-emerald-700'}`}>
              {isCOD ? 'Cash on Delivery' : 'Paid Online'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Status</span>
            <span className="font-bold text-slate-900 uppercase">{order.status}</span>
          </div>
        </div>

        {/* Routing Cards: Receiver (Consignee) vs Shipper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-200">
          {/* Receiver / Customer (High priority) */}
          <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-300 print:bg-white print:border-black">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded print:bg-black">
                DELIVER TO (CONSIGNEE)
              </span>
              <span className="text-xs font-black text-blue-600 print:text-black uppercase">
                {order.city}
              </span>
            </div>
            <div className="text-base font-black text-slate-900 print:text-black">
              {order.customer_name}
            </div>
            <div className="text-sm font-bold font-mono text-slate-900 print:text-black my-1">
              📞 {order.phone}
            </div>
            <div className="text-xs text-slate-700 print:text-black mt-1 leading-relaxed">
              <strong>Address:</strong> {order.address}
            </div>
            <div className="text-xs font-bold text-slate-900 print:text-black mt-1">
              Destination City: {order.city}
            </div>
          </div>

          {/* Shipper Details */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 print:bg-white print:border-black">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              DISPATCHED FROM (SHIPPER)
            </span>
            <div className="text-sm font-bold text-slate-900 print:text-black">
              AS Store Logistics & Fulfillment Hub
            </div>
            <div className="text-xs text-slate-600 print:text-black mt-1 leading-relaxed">
              Main Fulfillment Center, Lahore, Punjab, Pakistan
            </div>
            <div className="text-xs font-semibold text-slate-800 print:text-black mt-2">
              Helpline / WhatsApp: <span className="font-mono font-bold">{helpline}</span>
            </div>
            <div className="text-xs text-slate-500 print:text-black mt-0.5">
              Website: www.asstore.pk
            </div>
          </div>
        </div>

        {/* High Visibility COD Banner for Rider */}
        <div className={`my-4 p-4 rounded-xl border-2 text-center ${
          isCOD
            ? 'bg-amber-50 border-amber-400 print:bg-white print:border-black'
            : 'bg-emerald-50 border-emerald-400 print:bg-white print:border-black'
        }`}>
          <span className="text-xs uppercase font-extrabold tracking-wider block text-slate-600 print:text-black">
            {isCOD ? '★ CASH AMOUNT TO COLLECT FROM CUSTOMER (COD) ★' : '★ PAYMENT STATUS ★'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 print:text-black mt-1 font-display">
            {isCOD ? formatPrice(order.total_amount) : 'PAID IN FULL — ZERO CASH COLLECTION'}
          </div>
          {isCOD && (
            <p className="text-[11px] font-semibold text-amber-800 print:text-black mt-0.5">
              Courier rider notice: Please collect the exact Cash On Delivery amount before parcel handover.
            </p>
          )}
        </div>

        {/* Itemized Packing Checklist Table */}
        <div className="my-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 print:text-black">
              Parcel Contents & Packing Checklist
            </span>
            <span className="text-[11px] text-slate-500 print:text-black">
              Total Items: {order.order_items?.length || 0}
            </span>
          </div>

          <table className="w-full text-left text-xs border border-slate-300 print:border-black">
            <thead className="bg-slate-100 text-slate-700 print:bg-slate-200 print:text-black font-bold border-b border-slate-300">
              <tr>
                <th className="p-2.5 text-center w-10">Check</th>
                <th className="p-2.5">Item Description</th>
                <th className="p-2.5">Variant</th>
                <th className="p-2.5 text-center w-14">Qty</th>
                <th className="p-2.5 text-right w-24">Price</th>
                <th className="p-2.5 text-right w-24">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 print:divide-black">
              {(order.order_items || []).map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 print:hover:bg-white">
                  <td className="p-2.5 text-center">
                    <span className="inline-block w-4 h-4 border-2 border-slate-600 print:border-black rounded-sm" />
                  </td>
                  <td className="p-2.5 font-bold text-slate-900 print:text-black">
                    {item.product_name}
                  </td>
                  <td className="p-2.5 text-slate-600 print:text-black">
                    {item.variant_name || 'Standard'}
                  </td>
                  <td className="p-2.5 text-center font-bold font-mono">
                    {item.quantity}
                  </td>
                  <td className="p-2.5 text-right text-slate-700 print:text-black">
                    {formatPrice(item.unit_price)}
                  </td>
                  <td className="p-2.5 text-right font-bold text-slate-900 print:text-black">
                    {formatPrice(item.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end my-4">
          <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-700 print:text-black">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatPrice(order.subtotal)}</span>
            </div>
            {order.coupon_discount > 0 && (
              <div className="flex justify-between text-emerald-600 print:text-black">
                <span>Coupon Discount:</span>
                <span>-{formatPrice(order.coupon_discount)}</span>
              </div>
            )}
            {order.bundle_discount > 0 && (
              <div className="flex justify-between text-emerald-600 print:text-black">
                <span>Bundle Discount:</span>
                <span>-{formatPrice(order.bundle_discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges:</span>
              <span className="font-semibold">
                {order.delivery_charges === 0 ? 'FREE' : formatPrice(order.delivery_charges)}
              </span>
            </div>
            <div className="flex justify-between font-black text-sm pt-2 border-t-2 border-slate-900 text-slate-900 print:text-black">
              <span>Grand Total:</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Courier Handling Instructions & QA Signoff */}
        <div className="pt-4 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-slate-600 print:text-black">
          <div>
            <div className="font-bold uppercase tracking-wider text-slate-800 print:text-black mb-1">
              ⚠️ Courier Handling Notice:
            </div>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Fragile tech gadgets & electronic accessories. Handle with care.</li>
              <li>Keep dry. Do not expose to extreme heat or moisture.</li>
              <li>Customer inquiry hotline: <strong>{helpline}</strong>.</li>
            </ul>
          </div>

          <div className="flex flex-col justify-end text-right">
            <div className="pt-8 border-t border-dashed border-slate-400 inline-block self-end text-center min-w-[160px]">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">
                Warehouse QA / Packed By
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
