import { redirect } from 'next/navigation';

interface ProjectPageProps {
  params: {
    params: string[];
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  // 所有项目路径都重定向到主页
  // 因为项目详情页面不存在，这些路径应该重定向到项目列表页面
  redirect('/projects');
}

// 生成静态参数 - 为空，因为所有路径都重定向
export async function generateStaticParams() {
  return [];
}

// 元数据
export const metadata = {
  title: 'MCP Hubs - 项目重定向',
  description: '项目页面已重定向到项目列表。',
  robots: 'noindex, nofollow' // 告诉搜索引擎不要索引这些重定向页面
};
