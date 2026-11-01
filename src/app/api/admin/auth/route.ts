import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const expectedPassword = process.env.ADMIN_PASSWORD || 'transilvania2026';

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Parolă invalidă' }, { status: 400 });
    }

    // Timing-safe password comparison
    const passwordBuffer = Buffer.from(password);
    const expectedBuffer = Buffer.from(expectedPassword);

    if (passwordBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(passwordBuffer, expectedBuffer)) {
      return NextResponse.json({ success: false, error: 'Parola introdusă este incorectă.' }, { status: 401 });
    }

    // Set signed auth cookie
    const token = crypto.createHmac('sha256', process.env.SESSION_SECRET || 'tcd-secret-salt-2026')
      .update(`authenticated-admin-${expectedPassword}`)
      .digest('hex');

    const response = NextResponse.json({ success: true, message: 'Autentificare reușită' });
    response.cookies.set('tcd_admin_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'A apărut o eroare la autentificare' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Deconectat' });
  response.cookies.delete('tcd_admin_auth');
  return response;
}

