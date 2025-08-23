import { redirect } from 'next/navigation';

interface ServersPageProps {
  params: {
    params: string[];
  };
}

export default function ServersPage({ params }: ServersPageProps) {
  // 记录访问的服务器路径
  console.log(`🔄 服务器路径重定向: /servers/${params.params.join('/')} → /`);
  
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

// 生成静态元数据
export async function generateMetadata({ params }: ServersPageProps) {
  const serverPath = params.params.join('/');
  
  return {
    title: `MCP Hubs - ${serverPath} 重定向`,
    description: `服务器路径 /servers/${serverPath} 已重定向到主页。`,
    robots: 'noindex, nofollow',
    alternates: {
      canonical: 'https://www.mcphubs.com/'
    }
  };
}
