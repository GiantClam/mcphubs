import { getProjects } from '@/lib/project-service';
import { ProcessedRepo } from '@/lib/github';
import ProjectShowcase from '@/components/ProjectShowcase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Awesome MCP Servers - Curated Collection | MCPHubs',
  description: 'Discover the best MCP server projects in our curated collection. Find production-ready MCP servers for web scraping, API development, data processing, and more.',
  keywords: [
    'awesome mcp servers', 'mcp server collection', 'mcp server projects', 'model context protocol servers',
    'mcp server examples', 'mcp server tutorials', 'mcp server development', 'mcp server library'
  ],
  openGraph: {
    title: 'Awesome MCP Servers - Curated Collection',
    description: 'Discover the best MCP server projects in our curated collection.',
    type: 'website'
  }
};

export default async function AwesomeMCPServersPage() {
  // 获取所有项目，筛选出服务器类型
  let allProjects: ProcessedRepo[] = [];
  try {
    const result = await getProjects();
    allProjects = result.projects || [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
  }

  // 筛选出服务器类型的项目，按星数排序
  const serverProjects = allProjects
    .filter(project => 
      project.projectType === 'Server' || 
      project.name.toLowerCase().includes('server') ||
      project.description.toLowerCase().includes('server') ||
      project.description.toLowerCase().includes('mcp server') ||
      project.topics?.some(topic => 
        topic.toLowerCase().includes('server') || 
        topic.toLowerCase().includes('mcp-server')
      )
    )
    .sort((a, b) => (b.stars || 0) - (a.stars || 0));

  // 精选的知名 MCP 服务器项目
  const featuredServers = [
    'playwright-mcp',
    'fastapi-mcp', 
    'claude-mcp',
    'filesystem-mcp',
    'sqlite-mcp',
    'web-search-mcp',
    'github-mcp',
    'memory-mcp',
    'brave-search-mcp',
    'puppeteer-mcp'
  ];

  // 将精选项目排在前面
  const sortedProjects = [
    ...serverProjects.filter(p => featuredServers.some(fs => p.name.toLowerCase().includes(fs))),
    ...serverProjects.filter(p => !featuredServers.some(fs => p.name.toLowerCase().includes(fs)))
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题和描述 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Awesome MCP Servers
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          发现最优秀的 MCP 服务器项目集合。这些精选的服务器为 AI 应用提供了强大的功能扩展，
          包括网页自动化、API 开发、数据处理等。
        </p>
        
        {/* 特色介绍 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            🚀 什么是 awesome-mcp-servers？
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            awesome-mcp-servers 是一个精心策划的 MCP 服务器项目集合，包括优秀的项目如 playwright-mcp、
            fastapi-mcp、claude-mcp 等。这些服务器为 AI 应用提供了各种功能扩展，如浏览器自动化、
            API 开发、数据处理等。
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              🌐 网页自动化
            </span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
              🔌 API 集成
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
              📊 数据处理
            </span>
            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm">
              🔍 搜索功能
            </span>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">服务器项目</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{serverProjects.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">总星数</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {serverProjects.reduce((sum, p) => sum + (p.stars || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">活跃项目</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {serverProjects.filter(p => p.updatedAt && new Date(p.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 项目展示 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          精选 MCP 服务器项目
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          按星数和活跃度排序的优质 MCP 服务器项目
        </p>
      </div>
      
      <ProjectShowcase 
        initialProjects={sortedProjects} 
        showAll={true}
        showFilters={true}
      />
    </div>
  );
}
