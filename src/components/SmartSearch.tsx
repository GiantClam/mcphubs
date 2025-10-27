'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaSearch, FaTimes, FaTag, FaCode, FaFolder } from 'react-icons/fa';
import { useDebounce } from '@/hooks/useDebounce';
import { getSuggestions, SearchSuggestion } from '@/lib/search';
import Highlight from './Highlight';

interface SmartSearchProps {
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  onSearch?: (query: string) => void;
  initialQuery?: string;
}

export default function SmartSearch({
  placeholder = "Search by name, description, tag, or language...",
  autoFocus = false,
  className = "",
  onSearch,
  initialQuery = ''
}: SmartSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion>({
    projects: [],
    tags: [],
    categories: []
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 监听初始查询值的变化
  useEffect(() => {
    if (initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsLoading(true);
      getSuggestions(debouncedQuery)
        .then(setSuggestions)
        .finally(() => setIsLoading(false));
      setShowSuggestions(true);
    } else {
      setSuggestions({ projects: [], tags: [], categories: [] });
      setShowSuggestions(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const totalSuggestions = 
      (suggestions.projects?.length || 0) +
      (suggestions.tags?.length || 0) +
      (suggestions.categories?.length || 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < totalSuggestions - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          // 处理选中的建议项
          handleSuggestionClick(selectedIndex);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (index: number) => {
    let currentIndex = 0;
    
    // 项目建议
    if (suggestions.projects && index < suggestions.projects.length) {
      const project = suggestions.projects[index];
      window.location.href = `/project/${project.fullName}`;
      return;
    }
    currentIndex += suggestions.projects?.length || 0;

    // 标签建议
    if (suggestions.tags && index < currentIndex + suggestions.tags.length) {
      const tag = suggestions.tags[index - currentIndex];
      setQuery(tag.name);
      handleSearch();
      return;
    }
    currentIndex += suggestions.tags?.length || 0;

    // 分类建议
    if (suggestions.categories && index < currentIndex + suggestions.categories.length) {
      const category = suggestions.categories[index - currentIndex];
      window.location.href = `/projects?category=${category.slug}`;
      return;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query.trim());
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions({ projects: [], tags: [], categories: [] });
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getSuggestionItemClass = (index: number) => {
    return `suggestion-item ${selectedIndex === index ? 'selected' : ''}`;
  };

  return (
    <div className={`smart-search relative ${className}`}>
      <div className="search-input-wrapper relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        )}
        
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-10 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          id="search-suggestions"
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          role="listbox"
        >
          {/* 项目建议 */}
          {suggestions.projects && suggestions.projects.length > 0 && (
            <div className="suggestion-group">
              <div className="suggestion-group-title px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                Projects
              </div>
              {suggestions.projects.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/project/${project.fullName}`}
                  className={getSuggestionItemClass(index)}
                  role="option"
                >
                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex-shrink-0">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt=""
                          className="w-8 h-8 rounded"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                          <FaCode className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        <Highlight text={project.name} query={query} />
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {project.language} · ⭐ {project.stars}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 标签建议 */}
          {suggestions.tags && suggestions.tags.length > 0 && (
            <div className="suggestion-group">
              <div className="suggestion-group-title px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                Tags
              </div>
              {suggestions.tags.map((tag, index) => {
                const globalIndex = (suggestions.projects?.length || 0) + index;
                return (
                  <button
                    key={tag.name}
                    onClick={() => {
                      setQuery(tag.name);
                      handleSearch();
                    }}
                    className={getSuggestionItemClass(globalIndex)}
                    role="option"
                  >
                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left">
                      <FaTag className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        <Highlight text={tag.name} query={query} />
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                        {tag.count} projects
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 分类建议 */}
          {suggestions.categories && suggestions.categories.length > 0 && (
            <div className="suggestion-group">
              <div className="suggestion-group-title px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                Categories
              </div>
              {suggestions.categories.map((category, index) => {
                const globalIndex = 
                  (suggestions.projects?.length || 0) + 
                  (suggestions.tags?.length || 0) + 
                  index;
                return (
                  <Link
                    key={category.slug}
                    href={`/projects?category=${category.slug}`}
                    className={getSuggestionItemClass(globalIndex)}
                    role="option"
                  >
                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <FaFolder className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                        {category.count} projects
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* 无建议时的提示 */}
          {!isLoading && 
           (!suggestions.projects?.length && 
            !suggestions.tags?.length && 
            !suggestions.categories?.length) && 
           query.length >= 2 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="text-sm">No suggestions found</div>
              <div className="text-xs mt-1">Press Enter to search</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
