import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 只在非生产环境或管理员访问时提供详细信息
  const isProduction = process.env.NODE_ENV === 'production';
  
  const securityChecks = {
    // 必需的安全环境变量
    requiredSecurityVars: {
      SYNC_API_KEY: !!process.env.SYNC_API_KEY,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    // OAuth配置
    oauthConfig: {
      GITHUB_ID: !!process.env.GITHUB_ID,
      GITHUB_SECRET: !!process.env.GITHUB_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    },
    // Google Cloud配置
    googleCloudConfig: {
      GOOGLE_CLOUD_PROJECT: !!process.env.GOOGLE_CLOUD_PROJECT,
      hasCredentials: !!(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
    },
    // 可选配置
    optionalConfig: {
      GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    }
  };

  // 计算安全分数
  const requiredCount = Object.keys(securityChecks.requiredSecurityVars).length;
  const requiredPassed = Object.values(securityChecks.requiredSecurityVars).filter(Boolean).length;
  const securityScore = Math.round((requiredPassed / requiredCount) * 100);

  // 生成安全建议
  const recommendations = [];
  
  if (!process.env.SYNC_API_KEY) {
    recommendations.push('🚨 CRITICAL: 设置 SYNC_API_KEY 环境变量以保护同步API');
  }
  
  if (!process.env.NEXTAUTH_SECRET) {
    recommendations.push('🚨 CRITICAL: 设置 NEXTAUTH_SECRET 环境变量以保护会话');
  }
  
  if (!process.env.GITHUB_TOKEN) {
    recommendations.push('⚠️  建议设置 GITHUB_TOKEN 以避免API限制');
  }

  const response = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    platform: process.env.VERCEL ? 'Vercel' : 'Other',
    securityScore: securityScore,
    status: securityScore >= 100 ? 'SECURE' : securityScore >= 80 ? 'WARNING' : 'CRITICAL',
    checks: securityChecks,
    recommendations: recommendations,
    // 在生产环境中隐藏详细配置信息
    ...(isProduction ? {} : { 
      detailedInfo: '详细配置信息仅在开发环境中显示' 
    })
  };

  return NextResponse.json(response);
} 