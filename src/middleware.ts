import { NextRequest, NextResponse } from 'next/server';

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
