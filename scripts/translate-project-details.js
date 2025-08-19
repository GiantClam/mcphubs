#!/usr/bin/env node

/**
 * 检查数据库中项目详情的中文内容并翻译为英文
 * 使用 Gemini-2.5-flash 模型进行翻译
 * 使用方法: node scripts/translate-project-details.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 读取环境变量文件
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    
    envLines.forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
    
    console.log('✅ 已加载 .env.local 文件');
  } else {
    console.log('⚠️ 未找到 .env.local 文件，使用系统环境变量');
  }
}

// 加载环境变量
loadEnvFile();

// 检查必需的环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleCloudProject = process.env.GOOGLE_CLOUD_PROJECT;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 错误: 缺少Supabase环境变量');
  console.error('请确保设置了 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!googleCloudProject) {
  console.warn('⚠️ 警告: 未设置 GOOGLE_CLOUD_PROJECT，将使用模拟翻译');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 初始化 Gemini 模型（如果可用）
let geminiModel = null;
async function initializeGemini() {
  try {
    if (!googleCloudProject) {
      return null;
    }

    // 设置代理环境变量
    const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy || 'http://127.0.0.1:7890';
    process.env.HTTPS_PROXY = proxyUrl;
    process.env.https_proxy = proxyUrl;
    process.env.HTTP_PROXY = proxyUrl;
    process.env.http_proxy = proxyUrl;
    
    console.log(`🌐 设置代理环境变量: ${proxyUrl}`);

    const { ChatVertexAI } = await import('@langchain/google-vertexai');
    
    // 获取Google凭据 - 修复凭据配置
    function getGoogleCredentials() {
      // 1. 优先从环境变量读取JSON字符串
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        try {
          const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
          console.log('✅ 使用环境变量 GOOGLE_APPLICATION_CREDENTIALS_JSON');
          // 为ChatVertexAI提供正确的凭据格式
          return { 
            authOptions: { 
              credentials: credentials
            }
          };
        } catch (error) {
          console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:", error);
        }
      }
      
      // 2. 从环境变量指定的文件路径读取
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.log('✅ 使用环境变量 GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
        return { 
          authOptions: { 
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS 
          }
        };
      }
      
      // 3. 尝试读取项目根目录的默认文件
      const fs = require('fs');
      const path = require('path');
      const defaultCredPath = path.join(__dirname, '..', 'zippy-aurora-444204-q2-458dbb8dd988.json');
      
      if (fs.existsSync(defaultCredPath)) {
        try {
          const credentialsJson = fs.readFileSync(defaultCredPath, 'utf8');
          const credentials = JSON.parse(credentialsJson);
          console.log('✅ 使用本地文件:', defaultCredPath);
          return { 
            authOptions: { 
              credentials: credentials
            }
          };
        } catch (error) {
          console.error("Failed to read local credentials file:", error);
        }
      }
      
      console.warn('⚠️  未找到Google Cloud凭据，请配置环境变量或确保JSON文件存在');
      return {};
    }

    // 获取凭据配置
    const authConfig = getGoogleCredentials();
    
    // 构建模型配置
    const modelConfig = {
      modelName: "gemini-2.5-flash",
      temperature: 0.1,
      project: googleCloudProject,
      location: process.env.VERTEX_LOCATION || "us-central1",
      ...authConfig
    };

    console.log('📋 模型配置:', {
      project: modelConfig.project,
      location: modelConfig.location,
      hasAuthOptions: !!authConfig.authOptions
    });

    const model = new ChatVertexAI(modelConfig);

    console.log('✅ Gemini-2.5-flash 模型初始化成功');
    return model;
  } catch (error) {
    console.warn('⚠️ Gemini模型初始化失败:', error.message);
    return null;
  }
}

// 检测文本中的中文字符
function containsChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

// 使用Gemini翻译文本
async function translateWithGemini(text, field) {
  if (!geminiModel) {
    // 模拟翻译
    return `[Translated] ${text}`;
  }

  try {
    const prompt = `
Please translate the following Chinese text to English. Keep the translation natural and professional.
Only return the translated English text, no explanations or additional content.

Text to translate: ${text}
`;

    const response = await geminiModel.invoke(prompt);
    const translatedText = response.content.toString().trim();
    
    console.log(`  📝 翻译 ${field}: "${text.substring(0, 50)}..." → "${translatedText.substring(0, 50)}..."`);
    return translatedText;
  } catch (error) {
    console.warn(`  ⚠️ 翻译失败 ${field}:`, error.message);
    return text; // 翻译失败时返回原文
  }
}

// 翻译数组内容
async function translateArray(array, fieldName) {
  if (!array || array.length === 0) return array;
  
  const translatedArray = [];
  for (const item of array) {
    if (containsChinese(item)) {
      const translated = await translateWithGemini(item, fieldName);
      translatedArray.push(translated);
    } else {
      translatedArray.push(item);
    }
  }
  return translatedArray;
}

// 检查和翻译项目详情
async function checkAndTranslateProjects() {
  console.log('🔍 检查数据库中的项目详情...');
  
  try {
    const { data: projects, error } = await supabase
      .from('github_projects')
      .select('*')
      .order('stars', { ascending: false });

    if (error) {
      throw error;
    }

    console.log(`📊 总共 ${projects.length} 个项目`);

    const chineseProjects = [];
    const statistics = {
      totalProjects: projects.length,
      chineseDescription: 0,
      chineseSummary: 0,
      chineseKeyFeatures: 0,
      chineseUseCases: 0,
      needsTranslation: 0
    };

    // 检查每个项目
    for (const project of projects) {
      let needsTranslation = false;
      const issues = [];

      // 检查描述
      if (project.description && containsChinese(project.description)) {
        statistics.chineseDescription++;
        issues.push('description');
        needsTranslation = true;
      }

      // 检查Gemini分析摘要
      if (project.gemini_summary && containsChinese(project.gemini_summary)) {
        statistics.chineseSummary++;
        issues.push('gemini_summary');
        needsTranslation = true;
      }

      // 检查关键特性
      if (project.gemini_key_features && project.gemini_key_features.some(f => containsChinese(f))) {
        statistics.chineseKeyFeatures++;
        issues.push('gemini_key_features');
        needsTranslation = true;
      }

      // 检查使用案例
      if (project.gemini_use_cases && project.gemini_use_cases.some(u => containsChinese(u))) {
        statistics.chineseUseCases++;
        issues.push('gemini_use_cases');
        needsTranslation = true;
      }

      if (needsTranslation) {
        statistics.needsTranslation++;
        chineseProjects.push({
          ...project,
          issues
        });
        
        console.log(`🔤 发现中文内容: ${project.name} (${project.id}) - ${issues.join(', ')}`);
      }
    }

    console.log('\n📋 中文内容统计:');
    console.log(`- 总项目数: ${statistics.totalProjects}`);
    console.log(`- 中文描述: ${statistics.chineseDescription} 个项目`);
    console.log(`- 中文摘要: ${statistics.chineseSummary} 个项目`);
    console.log(`- 中文关键特性: ${statistics.chineseKeyFeatures} 个项目`);
    console.log(`- 中文使用案例: ${statistics.chineseUseCases} 个项目`);
    console.log(`- 需要翻译的项目: ${statistics.needsTranslation} 个`);

    return { chineseProjects, statistics };
  } catch (error) {
    console.error('❌ 检查项目数据时出错:', error);
    throw error;
  }
}

// 翻译项目内容
async function translateProjects(chineseProjects) {
  console.log('\n🔧 开始翻译项目内容...');
  
  let translatedCount = 0;
  
  for (const project of chineseProjects) {
    console.log(`\n🌐 翻译项目: ${project.name} (${project.id})`);
    
    const updates = {};
    let hasUpdates = false;

    // 翻译描述
    if (project.description && containsChinese(project.description)) {
      updates.description = await translateWithGemini(project.description, 'description');
      hasUpdates = true;
    }

    // 翻译Gemini分析摘要
    if (project.gemini_summary && containsChinese(project.gemini_summary)) {
      updates.gemini_summary = await translateWithGemini(project.gemini_summary, 'gemini_summary');
      hasUpdates = true;
    }

    // 翻译关键特性
    if (project.gemini_key_features && project.gemini_key_features.some(f => containsChinese(f))) {
      updates.gemini_key_features = await translateArray(project.gemini_key_features, 'gemini_key_features');
      hasUpdates = true;
    }

    // 翻译使用案例
    if (project.gemini_use_cases && project.gemini_use_cases.some(u => containsChinese(u))) {
      updates.gemini_use_cases = await translateArray(project.gemini_use_cases, 'gemini_use_cases');
      hasUpdates = true;
    }

    // 更新数据库
    if (hasUpdates) {
      try {
        const { error } = await supabase
          .from('github_projects')
          .update(updates)
          .eq('id', project.id);
        
        if (error) {
          console.error(`❌ 更新项目 ${project.name} 失败:`, error);
        } else {
          console.log(`✅ 已翻译项目: ${project.name} (${Object.keys(updates).join(', ')})`);
          translatedCount++;
        }
      } catch (error) {
        console.error(`❌ 更新项目 ${project.name} 时出错:`, error);
      }
    }
    
    // 添加延迟以避免API速率限制
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n🎉 翻译完成! 总共翻译了 ${translatedCount} 个项目`);
}

// 主函数
async function main() {
  console.log('🚀 MCPHubs 项目详情翻译工具');
  console.log('================================\n');
  
  try {
    // 初始化Gemini模型
    geminiModel = await initializeGemini();
    
    // 检查项目中的中文内容
    const { chineseProjects, statistics } = await checkAndTranslateProjects();
    
    if (statistics.needsTranslation === 0) {
      console.log('🎉 所有项目详情都已是英文，无需翻译!');
      return;
    }
    
    // 询问是否继续翻译
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question(`\n发现 ${statistics.needsTranslation} 个项目需要翻译，是否继续? (y/N): `, resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      await translateProjects(chineseProjects);
    } else {
      console.log('取消翻译操作。');
    }
    
  } catch (error) {
    console.error('❌ 执行失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
} 