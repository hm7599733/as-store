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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const { name, slug: customSlug, image_url, description, active } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const updatePayload: Record<string, any> = {
      name: name.trim(),
    };

    if (customSlug?.trim()) {
      updatePayload.slug = slugify(customSlug);
    }

    if (image_url !== undefined) {
      updatePayload.image_url = image_url?.trim() || null;
    }

    if (description !== undefined) {
      updatePayload.description = description?.trim() || null;
    }

    if (active !== undefined) {
      updatePayload.active = Boolean(active);
    }

    const { data: updatedCat, error } = await supabase
      .from('categories')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      category: updatedCat,
      message: 'Category updated successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // 1. Check if products are linked to this category
    const { data: linkedProducts } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id);

    if (linkedProducts && linkedProducts.length > 0) {
      // Unlink products so they don't break
      await supabase
        .from('products')
        .update({ category_id: null })
        .eq('category_id', id);
    }

    // 2. Delete the category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      unlinkedProductsCount: linkedProducts?.length || 0,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
