import { NextResponse } from 'next/server';
import { getRemoteMcpServers } from '@/lib/supabase';

export async function GET() {
  try {
    const servers = await getRemoteMcpServers();
    return NextResponse.json({ data: servers });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}


