import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import SessionWrapper from "@/components/SessionWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "./structured-data";
import { triggerStartupSync } from "@/lib/startup-sync";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MCPHubs - MCP是什麼？Model Context Protocol开发者资源中心",
  description: "MCPHubs是专业的Model Context Protocol (MCP)开发者平台。了解MCP是什麼、awesome-mcp-servers项目集合、Claude MCP集成教程、MCP服务器开发指南。发现最佳MCP项目，学习AI应用开发的下一代协议。",
  keywords: [
    // 高搜索量中文关键词
    "mcp 是 什麼", "awesome-mcp-servers", "claude mcp", "mcp server教程", "mcp协议", "mcp客户端",
    // 英文核心关键词  
    "Model Context Protocol", "MCP", "Anthropic", "Claude", "AI", "LLM",
    // 技术相关长尾词
    "playwright-mcp", "fastapi-mcp", "blender-mcp", "mcp-grafana", "browser-tools-mcp",
    // 开发相关词
    "mcp server", "awesome mcp", "mcp tutorial", "claude desktop mcp", "cursor mcp",
    // 多语言技术词
    "MCP开发", "AI协议", "上下文协议", "模型协议", "Claude集成",
    // 日语关键词
    "MCPとは", "Model Context Protocol", "Claude MCP", "MCP サーバー",
    // 韩语关键词
    "MCP란 무엇", "Model Context Protocol", "Claude MCP", "MCP 서버",
    // 德语关键词
    "Was ist MCP", "Model Context Protocol", "Claude MCP", "MCP Server",
    // 法语关键词
    "Qu'est-ce que MCP", "Model Context Protocol", "Claude MCP", "serveur MCP",
    // 西班牙语关键词
    "Qué es MCP", "Model Context Protocol", "Claude MCP", "servidor MCP"
  ],
  openGraph: {
    title: "MCPHubs - MCP是什麼？Model Context Protocol资源中心",
    description: "探索MCP协议，学习Claude MCP集成，发现awesome-mcp-servers项目。最全面的Model Context Protocol开发者资源平台。",
    url: "https://mcphubs.com",
    siteName: "MCPHubs",
    images: [
      {
        url: "/images/og-mcphubs.jpg",
        width: 1200,
        height: 630,
        alt: "MCPHubs - Model Context Protocol开发者中心"
      }
    ],
    locale: "zh_CN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "MCPHubs - MCP协议开发者资源",
    description: "了解MCP是什麼，学习Claude MCP集成，发现最佳MCP项目",
    images: ["/images/og-mcphubs.jpg"]
  },
  other: {
    'google-adsense-account': 'ca-pub-XXXXXXXXXXXXXXXXX',
    'google-site-verification': 'adsense-verification',
    // 地理定位 - 针对高价值地区
    'geo.region': 'US-CA',
    'geo.placename': 'San Francisco',
    'geo.position': '37.7749;-122.4194',
    'ICBM': '37.7749, -122.4194',
    // 高价值市场定位
    'target-market': 'US,CA,AU,SE,JP,KR,DE,FR,ES',
    'audience': 'developers,ai-engineers,tech-professionals'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [{ name: 'MCPHubs Team' }],
  category: 'Technology',
  alternates: {
    canonical: "https://mcphubs.com",
    languages: {
      'zh-CN': 'https://mcphubs.com',
      'zh-TW': 'https://mcphubs.com/zh-tw',
      'en-US': 'https://mcphubs.com/en',
      'en-CA': 'https://mcphubs.com/en-ca',
      'en-AU': 'https://mcphubs.com/en-au',
      'en-GB': 'https://mcphubs.com/en-gb',
      'ja-JP': 'https://mcphubs.com/ja',
      'ko-KR': 'https://mcphubs.com/ko',
      'de-DE': 'https://mcphubs.com/de',
      'fr-FR': 'https://mcphubs.com/fr',
      'es-ES': 'https://mcphubs.com/es',
      'ar-SA': 'https://mcphubs.com/ar',
      'sv-SE': 'https://mcphubs.com/sv'
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 在应用启动时触发同步任务（异步执行，不阻塞页面渲染）
  if (typeof window === 'undefined') {
    // 仅在服务端执行一次
    triggerStartupSync({
      forceSync: false, // 非强制模式，智能判断是否需要同步
      skipTimeWindow: true, // 启动时跳过时间窗口限制
      delay: 3000 // 延迟3秒，确保应用完全启动
    }).catch(error => {
      console.error('启动同步触发失败:', error);
    });
  }

  return (
    <html lang="zh-CN" className="h-full">
      <head>
        {/* 高价值地区Hreflang标签 */}
        <link rel="alternate" hrefLang="zh-CN" href="https://mcphubs.com" />
        <link rel="alternate" hrefLang="en-US" href="https://mcphubs.com/en" />
        <link rel="alternate" hrefLang="en-CA" href="https://mcphubs.com/en-ca" />
        <link rel="alternate" hrefLang="en-AU" href="https://mcphubs.com/en-au" />
        <link rel="alternate" hrefLang="en-GB" href="https://mcphubs.com/en-gb" />
        <link rel="alternate" hrefLang="ja-JP" href="https://mcphubs.com/ja" />
        <link rel="alternate" hrefLang="ko-KR" href="https://mcphubs.com/ko" />
        <link rel="alternate" hrefLang="de-DE" href="https://mcphubs.com/de" />
        <link rel="alternate" hrefLang="fr-FR" href="https://mcphubs.com/fr" />
        <link rel="alternate" hrefLang="es-ES" href="https://mcphubs.com/es" />
        <link rel="alternate" hrefLang="sv-SE" href="https://mcphubs.com/sv" />
        <link rel="alternate" hrefLang="x-default" href="https://mcphubs.com/en" />
        
        {/* DNS预连接高价值地区CDN */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        
        {/* 针对高价值地区的性能优化 */}
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <StructuredData />
        <SessionWrapper>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </SessionWrapper>
        
        {/* Google Analytics - 重点追踪高价值地区 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              // 重点追踪高价值地区
              custom_map: {
                'target_regions': 'US,CA,AU,SE,JP,KR,DE,FR,ES'
              }
            });
          `}
        </Script>
        
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
