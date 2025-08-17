import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 设置正确的 metadataBase
  experimental: {
    metadataBase: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://your-domain.com', // 替换为你的实际域名
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'opengraph.githubassets.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'opengraph.githubassets.com',
        pathname: '**',
      },
    ],
  },
  
  // 根据环境变量决定是否启用代理
  async rewrites() {
    // 只在开发环境下启用代理
    if (process.env.NODE_ENV === 'development') {
      console.log('Enabling API proxies for development environment');
      return [
        // GitHub API 代理
        {
          source: '/api/github/:path*',
          destination: 'https://api.github.com/:path*',
        },
        // Google Vertex AI 代理
        {
          source: '/api/vertex/:path*',
          destination: 'https://us-central1-aiplatform.googleapis.com/v1/:path*',
        },
      ];
    }
    
    // 生产环境下返回空数组，不启用任何代理
    console.log('Production environment detected: API proxies disabled');
    return [];
  },
  
  // 环境变量配置
  env: {
    // 添加一个环境变量，指示当前环境类型
    APP_ENV: process.env.NODE_ENV,
  },
};

export default nextConfig;
