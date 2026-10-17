import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/server';
import { cleanPakistaniPhoneDigits } from '@/lib/utils';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Full name is required').max(100),
  phone: z.string().min(10, 'A valid Pakistani phone number is required'),
  city: z.string().min(2, 'City is required').optional().default(''),
  address: z.string().min(5, 'Delivery address is required').optional().default(''),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { email, password, full_name, phone, city, address } = parsed.data;
    const cleanDigits = cleanPakistaniPhoneDigits(phone);
    const normalizedPhone = `0${cleanDigits}`;

    const supabase = createServiceClient();

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // Create user in Supabase Auth with email auto-confirmed
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        phone: normalizedPhone,
        city,
        address,
      },
    });

    if (createError || !created?.user) {
      return NextResponse.json(
        { success: false, error: createError?.message || 'Failed to create account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now sign in.',
      user: {
        id: created.user.id,
        email: created.user.email,
        full_name,
        phone: normalizedPhone,
        city,
        address,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
