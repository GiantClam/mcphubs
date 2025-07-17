import { searchMCPProjects } from '@/lib/github';
import TrendAnalysis from '@/components/TrendAnalysis';

export const metadata = {
  title: '趋势分析 | MCPHubs',
  description: '分析 MCP 生态系统的发展趋势和热门项目',
};

export default async function TrendsPage() {
  const projects = await searchMCPProjects();
  
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            趋势分析
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            分析 MCP 生态系统的发展趋势和热门项目
          </p>
        </div>
        
        <TrendAnalysis projects={projects} />
      </div>
    </main>
  );
} 