import { NextResponse } from 'next/server';

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url') || '';
    if (!url) {
      return NextResponse.json({ ok: false, error: 'missing url' }, { status: 400 });
    }

    // Only http/https can be probed from server side
    if (!/^https?:\/\//i.test(url)) {
      return NextResponse.json({ ok: false, error: 'unsupported protocol for probing', protocol: url.split(':')[0] || 'unknown' }, { status: 400 });
    }

    // Try a lightweight GET with short timeout
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchPromise = fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'text/event-stream, application/json, */*;q=0.1'
      },
      redirect: 'follow',
      signal,
    });

    const res = await withTimeout(fetchPromise, 5000).catch((e: Error) => {
      throw e;
    });

    const ok = res.ok;
    const status = res.status;
    const contentType = res.headers.get('content-type') || '';
    const isSse = /text\/event-stream/i.test(contentType);
    const isJson = /application\/json/i.test(contentType);

    // Consider 2xx OK; 3xx/4xx (like 401/403) as reachable but possibly requiring auth
    const reachable = status > 0 && status < 500; // treat 5xx as possibly down
    const requireAuth = status === 401 || status === 403;

    return NextResponse.json({ ok, status, isSse, isJson, contentType, reachable, requireAuth });
  } catch (error: any) {
    return NextResponse.json({ ok: false, reachable: false, error: error?.message || 'probe failed' }, { status: 200 });
  }
}


