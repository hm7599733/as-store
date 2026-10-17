'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  FileText,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, cleanPakistaniPhoneDigits } from '@/lib/utils';

export default function CheckoutModal() {
  const {
    items,
    subtotal,
    couponCode,
    couponDiscount,
    bundleDiscount,
    deliveryCharges,
    totalAmount,
    isCheckoutOpen,
    closeCheckout,
    clearCart,
  } = useCart();

  const { user, profile } = useAuth();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderComplete, setOrderComplete] = useState<{
    orderId: string;
    orderNumber: string;
    whatsappUrl: string;
  } | null>(null);

  // Auto-fill logged-in customer details
  React.useEffect(() => {
    if (profile) {
      if (profile.full_name && !customerName) setCustomerName(profile.full_name);
      if (profile.phone && !phone) setPhone(profile.phone);
      if (profile.city && !city) setCity(profile.city);
      if (profile.address && !address) setAddress(profile.address);
    }
  }, [profile, isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    const digits = cleanPakistaniPhoneDigits(phone);
    if (!digits || digits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number (e.g. 0300 1234567)');
      return;
    }

    if (!city.trim()) {
      setErrorMessage('Please specify your delivery city');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('Please provide your complete shipping street address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          phone: `0${digits}`,
          city: city.trim(),
          address: address.trim(),
          coupon_code: couponCode || null,
          customer_id: user?.id || null,
          payment_method: paymentMethod,
          items: items.map((i) => ({
            product_id: i.productId,
            quantity: i.quantity,
            variant_name: i.variantName || null,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order. Please try again.');
      }

      setOrderComplete({
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        whatsappUrl: data.whatsappUrl,
      });

      clearCart();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      {/* Light-dismiss backdrop */}
      <div className="absolute inset-0" onClick={orderComplete ? undefined : closeCheckout} />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-2xl text-slate-900 transition-all"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              AS
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-slate-900">
                {orderComplete ? 'Order Confirmed!' : 'Checkout & Delivery'}
              </h3>
              <p className="text-xs text-slate-500">
                {orderComplete
                  ? 'Your order has been recorded successfully'
                  : 'Fast Cash on Delivery across Pakistan'}
              </p>
            </div>
          </div>
          {!orderComplete && (
            <button
              onClick={closeCheckout}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* ORDER SUCCESS VIEW */}
        {orderComplete ? (
          <div className="py-4 text-center space-y-6 animate-fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-xl sm:text-2xl font-black text-emerald-700">
                Order {orderComplete.orderNumber} Placed!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for choosing <strong>AS Store</strong>. Tap the button below to send your confirmation on WhatsApp for instant packing and dispatch!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Order Reference:</span>
                <strong className="text-slate-900 font-bold">{orderComplete.orderNumber}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status:</span>
                <span className="text-amber-700 font-semibold">Pending WhatsApp Confirmation</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery:</span>
                <span className="text-slate-900 font-medium">{city}, Pakistan</span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={orderComplete.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Send Confirmation on WhatsApp</span>
              </a>

              <Link
                href={`/invoice/${orderComplete.orderId}`}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              >
                <FileText className="w-4 h-4" />
                <span>View / Print Invoice</span>
              </Link>

              <button
                onClick={() => {
                  setOrderComplete(null);
                  closeCheckout();
                }}
                className="text-xs text-slate-500 hover:text-slate-800 transition pt-2"
              >
                Back to Shopping
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM VIEW */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-700">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Muhammad Ali"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* WhatsApp Phone */}
            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-700">
                WhatsApp Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300 1234567"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">We will send dispatch alerts to this WhatsApp number.</p>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-700">
                Delivery City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Lahore, Karachi, Islamabad, etc."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-700">
                Complete Delivery Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Flat No., Street, Sector / Area, Landmark"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-700">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-bold transition ${
                    paymentMethod === 'cod'
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="block">Cash on Delivery</span>
                    <span className="text-[10px] text-slate-500 font-normal">Pay at doorstep</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-bold transition ${
                    paymentMethod === 'online'
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="block">Online Transfer</span>
                    <span className="text-[10px] text-slate-500 font-normal">JazzCash / EasyPaisa</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Order Summary box */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="text-slate-900 font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {(couponDiscount > 0 || bundleDiscount > 0) && (
                <div className="flex justify-between text-emerald-700">
                  <span>Total Discount:</span>
                  <span>-{formatPrice(couponDiscount + bundleDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery:</span>
                <span>{deliveryCharges === 0 ? <strong className="text-emerald-700 font-bold uppercase">FREE</strong> : formatPrice(deliveryCharges)}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-200">
                <span className="text-slate-900">Amount to Pay:</span>
                <span className="text-blue-600 font-display text-base">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              {loading ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Confirm Order ({formatPrice(totalAmount)})</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
