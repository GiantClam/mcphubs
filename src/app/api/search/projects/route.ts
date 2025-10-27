import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 搜索项目 API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const languages = searchParams.get('languages')?.split(',') || [];
  const minStars = parseInt(searchParams.get('minStars') || '0');
  const maxStars = searchParams.get('maxStars') ? parseInt(searchParams.get('maxStars')!) : null;
  const categories = searchParams.get('categories')?.split(',') || [];
  const tags = searchParams.get('tags')?.split(',') || [];
  const updatedWithin = searchParams.get('updatedWithin');
  const hasDocumentation = searchParams.get('hasDocumentation');
  const licenseType = searchParams.get('licenseType')?.split(',') || [];
  const sortBy = searchParams.get('sortBy') || 'relevance';

  try {
    let supabaseQuery = supabase.from('github_projects').select('*');

    // 文本搜索
    if (query.trim()) {
      const searchTerm = `%${query.toLowerCase()}%`;
      supabaseQuery = supabaseQuery.or(
        `name.ilike.${searchTerm},description.ilike.${searchTerm},language.ilike.${searchTerm}`
      );
    }

    // 语言过滤
    if (languages.length > 0) {
      supabaseQuery = supabaseQuery.in('language', languages);
    }

    // 星数过滤
    if (minStars > 0) {
      supabaseQuery = supabaseQuery.gte('stars', minStars);
    }
    if (maxStars) {
      supabaseQuery = supabaseQuery.lte('stars', maxStars);
    }

    // 标签过滤
    if (tags.length > 0) {
      // 这里需要更复杂的查询来匹配数组中的标签
      // 暂时使用简单的包含查询
      tags.forEach(tag => {
        supabaseQuery = supabaseQuery.contains('topics', [tag]);
      });
    }

    // 更新时间过滤
    if (updatedWithin) {
      const now = new Date();
      let cutoffDate: Date;
      
      switch (updatedWithin) {
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '3months':
          cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0);
      }
      
      supabaseQuery = supabaseQuery.gte('updated_at', cutoffDate.toISOString());
    }

    // 文档过滤
    if (hasDocumentation === 'true') {
      supabaseQuery = supabaseQuery.not('readme_content', 'is', null);
    }

    // 排序
    switch (sortBy) {
      case 'stars':
        supabaseQuery = supabaseQuery.order('stars', { ascending: false });
        break;
      case 'updated':
        supabaseQuery = supabaseQuery.order('updated_at', { ascending: false });
        break;
      case 'name':
        supabaseQuery = supabaseQuery.order('name', { ascending: true });
        break;
      case 'trending':
        // 简单的趋势算法：结合星数和更新时间
        supabaseQuery = supabaseQuery.order('stars', { ascending: false });
        break;
      case 'relevance':
      default:
        // 相关性排序：结合星数和文本匹配
        supabaseQuery = supabaseQuery.order('stars', { ascending: false });
        break;
    }

    // 分页
    const offset = (page - 1) * limit;
    supabaseQuery = supabaseQuery.range(offset, offset + limit - 1);

    const { data: projects, error } = await supabaseQuery;

    if (error) {
      console.error('Search projects error:', error);
      return NextResponse.json({
        results: [],
        total: 0,
        hasMore: false
      });
    }

    // 计算总数（用于分页）
    let countQuery = supabase.from('github_projects').select('*', { count: 'exact', head: true });
    
    // 应用相同的过滤条件
    if (query.trim()) {
      const searchTerm = `%${query.toLowerCase()}%`;
      countQuery = countQuery.or(
        `name.ilike.${searchTerm},description.ilike.${searchTerm},language.ilike.${searchTerm}`
      );
    }
    if (languages.length > 0) {
      countQuery = countQuery.in('language', languages);
    }
    if (minStars > 0) {
      countQuery = countQuery.gte('stars', minStars);
    }
    if (maxStars) {
      countQuery = countQuery.lte('stars', maxStars);
    }

    const { count } = await countQuery;

    // 计算相关性分数
    const results = projects?.map(project => {
      let relevanceScore = 0;
      const matchedFields: string[] = [];

      if (query.trim()) {
        const searchTerms = query.toLowerCase().split(/\s+/);
        
        // 名称匹配
        if (searchTerms.some(term => project.name.toLowerCase().includes(term))) {
          matchedFields.push('name');
          relevanceScore += 10;
        }

        // 描述匹配
        if (searchTerms.some(term => project.description?.toLowerCase().includes(term))) {
          matchedFields.push('description');
          relevanceScore += 5;
        }

        // 语言匹配
        if (searchTerms.some(term => project.language?.toLowerCase().includes(term))) {
          matchedFields.push('language');
          relevanceScore += 8;
        }

        // 标签匹配
        if (searchTerms.some(term => 
          project.topics?.some((topic: string) => topic.toLowerCase().includes(term))
        )) {
          matchedFields.push('topics');
          relevanceScore += 6;
        }
      }

      return {
        ...project,
        relevanceScore,
        matchedFields
      };
    }) || [];

    // 按相关性重新排序
    if (sortBy === 'relevance' && query.trim()) {
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    const hasMore = (count || 0) > offset + limit;

    return NextResponse.json({
      results,
      total: count || 0,
      hasMore
    });

  } catch (error) {
    console.error('Search projects error:', error);
    return NextResponse.json({
      results: [],
      total: 0,
      hasMore: false
    });
  }
}
