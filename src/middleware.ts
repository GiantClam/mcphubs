import { NextRequest, NextResponse } from 'next/server';

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

// 无效路径重定向映射
const INVALID_PATH_REDIRECTS: Record<string, string> = {
  '/math': '/',
  '/mcp': '/what-is-mcp',
  '/development': '/development-guides',
  '/auth': '/auth/signin',
  '/profile': '/profile',
  '/settings': '/settings'
};

// 特殊路径重定向映射
const SPECIAL_PATH_REDIRECTS: Record<string, string> = {
  '/schema': '/',
  '/examples': '/',
  '/servers': '/'
};

export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl;
  
  // 检查是否是非 www 域名
  if (hostname === 'mcphubs.com') {
    // 重定向到 www 子域名
    const url = request.nextUrl.clone();
    url.hostname = 'www.mcphubs.com';
    url.protocol = 'https:';
    
    console.log(`🔄 域名重定向: ${hostname}${pathname} → www.mcphubs.com${pathname}`);
    
    return NextResponse.redirect(url, 301);
  }
  
  // 处理特殊路径重定向
  if (SPECIAL_PATH_REDIRECTS[pathname] || pathname.startsWith('/schema/') || pathname.startsWith('/examples/') || pathname.startsWith('/servers/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    
    console.log(`🔄 特殊路径重定向: ${pathname} → /`);
    
    return NextResponse.redirect(url, 301);
  }
  
  // 处理无效路径重定向
  if (INVALID_PATH_REDIRECTS[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = INVALID_PATH_REDIRECTS[pathname];
    
    console.log(`🔄 无效路径重定向: ${pathname} → ${INVALID_PATH_REDIRECTS[pathname]}`);
    
    return NextResponse.redirect(url, 301);
  }
  
  // 处理项目相关路径重定向
  if (pathname.startsWith('/project/')) {
    // 重定向项目路径到项目列表页面
    const url = request.nextUrl.clone();
    url.pathname = '/projects';
    
    console.log(`📁 项目路径重定向: ${pathname} → /projects`);
    
    return NextResponse.redirect(url, 301);
  }
  
  // 处理多语言路径重定向
  const pathSegments = pathname.split('/').filter(Boolean);
  if (pathSegments.length > 0 && EXTENDED_LOCALES.includes(pathSegments[0])) {
    const locale = pathSegments[0];
    const pagePath = pathSegments[1];
    
    // 如果没有子路径，重定向到主页
    if (!pagePath) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      
      console.log(`🌐 多语言根路径重定向: ${pathname} → /`);
      
      return NextResponse.redirect(url, 301);
    }
    
    // 检查是否有对应的页面映射
    if (PAGE_MAPPINGS[pagePath]) {
      const url = request.nextUrl.clone();
      url.pathname = PAGE_MAPPINGS[pagePath];
      
      console.log(`🌐 多语言路径重定向: ${pathname} → ${PAGE_MAPPINGS[pagePath]}`);
      
      return NextResponse.redirect(url, 301);
    }
    
    // 如果没有映射，重定向到主页
    const url = request.nextUrl.clone();
    url.pathname = '/';
    
    console.log(`🌐 多语言无效路径重定向: ${pathname} → /`);
    
    return NextResponse.redirect(url, 301);
  }
  
  // 确保使用 HTTPS
  if (request.headers.get('x-forwarded-proto') !== 'https') {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    
    console.log(`🔒 HTTPS 重定向: ${url.toString()}`);
    
    return NextResponse.redirect(url, 301);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - api 路由
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
