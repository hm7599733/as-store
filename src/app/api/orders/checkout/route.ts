import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/server';
import { evaluateCoupon, cleanPakistaniPhoneDigits } from '@/lib/utils';
import { buildWhatsAppCheckoutMessage, createWhatsAppUrl } from '@/lib/whatsapp';
import { checkCheckoutRateLimit } from '@/lib/rate-limit';

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(10, 'Valid phone number is required').max(30),
  city: z.string().min(2, 'City is required').max(100),
  address: z.string().min(5, 'Detailed delivery address is required').max(300),
  coupon_code: z.string().nullable().optional(),
  customer_id: z.string().nullable().optional(),
  payment_method: z.enum(['cod', 'online']).default('cod'),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1),
        quantity: z.number().int().min(1),
        variant_name: z.string().nullable().optional(),
      })
    )
    .min(1, 'Cart cannot be empty'),
});

export async function POST(request: Request) {
  const rateLimit = checkCheckoutRateLimit(request);
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many checkout requests. Please wait ${rateLimit.retryAfterSeconds} seconds.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { customer_name, phone, city, address, coupon_code, customer_id, payment_method, items } = parsed.data;
    const cleanDigits = cleanPakistaniPhoneDigits(phone);
    const normalizedPhone = `0${cleanDigits}`;

    const supabase = createServiceClient();

    // Fetch verified products from DB
    const productIds = Array.from(new Set(items.map((i) => i.product_id)));
    const { data: dbProducts, error: prodErr } = await supabase
      .from('products')
      .select('id, name, price, purchase_price, stock_status, active, bundle_offers, free_delivery, product_images(image_url, is_primary)')
      .in('id', productIds);

    if (prodErr || !dbProducts || dbProducts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Could not fetch products for validation' },
        { status: 400 }
      );
    }

    const productMap = new Map<string, any>();
    dbProducts.forEach((p: any) => productMap.set(p.id, p));

    let subtotal = 0;
    const verifiedItems: {
      product_id: string;
      product_name: string;
      product_image: string | null;
      variant_name?: string | null;
      unit_price: number;
      purchase_price: number;
      quantity: number;
      line_total: number;
      free_delivery: boolean;
    }[] = [];

    for (const item of items) {
      const prod = productMap.get(item.product_id);
      if (!prod || !prod.active) {
        return NextResponse.json(
          { success: false, error: `Product "${prod?.name || item.product_id}" is no longer available.` },
          { status: 400 }
        );
      }

      if (prod.stock_status === 'out_of_stock') {
        return NextResponse.json(
          { success: false, error: `Product "${prod.name}" is out of stock.` },
          { status: 400 }
        );
      }

      let unit_price = Number(prod.price);
      if (item.variant_name && prod.bundle_offers) {
        const bundle = prod.bundle_offers.find((b: any) => b.title === item.variant_name);
        if (bundle) {
          unit_price = Number(bundle.bundle_price);
        }
      }

      const purchase_price = Number(prod.purchase_price) || 0;
      const line_total = unit_price * item.quantity;
      subtotal += line_total;

      const primaryImg =
        prod.product_images?.find((img: any) => img.is_primary)?.image_url ||
        prod.product_images?.[0]?.image_url ||
        null;

      verifiedItems.push({
        product_id: prod.id,
        product_name: prod.name,
        product_image: primaryImg,
        variant_name: item.variant_name || null,
        unit_price,
        purchase_price,
        quantity: item.quantity,
        line_total,
        free_delivery: prod.free_delivery || false,
      });
    }

    // Coupon evaluation
    let coupon_discount = 0;
    let couponId: string | null = null;
    if (coupon_code && coupon_code.trim()) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .ilike('code', coupon_code.trim())
        .maybeSingle();

      if (coupon) {
        const evaluation = evaluateCoupon(
          coupon as any,
          subtotal,
          verifiedItems.map((v) => ({
            product_id: v.product_id,
            price: v.unit_price,
            quantity: v.quantity,
          }))
        );
        if (evaluation.valid) {
          coupon_discount = evaluation.discountAmount;
          couponId = coupon.id;
        }
      }
    }

    // Fetch store settings for discounts and delivery
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    const tier1Threshold = settings?.bundle_tier1_threshold ?? 3000;
    const tier1Percent = settings?.bundle_tier1_percent ?? 5;
    const tier2Threshold = settings?.bundle_tier2_threshold ?? 6000;
    const tier2Percent = settings?.bundle_tier2_percent ?? 10;

    let bundle_discount = 0;
    // Mutually exclusive: coupon OR bundle discount
    if (coupon_discount === 0) {
      if (tier2Threshold > 0 && subtotal >= tier2Threshold) {
        bundle_discount = Math.round((subtotal * tier2Percent) / 100);
      } else if (tier1Threshold > 0 && subtotal >= tier1Threshold) {
        bundle_discount = Math.round((subtotal * tier1Percent) / 100);
      }
    }

    const freeShippingThreshold = settings?.free_shipping_threshold ?? 3000;
    const defaultDeliveryFee = settings?.delivery_charges ?? 200;
    const hasFreeDelivery = verifiedItems.some((i) => i.free_delivery);
    const delivery_charges =
      hasFreeDelivery || (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold)
        ? 0
        : defaultDeliveryFee;

    const total_amount = Math.max(0, subtotal - coupon_discount - bundle_discount + delivery_charges);

    // Create Order in Supabase
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        customer_id: customer_id || null,
        customer_name,
        phone: normalizedPhone,
        city,
        address,
        subtotal,
        delivery_charges,
        coupon_discount,
        bundle_discount,
        total_amount,
        status: 'pending',
        payment_status: payment_method === 'online' ? 'paid' : 'pending',
        payment_method: payment_method === 'online' ? 'Online Payment' : 'Cash on Delivery',
        order_source: 'web',
      })
      .select()
      .single();

    if (orderErr || !order) {
      console.error('Order creation error:', orderErr);
      return NextResponse.json(
        { success: false, error: 'Could not create order. Please try again.' },
        { status: 500 }
      );
    }

    // Insert Order Items
    const orderItemsPayload = verifiedItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      variant_name: item.variant_name,
      unit_price: item.unit_price,
      purchase_price: item.purchase_price,
      quantity: item.quantity,
      line_total: item.line_total,
    }));

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItemsPayload);
    if (itemsErr) {
      console.error('Order items error:', itemsErr);
    }

    // Increment coupon usage
    if (couponId) {
      try {
        await supabase.rpc('increment_coupon_usage', { coupon_id: couponId });
      } catch {
        try {
          await supabase
            .from('coupons')
            .update({ times_used: 1 })
            .eq('id', couponId);
        } catch {}
      }
    }

    // Generate WhatsApp notification message
    const rawWhatsAppNumber = settings?.whatsapp_number || '+92 320 1042634';
    const waMessage = buildWhatsAppCheckoutMessage({
      orderId: order.id,
      orderNumber: order.order_number,
      customerName: customer_name,
      phone: normalizedPhone,
      city,
      address,
      items: verifiedItems,
      subtotal,
      deliveryCharges: delivery_charges,
      couponDiscount: coupon_discount,
      bundleDiscount: bundle_discount,
      totalAmount: total_amount,
      paymentMethod: payment_method,
    });

    const whatsappUrl = createWhatsAppUrl(rawWhatsAppNumber, waMessage);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number || `AS-${order.id.slice(0, 8).toUpperCase()}`,
      totalAmount: total_amount,
      whatsappUrl,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
