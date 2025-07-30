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
  title: "MCPHubs - What is MCP? Model Context Protocol Developer Resource Center",
  description: "MCPHubs is a professional Model Context Protocol (MCP) developer platform. Learn what MCP is, awesome-mcp-servers project collection, Claude MCP integration tutorials, MCP server development guides. Discover the best MCP projects and learn the next-generation protocol for AI application development.",
  keywords: [
    // High search volume Chinese keywords
    "mcp 是 什麼", "awesome-mcp-servers", "claude mcp", "mcp server教程", "mcp协议", "mcp客户端",
    // English core keywords
    "Model Context Protocol", "MCP", "Anthropic", "Claude", "AI", "LLM",
    // Technology-related long-tail keywords
    "playwright-mcp", "fastapi-mcp", "blender-mcp", "mcp-grafana", "browser-tools-mcp",
    // Development-related keywords
    "mcp server", "awesome mcp", "mcp tutorial", "claude desktop mcp", "cursor mcp",
    // Multi-language technical keywords
    "MCP开发", "AI协议", "上下文协议", "模型协议", "Claude集成",
    // Japanese keywords
    "MCPとは", "Model Context Protocol", "Claude MCP", "MCP サーバー",
    // Korean keywords
    "MCP란 무엇", "Model Context Protocol", "Claude MCP", "MCP 서버",
    // German keywords
    "Was ist MCP", "Model Context Protocol", "Claude MCP", "MCP Server",
    // French keywords
    "Qu'est-ce que MCP", "Model Context Protocol", "Claude MCP", "serveur MCP",
    // Spanish keywords
    "Qué es MCP", "Model Context Protocol", "Claude MCP", "servidor MCP"
  ],
  openGraph: {
    title: "MCPHubs - What is MCP? Model Context Protocol Resource Center",
    description: "Explore MCP protocol, learn Claude MCP integration, discover awesome-mcp-servers projects. The most comprehensive Model Context Protocol developer resource platform.",
    url: "https://mcphubs.com",
    siteName: "MCPHubs",
    images: [
      {
        url: "/images/og-mcphubs.jpg",
        width: 1200,
        height: 630,
        alt: "MCPHubs - Model Context Protocol Developer Center"
      }
    ],
    locale: "zh_CN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "MCPHubs - MCP Protocol Developer Resources",
    description: "Learn what MCP is, learn Claude MCP integration, discover the best MCP projects",
    images: ["/images/og-mcphubs.jpg"]
  },
  other: {
    'google-adsense-account': 'ca-pub-7958390626430202',
    'google-site-verification': 'adsense-verification',
    // Geographic targeting - targeting high-value regions
    'geo.region': 'US-CA',
    'geo.placename': 'San Francisco',
    'geo.position': '37.7749;-122.4194',
    'ICBM': '37.7749, -122.4194',
    // High-value market targeting
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
  // Trigger sync tasks on app startup (async execution, doesn't block page rendering)
  if (typeof window === 'undefined') {
          // Only execute once on server side
    triggerStartupSync({
              forceSync: false, // Non-forced mode, intelligently determine if sync is needed
              skipTimeWindow: true, // Skip time window limit on startup
        delay: 3000 // Delay 3 seconds to ensure app is fully started
          }).catch(error => {
        console.error('Startup sync trigger failed:', error);
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
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7958390626430202"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
