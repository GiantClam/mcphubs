'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCog, FaTimes, FaTag } from 'react-icons/fa';
import { SearchFilters } from '@/lib/search';

interface AdvancedFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onReset: () => void;
  filteredCount?: number;
  className?: string;
}

const LANGUAGES = [
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'C#',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'Clojure', 'Haskell'
];

const CATEGORIES = [
  { name: 'Web Development', slug: 'web', icon: 'globe' },
  { name: 'Database', slug: 'database', icon: 'database' },
  { name: 'API', slug: 'api', icon: 'plug' },
  { name: 'CLI Tools', slug: 'cli', icon: 'terminal' },
  { name: 'DevOps', slug: 'devops', icon: 'server' },
  { name: 'AI/ML', slug: 'ai-ml', icon: 'brain' },
  { name: 'Security', slug: 'security', icon: 'shield' },
  { name: 'Testing', slug: 'testing', icon: 'flask' }
];

const LICENSE_TYPES = [
  'MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC', 'Unlicense'
];

const POPULAR_TAGS = [
  'mcp', 'claude', 'anthropic', 'ai', 'automation', 'web-scraping',
  'database', 'api', 'typescript', 'python', 'javascript'
];

interface MultiSelectProps {
  options: string[] | Array<{ name: string; slug?: string; icon?: string }>;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

function MultiSelect({ options, value, onChange, placeholder = "Select..." }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {value.length > 0 ? (
          <span className="text-sm">{value.length} selected</span>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.name;
            const isSelected = value.includes(optionValue);
            
            return (
              <label
                key={optionValue}
                className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(optionValue)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900 dark:text-white">
                  {optionValue}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  suggestions: string[];
}

function TagInput({ value, onChange, suggestions }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = (tag: string) => {
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue.trim());
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
    !value.includes(suggestion)
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Add tags..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredSuggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => handleAddTag(suggestion)}
                className="w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FaTag className="inline mr-2 text-gray-400" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ActiveFilterTagsProps {
  filters: SearchFilters;
  onRemove: (key: keyof SearchFilters, value: any) => void;
}

function ActiveFilterTags({ filters, onRemove }: ActiveFilterTagsProps) {
  const activeFilters = [];

  if (filters.languages.length > 0) {
    activeFilters.push({
      key: 'languages' as keyof SearchFilters,
      label: `Languages: ${filters.languages.join(', ')}`,
      value: filters.languages
    });
  }

  if (filters.minStars > 0) {
    activeFilters.push({
      key: 'minStars' as keyof SearchFilters,
      label: `Min Stars: ${filters.minStars}`,
      value: filters.minStars
    });
  }

  if (filters.maxStars) {
    activeFilters.push({
      key: 'maxStars' as keyof SearchFilters,
      label: `Max Stars: ${filters.maxStars}`,
      value: filters.maxStars
    });
  }

  if (filters.categories.length > 0) {
    activeFilters.push({
      key: 'categories' as keyof SearchFilters,
      label: `Categories: ${filters.categories.join(', ')}`,
      value: filters.categories
    });
  }

  if (filters.tags.length > 0) {
    activeFilters.push({
      key: 'tags' as keyof SearchFilters,
      label: `Tags: ${filters.tags.join(', ')}`,
      value: filters.tags
    });
  }

  if (filters.updatedWithin) {
    activeFilters.push({
      key: 'updatedWithin' as keyof SearchFilters,
      label: `Updated: ${filters.updatedWithin}`,
      value: filters.updatedWithin
    });
  }

  if (filters.hasDocumentation !== null) {
    activeFilters.push({
      key: 'hasDocumentation' as keyof SearchFilters,
      label: `Documentation: ${filters.hasDocumentation ? 'Yes' : 'No'}`,
      value: filters.hasDocumentation
    });
  }

  if (filters.licenseType.length > 0) {
    activeFilters.push({
      key: 'licenseType' as keyof SearchFilters,
      label: `License: ${filters.licenseType.join(', ')}`,
      value: filters.licenseType
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {activeFilters.map((filter, index) => (
        <span
          key={index}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
        >
          {filter.label}
          <button
            onClick={() => onRemove(filter.key, filter.value)}
            className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}

export default function AdvancedFilters({
  filters,
  onFilterChange,
  onReset,
  filteredCount = 0,
  className = ""
}: AdvancedFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const removeFilter = (key: keyof SearchFilters, value: any) => {
    if (Array.isArray(filters[key])) {
      updateFilter(key, []);
    } else {
      updateFilter(key, key === 'minStars' ? 0 : null);
    }
  };

  return (
    <div className={`advanced-filters ${className}`}>
      {/* 快速筛选 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="filter-group">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <MultiSelect
            options={LANGUAGES}
            value={filters.languages}
            onChange={(langs) => updateFilter('languages', langs)}
            placeholder="Any language"
          />
        </div>

        <div className="filter-group">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <MultiSelect
            options={CATEGORIES}
            value={filters.categories}
            onChange={(cats) => updateFilter('categories', cats)}
            placeholder="Any category"
          />
        </div>

        <div className="filter-group">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Min Stars
          </label>
          <input
            type="number"
            min="0"
            value={filters.minStars}
            onChange={(e) => updateFilter('minStars', parseInt(e.target.value) || 0)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="filter-group">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value as SearchFilters['sortBy'])}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="relevance">Relevance</option>
            <option value="stars">GitHub Stars</option>
            <option value="updated">Recently Updated</option>
            <option value="name">Name (A-Z)</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <FaCog className="w-4 h-4" />
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Filters</span>
        </button>

        {filteredCount > 0 && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredCount} results
          </span>
        )}
      </div>

      {/* 高级筛选 */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            className="advanced-filters-panel border-t border-gray-200 dark:border-gray-700 pt-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="filter-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Updated Within
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'week', label: 'Past Week' },
                    { value: 'month', label: 'Past Month' },
                    { value: '3months', label: 'Past 3 Months' },
                    { value: 'year', label: 'Past Year' },
                    { value: '', label: 'Any Time' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="updatedWithin"
                        value={option.value}
                        checked={filters.updatedWithin === option.value}
                        onChange={(e) => updateFilter('updatedWithin', e.target.value || null)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Documentation
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasDocumentation === true}
                      onChange={(e) => updateFilter('hasDocumentation', e.target.checked ? true : null)}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">
                      Has Documentation
                    </span>
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  License Type
                </label>
                <MultiSelect
                  options={LICENSE_TYPES}
                  value={filters.licenseType}
                  onChange={(licenses) => updateFilter('licenseType', licenses)}
                  placeholder="Any license"
                />
              </div>

              <div className="filter-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <TagInput
                  value={filters.tags}
                  onChange={(tags) => updateFilter('tags', tags)}
                  suggestions={POPULAR_TAGS}
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={onReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setShowAdvanced(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 活动的筛选标签 */}
      <ActiveFilterTags filters={filters} onRemove={removeFilter} />
    </div>
  );
}
