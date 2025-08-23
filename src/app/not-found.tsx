import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            页面未找到
          </h2>
          <p className="text-gray-500 mb-8">
            抱歉，您访问的页面不存在或已被移动。
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                您可能想要访问：
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <Link
                  href="/"
                  className="flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  🏠 主页
                </Link>
                <Link
                  href="/projects"
                  className="flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  📁 项目列表
                </Link>
                <Link
                  href="/what-is-mcp"
                  className="flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  ❓ 什么是 MCP
                </Link>
                <Link
                  href="/awesome-mcp-servers"
                  className="flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  ⭐ 优秀 MCP 服务器
                </Link>
                <Link
                  href="/search"
                  className="flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  🔍 搜索项目
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="text-sm text-gray-500">
                <p className="mb-2">
                  <strong>提示：</strong>如果您是通过搜索引擎找到这个页面的，可能是因为：
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>页面已被移动或删除</li>
                  <li>URL 拼写错误</li>
                  <li>多语言路径已重定向</li>
                  <li>页面正在建设中</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                返回主页
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          如果您认为这是一个错误，请联系我们的支持团队
        </p>
      </div>
    </div>
  );
} 