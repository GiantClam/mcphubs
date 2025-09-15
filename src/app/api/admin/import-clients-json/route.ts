import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type ClientRow = { name: string; description?: string; homepage?: string };

async function upsertClients(rows: ClientRow[]) {
  let inserted = 0;
  let updated = 0;
  for (const row of rows) {
    if (!row?.name) continue;
    const { data: existing } = await supabase
      .from('mcp_clients')
      .select('id')
      .eq('name', row.name)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from('mcp_clients')
        .update({ description: row.description, homepage: row.homepage, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (!error) updated++;
    } else {
      const { error } = await supabase
        .from('mcp_clients')
        .insert({ name: row.name, description: row.description, homepage: row.homepage, updated_at: new Date().toISOString() });
      if (!error) inserted++;
    }
  }
  return { inserted, updated };
}

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
  const payload = await req.json().catch(() => null);
  if (!Array.isArray(payload)) return NextResponse.json({ error: 'Body must be JSON array' }, { status: 400 });
  const data: ClientRow[] = payload.map((x: any) => ({ name: String(x.name || '').trim(), description: x.description || x.desc, homepage: x.homepage || x.url })).filter(x => x.name);
  const { inserted, updated } = await upsertClients(data);
  return NextResponse.json({ ok: true, total: data.length, inserted, updated });
}


