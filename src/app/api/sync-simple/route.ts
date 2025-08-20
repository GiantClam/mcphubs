import { NextRequest, NextResponse } from 'next/server';

// 简化的同步函数，用于测试 Cron 是否正常工作
export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    console.log(`🧪 简化同步测试 - 时间: ${timestamp}`);
    
    // 模拟一些简单的处理
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const duration = Date.now() - startTime;
    
    const result = {
      success: true,
      message: '简化同步测试成功',
      data: {
        timestamp,
        duration: `${duration}ms`,
        testData: {
          message: '这是一个测试同步任务',
          randomNumber: Math.floor(Math.random() * 1000),
          serverTime: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
          environment: process.env.NODE_ENV,
          hasGitHubToken: !!process.env.GITHUB_TOKEN,
          hasSyncApiKey: !!process.env.SYNC_API_KEY
        }
      }
    };
    
    console.log(`✅ 简化同步测试完成 - 耗时: ${duration}ms`);
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('简化同步测试失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '简化同步测试失败',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// 健康检查
export async function GET() {
  return NextResponse.json({
    success: true,
    message: '简化同步端点正常工作',
    timestamp: new Date().toISOString()
  });
}
