import { createClient } from '@supabase/supabase-js';
import { ProcessedRepo } from './github';

// Supabase配置 - 添加安全检查
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 检查必需的环境变量
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ 警告: Supabase环境变量未配置，某些功能可能不可用');
  console.warn('请检查 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 环境变量');
}

// 创建Supabase客户端（使用服务角色密钥以绕过RLS）
// 如果环境变量不存在，使用占位符值避免构建失败
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// 检查Supabase是否已正确配置
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseServiceKey && 
           !supabaseUrl.includes('placeholder') && 
           !supabaseServiceKey.includes('placeholder'));
};

// 数据库表结构类型
export interface GitHubProject {
  id: string;
  name: string;
  full_name: string;
  owner: string;
  owner_avatar: string;
  url: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  github_updated_at: string; // GitHub上的最后更新时间
  relevance: string;
  relevance_score: number;
  image_url: string;
  readme_content?: string;
  sync_at: string; // 最后同步时间
  gemini_analyzed_at?: string; // Gemini分析时间
  gemini_summary?: string; // Gemini分析摘要
  gemini_key_features?: string[]; // Gemini分析的关键特性
  gemini_use_cases?: string[]; // Gemini分析的使用案例
  gemini_analysis_version?: number; // 分析版本号
}

// 获取所有项目（用于展示）
export async function getAllProjects(): Promise<ProcessedRepo[]> {
  try {
    console.log('从Supabase数据库获取项目...');
    
    const { data, error } = await supabase
      .from('github_projects')
      .select('*')
      .order('relevance_score', { ascending: false })
      .order('stars', { ascending: false });

    if (error) {
      console.error('获取项目数据失败:', error);
      return [];
    }

    console.log(`从数据库获取到 ${data.length} 个项目`);

    // 转换为ProcessedRepo格式，包含 Gemini 分析结果
    const processedRepos: ProcessedRepo[] = data.map(project => ({
      id: project.id,
      name: project.name,
      fullName: project.full_name,
      owner: project.owner,
      ownerAvatar: project.owner_avatar,
      url: project.url,
      description: project.description,
      stars: project.stars,
      forks: project.forks,
      language: project.language,
      topics: project.topics || [],
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      relevance: project.relevance,
      imageUrl: project.image_url,
      readmeContent: project.readme_content,
      // 添加 Gemini 分析结果
      geminiAnalyzedAt: project.gemini_analyzed_at,
      geminiSummary: project.gemini_summary,
      geminiKeyFeatures: project.gemini_key_features || [],
      geminiUseCases: project.gemini_use_cases || [],
      geminiAnalysisVersion: project.gemini_analysis_version
    }));

    return processedRepos;
  } catch (error) {
    console.error('获取项目数据时出错:', error);
    return [];
  }
}

// 获取单个项目详情
export async function getProjectById(id: string): Promise<ProcessedRepo | null> {
  try {
    const { data, error } = await supabase
      .from('github_projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('获取项目详情失败:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      fullName: data.full_name,
      owner: data.owner,
      ownerAvatar: data.owner_avatar,
      url: data.url,
      description: data.description,
      stars: data.stars,
      forks: data.forks,
      language: data.language,
      topics: data.topics || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      relevance: data.relevance,
      imageUrl: data.image_url,
      readmeContent: data.readme_content
    };
  } catch (error) {
    console.error('获取项目详情时出错:', error);
    return null;
  }
}

// 批量插入或更新项目
export async function upsertProjects(projects: ProcessedRepo[]): Promise<{ inserted: number; updated: number; skipped: number }> {
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  try {
    console.log(`开始同步 ${projects.length} 个项目到数据库...`);

    for (const project of projects) {
      try {
        // 首先检查项目是否已存在
        const { data: existingProject, error: selectError } = await supabase
          .from('github_projects')
          .select('id, github_updated_at, relevance_score, gemini_analyzed_at, gemini_analysis_version')
          .eq('id', project.id)
          .single();

        if (selectError && selectError.code !== 'PGRST116') {
          console.error(`检查项目 ${project.id} 时出错:`, selectError);
          continue;
        }

        const needsAnalysis = shouldAnalyzeProject(existingProject, project);
        let geminiAnalysis = null;

        // 对需要分析的项目进行 Gemini 分析
        if (needsAnalysis) {
          try {
            console.log(`🤖 正在分析项目: ${project.name}`);
            const { analyzeProjectRelevance } = await import('./analysis');
            geminiAnalysis = await analyzeProjectRelevance(project);
            console.log(`✅ 分析完成: ${project.name} (得分: ${geminiAnalysis.relevanceScore})`);
          } catch (analysisError) {
            console.warn(`⚠️ 分析项目 ${project.name} 失败:`, analysisError);
            // 分析失败时继续入库，但不设置分析结果
          }
        }

        const projectData: Partial<GitHubProject> = {
          id: project.id,
          name: project.name,
          full_name: project.fullName,
          owner: project.owner,
          owner_avatar: project.ownerAvatar,
          url: project.url,
          description: project.description,
          stars: project.stars,
          forks: project.forks,
          language: project.language,
          topics: project.topics,
          created_at: project.createdAt,
          updated_at: project.updatedAt,
          github_updated_at: project.updatedAt,
          relevance: geminiAnalysis?.relevanceCategory || project.relevance,
          relevance_score: geminiAnalysis?.relevanceScore || calculateRelevanceScore(project),
          image_url: project.imageUrl,
          readme_content: project.readmeContent,
          sync_at: new Date().toISOString(),
          // 添加 Gemini 分析结果
          ...(geminiAnalysis && {
            gemini_analyzed_at: new Date().toISOString(),
            gemini_summary: geminiAnalysis.summary,
            gemini_key_features: geminiAnalysis.keyFeatures,
            gemini_use_cases: geminiAnalysis.useCases,
            gemini_analysis_version: 1
          })
        };

        if (!existingProject) {
          // 项目不存在，插入新记录
          const { error: insertError } = await supabase
            .from('github_projects')
            .insert(projectData);

          if (insertError) {
            console.error(`插入项目 ${project.id} 失败:`, insertError);
          } else {
            inserted++;
            console.log(`✅ 新增项目: ${project.name}${geminiAnalysis ? ' (已分析)' : ''}`);
          }
        } else {
          // 项目已存在，检查是否需要更新
          const existingUpdateTime = new Date(existingProject.github_updated_at);
          const newUpdateTime = new Date(project.updatedAt);

          if (newUpdateTime > existingUpdateTime || !existingProject.relevance_score || needsAnalysis) {
            // 需要更新
            const { error: updateError } = await supabase
              .from('github_projects')
              .update(projectData)
              .eq('id', project.id);

            if (updateError) {
              console.error(`更新项目 ${project.id} 失败:`, updateError);
            } else {
              updated++;
              console.log(`🔄 更新项目: ${project.name}${geminiAnalysis ? ' (已重新分析)' : ''}`);
            }
          } else {
            // 无需更新
            skipped++;
            console.log(`⏭️  跳过项目: ${project.name} (无变化)`);
          }
        }
      } catch (error) {
        console.error(`处理项目 ${project.id} 时出错:`, error);
      }
    }

    console.log(`📊 同步完成: 新增 ${inserted} 个，更新 ${updated} 个，跳过 ${skipped} 个`);
    return { inserted, updated, skipped };

  } catch (error) {
    console.error('批量同步项目时出错:', error);
    return { inserted, updated, skipped };
  }
}

// 判断是否需要进行 Gemini 分析
function shouldAnalyzeProject(existingProject: any, newProject: ProcessedRepo): boolean {
  // 新项目总是需要分析
  if (!existingProject) {
    return true;
  }

  // 如果从未分析过，需要分析
  if (!existingProject.gemini_analyzed_at) {
    return true;
  }

  // 如果项目在GitHub上有更新，且距离上次分析超过7天，需要重新分析
  const lastAnalyzed = new Date(existingProject.gemini_analyzed_at);
  const daysSinceAnalysis = (Date.now() - lastAnalyzed.getTime()) / (1000 * 60 * 60 * 24);
  const projectUpdated = new Date(newProject.updatedAt) > new Date(existingProject.github_updated_at);
  
  if (projectUpdated && daysSinceAnalysis > 7) {
    return true;
  }

  // 如果分析版本过旧，需要重新分析
  const currentAnalysisVersion = 1;
  if (!existingProject.gemini_analysis_version || existingProject.gemini_analysis_version < currentAnalysisVersion) {
    return true;
  }

  return false;
}

// 计算项目相关性分数（用于排序）
function calculateRelevanceScore(project: ProcessedRepo): number {
  const name = project.name.toLowerCase();
  const description = project.description.toLowerCase();
  const topics = project.topics.map(t => t.toLowerCase());
  const fullName = project.fullName.toLowerCase();
  
  let score = 0;
  
  // 高权重关键词
  const highPriorityKeywords = [
    'model-context-protocol', 'anthropic-mcp', 'mcp-server', 
    'mcp-client', 'mcp-protocol', 'claude-mcp'
  ];
  
  // 中权重关键词
  const mediumPriorityKeywords = [
    'model context protocol', 'mcp', 'context protocol',
    'anthropic', 'claude', 'mcp-integration'
  ];
  
  // 低权重关键词
  const lowPriorityKeywords = [
    'awesome-mcp', 'mcp-servers', 'protocol', 'context',
    'ai-assistant', 'llm-integration'
  ];
  
  // 检查高权重关键词
  highPriorityKeywords.forEach(keyword => {
    if (name.includes(keyword) || fullName.includes(keyword)) score += 100;
    else if (description.includes(keyword)) score += 75;
    else if (topics.includes(keyword)) score += 50;
  });
  
  // 检查中权重关键词
  mediumPriorityKeywords.forEach(keyword => {
    if (name.includes(keyword) || fullName.includes(keyword)) score += 60;
    else if (description.includes(keyword)) score += 45;
    else if (topics.includes(keyword)) score += 30;
  });
  
  // 检查低权重关键词
  lowPriorityKeywords.forEach(keyword => {
    if (name.includes(keyword) || fullName.includes(keyword)) score += 20;
    else if (description.includes(keyword)) score += 15;
    else if (topics.includes(keyword)) score += 10;
  });
  
  // 加分项
  if (project.stars > 100) score += 20;
  if (project.stars > 500) score += 30;
  if (project.stars > 1000) score += 50;
  
  if (project.forks > 10) score += 10;
  if (project.forks > 50) score += 20;
  
  // 最近更新加分
  const lastUpdate = new Date(project.updatedAt);
  const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 30) score += 15;
  else if (daysSinceUpdate < 90) score += 10;
  else if (daysSinceUpdate < 180) score += 5;
  
  return Math.max(0, score);
}

// 获取数据库项目统计信息
export async function getProjectStats(): Promise<{
  total: number;
  languages: Record<string, number>;
  relevanceDistribution: Record<string, number>;
  lastSyncTime: string | null;
}> {
  try {
    // 获取总数
    const { count: total } = await supabase
      .from('github_projects')
      .select('*', { count: 'exact', head: true });

    // 获取语言分布
    const { data: languageData } = await supabase
      .from('github_projects')
      .select('language');

    // 获取相关性分布
    const { data: relevanceData } = await supabase
      .from('github_projects')
      .select('relevance');

    // 获取最后同步时间
    const { data: lastSyncData } = await supabase
      .from('github_projects')
      .select('sync_at')
      .order('sync_at', { ascending: false })
      .limit(1)
      .single();

    // 统计语言分布
    const languages: Record<string, number> = {};
    languageData?.forEach(item => {
      const lang = item.language || 'Unknown';
      languages[lang] = (languages[lang] || 0) + 1;
    });

    // 统计相关性分布
    const relevanceDistribution: Record<string, number> = {};
    relevanceData?.forEach(item => {
      const rel = item.relevance || 'Unknown';
      relevanceDistribution[rel] = (relevanceDistribution[rel] || 0) + 1;
    });

    return {
      total: total || 0,
      languages,
      relevanceDistribution,
      lastSyncTime: lastSyncData?.sync_at || null
    };
  } catch (error) {
    console.error('获取项目统计信息失败:', error);
    return {
      total: 0,
      languages: {},
      relevanceDistribution: {},
      lastSyncTime: null
    };
  }
}

// 检查数据库连接
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('github_projects')
      .select('id')
      .limit(1);

    return !error;
  } catch (error) {
    console.error('数据库连接检查失败:', error);
    return false;
  }
} 