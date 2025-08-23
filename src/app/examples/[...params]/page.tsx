import { redirect } from 'next/navigation';

interface ExamplesPageProps {
  params: Promise<{
    params: string[];
  }>;
}

export default async function ExamplesPage({ params }: ExamplesPageProps) {
  const { params: pathParams } = await params;
  
  // 所有 examples 路径都重定向到主页
  redirect('/');
}

// 生成静态参数 - 为空，因为所有路径都重定向
export async function generateStaticParams() {
  return [];
}

// 生成静态元数据
export async function generateMetadata({ params }: ExamplesPageProps) {
  const { params: pathParams } = await params;
  const examplesPath = pathParams.join('/');
  
  return {
    title: `MCP Hubs - ${examplesPath} 重定向`,
    description: `Examples 路径 /examples/${examplesPath} 已重定向到主页。`,
    robots: 'noindex, nofollow',
    alternates: {
      canonical: 'https://www.mcphubs.com/'
    }
  };
}
