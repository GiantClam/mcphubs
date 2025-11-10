import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import axios, { AxiosError } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

// 检查Google凭据是否可用
function checkCredentials() {
  // 首先检查环境变量中的JSON凭据（Vercel部署方式）
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    try {
      JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      console.log('Vercel deployment: Using Google credentials from environment variable');
      return true;
    } catch (error: unknown) {
      console.error('Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }
  
  // 然后检查文件系统凭据（本地开发方式）
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (!credentialsPath) {
    console.error('No Google credentials found (neither JSON nor file path)');
    return false;
  }

  // 如果路径是相对路径，转换为绝对路径
  const absolutePath = credentialsPath.startsWith('.')
    ? path.resolve(process.cwd(), credentialsPath)
    : credentialsPath;

  try {
    // 检查文件是否存在
    const stats = fs.statSync(absolutePath);
    if (!stats.isFile()) {
      console.error(`The file at ${absolutePath} is not a file`);
      return false;
    }
    return true;
  } catch (error: unknown) {
    console.error(`Error checking credentials file: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// 获取凭据信息以显示在状态响应中
function getCredentialsInfo() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    return {
      exists: true,
      type: 'environment-variable',
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.VERTEX_LOCATION || process.env.GOOGLE_CLOUD_LOCATION
    };
  }
  
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return {
      exists: true,
      type: 'file-path',
      path: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.VERTEX_LOCATION || process.env.GOOGLE_CLOUD_LOCATION
    };
  }
  
  return {
    exists: false,
    type: 'none'
  };
}

// Vertex AI API 的基础 URL
const VERTEX_API_BASE_URL = 'https://us-central1-aiplatform.googleapis.com/v1';

// 处理所有 Vertex AI API 请求
export async function GET() {
  // 检查凭据
  const credentialsExist = checkCredentials();
  
  if (!credentialsExist) {
    return NextResponse.json(
      { 
        error: 'Google Cloud credentials not found or invalid',
        details: getCredentialsInfo()
      }, 
      { status: 500 }
    );
  }

  // 返回凭据状态和环境信息
  return NextResponse.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    credentials: getCredentialsInfo(),
    deploymentPlatform: process.env.VERCEL ? 'Vercel' : 'Other'
  });
}

// 代理 Vertex AI API 请求
export async function POST(request: NextRequest) {
  // 检查凭据
  const credentialsExist = checkCredentials();
  
  if (!credentialsExist) {
    return NextResponse.json(
      { error: 'Google Cloud credentials not found or invalid' }, 
      { status: 500 }
    );
  }

  try {
    // 解析请求体
    const requestData = await request.json();

    // 从请求 URL 获取路径
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api\/vertex/, '');
    
    // 如果路径为空，返回默认响应
    if (!path || path === '/' || path === '') {
      console.log('API proxy test successful');
      return NextResponse.json({
        status: 'ok',
        message: 'Vertex AI API endpoint is working',
        environment: process.env.NODE_ENV,
        credentials: getCredentialsInfo()
      });
    }

    // 构建完整的 API URL
    const apiUrl = `${VERTEX_API_BASE_URL}${path}`;
    console.log(`Proxying request to: ${apiUrl}`);
    
    // 调用 Vertex AI API
    // 注意：在实际应用中应该使用Google Cloud认证
    const axiosConfig: any = {
      headers: {
        'Content-Type': 'application/json',
        // 身份验证会由Google客户端库自动处理
      }
    };
    
    // 添加代理支持（如果配置了 PROXY_HOST 和 PROXY_PORT）
    const PROXY_HOST = process.env.PROXY_HOST;
    const PROXY_PORT = process.env.PROXY_PORT;
    if (PROXY_HOST && PROXY_PORT && HttpsProxyAgent) {
      try {
        const proxyAgent = new HttpsProxyAgent(`http://${PROXY_HOST}:${PROXY_PORT}`);
        axiosConfig.httpsAgent = proxyAgent;
        console.log(`🌐 Using proxy for Vertex AI API: ${PROXY_HOST}:${PROXY_PORT}`);
      } catch (error) {
        console.warn(`⚠️ Failed to create proxy agent for Vertex AI: ${error}`);
      }
    }
    
    const response = await axios.post(apiUrl, requestData, axiosConfig);
    
    // 返回 API 响应
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('Error handling Vertex AI request:', error);
    
    // 处理Axios错误
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return NextResponse.json(
        { 
          error: 'Failed to handle Vertex AI request',
          message: axiosError.message,
          status: axiosError.response?.status || 500
        }, 
        { status: axiosError.response?.status || 500 }
      );
    }
    
    // 处理其他错误
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        error: 'Failed to handle Vertex AI request',
        message: errorMessage,
        status: 500
      }, 
      { status: 500 }
    );
  }
} 