'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaCodeBranch, FaCalendarAlt, FaEye, FaSearch } from 'react-icons/fa';
import { SearchResult } from '@/lib/search';
import Highlight from './Highlight';
import ProjectCardSkeleton from './ProjectCardSkeleton';

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  loading: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  onClearFilters?: () => void;
}

interface SearchResultCardProps {
  project: SearchResult;
  query: string;
}

function SearchResultCard({ project, query }: SearchResultCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={`${project.name} thumbnail`}
              width={64}
              height={64}
              className="rounded-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
              <FaCodeBranch className="text-gray-400 text-xl" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                <Link href={`/project/${project.fullName}`}>
                  <Highlight text={project.name} query={query} />
                </Link>
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                <Highlight text={project.description || 'No description available'} query={query} />
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span className="flex items-center space-x-1">
                  <FaStar className="text-yellow-500" />
                  <span>{project.stars || 0}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FaCodeBranch className="text-blue-500" />
                  <span>{project.forks || 0}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FaCalendarAlt className="text-green-500" />
                  <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {project.language && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Highlight text={project.language} query={query} />
                  </span>
                )}
                
                {project.topics && project.topics.slice(0, 3).map(topic => (
                  <span
                    key={topic}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    <Highlight text={topic} query={query} />
                  </span>
                ))}
                
                {project.topics && project.topics.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{project.topics.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 ml-4">
              <Link
                href={`/project/${project.fullName}`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FaEye className="w-4 h-4 mr-2" />
                View
              </Link>
            </div>
          </div>

          {/* 匹配字段指示器 */}
          {project.matchedFields && project.matchedFields.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Matched in: {project.matchedFields.join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptySearchState() {
  return (
    <div className="text-center py-12">
      <FaSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Start searching for projects
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Enter keywords to find MCP projects, tools, and resources
      </p>
    </div>
  );
}

function NoResultsState({ query, onClearFilters }: { query: string; onClearFilters?: () => void }) {
  return (
    <div className="text-center py-12">
      <FaSearch className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
        No results found for &quot;{query}&quot;
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Try adjusting your search or filters
      </p>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Suggestions:
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
          <li>• Check your spelling</li>
          <li>• Use more general keywords</li>
          <li>• Try different or fewer filters</li>
          <li>• Search for project names or tags</li>
        </ul>
      </div>

      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="relevance">Sort by Relevance</option>
      <option value="stars">Sort by Stars</option>
      <option value="updated">Sort by Updated</option>
      <option value="name">Sort by Name</option>
      <option value="trending">Sort by Trending</option>
    </select>
  );
}

interface ViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
      <button
        onClick={() => onChange('grid')}
        className={`px-3 py-2 text-sm font-medium ${
          view === 'grid'
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        } rounded-l-md transition-colors`}
      >
        Grid
      </button>
      <button
        onClick={() => onChange('list')}
        className={`px-3 py-2 text-sm font-medium ${
          view === 'list'
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        } rounded-r-md transition-colors`}
      >
        List
      </button>
    </div>
  );
}

export default function SearchResults({
  query,
  results,
  loading,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  onClearFilters
}: SearchResultsProps) {
  const [sortBy, setSortBy] = React.useState('relevance');
  const [view, setView] = React.useState<'grid' | 'list'>('list');

  if (loading) {
    return <ProjectCardSkeleton count={6} />;
  }

  if (!query) {
    return <EmptySearchState />;
  }

  if (results.length === 0) {
    return <NoResultsState query={query} onClearFilters={onClearFilters} />;
  }

  return (
    <div className="search-results">
      <div className="search-results-header mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Found {results.length} {results.length === 1 ? 'project' : 'projects'}
            {query && (
              <>
                {' '}for &quot;<strong>{query}</strong>&quot;
              </>
            )}
          </h2>

          <div className="flex items-center space-x-3">
            <SortDropdown value={sortBy} onChange={setSortBy} />
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>
      </div>

      {/* 结果列表 */}
      <div className={`results-list ${
        view === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
      }`}>
        {results.map(project => (
          <SearchResultCard
            key={project.id}
            project={project}
            query={query}
          />
        ))}
      </div>

      {/* 加载更多 */}
      {hasMore && (
        <div className="load-more text-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-md transition-colors"
          >
            {loadingMore ? 'Loading...' : 'Load More Projects'}
          </button>
        </div>
      )}
    </div>
  );
}
