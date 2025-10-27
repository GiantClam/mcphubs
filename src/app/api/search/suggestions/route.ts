import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 搜索建议 API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({
      projects: [],
      tags: [],
      categories: []
    });
  }

  try {
    const searchTerm = `%${query.toLowerCase()}%`;

    // 搜索项目
    const { data: projects } = await supabase
      .from('github_projects')
      .select('id, name, full_name, description, language, stars, image_url')
      .or(`name.ilike.${searchTerm},description.ilike.${searchTerm},language.ilike.${searchTerm}`)
      .order('stars', { ascending: false })
      .limit(5);

    // 搜索标签
    const { data: tags } = await supabase
      .from('github_projects')
      .select('topics')
      .not('topics', 'is', null)
      .limit(100);

    const tagCounts: Record<string, number> = {};
    tags?.forEach(project => {
      if (project.topics) {
        project.topics.forEach((topic: string) => {
          if (topic.toLowerCase().includes(query.toLowerCase())) {
            tagCounts[topic] = (tagCounts[topic] || 0) + 1;
          }
        });
      }
    });

    const popularTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 预定义分类
    const categories = [
      { name: 'Web Development', slug: 'web', icon: 'globe', count: 45 },
      { name: 'Database', slug: 'database', icon: 'database', count: 32 },
      { name: 'API', slug: 'api', icon: 'plug', count: 28 },
      { name: 'CLI Tools', slug: 'cli', icon: 'terminal', count: 23 },
      { name: 'DevOps', slug: 'devops', icon: 'server', count: 19 }
    ].filter(cat => 
      cat.name.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json({
      projects: projects || [],
      tags: popularTags,
      categories
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json({
      projects: [],
      tags: [],
      categories: []
    });
  }
}
