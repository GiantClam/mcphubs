import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// 检查凭据文件是否存在
function checkCredentialsFile() {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (!credentialsPath) {
    console.error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set');
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
  } catch (error: any) {
    console.error(`Error checking credentials file: ${error.message}`);
    return false;
  }
}

// Vertex AI API 的基础 URL
const VERTEX_API_BASE_URL = 'https://us-central1-aiplatform.googleapis.com/v1';

// 处理所有 Vertex AI API 请求
export async function GET(request: NextRequest) {
  // 检查凭据文件
  const credentialsExist = checkCredentialsFile();
  
  if (!credentialsExist) {
    return NextResponse.json(
      { 
        error: 'Google Cloud credentials file not found',
        details: process.env.GOOGLE_APPLICATION_CREDENTIALS
      }, 
      { status: 500 }
    );
  }

  // 返回凭据状态和环境信息
  return NextResponse.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    credentials: {
      exists: true,
      path: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.VERTEX_LOCATION || process.env.GOOGLE_CLOUD_LOCATION
    }
  });
}

// 代理 Vertex AI API 请求
export async function POST(request: NextRequest) {
  // 检查凭据文件
  const credentialsExist = checkCredentialsFile();
  
  if (!credentialsExist) {
    return NextResponse.json(
      { error: 'Google Cloud credentials file not found' }, 
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
      console.log('Development API proxy test successful');
      return NextResponse.json({
        status: 'ok',
        message: 'Vertex AI API proxy is working',
        environment: process.env.NODE_ENV
      });
    }

    // 构建完整的 API URL
    const apiUrl = `${VERTEX_API_BASE_URL}${path}`;
    console.log(`Proxying request to: ${apiUrl}`);
    
    // 调用 Vertex AI API
    // 注意：这里需要处理身份验证，在实际应用中你可能需要使用 Google Cloud 客户端库
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        // 这里可以添加身份验证头部，如果需要的话
      }
    });
    
    // 返回 API 响应
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error proxying Vertex AI request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to proxy Vertex AI request',
        message: error.message,
        status: error.response?.status || 500
      }, 
      { status: error.response?.status || 500 }
    );
  }
} 