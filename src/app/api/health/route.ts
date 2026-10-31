import { NextResponse } from 'next/server';
import { getSiteDatabase } from '@/lib/content';

export async function GET() {
  const db = getSiteDatabase();
  return NextResponse.json({
    status: 'ok',
    service: 'transilvania-cave-diving',
    stats: db.stats,
    timestamp: new Date().toISOString(),
  });
}

