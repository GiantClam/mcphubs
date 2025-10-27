'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SmartSearch from '@/components/SmartSearch';
import AdvancedFilters from '@/components/AdvancedFilters';
import SearchResults from '@/components/SearchResults';
import { SearchFilters, searchProjects, SearchResult } from '@/lib/search';

export default function EnhancedSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState<SearchFilters>({
    languages: [],
    minStars: 0,
    maxStars: null,
    categories: [],
    tags: [],
    updatedWithin: null,
    hasDocumentation: null,
    licenseType: [],
    sortBy: 'relevance'
  });

  // 从 URL 参数初始化过滤器
  useEffect(() => {
    const urlFilters: Partial<SearchFilters> = {};
    
    if (searchParams.get('languages')) {
      urlFilters.languages = searchParams.get('languages')!.split(',');
    }
    if (searchParams.get('minStars')) {
      urlFilters.minStars = parseInt(searchParams.get('minStars')!);
    }
    if (searchParams.get('maxStars')) {
      urlFilters.maxStars = parseInt(searchParams.get('maxStars')!);
    }
    if (searchParams.get('categories')) {
      urlFilters.categories = searchParams.get('categories')!.split(',');
    }
    if (searchParams.get('tags')) {
      urlFilters.tags = searchParams.get('tags')!.split(',');
    }
    if (searchParams.get('updatedWithin')) {
      urlFilters.updatedWithin = searchParams.get('updatedWithin') as any;
    }
    if (searchParams.get('hasDocumentation')) {
      urlFilters.hasDocumentation = searchParams.get('hasDocumentation') === 'true';
    }
    if (searchParams.get('licenseType')) {
      urlFilters.licenseType = searchParams.get('licenseType')!.split(',');
    }
    if (searchParams.get('sortBy')) {
      urlFilters.sortBy = searchParams.get('sortBy') as any;
    }

    setFilters(prev => ({ ...prev, ...urlFilters }));
  }, [searchParams]);

  // 执行搜索
  const performSearch = async (searchQuery: string, searchFilters: SearchFilters, page = 1, reset = false) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      setHasMore(false);
      return;
    }

    setLoading(true);
    
    try {
      const response = await searchProjects(searchQuery, searchFilters, page, 20);
      
      if (reset) {
        setResults(response.results);
        setCurrentPage(1);
      } else {
        setResults(prev => [...prev, ...response.results]);
      }
      
      setTotalResults(response.total);
      setHasMore(response.hasMore);
      setCurrentPage(page);
      
      // 更新 URL
      updateURL(searchQuery, searchFilters);
      
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // 更新 URL 参数
  const updateURL = (searchQuery: string, searchFilters: SearchFilters) => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    
    if (searchFilters.languages.length > 0) {
      params.set('languages', searchFilters.languages.join(','));
    }
    if (searchFilters.minStars > 0) {
      params.set('minStars', searchFilters.minStars.toString());
    }
    if (searchFilters.maxStars) {
      params.set('maxStars', searchFilters.maxStars.toString());
    }
    if (searchFilters.categories.length > 0) {
      params.set('categories', searchFilters.categories.join(','));
    }
    if (searchFilters.tags.length > 0) {
      params.set('tags', searchFilters.tags.join(','));
    }
    if (searchFilters.updatedWithin) {
      params.set('updatedWithin', searchFilters.updatedWithin);
    }
    if (searchFilters.hasDocumentation !== null) {
      params.set('hasDocumentation', searchFilters.hasDocumentation.toString());
    }
    if (searchFilters.licenseType.length > 0) {
      params.set('licenseType', searchFilters.licenseType.join(','));
    }
    if (searchFilters.sortBy !== 'relevance') {
      params.set('sortBy', searchFilters.sortBy);
    }

    const newURL = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/search${newURL}`, { scroll: false });
  };

  // 处理搜索
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery, filters, 1, true);
  };

  // 处理过滤器变化
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (query.trim()) {
      performSearch(query, newFilters, 1, true);
    }
  };

  // 重置过滤器
  const handleResetFilters = () => {
    const defaultFilters: SearchFilters = {
      languages: [],
      minStars: 0,
      maxStars: null,
      categories: [],
      tags: [],
      updatedWithin: null,
      hasDocumentation: null,
      licenseType: [],
      sortBy: 'relevance'
    };
    
    setFilters(defaultFilters);
    if (query.trim()) {
      performSearch(query, defaultFilters, 1, true);
    }
  };

  // 加载更多
  const handleLoadMore = () => {
    if (query.trim() && hasMore && !loading) {
      performSearch(query, filters, currentPage + 1, false);
    }
  };

  // 清除所有过滤器
  const handleClearFilters = () => {
    handleResetFilters();
  };

  // 初始搜索
  useEffect(() => {
    if (query.trim()) {
      performSearch(query, filters, 1, true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Search MCP Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover and explore Model Context Protocol projects, tools, and resources
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-8">
          <SmartSearch
            placeholder="Search by name, description, tag, or language..."
            autoFocus={true}
            onSearch={handleSearch}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* 高级过滤器 */}
        <div className="mb-8">
          <AdvancedFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            filteredCount={totalResults}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
          />
        </div>

        {/* 搜索结果 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <SearchResults
            query={query}
            results={results}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            loadingMore={loading}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* 搜索统计 */}
        {totalResults > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Showing {results.length} of {totalResults} projects
            {query && (
              <>
                {' '}for &quot;{query}&quot;
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}