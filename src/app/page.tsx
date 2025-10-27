import { Suspense } from 'react';
import { FaCode, FaUsers, FaBolt } from 'react-icons/fa';
import ProjectShowcase from '@/components/ProjectShowcase';
import Hero from '@/components/Hero';
import EnhancedFeaturedProjects from '@/components/EnhancedFeaturedProjects';
import QuickNavigation from '@/components/QuickNavigation';

// Features introduction section (static content)
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

// Project showcase skeleton screen
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
        
        {/* Skeleton screen */}
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

// Homepage component (server-side rendering)
export default function Homepage() {
  return (
    <>
      {/* 新的优化 Hero 区域 */}
      <Hero />
      
      {/* 快速导航面板 */}
      <QuickNavigation />
      
      {/* 特色功能介绍 */}
      <FeaturesSection />
      
      {/* 增强的推荐项目展示 */}
      <Suspense fallback={
        <div className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading featured projects...</span>
            </div>
          </div>
        </div>
      }>
        <EnhancedFeaturedProjects />
      </Suspense>

      {/* 异步加载项目数据 */}
      <Suspense fallback={<ProjectShowcaseSkeleton />}>
        <ProjectShowcase />
      </Suspense>

      {/* SEO 关键词部分 */}
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
                'mcp-integration', 'model-context', 'web scraping', 'database',
                'typescript', 'python', 'claude desktop', 'cursor mcp'
              ].map((keyword) => (
                <span
                  key={keyword}
                  className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors cursor-pointer"
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
