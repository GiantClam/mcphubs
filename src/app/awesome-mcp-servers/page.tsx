import { Suspense } from 'react';
import { searchMCPProjects } from '@/lib/github';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { FiStar, FiGithub, FiTrendingUp, FiCode, FiUsers, FiBook } from 'react-icons/fi';

export const metadata = {
  title: 'Awesome MCP Servers - 最佳Model Context Protocol服务器合集 | MCPHubs',
  description: '发现awesome-mcp-servers项目合集！精选的MCP服务器列表，包括claude-mcp、playwright-mcp、fastapi-mcp等优秀项目。学习MCP服务器开发，找到最适合的MCP工具。',
  keywords: [
    'awesome-mcp-servers', 'awesome mcp', 'mcp servers', 'claude mcp', 'playwright-mcp', 
    'fastapi-mcp', 'blender-mcp', 'mcp-grafana', 'browser-tools-mcp', 'mcp server教程',
    'best mcp servers', 'mcp项目', 'Model Context Protocol服务器'
  ],
  openGraph: {
    title: 'Awesome MCP Servers - 最全MCP服务器合集',
    description: '发现最佳的MCP服务器项目，学习Claude MCP集成，探索awesome-mcp-servers生态系统',
    images: ['/images/og-awesome-mcp.jpg']
  }
};

import { ProcessedRepo } from '@/lib/github';

async function getAwesomeMCPServers(): Promise<ProcessedRepo[]> {
  try {
    const projects = await searchMCPProjects();
    
    // 按照stars排序，展示最受欢迎的项目
    return projects
      .filter(project => 
        project.name.toLowerCase().includes('mcp') ||
        project.description?.toLowerCase().includes('mcp') ||
        project.topics?.some(topic => topic.includes('mcp'))
      )
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 24); // 显示前24个项目
  } catch (error) {
    console.error('Error fetching awesome MCP servers:', error);
    return [];
  }
}

const categoryData = [
  {
    title: '浏览器工具',
    description: '网页自动化和浏览器控制',
    icon: <FiCode className="w-6 h-6" />,
    keywords: ['playwright', 'browser', 'selenium', 'puppeteer'],
    examples: ['playwright-mcp', 'browser-tools-mcp', 'puppeteer-mcp']
  },
  {
    title: 'Web框架',
    description: 'API开发和Web服务',
    icon: <FiTrendingUp className="w-6 h-6" />,
    keywords: ['fastapi', 'flask', 'express', 'api'],
    examples: ['fastapi-mcp', 'django-mcp', 'express-mcp']
  },
  {
    title: '数据可视化',
    description: '图表和监控工具',
    icon: <FiStar className="w-6 h-6" />,
    keywords: ['grafana', 'chart', 'visualization', 'dashboard'],
    examples: ['mcp-grafana', 'chart-mcp', 'dashboard-mcp']
  },
  {
    title: '开发工具',
    description: 'IDE集成和开发环境',
    icon: <FiUsers className="w-6 h-6" />,
    keywords: ['vscode', 'cursor', 'ide', 'development'],
    examples: ['cursor-mcp', 'vscode-mcp', 'ide-mcp']
  },
  {
    title: '数据库',
    description: '数据存储和管理',
    icon: <FiBook className="w-6 h-6" />,
    keywords: ['mysql', 'postgres', 'mongodb', 'database'],
    examples: ['mysql-mcp', 'postgres-mcp', 'mongodb-mcp']
  },
  {
    title: '云服务',
    description: '云平台集成服务',
    icon: <FiGithub className="w-6 h-6" />,
    keywords: ['aws', 'azure', 'gcp', 'cloud'],
    examples: ['aws-mcp', 'azure-mcp', 'cloudflare-mcp']
  }
];

export default async function AwesomeMCPServersPage() {
  const projects = await getAwesomeMCPServers();

  const ProjectsSection = () => (
    <div className="space-y-8">
      {/* 热门项目 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🌟 最受欢迎的MCP服务器
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((project) => (
            <ProjectCard 
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              stars={project.stars}
              forks={project.forks}
              language={project.language}
              owner={project.owner}
              relevance={project.relevance}
              imageUrl={project.imageUrl}
              topics={project.topics}
              updatedAt={project.updatedAt}
              githubUrl={project.url}
            />
          ))}
        </div>
      </section>

      {/* 项目分类 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📂 按分类浏览MCP服务器
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categoryData.map((category, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {category.description}
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">热门项目:</p>
                <div className="flex flex-wrap gap-2">
                  {category.examples.map((example) => (
                    <span key={example} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 完整项目列表 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📋 完整的MCP服务器列表
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              stars={project.stars}
              forks={project.forks}
              language={project.language}
              owner={project.owner}
              relevance={project.relevance}
              imageUrl={project.imageUrl}
              topics={project.topics}
              updatedAt={project.updatedAt}
              githubUrl={project.url}
            />
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Awesome MCP Servers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
            发现最棒的Model Context Protocol服务器项目合集！包括claude-mcp、playwright-mcp、fastapi-mcp等精选项目，
            助力您的AI应用开发。
          </p>
          
          {/* 统计信息 */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{projects.length}+</div>
              <div className="text-gray-600 dark:text-gray-300">MCP服务器</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {projects.reduce((sum, p) => sum + p.stars, 0)}+
              </div>
              <div className="text-gray-600 dark:text-gray-300">GitHub Stars</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">6</div>
              <div className="text-gray-600 dark:text-gray-300">主要分类</div>
            </div>
          </div>

          {/* 搜索提示 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 什么是MCP服务器？
            </h3>
            <p className="text-blue-800 dark:text-blue-200">
              MCP（Model Context Protocol）服务器是实现了Anthropic Model Context Protocol规范的应用程序，
              可以为Claude等AI模型提供扩展功能和数据访问能力。这些awesome-mcp-servers项目展示了MCP的强大潜力。
            </p>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <ProjectsSection />
        </Suspense>

        {/* 底部CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">想要创建自己的MCP服务器？</h2>
          <p className="text-lg mb-6">学习MCP开发教程，加入awesome-mcp-servers生态系统</p>
          <div className="space-x-4">
            <a href="/development" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              开发指南
            </a>
            <a href="/community" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              加入社区
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 