'use client';

import React, { useState, useEffect } from 'react';
import {
  Tag,
  CheckCircle2,
  Ticket,
  Plus,
  RefreshCw,
  Trash2,
  X,
  Check,
  AlertCircle,
  Copy,
  Percent,
  DollarSign,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Coupon } from '@/types/database';

interface CouponFormData {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  minimum_order: string;
  maximum_discount: string;
  usage_limit: string;
  active: boolean;
}

const initialFormData: CouponFormData = {
  code: '',
  discount_type: 'percentage',
  discount_value: '',
  minimum_order: '',
  maximum_discount: '',
  usage_limit: '',
  active: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error('Failed to fetch coupons', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setFormData(initialFormData);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    if (!formData.code.trim()) {
      setErrorMsg('Coupon code is required (e.g. AS10)');
      setSubmitting(false);
      return;
    }

    if (!formData.discount_value || isNaN(Number(formData.discount_value)) || Number(formData.discount_value) <= 0) {
      setErrorMsg('Please enter a valid discount value');
      setSubmitting(false);
      return;
    }

    const payload = {
      code: formData.code.trim().toUpperCase(),
      discount_type: formData.discount_type,
      discount_value: Number(formData.discount_value),
      minimum_order: formData.minimum_order ? Number(formData.minimum_order) : null,
      maximum_discount: formData.maximum_discount ? Number(formData.maximum_discount) : null,
      usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
      active: formData.active,
    };

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Coupon '${payload.code}' created successfully!`);
        setIsModalOpen(false);
        fetchCoupons();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to create coupon');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (couponId: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon '${code}'?`)) return;

    setActionLoading(couponId);
    try {
      const res = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== couponId));
        setSuccessMsg(`Coupon '${code}' deleted successfully.`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    setActionLoading(coupon.id);
    const newStatus = !coupon.active;
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newStatus }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, active: newStatus } : c))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeCount = coupons.filter((c) => c.active).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.times_used || 0), 0);

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
              Checkout Vouchers
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Discount Vouchers & Promo Codes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create and manage promotional discount vouchers for <strong>AS Gadgets</strong> customer checkout.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchCoupons}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-900 text-white text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#06B6D4]" />
            <span>Add New Coupon</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Coupons</span>
          <div className="font-display text-2xl font-black text-slate-900 mt-1">
            {coupons.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Configured promo voucher codes</span>
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

      {/* Table Container */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading coupons...</span>
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Ticket className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">All coupons have been deleted</div>
              <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                No active promotional discount vouchers currently exist. Click below to add your first coupon code.
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-900 text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#06B6D4]" />
              <span>Create First Coupon</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Voucher Code</th>
                  <th className="p-4">Discount Type</th>
                  <th className="p-4">Savings Value</th>
                  <th className="p-4">Minimum Order</th>
                  <th className="p-4">Times Used</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((coupon) => {
                  const isProcessing = actionLoading === coupon.id;
                  const isCopied = copiedCode === coupon.code;

                  return (
                    <tr key={coupon.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-[#06B6D4] font-mono font-black text-xs tracking-wider shadow-2xs">
                            <Ticket className="w-3.5 h-3.5 text-[#06B6D4]" />
                            <span>{coupon.code}</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(coupon.code)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                            title="Copy code"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
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
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          disabled={isProcessing}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                            coupon.active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title="Click to toggle status"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              coupon.active ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          <span>{coupon.active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                          disabled={isProcessing}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display font-black text-lg text-slate-900">
                    Add New Promo Coupon
                  </h2>
                  <p className="text-xs text-slate-500">
                    Create a promotional discount code for customers.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* Coupon Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. AS10, GADGETS500, WELCOME"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 font-mono font-bold tracking-wider uppercase"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Customers will enter this code at checkout</span>
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_type: e.target.value as 'percentage' | 'fixed',
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 font-semibold"
                  >
                    <option value="percentage">Percentage Discount (% Off)</option>
                    <option value="fixed">Fixed Cash Amount (PKR Off)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount Value *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      max={formData.discount_type === 'percentage' ? 100 : undefined}
                      value={formData.discount_value}
                      onChange={(e) =>
                        setFormData({ ...formData, discount_value: e.target.value })
                      }
                      placeholder={formData.discount_type === 'percentage' ? '10' : '500'}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 font-bold"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                      {formData.discount_type === 'percentage' ? '%' : 'PKR'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Minimum Order & Usage Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Minimum Order Value (PKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minimum_order}
                    onChange={(e) =>
                      setFormData({ ...formData, minimum_order: e.target.value })
                    }
                    placeholder="e.g. 2500 (Optional)"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Leave empty for no minimum</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Usage Limit (Max Uses)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usage_limit}
                    onChange={(e) =>
                      setFormData({ ...formData, usage_limit: e.target.value })
                    }
                    placeholder="e.g. 100 (Optional)"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Leave empty for unlimited</span>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span>Active & Redeemable Immediately</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-900 text-white text-xs font-bold shadow-sm transition disabled:opacity-50 active:scale-95 cursor-pointer"
                >
                  {submitting ? (
                    <span>Creating Coupon...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#06B6D4]" />
                      <span>Create Coupon</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
