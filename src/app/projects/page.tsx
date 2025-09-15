import ProjectShowcase from '@/components/ProjectShowcase';
import ClientFilter from '@/components/ClientFilter';
import { getProjects } from '@/lib/project-service';
import { ProcessedRepo } from '@/lib/github';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MCP Clients - Development Tools & Libraries | MCPHubs',
  description: 'Discover MCP client tools, libraries, and development resources. Filter by programming language, features, and compatibility. Find the perfect MCP client for your project.',
  keywords: [
    'MCP clients', 'MCP libraries', 'MCP tools', 'MCP development', 'Model Context Protocol clients',
    'MCP Python', 'MCP TypeScript', 'MCP JavaScript', 'MCP Go', 'MCP integration'
  ],
  openGraph: {
    title: 'MCP Clients - Development Tools & Libraries',
    description: 'Discover and filter MCP client tools, libraries, and development resources.',
    type: 'website'
  }
};

export default async function ProjectsPage() {
  // 在服务端直接获取项目数据
  let projects: ProcessedRepo[] = [];
  try {
    const result = await getProjects();
    projects = result.projects || [];
  } catch (error) {
    console.error('Failed to fetch projects on server:', error);
  }

  // 筛选出客户端类型的项目
  const clientProjects = projects.filter(project => 
    project.projectType === 'Client' || 
    project.projectType === 'Library' ||
    project.projectType === 'Tool' ||
    project.name.toLowerCase().includes('client') ||
    project.description.toLowerCase().includes('client') ||
    project.description.toLowerCase().includes('library') ||
    project.description.toLowerCase().includes('sdk')
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          MCP Clients & Libraries
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          发现和筛选MCP客户端工具、库和开发资源。按编程语言、特性和兼容性筛选。
        </p>
      </div>

      {/* 高级筛选器 */}
      <div className="mb-8">
        <ClientFilter projects={clientProjects} />
      </div>

      {/* 项目展示 */}
      <ProjectShowcase 
        initialProjects={clientProjects} 
        showAll={true}
        showFilters={false} // 使用我们的自定义筛选器
      />
    </div>
  );
} 