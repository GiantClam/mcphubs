import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 获取语言列表 API
export async function GET() {
  try {
    const { data: projects } = await supabase
      .from('github_projects')
      .select('language')
      .not('language', 'is', null);

    const languageCounts: Record<string, number> = {};
    
    projects?.forEach(project => {
      if (project.language) {
        languageCounts[project.language] = (languageCounts[project.language] || 0) + 1;
      }
    });

    const languages = Object.entries(languageCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .map(item => item.name);

    return NextResponse.json({ languages });

  } catch (error) {
    console.error('Get languages error:', error);
    return NextResponse.json({ languages: [] });
  }
}
