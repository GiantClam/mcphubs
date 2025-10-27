'use client';

interface ProjectCardSkeletonProps {
  count?: number;
  className?: string;
}

export default function ProjectCardSkeleton({ count = 6, className = '' }: ProjectCardSkeletonProps) {
  return (
    <div className={`projects-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="project-card-skeleton bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          {/* 项目图标/头像骨架 */}
          <div className="skeleton-image w-12 h-12 rounded-lg mb-4" />
          
          {/* 项目标题骨架 */}
          <div className="skeleton-title w-3/4 h-6 mb-3" />
          
          {/* 项目描述骨架 */}
          <div className="skeleton-description w-full h-4 mb-2" />
          <div className="skeleton-description w-5/6 h-4 mb-4" />
          
          {/* 项目统计骨架 */}
          <div className="skeleton-stats grid grid-cols-2 gap-4 mb-4">
            <div className="skeleton-stat h-4" />
            <div className="skeleton-stat h-4" />
            <div className="skeleton-stat h-4" />
            <div className="skeleton-stat h-4" />
          </div>
          
          {/* 技术栈标签骨架 */}
          <div className="skeleton-tags flex flex-wrap gap-2 mb-4">
            <div className="skeleton-tag w-16 h-6 rounded-full" />
            <div className="skeleton-tag w-20 h-6 rounded-full" />
            <div className="skeleton-tag w-14 h-6 rounded-full" />
          </div>
          
          {/* 操作按钮骨架 */}
          <div className="skeleton-actions flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="skeleton-button w-20 h-8 rounded" />
            <div className="skeleton-button w-16 h-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
