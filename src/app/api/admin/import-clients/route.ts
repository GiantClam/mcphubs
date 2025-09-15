import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type ClientRow = {
  name: string;
  description?: string;
};

const curated: ClientRow[] = [
  { name: '5ire', description: 'Open source cross-platform desktop AI assistant that supports tools through MCP servers' },
  { name: 'AgentAI', description: 'Rust library designed to simplify AI agent creation with MCP server integration' },
  { name: 'AgenticFlow', description: 'No-code AI platform for building agents that connect 2,500+ APIs and 10,000+ tools via MCP' },
  { name: 'Amazon Q CLI', description: 'Open-source agentic coding assistant for terminals with full MCP server support' },
  { name: 'Apify MCP Tester', description: 'Open-source client connecting to MCP servers using Server-Sent Events' },
  { name: 'Augment Code', description: 'AI-powered coding platform for VS Code and JetBrains with autonomous agents and MCP support' },
  { name: 'BeeAI Framework', description: 'Open-source framework for building, deploying, and serving powerful agentic workflows with MCP integration' },
  { name: 'Beyond Better', description: 'Knowledge work collaborator with MCP integration connecting diverse data sources and curated tools across providers' },
  { name: 'BoltAI', description: 'Native, all-in-one AI chat client with MCP support for multiple AI providers' },
  { name: 'Claude Code', description: 'Interactive agentic coding tool from Anthropic with MCP integration for prompts and tools' },
  { name: 'Claude.ai', description: "Anthropic's web-based AI assistant with MCP support for remote servers" },
  { name: 'Claude Desktop App', description: "Anthropic's desktop application with comprehensive MCP support for local and remote servers" },
  { name: 'Cline', description: 'Autonomous coding agent in VS Code that edits files, runs commands, and uses MCP servers' },
  { name: 'Continue', description: 'Open-source AI code assistant with built-in support for all MCP features' },
  { name: 'Copilot-MCP', description: 'AI coding assistance tool that enables integration with MCP servers' },
  { name: 'Cursor', description: 'AI code editor with support for MCP tools in Cursor Composer' },
  { name: 'Daydreams Agents', description: 'Generative agent framework for executing anything onchain with MCP server support' },
  { name: 'Emacs Mcp', description: 'Emacs client for interfacing with MCP servers and providing tool support' },
  { name: 'fast-agent', description: 'Python Agent framework with full multi-modal MCP support and end-to-end tests' },
  { name: 'FLUJO', description: 'Desktop application integrating MCP to provide workflow-builder interface for AI interactions' },
  { name: 'Genkit', description: 'Cross-language SDK for building GenAI features with MCP server integration' },
  { name: 'Glama', description: 'Comprehensive AI workspace with integrated MCP Server Directory and multi-LLM support' },
  { name: 'GenAIScript', description: 'JavaScript toolbox for assembling prompts for LLMs with MCP tool support' },
  { name: 'Goose', description: 'Open source AI agent for software development with MCP functionality through tools' },
  { name: 'gptme', description: 'Open-source terminal-based personal AI assistant with MCP tool support' },
  { name: 'HyperAgent', description: 'Playwright supercharged with AI, extensible with MCP servers for enhanced capabilities' },
  { name: 'JetBrains AI Assistant', description: 'AI-powered features for software development available in all JetBrains IDEs with MCP support' },
  { name: 'Klavis AI', description: 'Open-source infrastructure for using, building and scaling MCPs with Slack/Discord/Web clients' },
  { name: 'LibreChat', description: 'Open-source, customizable AI chat UI with MCP integration for agent tools' },
  { name: 'Lutra', description: 'AI agent that transforms conversations into actionable workflows with easy MCP integration' },
  { name: 'mcp-agent', description: 'Simple, composable framework to build agents using Model Context Protocol' },
  { name: 'mcp-use', description: 'Open source Python library to easily connect any LLM to any MCP server' },
  { name: 'MCPHub', description: 'Powerful Neovim plugin that integrates MCP servers into your workflow' },
  { name: 'MCPOmni-Connect', description: 'Versatile CLI client for connecting to MCP servers with agentic mode and orchestrator capabilities' },
  { name: 'Memex', description: 'All-in-one desktop app for building and testing MCP servers with prompt-to-server generation' },
  { name: 'Microsoft Copilot Studio', description: 'SaaS platform for building custom AI-driven applications with MCP tool support' },
  { name: 'MindPal', description: 'No-code platform for building AI agents and multi-agent workflows with MCP server support' },
  { name: 'MooPoint', description: 'Web-based AI chat platform with tool calling support and OAuth for MCP servers' },
  { name: 'Msty Studio', description: 'Privacy-first AI productivity platform integrating local and online LLMs with MCP toolsets' },
  { name: 'NVIDIA Agent Intelligence (AIQ) toolkit', description: 'Flexible library for connecting enterprise agents to data sources and tools with MCP support' },
  { name: 'OpenSumi', description: 'Framework for building AI Native IDE products with MCP tool support' },
  { name: 'oterm', description: 'Terminal client for Ollama with support for MCP tools and multiple chat sessions' },
  { name: 'Postman', description: 'Popular API client with full MCP server testing and debugging support' },
  { name: 'Roo Code', description: 'AI coding assistance platform with MCP tools and resources integration' },
  { name: 'Slack MCP Client', description: 'Bridge between Slack and MCP servers enabling LLMs to interact through Slack interface' },
  { name: 'Sourcegraph Cody', description: 'AI coding assistant with MCP resource support through OpenCTX integration' },
  { name: 'SpinAI', description: 'Open-source TypeScript framework for building observable AI agents with native MCP support' },
  { name: 'Superinterface', description: 'AI infrastructure and developer platform for building in-app AI assistants with MCP support' },
  { name: 'Superjoin', description: 'Google Sheets extension bringing MCP tools and agents directly into spreadsheets' },
  { name: 'TheiaAI/TheiaIDE', description: 'Framework and IDE for AI-enhanced tools with MCP server integration for agents' },
  { name: 'Tome', description: 'Open source cross-platform desktop app for working with local LLMs and MCP servers' },
  { name: 'TypingMind App', description: 'Advanced frontend for LLMs with MCP tool integration and AI agent support' },
  { name: 'VS Code GitHub Copilot', description: 'VS Code integration with GitHub Copilot featuring comprehensive MCP support' },
  { name: 'Warp', description: 'Intelligent terminal with AI and MCP support for natural language command line interaction' },
  { name: 'WhatsMCP', description: 'MCP client for WhatsApp enabling AI stack interaction through WhatsApp chat' },
  { name: 'Windsurf Editor', description: 'Agentic IDE with AI Flow system and MCP support for collaborative development' },
  { name: 'Witsy', description: 'AI desktop assistant supporting Anthropic models and MCP servers as LLM tools' },
  { name: 'Zed', description: 'High-performance code editor with MCP support focusing on prompt templates and tools' },
  { name: 'Zencoder', description: 'Coding agent for VS Code and JetBrains with integrated MCP tool library' },
];

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
  }

  let inserted = 0;
  let updated = 0;

  for (const row of curated) {
    const { data: existing, error: selErr } = await supabase
      .from('mcp_clients')
      .select('id')
      .eq('name', row.name)
      .maybeSingle();

    if (selErr) continue;

    if (existing?.id) {
      const { error: updErr } = await supabase
        .from('mcp_clients')
        .update({
          description: row.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      if (!updErr) updated++;
    } else {
      const { error: insErr } = await supabase
        .from('mcp_clients')
        .insert({
          name: row.name,
          description: row.description,
          updated_at: new Date().toISOString(),
        });
      if (!insErr) inserted++;
    }
  }

  return NextResponse.json({ ok: true, inserted, updated, total: curated.length });
}


