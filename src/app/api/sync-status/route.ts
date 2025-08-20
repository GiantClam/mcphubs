import { NextRequest, NextResponse } from 'next/server';
import { getSyncStatus } from '@/lib/sync-service';
import { syncPositionManager } from '@/lib/sync-position-manager';

// 获取智能同步状态 (GET)
export async function GET(request: NextRequest) {
  try {
    const syncStatus = getSyncStatus();
    const positionStats = syncPositionManager.getSyncStats();
    
    return NextResponse.json({
      success: true,
      data: {
        syncStatus,
        positionStats,
        nextSyncTime: syncStatus.nextScheduledSync,
        currentTime: new Date().toISOString(),
        beijingTime: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('获取智能同步状态失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '获取智能同步状态失败' 
      },
      { status: 500 }
    );
  }
}

// 重置同步位置 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || 'status';
    
    if (action === 'reset') {
      syncPositionManager.resetPosition();
      return NextResponse.json({
        success: true,
        message: '同步位置已重置，下次将从第一个项目开始',
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json({
      success: false,
      message: '无效的操作',
      timestamp: new Date().toISOString()
    }, { status: 400 });

  } catch (error: any) {
    console.error('重置同步位置失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '重置同步位置失败' 
      },
      { status: 500 }
    );
  }
}
