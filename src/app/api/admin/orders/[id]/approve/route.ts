import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();

    // Try calling the stored procedure approve_order first
    const { data: spOrder, error: spErr } = await supabase.rpc('approve_order', {
      p_order_id: id,
    });

    if (!spErr && spOrder) {
      return NextResponse.json({ success: true, order: spOrder });
    }

    // Fallback: direct update
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AS-${randomSuffix}`;

    const { data: updatedOrder, error: updateErr } = await supabase
      .from('orders')
      .update({
        status: 'approved',
        order_number: orderNumber,
        approved_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
