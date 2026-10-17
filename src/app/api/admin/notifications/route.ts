import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const revalidate = 0;

export async function GET() {
  const supabase = createServiceClient();
  try {
    const [pendingRes, latestRes] = await Promise.all([
      supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase
        .from('orders')
        .select('id, order_number, customer_name, total_amount, status, created_at, city')
        .order('created_at', { ascending: false })
        .limit(6),
    ]);

    const pendingCount = pendingRes.count || 0;
    const latestOrders = latestRes.data || [];

    return NextResponse.json({
      pendingCount,
      latestOrders,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
