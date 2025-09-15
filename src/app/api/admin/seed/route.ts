import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// 参考来源：
// - Remote Servers: https://mcpservers.org/remote-mcp-servers
// - Clients: https://mcpservers.org/clients

type RemoteServerSeed = {
  name: string;
  description?: string;
  logo_url?: string;
  homepage?: string;
  connect_url?: string;
  auth_type?: 'oauth' | 'open' | 'api_key' | 'other';
  category?: string;
  tags?: string[];
  status?: 'active' | 'beta' | 'deprecated';
};

type ClientSeed = {
  name: string;
  description?: string;
  logo_url?: string;
  homepage?: string;
  support_level?: 'full' | 'partial' | 'experimental';
  platforms?: string[];
  features?: string[];
};

const remoteServersSeed: RemoteServerSeed[] = [
  { name: 'GitHub', description: "GitHub's official MCP Server", auth_type: 'oauth', homepage: 'https://github.com', category: 'Developer', tags: ['official','oauth'] },
  { name: 'Notion', description: 'Notion is a collaboration and productivity tool.', auth_type: 'oauth', homepage: 'https://www.notion.so', category: 'Productivity' },
  { name: 'Sentry', description: 'Error tracking and performance monitoring.', auth_type: 'oauth', homepage: 'https://sentry.io', category: 'DevOps' },
  { name: 'Linear', description: 'Project management for software teams.', auth_type: 'oauth', homepage: 'https://linear.app', category: 'Project Management' },
  { name: 'DeepWiki', description: 'Generates architecture diagrams and docs from code.', auth_type: 'open', homepage: 'https://deepwiki.ai', category: 'Documentation', tags: ['open'] },
  { name: 'Intercom', description: 'Customer support platform.', auth_type: 'oauth', homepage: 'https://www.intercom.com', category: 'Support' },
  { name: 'Neon', description: 'Serverless PostgreSQL.', auth_type: 'oauth', homepage: 'https://neon.tech', category: 'Database' },
  { name: 'PayPal', description: 'Global online payment system.', auth_type: 'oauth', homepage: 'https://www.paypal.com', category: 'Payment' },
  { name: 'Square', description: 'Payment processing platform.', auth_type: 'oauth', homepage: 'https://squareup.com', category: 'Payment' },
  { name: 'CoinGecko', description: 'Cryptocurrency data platform.', auth_type: 'open', homepage: 'https://www.coingecko.com', category: 'Crypto', tags: ['open'] },
  { name: 'Asana', description: 'Project management tool.', auth_type: 'oauth', homepage: 'https://asana.com', category: 'Project Management' },
  { name: 'Atlassian', description: 'Collaboration tools for teams.', auth_type: 'oauth', homepage: 'https://www.atlassian.com', category: 'Developer' },
  { name: 'Wix', description: 'Website builder.', auth_type: 'oauth', homepage: 'https://www.wix.com', category: 'Website' },
  { name: 'Webflow', description: 'Visual website builder.', auth_type: 'oauth', homepage: 'https://webflow.com', category: 'Website' },
  { name: 'Globalping', description: 'Run network commands with Globalping.', auth_type: 'oauth', homepage: 'https://www.globalping.io', category: 'Networking' },
  { name: 'Semgrep', description: 'Static analysis for code security and quality.', auth_type: 'open', homepage: 'https://semgrep.dev', category: 'Security', tags: ['open'] },
  { name: 'Fetch', description: 'Web content fetching and HTML→markdown.', auth_type: 'open', homepage: 'https://github.com/zinja-coder/fetch-mcp', category: 'Web', tags: ['open'] },
  { name: 'Sequential Thinking', description: 'Structured thinking tools via MCP.', auth_type: 'open', homepage: 'https://github.com/adhikasp/sequential-thinking-mcp', category: 'AI', tags: ['open'] },
  { name: 'EdgeOne Pages', description: 'Deploy HTML to EdgeOne Pages and get public URL.', auth_type: 'open', homepage: 'https://github.com/edgeone/pages-mcp', category: 'Deploy', tags: ['open'] },
];

const clientsSeed: ClientSeed[] = [
  { name: 'Cursor', description: 'AI code editor with MCP tools support.', homepage: 'https://cursor.sh', platforms: ['macOS','Windows','Linux'], features: ['tools','resources'], support_level: 'full' },
  { name: 'Claude Desktop App', description: 'Anthropic desktop app with MCP support.', homepage: 'https://claude.ai/desktop', platforms: ['macOS','Windows'], features: ['tools','resources'], support_level: 'full' },
  { name: 'VS Code GitHub Copilot', description: 'VS Code integration with MCP features.', homepage: 'https://code.visualstudio.com', platforms: ['macOS','Windows','Linux'], features: ['tools'], support_level: 'partial' },
  { name: 'Zed', description: 'High-performance editor with MCP support.', homepage: 'https://zed.dev', platforms: ['macOS','Linux'], features: ['tools'], support_level: 'partial' },
  { name: 'Windsurf Editor', description: 'Agentic IDE with AI Flow and MCP.', homepage: 'https://windsurf.dev', platforms: ['macOS','Windows'], features: ['tools','prompts'], support_level: 'partial' },
  { name: 'Postman', description: 'API client with MCP testing/debugging.', homepage: 'https://www.postman.com', platforms: ['macOS','Windows','Linux','Web'], features: ['tools'], support_level: 'experimental' },
  { name: 'Cline', description: 'Autonomous coding agent in VS Code.', homepage: 'https://github.com/cline/cline', platforms: ['macOS','Windows','Linux'], features: ['tools'], support_level: 'full' },
  { name: 'Continue', description: 'Open-source AI code assistant with MCP.', homepage: 'https://continue.dev', platforms: ['macOS','Windows','Linux'], features: ['tools'], support_level: 'full' },
];

async function upsertByName(table: string, rows: any[]) {
  for (const row of rows) {
    // 先尝试按名称查询
    const { data: exists, error: selErr } = await supabase
      .from(table)
      .select('id')
      .eq('name', row.name)
      .maybeSingle();

    if (selErr) {
      console.error(`Select ${table} error:`, selErr);
      continue;
    }

    if (exists?.id) {
      const { error: updErr } = await supabase
        .from(table)
        .update({ ...row, updated_at: new Date().toISOString() })
        .eq('id', exists.id);
      if (updErr) console.error(`Update ${table} ${row.name} error:`, updErr);
    } else {
      const { error: insErr } = await supabase
        .from(table)
        .insert({ ...row, updated_at: new Date().toISOString() });
      if (insErr) console.error(`Insert ${table} ${row.name} error:`, insErr);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
    }

    await upsertByName('remote_mcp_servers', remoteServersSeed);
    await upsertByName('mcp_clients', clientsSeed);

    return NextResponse.json({ ok: true, remote: remoteServersSeed.length, clients: clientsSeed.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'seed failed' }, { status: 500 });
  }
}


