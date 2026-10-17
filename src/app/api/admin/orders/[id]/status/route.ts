import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, tracking_number, courier_name } = await request.json();

    const supabase = createServiceClient();
    const updatePayload: Record<string, any> = { status };
    if (tracking_number !== undefined) updatePayload.tracking_number = tracking_number;
    if (courier_name !== undefined) updatePayload.courier_name = courier_name;

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
