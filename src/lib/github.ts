import axios, { AxiosInstance } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

// GitHub API 类型
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
}

export interface ProcessedRepo {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  ownerAvatar: string;
  url: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  relevance: string;
  imageUrl: string;
  readmeContent?: string;
}

// 从环境变量获取配置
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PROXY_HOST = process.env.PROXY_HOST || '127.0.0.1';
const PROXY_PORT = process.env.PROXY_PORT || '7890';

// 创建GitHub API客户端
function createGitHubClient(): AxiosInstance {
  if (!GITHUB_TOKEN) {
    console.warn('GITHUB_TOKEN 环境变量未设置，GitHub API 调用可能会受到限制');
  }

  const baseConfig = {
    baseURL: 'https://api.github.com',
    timeout: 30000, // 30秒超时
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'mcphubs-app/1.0',
      ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` }),
    }
  };

  // 开发环境使用代理
  if (process.env.NODE_ENV === 'development') {
    console.log(`使用代理: ${PROXY_HOST}:${PROXY_PORT}`);
    const proxyAgent = new HttpsProxyAgent(`http://${PROXY_HOST}:${PROXY_PORT}`);
    return axios.create({
      ...baseConfig,
      httpsAgent: proxyAgent,
    });
  }

  // 生产环境直接连接
  return axios.create(baseConfig);
}

// 创建客户端实例
const githubClient = createGitHubClient();

// 多搜索查询配置
const searchQueries = [
  {
    query: 'model context protocol OR mcp-protocol OR anthropic-mcp',
    description: 'MCP核心协议项目'
  },
  {
    query: 'mcp-server OR mcp-client OR mcp-integration',
    description: 'MCP服务器和客户端'
  },
  {
    query: 'claude-mcp OR anthropic context protocol',
    description: 'Claude MCP集成'
  },
  {
    query: 'model-context-protocol language:python',
    description: 'Python MCP实现'
  },
  {
    query: 'model-context-protocol language:javascript language:typescript',
    description: 'JavaScript/TypeScript MCP实现'
  },
  {
    query: 'awesome-mcp OR mcp-awesome OR mcp-servers',
    description: 'MCP项目合集'
  }
];

// 执行单个搜索查询
async function executeSearchQuery(searchConfig: { query: string; description: string }): Promise<GitHubRepo[]> {
  try {
    console.log(`搜索: ${searchConfig.description} - "${searchConfig.query}"`);
    
    const response = await githubClient.get('/search/repositories', {
      params: {
        q: searchConfig.query,
        sort: 'stars',
        order: 'desc',
        per_page: 100, // GitHub API最大支持100
      },
    });

    const repos: GitHubRepo[] = response.data.items || [];
    console.log(`从 "${searchConfig.description}" 获取到 ${repos.length} 个项目`);
    return repos;

  } catch (error: any) {
    console.error(`搜索 "${searchConfig.description}" 时出错:`, error.message);
    return [];
  }
}

// 获取MCP相关的GitHub项目
export async function searchMCPProjects(): Promise<ProcessedRepo[]> {
  try {
    console.log('正在从GitHub API获取MCP项目...');
    
    // 执行所有搜索查询
    const allResults = await Promise.all(
      searchQueries.map(searchConfig => executeSearchQuery(searchConfig))
    );

    // 合并所有结果并去重
    const allRepos: GitHubRepo[] = [];
    const seenIds = new Set<number>();

    allResults.forEach(repos => {
      repos.forEach(repo => {
        if (!seenIds.has(repo.id)) {
          seenIds.add(repo.id);
          allRepos.push(repo);
        }
      });
    });

    console.log(`合并去重后共获取到 ${allRepos.length} 个项目`);

    // 按相关性和星标数排序
    allRepos.sort((a, b) => {
      const aRelevance = determineRelevanceScore(a);
      const bRelevance = determineRelevanceScore(b);
      
      // 先按相关性分数排序，再按星标数排序
      if (aRelevance !== bRelevance) {
        return bRelevance - aRelevance;
      }
      return b.stargazers_count - a.stargazers_count;
    });

    // 处理并转换数据，限制最多200个项目以避免性能问题
    const limitedRepos = allRepos.slice(0, 200);
    const processedRepos: ProcessedRepo[] = limitedRepos.map(repo => ({
      id: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner.login,
      ownerAvatar: repo.owner.avatar_url,
      url: repo.html_url,
      description: repo.description || '暂无描述',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || 'Unknown',
      topics: repo.topics || [],
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      relevance: determineRelevance(repo),
      imageUrl: generateProjectImage(repo),
    }));

    console.log(`项目数据处理完成，最终返回 ${processedRepos.length} 个项目`);
    return processedRepos;

  } catch (error: any) {
    console.error('获取GitHub项目时出错:', error);
    
    // 提供更详细的错误信息
    if (error.response) {
      console.error('GitHub API 响应错误:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
      
      // 如果是认证错误，提供帮助信息
      if (error.response.status === 401) {
        console.error('GitHub Token 认证失败，请检查 GITHUB_TOKEN 环境变量');
      }
      
      // 如果是代理错误，提供帮助信息
      if (error.response.status === 502 || error.code === 'ECONNREFUSED') {
        console.error('网络连接失败，请检查代理设置或网络连接');
      }
    } else if (error.request) {
      console.error('网络请求失败:', error.message);
    } else {
      console.error('请求配置错误:', error.message);
    }
    
    // 返回空数组而不是抛出错误，让应用继续运行
    return [];
  }
}

// 获取单个仓库的详细信息
export async function getRepositoryDetails(identifier: string): Promise<ProcessedRepo | null> {
  try {
    console.log(`获取项目详情: ${identifier}`);
    
    // 方法1: 如果identifier包含斜杠，认为是owner/name格式，直接API调用
    if (identifier.includes('/')) {
      console.log(`直接通过API获取仓库: ${identifier}`);
      try {
        const repoResponse = await githubClient.get(`/repos/${identifier}`);
        const repo = repoResponse.data;
        
        // 转换为ProcessedRepo格式
        const processedRepo: ProcessedRepo = {
          id: repo.id.toString(),
          name: repo.name,
          fullName: repo.full_name,
          owner: repo.owner.login,
          ownerAvatar: repo.owner.avatar_url,
          url: repo.html_url,
          description: repo.description || '暂无描述',
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || 'Unknown',
          topics: repo.topics || [],
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
          relevance: determineRelevance(repo),
          imageUrl: generateProjectImage(repo),
        };
        
        // 尝试获取README
        try {
          const readmeResponse = await githubClient.get(`/repos/${repo.full_name}/readme`);
          const readmeContent = Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');
          processedRepo.readmeContent = readmeContent;
        } catch (readmeError) {
          console.warn(`无法获取 ${repo.full_name} 的 README:`, readmeError);
        }
        
        console.log(`✅ 直接API获取成功: ${processedRepo.name}`);
        return processedRepo;
        
      } catch (apiError) {
        console.warn(`直接API调用失败: ${apiError}`);
      }
    }
    
    // 方法2: 尝试从搜索结果中找到项目
    try {
      const allProjects = await searchMCPProjects();
      const project = allProjects.find(p => p.id === identifier);
      
      if (project) {
        console.log(`✅ 从搜索结果中找到项目: ${project.name}`);
        // 尝试获取 README 内容
        try {
          const readmeResponse = await githubClient.get(`/repos/${project.fullName}/readme`);
          const readmeContent = Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');
          return {
            ...project,
            readmeContent,
          };
        } catch (readmeError) {
          console.warn(`无法获取 ${project.fullName} 的 README:`, readmeError);
          return project;
        }
      }
    } catch (searchError) {
      console.warn('从搜索结果获取项目失败:', searchError);
    }
    
    // 方法3: 如果是数字ID，生成演示项目
    if (/^\d+$/.test(identifier)) {
      console.log(`数字ID ${identifier}，使用模拟数据`);
      return {
        id: identifier,
        name: `项目-${identifier}`,
        fullName: `mcp/project-${identifier}`,
        owner: 'mcp-community',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
        url: `https://github.com/mcp/project-${identifier}`,
        description: '这是一个MCP相关项目的演示页面。实际项目数据需要配置正确的GitHub Token。',
        stars: Math.floor(Math.random() * 1000),
        forks: Math.floor(Math.random() * 100),
        language: 'Python',
        topics: ['mcp', 'model-context-protocol'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        relevance: 'high',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        readmeContent: `# 项目 ${identifier}

这是一个MCP (Model Context Protocol) 相关项目的演示页面。

## 功能特性

- 🚀 支持模型上下文协议
- 📊 提供丰富的API接口  
- 🔧 易于集成和扩展

## 快速开始

\`\`\`bash
npm install mcp-project-${identifier}
\`\`\`

## 注意

当前显示的是演示数据。要查看真实项目信息，请配置正确的GitHub Token。

## 相关链接

- [MCP官方文档](https://modelcontextprotocol.io)
- [项目主页](https://mcphubs.io)
`
      };
    }
    
    // 方法4: 其他情况返回错误提示项目
    console.log('所有获取方法都失败，返回错误提示');
    return {
      id: identifier,
      name: '项目未找到',
      fullName: 'unknown/unknown',
      owner: 'unknown',
      ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
      url: '#',
      description: '抱歉，无法获取项目信息。可能是网络问题或项目不存在。',
      stars: 0,
      forks: 0,
      language: 'Unknown',
      topics: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      relevance: 'low',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      readmeContent: '# 项目未找到\n\n抱歉，无法获取项目信息。请检查项目ID是否正确，或稍后重试。'
    };
    
  } catch (error) {
    console.error('获取项目详情时出错:', error);
    
    // 返回一个错误提示项目
    return {
      id: identifier,
      name: '项目未找到',
      fullName: 'unknown/unknown',
      owner: 'unknown',
      ownerAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
      url: '#',
      description: '抱歉，无法获取项目信息。可能是网络问题或项目不存在。',
      stars: 0,
      forks: 0,
      language: 'Unknown',
      topics: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      relevance: 'low',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      readmeContent: '# 项目未找到\n\n抱歉，无法获取项目信息。请检查项目ID是否正确，或稍后重试。'
    };
  }
}

// 计算项目相关性分数（用于排序）
function determineRelevanceScore(repo: GitHubRepo): number {
  const name = repo.name.toLowerCase();
  const description = (repo.description || '').toLowerCase();
  const topics = repo.topics.map(t => t.toLowerCase());
  const fullName = repo.full_name.toLowerCase();
  
  let score = 0;
  
  // 高权重关键词（+50分）
  const highPriorityKeywords = [
    'model-context-protocol', 'anthropic-mcp', 'mcp-server', 
    'mcp-client', 'mcp-protocol', 'claude-mcp'
  ];
  
  // 中权重关键词（+30分）
  const mediumPriorityKeywords = [
    'model context protocol', 'mcp', 'context protocol',
    'anthropic', 'claude', 'mcp-integration'
  ];
  
  // 低权重关键词（+10分）
  const lowPriorityKeywords = [
    'awesome-mcp', 'mcp-servers', 'protocol', 'context',
    'ai-assistant', 'llm-integration'
  ];
  
  // 检查高权重关键词
  highPriorityKeywords.forEach(keyword => {
    if (name.includes(keyword) || fullName.includes(keyword)) score += 100;
    else if (description.includes(keyword)) score += 75;
    else if (topics.includes(keyword)) score += 50;
  });
  
  // 检查中权重关键词
  mediumPriorityKeywords.forEach(keyword => {
    if (name.includes(keyword) || fullName.includes(keyword)) score += 60;
    else if (description.includes(keyword)) score += 45;
    else if (topics.includes(keyword)) score += 30;
  });
  
  // 检查低权重关键词
  lowPriorityKeywords.forEach(keyword => {
    if (name.includes(keyword) || fullName.includes(keyword)) score += 20;
    else if (description.includes(keyword)) score += 15;
    else if (topics.includes(keyword)) score += 10;
  });
  
  // 加分项
  if (repo.stargazers_count > 100) score += 20;
  if (repo.stargazers_count > 500) score += 30;
  if (repo.stargazers_count > 1000) score += 50;
  
  if (repo.forks_count > 10) score += 10;
  if (repo.forks_count > 50) score += 20;
  
  // 最近更新加分
  const lastUpdate = new Date(repo.updated_at);
  const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 30) score += 15;
  else if (daysSinceUpdate < 90) score += 10;
  else if (daysSinceUpdate < 180) score += 5;
  
  return Math.max(0, score);
}

// 判断项目与MCP的相关性（用于显示标签）
function determineRelevance(repo: GitHubRepo): string {
  const score = determineRelevanceScore(repo);
  
  if (score >= 100) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
}

// 生成项目图片URL（基于项目信息）
function generateProjectImage(repo: GitHubRepo): string {
  // 使用GitHub的社交卡片图片或默认图片
  const socialCardUrl = `https://opengraph.githubassets.com/1/${repo.full_name}`;
  return socialCardUrl;
} 