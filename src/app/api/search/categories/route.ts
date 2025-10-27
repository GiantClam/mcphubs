import { NextRequest, NextResponse } from 'next/server';

// 获取分类列表 API
export async function GET() {
  try {
    // 预定义的分类，实际项目中可以从数据库获取
    const categories = [
      { name: 'Web Development', slug: 'web', icon: 'globe', count: 45 },
      { name: 'Database', slug: 'database', icon: 'database', count: 32 },
      { name: 'API', slug: 'api', icon: 'plug', count: 28 },
      { name: 'CLI Tools', slug: 'cli', icon: 'terminal', count: 23 },
      { name: 'DevOps', slug: 'devops', icon: 'server', count: 19 },
      { name: 'AI/ML', slug: 'ai-ml', icon: 'brain', count: 15 },
      { name: 'Security', slug: 'security', icon: 'shield', count: 12 },
      { name: 'Testing', slug: 'testing', icon: 'flask', count: 8 },
      { name: 'Mobile', slug: 'mobile', icon: 'mobile', count: 6 },
      { name: 'Desktop', slug: 'desktop', icon: 'desktop', count: 4 }
    ];

    return NextResponse.json({ categories });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json({ categories: [] });
  }
}
