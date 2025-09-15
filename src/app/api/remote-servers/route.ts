import { NextResponse } from 'next/server';
import { getRemoteMcpServers } from '@/lib/supabase';

export const runtime = 'edge';
export const preferredRegion = 'auto';

export async function GET() {
  try {
    const servers = await getRemoteMcpServers();
    const res = NextResponse.json({ data: servers });
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}


