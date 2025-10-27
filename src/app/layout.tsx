import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import SessionWrapper from "@/components/SessionWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import SkipNavigation from "@/components/SkipNavigation";
import StructuredData from "./structured-data";
import { triggerStartupSync } from "@/lib/startup-sync";
import "./globals.css";
import "../styles/mobile.css";
import "../styles/skeleton.css";
import "../styles/accessibility.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 获取站点 URL，优先使用环境变量，否则使用默认值
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mcphubs.com';

export const metadata: Metadata = {
  title: "MCPHubs - Discover 200+ Model Context Protocol Projects | AI Development Platform",
  description: "MCPHubs is the ultimate Model Context Protocol (MCP) developer platform. Discover 200+ MCP projects, learn Claude MCP integration, explore awesome-mcp-servers collection, and master AI application development with comprehensive tutorials, tools, and real-time updates.",
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
    title: "MCPHubs - Discover 200+ Model Context Protocol Projects | AI Development Platform",
    description: "The ultimate MCP developer platform. Discover 200+ projects, learn Claude integration, explore awesome-mcp-servers collection. Comprehensive tutorials, tools, and real-time updates for AI development.",
    url: siteUrl,
    siteName: "MCPHubs",
    images: [
      {
        url: `${siteUrl}/images/og-mcphubs.jpg`,
        width: 1200,
        height: 630,
        alt: "MCPHubs - Model Context Protocol Developer Center"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "MCPHubs - Discover 200+ Model Context Protocol Projects",
    description: "The ultimate MCP developer platform. Discover projects, learn Claude integration, explore awesome-mcp-servers collection.",
    images: [`${siteUrl}/images/og-mcphubs.jpg`]
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
    canonical: siteUrl,
    languages: {
      'en-US': siteUrl,
      'zh-CN': `${siteUrl}/zh-cn`,
      'zh-TW': `${siteUrl}/zh-tw`,
      'en-CA': `${siteUrl}/en-ca`,
      'en-AU': `${siteUrl}/en-au`,
      'en-GB': `${siteUrl}/en-gb`,
      'ja-JP': `${siteUrl}/ja`,
      'ko-KR': `${siteUrl}/ko`,
      'de-DE': `${siteUrl}/de`,
      'fr-FR': `${siteUrl}/fr`,
      'es-ES': `${siteUrl}/es`,
      'ar-SA': `${siteUrl}/ar`,
      'sv-SE': `${siteUrl}/sv`
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Trigger sync tasks on app startup (async execution, doesn't block page rendering)
  // Only trigger in production environment to avoid execution during build
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
          // Only execute once on server side in production
    triggerStartupSync({
              forceSync: false, // Non-forced mode, intelligently determine if sync is needed
              skipTimeWindow: true, // Skip time window limit on startup
        delay: 3000 // Delay 3 seconds to ensure app is fully started
          }).catch(error => {
        console.error('Startup sync trigger failed:', error);
    });
  }

  return (
    <html lang="en-US" className="h-full">
      <head>
        {/* High-value region Hreflang tags */}
        <link rel="alternate" hrefLang="en-US" href="https://mcphubs.com" />
        <link rel="alternate" hrefLang="zh-CN" href="https://mcphubs.com/zh-cn" />
        <link rel="alternate" hrefLang="en-CA" href="https://mcphubs.com/en-ca" />
        <link rel="alternate" hrefLang="en-AU" href="https://mcphubs.com/en-au" />
        <link rel="alternate" hrefLang="en-GB" href="https://mcphubs.com/en-gb" />
        <link rel="alternate" hrefLang="ja-JP" href="https://mcphubs.com/ja" />
        <link rel="alternate" hrefLang="ko-KR" href="https://mcphubs.com/ko" />
        <link rel="alternate" hrefLang="de-DE" href="https://mcphubs.com/de" />
        <link rel="alternate" hrefLang="fr-FR" href="https://mcphubs.com/fr" />
        <link rel="alternate" hrefLang="es-ES" href="https://mcphubs.com/es" />
        <link rel="alternate" hrefLang="sv-SE" href="https://mcphubs.com/sv" />
        <link rel="alternate" hrefLang="x-default" href="https://mcphubs.com" />
        
        {/* DNS prefetch for high-value region CDN */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        
        {/* Performance optimization for high-value regions */}
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <SkipNavigation />
        <StructuredData />
        <SessionWrapper>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main id="main-content" className="flex-grow pb-16 md:pb-0">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
        </SessionWrapper>
        
        {/* Google Analytics - Focus on tracking high-value regions */}
        {/* TODO: Replace with actual Google Analytics ID */}
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              // Focus on tracking high-value regions
              custom_map: {
                'target_regions': 'US,CA,AU,SE,JP,KR,DE,FR,ES'
              }
            });
          `}
        </Script> */}
        
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
