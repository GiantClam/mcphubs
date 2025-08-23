import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.mcphubs.com'; // 使用 www 子域名
  const currentDate = new Date().toISOString();

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
      url: '/development-guides',
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
      url: '/privacy-policy',
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: currentDate,
      importance: 'high' // 重要法律页面
    },
    {
      url: '/terms-of-service',
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: currentDate,
      importance: 'high' // 重要法律页面
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

  // 生成XML内容
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate'
    }
  });
} 