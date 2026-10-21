'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Printer, MessageCircle, PhoneCall, MapPin, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { normalizePakistaniPhone } from '@/lib/whatsapp';
import type { Order } from '@/types/database';
import WhatsAppOutreachModal from '@/components/admin/WhatsAppOutreachModal';

interface DashboardRecentOrdersProps {
  orders: Order[];
}

export default function DashboardRecentOrders({ orders: initialOrders }: DashboardRecentOrdersProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  React.useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleOpenWhatsApp = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    const label = orderNumber ? `Order #${orderNumber}` : 'this order';
    if (!confirm(`Are you sure you want to permanently delete ${label}? All items for this order will be permanently erased.`)) {
      return;
    }

    setDeletingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        alert(data.error || 'Failed to delete order');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting order');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {orders.length === 0 ? (
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
                <th className="p-4 text-right">Actions & Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((ord) => {
                const displayId = ord.order_number || `AS-${ord.id.slice(0, 8).toUpperCase()}`;
                const cleanPhone = normalizePakistaniPhone(ord.phone);

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
                      {ord.phone ? (
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsApp(ord)}
                          className="text-[11px] text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 font-mono mt-0.5 text-left"
                          title="Open WhatsApp Outreach Modal"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                          <span>{ord.phone}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">{ord.phone || 'N/A'}</span>
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

                    {/* 1-Click WhatsApp & Print Slip */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp Outreach Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsApp(ord)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[11px] transition shadow-2xs hover:scale-105 active:scale-95"
                          title="Open WhatsApp Outreach Modal"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
                          <span>WhatsApp</span>
                        </button>

                        {/* Print Slip */}
                        <Link
                          href={`/admin/orders/${ord.id}/slip`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B132B] hover:bg-slate-900 text-white font-bold text-[11px] transition shadow-2xs hover:scale-105"
                          title="Print Courier Packing Slip"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#06B6D4]" />
                          <span>Print Slip</span>
                        </Link>

                        {/* Delete Order Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(ord.id, ord.order_number || '')}
                          disabled={deletingId === ord.id}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition border border-rose-200 disabled:opacity-50"
                          title="Permanently Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* WhatsApp Outreach Modal */}
      <WhatsAppOutreachModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </>
  );
}
