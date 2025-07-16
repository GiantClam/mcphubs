import { ProcessedRepo } from './github';
import { getAllProjects, getProjectById, checkDatabaseConnection } from './supabase';
import { searchMCPProjects, getRepositoryDetails } from './github';

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
    return {
      projects: cachedProjects,
      source: 'database', // 缓存的数据通常来自数据库
      cached: true,
      timestamp,
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
      
      // 缓存结果
      projectCache.set(dbProjects);
      
      return {
        projects: dbProjects,
        source: 'database',
        cached: false,
        timestamp,
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
    console.log('📡 优先从GitHub API获取项目...');
    const githubProjects = await searchMCPProjects();
    
    if (githubProjects.length > 0) {
      console.log(`✅ 从GitHub获取到 ${githubProjects.length} 个项目`);
      
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
  
  // 缓存结果
  if (dbProjects.length > 0) {
    projectCache.set(dbProjects);
  }
  
  return {
    projects: dbProjects,
    source: 'database',
    cached: false,
    timestamp,
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
  
  // 缓存结果
  if (githubProjects.length > 0) {
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

// 获取单个项目详情（优先数据库）
export async function getProjectDetails(id: string): Promise<ProcessedRepo | null> {
  try {
    console.log(`🔍 获取项目详情: ${id}`);
    
    // 优先从数据库获取
    let project = await getProjectById(id);
    
    if (project) {
      console.log(`✅ 从数据库获取项目详情: ${project.name}`);
      return project;
    }

    // 数据库中没有，尝试从GitHub获取
    console.log('📡 数据库中未找到，尝试从GitHub获取...');
    project = await getRepositoryDetails(id);
    
    if (project) {
      console.log(`✅ 从GitHub获取项目详情: ${project.name}`);
    }
    
    return project;

  } catch (error) {
    console.error(`获取项目详情失败 (${id}):`, error);
    return null;
  }
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