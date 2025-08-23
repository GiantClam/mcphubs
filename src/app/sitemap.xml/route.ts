import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.mcphubs.com'
  
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
    '/settings',
    '/awesome-mcp-servers',
    '/integrations',
    '/development-guides',
    '/troubleshooting',
    '/monitoring',
    '/trends',
    '/compare',
    '/seo',
    '/community',
    '/blog',
    '/themes',
    '/concepts'
  ]

  // 生成 sitemap 条目
  const sitemapEntries: MetadataRoute.Sitemap = mainPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'daily' : 'weekly',
    priority: page === '' ? 1 : 0.8,
  }))

  return sitemapEntries
} 