import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PRODUCT_SELECT =
  'id, name, slug, description, short_description, specifications, key_features, bundle_offers, price, old_price, wholesale_price, discount, category_id, sort_order, stock_status, featured, best_seller, new_arrival, free_delivery, active, created_at, updated_at, sku, category:categories(*), product_images(*), product_variants(*)';

export async function GET() {
  const supabase = createServiceClient();
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('active', true)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (error) {
      // Fallback query with basic fields
      const { data: fallback, error: fbErr } = await supabase
        .from('products')
        .select('*, category:categories(*), product_images(*)')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (fbErr) {
        return NextResponse.json({ success: false, error: fbErr.message, products: [] }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        count: fallback?.length || 0,
        products: fallback || [],
      });
    }

    return NextResponse.json({
      success: true,
      count: products?.length || 0,
      products: products || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message, products: [] },
      { status: 500 }
    );
  }
}
