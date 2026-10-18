import { formatPrice } from './utils';

export const OFFICIAL_STORE_PHONE = '+92 320 1042634';
export const OFFICIAL_STORE_PHONE_CLEAN = '923201042634';
export const OFFICIAL_STORE_NAME = 'AS GADGETS';

export interface CourierOption {
  id: string;
  name: string;
  trackingUrl: (cn: string) => string;
}

export const COURIER_PARTNERS: CourierOption[] = [
  {
    id: 'trax',
    name: 'Trax Logistics',
    trackingUrl: (cn: string) => `https://trax.pk/tracking?tracking_number=${encodeURIComponent(cn)}`,
  },
  {
    id: 'tcs',
    name: 'TCS Express',
    trackingUrl: (cn: string) => `https://www.tcsexpress.com/tracking?track=${encodeURIComponent(cn)}`,
  },
  {
    id: 'leopard',
    name: 'Leopard Courier',
    trackingUrl: (cn: string) => `https://www.leopardscourier.com/tracking?track=${encodeURIComponent(cn)}`,
  },
  {
    id: 'postex',
    name: 'PostEx',
    trackingUrl: (cn: string) => `https://postex.pk/tracking?order_id=${encodeURIComponent(cn)}`,
  },
  {
    id: 'callcourier',
    name: 'Call Courier',
    trackingUrl: (cn: string) => `https://callcourier.com.pk/tracking/?tc=${encodeURIComponent(cn)}`,
  },
  {
    id: 'mnp',
    name: 'M&P Express',
    trackingUrl: (cn: string) => `https://mulphilog.com/tracking?consignment=${encodeURIComponent(cn)}`,
  },
  {
    id: 'rider',
    name: 'Direct Rider / Same Day',
    trackingUrl: () => `https://asgadgets.store`,
  },
];

export function normalizePakistaniPhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('03') && digits.length === 11) {
    return '92' + digits.slice(1);
  }
  if (digits.startsWith('923') && digits.length === 12) {
    return digits;
  }
  if (digits.startsWith('3') && digits.length === 10) {
    return '92' + digits;
  }
  return digits;
}

export function createWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanNumber = normalizePakistaniPhone(phoneNumber);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export type WhatsAppTemplateId =
  | 'order_confirmation'
  | 'order_dispatched'
  | 'address_request'
  | 'missed_call'
  | 'delivered_feedback'
  | 'vip_promo';

export interface WhatsAppTemplateMeta {
  id: WhatsAppTemplateId;
  title: string;
  description: string;
  category: 'verification' | 'logistics' | 'support' | 'marketing';
  icon: string;
}

export const WHATSAPP_TEMPLATES: WhatsAppTemplateMeta[] = [
  {
    id: 'order_confirmation',
    title: 'Order Confirmation (COD Verify)',
    description: 'Verify phone, delivery address, and COD payable before packing.',
    category: 'verification',
    icon: 'PackageCheck',
  },
  {
    id: 'order_dispatched',
    title: 'Dispatched & Tracking CN#',
    description: 'Notify courier name, tracking number, and expected delivery window.',
    category: 'logistics',
    icon: 'Truck',
  },
  {
    id: 'address_request',
    title: 'Incomplete Address / Landmark',
    description: 'Ask buyer for house/street number and prominent landmark.',
    category: 'verification',
    icon: 'MapPin',
  },
  {
    id: 'missed_call',
    title: 'Missed Call Follow-up',
    description: 'Follow up when phone call was unanswered during verification.',
    category: 'verification',
    icon: 'PhoneMissed',
  },
  {
    id: 'delivered_feedback',
    title: 'Delivery & 7-Day Warranty',
    description: 'Post-delivery satisfaction check and 7-day warranty support info.',
    category: 'support',
    icon: 'Star',
  },
  {
    id: 'vip_promo',
    title: 'VIP Deals & New Arrivals',
    description: 'Exclusive discount code and catalog link for repeat buyers.',
    category: 'marketing',
    icon: 'Gift',
  },
];

export interface WhatsAppOrderContext {
  orderNumber?: string | null;
  orderId?: string;
  customerName?: string;
  phone?: string;
  city?: string;
  address?: string;
  totalAmount?: number;
  items?: { product_name: string; quantity: number; variant_name?: string | null }[];
  courierName?: string;
  trackingNumber?: string;
}

export function generateTemplateMessage(
  templateId: WhatsAppTemplateId,
  context: WhatsAppOrderContext
): string {
  const name = context.customerName ? context.customerName.trim() : 'Customer';
  const displayId = context.orderNumber || (context.orderId ? `AS-${context.orderId.slice(0, 8).toUpperCase()}` : 'AS-ORD');
  const city = context.city || 'your city';
  const address = context.address || 'Address provided';
  const amountStr = context.totalAmount !== undefined ? formatPrice(context.totalAmount) : 'N/A';
  
  const itemsStr = (context.items && context.items.length > 0)
    ? context.items.map((i) => `• ${i.product_name}${i.variant_name ? ` (${i.variant_name})` : ''} x${i.quantity}`).join('\n')
    : '• AS Gadgets Premium Accessories';

  switch (templateId) {
    case 'order_confirmation':
      return `Assalam-o-Alaikum *${name}*! 🌟
AS Gadgets ki taraf se aapka Cash on Delivery order *#${displayId}* receive ho chuka hai.

📦 *Ordered Items:*
${itemsStr}

💰 *Total COD Amount:* ${amountStr}
📍 *Delivery Address:* ${address}, ${city}

Rider dispatch karne se pehle order confirm karne ke liye:
👉 *Yes Confirm* likh kar reply karein.

_(Agar koi address ya contact number change karwana ho to barah-e-karam abhi bata dein)._

Shukriya!
*Team AS GADGETS*
Helpline: ${OFFICIAL_STORE_PHONE}`;

    case 'order_dispatched': {
      const courier = context.courierName || 'Trax / TCS';
      const tracking = context.trackingNumber || 'Available Shortly';
      const matchedCourier = COURIER_PARTNERS.find((c) => c.name.toLowerCase() === courier.toLowerCase() || c.id === courier.toLowerCase());
      const trackUrl = matchedCourier && context.trackingNumber ? matchedCourier.trackingUrl(context.trackingNumber) : '';

      return `Assalam-o-Alaikum *${name}*! 🚚
Khushkhabri! Aapka AS Gadgets order *#${displayId}* dispatch kar diya gaya hai.

📦 *Courier Partner:* ${courier}
🔢 *Tracking CN #:* ${tracking}
💵 *COD Payable Amount:* ${amountStr}
⏱️ *Expected Delivery:* 2 to 3 working days
${trackUrl ? `\n🔗 *Track Online:* ${trackUrl}` : ''}

Courier rider delivery se pehle call karega. Barah-e-karam exact cash ready rakhein. Parcel receive hone ke baad check karein.

Shukriya for choosing AS Gadgets!
*Team AS GADGETS*
Helpline: ${OFFICIAL_STORE_PHONE}`;
    }

    case 'address_request':
      return `Assalam-o-Alaikum *${name}*! 📍
Aapka AS Gadgets order *#${displayId}* ready hai.

Magar courier delivery rider ke liye aapka complete address aur nearby famous landmark (e.g. mashhoor masjid, plaza, school, ya gali number) darkaar hai taake parcel timely deliver ho sake.

Barah-e-karam apna mukammal address reply karein:
1. House / Flat # & Street / Gali:
2. Famous Landmark / Chowk:
3. Alternate Phone Number (if any):

Aapka parcel confirmation milte hi dispatch kar diya jayega.

Shukriya!
*Team AS GADGETS*
Helpline: ${OFFICIAL_STORE_PHONE}`;

    case 'missed_call':
      return `Assalam-o-Alaikum *${name}*! 📞
Humne aapke order *#${displayId}* ki verification ke liye call ki thi magar aap se rabta nahi ho saka.

Agar aap yeh parcel receive karna chahte hain to barah-e-karam yahan WhatsApp par *Confirm* likh kar reply karein ya call back karein taake hum aaj hi aapka parcel dispatch kar sakein.

Shukriya!
*Team AS GADGETS*
Helpline: ${OFFICIAL_STORE_PHONE}`;

    case 'delivered_feedback':
      return `Assalam-o-Alaikum *${name}*! ⭐
Aapka AS Gadgets order *#${displayId}* deliver ho chuka hai.

Umeed hai aapko hamari products aur fast delivery pasand aayi hogi!
🛡️ *7 Days Replacement Warranty:* Kisi bhi issue, damage ya help ke liye hum yahan dastiyaab hain.

Aapka review hamare liye bohat keemti hai! Aapko product kesi lagi?

Shukriya!
*Team AS GADGETS*
Helpline: ${OFFICIAL_STORE_PHONE}`;

    case 'vip_promo':
      return `Assalam-o-Alaikum *${name}*! 🎁
AS Gadgets ke valued customer hone ke naate, aapke liye hamari taraf se exclusive privilege offer!

Naye premium smart gadgets aur accessories wholesale rate par stock mein aa chuki hain:
⚡ Premium Earbuds, Smartwatches, Fast Chargers, & Powerbanks.
🎁 Use Coupon: *ASVIP5* for extra discount on your next order!

Koi bhi product order karne ke liye yahan reply karein ya website visit karein.

*Team AS GADGETS*
Helpline: ${OFFICIAL_STORE_PHONE}`;

    default:
      return `Assalam-o-Alaikum *${name}*! AS Gadgets helpline par rabta karne ka shukriya. Hum aapki kya madad kar sakte hain?`;
  }
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

  let msg = `✨ *AS GADGETS — ORDER CONFIRMATION*\n\n`;
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
  msg += `Please confirm my order for dispatch. Thank you for shopping with AS Gadgets!`;

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
  let msg = `Assalam-o-Alaikum AS Gadgets!\n\n`;
  msg += `I would like to order this item:\n\n`;
  msg += `*Product:* ${productName}${variant ? ` (${variant})` : ''}\n`;
  msg += `*Price:* ${formatPrice(price)}\n`;
  msg += `*Product Link:* ${productUrl}\n\n`;
  msg += `Please confirm stock availability and delivery timeline.\n\nThank you!`;
  return msg;
}
