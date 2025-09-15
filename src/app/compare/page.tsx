import { Suspense } from 'react';
import ComparisonTool from '@/components/ComparisonTool';

export const metadata = {
  title: 'Project Comparison | MCPHubs',
  description: 'Compare different MCP projects to find the best solution for your needs',
};

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Project Comparison
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Compare different MCP projects to find the best solution for your needs
          </p>
        </div>
        
        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        }>
          <ComparisonTool />
        </Suspense>
      </div>
    </div>
  );
} 