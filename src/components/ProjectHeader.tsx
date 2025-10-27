'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaStar, 
  FaCodeBranch, 
  FaEye, 
  FaDownload, 
  FaGithub, 
  FaTerminal, 
  FaBookmark, 
  FaShare,
  FaCheckCircle,
  FaArrowUp
} from 'react-icons/fa';
import Breadcrumbs, { createProjectBreadcrumbs } from './Breadcrumbs';

interface ProjectHeaderProps {
  project: any;
  onBookmark?: (project: any) => void;
  onShare?: (project: any) => void;
  onCopyInstall?: (project: any) => void;
}

export default function ProjectHeader({ 
  project, 
  onBookmark, 
  onShare, 
  onCopyInstall 
}: ProjectHeaderProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onBookmark?.(project);
  };

  const handleShare = () => {
    onShare?.(project);
  };

  const handleCopyInstall = async () => {
    const installCommand = `npm install ${project.npmPackage || project.name}`;
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopyInstall?.(project);
    } catch (err) {
      console.error('Failed to copy install command:', err);
    }
  };

  const breadcrumbs = createProjectBreadcrumbs(project);

  return (
    <header className="project-header bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6">
        {/* 面包屑 */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* 主要信息 */}
        <div className="project-title-section">
          <div className="flex items-start space-x-6">
            {/* 项目图标 */}
            <div className="project-icon flex-shrink-0">
              {project.imageUrl || project.thumbnail ? (
                <Image
                  src={project.imageUrl || project.thumbnail}
                  alt={`${project.name} icon`}
                  width={80}
                  height={80}
                  className="rounded-lg border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <FaGithub className="text-4xl text-gray-400" />
                </div>
              )}
            </div>

            {/* 项目信息 */}
            <div className="project-title-info flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {project.name}
                  </h1>

                  {/* 项目徽章 */}
                  <div className="project-badges flex flex-wrap gap-2 mb-3">
                    {project.official && (
                      <span className="badge badge-official inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <FaStar className="w-3 h-3 mr-1" />
                        Official
                      </span>
                    )}
                    {project.verified && (
                      <span className="badge badge-verified inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <FaCheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                    {project.trending && (
                      <span className="badge badge-trending inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        <FaArrowUp className="w-3 h-3 mr-1" />
                        Trending
                      </span>
                    )}
                  </div>

                  <p className="project-description text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>

                  {/* 快速统计 */}
                  <div className="project-quick-stats flex flex-wrap gap-6 mb-6">
                    <span className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <FaStar className="text-yellow-500" />
                      <strong className="text-gray-900 dark:text-white">
                        {(project.stars || 0).toLocaleString()}
                      </strong>
                      <span>stars</span>
                    </span>
                    <span className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <FaCodeBranch className="text-blue-500" />
                      <strong className="text-gray-900 dark:text-white">
                        {(project.forks || 0).toLocaleString()}
                      </strong>
                      <span>forks</span>
                    </span>
                    <span className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <FaEye className="text-green-500" />
                      <strong className="text-gray-900 dark:text-white">
                        {(project.watchers || 0).toLocaleString()}
                      </strong>
                      <span>watchers</span>
                    </span>
                    {project.downloads && (
                      <span className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <FaDownload className="text-purple-500" />
                        <strong className="text-gray-900 dark:text-white">
                          {project.downloads.toLocaleString()}
                        </strong>
                        <span>downloads</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="project-actions flex flex-col space-y-3 ml-6">
                  <Link
                    href={project.url || project.githubUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaGithub className="w-4 h-4 mr-2" />
                    View on GitHub
                  </Link>

                  <button
                    onClick={handleCopyInstall}
                    className="btn-secondary inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FaTerminal className="w-4 h-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy Install Command'}
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={handleBookmark}
                      className={`btn-icon p-2 rounded-lg transition-colors ${
                        bookmarked 
                          ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                      aria-label="Bookmark project"
                    >
                      <FaBookmark className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleShare}
                      className="btn-icon p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Share project"
                    >
                      <FaShare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
