import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

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
  const supabase = createServiceClient();
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, category:categories(id, name, slug), product_images(id, image_url, is_primary, sort_order)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name');

    return NextResponse.json({ products: products || [], categories: categories || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabase = createServiceClient();
  try {
    const body = await req.json();
    const {
      name,
      slug: customSlug,
      description = '',
      short_description = '',
      price,
      old_price,
      category_id,
      stock_status = 'in_stock',
      featured = false,
      active = true,
      primary_image,
      additional_images = [],
    } = body;

    if (!name || price === undefined || price === null) {
      return NextResponse.json(
        { error: 'Product name and price are required' },
        { status: 400 }
      );
    }

    const baseSlug = customSlug?.trim() ? slugify(customSlug) : slugify(name);
    const finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // Insert Product (excluding generated 'discount')
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .insert({
        name: name.trim(),
        slug: finalSlug,
        description: description || '',
        short_description: short_description || '',
        price: Number(price),
        old_price: old_price ? Number(old_price) : null,
        category_id: category_id || null,
        stock_status,
        featured: Boolean(featured),
        active: Boolean(active),
      })
      .select()
      .single();

    if (prodErr || !product) {
      return NextResponse.json(
        { error: prodErr?.message || 'Failed to create product' },
        { status: 500 }
      );
    }

    // Insert Images
    const imagesToInsert: any[] = [];
    if (primary_image && primary_image.trim()) {
      imagesToInsert.push({
        product_id: product.id,
        image_url: primary_image.trim(),
        is_primary: true,
        sort_order: 0,
      });
    }

    if (Array.isArray(additional_images)) {
      additional_images.forEach((imgUrl: string, idx: number) => {
        if (imgUrl && imgUrl.trim() && imgUrl.trim() !== primary_image?.trim()) {
          imagesToInsert.push({
            product_id: product.id,
            image_url: imgUrl.trim(),
            is_primary: false,
            sort_order: idx + 1,
          });
        }
      });
    }

    if (imagesToInsert.length > 0) {
      await supabase.from('product_images').insert(imagesToInsert);
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
