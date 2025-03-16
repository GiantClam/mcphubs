import axios, { AxiosInstance } from 'axios';

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

// 创建两个 Axios 实例，一个用于开发环境，一个用于生产环境
const devApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
});

const prodApiClient = axios.create({
  baseURL: 'https://api.github.com',
});

// 根据环境返回适当的 Axios 客户端和路径
function getGitHubApiClient(path: string): { client: AxiosInstance; url: string } {
  // 在开发环境下使用代理
  if (process.env.NODE_ENV === 'development') {
    return {
      client: devApiClient,
      url: `/api/github${path}`,
    };
  }
  // 在生产环境下直接使用 GitHub API
  return {
    client: prodApiClient,
    url: path,
  };
}

// 获取MCP相关的GitHub项目
export async function searchMCPProjects(): Promise<ProcessedRepo[]> {
  try {
    // 获取适当的客户端和URL
    const { client, url } = getGitHubApiClient('/search/repositories');
    
    // 使用 GitHub 搜索 API 查找与 MCP 相关的项目
    const response = await client.get(url, {
      params: {
        q: 'model context protocol OR anthropic-mcp OR mcp-protocol language:python language:javascript',
        sort: 'stars',
        order: 'desc',
        per_page: 20
      },
      headers: {
        Accept: 'application/vnd.github.v3+json',
        // 如果有 GitHub Token 可以添加 Authorization 头部
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `token ${process.env.GITHUB_TOKEN}`
        })
      }
    });

    const repos = response.data.items as GitHubRepo[];
    
    // 处理结果
    const processedRepos: ProcessedRepo[] = repos.map(repo => ({
      id: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner.login,
      ownerAvatar: repo.owner.avatar_url,
      url: repo.html_url,
      description: repo.description || 'No description available',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || 'Not specified',
      topics: repo.topics || [],
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      // 根据关键词进行简单的相关性判断
      relevance: determineRelevance(repo),
      // 使用仓库拥有者的头像作为默认图片
      imageUrl: repo.owner.avatar_url
    }));

    return processedRepos;
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return [];
  }
}

// 获取单个仓库的详细信息，包括README内容
export async function getRepositoryDetails(id: string): Promise<ProcessedRepo | null> {
  try {
    // 先获取所有仓库，然后找到匹配的那个
    const allRepos = await searchMCPProjects();
    const repo = allRepos.find(r => r.id === id);
    
    if (!repo) return null;
    
    // 获取README内容
    try {
      const { client, url } = getGitHubApiClient(`/repos/${repo.fullName}/readme`);
      
      const readmeResponse = await client.get(url, {
        headers: {
          Accept: 'application/vnd.github.v3.raw',
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`
          })
        }
      });
      
      repo.readmeContent = readmeResponse.data;
    } catch (readmeError) {
      console.error('Error fetching README:', readmeError);
      repo.readmeContent = 'README content not available';
    }
    
    return repo;
  } catch (error) {
    console.error('Error fetching repository details:', error);
    return null;
  }
}

// 根据项目名称、描述和主题简单判断与MCP的相关性
function determineRelevance(repo: GitHubRepo): string {
  const nameAndDesc = `${repo.name} ${repo.description || ''}`.toLowerCase();
  const topics = (repo.topics || []).join(' ').toLowerCase();
  
  // 高相关性关键词
  const highRelevanceKeywords = [
    'model context protocol',
    'anthropic-mcp',
    'mcp-protocol',
    'mcp protocol'
  ];
  
  // 中等相关性关键词
  const mediumRelevanceKeywords = [
    'mcp',
    'model context',
    'claude context',
    'anthropic context'
  ];
  
  // 检查是否包含高相关性关键词
  for (const keyword of highRelevanceKeywords) {
    if (nameAndDesc.includes(keyword) || topics.includes(keyword)) {
      return 'High';
    }
  }
  
  // 检查是否包含中等相关性关键词
  for (const keyword of mediumRelevanceKeywords) {
    if (nameAndDesc.includes(keyword) || topics.includes(keyword)) {
      return 'Medium';
    }
  }
  
  // 默认为低相关性
  return 'Related';
} 