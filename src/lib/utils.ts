import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Coupon } from '@/types/database';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rs. 0';
  }
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

export function cleanPakistaniPhoneDigits(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('92')) {
    return cleaned.slice(2);
  }
  if (cleaned.startsWith('0')) {
    return cleaned.slice(1);
  }
  return cleaned;
}

export function normalizePhoneNumber(phone: string): string {
  const digits = cleanPakistaniPhoneDigits(phone);
  if (!digits) return '';
  return `92${digits}`;
}

export function calculateSavings(price: number, oldPrice: number | null | undefined) {
  if (!oldPrice || oldPrice <= price) {
    return { percentage: 0, amount: 0 };
  }
  const amount = oldPrice - price;
  const percentage = Math.round((amount / oldPrice) * 100);
  return { percentage, amount };
}

export interface CouponEvaluationResult {
  valid: boolean;
  message: string;
  discountAmount: number;
}

export function evaluateCoupon(
  coupon: Coupon,
  subtotal: number,
  items?: { product_id: string; price: number; quantity: number }[]
): CouponEvaluationResult {
  if (!coupon || !coupon.active) {
    return { valid: false, message: 'This coupon is invalid or inactive', discountAmount: 0 };
  }

  if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
    return { valid: false, message: 'This coupon has expired', discountAmount: 0 };
  }

  if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
    return { valid: false, message: 'This coupon usage limit has been reached', discountAmount: 0 };
  }

  if (coupon.minimum_order && subtotal < coupon.minimum_order) {
    return {
      valid: false,
      message: `Minimum order of Rs. ${coupon.minimum_order.toLocaleString('en-PK')} required for this coupon`,
      discountAmount: 0,
    };
  }

  let applicableSubtotal = subtotal;
  if (coupon.applicable_product_ids && coupon.applicable_product_ids.length > 0 && items) {
    applicableSubtotal = items
      .filter((i) => coupon.applicable_product_ids!.includes(i.product_id))
      .reduce((sum, i) => sum + i.price * i.quantity, 0);

    if (applicableSubtotal <= 0) {
      return {
        valid: false,
        message: 'This coupon is not valid for any items in your cart',
        discountAmount: 0,
      };
    }
  }

  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = Math.round((applicableSubtotal * coupon.discount_value) / 100);
  } else {
    discount = coupon.discount_value;
  }

  if (coupon.maximum_discount && discount > coupon.maximum_discount) {
    discount = coupon.maximum_discount;
  }

  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    message: `Coupon applied: Rs. ${discount.toLocaleString('en-PK')} discount`,
    discountAmount: discount,
  };
}
