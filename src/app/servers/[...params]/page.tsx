import { redirect } from 'next/navigation';

interface ServersPageProps {
  params: Promise<{
    params: string[];
  }>;
}

export default async function ServersPage({ params }: ServersPageProps) {
  const { params: pathParams } = await params;
  
  // 记录访问的服务器路径
  console.log(`🔄 服务器路径重定向: /servers/${pathParams.join('/')} → /`);
  
  // 所有 servers 路径都重定向到主页
  redirect('/');
}

// 生成静态参数 - 为空，因为所有路径都重定向
export async function generateStaticParams() {
  return [];
}

// 生成静态元数据
export async function generateMetadata({ params }: ServersPageProps) {
  const { params: pathParams } = await params;
  const serverPath = pathParams.join('/');
  
  return {
    title: `MCP Hubs - ${serverPath} 重定向`,
    description: `服务器路径 /servers/${serverPath} 已重定向到主页。`,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: 'https://www.mcphubs.com/'
    }
  };
}
