import { syncGitHubProjects, isValidSyncWindow } from './sync-service';

// 启动状态跟踪
let isStartupSyncTriggered = false;
let isStartupSyncRunning = false;

// 启动时的同步配置
interface StartupSyncConfig {
  forceSync?: boolean;
  skipTimeWindow?: boolean;
  delay?: number; // 延迟启动时间（毫秒）
}

/**
 * 项目启动时触发同步任务
 * 该函数会在后台异步执行，不阻塞应用启动
 */
export async function triggerStartupSync(config: StartupSyncConfig = {}) {
  // 避免重复触发
  if (isStartupSyncTriggered) {
    console.log('🔄 启动同步已触发，跳过重复执行');
    return;
  }

  isStartupSyncTriggered = true;
  
  const {
    forceSync = false,
    skipTimeWindow = true, // 启动时默认跳过时间窗口限制
    delay = 5000 // 默认延迟5秒，确保应用完全启动
  } = config;

  console.log('🚀 准备触发启动同步任务...');

  // 延迟执行，不阻塞应用启动
  setTimeout(async () => {
    try {
      isStartupSyncRunning = true;
      console.log('🔄 开始执行启动同步任务');
      
      // 检查时间窗口（除非明确跳过）
      if (!skipTimeWindow && !isValidSyncWindow()) {
        console.log('⏰ 当前不在同步时间窗口内，跳过启动同步');
        return;
      }

      // 执行同步任务
      const result = await syncGitHubProjects(50, forceSync);
      
      if (result.success) {
        console.log(`✅ 启动同步完成: ${result.message}`);
        console.log(`📊 统计: 获取${result.stats.totalFetched} 新增${result.stats.inserted} 更新${result.stats.updated} 跳过${result.stats.skipped}`);
      } else {
        console.warn(`⚠️ 启动同步失败: ${result.message}`);
      }

    } catch (error) {
      console.error('❌ 启动同步任务出错:', error);
    } finally {
      isStartupSyncRunning = false;
      console.log('🏁 启动同步任务结束');
    }
  }, delay);

  console.log(`⏱️ 启动同步任务已安排，将在 ${delay}ms 后执行`);
}

/**
 * 获取启动同步状态
 */
export function getStartupSyncStatus() {
  return {
    triggered: isStartupSyncTriggered,
    running: isStartupSyncRunning,
    lastTriggered: isStartupSyncTriggered ? new Date().toISOString() : null
  };
}

/**
 * 重置启动同步状态（用于测试）
 */
export function resetStartupSyncStatus() {
  isStartupSyncTriggered = false;
  isStartupSyncRunning = false;
  console.log('🔄 启动同步状态已重置');
}

/**
 * 手动触发启动同步（强制模式）
 */
export async function forceStartupSync() {
  console.log('🚀 手动触发启动同步（强制模式）');
  
  // 重置状态，允许重新触发
  isStartupSyncTriggered = false;
  
  // 立即执行同步，跳过延迟
  await triggerStartupSync({
    forceSync: true,
    skipTimeWindow: true,
    delay: 0
  });
}

/**
 * 后台异步同步任务
 * 专门用于处理耗时的 Gemini 分析任务
 */
export async function backgroundSyncWithAnalysis() {
  try {
    console.log('🧠 开始后台智能分析同步...');
    
    // 使用强制模式，确保包含 Gemini 分析
    const result = await syncGitHubProjects(20, true); // 减少批次大小，避免超时
    
    if (result.success) {
      console.log(`🎯 智能分析同步完成: ${result.message}`);
    } else {
      console.warn(`⚠️ 智能分析同步失败: ${result.message}`);
    }
    
    return result;
  } catch (error) {
    console.error('❌ 后台智能分析同步出错:', error);
    throw error;
  }
} 