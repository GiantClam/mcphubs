import { createClient } from '@supabase/supabase-js';
import { ProcessedRepo } from './github';

// 简单的关键字分析函数，作为AI分析的备用方案
function getSimpleAnalysis(project: ProcessedRepo) {
  const mcpKeywords = [
    'mcp', 'model context protocol', 'anthropic', 'claude',
    'context protocol', 'mcp-server', 'mcp-client',
    'model-context-protocol', 'awesome-mcp'
  ];
  
  const projectText = `${project.name} ${project.description} ${project.topics.join(' ')}`.toLowerCase();
  
  // 计算关键字匹配分数
  let score = 0;
  const matchedKeywords: string[] = [];
  
  mcpKeywords.forEach(keyword => {
    if (projectText.includes(keyword.toLowerCase())) {
      score += keyword === 'mcp' ? 30 : keyword.length > 10 ? 25 : 15;
      matchedKeywords.push(keyword);
    }
  });
  
  // 基于项目特征调整分数
  if (project.topics.some(topic => topic.toLowerCase().includes('mcp'))) {
    score += 20;
  }
  
  if (project.name.toLowerCase().includes('mcp')) {
    score += 25;
  }
  
  score = Math.min(score, 100);
  
  return {
    relevanceScore: score,
    relevanceCategory: score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Related',
    summary: `基于关键字分析的相关性评估 (匹配关键字: ${matchedKeywords.join(', ')})`,
    keyFeatures: matchedKeywords.slice(0, 3),
    useCases: ['MCP相关项目'],
    // 新增结构化字段
    projectType: 'Unknown' as const,
    coreFeatures: [],
    techStack: [project.language || 'Unknown'],
    compatibility: [],
    installCommand: undefined,
    quickStartCode: undefined,
    documentationUrl: undefined,
    serverEndpoint: undefined,
    clientCapabilities: []
  };
}

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

// ===== 新增：Remote MCP Servers 与 MCP Clients 类型与查询 =====
export interface RemoteMcpServer {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  homepage?: string;
  connect_url?: string;
  auth_type?: 'oauth' | 'open' | 'api_key' | 'other';
  category?: string;
  tags?: string[];
  status?: 'active' | 'beta' | 'deprecated';
  updated_at?: string;
}

export interface McpClient {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  homepage?: string;
  support_level?: 'full' | 'partial' | 'experimental';
  platforms?: string[]; // e.g. ['macOS','Windows','Linux','Web']
  features?: string[]; // e.g. ['resources','tools','prompts']
  updated_at?: string;
}

export async function getRemoteMcpServers(): Promise<RemoteMcpServer[]> {
  try {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('remote_mcp_servers')
      .select('*')
      .order('name', { ascending: true });
    if (error) {
      console.error('获取 remote_mcp_servers 失败:', error);
      return [];
    }
    return (data as RemoteMcpServer[]) || [];
  } catch (e) {
    console.error('获取 remote_mcp_servers 出错:', e);
    return [];
  }
}

export async function getMcpClients(): Promise<McpClient[]> {
  try {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('mcp_clients')
      .select('*')
      .order('name', { ascending: true });
    if (error) {
      console.error('获取 mcp_clients 失败:', error);
      return [];
    }
    return (data as McpClient[]) || [];
  } catch (e) {
    console.error('获取 mcp_clients 出错:', e);
    return [];
  }
}

// ===== Claude Skills Types and Queries =====
export interface ClaudeSkill {
  id: string;
  name: string;
  path: string;
  download_url: string;
  github_url: string;
  description?: string;
  skill_md?: string;
  sync_at: string;
  created_at: string;
  updated_at: string;
}

// 获取单个 Claude Skill
export async function getClaudeSkillByName(name: string): Promise<ClaudeSkill | null> {
  try {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('claude_skills')
      .select('*')
      .eq('name', name)
      .single();
    if (error) {
      console.error('Failed to fetch Claude Skill by name:', error);
      return null;
    }
    return (data as ClaudeSkill) || null;
  } catch (e) {
    console.error('Error fetching Claude Skill by name:', e);
    return null;
  }
}

// Get all Claude Skills
export async function getAllClaudeSkills(): Promise<ClaudeSkill[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot fetch Claude Skills');
      return [];
    }
    
    const { data, error } = await supabase
      .from('claude_skills')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Failed to fetch Claude Skills:', error);
      return [];
    }

    return (data as ClaudeSkill[]) || [];
  } catch (e) {
    console.error('Error fetching Claude Skills:', e);
    return [];
  }
}

// Sync Claude Skills to database
export async function syncClaudeSkills(skills: Array<{
  name: string;
  path: string;
  downloadUrl: string;
  githubUrl: string;
  description?: string;
  skillMd?: string;
}>): Promise<{ inserted: number; updated: number; errors: number }> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, skipping Claude Skills sync');
    return { inserted: 0, updated: 0, errors: 0 };
  }

  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const skill of skills) {
    try {
      // Check if skill exists
      const { data: existing } = await supabase
        .from('claude_skills')
        .select('id')
        .eq('name', skill.name)
        .single();

      // Build upsert data, conditionally include description if column exists
      const upsertData: any = {
        id: skill.name,
        name: skill.name,
        path: skill.path,
        download_url: skill.downloadUrl,
        github_url: skill.githubUrl,
        sync_at: new Date().toISOString(),
      };
      
      // Only include description if it's provided (column may not exist yet)
      if (skill.description !== undefined) {
        upsertData.description = skill.description || null;
      }
      // Only include skill_md if provided
      if (skill.skillMd !== undefined) {
        upsertData.skill_md = skill.skillMd || null;
      }

      const { error } = await supabase
        .from('claude_skills')
        .upsert(upsertData, {
          onConflict: 'name',
        });

      if (error) {
        // Check if error is due to missing description column
        if (error.message?.includes("Could not find the 'description' column")) {
          console.error(`❌ Database migration required! Please execute migration 004_add_claude_skills_description.sql in Supabase SQL Editor.`);
          console.error(`   Error for skill ${skill.name}: ${error.message}`);
          
          // Try again without description field
          const { error: retryError } = await supabase
            .from('claude_skills')
            .upsert({
              id: skill.name,
              name: skill.name,
              path: skill.path,
              download_url: skill.downloadUrl,
              github_url: skill.githubUrl,
              sync_at: new Date().toISOString(),
            }, {
              onConflict: 'name',
            });
          
          if (retryError) {
            console.error(`Failed to sync skill ${skill.name} (without description):`, retryError);
            errors++;
          } else {
            // Successfully synced without description
            if (existing) {
              updated++;
            } else {
              inserted++;
            }
          }
        } else {
          console.error(`Failed to sync skill ${skill.name}:`, error);
          errors++;
        }
      } else {
        if (existing) {
          updated++;
        } else {
          inserted++;
        }
      }
    } catch (e) {
      console.error(`Error syncing skill ${skill.name}:`, e);
      errors++;
    }
  }

  return { inserted, updated, errors };
}

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
  // 新增结构化字段
  project_type?: string; // Server, Client, Library, Tool, Example, Unknown
  core_features?: string[]; // 核心特性
  tech_stack?: string[]; // 技术栈
  compatibility?: string[]; // 兼容的LLM模型
  install_command?: string; // 安装命令
  quick_start_code?: string; // 快速开始代码
  documentation_url?: string; // 文档链接
  server_endpoint?: string; // 服务器端点
  client_capabilities?: string[]; // 客户端能力
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
      geminiAnalysisVersion: project.gemini_analysis_version,
      // 添加新的结构化字段
      projectType: project.project_type,
      coreFeatures: project.core_features || [],
      techStack: project.tech_stack || [],
      compatibility: project.compatibility || [],
      installCommand: project.install_command,
      quickStartCode: project.quick_start_code,
      documentationUrl: project.documentation_url,
      serverEndpoint: project.server_endpoint,
      clientCapabilities: project.client_capabilities || []
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
            
            // 检查是否在支持分析的环境中
            if (typeof window !== 'undefined') {
              console.warn(`⚠️ 跳过客户端环境的AI分析: ${project.name}`);
            } else {
              // 动态导入分析模块，使用更安全的导入方式
              const analysisModule = await import('./analysis').catch(importError => {
                console.warn(`⚠️ 无法导入分析模块: ${importError.message}`);
                return null;
              });
              
              if (analysisModule && analysisModule.analyzeProjectRelevance) {
                geminiAnalysis = await analysisModule.analyzeProjectRelevance(project);
                console.log(`✅ 分析完成: ${project.name} (得分: ${geminiAnalysis.relevanceScore})`);
              } else {
                console.warn(`⚠️ 分析模块不可用，使用默认分析: ${project.name}`);
                // 使用简单的关键字分析作为备用
                geminiAnalysis = getSimpleAnalysis(project);
              }
            }
          } catch (analysisError) {
            console.warn(`⚠️ 分析项目 ${project.name} 失败:`, analysisError);
            // 分析失败时使用简单的关键字分析
            geminiAnalysis = getSimpleAnalysis(project);
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
            gemini_analysis_version: 1,
            // 添加新的结构化字段
            project_type: geminiAnalysis.projectType,
            core_features: geminiAnalysis.coreFeatures,
            tech_stack: geminiAnalysis.techStack,
            compatibility: geminiAnalysis.compatibility,
            install_command: geminiAnalysis.installCommand,
            quick_start_code: geminiAnalysis.quickStartCode,
            documentation_url: geminiAnalysis.documentationUrl,
            server_endpoint: geminiAnalysis.serverEndpoint,
            client_capabilities: geminiAnalysis.clientCapabilities
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