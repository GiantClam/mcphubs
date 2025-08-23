import { redirect } from 'next/navigation';

interface SchemaPageProps {
  params: {
    params: string[];
  };
}

export default function SchemaPage({ params }: SchemaPageProps) {
  // 所有 schema 路径都重定向到主页
  redirect('/');
}

// 生成静态参数 - 为空，因为所有路径都重定向
export async function generateStaticParams() {
  return [];
}

// 元数据
export const metadata = {
  title: 'MCP Hubs - Schema 重定向',
  description: 'Schema 页面已重定向到主页。',
  robots: 'noindex, nofollow' // 告诉搜索引擎不要索引这些重定向页面
};
