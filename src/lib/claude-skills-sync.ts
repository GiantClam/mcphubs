import axios from 'axios';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { syncClaudeSkills } from './supabase';
import fs from 'fs';
import path from 'path';

// GitHub API Types
interface GitHubContentItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

interface SkillInfo {
  name: string;
  path: string;
  type: 'file' | 'dir';
  downloadUrl: string;
  githubUrl: string;
  description?: string;
  skillMd?: string;
}

interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
}

interface SyncResult {
  success: boolean;
  total: number;
  inserted: number;
  updated: number;
  errors: number;
  message: string;
}

// Get configuration from environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Create GitHub API client
function createGitHubClient() {
  const baseConfig = {
    baseURL: 'https://api.github.com',
    timeout: 60000, // 增加到 60 秒超时
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'mcphubs-app/1.0',
      ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` }),
    }
  };

  return axios.create(baseConfig);
}

const githubClient = createGitHubClient();

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check if error is retryable (5xx errors, network errors, timeouts)
      const isRetryable = 
        error.response?.status >= 500 || // 5xx server errors
        error.response?.status === 429 || // Rate limit
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND' ||
        error.message?.includes('timeout');
      
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`⚠️ Request failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`, {
        status: error.response?.status,
        message: error.message,
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Get Google credentials from environment variables or file
// Reference: analysis.ts - keep the same approach
function getGoogleCredentials() {
  // Prioritize JSON credentials from environment variables (Vercel deployment)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    try {
      // Check if it's a JSON string (starts with '{')
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON.startsWith('{')) {
        const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        console.log('✅ Using Google credentials from GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable (JSON string)');
        return { credentials };
      } else {
        // Treat as file path
        const absolutePath = path.isAbsolute(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
          ? process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
          : path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        
        if (fs.existsSync(absolutePath)) {
          const fileContent = fs.readFileSync(absolutePath, 'utf-8');
          const credentials = JSON.parse(fileContent);
          console.log(`✅ Using Google credentials from JSON file: ${absolutePath}`);
          return { credentials };
        } else {
          console.warn(`⚠️ Credentials file not found: ${absolutePath}`);
        }
      }
    } catch (error) {
      console.error("❌ Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:", error);
    }
  }
  
  // Try to find credentials file based on GOOGLE_CLOUD_PROJECT_ID
  // File name format: {GOOGLE_CLOUD_PROJECT_ID}.json or {GOOGLE_CLOUD_PROJECT_ID}-*.json
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
  if (projectId) {
    try {
      // Search in current directory and parent directory (project root)
      const searchDirs = [process.cwd(), path.resolve(process.cwd(), '..')];
      
      for (const searchDir of searchDirs) {
        try {
          // First try exact match: {projectId}.json
          const exactFileName = `${projectId}.json`;
          const exactFilePath = path.resolve(searchDir, exactFileName);
          
          if (fs.existsSync(exactFilePath)) {
            const fileContent = fs.readFileSync(exactFilePath, 'utf-8');
            const credentials = JSON.parse(fileContent);
            
            if (credentials.project_id === projectId) {
              console.log(`✅ Using Google credentials from JSON file (${exactFileName}): ${exactFilePath}`);
              // Set environment variable so ChatVertexAI can find it
              if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                process.env.GOOGLE_APPLICATION_CREDENTIALS = exactFilePath;
              }
              return { credentials };
            }
          }
          
          // Then try files starting with project ID (e.g., {projectId}-*.json)
          const files = fs.readdirSync(searchDir);
          const matchingFiles = files.filter(file => 
            file.startsWith(projectId) && file.endsWith('.json')
          );
          
          if (matchingFiles.length > 0) {
            // Use the first matching file
            const foundFilePath = path.resolve(searchDir, matchingFiles[0]);
            const fileContent = fs.readFileSync(foundFilePath, 'utf-8');
            const credentials = JSON.parse(fileContent);
            
            // Verify that the file contains the correct project_id
            if (credentials.project_id === projectId) {
              console.log(`✅ Using Google credentials from JSON file (${matchingFiles[0]}): ${foundFilePath}`);
              // Set environment variable so ChatVertexAI can find it
              if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                process.env.GOOGLE_APPLICATION_CREDENTIALS = foundFilePath;
              }
              return { credentials };
            }
          }
        } catch (error) {
          // Ignore directory read errors, continue to next directory
        }
      }
    } catch (error) {
      console.warn(`⚠️ Failed to read credentials file by project ID:`, error);
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
  // Support multiple environment variable names for project ID
  const projectId = process.env.GOOGLE_CLOUD_PROJECT || 
                    process.env.GOOGLE_CLOUD_PROJECT_ID || 
                    null;
  
  // Support multiple environment variable names for location/region
  const location = process.env.VERTEX_LOCATION || 
                   process.env.VERTEX_AI_REGION ||
                   process.env.GOOGLE_CLOUD_LOCATION || 
                   "us-central1";
  
  // Get credentials first
  const credentials = getGoogleCredentials();
  
  // Base configuration
  const baseOptions: any = {
    modelName: "gemini-2.5-flash", // Google's Gemini 2.5 Flash model
    temperature: 0.2,
    // Vertex AI project configuration
    project: projectId,
    location: location,
  };
  
  // Add credentials configuration - ensure credentials object is properly structured
  // ChatVertexAI may still look for GOOGLE_APPLICATION_CREDENTIALS env var at runtime,
  // so we ensure it's set if we found a file
  if (credentials.credentials) {
    baseOptions.credentials = credentials.credentials;
  } else if (credentials.keyFilename) {
    baseOptions.keyFilename = credentials.keyFilename;
    // Ensure environment variable is set for ChatVertexAI's internal lookup
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = credentials.keyFilename;
    }
  }

  // Add proxy configuration in development environment
  if (process.env.NODE_ENV === 'development') {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    return {
      ...baseOptions,
      apiEndpoint: `${baseUrl}/api/vertex`, // Use complete URL proxy
    };
  }

  // Use Google API directly in production environment
  return baseOptions;
}

// Initialize Vertex AI model for skill summarization
let skillSummaryModel: ChatVertexAI | null = null;

function getSkillSummaryModel(): ChatVertexAI | null {
  // Check if Google Vertex AI credentials are available
  // Support multiple environment variable names
  const hasProject = !!(process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT_ID);
  
  if (!hasProject) {
    console.warn('⚠️ GOOGLE_CLOUD_PROJECT or GOOGLE_CLOUD_PROJECT_ID not set in environment variables');
    return null;
  }
  
  // Actually try to get credentials to verify they exist
  const credentials = getGoogleCredentials();
  if (!credentials || (!credentials.credentials && !credentials.keyFilename)) {
    console.warn('⚠️ No Google credentials found. Please set GOOGLE_APPLICATION_CREDENTIALS_JSON or ensure credentials file exists.');
    console.warn('   Looking for:');
    console.warn('   - GOOGLE_APPLICATION_CREDENTIALS_JSON (JSON string or file path)');
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
    if (projectId) {
      console.warn(`   - ${projectId}.json (in project root)`);
    }
    console.warn('   - GOOGLE_APPLICATION_CREDENTIALS (file path)');
    return null;
  }

  if (!skillSummaryModel) {
    try {
      const options = getVertexAIOptions();
      console.log(`🔧 Initializing Vertex AI model: ${options.modelName}, project: ${options.project}, location: ${options.location}`);
      
      // Log credential source for debugging
      if (credentials.credentials) {
        console.log(`   ✅ Credentials found: ${credentials.credentials.client_email || 'JSON object'}`);
        console.log(`   ✅ Credentials type: ${credentials.credentials.type || 'unknown'}`);
        console.log(`   ✅ Credentials project_id: ${credentials.credentials.project_id || 'unknown'}`);
      } else if (credentials.keyFilename) {
        console.log(`   ✅ Using credentials from file: ${credentials.keyFilename}`);
      } else {
        console.error('   ❌ No credentials in options!');
        console.error('   Options keys:', Object.keys(options));
        return null;
      }
      
      // If we have credentials object but ChatVertexAI still looks for default file,
      // we need to ensure the credentials are properly passed
      // ChatVertexAI should use the credentials parameter, but if it doesn't,
      // we can try setting GOOGLE_APPLICATION_CREDENTIALS to point to a temp file
      // For now, let's just ensure credentials are in options
      if (!options.credentials && !options.keyFilename) {
        console.error('   ❌ Credentials not found in options object!');
        console.error('   Available options:', JSON.stringify(Object.keys(options), null, 2));
        return null;
      }
      
      skillSummaryModel = new ChatVertexAI(options);
      console.log('✅ Vertex AI model initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Vertex AI model:', error);
      console.error('   Error details:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error && error.stack) {
        console.error('   Stack trace:', error.stack);
      }
      return null;
    }
  }

  return skillSummaryModel;
}

/**
 * Use AI to summarize SKILL.md into a concise English description.
 * Provider: Vertex AI Gemini 2.5 Flash. Falls back to heuristic extraction.
 */
async function summarizeSkillWithAI(markdown: string): Promise<string> {
  const model = getSkillSummaryModel();
  
  if (!model) {
    console.warn('Vertex AI model not available, fallback to heuristic summary');
    return extractDescriptionFromSkillMd(markdown);
  }

  try {
    const MAX_INPUT = 6000;
    const input = markdown.length > MAX_INPUT ? markdown.slice(0, MAX_INPUT) : markdown;

    const prompt = `Summarize the following Claude Skill into a single concise English paragraph (≤ 280 chars). Describe its purpose and core capabilities. No lists, no code, no emojis.

${input}`;

    // Call Gemini for summarization
    const response = await model.invoke(prompt);
    const summary = response.content.toString().trim();

    if (summary && summary.length > 0) {
      // Limit to 300 characters
      const trimmed = summary.length > 300 ? summary.substring(0, 297) + '...' : summary;
      return trimmed;
    }

    return extractDescriptionFromSkillMd(markdown);
  } catch (e) {
    console.warn('Vertex AI summarization failed, falling back to heuristic:', e);
    return extractDescriptionFromSkillMd(markdown);
  }
}

/**
 * Extract and summarize description from SKILL.md content
 */
function extractDescriptionFromSkillMd(content: string): string {
  try {
    const lines = content.split('\n');
    let description = '';
    let descriptionLines: string[] = [];
    let foundHeader = false;
    
    // Look for description patterns in SKILL.md
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) {
        continue;
      }
      
      // Mark when we find a header
      if (line.startsWith('#')) {
        foundHeader = true;
        continue;
      }
      
      // After finding header, collect description lines
      if (foundHeader) {
        // Skip list markers, code blocks, and links
        if (line.startsWith('-') || line.startsWith('*') || 
            line.startsWith('```') || line.startsWith('[') ||
            line.startsWith('|') || line.startsWith('>')) {
          continue;
        }
        
        // Collect meaningful text lines
        if (line.length > 20 && !line.startsWith('http')) {
          descriptionLines.push(line);
          
          // Stop after collecting enough content (max 2-3 sentences)
          if (descriptionLines.length >= 2 || 
              descriptionLines.join(' ').length > 250) {
            break;
          }
        }
      }
    }
    
    // Combine description lines
    if (descriptionLines.length > 0) {
      description = descriptionLines.join(' ').trim();
      
      // Limit to 300 characters
      if (description.length > 300) {
        description = description.substring(0, 297).trim();
        // Try to end at a sentence boundary
        const lastPeriod = description.lastIndexOf('.');
        const lastSpace = description.lastIndexOf(' ');
        if (lastPeriod > 250) {
          description = description.substring(0, lastPeriod + 1);
        } else if (lastSpace > 250) {
          description = description.substring(0, lastSpace) + '...';
        } else {
          description = description + '...';
        }
      }
    }
    
    // Fallback: try to find first meaningful paragraph
    if (!description) {
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && 
            !trimmed.startsWith('#') && 
            !trimmed.startsWith('-') && 
            !trimmed.startsWith('*') &&
            !trimmed.startsWith('```') &&
            trimmed.length > 30 && 
            trimmed.length < 500) {
          description = trimmed.length > 300 ? trimmed.substring(0, 297) + '...' : trimmed;
          break;
        }
      }
    }
    
    return description || 'A Claude Skill for specialized tasks and workflows.';
  } catch (error) {
    console.warn('Failed to extract description from SKILL.md:', error);
    return 'A Claude Skill for specialized tasks and workflows.';
  }
}

/**
 * Fetch SKILL.md content for a specific skill with retry mechanism
 */
async function fetchSkillMarkdown(skillPath: string): Promise<string | null> {
  try {
    const filePath = `${skillPath}/SKILL.md`;
    
    // Use retry mechanism for fetching SKILL.md
    const response = await retryWithBackoff(
      async () => {
        return await githubClient.get<GitHubFileContent>(
          `/repos/anthropics/skills/contents/${filePath}`
        );
      },
      2, // max 2 retries for individual files (less critical)
      1000 // start with 1 second delay
    );
    
    if (response.data.content) {
      // Decode base64 content
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return content;
    }
    
    return null;
  } catch (error: any) {
    // SKILL.md might not exist for some skills, this is okay
    if (error.response?.status === 404) {
      return null;
    }
    
    // For retryable errors, log warning but don't fail the whole sync
    if (error.response?.status >= 500 || error.code === 'ETIMEDOUT') {
      console.warn(`⚠️ Failed to fetch SKILL.md for ${skillPath} after retries:`, error.message);
    } else {
      console.warn(`⚠️ Failed to fetch SKILL.md for ${skillPath}:`, error.message);
    }
    
    return null;
  }
}

/**
 * Fetch Claude Skills list from GitHub API with retry mechanism
 */
export async function fetchClaudeSkillsFromGitHub(): Promise<SkillInfo[]> {
  try {
    // Get root directory contents of anthropics/skills repository with retry
    const response = await retryWithBackoff(
      async () => {
        console.log('📡 Fetching Claude Skills from GitHub...');
        return await githubClient.get<GitHubContentItem[]>(
          '/repos/anthropics/skills/contents'
        );
      },
      3, // max 3 retries
      2000 // start with 2 second delay
    );

    console.log(`✅ Successfully fetched ${response.data.length} items from GitHub`);

    // Filter out directories (type === 'dir') and exclude hidden/system folders
    const directories = response.data
      .filter(item => item.type === 'dir' && !item.name.startsWith('.'));

    console.log(`📁 Found ${directories.length} skill directories`);

    // Fetch SKILL.md for each directory with rate limiting
    const skillsWithDescription = await Promise.all(
      directories.map(async (item, index) => {
        // Add small delay to avoid rate limiting (spread requests over time)
        if (index > 0 && index % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        const skillInfo: SkillInfo = {
          name: item.name,
          path: item.path,
          type: item.type as 'file' | 'dir',
          downloadUrl: `https://downgit.github.io/#/home?url=https://github.com/anthropics/skills/${item.name}`,
          githubUrl: item.html_url,
        };

        // Try to fetch SKILL.md and extract description
        try {
          const skillMdContent = await fetchSkillMarkdown(item.path);
          if (skillMdContent) {
            // AI summary preferred
            const aiSummary = await summarizeSkillWithAI(skillMdContent);
            skillInfo.description = aiSummary;
            skillInfo.skillMd = skillMdContent;
          }
        } catch (error) {
          console.warn(`⚠️ Failed to fetch description for ${item.name}:`, error);
        }

        return skillInfo;
      })
    );

    // Sort by name
    skillsWithDescription.sort((a, b) => a.name.localeCompare(b.name));

    console.log(`✅ Processed ${skillsWithDescription.length} skills`);
    return skillsWithDescription;
  } catch (error: any) {
    console.error('❌ Failed to fetch Claude Skills from GitHub:', error);
    
    // Provide detailed error information
    if (error.response) {
      const status = error.response.status;
      const statusText = error.response.statusText;
      const message = error.response.data?.message || 'Unknown error';
      
      console.error('GitHub API Error Details:', {
        status,
        statusText,
        message,
        url: error.config?.url,
      });
      
      if (status === 502 || status === 503 || status === 504) {
        throw new Error(`GitHub API temporarily unavailable (${status} ${statusText}). Please try again later.`);
      } else if (status === 401) {
        throw new Error('GitHub authentication failed. Please check GITHUB_TOKEN environment variable.');
      } else if (status === 403) {
        throw new Error('GitHub API rate limit exceeded or access forbidden. Please check your token permissions.');
      } else if (status === 404) {
        throw new Error('GitHub repository not found. Please check the repository path.');
      }
    } else if (error.request) {
      console.error('Network Error:', error.message);
      throw new Error(`Network error: ${error.message}. Please check your internet connection.`);
    }
    
    throw new Error(error.message || 'Failed to fetch skills from GitHub');
  }
}

/**
 * Sync Claude Skills to database
 */
export async function syncClaudeSkillsToDatabase(force: boolean = false): Promise<SyncResult> {
  const startTime = Date.now();
  
  try {
    console.log('🔄 Starting Claude Skills sync...');

    // Fetch latest data from GitHub
    const skills = await fetchClaudeSkillsFromGitHub();
    console.log(`✅ Fetched ${skills.length} skills from GitHub`);

    // Sync to database
    const syncStats = await syncClaudeSkills(skills);
    console.log(`📊 Sync stats: ${syncStats.inserted} inserted, ${syncStats.updated} updated, ${syncStats.errors} errors`);

    const duration = Date.now() - startTime;

    return {
      success: true,
      total: skills.length,
      inserted: syncStats.inserted,
      updated: syncStats.updated,
      errors: syncStats.errors,
      message: `Successfully synced ${skills.length} skills (${syncStats.inserted} inserted, ${syncStats.updated} updated)`,
    };
  } catch (error: any) {
    console.error('❌ Failed to sync Claude Skills:', error);
    const duration = Date.now() - startTime;

    return {
      success: false,
      total: 0,
      inserted: 0,
      updated: 0,
      errors: 1,
      message: `Sync failed: ${error.message || 'Unknown error'}`,
    };
  }
}

