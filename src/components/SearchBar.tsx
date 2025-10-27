'use client';

import { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  className?: string;
}

export default function SearchBar({ 
  placeholder = "Search MCP projects...", 
  autoFocus = false,
  showSuggestions = true,
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 热门搜索建议
  const popularSearches = useMemo(() => [
    'web scraping', 'database', 'claude', 'typescript', 'python',
    'awesome-mcp-servers', 'mcp-server', 'anthropic', 'ai tools',
    'file management', 'cloud services', 'api integration'
  ], []);

  useEffect(() => {
    if (query.length > 2 && showSuggestions) {
      setIsLoading(true);
      // 模拟搜索建议
      const filteredSuggestions = popularSearches.filter(search => 
        search.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
      setIsLoading(false);
    } else {
      setSuggestions([]);
    }
  }, [query, showSuggestions, popularSearches]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestionsList(false);
    handleSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestionsList(false);
  };

  return (
    <div id="search" className={`relative ${className}`} role="search">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestionsList(true);
          }}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestionsList(true)}
          onBlur={() => setTimeout(() => setShowSuggestionsList(false), 200)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-12 py-3 text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg border border-gray-300"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => handleSearch()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium text-sm"
        >
          Search
        </button>
      </div>

      {/* 搜索建议下拉列表 */}
      {showSuggestions && showSuggestionsList && (suggestions.length > 0 || query.length <= 2) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
          {query.length <= 2 ? (
            <div className="p-3">
              <div className="text-sm text-gray-500 mb-2">Popular searches:</div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.slice(0, 6).map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSuggestionClick(search)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-2">
              {isLoading ? (
                <div className="px-4 py-2 text-gray-500 text-sm">Searching...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700 text-sm transition-colors"
                  >
                    <FaSearch className="inline w-3 h-3 mr-2 text-gray-400" />
                    {suggestion}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-sm">No suggestions found</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
