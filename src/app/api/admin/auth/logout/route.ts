import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Signed out successfully',
  });

  response.cookies.set('as_admin_auth', '', {
    httpOnly: false,
    path: '/',
    maxAge: 0,
  });

  return response;
}
