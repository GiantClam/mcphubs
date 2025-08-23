import { ProcessedRepo } from './github';
import { getAllProjects, getProjectById, checkDatabaseConnection, upsertProjects, isSupabaseConfigured } from './supabase';
import { searchMCPProjects, getRepositoryDetails } from './github';
import { parseProjectSlug } from './utils';

// 项目获取策略
export type ProjectFetchStrategy = 'database-first' | 'github-first' | 'database-only' | 'github-only';

// 项目服务配置
interface ProjectServiceConfig {
  strategy: ProjectFetchStrategy;
  fallbackEnabled: boolean;
  cacheTimeout: number; // 分钟
}

// 默认配置
const defaultConfig: ProjectServiceConfig = {
  strategy: 'database-first',
  fallbackEnabled: true,
  cacheTimeout: 60 // 1小时
};

// 项目获取结果
interface ProjectFetchResult {
  projects: ProcessedRepo[];
  source: 'database' | 'github' | 'hybrid';
  cached: boolean;
  timestamp: string;
  stats: {
    total: number;
    fromDatabase: number;
    fromGitHub: number;
  };
}

// 内存缓存
class ProjectCache {
  private static instance: ProjectCache;
  private cache = new Map<string, { data: ProcessedRepo[]; timestamp: number }>();
  private readonly CACHE_KEY = 'all_projects';

  static getInstance(): ProjectCache {
    if (!ProjectCache.instance) {
      ProjectCache.instance = new ProjectCache();
    }
    return ProjectCache.instance;
  }

  set(data: ProcessedRepo[]): void {
    this.cache.set(this.CACHE_KEY, {
      data,
      timestamp: Date.now()
    });
  }

  get(timeoutMinutes: number = 60): ProcessedRepo[] | null {
    const cached = this.cache.get(this.CACHE_KEY);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > timeoutMinutes * 60 * 1000;
    if (isExpired) {
      this.cache.delete(this.CACHE_KEY);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  isValid(timeoutMinutes: number = 60): boolean {
    const cached = this.cache.get(this.CACHE_KEY);
    if (!cached) return false;
    
    const isExpired = Date.now() - cached.timestamp > timeoutMinutes * 60 * 1000;
    return !isExpired;
  }
}

const projectCache = ProjectCache.getInstance();

// 主要的项目获取函数
export async function getProjects(config: Partial<ProjectServiceConfig> = {}): Promise<ProjectFetchResult> {
  const finalConfig = { ...defaultConfig, ...config };
  const timestamp = new Date().toISOString();
  
  console.log(`📦 获取项目 - 策略: ${finalConfig.strategy}`);

  // 检查内存缓存
  const cachedProjects = projectCache.get(finalConfig.cacheTimeout);
  if (cachedProjects && cachedProjects.length > 0) {
    console.log(`💾 使用缓存数据 (${cachedProjects.length} 个项目)`);
    
    // 计算缓存数据的实际最新更新时间
    const latestUpdateTime = cachedProjects.reduce((latest, project) => {
      const projectTime = new Date(project.updatedAt).getTime();
      return projectTime > latest ? projectTime : latest;
    }, 0);
    
    const actualTimestamp = latestUpdateTime > 0 ? new Date(latestUpdateTime).toISOString() : timestamp;
    
    return {
      projects: cachedProjects,
      source: 'database', // 缓存的数据通常来自数据库
      cached: true,
      timestamp: actualTimestamp,
      stats: {
        total: cachedProjects.length,
        fromDatabase: cachedProjects.length,
        fromGitHub: 0
      }
    };
  }

  try {
    switch (finalConfig.strategy) {
      case 'database-first':
        return await getDatabaseFirstProjects(finalConfig, timestamp);
      
      case 'github-first':
        return await getGitHubFirstProjects(finalConfig, timestamp);
      
      case 'database-only':
        return await getDatabaseOnlyProjects(timestamp);
      
      case 'github-only':
        return await getGitHubOnlyProjects(timestamp);
      
      default:
        return await getDatabaseFirstProjects(finalConfig, timestamp);
    }
  } catch (error) {
    console.error('获取项目时出错:', error);
    
    // 尝试从缓存获取过期数据作为最后备选
    const expiredCache = projectCache.get(Infinity); // 忽略过期时间
    if (expiredCache && expiredCache.length > 0) {
      console.log(`🚨 使用过期缓存数据作为备选 (${expiredCache.length} 个项目)`);
      return {
        projects: expiredCache,
        source: 'database',
        cached: true,
        timestamp,
        stats: {
          total: expiredCache.length,
          fromDatabase: expiredCache.length,
          fromGitHub: 0
        }
      };
    }

    // 如果所有方法都失败，返回空结果
    return {
      projects: [],
      source: 'database',
      cached: false,
      timestamp,
      stats: {
        total: 0,
        fromDatabase: 0,
        fromGitHub: 0
      }
    };
  }
}

// 数据库优先策略
async function getDatabaseFirstProjects(config: ProjectServiceConfig, timestamp: string): Promise<ProjectFetchResult> {
  try {
    console.log('🗄️ 优先从数据库获取项目...');
    
    // 检查数据库连接
    const dbConnected = await checkDatabaseConnection();
    if (!dbConnected) {
      throw new Error('数据库连接失败');
    }

    const dbProjects = await getAllProjects();
    
    if (dbProjects.length > 0) {
      console.log(`✅ 从数据库获取到 ${dbProjects.length} 个项目`);
      
      // 计算数据的实际最新更新时间
      const latestUpdateTime = dbProjects.reduce((latest, project) => {
        const projectTime = new Date(project.updatedAt).getTime();
        return projectTime > latest ? projectTime : latest;
      }, 0);
      
      const actualTimestamp = latestUpdateTime > 0 ? new Date(latestUpdateTime).toISOString() : timestamp;
      
      // 缓存结果
      projectCache.set(dbProjects);
      
      return {
        projects: dbProjects,
        source: 'database',
        cached: false,
        timestamp: actualTimestamp,
        stats: {
          total: dbProjects.length,
          fromDatabase: dbProjects.length,
          fromGitHub: 0
        }
      };
    }

    // 数据库为空，尝试从GitHub获取（如果启用备选）
    if (config.fallbackEnabled) {
      console.log('📡 数据库为空，回退到GitHub API...');
      return await getGitHubOnlyProjects(timestamp);
    } else {
      console.log('⚠️ 数据库为空且未启用备选方案');
      return {
        projects: [],
        source: 'database',
        cached: false,
        timestamp,
        stats: {
          total: 0,
          fromDatabase: 0,
          fromGitHub: 0
        }
      };
    }

  } catch (error) {
    console.error('从数据库获取项目失败:', error);
    
    if (config.fallbackEnabled) {
      console.log('🔄 回退到GitHub API...');
      return await getGitHubOnlyProjects(timestamp);
    }
    
    throw error;
  }
}

// GitHub优先策略
async function getGitHubFirstProjects(config: ProjectServiceConfig, timestamp: string): Promise<ProjectFetchResult> {
  try {
    // 构建时跳过 GitHub API 调用，避免验证 URL
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined) {
      console.log('🏗️ 构建时跳过GitHub API调用，返回空数据');
      return {
        projects: [],
        source: 'github',
        cached: false,
        timestamp,
        stats: {
          total: 0,
          fromDatabase: 0,
          fromGitHub: 0
        }
      };
    }
    
    console.log('📡 优先从GitHub API获取项目...');
    const githubProjects = await searchMCPProjects();
    
    if (githubProjects.length > 0) {
      console.log(`✅ 从GitHub获取到 ${githubProjects.length} 个项目`);
      
      // 尝试自动入库到Supabase (与定时器逻辑一致)
      let syncStats = { inserted: 0, updated: 0, skipped: 0 };
      if (isSupabaseConfigured()) {
        try {
          console.log('💾 自动将GitHub数据同步到数据库...');
          syncStats = await upsertProjects(githubProjects);
          console.log(`📊 入库统计: 新增 ${syncStats.inserted}, 更新 ${syncStats.updated}, 跳过 ${syncStats.skipped}`);
        } catch (syncError) {
          console.warn('⚠️ 自动入库失败，仅使用缓存:', syncError);
        }
      } else {
        console.log('⚠️ Supabase未配置，跳过自动入库');
      }
      
      // 缓存结果
      projectCache.set(githubProjects);
      
      return {
        projects: githubProjects,
        source: 'github',
        cached: false,
        timestamp,
        stats: {
          total: githubProjects.length,
          fromDatabase: 0,
          fromGitHub: githubProjects.length
        }
      };
    }

    // GitHub API失败，尝试从数据库获取（如果启用备选）
    if (config.fallbackEnabled) {
      console.log('🗄️ GitHub API为空，回退到数据库...');
      return await getDatabaseOnlyProjects(timestamp);
    } else {
      return {
        projects: [],
        source: 'github',
        cached: false,
        timestamp,
        stats: {
          total: 0,
          fromDatabase: 0,
          fromGitHub: 0
        }
      };
    }

  } catch (error) {
    console.error('从GitHub获取项目失败:', error);
    
    if (config.fallbackEnabled) {
      console.log('🔄 回退到数据库...');
      return await getDatabaseOnlyProjects(timestamp);
    }
    
    throw error;
  }
}

// 仅数据库策略
async function getDatabaseOnlyProjects(timestamp: string): Promise<ProjectFetchResult> {
  console.log('🗄️ 仅从数据库获取项目...');
  
  const dbProjects = await getAllProjects();
  
  // 计算数据的实际最新更新时间
  const latestUpdateTime = dbProjects.reduce((latest, project) => {
    const projectTime = new Date(project.updatedAt).getTime();
    return projectTime > latest ? projectTime : latest;
  }, 0);
  
  const actualTimestamp = latestUpdateTime > 0 ? new Date(latestUpdateTime).toISOString() : timestamp;
  
  // 缓存结果
  if (dbProjects.length > 0) {
    projectCache.set(dbProjects);
  }
  
  return {
    projects: dbProjects,
    source: 'database',
    cached: false,
    timestamp: actualTimestamp,
    stats: {
      total: dbProjects.length,
      fromDatabase: dbProjects.length,
      fromGitHub: 0
    }
  };
}

// 仅GitHub策略
async function getGitHubOnlyProjects(timestamp: string): Promise<ProjectFetchResult> {
  console.log('📡 仅从GitHub API获取项目...');
  
  const githubProjects = await searchMCPProjects();
  
  if (githubProjects.length > 0) {
    // 尝试自动入库到Supabase (与定时器逻辑一致)
    let syncStats = { inserted: 0, updated: 0, skipped: 0 };
    if (isSupabaseConfigured()) {
      try {
        console.log('💾 自动将GitHub数据同步到数据库...');
        syncStats = await upsertProjects(githubProjects);
        console.log(`📊 入库统计: 新增 ${syncStats.inserted}, 更新 ${syncStats.updated}, 跳过 ${syncStats.skipped}`);
      } catch (syncError) {
        console.warn('⚠️ 自动入库失败，仅使用缓存:', syncError);
      }
    } else {
      console.log('⚠️ Supabase未配置，跳过自动入库');
    }
    
    // 缓存结果
    projectCache.set(githubProjects);
  }
  
  return {
    projects: githubProjects,
    source: 'github',
    cached: false,
    timestamp,
    stats: {
      total: githubProjects.length,
      fromDatabase: 0,
      fromGitHub: githubProjects.length
    }
  };
}

// 获取单个项目详情（支持多种ID格式）
export async function getProjectDetails(identifier: string): Promise<ProcessedRepo | null> {
  try {
    console.log(`🔍 获取项目详情: ${identifier}`);
    
    // 解析标识符
    const parsed = parseProjectSlug(identifier);
    console.log('解析结果:', parsed);
    
    // 方法1: 优先从数据库获取（数字ID或slug格式）
    if (isSupabaseConfigured()) {
      console.log('🗄️ 优先从数据库获取项目详情...');
      
      let project = null;
      
      // 如果是数字ID，直接查询
      if (parsed.isNumericId) {
        project = await getProjectById(identifier);
      }
      
      // 如果有fullName，通过fullName查询
      if (!project && parsed.fullName) {
        const allProjects = await getAllProjects();
        project = allProjects.find(p => 
          p.fullName.toLowerCase() === parsed.fullName?.toLowerCase()
        );
      }
      
      // 如果有owner和name，组合查询
      if (!project && parsed.owner && parsed.name) {
        const allProjects = await getAllProjects();
        project = allProjects.find(p => 
          p.owner.toLowerCase() === parsed.owner?.toLowerCase() && 
          p.name.toLowerCase() === parsed.name?.toLowerCase()
        );
      }
      
      if (project) {
        console.log(`✅ 从数据库获取项目详情: ${project.name}`);
        
        // 检查项目数据完整性并修复
        const fixedProject = await ensureProjectDataIntegrity(project);
        return fixedProject;
      }
    }
    
    // 方法2: 如果数据库中没有找到，生成带有提示的演示项目
    console.log('📋 数据库中未找到项目，生成演示项目');
    return generateDemoProject(identifier, parsed);

  } catch (error) {
    console.error(`获取项目详情失败 (${identifier}):`, error);
    return null;
  }
}

// 确保项目数据完整性
async function ensureProjectDataIntegrity(project: ProcessedRepo): Promise<ProcessedRepo> {
  const fixes = [];
  
  // Check required fields
  if (!project.description) {
    project.description = 'This is an MCP-related project.';
    fixes.push('description');
  }
  
  if (!project.imageUrl) {
    project.imageUrl = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop';
    fixes.push('imageUrl');
  }
  
  if (!project.ownerAvatar) {
    project.ownerAvatar = 'https://avatars.githubusercontent.com/u/1?v=4';
    fixes.push('ownerAvatar');
  }
  
  if (!project.topics || project.topics.length === 0) {
    project.topics = ['mcp', 'model-context-protocol'];
    fixes.push('topics');
  }
  
  if (!project.relevance) {
    project.relevance = 'Medium';
    fixes.push('relevance');
  }
  
  // 如果缺少README内容，生成基本内容
  if (!project.readmeContent) {
    project.readmeContent = generateBasicReadme(project);
    fixes.push('readmeContent');
  }
  
  if (fixes.length > 0) {
    console.log(`🔧 修复项目数据字段: ${fixes.join(', ')} for ${project.name}`);
  }
  
  return project;
}

// 生成基本的README内容
function generateBasicReadme(project: ProcessedRepo): string {
  return `# ${project.name}

${project.description || 'This is an MCP-related project.'}

## Project Information

- **Owner**: ${project.owner}
- **Language**: ${project.language || 'Unknown'}
- **⭐ Stars**: ${project.stars}
- **🍴 Forks**: ${project.forks}

## Tags

${project.topics.map(topic => `- ${topic}`).join('\n')}

## Related Links

- [GitHub Repository](${project.url})
- [MCP Official Documentation](https://modelcontextprotocol.io)

## About Model Context Protocol

Model Context Protocol (MCP) is a protocol developed by Anthropic for building context management systems for large language models.

### Key Features

- 🤖 Intelligent context management
- 📊 Structured data processing
- 🔗 Model communication protocol
- ⚡ Efficient information transmission

### Use Cases

- Enhancing language model understanding capabilities
- Improving model response quality
- Building more effective AI applications

---

*This README is automatically generated by MCPHubs. For complete project information, please visit the [GitHub Repository](${project.url}).*
`;
}

// 生成演示项目
function generateDemoProject(identifier: string, parsed: any): ProcessedRepo {
  return {
    id: identifier,
    name: parsed.name || `Project-${identifier}`,
    fullName: parsed.fullName || `${parsed.owner || 'mcp-community'}/${parsed.name || identifier}`,
    owner: parsed.owner || 'mcp-community',
    ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    url: `https://github.com/${parsed.fullName || `mcp-community/${parsed.name || identifier}`}`,
    description: 'This is a demo page for an MCP-related project. To view real project data, please ensure the project has been synchronized to the database.',
    stars: Math.floor(Math.random() * 1000),
    forks: Math.floor(Math.random() * 100),
    language: 'Python',
    topics: ['mcp', 'model-context-protocol', 'demo'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    relevance: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
    readmeContent: `# ${parsed.name || identifier}

## ℹ️ Demo Project Information

This is a demo page showing how MCPHubs displays MCP-related projects.

### Current Status

- **Project ID**: ${identifier}
- **Parsed Format**: ${parsed.fullName || 'Unknown'}
- **Data Source**: Demo data

### Getting Real Data

To view real project information, please ensure:

1. The project has been added to the database through the sync system
2. Check if the project URL format is correct
3. Visit the [Admin Panel](/admin/sync) to manually sync the project

### Supported URL Formats

- \`/project/owner-projectname\` (Recommended SEO format)
- \`/project/owner/projectname\` (Traditional format)
- \`/project/123456\` (Numeric ID format)

### Related Links

- [Back to Project List](/)
- [Admin Panel](/admin/sync)
- [MCP Official Documentation](https://modelcontextprotocol.io)

---

*This is a demo page generated by MCPHubs. Real project data needs to be synchronized from GitHub to the database.*
`
  };
}

// 预热缓存
export async function warmupCache(): Promise<void> {
  try {
    console.log('🔥 预热项目缓存...');
    await getProjects({ strategy: 'database-first' });
    console.log('✅ 缓存预热完成');
  } catch (error) {
    console.error('缓存预热失败:', error);
  }
}

// 清除缓存
export function clearCache(): void {
  projectCache.clear();
  console.log('🗑️ 项目缓存已清除');
}

// 获取缓存状态
export function getCacheStatus(): {
  isValid: boolean;
  hasData: boolean;
  timestamp: number | null;
} {
  const cached = projectCache.get(Infinity);
  return {
    isValid: projectCache.isValid(),
    hasData: !!cached && cached.length > 0,
    timestamp: cached ? Date.now() : null
  };
} 