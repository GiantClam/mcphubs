import { Suspense } from 'react';
import Link from 'next/link';
import { FaGithub, FaCode, FaUsers, FaLightbulb, FaRocket, FaBolt } from 'react-icons/fa';
import ProjectShowcase from '@/components/ProjectShowcase';

// 首页静态内容组件（服务端渲染）
function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-20">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          MCPHubs
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto leading-relaxed">
          Explore the endless possibilities of <span className="font-semibold text-yellow-300">Model Context Protocol</span>
          <br />
          Discover the latest MCP projects, tools and integration examples
        </p>
        
        {/* 静态统计信息 - 立即显示 */}
        <div className="grid grid-cols-3 gap-8 mb-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-300">200+</div>
            <div className="text-purple-200">Featured Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-300">⚡</div>
            <div className="text-purple-200">Real-time Updates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-300">
              {new Date().toLocaleDateString('en-US', { 
                timeZone: 'Asia/Shanghai',
                month: '2-digit',
                day: '2-digit'
              })}
            </div>
            <div className="text-purple-200">Auto Updates</div>
            <div className="text-xs text-purple-300 mt-1">
              Next: Daily at 6:00 AM
            </div>
          </div>
        </div>

        {/* CTA按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/projects"
            className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg"
          >
            <FaRocket className="inline mr-2" />
            Browse Projects
          </Link>
          <Link
            href="/what-is-mcp"
            className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
          >
            <FaLightbulb className="inline mr-2" />
            Learn About MCP
          </Link>
        </div>
      </div>
    </section>
  );
}

// 特性介绍部分（静态内容）
function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose MCPHubs?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your one-stop destination for Model Context Protocol resources and community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCode className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Latest Projects
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Discover cutting-edge MCP implementations and tools from the community
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Active Community
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with developers building the future of AI and language models
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBolt className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Stay updated with daily syncs of the latest MCP projects and developments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// 项目展示骨架屏
function ProjectShowcaseSkeleton() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Exploring the latest Model Context Protocol implementations
          </p>
        </div>
        
        {/* 骨架屏 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 主页组件（服务端渲染）
export default function Homepage() {
  return (
    <>
      {/* 立即显示的静态内容 */}
      <HeroSection />
      <FeaturesSection />
      
      {/* 异步加载的项目数据 */}
      <Suspense fallback={<ProjectShowcaseSkeleton />}>
        <ProjectShowcase />
      </Suspense>

      {/* 搜索关键词部分 */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Popular Keywords
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'awesome-mcp-servers', 'claude-mcp', 'mcp-server', 'anthropic-mcp',
                'mcp-client', 'mcp-protocol', 'context-protocol', 'ai-assistant',
                'mcp-integration', 'model-context'
              ].map((keyword) => (
                <span
                  key={keyword}
                  className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
