import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  try {
    const body = await req.json();
    const {
      name,
      slug,
      description,
      short_description,
      price,
      old_price,
      wholesale_price,
      category_id,
      stock_status,
      featured,
      active,
      primary_image,
      additional_images,
    } = body;

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updatePayload.name = name.trim();
    if (slug !== undefined) updatePayload.slug = slug.trim();
    if (description !== undefined) updatePayload.description = description;
    if (short_description !== undefined) updatePayload.short_description = short_description;
    if (price !== undefined) updatePayload.price = Number(price);
    if (old_price !== undefined) updatePayload.old_price = old_price ? Number(old_price) : null;
    if (wholesale_price !== undefined) updatePayload.wholesale_price = wholesale_price ? Number(wholesale_price) : null;
    if (category_id !== undefined) updatePayload.category_id = category_id || null;
    if (stock_status !== undefined) updatePayload.stock_status = stock_status;
    if (featured !== undefined) updatePayload.featured = Boolean(featured);
    if (active !== undefined) updatePayload.active = Boolean(active);

    const { data: updatedProduct, error: prodErr } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (prodErr) {
      return NextResponse.json({ error: prodErr.message }, { status: 500 });
    }

    // Update images if provided
    if (primary_image !== undefined || additional_images !== undefined) {
      // Remove old images
      await supabase.from('product_images').delete().eq('product_id', id);

      const imagesToInsert: any[] = [];
      if (primary_image && primary_image.trim()) {
        imagesToInsert.push({
          product_id: id,
          image_url: primary_image.trim(),
          is_primary: true,
          sort_order: 0,
        });
      }

      if (Array.isArray(additional_images)) {
        additional_images.forEach((imgUrl: string, idx: number) => {
          if (imgUrl && imgUrl.trim() && imgUrl.trim() !== primary_image?.trim()) {
            imagesToInsert.push({
              product_id: id,
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
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  try {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
