import { ChatVertexAI } from "@langchain/google-vertexai";
import { ProcessedRepo } from "./github";

interface AnalysisResult {
  relevanceScore: number; // Score from 0-100
  relevanceCategory: 'High' | 'Medium' | 'Related';
  summary: string;
  keyFeatures: string[];
  useCases: string[];
  // 新增结构化字段
  projectType: 'Server' | 'Client' | 'Library' | 'Tool' | 'Example' | 'Unknown';
  coreFeatures: string[]; // 核心特性：工具发现、流式输出、函数调用等
  techStack: string[]; // 技术栈：Python, TypeScript, Go等
  compatibility: string[]; // 兼容的LLM模型：GPT-4, Claude 3等
  installCommand?: string; // 安装命令
  quickStartCode?: string; // 最小化代码示例
  documentationUrl?: string; // 文档链接
  serverEndpoint?: string; // 如果是服务器，提供端点
  clientCapabilities?: string[]; // 客户端能力
}

// Get Google credentials from environment variables or file
function getGoogleCredentials() {
  // Prioritize JSON credentials from environment variables (Vercel deployment)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    try {
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      console.log('Using Google credentials from environment variable');
      return { credentials };
    } catch (error) {
      console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:", error);
    }
  }
  
  // Fallback to file path method (local development environment)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log('Using Google credentials from file path');
    return {
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    };
  }
  
  console.warn('No Google credentials found');
  return {};
}

// Build Vertex AI options, add proxy and credentials based on environment
function getVertexAIOptions() {
  // Base configuration
  const baseOptions = {
    modelName: "gemini-2.5-flash", // Google's Gemini 2.5 Flash model (faster and more efficient)
    temperature: 0,
    // Vertex AI project configuration
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.VERTEX_LOCATION || process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
    ...getGoogleCredentials() // Add credentials configuration
  };

  // Add proxy configuration in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('Using development proxy for Vertex AI');
    // Use current website domain as base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    
    return {
      ...baseOptions,
      apiEndpoint: `${baseUrl}/api/vertex`, // Use complete URL proxy
    };
  }

  // Use Google API directly in production environment
  console.log('Using direct Google API connection for Vertex AI in production');
  return baseOptions;
}

// Initialize Vertex AI model
const model = new ChatVertexAI(getVertexAIOptions());

// Analyze project content, evaluate relevance to MCP
export async function analyzeProjectRelevance(
  repo: ProcessedRepo,
  forceAnalysis = false
): Promise<AnalysisResult> {
  // Prioritize existing analysis results from database
  if (!forceAnalysis && repo.relevance && repo.relevance !== 'Low') {
    console.log(`Using existing analysis results: ${repo.name}`);
    
    // Use database fields if available, otherwise fallback to extracted features
    let keyFeatures = extractKeyFeatures(repo);
    let useCases = extractUseCases(repo);
    let summary = `${repo.name} is a project related to the Model Context Protocol. ${repo.description || ''}`;
    
    // Use database gemini fields if available
    if (repo.geminiKeyFeatures && Array.isArray(repo.geminiKeyFeatures) && repo.geminiKeyFeatures.length > 0) {
      keyFeatures = repo.geminiKeyFeatures;
      console.log(`Using database key features for ${repo.name}`);
    }
    
    if (repo.geminiUseCases && Array.isArray(repo.geminiUseCases) && repo.geminiUseCases.length > 0) {
      useCases = repo.geminiUseCases;
      console.log(`Using database use cases for ${repo.name}`);
    }
    
    if (repo.geminiSummary && repo.geminiSummary.trim()) {
      summary = repo.geminiSummary;
      console.log(`Using database summary for ${repo.name}`);
    }
    
    return {
      relevanceScore: getScoreFromRelevance(repo.relevance),
      relevanceCategory: repo.relevance as 'High' | 'Medium' | 'Related',
      summary: summary,
      keyFeatures: keyFeatures,
      useCases: useCases,
      projectType: (repo.projectType as 'Server' | 'Client' | 'Library' | 'Tool' | 'Example' | 'Unknown') || 'Unknown',
      coreFeatures: repo.coreFeatures || [],
      techStack: repo.techStack || [repo.language || 'Unknown'],
      compatibility: repo.compatibility || [],
      installCommand: repo.installCommand,
      quickStartCode: repo.quickStartCode,
      documentationUrl: repo.documentationUrl,
      serverEndpoint: repo.serverEndpoint,
      clientCapabilities: repo.clientCapabilities || []
    };
  }

  // Check if Google Vertex AI credentials are available
  if (!process.env.GOOGLE_CLOUD_PROJECT || 
      (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)) {
    console.warn("No Google Vertex AI credentials found. Using default analysis.");
    return getDefaultAnalysis(repo);
  }

  try {
    // Prepare analysis content
    const content = `
    Repository Name: ${repo.name}
    Description: ${repo.description}
    Topics: ${repo.topics.join(", ")}
    README Content: ${repo.readmeContent || "Not available"}
    `;

    // 构建增强的提示
    const prompt = `
    You are an expert in AI and language model technologies, specifically the Model Context Protocol (MCP) 
    developed by Anthropic. The MCP is a protocol for structuring the context given to LLMs to improve their comprehension and responses.
    
    Please analyze the following GitHub repository information and extract detailed structured data:
    
    ${content}
    
    Please provide the following in JSON format:
    1. relevanceScore: A score from 0-100 indicating how relevant this project is to MCP
    2. relevanceCategory: One of ["High", "Medium", "Related"] based on the score
    3. summary: A brief summary of the project and its relation to MCP (100 words max)
    4. keyFeatures: List of key features of this project related to MCP (up to 5 points)
    5. useCases: List of potential use cases for this project (up to 3 points)
    6. projectType: One of ["Server", "Client", "Library", "Tool", "Example", "Unknown"] - determine if this is an MCP server, client, library, tool, example, or unknown
    7. coreFeatures: List of core MCP features this project supports (e.g., "Tool Discovery", "Streaming Output", "Function Calling", "Resource Management", "Prompt Templates")
    8. techStack: List of programming languages and frameworks used (e.g., ["Python", "TypeScript", "Go", "Node.js"])
    9. compatibility: List of compatible LLM models (e.g., ["GPT-4", "Claude 3", "Gemini", "OpenAI"])
    10. installCommand: Installation command if found (e.g., "pip install mcp-server", "npm install @anthropic/mcp")
    11. quickStartCode: Minimal code example for quick start (max 200 characters)
    12. documentationUrl: Link to documentation if found
    13. serverEndpoint: If this is a server, provide the endpoint URL or connection string
    14. clientCapabilities: If this is a client, list its capabilities (e.g., ["VS Code Integration", "Command Line Interface", "Web Interface"])
    
    Focus on extracting practical, actionable information that developers can use immediately.
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
        projectType: result.projectType || 'Unknown',
        coreFeatures: result.coreFeatures || [],
        techStack: result.techStack || [repo.language || 'Unknown'],
        compatibility: result.compatibility || [],
        installCommand: result.installCommand,
        quickStartCode: result.quickStartCode,
        documentationUrl: result.documentationUrl,
        serverEndpoint: result.serverEndpoint,
        clientCapabilities: result.clientCapabilities || []
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

// Get numeric score from relevance level
function getScoreFromRelevance(relevance: string): number {
  switch (relevance) {
    case 'High': return 85;
    case 'Medium': return 65;
    case 'Related': return 45;
    default: return 30;
  }
}

// Extract key features from project information
function extractKeyFeatures(repo: ProcessedRepo): string[] {
  const features = [];
  
  if (repo.topics.some(topic => topic.toLowerCase().includes('mcp'))) {
    features.push('Model Context Protocol support');
  }
  if (repo.topics.some(topic => topic.toLowerCase().includes('server'))) {
    features.push('MCP server implementation');
  }
  if (repo.topics.some(topic => topic.toLowerCase().includes('client'))) {
    features.push('MCP client tools');
  }
  if (repo.language === 'Python') {
    features.push('Python language implementation');
  }
  if (repo.language === 'TypeScript' || repo.language === 'JavaScript') {
    features.push('JavaScript/TypeScript implementation');
  }
  
  // Ensure at least 3 features
  while (features.length < 3) {
    features.push('MCP ecosystem component');
  }
  
  return features.slice(0, 5);
}

// Extract use cases from project information
function extractUseCases(repo: ProcessedRepo): string[] {
  const useCases = [];
  
  if (repo.topics.some(topic => topic.toLowerCase().includes('server'))) {
    useCases.push('Building MCP server applications');
  }
  if (repo.topics.some(topic => topic.toLowerCase().includes('client'))) {
    useCases.push('Developing MCP client tools');
  }
  if (repo.description?.toLowerCase().includes('integration')) {
    useCases.push('Integration with existing systems');
  }
  
  // Ensure at least 2 use cases
  while (useCases.length < 2) {
    useCases.push('Enhancing language model context processing');
  }
  
  return useCases.slice(0, 3);
}

// Generate default analysis results based on repository properties
function getDefaultAnalysis(repo: ProcessedRepo): AnalysisResult {
  // Determine relevance based on simple rules
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

  // 智能推断项目类型
  const projectType = inferProjectType(repo);
  const coreFeatures = inferCoreFeatures(repo);
  const techStack = [repo.language || 'Unknown'];
  const compatibility = inferCompatibility(repo);

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
    ],
    projectType,
    coreFeatures,
    techStack,
    compatibility,
    installCommand: inferInstallCommand(repo),
    quickStartCode: inferQuickStartCode(repo),
    documentationUrl: inferDocumentationUrl(repo),
    serverEndpoint: projectType === 'Server' ? inferServerEndpoint(repo) : undefined,
    clientCapabilities: projectType === 'Client' ? inferClientCapabilities(repo) : []
  };
}

// 智能推断项目类型
function inferProjectType(repo: ProcessedRepo): 'Server' | 'Client' | 'Library' | 'Tool' | 'Example' | 'Unknown' {
  const name = repo.name.toLowerCase();
  const description = (repo.description || '').toLowerCase();
  const topics = repo.topics.map(t => t.toLowerCase());
  
  if (name.includes('server') || description.includes('server') || topics.includes('server')) {
    return 'Server';
  }
  if (name.includes('client') || description.includes('client') || topics.includes('client')) {
    return 'Client';
  }
  if (name.includes('lib') || name.includes('sdk') || description.includes('library')) {
    return 'Library';
  }
  if (name.includes('tool') || name.includes('cli') || description.includes('tool')) {
    return 'Tool';
  }
  if (name.includes('example') || name.includes('demo') || description.includes('example')) {
    return 'Example';
  }
  
  return 'Unknown';
}

// 推断核心特性
function inferCoreFeatures(repo: ProcessedRepo): string[] {
  const features = [];
  const text = `${repo.name} ${repo.description} ${repo.topics.join(' ')}`.toLowerCase();
  
  if (text.includes('tool') || text.includes('function')) {
    features.push('Tool Discovery');
  }
  if (text.includes('stream') || text.includes('real-time')) {
    features.push('Streaming Output');
  }
  if (text.includes('function') || text.includes('call')) {
    features.push('Function Calling');
  }
  if (text.includes('resource') || text.includes('file')) {
    features.push('Resource Management');
  }
  if (text.includes('prompt') || text.includes('template')) {
    features.push('Prompt Templates');
  }
  
  return features.length > 0 ? features : ['MCP Integration'];
}

// 推断兼容性
function inferCompatibility(repo: ProcessedRepo): string[] {
  const compatibility = [];
  const text = `${repo.name} ${repo.description} ${repo.topics.join(' ')}`.toLowerCase();
  
  if (text.includes('claude') || text.includes('anthropic')) {
    compatibility.push('Claude 3');
  }
  if (text.includes('gpt') || text.includes('openai')) {
    compatibility.push('GPT-4');
  }
  if (text.includes('gemini') || text.includes('google')) {
    compatibility.push('Gemini');
  }
  
  return compatibility.length > 0 ? compatibility : ['Universal'];
}

// 推断安装命令
function inferInstallCommand(repo: ProcessedRepo): string | undefined {
  const readme = repo.readmeContent || '';
  
  // 查找常见的安装命令模式
  const pipMatch = readme.match(/pip install[^\n]+/i);
  if (pipMatch) return pipMatch[0].trim();
  
  const npmMatch = readme.match(/npm install[^\n]+/i);
  if (npmMatch) return npmMatch[0].trim();
  
  const yarnMatch = readme.match(/yarn add[^\n]+/i);
  if (yarnMatch) return yarnMatch[0].trim();
  
  return undefined;
}

// 推断快速开始代码
function inferQuickStartCode(repo: ProcessedRepo): string | undefined {
  const readme = repo.readmeContent || '';
  
  // 查找代码块
  const codeMatch = readme.match(/```[\s\S]*?```/);
  if (codeMatch) {
    const code = codeMatch[0].replace(/```\w*\n?/, '').replace(/\n?```$/, '').trim();
    return code.length > 200 ? code.substring(0, 200) + '...' : code;
  }
  
  return undefined;
}

// 推断文档链接
function inferDocumentationUrl(repo: ProcessedRepo): string | undefined {
  const readme = repo.readmeContent || '';
  
  // 查找文档链接
  const docMatch = readme.match(/\[.*?\]\((https?:\/\/[^)]+)\)/);
  if (docMatch) return docMatch[1];
  
  return undefined;
}

// 推断服务器端点
function inferServerEndpoint(repo: ProcessedRepo): string | undefined {
  const readme = repo.readmeContent || '';
  
  // 查找端点URL
  const endpointMatch = readme.match(/(https?:\/\/[^\s]+)/);
  if (endpointMatch) return endpointMatch[1];
  
  return undefined;
}

// 推断客户端能力
function inferClientCapabilities(repo: ProcessedRepo): string[] {
  const capabilities = [];
  const text = `${repo.name} ${repo.description} ${repo.topics.join(' ')}`.toLowerCase();
  
  if (text.includes('vscode') || text.includes('vs code')) {
    capabilities.push('VS Code Integration');
  }
  if (text.includes('cli') || text.includes('command line')) {
    capabilities.push('Command Line Interface');
  }
  if (text.includes('web') || text.includes('browser')) {
    capabilities.push('Web Interface');
  }
  if (text.includes('api') || text.includes('rest')) {
    capabilities.push('API Integration');
  }
  
  return capabilities.length > 0 ? capabilities : ['MCP Client'];
} 