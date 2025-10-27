'use client';

export default function HeroSkeleton() {
  return (
    <section className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-20 overflow-hidden">
      {/* 动画背景 */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20"></div>

      <div className="relative container mx-auto px-4 text-center z-10">
        {/* 标题骨架屏 */}
        <div className="mb-6">
          <div className="skeleton-title w-3/4 h-16 mx-auto mb-4"></div>
          <div className="skeleton-title w-1/2 h-16 mx-auto"></div>
        </div>

        {/* 副标题骨架屏 */}
        <div className="mb-8">
          <div className="skeleton-description w-2/3 h-6 mx-auto mb-2"></div>
          <div className="skeleton-description w-1/2 h-6 mx-auto"></div>
        </div>

        {/* 快速行动按钮骨架屏 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <div className="skeleton-button w-48 h-12 rounded-lg"></div>
          <div className="skeleton-button w-40 h-12 rounded-lg"></div>
          <div className="skeleton-button w-44 h-12 rounded-lg"></div>
        </div>

        {/* 实时统计骨架屏 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="skeleton-stat w-16 h-8 mx-auto mb-2"></div>
              <div className="skeleton-stat w-20 h-4 mx-auto"></div>
            </div>
          ))}
        </div>

        {/* 搜索栏骨架屏 */}
        <div className="max-w-2xl mx-auto">
          <div className="skeleton-input w-full h-14 rounded-full"></div>
        </div>
      </div>

      {/* 动画 MCP 图表占位符 */}
      <div className="hero-visual absolute bottom-0 right-0 w-64 h-64 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-purple-600 rounded-full animate-pulse"></div>
      </div>
    </section>
  );
}
