import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();
  const timestamp = now.toISOString();
  
  console.log(`🕐 Cron 测试端点被调用 - 时间: ${timestamp}`);
  
  return NextResponse.json({
    success: true,
    message: 'Cron 测试端点正常工作',
    timestamp,
    serverTime: now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    utcTime: now.toUTCString(),
    environment: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
    hasSyncApiKey: !!process.env.SYNC_API_KEY,
    hasGitHubToken: !!process.env.GITHUB_TOKEN
  });
}

export async function POST() {
  const now = new Date();
  const timestamp = now.toISOString();
  
  console.log(`🔄 Cron 测试端点 POST 请求 - 时间: ${timestamp}`);
  
  // 尝试调用同步 API
  try {
    const syncResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.SYNC_API_KEY || 'test-key'
      },
      body: JSON.stringify({
        source: 'cron-test',
        force: false,
        skipTimeWindow: true
      })
    });
    
    const syncResult = await syncResponse.json();
    
    return NextResponse.json({
      success: true,
      message: 'Cron 测试完成，同步 API 调用结果',
      timestamp,
      syncResult,
      environment: process.env.NODE_ENV
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Cron 测试失败',
      timestamp,
      error: error.message,
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}
