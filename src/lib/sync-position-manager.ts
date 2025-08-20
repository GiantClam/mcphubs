// 项目位置管理器
// 跟踪每次同步的起始位置，实现循环轮询

export interface SyncPosition {
  lastProcessedIndex: number; // 上次处理的最后一个项目索引
  totalProjects: number; // 总项目数量
  lastSyncTime: string; // 上次同步时间
  syncCount: number; // 同步次数
  isComplete: boolean; // 是否完成一轮循环
}

class SyncPositionManager {
  private static instance: SyncPositionManager;
  private currentPosition: SyncPosition = {
    lastProcessedIndex: -1,
    totalProjects: 0,
    lastSyncTime: new Date().toISOString(),
    syncCount: 0,
    isComplete: false
  };

  static getInstance(): SyncPositionManager {
    if (!SyncPositionManager.instance) {
      SyncPositionManager.instance = new SyncPositionManager();
    }
    return SyncPositionManager.instance;
  }

  // 获取当前同步位置
  getCurrentPosition(): SyncPosition {
    return { ...this.currentPosition };
  }

  // 更新同步位置
  updatePosition(processedCount: number, totalProjects: number): void {
    const newIndex = this.currentPosition.lastProcessedIndex + processedCount;
    
    // 检查是否完成一轮循环
    const isComplete = newIndex >= totalProjects - 1;
    
    // 如果完成一轮，重置到开始位置
    const finalIndex = isComplete ? -1 : newIndex;
    
    this.currentPosition = {
      lastProcessedIndex: finalIndex,
      totalProjects: totalProjects,
      lastSyncTime: new Date().toISOString(),
      syncCount: this.currentPosition.syncCount + 1,
      isComplete: isComplete
    };

    console.log(`🔄 同步位置更新: 处理了 ${processedCount} 个项目，当前位置: ${finalIndex + 1}/${totalProjects}，完成轮次: ${this.currentPosition.syncCount}`);
  }

  // 获取下次同步的起始位置
  getNextStartPosition(): number {
    return this.currentPosition.lastProcessedIndex + 1;
  }

  // 检查是否需要重新开始循环
  shouldRestartCycle(): boolean {
    return this.currentPosition.isComplete;
  }

  // 重置同步位置（强制从头开始）
  resetPosition(): void {
    this.currentPosition = {
      lastProcessedIndex: -1,
      totalProjects: 0,
      lastSyncTime: new Date().toISOString(),
      syncCount: 0,
      isComplete: false
    };
    console.log('🔄 同步位置已重置，下次将从第一个项目开始');
  }

  // 获取同步统计信息
  getSyncStats(): {
    currentPosition: number;
    totalProjects: number;
    progress: number;
    syncCount: number;
    lastSyncTime: string;
    isComplete: boolean;
  } {
    const progress = this.currentPosition.totalProjects > 0 
      ? Math.round(((this.currentPosition.lastProcessedIndex + 1) / this.currentPosition.totalProjects) * 100)
      : 0;

    return {
      currentPosition: this.currentPosition.lastProcessedIndex + 1,
      totalProjects: this.currentPosition.totalProjects,
      progress,
      syncCount: this.currentPosition.syncCount,
      lastSyncTime: this.currentPosition.lastSyncTime,
      isComplete: this.currentPosition.isComplete
    };
  }
}

export const syncPositionManager = SyncPositionManager.getInstance();
