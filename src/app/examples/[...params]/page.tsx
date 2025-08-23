import { redirect } from 'next/navigation';

interface ExamplesPageProps {
  params: {
    params: string[];
  };
}

export default function ExamplesPage({ params }: SchemaPageProps) {
  // 所有 examples 路径都重定向到主页
  redirect('/');
}

// 生成静态参数 - 为空，因为所有路径都重定向
export async function generateStaticParams() {
  return [];
}

// 元数据
export const metadata = {
  title: 'MCP Hubs - Examples 重定向',
  description: 'Examples 页面已重定向到主页。',
  robots: 'noindex, nofollow' // 告诉搜索引擎不要索引这些重定向页面
};
