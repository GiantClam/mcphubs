import { redirect } from 'next/navigation';

interface ProjectPageProps {
  params: Promise<{
    params: string[];
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { params: pathParams } = await params;
  
  // 所有项目路径都重定向到项目列表页面
  redirect('/projects');
}

// 生成静态参数 - 为空，因为所有路径都重定向
export async function generateStaticParams() {
  return [];
}

// 生成静态元数据
export async function generateMetadata({ params }: ProjectPageProps) {
  const { params: pathParams } = await params;
  const projectPath = pathParams.join('/');
  
  return {
    title: `MCP Hubs - ${projectPath} 重定向`,
    description: `项目路径 /project/${projectPath} 已重定向到项目列表。`,
    robots: 'noindex, nofollow',
    alternates: {
      canonical: 'https://www.mcphubs.com/projects'
    }
  };
}
