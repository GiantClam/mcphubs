import ClientWrapper from "@/components/ClientWrapper";
import Link from "next/link";
import { FaCode, FaBook, FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";

export const metadata = {
  title: 'MCP 是什麼？Model Context Protocol完整指南 | MCPHubs',
  description: '深入了解MCP是什麼！Model Context Protocol (MCP)是Anthropic开发的AI协议，用于Claude等模型与外部工具的通信。学习MCP协议原理、应用场景和开发指南。',
  keywords: [
    'mcp 是 什麼', 'Model Context Protocol', 'MCP协议', 'claude mcp', 'anthropic mcp',
    'mcp meaning', 'AI协议', '上下文协议', 'MCP定义', 'MCP是什么意思',
    'mcp tutorial', 'mcp开发', 'AI工具集成', 'Claude集成'
  ],
  openGraph: {
    title: 'MCP 是什麼？完整了解Model Context Protocol',
    description: '全面解析MCP协议：从基础概念到实际应用，了解Anthropic Model Context Protocol如何革新AI应用开发',
    images: ['/images/og-what-is-mcp.jpg'],
    url: 'https://mcphubs.com/what-is-mcp'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCP 是什麼？Model Context Protocol指南',
    description: '深入了解MCP协议，学习如何使用Model Context Protocol开发AI应用'
  },
  alternates: {
    canonical: 'https://mcphubs.com/what-is-mcp'
  }
};

export default function WhatIsMCP() {
  return (
    <ClientWrapper>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              什么是 MCP？
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              MCP 有多种含义，本页面将帮助您找到正确的信息
            </p>
          </section>

          {/* Anthropic MCP 定义区 */}
          <section className="mb-12">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaCode className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Anthropic 模型上下文协议 (MCP)
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-4">
                    <p className="text-lg">
                      <strong>Model Context Protocol (MCP)</strong> 是由 Anthropic 开发的标准化协议，
                      用于连接 AI 助手（如 Claude）与外部数据源和工具。
                    </p>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">核心特点：</h3>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                        <li className="flex items-start">
                          <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                          <span><strong>客户端-主机-服务器架构</strong>：清晰的三层架构设计</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                          <span><strong>易于构建</strong>：简单的 API 和丰富的开发工具</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                          <span><strong>可组合性</strong>：模块化设计，支持灵活组合</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                          <span><strong>安全隔离</strong>：内置安全机制和权限控制</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                          <span><strong>能力协商</strong>：动态发现和匹配功能</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">核心原语：</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-purple-600 dark:text-purple-400">Prompts</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">定义和管理提示模板</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-purple-600 dark:text-purple-400">Resources</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">访问外部数据源和文件</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-purple-600 dark:text-purple-400">Tools</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">执行外部操作和函数</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-purple-600 dark:text-purple-400">Sampling</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">与语言模型交互</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/concepts" 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                    >
                      <FaBook className="w-5 h-5" />
                      深入了解 MCP 概念
                      <FaArrowRight className="w-4 h-4" />
                    </Link>
                    <Link 
                      href="/projects" 
                      className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                    >
                      <FaCode className="w-5 h-5" />
                      浏览 MCP 项目
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 其他 MCP 含义消歧区 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              其他 MCP 含义
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
              MCP 在不同领域有不同的含义，以下是一些常见的其他含义：
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Microsoft Certified Professional</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  微软认证专家，微软公司的技术认证项目
                </p>
                <a 
                  href="https://learn.microsoft.com/en-us/certifications/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm inline-flex items-center gap-1"
                >
                  了解更多 <FaExternalLinkAlt className="w-3 h-3" />
                </a>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Master Control Program</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  主控程序，计算机科学中的控制程序概念
                </p>
                <span className="text-gray-500 dark:text-gray-400 text-sm">计算机科学术语</span>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Metacarpophalangeal</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  掌指关节，医学解剖学术语
                </p>
                <span className="text-gray-500 dark:text-gray-400 text-sm">医学术语</span>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Monocyte Chemoattractant Protein</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  单核细胞趋化蛋白，生物学研究中的重要蛋白质
                </p>
                <span className="text-gray-500 dark:text-gray-400 text-sm">生物学术语</span>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Multi-Channel Protocol</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  多通道协议，网络通信中的协议类型
                </p>
                <span className="text-gray-500 dark:text-gray-400 text-sm">网络技术</span>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">其他含义</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  MCP 在其他领域还有更多含义，具体取决于使用场景
                </p>
                <span className="text-gray-500 dark:text-gray-400 text-sm">各种领域</span>
              </div>
            </div>
          </section>

          {/* 声明区 */}
          <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              关于本网站
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              <strong>MCPHubs.com</strong> 专注于 Anthropic 的 Model Context Protocol (MCP)。
              本网站的所有内容都围绕这个特定的 MCP 协议展开，包括项目展示、开发指南、社区讨论等。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/concepts" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <FaBook className="w-5 h-5" />
                开始学习 MCP
              </Link>
              <Link 
                href="/community" 
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                加入社区讨论
              </Link>
            </div>
          </section>
        </div>
      </main>
    </ClientWrapper>
  );
} 