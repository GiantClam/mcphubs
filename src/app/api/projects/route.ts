import { NextRequest, NextResponse } from 'next/server';
import { getProjects, getProjectDetails } from '@/lib/project-service';

// 获取所有项目 (GET)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const strategy = searchParams.get('strategy') as any || 'database-first';
    const cached = searchParams.get('cached') !== 'false'; // 默认启用缓存
    
    console.log(`🔍 API请求 - 策略: ${strategy}, 缓存: ${cached}`);

    // 获取项目数据
    const result = await getProjects({
      strategy,
      fallbackEnabled: true,
      cacheTimeout: cached ? 60 : 0 // 60分钟缓存，或不缓存
    });

    // 模拟AI评分和用户交互数据（保持兼容性）
    const enhancedProjects = result.projects.map(project => ({
      ...project,
      aiScore: Math.floor(Math.random() * 40) + 60, // 60-100分
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      isLiked: Math.random() > 0.7,
      topics: project.topics || [],
      githubUrl: project.url,
    }));

    console.log(`✅ API返回 ${enhancedProjects.length} 个项目 (来源: ${result.source}, 缓存: ${result.cached})`);

    return NextResponse.json({
      success: true,
      data: enhancedProjects,
      meta: {
        total: enhancedProjects.length,
        source: result.source,
        cached: result.cached,
        timestamp: result.timestamp,
        stats: result.stats
      }
    });

  } catch (error: any) {
    console.error('获取项目列表失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '获取项目列表失败',
        data: []
      },
      { status: 500 }
    );
  }
}

// 获取单个项目详情 (可以通过查询参数指定ID)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少项目ID' },
        { status: 400 }
      );
    }

    console.log(`🔍 获取项目详情API - ID: ${id}`);

    const project = await getProjectDetails(id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: '项目不存在' },
        { status: 404 }
      );
    }

    // 添加增强数据
    const enhancedProject = {
      ...project,
      aiScore: Math.floor(Math.random() * 40) + 60,
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      isLiked: Math.random() > 0.7,
      topics: project.topics || [],
      githubUrl: project.url,
    };

    console.log(`✅ 返回项目详情: ${project.name}`);

    return NextResponse.json({
      success: true,
      data: enhancedProject
    });

  } catch (error: any) {
    console.error('获取项目详情失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '获取项目详情失败' 
      },
      { status: 500 }
    );
  }
} 