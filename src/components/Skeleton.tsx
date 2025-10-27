'use client';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'shimmer';
}

export default function Skeleton({ 
  className = '', 
  width = '100%', 
  height = '1rem',
  variant = 'rectangular',
  animation = 'shimmer'
}: SkeletonProps) {
  const baseClasses = 'skeleton';
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
    rounded: 'rounded-lg'
  };
  
  const animationClasses = {
    pulse: 'skeleton-pulse',
    wave: 'skeleton-wave',
    shimmer: ''
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// 预定义的骨架屏组件
export function SkeletonText({ 
  lines = 1, 
  className = '',
  variant = 'text' as const 
}: { 
  lines?: number; 
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          width={index === lines - 1 ? '75%' : '100%'}
          height="1rem"
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ 
  size = 'medium',
  className = ''
}: { 
  size?: 'small' | 'medium' | 'large';
  className?: string;
}) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <Skeleton
      variant="circular"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}

export function SkeletonButton({ 
  size = 'medium',
  className = ''
}: { 
  size?: 'small' | 'medium' | 'large';
  className?: string;
}) {
  const sizeClasses = {
    small: 'w-16 h-8',
    medium: 'w-24 h-10',
    large: 'w-32 h-12'
  };

  return (
    <Skeleton
      variant="rounded"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}

export function SkeletonCard({ 
  className = '',
  showAvatar = true,
  showActions = true
}: { 
  className?: string;
  showAvatar?: boolean;
  showActions?: boolean;
}) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {showAvatar && (
        <div className="flex items-center space-x-3 mb-4">
          <SkeletonAvatar size="medium" />
          <div className="flex-1">
            <SkeletonText lines={1} className="w-1/2" />
          </div>
        </div>
      )}
      
      <div className="space-y-3 mb-4">
        <SkeletonText lines={2} />
        <SkeletonText lines={1} className="w-3/4" />
      </div>
      
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <SkeletonButton size="small" />
          <SkeletonButton size="small" />
        </div>
      )}
    </div>
  );
}

export function SkeletonTable({ 
  rows = 5,
  columns = 4,
  className = ''
}: { 
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* 表头 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} height="1.5rem" />
        ))}
      </div>
      
      {/* 表格行 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4 py-3 border-b border-gray-200 dark:border-gray-700" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} height="1rem" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ 
  items = 5,
  showAvatar = true,
  className = ''
}: { 
  items?: number;
  showAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg">
          {showAvatar && <SkeletonAvatar size="small" />}
          <div className="flex-1 space-y-2">
            <SkeletonText lines={1} className="w-1/2" />
            <SkeletonText lines={1} className="w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
