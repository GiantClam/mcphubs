import { Suspense } from 'react';
import CurationDashboard from '@/components/CurationDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '内容策展管理 - MCPHubs Admin',
  description: '管理社区提交和推荐项目',
  robots: {
    index: false,
    follow: false
  }
};

export default function CurationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          内容策展管理
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          管理社区提交的服务器和推荐项目
        </p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <CurationDashboard />
      </Suspense>
    </div>
  );
}
