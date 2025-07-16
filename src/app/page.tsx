import Link from 'next/link';
import { FaGithub, FaCode, FaUsers, FaLightbulb, FaRocket, FaBolt } from 'react-icons/fa';
import ProjectShowcase from '@/components/ProjectShowcase';
import { getProjects } from '@/lib/project-service';

export default async function Home() {
  // 使用新的项目服务获取数据
  const projectResult = await getProjects({ 
    strategy: 'database-first',
    cacheTimeout: 30 // 30分钟缓存
  });
  
  const projects = projectResult.projects;

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            MCPHubs
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto leading-relaxed">
            探索 <span className="font-semibold text-yellow-300">Model Context Protocol</span> 的无限可能
            <br />
            发现最新的 MCP 项目、工具和集成案例
          </p>
          
          {/* 数据统计 */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">{projects.length}+</div>
              <div className="text-purple-200">精选项目</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">
                {projectResult.source === 'database' ? '⚡' : '🔄'}
              </div>
              <div className="text-purple-200">
                {projectResult.cached ? '缓存加速' : projectResult.source === 'database' ? '数据库' : 'GitHub API'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300">24/7</div>
              <div className="text-purple-200">自动更新</div>
            </div>
          </div>

          {/* 热门搜索关键词 */}
          <div className="mb-8">
            <p className="text-purple-200 mb-4">🔥 热门搜索：</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'mcp 是 什麼', 'awesome-mcp-servers', 'claude mcp', 
                'mcp server教程', 'anthropic mcp', 'model context protocol'
              ].map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm hover:bg-white/30 transition-colors cursor-pointer"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/projects" 
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors inline-flex items-center justify-center"
            >
              <FaCode className="mr-2" />
              浏览项目
            </Link>
            <Link 
              href="/what-is-mcp" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors inline-flex items-center justify-center"
            >
              <FaLightbulb className="mr-2" />
              了解 MCP
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            为什么选择 MCPHubs？
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaRocket className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">智能项目发现</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                我们的 AI 系统自动分析和评估 GitHub 上的 MCP 相关项目，为您推荐最相关的工具和资源。
              </p>
              <Link href="/projects" className="text-purple-600 dark:text-purple-400 hover:underline">
                探索项目 →
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaBolt className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">实时数据同步</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                每天早上6点自动同步最新的项目信息，确保您始终获得最新、最准确的 MCP 生态系统数据。
              </p>
              <Link href="/monitoring" className="text-blue-600 dark:text-blue-400 hover:underline">
                查看监控 →
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaUsers className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">社区互动</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                参与 MCP 社区讨论，分享经验，获取支持，与其他开发者交流合作。
              </p>
              <Link href="/community" className="text-green-600 dark:text-green-400 hover:underline">
                加入社区 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 项目展示 */}
      <ProjectShowcase initialProjects={projects} />

      {/* 快速链接区 */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            快速导航
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/awesome-mcp-servers" className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🌟</div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600">Awesome MCP</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">精选的 MCP 服务器项目合集</p>
            </Link>
            
            <Link href="/integrations" className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🔗</div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600">集成案例</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">真实的 MCP 集成应用场景</p>
            </Link>
            
            <Link href="/troubleshooting" className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🛠️</div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600">故障排除</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">常见问题解决方案</p>
            </Link>
            
            <a 
              href="https://github.com/search?q=model+context+protocol" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-3"><FaGithub /></div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600">GitHub 搜索</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">在 GitHub 上搜索更多项目</p>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
