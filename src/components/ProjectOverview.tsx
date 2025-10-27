'use client';

import React from 'react';
import { FaTag, FaLanguage, FaCalendar, FaUser, FaExternalLinkAlt } from 'react-icons/fa';

interface ProjectOverviewProps {
  project: any;
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="project-overview bg-white dark:bg-gray-900 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 基本信息 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FaLanguage className="w-5 h-5 text-blue-500" />
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Language</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {project.language || 'Unknown'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaCalendar className="w-5 h-5 text-green-500" />
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(project.createdAt || project.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaUser className="w-5 h-5 text-purple-500" />
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Owner</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {project.owner || 'Unknown'}
              </p>
            </div>
          </div>

          {project.license && (
            <div className="flex items-center space-x-3">
              <FaTag className="w-5 h-5 text-orange-500" />
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">License</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {project.license}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 项目链接 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Links
          </h3>
          
          <div className="space-y-3">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaExternalLinkAlt className="w-4 h-4 text-blue-500" />
                <span className="text-gray-900 dark:text-white">Project Homepage</span>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaExternalLinkAlt className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 dark:text-white">GitHub Repository</span>
              </a>
            )}

            {project.documentation && (
              <a
                href={project.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaExternalLinkAlt className="w-4 h-4 text-green-500" />
                <span className="text-gray-900 dark:text-white">Documentation</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 标签 */}
      {project.topics && project.topics.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.topics.map((topic: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
