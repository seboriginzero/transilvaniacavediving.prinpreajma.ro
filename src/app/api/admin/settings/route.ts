import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getDynamicSettings, updateDynamicSettings } from '@/lib/settings';

function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('tcd_admin_auth');
  if (!authCookie || !authCookie.value) return false;

  const expectedPassword = process.env.ADMIN_PASSWORD || 'transilvania2026';
  const expectedToken = crypto
    .createHmac('sha256', process.env.SESSION_SECRET || 'tcd-secret-salt-2026')
    .update(`authenticated-admin-${expectedPassword}`)
    .digest('hex');

  return authCookie.value === expectedToken;
}

export async function GET() {
  const settings = getDynamicSettings();
  const authenticated = isAuthenticated();

  return NextResponse.json({
    authenticated,
    settings,
  });
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ success: false, error: 'Neautorizat. Vă rugăm să vă autentificați.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = updateDynamicSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ success: false, error: 'Eroare la salvarea setărilor' }, { status: 500 });
  }
}

