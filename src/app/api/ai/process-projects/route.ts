import { NextRequest, NextResponse } from 'next/server';
import { analyzeProjectRelevance } from '@/lib/analysis';
import { upsertProjects } from '@/lib/supabase';
import { searchMCPProjects } from '@/lib/github';
import { ProcessedRepo } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const { action, projectIds, forceReanalysis = false } = await request.json();

    if (action === 'process_all') {
      // 处理所有项目
      console.log('🤖 开始AI处理所有项目...');
      
      const projects = await searchMCPProjects();
      const processedProjects: ProcessedRepo[] = [];

      for (const project of projects) {
        try {
          console.log(`处理项目: ${project.name}`);
          
          // 使用AI分析项目
          const analysis = await analyzeProjectRelevance(project, forceReanalysis);
          
          // 合并分析结果到项目数据
          const enhancedProject: ProcessedRepo = {
            ...project,
            projectType: analysis.projectType,
            coreFeatures: analysis.coreFeatures,
            techStack: analysis.techStack,
            compatibility: analysis.compatibility,
            installCommand: analysis.installCommand,
            quickStartCode: analysis.quickStartCode,
            documentationUrl: analysis.documentationUrl,
            serverEndpoint: analysis.serverEndpoint,
            clientCapabilities: analysis.clientCapabilities,
            // 更新现有的AI字段
            geminiAnalyzedAt: new Date().toISOString(),
            geminiSummary: analysis.summary,
            geminiKeyFeatures: analysis.keyFeatures,
            geminiUseCases: analysis.useCases,
            geminiAnalysisVersion: 2 // 新版本
          };

          processedProjects.push(enhancedProject);
          
          // 避免API限制
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`处理项目 ${project.name} 时出错:`, error);
          // 继续处理下一个项目
        }
      }

      // 批量保存到数据库
      const syncStats = await upsertProjects(processedProjects);
      
      return NextResponse.json({
        success: true,
        message: `成功处理 ${processedProjects.length} 个项目`,
        stats: syncStats,
        processedCount: processedProjects.length
      });

    } else if (action === 'process_selected' && projectIds?.length > 0) {
      // 处理选定的项目
      console.log(`🤖 开始AI处理选定项目: ${projectIds.join(', ')}`);
      
      const projects = await searchMCPProjects();
      const selectedProjects = projects.filter(p => projectIds.includes(p.id));
      const processedProjects: ProcessedRepo[] = [];

      for (const project of selectedProjects) {
        try {
          console.log(`处理项目: ${project.name}`);
          
          const analysis = await analyzeProjectRelevance(project, forceReanalysis);
          
          const enhancedProject: ProcessedRepo = {
            ...project,
            projectType: analysis.projectType,
            coreFeatures: analysis.coreFeatures,
            techStack: analysis.techStack,
            compatibility: analysis.compatibility,
            installCommand: analysis.installCommand,
            quickStartCode: analysis.quickStartCode,
            documentationUrl: analysis.documentationUrl,
            serverEndpoint: analysis.serverEndpoint,
            clientCapabilities: analysis.clientCapabilities,
            geminiAnalyzedAt: new Date().toISOString(),
            geminiSummary: analysis.summary,
            geminiKeyFeatures: analysis.keyFeatures,
            geminiUseCases: analysis.useCases,
            geminiAnalysisVersion: 2
          };

          processedProjects.push(enhancedProject);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`处理项目 ${project.name} 时出错:`, error);
        }
      }

      const syncStats = await upsertProjects(processedProjects);
      
      return NextResponse.json({
        success: true,
        message: `成功处理 ${processedProjects.length} 个选定项目`,
        stats: syncStats,
        processedCount: processedProjects.length
      });

    } else if (action === 'validate_data') {
      // 验证数据质量
      console.log('🔍 开始验证数据质量...');
      
      const projects = await searchMCPProjects();
      const validationResults = {
        total: projects.length,
        withProjectType: 0,
        withCoreFeatures: 0,
        withTechStack: 0,
        withCompatibility: 0,
        withInstallCommand: 0,
        withQuickStartCode: 0,
        withDocumentationUrl: 0,
        withServerEndpoint: 0,
        withClientCapabilities: 0,
        issues: [] as string[]
      };

      for (const project of projects) {
        if (project.projectType) validationResults.withProjectType++;
        if (project.coreFeatures?.length) validationResults.withCoreFeatures++;
        if (project.techStack?.length) validationResults.withTechStack++;
        if (project.compatibility?.length) validationResults.withCompatibility++;
        if (project.installCommand) validationResults.withInstallCommand++;
        if (project.quickStartCode) validationResults.withQuickStartCode++;
        if (project.documentationUrl) validationResults.withDocumentationUrl++;
        if (project.serverEndpoint) validationResults.withServerEndpoint++;
        if (project.clientCapabilities?.length) validationResults.withClientCapabilities++;

        // 检查数据质量问题
        if (!project.projectType) {
          validationResults.issues.push(`${project.name}: 缺少项目类型`);
        }
        if (!project.coreFeatures?.length) {
          validationResults.issues.push(`${project.name}: 缺少核心特性`);
        }
        if (!project.techStack?.length) {
          validationResults.issues.push(`${project.name}: 缺少技术栈信息`);
        }
      }

      return NextResponse.json({
        success: true,
        message: '数据质量验证完成',
        validation: validationResults
      });

    } else {
      return NextResponse.json(
        { success: false, message: '无效的操作类型' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('AI处理项目时出错:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'AI处理失败', 
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI项目处理API',
    endpoints: {
      'POST /api/ai/process-projects': {
        description: '处理项目数据',
        actions: ['process_all', 'process_selected', 'validate_data'],
        parameters: {
          action: 'string (required)',
          projectIds: 'string[] (optional, for process_selected)',
          forceReanalysis: 'boolean (optional, default: false)'
        }
      }
    }
  });
}
