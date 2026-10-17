import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { cleanPakistaniPhoneDigits } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    if (!userId && !phone && !email) {
      return NextResponse.json(
        { success: false, error: 'User identifier is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        phone,
        city,
        address,
        total_amount,
        subtotal,
        delivery_charges,
        coupon_discount,
        payment_method,
        payment_status,
        status,
        created_at,
        order_items (
          id,
          product_name,
          quantity,
          unit_price,
          line_total,
          variant_name
        )
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('customer_id', userId);
    } else if (phone) {
      const clean = cleanPakistaniPhoneDigits(phone);
      query = query.eq('phone', `0${clean}`);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Fetch customer orders error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch customer orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
    });
  } catch (err: any) {
    console.error('Customer orders route error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
