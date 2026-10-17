'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Truck,
  Check,
  Tag,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/components/theme/ThemeProvider';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items,
    totalItems,
    subtotal,
    couponCode,
    couponDiscount,
    couponStatus,
    couponMessage,
    bundleDiscount,
    bundlePercentage,
    deliveryCharges,
    freeShippingThreshold,
    totalAmount,
    isCartOpen,
    closeCart,
    openCheckout,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [inputCoupon, setInputCoupon] = useState('');
  const [applying, setApplying] = useState(false);

  if (!isCartOpen) return null;

  // Free delivery progress calculation
  const amountNeededForFree = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setApplying(true);
    await applyCoupon(inputCoupon);
    setApplying(false);
    setInputCoupon('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Light-dismiss backdrop click */}
      <div className="absolute inset-0" onClick={closeCart} />

      {/* Drawer Panel */}
      <div
        className={`relative z-10 flex flex-col w-full max-w-md h-full shadow-2xl transition-all duration-300 animate-slide-in-right ${
          isLight ? 'bg-white text-slate-900' : 'bg-[#070B14] text-white border-l border-slate-800'
        }`}
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base leading-tight">Your Cart</h2>
              <p className="text-xs text-slate-400">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className={`p-4 border-b ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800/60'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <div className="flex items-center gap-1.5">
              <Truck className={`w-3.5 h-3.5 ${amountNeededForFree === 0 ? 'text-emerald-400' : 'text-blue-400'}`} />
              <span>
                {amountNeededForFree === 0 ? (
                  <strong className="text-emerald-400 font-bold">You unlocked Free Delivery!</strong>
                ) : (
                  <>Add <strong>{formatPrice(amountNeededForFree)}</strong> more for Free Delivery</>
                )}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                amountNeededForFree === 0 ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-base mb-1">Your cart is empty</h3>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                Explore our power banks, fast chargers, earbuds, and premium cables.
              </p>
              <button
                onClick={closeCart}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-glow"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={`flex gap-3.5 p-3.5 rounded-xl border transition ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-900/60 border-slate-800/80'
                }`}
              >
                {/* Item Image */}
                <div className="relative w-16 h-16 rounded-lg bg-slate-950/40 shrink-0 overflow-hidden border border-slate-800 flex items-center justify-center">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-slate-600" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold line-clamp-1 leading-snug">
                        {item.productName}
                      </h4>
                      {item.variantName && (
                        <span className="text-[10px] text-blue-400 block font-medium">
                          {item.variantName}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-500 hover:text-rose-400 transition p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-slate-700/80 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-800 text-slate-300 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-slate-800 text-slate-300 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-display text-xs font-bold text-blue-500">
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
          <div className={`p-5 border-t space-y-4 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#080C17] border-slate-800'
          }`}>
            {/* Automatic Bundle Discount Alert */}
            {bundleDiscount > 0 && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Automatic Tier Discount ({bundlePercentage}% OFF)</span>
                </div>
                <strong className="font-bold">-{formatPrice(bundleDiscount)}</strong>
              </div>
            )}

            {/* Coupon Code Input */}
            {couponCode ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Coupon &apos;{couponCode}&apos; Applied (-{formatPrice(couponDiscount)})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-rose-400 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                  placeholder="Promo or coupon code"
                  className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-blue-500 ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-900 border-slate-800 text-white'
                  }`}
                />
                <button
                  type="submit"
                  disabled={applying || !inputCoupon.trim()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold disabled:opacity-50 transition"
                >
                  {applying ? 'Checking...' : 'Apply'}
                </button>
              </form>
            )}

            {/* Summary Lines */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className={isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold'}>
                  {formatPrice(subtotal)}
                </span>
              </div>

              {bundleDiscount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Bundle Savings</span>
                  <span>-{formatPrice(bundleDiscount)}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Delivery Charges</span>
                <span>{deliveryCharges === 0 ? <strong className="text-emerald-400">FREE</strong> : formatPrice(deliveryCharges)}</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-black pt-2 border-t border-slate-800">
                <span className={isLight ? 'text-slate-900' : 'text-white'}>Total</span>
                <span className="font-display text-blue-500">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={openCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-glow active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
