import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPublicClient } from '@/lib/supabase/server';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const supabase = getPublicClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || 'Invalid email or password. Please verify your credentials.',
        },
        { status: 401 }
      );
    }

    const meta = data.user.user_metadata || {};

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: meta.full_name || '',
        phone: meta.phone || '',
        city: meta.city || '',
        address: meta.address || '',
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
