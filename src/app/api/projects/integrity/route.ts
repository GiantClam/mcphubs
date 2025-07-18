import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, isSupabaseConfigured } from '@/lib/supabase';

interface IntegrityIssues {
  missingDescription: string[];
  missingImageUrl: string[];
  missingOwnerAvatar: string[];
  missingTopics: string[];
  missingReadmeContent: string[];
  missingRelevance: string[];
  total: number;
}

export async function GET(request: NextRequest) {
  try {
    // 检查Supabase是否配置
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Supabase未配置',
        message: '请检查NEXT_PUBLIC_SUPABASE_URL和SUPABASE_SERVICE_ROLE_KEY环境变量'
      }, { status: 500 });
    }

    console.log('🔍 检查项目数据完整性...');
    
    const projects = await getAllProjects();
    
    if (!projects || projects.length === 0) {
      return NextResponse.json({
        success: true,
        message: '数据库中没有项目数据',
        projectCount: 0,
        issues: {
          missingDescription: [],
          missingImageUrl: [],
          missingOwnerAvatar: [],
          missingTopics: [],
          missingReadmeContent: [],
          missingRelevance: [],
          total: 0
        }
      });
    }

    const issues: IntegrityIssues = {
      missingDescription: [],
      missingImageUrl: [],
      missingOwnerAvatar: [],
      missingTopics: [],
      missingReadmeContent: [],
      missingRelevance: [],
      total: 0
    };

    const problemProjects: Array<{
      id: string;
      name: string;
      issues: string[];
    }> = [];

    projects.forEach(project => {
      const projectIssues: string[] = [];
      
      if (!project.description || project.description.trim() === '') {
        issues.missingDescription.push(project.id);
        projectIssues.push('description');
      }
      
      if (!project.imageUrl || project.imageUrl.trim() === '') {
        issues.missingImageUrl.push(project.id);
        projectIssues.push('imageUrl');
      }
      
      if (!project.ownerAvatar || project.ownerAvatar.trim() === '') {
        issues.missingOwnerAvatar.push(project.id);
        projectIssues.push('ownerAvatar');
      }
      
      if (!project.topics || project.topics.length === 0) {
        issues.missingTopics.push(project.id);
        projectIssues.push('topics');
      }
      
      if (!project.readmeContent || project.readmeContent.trim() === '') {
        issues.missingReadmeContent.push(project.id);
        projectIssues.push('readmeContent');
      }
      
      if (!project.relevance || project.relevance.trim() === '') {
        issues.missingRelevance.push(project.id);
        projectIssues.push('relevance');
      }
      
      if (projectIssues.length > 0) {
        issues.total++;
        problemProjects.push({
          id: project.id,
          name: project.name,
          issues: projectIssues
        });
      }
    });

    const summary = {
      projectCount: projects.length,
      healthyProjects: projects.length - issues.total,
      problemProjects: issues.total,
      completenessRate: Math.round(((projects.length - issues.total) / projects.length) * 100)
    };

    console.log(`📊 完整性检查完成: ${summary.healthyProjects}/${summary.projectCount} 项目健康`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
      issues,
      problemProjects: problemProjects.slice(0, 10), // 只返回前10个有问题的项目作为示例
      recommendations: generateRecommendations(issues, summary)
    });

  } catch (error: unknown) {
    console.error('检查项目数据完整性时出错:', error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json({
      success: false,
      error: '检查项目数据完整性失败',
      message: errorMessage
    }, { status: 500 });
  }
}

function generateRecommendations(issues: IntegrityIssues, summary: any): string[] {
  const recommendations: string[] = [];
  
  if (summary.completenessRate < 80) {
    recommendations.push('数据完整性较低，建议运行修复脚本: node scripts/fix-incomplete-projects.js');
  }
  
  if (issues.missingReadmeContent.length > 5) {
    recommendations.push('大量项目缺少README内容，建议重新同步项目数据');
  }
  
  if (issues.missingDescription.length > 3) {
    recommendations.push('多个项目缺少描述，可能影响用户体验');
  }
  
  if (issues.missingImageUrl.length > 10) {
    recommendations.push('大量项目缺少图片，建议添加默认图片');
  }
  
  if (summary.completenessRate === 100) {
    recommendations.push('所有项目数据完整，系统运行良好！');
  }
  
  return recommendations;
} 