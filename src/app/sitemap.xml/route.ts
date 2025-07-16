import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://mcphubs.com';
  const currentDate = new Date().toISOString();

  // 高价值地区语言配置
  const highValueLanguages = [
    { code: 'zh-CN', prefix: '', region: 'CN' }, // 中文默认
    { code: 'en-US', prefix: '/en', region: 'US' }, // 美国英语
    { code: 'en-CA', prefix: '/en-ca', region: 'CA' }, // 加拿大英语
    { code: 'en-AU', prefix: '/en-au', region: 'AU' }, // 澳大利亚英语
    { code: 'ja-JP', prefix: '/ja', region: 'JP' }, // 日语
    { code: 'ko-KR', prefix: '/ko', region: 'KR' }, // 韩语
    { code: 'de-DE', prefix: '/de', region: 'DE' }, // 德语
    { code: 'fr-FR', prefix: '/fr', region: 'FR' }, // 法语
    { code: 'es-ES', prefix: '/es', region: 'ES' }, // 西班牙语
    { code: 'sv-SE', prefix: '/sv', region: 'SE' }, // 瑞典语
  ];

  // 定义网站页面，按SEO优先级排序
  const pages = [
    {
      url: '',
      changefreq: 'daily',
      priority: '1.0',
      lastmod: currentDate,
      importance: 'high' // 高价值页面
    },
    {
      url: '/what-is-mcp',
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: currentDate,
      importance: 'high'
    },
    {
      url: '/awesome-mcp-servers',
      changefreq: 'weekly', 
      priority: '0.9',
      lastmod: currentDate,
      importance: 'high'
    },
    {
      url: '/projects',
      changefreq: 'daily',
      priority: '0.8',
      lastmod: currentDate,
      importance: 'high'
    },
    {
      url: '/integrations',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate,
      importance: 'medium'
    },
    {
      url: '/community',
      changefreq: 'daily',
      priority: '0.7',
      lastmod: currentDate,
      importance: 'medium'
    },
    {
      url: '/development',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate,
      importance: 'medium'
    },
    {
      url: '/concepts',
      changefreq: 'weekly',
      priority: '0.6',
      lastmod: currentDate,
      importance: 'medium'
    },
    {
      url: '/compare',
      changefreq: 'weekly',
      priority: '0.6',
      lastmod: currentDate,
      importance: 'medium'
    },
    {
      url: '/troubleshooting',
      changefreq: 'weekly',
      priority: '0.6',
      lastmod: currentDate,
      importance: 'medium'
    },
    {
      url: '/monitoring',
      changefreq: 'weekly',
      priority: '0.5',
      lastmod: currentDate,
      importance: 'low'
    },
    {
      url: '/blog',
      changefreq: 'weekly',
      priority: '0.5',
      lastmod: currentDate,
      importance: 'low'
    },
    {
      url: '/trends',
      changefreq: 'weekly',
      priority: '0.5',
      lastmod: currentDate,
      importance: 'low'
    },
    {
      url: '/seo',
      changefreq: 'monthly',
      priority: '0.4',
      lastmod: currentDate,
      importance: 'low'
    },
    {
      url: '/search',
      changefreq: 'monthly',
      priority: '0.4',
      lastmod: currentDate,
      importance: 'low'
    },
    {
      url: '/themes',
      changefreq: 'monthly',
      priority: '0.3',
      lastmod: currentDate,
      importance: 'low'
    }
  ];

  // 定义URL对象类型
  interface SitemapUrl {
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
    hreflangLinks: string;
    importance: 'high' | 'medium' | 'low';
    language: string;
    region: string;
  }

  // 生成所有页面的多语言URL
  const allUrls: SitemapUrl[] = [];
  
  pages.forEach(page => {
    highValueLanguages.forEach(lang => {
      const fullUrl = `${baseUrl}${lang.prefix}${page.url}`;
      
      // 生成所有语言的hreflang链接
      const hreflangLinks = highValueLanguages.map(l => 
        `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${baseUrl}${l.prefix}${page.url}"/>`
      ).join('\n');
      
      // 添加x-default指向英文版
      const xDefaultLink = `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en${page.url}"/>`;
      
      allUrls.push({
        loc: fullUrl,
        lastmod: page.lastmod,
        changefreq: page.changefreq,
        priority: page.priority,
        hreflangLinks: hreflangLinks + '\n' + xDefaultLink,
        importance: page.importance as 'high' | 'medium' | 'low',
        language: lang.code,
        region: lang.region
      });
    });
  });

  // 按重要性和地区价值排序
  const regionPriority: Record<string, number> = { 'US': 10, 'CA': 9, 'AU': 8, 'SE': 7, 'JP': 6, 'KR': 5, 'DE': 4, 'FR': 3, 'ES': 2, 'CN': 1 };
  allUrls.sort((a, b) => {
    const importanceWeight: Record<string, number> = { 'high': 3, 'medium': 2, 'low': 1 };
    const aWeight = importanceWeight[a.importance] * 100 + (regionPriority[a.region] || 0);
    const bWeight = importanceWeight[b.importance] * 100 + (regionPriority[b.region] || 0);
    return bWeight - aWeight;
  });

  // 生成XML内容
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
${url.hreflangLinks}
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate'
    }
  });
} 