import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 获取热门标签 API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const { data: projects } = await supabase
      .from('github_projects')
      .select('topics')
      .not('topics', 'is', null)
      .limit(1000);

    const tagCounts: Record<string, number> = {};
    
    projects?.forEach(project => {
      if (project.topics) {
        project.topics.forEach((topic: string) => {
          tagCounts[topic] = (tagCounts[topic] || 0) + 1;
        });
      }
    });

    const popularTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(item => item.name);

    return NextResponse.json({ tags: popularTags });

  } catch (error) {
    console.error('Get popular tags error:', error);
    return NextResponse.json({ tags: [] });
  }
}
