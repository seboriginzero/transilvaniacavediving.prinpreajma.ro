import { NextResponse } from 'next/server';

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

function sanitizeText(input: unknown, maxLen: number): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen);
}

export async function POST(request: Request) {
  try {
    // 1. CSRF custom header verification
    const requestedWith = request.headers.get('x-requested-with');
    if (requestedWith !== 'XMLHttpRequest') {
      return NextResponse.json(
        { error: 'Antet de securitate invalid.' },
        { status: 403 }
      );
    }

    // 2. Simple IP rate limit
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const now = Date.now();
    const record = rateLimitStore.get(ip);
    if (record && now < record.resetAt) {
      if (record.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: 'Prea multe încercări. Vă rugăm să așteptați un minut.' },
          { status: 429 }
        );
      }
      record.count += 1;
    } else {
      rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    }

    const body = await request.json();

    // 3. Honeypot validation
    if (body.website && String(body.website).trim() !== '') {
      return NextResponse.json({
        ok: true,
        message: 'Mesajul a fost recepționat.',
      });
    }

    const name = sanitizeText(body.name, 100);
    const email = sanitizeText(body.email, 120);
    const phone = sanitizeText(body.phone, 30);
    const subject = sanitizeText(body.subject, 150);
    const message = sanitizeText(body.message, 2500);

    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Vă rugăm să introduceți numele complet (minim 2 caractere).' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Vă rugăm să introduceți o adresă de email validă.' },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Mesajul trebuie să conțină cel puțin 10 caractere.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: `Mulțumim, ${name}! Solicitarea dumneavoastră („${subject || 'Contact'}”) a fost înregistrată. Echipa S.C. Transilvania Cave Diving S.R.L. vă va răspunde în curând.`,
      submittedAt: new Date().toISOString(),
      phoneReceived: Boolean(phone),
    });
  } catch {
    return NextResponse.json(
      { error: 'Cerere invalidă. Verificați datele introduse.' },
      { status: 400 }
    );
  }
}

