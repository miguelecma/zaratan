import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Expecting { events: rrwebEvent[], triggeredBy: string, meta?: any }
    // Log a concise summary to the server logs
    const count = Array.isArray(body?.events) ? body.events.length : 0;
    // eslint-disable-next-line no-console
    console.log('[rrweb] received events:', {
      count,
      triggeredBy: body?.triggeredBy ?? 'unknown',
      meta: body?.meta ?? null,
      previewFirstEventType: count > 0 ? body.events[0]?.type : null,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[rrweb] failed to parse request body', error);
    return NextResponse.json({ ok: false, error: 'invalid body' }, { status: 400 });
  }
}


