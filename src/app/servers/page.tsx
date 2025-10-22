import { getProjects } from '@/lib/project-service';
import { ProcessedRepo } from '@/lib/github';
import MCPConnector from '@/components/MCPConnector';
import RemoteServersDirectory from '@/components/RemoteServersDirectory';
import { getRemoteMcpServers, type RemoteMcpServer } from '@/lib/supabase';
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

// 获取已审核通过的社区服务器
async function getApprovedCommunityServers(): Promise<RemoteMcpServer[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/community/approved-servers`, {
      cache: 'no-store' // 确保获取最新数据
    });
    
    if (!response.ok) {
      console.warn('获取社区服务器失败:', response.status);
      return [];
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('获取社区服务器时出错:', error);
    return [];
  }
}

export default async function ServersPage() {
  // 获取所有项目，筛选出服务器类型
  let allProjects: ProcessedRepo[] = [];
  try {
    const result = await getProjects();
    allProjects = result.projects || [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
  }

  // 获取远程服务器和社区服务器
  const [remoteServers, communityServers] = await Promise.all([
    getRemoteMcpServers(),
    getApprovedCommunityServers()
  ]);

  // 合并服务器列表，社区服务器优先显示
  const allServers = [...communityServers, ...remoteServers];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题和描述 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">MCP Servers</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Discover and connect to public MCP server endpoints.</p>
      </div>

      {/* 社区服务器 */}
      {communityServers.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Community MCP Servers
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({communityServers.length} servers)
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Community-submitted MCP servers that have been reviewed and approved.
          </p>
          <RemoteServersDirectory initialItems={communityServers} />
        </div>
      )}

      {/* 远程服务器目录（来自 Supabase，经由 API 获取） */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Remote MCP Servers
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({remoteServers.length} servers)
          </span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Publicly available MCP servers from the community.
        </p>
        <RemoteServersDirectory initialItems={remoteServers} />
      </div>

    </div>
  );
}
