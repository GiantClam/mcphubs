import { Suspense } from 'react';
import { searchMCPProjects } from '@/lib/github';
import ComparisonTool from '@/components/ComparisonTool';

export const metadata = {
  title: '项目对比 | MCPHubs',
  description: '对比不同的 MCP 项目，找到最适合您需求的解决方案',
};

export default async function ComparePage() {
  const projects = await searchMCPProjects();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            项目对比
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            对比不同的 MCP 项目，找到最适合您需求的解决方案
          </p>
        </div>
        
        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        }>
          <ComparisonTool projects={projects} />
        </Suspense>
      </div>
    </div>
  );
} 