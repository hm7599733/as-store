import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET() {
  try {
    const supabase = createServiceClient();

    // Fetch categories along with products count
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('products').select('id, category_id'),
    ]);

    if (catRes.error) {
      return NextResponse.json({ success: false, error: catRes.error.message }, { status: 500 });
    }

    const categories = catRes.data || [];
    const products = prodRes.data || [];

    // Map product counts
    const productCounts: Record<string, number> = {};
    products.forEach((p) => {
      if (p.category_id) {
        productCounts[p.category_id] = (productCounts[p.category_id] || 0) + 1;
      }
    });

    const enriched = categories.map((c) => ({
      ...c,
      products_count: productCounts[c.id] || 0,
    }));

    return NextResponse.json({ success: true, categories: enriched });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug: customSlug, image_url, description, active = true } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const slug = (customSlug?.trim() ? slugify(customSlug) : slugify(name)) || `cat-${Date.now()}`;

    const supabase = createServiceClient();

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const { data: newCat, error } = await supabase
      .from('categories')
      .insert({
        name: name.trim(),
        slug: finalSlug,
        image_url: image_url?.trim() || null,
        description: description?.trim() || null,
        active: Boolean(active),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category: newCat });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
