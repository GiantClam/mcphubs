import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type RemoteRow = {
  name: string;
  auth_type: 'oauth' | 'open' | 'api_key' | 'other';
  connect_url: string;
  homepage?: string;
  description?: string;
  tags?: string[];
};

const curated: RemoteRow[] = [
  { name: 'GitHub', auth_type: 'oauth', connect_url: 'https://api.githubcopilot.com/mcp/', description: "GitHub's official MCP Server" },
  { name: 'Notion', auth_type: 'oauth', connect_url: 'https://mcp.notion.com/mcp', description: 'Notion is a collaboration and productivity tool.' },
  { name: 'Sentry', auth_type: 'oauth', connect_url: 'https://mcp.sentry.dev/sse', description: 'Sentry is a developer-first error tracking and performance monitoring platform.' },
  { name: 'Linear', auth_type: 'oauth', connect_url: 'https://mcp.linear.app/sse', description: 'Linear is a project management tool.' },
  { name: 'DeepWiki', auth_type: 'open', connect_url: 'https://mcp.deepwiki.com/mcp', description: 'Generates architecture diagrams and docs.' },
  { name: 'Intercom', auth_type: 'oauth', connect_url: 'https://mcp.intercom.com/sse', description: 'Intercom is a customer support platform.' },
  { name: 'Neon', auth_type: 'oauth', connect_url: 'https://mcp.neon.tech/sse', description: 'Serverless PostgreSQL.' },
  { name: 'PayPal', auth_type: 'oauth', connect_url: 'https://mcp.paypal.com/sse', description: 'Global online payment system.' },
  { name: 'Square', auth_type: 'oauth', connect_url: 'https://mcp.squareup.com/sse', description: 'Payment processing platform.' },
  { name: 'CoinGecko', auth_type: 'open', connect_url: 'https://mcp.api.coingecko.com/sse', description: 'Cryptocurrency data platform.' },
  { name: 'Asana', auth_type: 'oauth', connect_url: 'https://mcp.asana.com/sse', description: 'Project management tool.' },
  { name: 'Atlassian', auth_type: 'oauth', connect_url: 'https://mcp.atlassian.com/v1/sse', description: 'Collaboration software for teams.' },
  { name: 'Wix', auth_type: 'oauth', connect_url: 'https://mcp.wix.com/sse', description: 'Website builder.' },
  { name: 'Webflow', auth_type: 'oauth', connect_url: 'https://mcp.webflow.com/sse', description: 'Visual website builder.' },
  { name: 'Globalping', auth_type: 'oauth', connect_url: 'https://mcp.globalping.dev/sse', description: 'Run network commands with Globalping.' },
  { name: 'Semgrep', auth_type: 'open', connect_url: 'https://mcp.semgrep.ai/sse', description: 'Static analysis tool.' },
  { name: 'Fetch', auth_type: 'open', connect_url: 'https://remote.mcpservers.org/fetch/mcp', description: 'Web content fetching capabilities.' },
  { name: 'Sequential Thinking', auth_type: 'open', connect_url: 'https://remote.mcpservers.org/sequentialthinking/mcp', description: 'Structured problem-solving.' },
  { name: 'EdgeOne Pages', auth_type: 'open', connect_url: 'https://remote.mcpservers.org/edgeone-pages/mcp', description: 'Deploy HTML to EdgeOne Pages.' },
];

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
  }

  let inserted = 0;
  let updated = 0;

  for (const row of curated) {
    const { data: existing, error: selErr } = await supabase
      .from('remote_mcp_servers')
      .select('id')
      .eq('name', row.name)
      .maybeSingle();

    if (selErr) continue;

    if (existing?.id) {
      const { error: updErr } = await supabase
        .from('remote_mcp_servers')
        .update({
          auth_type: row.auth_type,
          connect_url: row.connect_url,
          description: row.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      if (!updErr) updated++;
    } else {
      const { error: insErr } = await supabase
        .from('remote_mcp_servers')
        .insert({
          name: row.name,
          auth_type: row.auth_type,
          connect_url: row.connect_url,
          description: row.description,
          status: 'active',
          updated_at: new Date().toISOString(),
        });
      if (!insErr) inserted++;
    }
  }

  return NextResponse.json({ ok: true, inserted, updated, total: curated.length });
}


