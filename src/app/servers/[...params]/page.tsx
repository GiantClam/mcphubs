import { redirect } from 'next/navigation';

interface ServersPageProps {
  params: {
    params: string[];
  };
}

export default function ServersPage({ params }: ServersPageProps) {
  // 所有 servers 路径都重定向到主页
  redirect('/');
}

// 生成静态参数 - 为空，因为所有路径都重定向
export async function generateStaticParams() {
  return [];
}

// 元数据
export const metadata = {
  title: 'MCP Hubs - Servers 重定向',
  description: 'Servers 页面已重定向到主页。',
  robots: 'noindex, nofollow' // 告诉搜索引擎不要索引这些重定向页面
};
