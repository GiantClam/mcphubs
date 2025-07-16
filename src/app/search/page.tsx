'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'project' | 'documentation' | 'community' | 'guide' | 'integration';
  tags: string[];
  lastModified: string;
  relevance: number;
}

const SearchContent = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title'>('relevance');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const searchTypes = [
    { id: 'all', name: '全部', icon: '🔍' },
    { id: 'project', name: '项目', icon: '🚀' },
    { id: 'documentation', name: '文档', icon: '📚' },
    { id: 'community', name: '社区', icon: '👥' },
    { id: 'guide', name: '指南', icon: '📖' },
    { id: 'integration', name: '集成', icon: '🔗' }
  ];

  const sampleResults: SearchResult[] = [
    {
      id: '1',
      title: 'Python MCP服务器开发指南',
      description: '了解如何使用Python创建MCP服务器，包括基础设置、工具定义、错误处理和最佳实践。',
      url: '/development-guides#python',
      type: 'guide',
      tags: ['Python', 'MCP服务器', '开发指南'],
      lastModified: '2024-01-15T10:30:00Z',
      relevance: 95
    },
    {
      id: '2',
      title: 'MCP Python SDK',
      description: 'Model Context Protocol的官方Python SDK，提供了创建MCP服务器和客户端的完整工具包。',
      url: '/project/python-sdk',
      type: 'project',
      tags: ['Python', 'SDK', 'MCP'],
      lastModified: '2024-01-14T16:45:00Z',
      relevance: 90
    },
    {
      id: '3',
      title: '如何在Python中创建一个简单的MCP服务器？',
      description: '我想开始开发MCP服务器，但不知道从哪里开始。有人能提供一个基础的Python示例吗？',
      url: '/community/1',
      type: 'community',
      tags: ['Python', 'MCP服务器', '初学者'],
      lastModified: '2024-01-15T10:30:00Z',
      relevance: 85
    },
    {
      id: '4',
      title: 'Claude Desktop与MCP集成',
      description: '学习如何在Claude Desktop中配置和使用MCP服务器，包括配置文件编写和常见问题解决。',
      url: '/integrations#claude-desktop',
      type: 'integration',
      tags: ['Claude Desktop', 'MCP', '集成'],
      lastModified: '2024-01-13T09:20:00Z',
      relevance: 80
    },
    {
      id: '5',
      title: 'MCP协议核心概念',
      description: '深入理解Model Context Protocol的核心概念，包括Tools、Resources、Prompts的定义和用法。',
      url: '/what-is-mcp',
      type: 'documentation',
      tags: ['MCP协议', '核心概念', 'Tools', 'Resources'],
      lastModified: '2024-01-12T14:30:00Z',
      relevance: 75
    },
    {
      id: '6',
      title: 'TypeScript MCP服务器开发',
      description: '使用TypeScript开发MCP服务器的完整指南，包括项目设置、类型定义和最佳实践。',
      url: '/development-guides#typescript',
      type: 'guide',
      tags: ['TypeScript', 'MCP服务器', '开发'],
      lastModified: '2024-01-11T11:15:00Z',
      relevance: 70
    },
    {
      id: '7',
      title: 'MCP服务器性能优化',
      description: '了解如何优化MCP服务器的性能，包括异步处理、缓存策略和内存管理。',
      url: '/troubleshooting#performance',
      type: 'documentation',
      tags: ['性能优化', 'MCP服务器', '最佳实践'],
      lastModified: '2024-01-10T08:45:00Z',
      relevance: 65
    }
  ];

  const popularSearches = [
    'MCP Python 教程',
    'Claude Desktop 配置',
    'MCP 服务器部署',
    'TypeScript MCP 开发',
    'MCP 错误处理',
    'Model Context Protocol',
    'MCP 最佳实践',
    'AI 协议开发'
  ];

  useEffect(() => {
    if (searchTerm) {
      performSearch();
    }
  }, [searchTerm, selectedType, sortBy]);

  const performSearch = async () => {
    setLoading(true);
    
    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 根据搜索词过滤结果
    let filteredResults = sampleResults.filter(result => {
      const matchesSearch = result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || result.type === selectedType;
      
      return matchesSearch && matchesType;
    });

    // 排序
    filteredResults.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevance - a.relevance;
        case 'date':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setResults(filteredResults);
    setTotalResults(filteredResults.length);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      performSearch();
    }
  };

  const getTypeIcon = (type: string) => {
    const typeObj = searchTypes.find(t => t.id === type);
    return typeObj ? typeObj.icon : '📄';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'documentation': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'community': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'guide': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'integration': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark> : 
        part
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">搜索</h1>
          <p className="text-gray-600 dark:text-gray-300">
            搜索项目、文档、社区问题和开发指南
          </p>
        </div>

        {/* 搜索表单 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索项目、文档、社区问题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {searchTypes.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedType === type.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type.icon} {type.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="relevance">相关性</option>
                  <option value="date">更新时间</option>
                  <option value="title">标题</option>
                </select>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  搜索
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 搜索结果 */}
        {searchTerm && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                搜索结果
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {loading ? '搜索中...' : `找到 ${totalResults} 个结果`}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map(result => (
                  <div key={result.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <span className="text-2xl">{getTypeIcon(result.type)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                            {searchTypes.find(t => t.id === result.type)?.name || result.type}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(result.lastModified).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                        <Link href={result.url} className="block hover:text-blue-600 dark:hover:text-blue-400">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {highlightText(result.title, searchTerm)}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">
                            {highlightText(result.description, searchTerm)}
                          </p>
                        </Link>
                        <div className="flex flex-wrap gap-2">
                          {result.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                              {highlightText(tag, searchTerm)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                        {result.relevance}% 匹配
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && results.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">没有找到相关结果</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  尝试使用不同的关键词或检查拼写
                </p>
              </div>
            )}
          </div>
        )}

        {/* 热门搜索 */}
        {!searchTerm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">热门搜索</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map(search => (
                <button
                  key={search}
                  onClick={() => setSearchTerm(search)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 搜索建议 */}
        {searchTerm && suggestions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">相关搜索建议</h3>
            <div className="space-y-2">
              {suggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setSearchTerm(suggestion)}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载搜索页面...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage; 