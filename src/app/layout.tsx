import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "MCPHubs - Model Context Protocol Projects Hub",
  description: "Discover and explore projects related to Anthropic's Model Context Protocol (MCP)",
  keywords: ["MCP", "Model Context Protocol", "Anthropic", "Claude", "AI", "LLM"],
  other: {
    'google-adsense-account': 'ca-pub-7958390626430202',
    'google-site-verification': 'adsense-verification'
  },
  robots: 'index, follow',
  authors: [{ name: 'MCPHubs Team' }],
  category: 'Technology'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        {children}
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
