import { NextResponse } from 'next/server';
import { getMcpClients } from '@/lib/supabase';

export async function GET() {
  try {
    const clients = await getMcpClients();
    return NextResponse.json({ data: clients });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}


