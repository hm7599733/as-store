'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  Sparkles,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items,
    totalItems,
    subtotal,
    couponCode,
    couponDiscount,
    bundleDiscount,
    bundlePercentage,
    deliveryCharges,
    totalAmount,
    amountNeededForFree,
    freeShippingProgress,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    openCheckout,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [applying, setApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setApplying(true);
    await applyCoupon(inputCoupon);
    setApplying(false);
    setInputCoupon('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
      {/* Light-dismiss backdrop click */}
      <div className="absolute inset-0" onClick={closeCart} />

      {/* Drawer Panel */}
      <div
        className="relative z-10 flex flex-col w-full max-w-md h-full bg-white text-slate-900 shadow-2xl transition-all duration-300 animate-slide-in-right border-l border-slate-200"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base leading-tight text-slate-900">Your Cart</h2>
              <p className="text-xs text-slate-500">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="p-4 border-b bg-slate-50 border-slate-200">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <div className="flex items-center gap-1.5">
              <Truck className={`w-3.5 h-3.5 ${amountNeededForFree === 0 ? 'text-emerald-600' : 'text-blue-600'}`} />
              <span className="text-slate-700">
                {amountNeededForFree === 0 ? (
                  <strong className="text-emerald-700 font-bold">You unlocked Free Delivery!</strong>
                ) : (
                  <>Add <strong className="text-slate-900">{formatPrice(amountNeededForFree)}</strong> more for Free Delivery</>
                )}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                amountNeededForFree === 0 ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-1">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Explore our power banks, fast chargers, earbuds, and premium cables.
              </p>
              <button
                onClick={closeCart}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50 transition"
              >
                {/* Item Image */}
                <div className="relative w-16 h-16 rounded-lg bg-white shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold line-clamp-1 leading-snug text-slate-900">
                        {item.productName}
                      </h4>
                      {item.variantName && (
                        <span className="text-[10px] text-blue-600 block font-medium">
                          {item.variantName}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-slate-200 bg-white rounded-lg overflow-hidden shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-display text-xs font-bold text-blue-600">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
            {/* Automatic Bundle Discount Alert */}
            {bundleDiscount > 0 && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Automatic Tier Discount ({bundlePercentage}% OFF)</span>
                </div>
                <strong className="font-bold">-{formatPrice(bundleDiscount)}</strong>
              </div>
            )}

            {/* Coupon Code Input */}
            {couponCode ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Coupon &apos;{couponCode}&apos; Applied (-{formatPrice(couponDiscount)})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-rose-600 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="Promo or coupon code..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 uppercase"
                />
                <button
                  type="submit"
                  disabled={applying || !inputCoupon.trim()}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold transition"
                >
                  {applying ? 'Checking...' : 'Apply'}
                </button>
              </form>
            )}

            {/* Order Cost Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              {bundleDiscount > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Bundle Discount</span>
                  <span>-{formatPrice(bundleDiscount)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span>
                  {deliveryCharges === 0 ? (
                    <strong className="text-emerald-700 font-bold uppercase">FREE</strong>
                  ) : (
                    formatPrice(deliveryCharges)
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="font-display font-black text-base text-blue-600">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                closeCart();
                openCheckout();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Footer */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe Cash on Delivery • 7-Day Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
