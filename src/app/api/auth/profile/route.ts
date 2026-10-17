import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/server';
import { cleanPakistaniPhoneDigits } from '@/lib/utils';

const profileUpdateSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(10, 'A valid phone number is required'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(5, 'Delivery address is required'),
});

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { user_id, full_name, phone, city, address } = parsed.data;
    const cleanDigits = cleanPakistaniPhoneDigits(phone);
    const normalizedPhone = `0${cleanDigits}`;

    const supabase = createServiceClient();

    const { data: updated, error } = await supabase.auth.admin.updateUserById(user_id, {
      user_metadata: {
        full_name,
        phone: normalizedPhone,
        city,
        address,
      },
    });

    if (error || !updated?.user) {
      return NextResponse.json(
        { success: false, error: error?.message || 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        id: updated.user.id,
        email: updated.user.email,
        full_name,
        phone: normalizedPhone,
        city,
        address,
      },
    });
  } catch (err: any) {
    console.error('Update profile error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
