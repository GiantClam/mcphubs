import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

// 支持的语言列表
const SUPPORTED_LOCALES = [
  'en', 'es', 'fr', 'de', 'ja', 'ko', 'sv', 'ar', 'zh', 'ru', 'pt', 'it', 'nl'
];

// 扩展的语言变体
const EXTENDED_LOCALES = [
  ...SUPPORTED_LOCALES,
  'en-ca', 'en-au', 'en-gb', 'zh-tw', 'zh-cn', 'zh-hk'
];

// 页面路径映射
const PAGE_MAPPINGS: Record<string, string> = {
  'troubleshooting': '/troubleshooting',
  'projects': '/projects',
  'trends': '/trends',
  'compare': '/compare',
  'privacy-policy': '/privacy-policy',
  'development': '/development-guides',
  'terms-of-service': '/terms-of-service',
  'monitoring': '/monitoring',
  'search': '/search',
  'integrations': '/integrations',
  'seo': '/seo',
  'community': '/community',
  'blog': '/blog',
  'awesome-mcp-servers': '/awesome-mcp-servers',
  'what-is-mcp': '/what-is-mcp',
  'themes': '/themes',
  'concepts': '/concepts'
};

interface LocalePageProps {
  params: Promise<{
    locale: string;
    params: string[];
  }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale, params: pathParams } = await params;
  
  // 检查是否是支持的语言
  if (!EXTENDED_LOCALES.includes(locale)) {
    notFound();
  }

  // 如果没有子路径，重定向到主页
  if (pathParams.length === 0) {
    redirect('/');
  }

  // 获取页面路径
  const pagePath = pathParams[0];
  
  // 检查是否有对应的页面映射
  if (PAGE_MAPPINGS[pagePath]) {
    // 重定向到对应的英文页面
    redirect(PAGE_MAPPINGS[pagePath]);
  }

  // 如果没有映射，重定向到主页
  redirect('/');
}

// 生成元数据
export async function generateMetadata({ params }: LocalePageProps) {
  const { locale, params: pathParams } = await params;
  
  return {
    title: `MCP Hubs - ${locale} 多语言支持`,
    description: `MCP Hubs 提供 ${locale} 语言支持，访问我们的网站获取更多信息。`,
    robots: 'noindex, nofollow',
    alternates: {
      canonical: 'https://www.mcphubs.com/'
    }
  };
}
