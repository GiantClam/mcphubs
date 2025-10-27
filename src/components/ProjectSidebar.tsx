'use client';

import React from 'react';
import { FaGithub, FaBookmark, FaShare, FaDownload, FaTerminal } from 'react-icons/fa';
import ProjectStats from './ProjectStats';

interface ProjectSidebarProps {
  project: any;
  onBookmark?: (project: any) => void;
  onShare?: (project: any) => void;
  onCopyInstall?: (project: any) => void;
}

export default function ProjectSidebar({ 
  project, 
  onBookmark, 
  onShare, 
  onCopyInstall 
}: ProjectSidebarProps) {
  const handleBookmark = () => {
    onBookmark?.(project);
  };

  const handleShare = () => {
    onShare?.(project);
  };

  const handleCopyInstall = async () => {
    const installCommand = `npm install ${project.npmPackage || project.name}`;
    try {
      await navigator.clipboard.writeText(installCommand);
      onCopyInstall?.(project);
    } catch (err) {
      console.error('Failed to copy install command:', err);
    }
  };

  return (
    <aside className="project-sidebar space-y-6">
      {/* 快速操作 */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        
        <div className="space-y-3">
          <a
            href={project.url || project.githubUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          >
            <FaGithub className="w-4 h-4 mr-2" />
            View on GitHub
          </a>

          <button
            onClick={handleCopyInstall}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <FaTerminal className="w-4 h-4 mr-2" />
            Copy Install Command
          </button>

          <div className="flex space-x-2">
            <button
              onClick={handleBookmark}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FaBookmark className="w-4 h-4 mr-1" />
              Bookmark
            </button>

            <button
              onClick={handleShare}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FaShare className="w-4 h-4 mr-1" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* 项目统计 */}
      <ProjectStats project={project} />

      {/* 项目元数据 */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Project Info
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Language</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {project.language || 'Unknown'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">License</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {project.license || 'Unknown'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Size</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {project.size ? `${(project.size / 1024).toFixed(1)} KB` : 'Unknown'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Open Issues</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {project.openIssues || 0}
            </span>
          </div>
        </div>
      </div>

      {/* 相关项目占位符 */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Related Projects
        </h3>
        
        <div className="space-y-3">
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Related projects will be displayed here
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
