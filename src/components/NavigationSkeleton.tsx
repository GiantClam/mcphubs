'use client';

export default function NavigationSkeleton() {
  return (
    <nav className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-8">
      <div className="flex items-center justify-between">
        {/* Logo 骨架屏 */}
        <div className="skeleton-title w-32 h-8"></div>
        
        {/* 导航项骨架屏 */}
        <div className="hidden md:flex items-center space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-button w-20 h-8 rounded"></div>
          ))}
        </div>
        
        {/* 用户菜单骨架屏 */}
        <div className="flex items-center space-x-2">
          <div className="skeleton-button w-24 h-8 rounded"></div>
          <div className="skeleton-avatar w-8 h-8 rounded-full"></div>
        </div>
      </div>
    </nav>
  );
}
