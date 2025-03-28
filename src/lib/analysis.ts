import { ChatVertexAI } from "@langchain/google-vertexai";
import { ProcessedRepo } from "./github";

interface AnalysisResult {
  relevanceScore: number; // 0-100的得分
  relevanceCategory: 'High' | 'Medium' | 'Related';
  summary: string;
  keyFeatures: string[];
  useCases: string[];
}

// 从环境变量或文件获取Google凭据
function getGoogleCredentials() {
  // 优先使用环境变量中的JSON凭据（Vercel部署方式）
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    try {
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      console.log('Using Google credentials from environment variable');
      return { credentials };
    } catch (error) {
      console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:", error);
    }
  }
  
  // 回退到文件路径方式（本地开发环境）
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log('Using Google credentials from file path');
    return {
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    };
  }
  
  console.warn('No Google credentials found');
  return {};
}

// 构建 Vertex AI 选项，根据环境添加代理和凭据
function getVertexAIOptions() {
  // 基础配置
  const baseOptions = {
    modelName: "gemini-pro", // Google 的 Gemini Pro 模型
    temperature: 0,
    // Vertex AI 项目配置
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.VERTEX_LOCATION || process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
    ...getGoogleCredentials() // 添加凭据配置
  };

  // 在开发环境中添加代理配置
  if (process.env.NODE_ENV === 'development') {
    console.log('Using development proxy for Vertex AI');
    // 使用当前网站的域名作为基础 URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    
    return {
      ...baseOptions,
      apiEndpoint: `${baseUrl}/api/vertex`, // 使用完整的 URL 代理
    };
  }

  // 在生产环境中直接使用 Google API
  console.log('Using direct Google API connection for Vertex AI in production');
  return baseOptions;
}

// 初始化 Vertex AI 模型
const model = new ChatVertexAI(getVertexAIOptions());

// 分析项目内容，评估与MCP的相关性
export async function analyzeProjectRelevance(
  repo: ProcessedRepo
): Promise<AnalysisResult> {
  // 检查是否有 Google Vertex AI 凭证
  if (!process.env.GOOGLE_CLOUD_PROJECT || 
      (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)) {
    console.warn("No Google Vertex AI credentials found. Skipping AI analysis.");
    return getDefaultAnalysis(repo);
  }

  try {
    // 准备分析内容
    const content = `
    Repository Name: ${repo.name}
    Description: ${repo.description}
    Topics: ${repo.topics.join(", ")}
    README Content: ${repo.readmeContent || "Not available"}
    `;

    // 构建提示
    const prompt = `
    You are an expert in AI and language model technologies, specifically the Model Context Protocol (MCP) 
    developed by Anthropic. The MCP is a protocol for structuring the context given to LLMs to improve their comprehension and responses.
    
    Please analyze the following GitHub repository information and determine how relevant it is to the Model Context Protocol:
    
    ${content}
    
    Please provide the following in JSON format:
    1. relevanceScore: A score from 0-100 indicating how relevant this project is to MCP
    2. relevanceCategory: One of ["High", "Medium", "Related"] based on the score
    3. summary: A brief summary of the project and its relation to MCP (100 words max)
    4. keyFeatures: List of key features of this project related to MCP (up to 5 points)
    5. useCases: List of potential use cases for this project (up to 3 points)
    `;

    // 调用 Gemini 进行分析
    const response = await model.invoke(prompt);
    const responseText = response.content.toString();
    
    // 尝试解析JSON响应
    try {
      // Gemini 有时可能返回带有反引号的 JSON 字符串，需要处理一下
      const jsonContent = responseText.replace(/```json\s*|\s*```/g, '');
      const result = JSON.parse(jsonContent);
      
      return {
        relevanceScore: result.relevanceScore || 50,
        relevanceCategory: result.relevanceCategory || 'Medium',
        summary: result.summary || `Analysis of ${repo.name}`,
        keyFeatures: result.keyFeatures || ["Feature analysis not available"],
        useCases: result.useCases || ["Use case analysis not available"],
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return getDefaultAnalysis(repo);
    }
  } catch (error) {
    console.error("Error during AI analysis:", error);
    return getDefaultAnalysis(repo);
  }
}

// 根据仓库属性生成默认分析结果
function getDefaultAnalysis(repo: ProcessedRepo): AnalysisResult {
  // 根据简单规则确定相关性
  let relevanceScore = 50;
  let category: 'High' | 'Medium' | 'Related' = 'Medium';
  
  if (repo.relevance === 'High') {
    relevanceScore = 85;
    category = 'High';
  } else if (repo.relevance === 'Medium') {
    relevanceScore = 60;
    category = 'Medium';
  } else {
    relevanceScore = 40;
    category = 'Related';
  }

  return {
    relevanceScore,
    relevanceCategory: category,
    summary: `${repo.name} is a ${category.toLowerCase()} relevance project related to Model Context Protocol. It has ${repo.stars} stars and ${repo.forks} forks on GitHub.`,
    keyFeatures: [
      "MCP integration capabilities",
      "AI context management",
      "Language model communication",
      "Structured data processing"
    ],
    useCases: [
      "Enhancing LLM context handling",
      "Improving model response quality",
      "Building more effective AI applications"
    ]
  };
} 