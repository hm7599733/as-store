import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // 1. Delete associated order items first to maintain clean referential integrity
    const { error: itemsErr } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id);

    if (itemsErr) {
      console.warn('Warning deleting order_items:', itemsErr.message);
    }

    // 2. Delete the order record
    const { error: orderErr } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (orderErr) {
      return NextResponse.json(
        { success: false, error: orderErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order and associated items permanently deleted',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
