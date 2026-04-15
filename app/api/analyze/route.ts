import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildDemoAnalysis } from '@/lib/demo-analysis';

export const runtime = 'nodejs';
export const maxDuration = 30;

const forwardSchema = z.object({
  sourceName: z.string().min(1),
  remoteUrl: z.string().url().optional()
});

async function extractSourceName(request: NextRequest) {
  const form = await request.formData();
  const uploaded = form.get('file');
  const sourceNameField = form.get('sourceName');
  const remoteUrlField = form.get('remoteUrl');

  const sourceName = uploaded instanceof File
    ? uploaded.name
    : typeof sourceNameField === 'string' && sourceNameField.trim().length > 0
      ? sourceNameField.trim()
      : 'dashcam-demo.mp4';

  const remoteUrl = typeof remoteUrlField === 'string' && remoteUrlField.trim().length > 0
    ? remoteUrlField.trim()
    : undefined;

  return { sourceName, remoteUrl };
}

export async function POST(request: NextRequest) {
  const backendUrl = process.env.ADAS_BACKEND_URL;
  const backendToken = process.env.ADAS_BACKEND_TOKEN;
  const { sourceName, remoteUrl } = await extractSourceName(request);

  if (!backendUrl) {
    return NextResponse.json(buildDemoAnalysis(sourceName));
  }

  const payload = forwardSchema.parse({ sourceName, remoteUrl });

  const response = await fetch(`${backendUrl.replace(/\/$/, '')}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(backendToken ? { Authorization: `Bearer ${backendToken}` } : {})
    },
    body: JSON.stringify(payload),
    cache: 'no-store'
  });

  if (!response.ok) {
    const text = await response.text();
    return new NextResponse(text || 'Remote backend failed', { status: response.status });
  }

  const json = await response.json();
  return NextResponse.json({ ...json, mode: 'remote' });
}
