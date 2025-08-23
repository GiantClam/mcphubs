import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.mcphubs.com';
  
  // 主要页面
  const mainPages = [
    '',
    '/troubleshooting',
    '/projects',
    '/trends',
    '/compare',
    '/privacy-policy',
    '/development-guides',
    '/terms-of-service',
    '/monitoring',
    '/search',
    '/integrations',
    '/seo',
    '/community',
    '/blog',
    '/awesome-mcp-servers',
    '/what-is-mcp',
    '/themes',
    '/concepts',
    '/auth/signin',
    '/profile',
    '/settings'
  ];

  // 生成 XML 内容
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainPages.map(page => `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate'
    }
  });
} 