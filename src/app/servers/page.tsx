import { getProjects } from '@/lib/project-service';
import { ProcessedRepo } from '@/lib/github';
import MCPConnector from '@/components/MCPConnector';
import RemoteServersDirectory from '@/components/RemoteServersDirectory';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MCP Servers - Public Endpoints & Connection Tools | MCPHubs',
  description: 'Discover and connect to public MCP servers instantly. One-click connection to VS Code, Cursor, and other MCP clients. Find the best MCP server endpoints for your projects.',
  keywords: [
    'MCP servers', 'public endpoints', 'MCP connection', 'VS Code MCP', 'Cursor MCP',
    'Model Context Protocol servers', 'MCP client tools', 'server endpoints'
  ],
  openGraph: {
    title: 'MCP Servers - Public Endpoints & Connection Tools',
    description: 'Discover and connect to public MCP servers instantly with one-click integration.',
    type: 'website'
  }
};

export default async function ServersPage() {
  // 获取所有项目，筛选出服务器类型
  let allProjects: ProcessedRepo[] = [];
  try {
    const result = await getProjects();
    allProjects = result.projects || [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
  }

  // 本页不再展示“社区发现的服务器项目”与“提交表单”和“快速连接工具”（已拆分独立页面）

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题和描述 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">MCP Servers</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Discover and connect to public MCP server endpoints.</p>
      </div>

      {/* 远程服务器目录（来自 Supabase，经由 API 获取） */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Remote MCP Servers</h2>
        <RemoteServersDirectory />
      </div>

      {/* 社区发现区块已移除 */}

    </div>
  );
}
