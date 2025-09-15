'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaExternalLinkAlt, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { ProcessedRepo } from '@/lib/github';

interface FeaturedProject {
  id: string;
  project_id: string;
  featured_at: string;
  featured_until: string;
  reason?: string;
  github_projects?: ProcessedRepo;
}

export default function FeaturedProjects() {
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await fetch('/api/admin/curation');
      const data = await response.json();
      
      if (data.success) {
        setFeaturedProjects(data.featuredProjects || []);
      }
    } catch (error) {
      console.error('获取推荐项目失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">加载推荐项目...</span>
      </div>
    );
  }

  if (featuredProjects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <FaStar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-2">暂无推荐项目</p>
        <p className="text-sm">我们的团队正在精心挑选优秀的MCP项目...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          ⭐ 推荐项目
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          由我们的团队精心挑选的优秀MCP项目
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((featured) => {
          const project = featured.github_projects;
          if (!project) return null;

          return (
            <div
              key={featured.id}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 p-6 hover:shadow-lg transition-shadow"
            >
              {/* 推荐标签 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FaStar className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                    推荐项目
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(featured.featured_at).toLocaleDateString()}
                </div>
              </div>

              {/* 项目信息 */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* 推荐原因 */}
              {featured.reason && (
                <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <span className="font-medium">推荐理由:</span> {featured.reason}
                  </p>
                </div>
              )}

              {/* 项目统计 */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FaStar className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {project.stars.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUser className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {project.owner}
                  </span>
                </div>
              </div>

              {/* 技术信息 */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">技术栈:</span>
                  <span>{project.language || 'N/A'}</span>
                  {project.techStack && project.techStack.length > 0 && (
                    <span className="text-gray-500">
                      +{project.techStack.length} 更多
                    </span>
                  )}
                </div>
              </div>

              {/* 核心特性 */}
              {project.coreFeatures && project.coreFeatures.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {project.coreFeatures.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {project.coreFeatures.length > 3 && (
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                        +{project.coreFeatures.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex items-center justify-between">
                <a
                  href={`/project/${project.id}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                >
                  查看详情
                </a>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
                >
                  <span>GitHub</span>
                  <FaExternalLinkAlt className="w-3 h-3" />
                </a>
              </div>

              {/* 推荐期限 */}
              <div className="mt-4 pt-3 border-t border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <FaCalendarAlt className="w-3 h-3" />
                  <span>
                    推荐至 {new Date(featured.featured_until).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
