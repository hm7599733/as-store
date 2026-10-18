import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  try {
    const { error } = await supabase.from('coupons').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  try {
    const body = await req.json();
    const updatePayload: Record<string, any> = {};

    if (body.active !== undefined) updatePayload.active = Boolean(body.active);
    if (body.code !== undefined) updatePayload.code = body.code.trim().toUpperCase();
    if (body.discount_type !== undefined) updatePayload.discount_type = body.discount_type;
    if (body.discount_value !== undefined) updatePayload.discount_value = Number(body.discount_value);
    if (body.minimum_order !== undefined) updatePayload.minimum_order = body.minimum_order ? Number(body.minimum_order) : null;
    if (body.maximum_discount !== undefined) updatePayload.maximum_discount = body.maximum_discount ? Number(body.maximum_discount) : null;
    if (body.usage_limit !== undefined) updatePayload.usage_limit = body.usage_limit ? Number(body.usage_limit) : null;

    const { data: updated, error } = await supabase
      .from('coupons')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, coupon: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
