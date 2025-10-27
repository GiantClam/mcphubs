'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaCodeBranch, FaBookmark, FaShare, FaBookmark as FaBookmarkFilled } from 'react-icons/fa';
import { ProcessedRepo } from '@/lib/github';

interface AccessibleProjectCardProps {
  project: ProcessedRepo;
  onBookmark?: (projectId: string) => void;
  onShare?: (project: ProcessedRepo) => void;
}

export default function AccessibleProjectCard({ 
  project, 
  onBookmark, 
  onShare 
}: AccessibleProjectCardProps) {
  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
    onBookmark?.(project.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(project);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <article
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden"
      role="article"
      aria-labelledby={`project-title-${project.id}`}
      aria-describedby={`project-desc-${project.id}`}
    >
      <Link 
        href={`/project/${project.fullName}`}
        className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
        aria-label={`View details for ${project.name}`}
      >
        <div className="project-card-image relative h-48 bg-gray-100 dark:bg-gray-700">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={`${project.name} project thumbnail`}
              fill
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
              <FaCodeBranch className="text-4xl" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="project-card-content p-6">
          <h3 
            id={`project-title-${project.id}`}
            className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1"
          >
            {project.name}
          </h3>

          <p 
            id={`project-desc-${project.id}`}
            className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2"
          >
            {project.description || 'No description available'}
          </p>

          <div 
            className="project-stats flex items-center gap-4 mb-4" 
            aria-label="Project statistics"
          >
            <span 
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400"
              aria-label={`${project.stars || 0} stars`}
            >
              <FaStar className="text-yellow-500" aria-hidden="true" />
              <span className="sr-only">Stars: </span>
              {project.stars || 0}
            </span>
            <span 
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400"
              aria-label={`${project.forks || 0} forks`}
            >
              <FaCodeBranch className="text-blue-500" aria-hidden="true" />
              <span className="sr-only">Forks: </span>
              {project.forks || 0}
            </span>
          </div>

          {project.language && (
            <div className="project-language mb-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {project.language}
              </span>
            </div>
          )}

          {project.topics && project.topics.length > 0 && (
            <div 
              className="project-tags flex flex-wrap gap-2" 
              role="list" 
              aria-label="Project tags"
            >
              {project.topics.slice(0, 3).map(tag => (
                <span 
                  key={tag} 
                  role="listitem" 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
              {project.topics.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{project.topics.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* 快捷操作 */}
      <div 
        className="project-actions absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" 
        role="toolbar" 
        aria-label="Project actions"
      >
        <button
          onClick={handleBookmark}
          onKeyDown={(e) => handleKeyDown(e, () => handleBookmark(e as any))}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          aria-pressed={bookmarked}
        >
          {bookmarked ? (
            <FaBookmarkFilled className="text-yellow-500" aria-hidden="true" />
          ) : (
            <FaBookmark className="text-gray-400 hover:text-yellow-500" aria-hidden="true" />
          )}
        </button>
        <button
          onClick={handleShare}
          onKeyDown={(e) => handleKeyDown(e, () => handleShare(e as any))}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Share project"
        >
          <FaShare className="text-gray-400 hover:text-blue-500" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
