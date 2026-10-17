'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { CartItem, Product, Coupon } from '@/types/database';
import { evaluateCoupon } from '@/lib/utils';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  couponCode: string;
  couponDiscount: number;
  couponStatus: 'idle' | 'checking' | 'valid' | 'invalid';
  couponMessage: string;
  bundleDiscount: number;
  bundlePercentage: number;
  deliveryCharges: number;
  freeShippingThreshold: number;
  totalAmount: number;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addToCart: (
    product: Product,
    quantity?: number,
    variantName?: string,
    customPrice?: number
  ) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'as_store_cart_v1';
const COUPON_STORAGE_KEY = 'as_store_coupon_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponStatus, setCouponStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [couponMessage, setCouponMessage] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [bundleTier1Threshold, setBundleTier1Threshold] = useState(3000);
  const [bundleTier1Percent, setBundleTier1Percent] = useState(5);
  const [bundleTier2Threshold, setBundleTier2Threshold] = useState(6000);
  const [bundleTier2Percent, setBundleTier2Percent] = useState(10);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(3000);
  const [deliveryFee, setDeliveryFee] = useState(200);

  // Initialize from localStorage and fetch settings
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        if (parsed.code) {
          setCouponCode(parsed.code);
          setCouponDiscount(parsed.discount || 0);
          setCouponStatus('valid');
        }
      }
    } catch {
      // ignore storage error
    }

    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.bundle_tier1_threshold !== undefined) setBundleTier1Threshold(data.settings.bundle_tier1_threshold);
          if (data.settings.bundle_tier1_percent !== undefined) setBundleTier1Percent(data.settings.bundle_tier1_percent);
          if (data.settings.bundle_tier2_threshold !== undefined) setBundleTier2Threshold(data.settings.bundle_tier2_threshold);
          if (data.settings.bundle_tier2_percent !== undefined) setBundleTier2Percent(data.settings.bundle_tier2_percent);
          if (data.settings.free_shipping_threshold !== undefined) setFreeShippingThreshold(data.settings.free_shipping_threshold);
          if (data.settings.delivery_charges !== undefined) setDeliveryFee(data.settings.delivery_charges);
        }
      })
      .catch(() => {});
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items]);

  // Bundle discount: applies if no coupon is active
  const { bundleDiscount, bundlePercentage } = useMemo(() => {
    if (couponDiscount > 0) {
      return { bundleDiscount: 0, bundlePercentage: 0 };
    }
    if (bundleTier2Threshold > 0 && subtotal >= bundleTier2Threshold) {
      return {
        bundleDiscount: Math.round((subtotal * bundleTier2Percent) / 100),
        bundlePercentage: bundleTier2Percent,
      };
    }
    if (bundleTier1Threshold > 0 && subtotal >= bundleTier1Threshold) {
      return {
        bundleDiscount: Math.round((subtotal * bundleTier1Percent) / 100),
        bundlePercentage: bundleTier1Percent,
      };
    }
    return { bundleDiscount: 0, bundlePercentage: 0 };
  }, [subtotal, couponDiscount, bundleTier1Threshold, bundleTier1Percent, bundleTier2Threshold, bundleTier2Percent]);

  // Free delivery check
  const hasFreeDeliveryProduct = useMemo(() => items.some((i) => i.freeDelivery), [items]);
  const deliveryCharges = useMemo(() => {
    if (items.length === 0) return 0;
    if (hasFreeDeliveryProduct) return 0;
    if (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) return 0;
    return deliveryFee;
  }, [items.length, hasFreeDeliveryProduct, freeShippingThreshold, subtotal, deliveryFee]);

  const totalAmount = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(0, subtotal - couponDiscount - bundleDiscount + deliveryCharges);
  }, [items.length, subtotal, couponDiscount, bundleDiscount, deliveryCharges]);

  const addToCart = (
    product: Product,
    quantity = 1,
    variantName?: string,
    customPrice?: number
  ) => {
    const unitPrice = customPrice !== undefined ? customPrice : product.price;
    const itemId = variantName ? `${product.id}_${variantName}` : product.id;
    const primaryImage =
      product.product_images?.find((img) => img.is_primary)?.image_url ||
      product.product_images?.[0]?.image_url ||
      null;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          productName: product.name,
          unitPrice,
          quantity,
          imageUrl: primaryImage,
          variantName,
          freeDelivery: product.free_delivery || false,
        },
      ];
    });

    showToast(`Added "${product.name}" to your cart`, 'success');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setCouponDiscount(0);
    setCouponStatus('idle');
    setCouponMessage('');
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {}
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return false;

    setCouponStatus('checking');
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(cleanCode)}&subtotal=${subtotal}`);
      const data = await res.json();

      if (data.valid && data.coupon) {
        const evalResult = evaluateCoupon(
          data.coupon as Coupon,
          subtotal,
          items.map((i) => ({
            product_id: i.productId,
            price: i.unitPrice,
            quantity: i.quantity,
          }))
        );

        if (evalResult.valid) {
          setCouponCode(cleanCode);
          setCouponDiscount(evalResult.discountAmount);
          setCouponStatus('valid');
          setCouponMessage(evalResult.message);
          try {
            localStorage.setItem(
              COUPON_STORAGE_KEY,
              JSON.stringify({ code: cleanCode, discount: evalResult.discountAmount })
            );
          } catch {}
          showToast(`Coupon applied! Saved Rs. ${evalResult.discountAmount.toLocaleString('en-PK')}`, 'success');
          return true;
        } else {
          setCouponStatus('invalid');
          setCouponMessage(evalResult.message);
          showToast(evalResult.message, 'error');
          return false;
        }
      } else {
        setCouponStatus('invalid');
        setCouponMessage(data.message || 'Invalid coupon code');
        showToast(data.message || 'Invalid coupon code', 'error');
        return false;
      }
    } catch {
      setCouponStatus('invalid');
      setCouponMessage('Failed to validate coupon');
      showToast('Failed to validate coupon', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponStatus('idle');
    setCouponMessage('');
    try {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {}
    showToast('Coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
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
        isCheckoutOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        openCheckout: () => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        },
        closeCheckout: () => setIsCheckoutOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
