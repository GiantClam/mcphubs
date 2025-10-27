'use client';

import { ProcessedRepo } from '@/lib/github';

export interface SearchSuggestion {
  projects?: Array<{
    id: string;
    name: string;
    fullName: string;
    description: string;
    language: string;
    stars: number;
    imageUrl: string;
  }>;
  tags?: Array<{
    name: string;
    count: number;
  }>;
  categories?: Array<{
    name: string;
    slug: string;
    icon: string;
    count: number;
  }>;
}

export interface SearchFilters {
  languages: string[];
  minStars: number;
  maxStars: number | null;
  categories: string[];
  tags: string[];
  updatedWithin: string | null;
  hasDocumentation: boolean | null;
  licenseType: string[];
  sortBy: 'relevance' | 'stars' | 'updated' | 'name' | 'trending';
}

export interface SearchResult extends ProcessedRepo {
  relevanceScore?: number;
  matchedFields?: string[];
}

// 搜索建议 API
export async function getSuggestions(query: string): Promise<SearchSuggestion> {
  if (query.length < 2) {
    return { projects: [], tags: [], categories: [] };
  }

  try {
    const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return { projects: [], tags: [], categories: [] };
  }
}

// 搜索项目 API
export async function searchProjects(
  query: string,
  filters: Partial<SearchFilters> = {},
  page = 1,
  limit = 20
): Promise<{
  results: SearchResult[];
  total: number;
  hasMore: boolean;
}> {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              acc[key] = value.join(',');
            }
          } else if (value !== '') {
            acc[key] = value.toString();
          }
        }
        return acc;
      }, {} as Record<string, string>)
    });

    const response = await fetch(`/api/search/projects?${params}`);
    if (!response.ok) {
      throw new Error('Failed to search projects');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching projects:', error);
    return { results: [], total: 0, hasMore: false };
  }
}

// 本地搜索函数（用于客户端过滤）
export function localSearch(
  projects: ProcessedRepo[],
  query: string,
  filters: Partial<SearchFilters> = {}
): SearchResult[] {
  if (!query.trim()) {
    return projects.map(project => ({ ...project, relevanceScore: 0 }));
  }

  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  
  const filteredProjects = projects
    .map(project => {
      const matchedFields: string[] = [];
      let relevanceScore = 0;

      // 搜索项目名称
      const nameMatch = searchTerms.some(term => 
        project.name.toLowerCase().includes(term)
      );
      if (nameMatch) {
        matchedFields.push('name');
        relevanceScore += 10;
      }

      // 搜索描述
      const descMatch = searchTerms.some(term => 
        project.description?.toLowerCase().includes(term)
      );
      if (descMatch) {
        matchedFields.push('description');
        relevanceScore += 5;
      }

      // 搜索语言
      const langMatch = searchTerms.some(term => 
        project.language?.toLowerCase().includes(term)
      );
      if (langMatch) {
        matchedFields.push('language');
        relevanceScore += 8;
      }

      // 搜索标签
      const tagMatch = searchTerms.some(term => 
        project.topics?.some(topic => topic.toLowerCase().includes(term))
      );
      if (tagMatch) {
        matchedFields.push('topics');
        relevanceScore += 6;
      }

      // 应用过滤器
      if (filters.languages?.length && !filters.languages.includes(project.language)) {
        return null;
      }

      if (filters.minStars && project.stars < filters.minStars) {
        return null;
      }

      if (filters.maxStars && project.stars > filters.maxStars) {
        return null;
      }

      if (filters.tags?.length && !filters.tags.some(tag => 
        project.topics?.some(topic => topic.toLowerCase().includes(tag.toLowerCase()))
      )) {
        return null;
      }

      if (filters.updatedWithin) {
        const updatedDate = new Date(project.updatedAt);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        const limits = {
          week: 7,
          month: 30,
          '3months': 90,
          year: 365
        };
        
        if (diffDays > limits[filters.updatedWithin as keyof typeof limits]) {
          return null;
        }
      }

      return {
        ...project,
        relevanceScore,
        matchedFields
      };
    })
    .filter((project): project is SearchResult & { relevanceScore: number; matchedFields: string[] } => project !== null);

  return filteredProjects
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'stars':
          return b.stars - a.stars;
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'trending':
          // 简单的趋势算法：最近更新 + 高星数
          const aTrend = a.stars * 0.7 + (new Date(a.updatedAt).getTime() / 1000000) * 0.3;
          const bTrend = b.stars * 0.7 + (new Date(b.updatedAt).getTime() / 1000000) * 0.3;
          return bTrend - aTrend;
        case 'relevance':
        default:
          return b.relevanceScore! - a.relevanceScore!;
      }
    });
}

// 获取热门标签
export async function getPopularTags(limit = 20): Promise<string[]> {
  try {
    const response = await fetch(`/api/search/popular-tags?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch popular tags');
    }
    const data = await response.json();
    return data.tags || [];
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    return [];
  }
}

// 获取语言列表
export async function getLanguages(): Promise<string[]> {
  try {
    const response = await fetch('/api/search/languages');
    if (!response.ok) {
      throw new Error('Failed to fetch languages');
    }
    const data = await response.json();
    return data.languages || [];
  } catch (error) {
    console.error('Error fetching languages:', error);
    return [];
  }
}

// 获取分类列表
export async function getCategories(): Promise<Array<{
  name: string;
  slug: string;
  icon: string;
  count: number;
}>> {
  try {
    const response = await fetch('/api/search/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
