'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaStar, FaExternalLinkAlt, FaCalendarAlt, FaUser, FaCode, FaArrowRight, FaEye } from 'react-icons/fa';
import { ProcessedRepo } from '@/lib/github';

interface FeaturedProject {
  id: string;
  project_id: string;
  featured_at: string;
  featured_until: string;
  reason?: string;
  github_projects?: ProcessedRepo;
}

interface EnhancedProjectCardProps {
  project: ProcessedRepo;
  featured?: FeaturedProject;
  showReason?: boolean;
}

// 增强的项目卡片组件
function EnhancedProjectCard({ project, featured, showReason = false }: EnhancedProjectCardProps) {

  return (
    <div
      className={`group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        featured ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
      }`}
    >
      {/* 推荐标签 */}
      {featured && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FaStar className="w-5 h-5 text-yellow-500 fill-current animate-pulse" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
              Featured Project
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(featured.featured_at).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* 项目信息 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {project.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* 推荐原因 */}
      {featured && featured.reason && showReason && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            <span className="font-medium">Why Featured:</span> {featured.reason}
          </p>
        </div>
      )}

      {/* 项目统计 */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <FaStar className="w-4 h-4 text-yellow-500" />
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {project.stars?.toLocaleString() || '0'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FaUser className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {project.owner}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FaCode className="w-4 h-4 text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {project.language || 'N/A'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="w-4 h-4 text-green-500" />
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>

      {/* 技术栈标签 */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {project.techStack.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 核心特性 */}
      {project.coreFeatures && project.coreFeatures.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {project.coreFeatures.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
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
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href={`/project/${project.id}`}
          className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-medium transition-colors group-hover:underline"
        >
          <FaEye className="w-4 h-4" />
          <span>View Details</span>
        </Link>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm transition-colors"
        >
          <span>GitHub</span>
          <FaExternalLinkAlt className="w-3 h-3" />
        </a>
      </div>

      {/* 推荐期限 */}
      {featured && (
        <div className="mt-4 pt-3 border-t border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <FaCalendarAlt className="w-3 h-3" />
            <span>
              Featured until {new Date(featured.featured_until).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// 项目卡片骨架屏
function ProjectCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="flex space-x-2 mb-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 优化的特色项目展示组件
export default function EnhancedFeaturedProjects() {
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [totalProjects, setTotalProjects] = useState(0);

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
      
      // 获取总项目数
      const projectsResponse = await fetch('/api/projects');
      const projectsData = await projectsResponse.json();
      if (projectsData.success) {
        setTotalProjects(projectsData.data?.length || 0);
      }
    } catch (error) {
      console.error('获取推荐项目失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'trending', label: 'Trending', icon: '📈' },
    { key: 'official', label: 'Official', icon: '⭐' },
    { key: 'new', label: 'New', icon: '🆕' },
    { key: 'popular', label: 'Popular', icon: '❤️' }
  ];

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured MCP Projects
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Hand-picked projects updated daily from GitHub
            </p>
          </div>
          <ProjectCardSkeleton count={6} />
        </div>
      </section>
    );
  }

  if (!featuredProjects || featuredProjects.length === 0) {
    return (
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FaStar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No Featured Projects Yet</p>
            <p className="text-sm">Our team is curating the best MCP projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured MCP Projects
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Hand-picked projects updated daily from GitHub
          </p>

          {/* 分类标签快速筛选 */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.key
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredProjects.map((featured) => {
            const project = featured.github_projects;
            if (!project) return null;

            return (
              <EnhancedProjectCard
                key={featured.id}
                project={project}
                featured={featured}
                showReason={true}
              />
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/projects">
            <button className="group inline-flex items-center space-x-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span>View All {totalProjects} Projects</span>
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
