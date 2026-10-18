import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServiceClient();
  try {
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ coupons: coupons || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabase = createServiceClient();
  try {
    const body = await req.json();
    const {
      code,
      discount_type = 'percentage',
      discount_value,
      minimum_order,
      maximum_discount,
      usage_limit,
      active = true,
    } = body;

    if (!code || !code.trim()) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    if (discount_value === undefined || discount_value === null || Number(discount_value) <= 0) {
      return NextResponse.json({ error: 'A valid discount value is required' }, { status: 400 });
    }

    const numValue = Number(discount_value);
    if (discount_type === 'percentage' && numValue > 100) {
      return NextResponse.json({ error: 'Percentage discount cannot exceed 100%' }, { status: 400 });
    }

    // Check if coupon with same code already exists
    const { data: existing } = await supabase
      .from('coupons')
      .select('id')
      .eq('code', cleanCode)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: `Coupon code '${cleanCode}' already exists` },
        { status: 400 }
      );
    }

    const { data: newCoupon, error: insertErr } = await supabase
      .from('coupons')
      .insert({
        code: cleanCode,
        discount_type,
        discount_value: numValue,
        minimum_order: minimum_order ? Number(minimum_order) : null,
        maximum_discount: maximum_discount ? Number(maximum_discount) : null,
        usage_limit: usage_limit ? Number(usage_limit) : null,
        active: Boolean(active),
        times_used: 0,
      })
      .select()
      .single();

    if (insertErr || !newCoupon) {
      return NextResponse.json(
        { error: insertErr?.message || 'Failed to create coupon' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
