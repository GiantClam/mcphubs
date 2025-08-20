import { searchMCPProjects, searchMCPProjectsPaginated } from './github';
import { upsertProjects, getProjectStats, checkDatabaseConnection, supabase, type GitHubProject, isSupabaseConfigured } from './supabase';
import { ProcessedRepo } from './github';
import { syncPositionManager } from './sync-position-manager';

// 同步结果类型
export interface SyncResult {
  success: boolean;
  message: string;
  stats: {
    totalFetched: number;
    inserted: number;
    updated: number;
    skipped: number;
    errors: number;
  };
  duration: number; // 毫秒
  timestamp: string;
  errorDetails?: string[];
}

// 同步状态类型
export interface SyncStatus {
  isRunning: boolean;
  lastSync: SyncResult | null;
  nextScheduledSync: string | null;
}

// 全局同步状态管理
class SyncManager {
  private static instance: SyncManager;
  private isRunning = false;
  private lastSyncResult: SyncResult | null = null;

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  async performSync(force: boolean = false, batchSize: number = 30): Promise<SyncResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const errorDetails: string[] = [];

    // 检查是否已在运行
    if (this.isRunning && !force) {
      const result: SyncResult = {
        success: false,
        message: '同步任务已在运行中',
        stats: { totalFetched: 0, inserted: 0, updated: 0, skipped: 0, errors: 1 },
        duration: Date.now() - startTime,
        timestamp,
        errorDetails: ['同步任务已在运行中，请稍后再试']
      };
      return result;
    }

    this.isRunning = true;
    console.log(`🚀 开始智能循环GitHub项目同步任务 - ${timestamp}`);

    try {
      // 1. 检查数据库连接
      console.log('🔍 检查数据库连接...');
      const dbConnected = await checkDatabaseConnection();
      if (!dbConnected) {
        throw new Error('数据库连接失败');
      }
      console.log('✅ 数据库连接正常');

      // 2. 获取当前同步位置
      const currentPosition = syncPositionManager.getCurrentPosition();
      const startIndex = syncPositionManager.getNextStartPosition();
      
      // 计算当前进度
      const progress = currentPosition.totalProjects > 0 
        ? Math.round(((currentPosition.lastProcessedIndex + 1) / currentPosition.totalProjects) * 100)
        : 0;
      
      console.log(`📍 当前同步位置: ${startIndex + 1}，批次大小: ${batchSize}`);
      console.log(`📊 同步统计: 已完成 ${currentPosition.syncCount} 轮，进度: ${progress}%`);

      // 3. 从GitHub获取分页项目数据
      console.log('📡 从GitHub API获取分页项目数据...');
      const paginatedResult = await searchMCPProjectsPaginated(startIndex, batchSize);
      
      if (paginatedResult.projects.length === 0) {
        console.warn('⚠️ 未获取到任何项目数据');
        const result: SyncResult = {
          success: false,
          message: '未获取到任何项目数据',
          stats: { totalFetched: 0, inserted: 0, updated: 0, skipped: 0, errors: 1 },
          duration: Date.now() - startTime,
          timestamp,
          errorDetails: ['GitHub API未返回任何项目数据']
        };
        this.lastSyncResult = result;
        return result;
      }

      console.log(`✅ 成功获取 ${paginatedResult.projects.length} 个项目 (${startIndex + 1}-${paginatedResult.endIndex}/${paginatedResult.totalCount})`);

      // 4. 同步到数据库
      console.log('💾 开始同步数据到数据库...');
      const syncStats = await upsertProjects(paginatedResult.projects);

      // 5. 更新同步位置
      syncPositionManager.updatePosition(paginatedResult.projects.length, paginatedResult.totalCount);
      
      // 6. 获取更新后的统计信息
      console.log('📊 获取数据库统计信息...');
      const dbStats = await getProjectStats();

      const duration = Date.now() - startTime;
      const result: SyncResult = {
        success: true,
        message: `同步完成！获取 ${paginatedResult.projects.length} 个项目 (位置: ${startIndex + 1}-${paginatedResult.endIndex}/${paginatedResult.totalCount})，新增 ${syncStats.inserted} 个，更新 ${syncStats.updated} 个，跳过 ${syncStats.skipped} 个`,
        stats: {
          totalFetched: paginatedResult.projects.length,
          inserted: syncStats.inserted,
          updated: syncStats.updated,
          skipped: syncStats.skipped,
          errors: 0
        },
        duration,
        timestamp
      };

      console.log(`🎉 同步任务完成 - 耗时: ${duration}ms`);
      console.log(`📈 数据库统计: 总共 ${dbStats.total} 个项目`);
      
      this.lastSyncResult = result;
      return result;

    } catch (error: any) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      errorDetails.push(errorMessage);

      console.error('❌ 同步任务失败:', error);

      const result: SyncResult = {
        success: false,
        message: `同步失败: ${errorMessage}`,
        stats: { totalFetched: 0, inserted: 0, updated: 0, skipped: 0, errors: 1 },
        duration,
        timestamp,
        errorDetails
      };

      this.lastSyncResult = result;
      return result;

    } finally {
      this.isRunning = false;
    }
  }

  getSyncStatus(): SyncStatus {
    // 计算下一次定时同步时间（每天早上6点）
    const now = new Date();
    const nextSync = new Date(now);
    nextSync.setHours(6, 0, 0, 0);
    
    // 如果今天6点已过，设置为明天6点
    if (nextSync <= now) {
      nextSync.setDate(nextSync.getDate() + 1);
    }

    return {
      isRunning: this.isRunning,
      lastSync: this.lastSyncResult,
      nextScheduledSync: nextSync.toISOString()
    };
  }

  isCurrentlyRunning(): boolean {
    return this.isRunning;
  }

  getLastSyncResult(): SyncResult | null {
    return this.lastSyncResult;
  }
}

// 导出单例实例
export const syncManager = SyncManager.getInstance();

// 主要同步函数
export async function syncGitHubProjects(
  batchSize: number = 30, 
  forceSync: boolean = false
): Promise<SyncResult> {
  // 检查Supabase是否已正确配置
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ 警告: Supabase未配置，跳过数据库同步');
    return {
      success: false,
      message: 'Supabase configuration missing',
      stats: { totalFetched: 0, inserted: 0, updated: 0, skipped: 0, errors: 1 },
      duration: 0,
      timestamp: new Date().toISOString(),
      errorDetails: ['Supabase configuration missing']
    };
  }

  return await syncManager.performSync(forceSync, batchSize);
}

// 获取同步状态
export function getSyncStatus(): SyncStatus {
  return syncManager.getSyncStatus();
}

// 检查是否需要同步
export function shouldPerformSync(): boolean {
  const lastSync = syncManager.getLastSyncResult();
  
  // 如果从未同步过，则需要同步
  if (!lastSync) {
    return true;
  }

  // 如果上次同步失败，且距离上次尝试超过1小时，则重试
  if (!lastSync.success) {
    const lastSyncTime = new Date(lastSync.timestamp);
    const hoursSinceLastSync = (Date.now() - lastSyncTime.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastSync >= 1;
  }

  // 如果上次同步成功，检查是否超过24小时
  const lastSyncTime = new Date(lastSync.timestamp);
  const hoursSinceLastSync = (Date.now() - lastSyncTime.getTime()) / (1000 * 60 * 60);
  return hoursSinceLastSync >= 24;
}

// 验证同步时间窗口（只在北京时间早上6-8点之间执行定时同步）
export function isValidSyncWindow(): boolean {
  const now = new Date();
  // 转换为北京时间
  const beijingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  const hour = beijingTime.getUTCHours();
  
  // 只在早上6-8点之间执行定时同步
  return hour >= 6 && hour < 8;
}

// 格式化同步结果用于日志
export function formatSyncResult(result: SyncResult): string {
  const status = result.success ? '✅ 成功' : '❌ 失败';
  const duration = `${result.duration}ms`;
  const stats = `获取:${result.stats.totalFetched} 新增:${result.stats.inserted} 更新:${result.stats.updated} 跳过:${result.stats.skipped}`;
  
  return `${status} | ${duration} | ${stats} | ${result.message}`;
}

// 生成同步报告
export function generateSyncReport(result: SyncResult): {
  summary: string;
  details: string[];
  recommendations: string[];
} {
  const summary = result.success 
    ? `✅ 同步成功完成，共处理 ${result.stats.totalFetched} 个项目`
    : `❌ 同步失败: ${result.message}`;

  const details = [
    `⏱️ 执行时间: ${result.duration}ms`,
    `📊 统计信息:`,
    `  - 获取项目: ${result.stats.totalFetched}`,
    `  - 新增项目: ${result.stats.inserted}`,
    `  - 更新项目: ${result.stats.updated}`,
    `  - 跳过项目: ${result.stats.skipped}`,
    `  - 错误数量: ${result.stats.errors}`,
    `🕐 执行时间: ${new Date(result.timestamp).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
  ];

  if (result.errorDetails && result.errorDetails.length > 0) {
    details.push(`❌ 错误详情:`);
    result.errorDetails.forEach(error => details.push(`  - ${error}`));
  }

  const recommendations: string[] = [];
  
  if (!result.success) {
    recommendations.push('🔧 检查GitHub API配置和网络连接');
    recommendations.push('🔧 检查Supabase数据库连接');
    recommendations.push('🔧 查看服务器日志获取详细错误信息');
  } else {
    if (result.stats.totalFetched === 0) {
      recommendations.push('⚠️ 建议检查GitHub搜索查询是否需要调整');
    }
    if (result.duration > 30000) {
      recommendations.push('⚠️ 同步耗时较长，建议优化API调用或数据库操作');
    }
    if (result.stats.errors > 0) {
      recommendations.push('⚠️ 虽然整体成功，但有部分错误，建议检查日志');
    }
  }

  return { summary, details, recommendations };
} 