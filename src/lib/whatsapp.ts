import { formatPrice } from './utils';

export function createWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppCheckoutMessage({
  orderNumber,
  orderId,
  customerName,
  phone,
  city,
  address,
  items,
  subtotal,
  deliveryCharges,
  couponDiscount,
  bundleDiscount,
  totalAmount,
  paymentMethod,
}: {
  orderNumber?: string | null;
  orderId: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  items: {
    product_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
    variant_name?: string | null;
  }[];
  subtotal: number;
  deliveryCharges: number;
  couponDiscount: number;
  bundleDiscount: number;
  totalAmount: number;
  paymentMethod: string;
}): string {
  const displayId = orderNumber || `AS-${orderId.slice(0, 8).toUpperCase()}`;

  const itemLines = items
    .map(
      (item) =>
        `• ${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ''} x${item.quantity} — ${formatPrice(item.line_total)}`
    )
    .join('\n');

  const discountTotal = couponDiscount + bundleDiscount;

  let msg = `✨ *AS STORE — ORDER CONFIRMATION*\n\n`;
  msg += `*Order Reference:* ${displayId}\n`;
  msg += `*Customer:* ${customerName}\n`;
  msg += `*Phone:* ${phone}\n`;
  msg += `*Shipping Address:* ${address}, ${city}\n\n`;
  msg += `*Ordered Items:*\n${itemLines}\n\n`;
  msg += `*Order Summary:*\n`;
  msg += `Subtotal: ${formatPrice(subtotal)}\n`;
  msg += `Delivery Charges: ${deliveryCharges === 0 ? 'FREE' : formatPrice(deliveryCharges)}\n`;
  if (discountTotal > 0) {
    msg += `Total Discount: -${formatPrice(discountTotal)}\n`;
  }
  msg += `*Total to Pay:* ${formatPrice(totalAmount)}\n`;
  msg += `*Payment Method:* ${paymentMethod === 'online' ? 'Online Payment (Verified)' : 'Cash on Delivery (COD)'}\n\n`;
  msg += `Please confirm my order for dispatch. Thank you for shopping with AS Store!`;

  return msg;
}

export function buildProductInquiryWhatsAppMessage({
  productName,
  price,
  productUrl,
  variant,
}: {
  productName: string;
  price: number;
  productUrl: string;
  variant?: string;
}): string {
  let msg = `Hello AS Store!\n\n`;
  msg += `I would like to order this item:\n\n`;
  msg += `*Product:* ${productName}${variant ? ` (${variant})` : ''}\n`;
  msg += `*Price:* ${formatPrice(price)}\n`;
  msg += `*Product Link:* ${productUrl}\n\n`;
  msg += `Please confirm stock availability and delivery timeline.\n\nThank you!`;
  return msg;
}
