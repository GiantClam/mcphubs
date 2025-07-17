import { NextRequest, NextResponse } from 'next/server';
import { 
  getStartupSyncStatus, 
  forceStartupSync, 
  resetStartupSyncStatus,
  backgroundSyncWithAnalysis 
} from '@/lib/startup-sync';

// 获取启动同步状态 (GET)
export async function GET(request: NextRequest) {
  try {
    const status = getStartupSyncStatus();
    
    return NextResponse.json({
      success: true,
      data: {
        ...status,
        serverTime: new Date().toISOString(),
        message: status.running ? '启动同步正在进行中' : 
                status.triggered ? '启动同步已完成' : '启动同步未触发'
      }
    });
  } catch (error: any) {
    console.error('获取启动同步状态失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '获取状态失败'
    }, { status: 500 });
  }
}

// 手动控制启动同步 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, apiKey } = body;
    
    // 验证API密钥（如果提供）
    const expectedApiKey = process.env.SYNC_API_KEY;
    if (expectedApiKey && apiKey !== expectedApiKey) {
      return NextResponse.json({
        success: false,
        error: 'Invalid API key'
      }, { status: 401 });
    }
    
    let result;
    
    switch (action) {
      case 'force':
        console.log('🚀 手动触发强制启动同步');
        await forceStartupSync();
        result = {
          action: 'force',
          message: '强制启动同步已触发',
          status: getStartupSyncStatus()
        };
        break;
        
      case 'reset':
        console.log('🔄 重置启动同步状态');
        resetStartupSyncStatus();
        result = {
          action: 'reset',
          message: '启动同步状态已重置',
          status: getStartupSyncStatus()
        };
        break;
        
      case 'analysis':
        console.log('🧠 触发后台智能分析同步');
        const analysisResult = await backgroundSyncWithAnalysis();
        result = {
          action: 'analysis',
          message: '智能分析同步已完成',
          syncResult: analysisResult,
          status: getStartupSyncStatus()
        };
        break;
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: force, reset, analysis'
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error: any) {
    console.error('启动同步操作失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '操作失败'
    }, { status: 500 });
  }
}

// 删除启动同步状态 (DELETE)
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get('apiKey');
    
    // 验证API密钥
    const expectedApiKey = process.env.SYNC_API_KEY;
    if (expectedApiKey && apiKey !== expectedApiKey) {
      return NextResponse.json({
        success: false,
        error: 'Invalid API key'
      }, { status: 401 });
    }
    
    resetStartupSyncStatus();
    
    return NextResponse.json({
      success: true,
      message: '启动同步状态已清除',
      status: getStartupSyncStatus()
    });
    
  } catch (error: any) {
    console.error('清除启动同步状态失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '清除失败'
    }, { status: 500 });
  }
} 