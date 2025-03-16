import { NextRequest, NextResponse } from 'next/server';

// 构建 Vertex AI 选项，根据环境添加代理
function getVertexAIOptions() {
  // 基础配置
  const baseOptions = {
    modelName: "gemini-pro",
    temperature: 0,
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.VERTEX_LOCATION || process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
  };

  // 在开发环境中添加代理配置
  if (process.env.NODE_ENV === 'development') {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    return {
      ...baseOptions,
      apiEndpoint: `${baseUrl}/api/vertex`,
    };
  }

  return baseOptions;
}

export async function GET() {
  const options = getVertexAIOptions();
  
  return NextResponse.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    vertexConfig: {
      ...options,
      // 移除敏感信息的属性，此处没有apiKey
    },
    message: process.env.NODE_ENV === 'development' 
      ? 'Using proxy configuration for Vertex AI'
      : 'Using direct connection to Vertex AI'
  });
} 