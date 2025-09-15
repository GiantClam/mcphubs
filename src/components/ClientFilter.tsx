'use client';

import { useState, useMemo } from 'react';
import { ProcessedRepo } from '@/lib/github';
import { FaFilter, FaTimes, FaStar, FaBolt } from 'react-icons/fa';

interface ClientFaFilterProps {
  projects: ProcessedRepo[];
}

interface FaFilterState {
  languages: string[];
  features: string[];
  compatibility: string[];
  projectTypes: string[];
  minStars: number;
  sortBy: 'stars' | 'updated' | 'name' | 'relevance';
  searchQuery: string;
}

export default function ClientFaFilter({ projects }: ClientFaFilterProps) {
  const [filters, setFaFilters] = useState<FaFilterState>({
    languages: [],
    features: [],
    compatibility: [],
    projectTypes: [],
    minStars: 0,
    sortBy: 'relevance',
    searchQuery: ''
  });

  const [showFaFilters, setShowFaFilters] = useState(false);

  // 提取所有可用的筛选选项
  const availableOptions = useMemo(() => {
    const languages = new Set<string>();
    const features = new Set<string>();
    const compatibility = new Set<string>();
    const projectTypes = new Set<string>();

    projects.forEach(project => {
      // 语言
      if (project.language) languages.add(project.language);
      if (project.techStack) {
        project.techStack.forEach(tech => languages.add(tech));
      }

      // 特性
      if (project.coreFeatures) {
        project.coreFeatures.forEach(feature => features.add(feature));
      }

      // 兼容性
      if (project.compatibility) {
        project.compatibility.forEach(comp => compatibility.add(comp));
      }

      // 项目类型
      if (project.projectType) {
        projectTypes.add(project.projectType);
      }
    });

    return {
      languages: Array.from(languages).sort(),
      features: Array.from(features).sort(),
      compatibility: Array.from(compatibility).sort(),
      projectTypes: Array.from(projectTypes).sort()
    };
  }, [projects]);

  // 筛选和排序项目
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(project => {
      // 搜索查询
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.topics.some(topic => topic.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // 语言筛选
      if (filters.languages.length > 0) {
        const projectLanguages = [
          project.language,
          ...(project.techStack || [])
        ].filter(Boolean);
        
        const hasMatchingLanguage = filters.languages.some(lang =>
          projectLanguages.some(projectLang => 
            projectLang.toLowerCase().includes(lang.toLowerCase())
          )
        );
        
        if (!hasMatchingLanguage) return false;
      }

      // 特性筛选
      if (filters.features.length > 0) {
        const hasMatchingFeature = filters.features.some(feature =>
          project.coreFeatures?.some(projectFeature =>
            projectFeature.toLowerCase().includes(feature.toLowerCase())
          )
        );
        
        if (!hasMatchingFeature) return false;
      }

      // 兼容性筛选
      if (filters.compatibility.length > 0) {
        const hasMatchingCompatibility = filters.compatibility.some(comp =>
          project.compatibility?.some(projectComp =>
            projectComp.toLowerCase().includes(comp.toLowerCase())
          )
        );
        
        if (!hasMatchingCompatibility) return false;
      }

      // 项目类型筛选
      if (filters.projectTypes.length > 0) {
        if (!project.projectType || !filters.projectTypes.includes(project.projectType)) {
          return false;
        }
      }

      // 最小星数筛选
      if (project.stars < filters.minStars) {
        return false;
      }

      return true;
    });

    // 排序
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'stars':
          return b.stars - a.stars;
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'relevance':
          return (b.stars + (b.forks * 2)) - (a.stars + (a.forks * 2));
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, filters]);

  const updateFaFilter = (key: keyof FaFilterState, value: any) => {
    setFaFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFaFilter = (key: 'languages' | 'features' | 'compatibility' | 'projectTypes', value: string) => {
    setFaFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFaFilters = () => {
    setFaFilters({
      languages: [],
      features: [],
      compatibility: [],
      projectTypes: [],
      minStars: 0,
      sortBy: 'relevance',
      searchQuery: ''
    });
  };

  const activeFaFiltersCount = 
    filters.languages.length +
    filters.features.length +
    filters.compatibility.length +
    filters.projectTypes.length +
    (filters.minStars > 0 ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* 筛选器头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaFilter className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            高级筛选器
          </h2>
          {activeFaFiltersCount > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
              {activeFaFiltersCount} 个筛选条件
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFaFiltersCount > 0 && (
            <button
              onClick={clearFaFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1"
            >
              <FaTimes className="w-4 h-4" />
              <span>清除筛选</span>
            </button>
          )}
          <button
            onClick={() => setShowFaFilters(!showFaFilters)}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {showFaFilters ? '隐藏筛选器' : '显示筛选器'}
          </button>
        </div>
      </div>

      {/* 搜索和排序 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            搜索项目
          </label>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFaFilter('searchQuery', e.target.value)}
            placeholder="搜索项目名称、描述或标签..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            排序方式
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFaFilter('sortBy', e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="relevance">相关性</option>
            <option value="stars">星标数</option>
            <option value="updated">最近更新</option>
            <option value="name">项目名称</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            最小星标数
          </label>
          <input
            type="number"
            min="0"
            value={filters.minStars}
            onChange={(e) => updateFaFilter('minStars', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* 详细筛选器 */}
      {showFaFilters && (
        <div className="space-y-6">
          {/* 编程语言 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              编程语言
            </label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.languages.map(language => (
                <button
                  key={language}
                  onClick={() => toggleArrayFaFilter('languages', language)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.languages.includes(language)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          {/* 核心特性 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              核心特性
            </label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.features.map(feature => (
                <button
                  key={feature}
                  onClick={() => toggleArrayFaFilter('features', feature)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.features.includes(feature)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>

          {/* 兼容性 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              兼容的LLM模型
            </label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.compatibility.map(comp => (
                <button
                  key={comp}
                  onClick={() => toggleArrayFaFilter('compatibility', comp)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.compatibility.includes(comp)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>

          {/* 项目类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              项目类型
            </label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.projectTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleArrayFaFilter('projectTypes', type)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.projectTypes.includes(type)
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 结果统计 */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            显示 {filteredProjects.length} 个项目（共 {projects.length} 个）
          </span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <FaStar className="w-4 h-4" />
              <span>按星标排序</span>
            </span>
            <span className="flex items-center space-x-1">
              <FaBolt className="w-4 h-4" />
              <span>AI分析增强</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
