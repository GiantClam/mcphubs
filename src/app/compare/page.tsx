import { Suspense } from 'react';
import { searchMCPProjects } from '@/lib/github';
import ClientWrapper from '@/components/ClientWrapper';
import ComparisonTool from '@/components/ComparisonTool';

export const metadata = {
  title: 'MCP项目对比分析 - MCPHubs',
  description: '比较不同MCP项目的特性、优势和适用场景，帮助您做出最佳选择'
};

export default async function ComparePage() {
  const projects = await searchMCPProjects();

  return (
    <ClientWrapper>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            MCP项目对比分析
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            通过专业的对比分析，帮助您深入了解不同MCP项目的优势、劣势和适用场景，
            从而做出最符合您需求的技术选择。
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        }>
          <ComparisonTool projects={projects} />
        </Suspense>
      </main>
    </ClientWrapper>
  );
} 