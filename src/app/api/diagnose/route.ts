import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/supabase';

interface DiagnosticResult {
  timestamp: string;
  environment: string;
  checks: {
    environmentVariables: {
      status: 'pass' | 'fail';
      details: Record<string, boolean>;
      missing: string[];
    };
    supabaseConnection: {
      status: 'pass' | 'fail';
      message: string;
      details?: any;
    };
    githubToken: {
      status: 'pass' | 'fail';
      message: string;
      details?: any;
    };
    projectRetrieval: {
      status: 'pass' | 'fail';
      message: string;
      details?: any;
    };
  };
  summary: {
    overallStatus: 'healthy' | 'issues' | 'critical';
    message: string;
    recommendations: string[];
  };
}

async function testGitHubAPI() {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    return {
      status: 'fail' as const,
      message: 'GitHub Token 未配置',
      details: null
    };
  }

  try {
    // 测试基本API访问
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'mcphubs-diagnostic/1.0'
      }
    });

    if (!response.ok) {
      return {
        status: 'fail' as const,
        message: `GitHub API 请求失败: ${response.status}`,
        details: {
          status: response.status,
          statusText: response.statusText
        }
      };
    }

    const userData = await response.json();

    // 测试速率限制
    const rateResponse = await fetch('https://api.github.com/rate_limit', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const rateData = await rateResponse.json();

    return {
      status: 'pass' as const,
      message: `GitHub API 连接成功 (用户: ${userData.login})`,
      details: {
        user: userData.login,
        rateLimit: rateData.rate,
        remaining: rateData.rate.remaining,
        limit: rateData.rate.limit
      }
    };

  } catch (error) {
    return {
      status: 'fail' as const,
      message: `GitHub API 连接异常: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error: error instanceof Error ? error.message : String(error) }
    };
  }
}

async function testProjectRetrieval() {
  try {
    // 尝试获取项目（使用内部 API）
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/projects`, {
      method: 'GET',
      headers: {
        'User-Agent': 'mcphubs-diagnostic/1.0'
      }
    });

    if (!response.ok) {
      return {
        status: 'fail' as const,
        message: `项目获取API失败: ${response.status}`,
        details: {
          status: response.status,
          statusText: response.statusText
        }
      };
    }

    const data = await response.json();
    
    return {
      status: 'pass' as const,
      message: `项目获取成功: ${data.projects?.length || 0} 个项目`,
      details: {
        projectCount: data.projects?.length || 0,
        source: data.source,
        cached: data.cached,
        stats: data.stats
      }
    };

  } catch (error) {
    return {
      status: 'fail' as const,
      message: `项目获取异常: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error: error instanceof Error ? error.message : String(error) }
    };
  }
}

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();
  const environment = process.env.NODE_ENV || 'unknown';

  // 1. 检查环境变量
  const requiredEnvVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'GITHUB_TOKEN': process.env.GITHUB_TOKEN,
    'SYNC_API_KEY': process.env.SYNC_API_KEY,
    'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET
  };

  const envVarDetails: Record<string, boolean> = {};
  const missingVars: string[] = [];

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    const isConfigured = !!(value && 
      !value.includes('placeholder') && 
      !value.includes('your-') && 
      !value.includes('generate-') &&
      value.length > 10 // 基本长度检查
    );
    
    envVarDetails[key] = isConfigured;
    if (!isConfigured) {
      missingVars.push(key);
    }
  }

  const envVarsPass = missingVars.length === 0;

  // 2. 测试 Supabase 连接
  let supabaseResult;
  try {
    const isConnected = await checkDatabaseConnection();
    supabaseResult = {
      status: isConnected ? 'pass' as const : 'fail' as const,
      message: isConnected ? 'Supabase 数据库连接成功' : 'Supabase 数据库连接失败',
      details: { connected: isConnected }
    };
  } catch (error) {
    supabaseResult = {
      status: 'fail' as const,
      message: `Supabase 连接测试异常: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error: error instanceof Error ? error.message : String(error) }
    };
  }

  // 3. 测试 GitHub API
  const githubResult = await testGitHubAPI();

  // 4. 测试项目获取
  const projectResult = await testProjectRetrieval();

  // 5. 生成总结
  const passedChecks = [
    envVarsPass,
    supabaseResult.status === 'pass',
    githubResult.status === 'pass',
    projectResult.status === 'pass'
  ].filter(Boolean).length;

  let overallStatus: 'healthy' | 'issues' | 'critical';
  let summaryMessage: string;
  const recommendations: string[] = [];

  if (passedChecks === 4) {
    overallStatus = 'healthy';
    summaryMessage = '所有系统检查都通过了！';
  } else if (passedChecks >= 2) {
    overallStatus = 'issues';
    summaryMessage = `发现 ${4 - passedChecks} 个问题需要解决`;
  } else {
    overallStatus = 'critical';
    summaryMessage = '发现多个关键问题，系统可能无法正常工作';
  }

  // 生成建议
  if (!envVarsPass) {
    recommendations.push('检查并配置缺失的环境变量');
  }
  if (supabaseResult.status === 'fail') {
    recommendations.push('验证 Supabase 配置和数据库表结构');
  }
  if (githubResult.status === 'fail') {
    recommendations.push('检查 GitHub Token 的有效性和权限');
  }
  if (projectResult.status === 'fail') {
    recommendations.push('检查项目获取API的工作状态');
  }

  if (passedChecks === 4) {
    recommendations.push('系统运行正常，如果仍有问题可能是缓存导致的，尝试重新部署');
  }

  const result: DiagnosticResult = {
    timestamp,
    environment,
    checks: {
      environmentVariables: {
        status: envVarsPass ? 'pass' : 'fail',
        details: envVarDetails,
        missing: missingVars
      },
      supabaseConnection: supabaseResult,
      githubToken: githubResult,
      projectRetrieval: projectResult
    },
    summary: {
      overallStatus,
      message: summaryMessage,
      recommendations
    }
  };

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  });
} 