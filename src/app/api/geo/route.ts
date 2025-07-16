import { NextRequest, NextResponse } from 'next/server';
import { regionConfig, highValueLocales } from '@/lib/i18n';

// 高价值地区IP范围映射（简化版本，生产环境建议使用专业的地理IP数据库）
const highValueRegions = {
  'US': ['208.67.222.222', '8.8.8.8'], // 美国
  'CA': ['142.46.0.0'], // 加拿大
  'AU': ['1.1.1.1'], // 澳大利亚
  'SE': ['194.14.0.0'], // 瑞典
  'JP': ['210.173.160.0'], // 日本
  'KR': ['210.89.160.0'], // 韩国
  'DE': ['62.146.0.0'], // 德国
  'FR': ['2.0.0.0'], // 法国
  'ES': ['88.0.0.0'], // 西班牙
};

// 根据Accept-Language头部检测语言偏好
function detectLanguageFromHeader(acceptLanguage: string | null): string {
  if (!acceptLanguage) return 'zh-CN';
  
  const languages = acceptLanguage.split(',').map(lang => {
    const [code, quality = '1'] = lang.trim().split(';q=');
    return { code: code.trim(), quality: parseFloat(quality) };
  }).sort((a, b) => b.quality - a.quality);
  
  for (const lang of languages) {
    // 直接匹配
    if (lang.code in highValueLocales) {
      return lang.code;
    }
    
    // 语言代码匹配（如en匹配en-US）
    const matchingLocale = Object.keys(highValueLocales).find(locale => 
      locale.startsWith(lang.code.split('-')[0])
    );
    if (matchingLocale) {
      return matchingLocale;
    }
  }
  
  return 'zh-CN';
}

// 根据用户代理检测设备类型
function detectDeviceType(userAgent: string | null): string {
  if (!userAgent) return 'desktop';
  
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  }
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  }
  return 'desktop';
}

// 根据Cloudflare头部获取地区（如果使用Cloudflare）
function getCloudflareCountry(headers: Headers): string | null {
  return headers.get('cf-ipcountry') || 
         headers.get('x-vercel-ip-country') || 
         headers.get('x-country-code');
}

export async function GET(request: NextRequest) {
  const headers = request.headers;
  const userAgent = headers.get('user-agent');
  const acceptLanguage = headers.get('accept-language');
  const xForwardedFor = headers.get('x-forwarded-for');
  const xRealIp = headers.get('x-real-ip');
  const clientIp = xForwardedFor?.split(',')[0] || xRealIp || 'unknown';
  
  // 获取地区信息
  const cloudflareCountry = getCloudflareCountry(headers);
  
  // 检测是否为高价值地区
  let detectedRegion = 'CN'; // 默认
  let isHighValueRegion = false;
  
  if (cloudflareCountry && cloudflareCountry in regionConfig) {
    detectedRegion = cloudflareCountry;
    isHighValueRegion = true;
  } else {
    // 简单的IP地址检测（生产环境建议使用专业服务）
    for (const [region, ips] of Object.entries(highValueRegions)) {
      if (ips.some(ip => clientIp.startsWith(ip.split('.').slice(0, 2).join('.')))) {
        detectedRegion = region;
        isHighValueRegion = true;
        break;
      }
    }
  }
  
  // 获取推荐语言
  const recommendedLanguage = detectLanguageFromHeader(acceptLanguage);
  
  // 获取设备类型
  const deviceType = detectDeviceType(userAgent);
  
  // 构建响应数据
  const geoData = {
    region: detectedRegion,
    isHighValueRegion,
    recommendedLanguage,
    deviceType,
    clientIp: clientIp.replace(/\d+$/, 'xxx'), // 隐私保护
    currency: regionConfig[detectedRegion as keyof typeof regionConfig]?.currency || 'USD',
    timezone: regionConfig[detectedRegion as keyof typeof regionConfig]?.timezone || 'UTC',
    priority: regionConfig[detectedRegion as keyof typeof regionConfig]?.priority || 1,
    availableLanguages: Object.entries(highValueLocales)
      .filter(([_, locale]) => isHighValueRegion ? locale.priority >= 3 : true)
      .sort((a, b) => b[1].priority - a[1].priority)
      .map(([code, locale]) => ({
        code,
        name: locale.name,
        nativeName: locale.nativeName,
        flag: locale.flag,
        region: locale.region
      })),
    features: {
      // 为高价值地区启用高级功能
      premiumSupport: isHighValueRegion,
      realtimeUpdates: isHighValueRegion,
      advancedAnalytics: isHighValueRegion,
      priorityBandwidth: isHighValueRegion,
      multiLanguageSupport: true,
      customization: isHighValueRegion
    },
    seoOptimization: {
      // SEO优化建议
      primaryKeywords: isHighValueRegion ? [
        'awesome-mcp-servers',
        'what is mcp',
        'claude mcp',
        'mcp server tutorial',
        'Model Context Protocol'
      ] : [
        'mcp 是 什麼',
        'awesome-mcp-servers', 
        'claude mcp',
        'mcp server教程',
        'MCP协议'
      ],
      marketPriority: isHighValueRegion ? 'high' : 'medium',
      contentStrategy: isHighValueRegion ? 'premium' : 'standard'
    }
  };
  
  return NextResponse.json(geoData, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// 处理OPTIONS请求（CORS预检）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
} 