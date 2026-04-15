import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    backendConfigured: Boolean(process.env.ADAS_BACKEND_URL)
  });
}
