import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
    const expectedPass = (process.env.ADMIN_PASSWORD || 'abdullah123').trim();

    const inputUser = (username || '').trim().toLowerCase();
    const inputPass = (password || '').trim();

    // Check credentials match configured admin credentials
    const isDirectMatch =
      (inputUser === expectedUser || inputUser === `${expectedUser}@asstore.pk` || inputUser === 'admin@asstore.pk') &&
      inputPass === expectedPass;

    let supabaseAuthSuccess = false;
    let userDetails = { email: 'admin@asstore.pk', role: 'admin', name: 'Admin (Abdullah)' };

    // Also attempt Supabase authentication
    try {
      const supabase = createServiceClient();
      const targetEmail = inputUser.includes('@') ? inputUser : 'admin@asstore.pk';
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: inputPass,
      });

      if (!error && data?.session) {
        supabaseAuthSuccess = true;
      }
    } catch (e) {
      // Non-blocking fallback
    }

    if (isDirectMatch || supabaseAuthSuccess) {
      const response = NextResponse.json({
        success: true,
        user: userDetails,
        message: 'Admin authentication successful',
      });

      // Set secure admin session cookie (valid for 7 days)
      response.cookies.set('as_admin_auth', 'true', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid admin username or password. Please verify your credentials.',
      },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server authentication error' },
      { status: 500 }
    );
  }
}
