import { createServiceClient } from '@/lib/supabase/server';
import type { Category, Product, Settings } from '@/types/database';

const PRODUCT_SELECT =
  'id, name, slug, description, short_description, specifications, key_features, bundle_offers, price, old_price, wholesale_price, discount, category_id, sort_order, stock_status, featured, best_seller, new_arrival, free_delivery, active, created_at, updated_at, sku, category:categories(*), product_images(*), product_variants(*)';

const FALLBACK_SELECT =
  'id, name, slug, description, short_description, specifications, price, old_price, wholesale_price, discount, category_id, stock_status, featured, best_seller, new_arrival, free_delivery, active, created_at, updated_at, category:categories(*), product_images(*)';

export async function getAllActiveProducts(limit = 100): Promise<Product[]> {
  const supabase = createServiceClient();
  try {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('active', true)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!error && data && data.length > 0) {
      return data as unknown as Product[];
    }

    const fallback = await supabase
      .from('products')
      .select(FALLBACK_SELECT)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (fallback.data && fallback.data.length > 0) {
      return fallback.data as unknown as Product[];
    }

    // Secondary fallback without active filter if none returned
    const basic = await supabase
      .from('products')
      .select('*, category:categories(*), product_images(*)')
      .limit(limit);

    return (basic.data as unknown as Product[]) || [];
  } catch (err) {
    console.error('getAllActiveProducts error:', err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServiceClient();
  try {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle();

    if (!error && data) {
      return data as unknown as Product;
    }

    const fallback = await supabase
      .from('products')
      .select(FALLBACK_SELECT)
      .eq('slug', slug)
      .maybeSingle();

    return (fallback.data as unknown as Product) || null;
  } catch {
    return null;
  }
}

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = createServiceClient();
  try {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('name');
    return (data as Category[]) || [];
  } catch {
    return [];
  }
}

export async function getSettings(): Promise<Settings | null> {
  const supabase = createServiceClient();
  try {
    const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    if (!data) {
      return {
        id: 1,
        business_name: 'AS Store',
        logo_url: null,
        whatsapp_number: '+92 320 1042634',
        email: 'support@asstore.pk',
        address: 'Lahore, Pakistan',
        facebook: null,
        instagram: null,
        tiktok: null,
        business_greeting: 'Hello AS Store!',
        order_message_template: 'Hello AS Store! I want to confirm my order.',
        currency: 'PKR',
        currency_symbol: 'Rs.',
        delivery_charges: 200,
        free_shipping_threshold: 3000,
        bundle_tier1_threshold: 3000,
        bundle_tier1_percent: 5,
        bundle_tier2_threshold: 6000,
        bundle_tier2_percent: 10,
        updated_at: new Date().toISOString(),
      };
    }

    const settings = { ...(data as Settings) };
    if (!settings.business_name || settings.business_name.toLowerCase().includes('sth')) {
      settings.business_name = 'AS Store';
    }
    if (settings.email && settings.email.toLowerCase().includes('sth')) {
      settings.email = 'support@asstore.pk';
    }

    return settings;
  } catch {
    return null;
  }
}

export async function getRelatedProducts(
  categoryId: string | null,
  excludeId: string,
  limit = 4
): Promise<Product[]> {
  const supabase = createServiceClient();
  try {
    let query = supabase
      .from('products')
      .select(FALLBACK_SELECT)
      .eq('active', true)
      .neq('id', excludeId)
      .limit(limit);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data } = await query;
    return (data as unknown as Product[]) || [];
  } catch {
    return [];
  }
}
