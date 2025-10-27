'use client';

import React from 'react';
import { 
  FaStar, 
  FaCodeBranch, 
  FaCode, 
  FaUsers, 
  FaDownload, 
  FaBox, 
  FaClock, 
  FaCalendar,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

interface ProjectStatsProps {
  project: any;
}

export default function ProjectStats({ project }: ProjectStatsProps) {
  const formatRelativeTime = (date: string | Date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <FaArrowUp className="w-3 h-3 text-green-500" />;
    if (trend < 0) return <FaArrowDown className="w-3 h-3 text-red-500" />;
    return null;
  };

  return (
    <div className="project-stats-widget bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Statistics
      </h3>

      {/* GitHub 统计 */}
      <div className="stat-group mb-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          GitHub
        </h4>
        <div className="space-y-4">
          <div className="stat-item flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <FaStar className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="stat-value text-lg font-semibold text-gray-900 dark:text-white">
                {(project.stars || 0).toLocaleString()}
              </div>
              <div className="stat-label text-sm text-gray-600 dark:text-gray-400">
                Stars
              </div>
              {project.starsGrowth && (
                <div className="stat-trend flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                  {getTrendIcon(project.starsGrowth)}
                  <span>+{project.starsGrowth.toLocaleString()} this month</span>
                </div>
              )}
            </div>
          </div>

          <div className="stat-item flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FaCodeBranch className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="stat-value text-lg font-semibold text-gray-900 dark:text-white">
                {(project.forks || 0).toLocaleString()}
              </div>
              <div className="stat-label text-sm text-gray-600 dark:text-gray-400">
                Forks
              </div>
            </div>
          </div>

          <div className="stat-item flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <FaCode className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <div className="stat-value text-lg font-semibold text-gray-900 dark:text-white">
                {(project.commits || 0).toLocaleString()}
              </div>
              <div className="stat-label text-sm text-gray-600 dark:text-gray-400">
                Commits
              </div>
            </div>
          </div>

          <div className="stat-item flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <FaUsers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="stat-value text-lg font-semibold text-gray-900 dark:text-white">
                {(project.contributors || 0).toLocaleString()}
              </div>
              <div className="stat-label text-sm text-gray-600 dark:text-gray-400">
                Contributors
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NPM 统计 (如果有) */}
      {project.npmStats && (
        <div className="stat-group mb-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            NPM
          </h4>
          <div className="space-y-4">
            <div className="stat-item flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <FaDownload className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="stat-value text-lg font-semibold text-gray-900 dark:text-white">
                  {project.npmStats.downloads.toLocaleString()}
                </div>
                <div className="stat-label text-sm text-gray-600 dark:text-gray-400">
                  Weekly Downloads
                </div>
              </div>
            </div>

            <div className="stat-item flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <FaBox className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="stat-value text-lg font-semibold text-gray-900 dark:text-white">
                  {project.npmStats.version}
                </div>
                <div className="stat-label text-sm text-gray-600 dark:text-gray-400">
                  Latest Version
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 活动统计 */}
      <div className="stat-group">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          Activity
        </h4>
        <div className="space-y-4">
          <div className="stat-item flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <FaClock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="stat-value text-lg font-semibold text-gray-900 dark:text-white">
                {formatRelativeTime(project.updatedAt || project.updated_at)}
              </div>
              <div className="stat-label text-sm text-gray-600 dark:text-gray-400">
                Last Updated
              </div>
            </div>
          </div>

          <div className="stat-item flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <FaCalendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="stat-value text-lg font-semibold text-gray-900 dark:text-white">
                {formatRelativeTime(project.createdAt || project.created_at)}
              </div>
              <div className="stat-label text-sm text-gray-600 dark:text-gray-400">
                Created
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stars 历史图表占位符 */}
      {project.starHistory && (
        <div className="stat-chart mt-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Star History
          </h4>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-32 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Star history chart would be displayed here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
