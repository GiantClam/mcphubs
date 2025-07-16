import { searchMCPProjects } from '@/lib/github';
import ClientWrapper from '@/components/ClientWrapper';
import TrendAnalysis from '@/components/TrendAnalysis';

export const metadata = {
  title: 'MCP领域趋势分析 - MCPHubs',
  description: '深入分析Model Context Protocol技术发展趋势、市场动态和未来展望'
};

export default async function TrendsPage() {
  const projects = await searchMCPProjects();

  return (
    <ClientWrapper>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            MCP领域趋势分析
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl">
            基于最新数据和专业研究，深入分析Model Context Protocol技术发展趋势、
            市场动态和未来展望，为技术决策提供专业洞察。
          </p>
        </div>

        <TrendAnalysis projects={projects} />
      </main>
    </ClientWrapper>
  );
} 