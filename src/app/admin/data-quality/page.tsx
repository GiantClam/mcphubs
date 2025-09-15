import { Suspense } from 'react';
import DataQualityDashboard from '@/components/DataQualityDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '数据质量监控 - MCPHubs Admin',
  description: '监控和改善MCP项目数据的质量和完整性',
  robots: {
    index: false,
    follow: false
  }
};

export default function DataQualityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          数据质量监控
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          监控和改善MCP项目数据的质量和完整性
        </p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <DataQualityDashboard />
      </Suspense>
    </div>
  );
}
