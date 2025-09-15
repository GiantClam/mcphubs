import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type Extracted = { name: string; description?: string; homepage?: string };

function extractClientsFromHtml(html: string): Extracted[] {
  const results: Extracted[] = [];
  // 粗粒度分片：每个卡片以 "font-semibold tracking-tight text-lg" 标题块为界
  const cardRegex = /<div class="font-semibold tracking-tight text-lg">([\s\S]*?)<\/div>[\s\S]*?<a href="([^"]+)"[\s\S]*?<\/a>[\s\S]*?<div class="text-muted-foreground text-sm">([\s\S]*?)<\/div>/g;
  let m: RegExpExecArray | null;
  while ((m = cardRegex.exec(html)) !== null) {
    const name = m[1].trim();
    const homepage = m[2].trim();
    const description = m[3].replace(/\s+/g, ' ').trim();
    if (name) {
      results.push({ name, homepage, description });
    }
  }
  return results;
}

async function upsertClients(items: Extracted[]) {
  let inserted = 0;
  let updated = 0;
  for (const row of items) {
    const { data: existing } = await supabase
      .from('mcp_clients')
      .select('id')
      .eq('name', row.name)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from('mcp_clients')
        .update({
          description: row.description,
          homepage: row.homepage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      if (!error) updated++;
    } else {
      const { error } = await supabase
        .from('mcp_clients')
        .insert({
          name: row.name,
          description: row.description,
          homepage: row.homepage,
          updated_at: new Date().toISOString(),
        });
      if (!error) inserted++;
    }
  }
  return { inserted, updated };
}

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
  }
  const html = await req.text();
  if (!html || html.length < 10) {
    return NextResponse.json({ error: 'empty html' }, { status: 400 });
  }
  const items = extractClientsFromHtml(html);
  const { inserted, updated } = await upsertClients(items);
  return NextResponse.json({ ok: true, totalParsed: items.length, inserted, updated });
}


