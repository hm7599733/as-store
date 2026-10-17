import { NextResponse } from 'next/server';
import { getPublicClient, createServiceClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = getPublicClient();
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const finalSettings = { ...(settings || {}) };
    if (!finalSettings.business_name || finalSettings.business_name.toLowerCase().includes('sth')) {
      finalSettings.business_name = 'AS Store';
    }

    return NextResponse.json({ success: true, settings: finalSettings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from('settings')
      .update(body)
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
