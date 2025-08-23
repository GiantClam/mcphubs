import { redirect } from 'next/navigation';

interface SchemaPageProps {
  params: Promise<{
    params: string[];
  }>;
}

export default async function SchemaPage({ params }: SchemaPageProps) {
  const { params: pathParams } = await params;
  
  // 所有 schema 路径都重定向到主页
  redirect('/');
}

// 生成静态参数 - 为空，因为所有路径都重定向
export async function generateStaticParams() {
  return [];
}

// 生成静态元数据
export async function generateMetadata({ params }: SchemaPageProps) {
  const { params: pathParams } = await params;
  const schemaPath = pathParams.join('/');
  
  return {
    title: `MCP Hubs - ${schemaPath} 重定向`,
    description: `Schema 路径 /schema/${schemaPath} 已重定向到主页。`,
    robots: 'noindex, nofollow',
    alternates: {
      canonical: 'https://www.mcphubs.com/'
    }
  };
}
