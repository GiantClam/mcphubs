'use client';

import React from 'react';
import Link from 'next/link';
import { FaChevronRight, FaHome } from 'react-icons/fa';

interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav 
      className={`breadcrumbs ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <FaChevronRight className="mx-2 h-3 w-3 text-gray-400" />
            )}
            
            {item.url ? (
              <Link
                href={item.url}
                className="hover:text-gray-900 dark:hover:text-white transition-colors flex items-center space-x-1"
              >
                {item.icon && <span className="text-gray-400">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-white font-medium flex items-center space-x-1">
                {item.icon && <span className="text-gray-400">{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// 预设的面包屑配置
export const createProjectBreadcrumbs = (project: any) => [
  { 
    label: 'Home', 
    url: '/',
    icon: <FaHome className="h-3 w-3" />
  },
  { 
    label: 'Projects', 
    url: '/projects' 
  },
  ...(project.category ? [{
    label: project.category,
    url: `/projects?category=${project.categorySlug || project.category.toLowerCase()}`
  }] : []),
  { 
    label: project.name 
  }
];
