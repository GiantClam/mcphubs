import { NextRequest, NextResponse } from 'next/server';
import { 
  syncGitHubProjects, 
  getSyncStatus, 
  shouldPerformSync, 
  isValidSyncWindow,
  formatSyncResult,
  generateSyncReport,
  type SyncResult 
} from '@/lib/sync-service';

// 验证API密钥（用于安全保护）
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || request.nextUrl.searchParams.get('key');
  const validKey = process.env.SYNC_API_KEY;
  
  // 如果没有设置环境变量，拒绝访问
  if (!validKey) {
    console.error('🚨 安全警告: SYNC_API_KEY 环境变量未设置，拒绝同步请求');
    return false;
  }
  
  return apiKey === validKey;
}

// 获取同步状态 (GET)
export async function GET(request: NextRequest) {
  try {
    // 验证API密钥
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API key' },
        { status: 401 }
      );
    }

    const status = getSyncStatus();
    
    return NextResponse.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('获取同步状态失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '获取同步状态失败' 
      },
      { status: 500 }
    );
  }
}

// 执行同步任务 (POST)
export async function POST(request: NextRequest) {
  try {
    // 验证API密钥
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API key' },
        { status: 401 }
      );
    }

    // 解析请求参数
    const body = await request.json().catch(() => ({}));
    const force = body.force === true;
    const skipTimeWindow = body.skipTimeWindow === true;
    const source = body.source || 'manual'; // manual, cron, auto
    const fastMode = body.fastMode === true; // 快速同步模式

    console.log(`🔄 收到同步请求 - 来源: ${source}, 强制: ${force}, 跳过时间窗口: ${skipTimeWindow}, 快速模式: ${fastMode}`);

    // 检查时间窗口（除非是手动强制或明确跳过）
    if (!force && !skipTimeWindow && source === 'cron' && !isValidSyncWindow()) {
      const message = '当前不在同步时间窗口内（北京时间6-8点）';
      console.log(`⏰ ${message}`);
      return NextResponse.json({
        success: false,
        message,
        skipped: true,
        timestamp: new Date().toISOString()
      });
    }

    // 检查是否需要同步（除非强制执行）
    if (!force && source !== 'manual' && !shouldPerformSync()) {
      const message = '无需同步，数据已是最新';
      console.log(`⏭️ ${message}`);
      return NextResponse.json({
        success: true,
        message,
        skipped: true,
        timestamp: new Date().toISOString()
      });
    }

    // 执行同步
    console.log(`🚀 开始执行同步任务...${fastMode ? ' (快速模式)' : ''}`);
    
    // 快速模式：减少项目数量和处理时间
    const projectLimit = fastMode ? 20 : 50;
    const result: SyncResult = await syncGitHubProjects(projectLimit, force);
    
    // 格式化结果用于日志
    const logMessage = formatSyncResult(result);
    console.log(`📝 同步结果: ${logMessage}`);

    // 生成详细报告
    const report = generateSyncReport(result);
    
    // 返回结果
    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: {
        result,
        report,
        source,
        fastMode,
        projectLimit
      },
      timestamp: new Date().toISOString()
    }, { 
      status: result.success ? 200 : 500 
    });

  } catch (error: any) {
    console.error('执行同步任务失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '执行同步任务失败',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// 健康检查 (HEAD)
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
} 