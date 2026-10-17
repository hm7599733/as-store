import { NextResponse } from 'next/server';
import { getPublicClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code')?.trim();
    const subtotal = Number(searchParams.get('subtotal')) || 0;

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Please enter a coupon code' }, { status: 400 });
    }

    const supabase = getPublicClient();
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .ilike('code', code)
      .maybeSingle();

    if (error || !coupon) {
      return NextResponse.json({ valid: false, message: 'Coupon code not found' });
    }

    if (!coupon.active) {
      return NextResponse.json({ valid: false, message: 'This coupon is no longer active' });
    }

    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return NextResponse.json({ valid: false, message: 'This coupon has expired' });
    }

    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return NextResponse.json({ valid: false, message: 'This coupon usage limit has been reached' });
    }

    if (coupon.minimum_order && subtotal < coupon.minimum_order) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order amount of Rs. ${coupon.minimum_order.toLocaleString('en-PK')} required`,
      });
    }

    return NextResponse.json({ valid: true, coupon });
  } catch (err: any) {
    return NextResponse.json({ valid: false, message: err.message }, { status: 500 });
  }
}
