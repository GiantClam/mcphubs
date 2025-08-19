#!/usr/bin/env node

/**
 * 检查并修复数据库中不完整的项目数据
 * 使用方法: node scripts/fix-incomplete-projects.js
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

// Supabase配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 错误: 缺少Supabase环境变量');
  console.error('请确保设置了 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY');
  console.error('当前环境变量:');
  console.error(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '已设置' : '未设置'}`);
  console.error(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '已设置' : '未设置'}`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 检查项目数据完整性
async function checkProjectIntegrity() {
  console.log('🔍 检查项目数据完整性...');
  
  try {
    const { data: projects, error } = await supabase
      .from('github_projects')
      .select('*')
      .order('stars', { ascending: false });

    if (error) {
      throw error;
    }

    console.log(`📊 总共 ${projects.length} 个项目`);

    const issues = {
      missingDescription: [],
      missingImageUrl: [],
      missingOwnerAvatar: [],
      missingTopics: [],
      missingReadmeContent: [],
      missingRelevance: [],
      total: 0
    };

    projects.forEach(project => {
      const projectIssues = [];
      
      if (!project.description || project.description.trim() === '') {
        issues.missingDescription.push(project.id);
        projectIssues.push('description');
      }
      
      if (!project.image_url || project.image_url.trim() === '') {
        issues.missingImageUrl.push(project.id);
        projectIssues.push('image_url');
      }
      
      if (!project.owner_avatar || project.owner_avatar.trim() === '') {
        issues.missingOwnerAvatar.push(project.id);
        projectIssues.push('owner_avatar');
      }
      
      if (!project.topics || project.topics.length === 0) {
        issues.missingTopics.push(project.id);
        projectIssues.push('topics');
      }
      
      if (!project.readme_content || project.readme_content.trim() === '') {
        issues.missingReadmeContent.push(project.id);
        projectIssues.push('readme_content');
      }
      
      if (!project.relevance || project.relevance.trim() === '') {
        issues.missingRelevance.push(project.id);
        projectIssues.push('relevance');
      }
      
      if (projectIssues.length > 0) {
        issues.total++;
        console.log(`⚠️  ${project.name} (${project.id}): 缺少 ${projectIssues.join(', ')}`);
      }
    });

    console.log('\n📋 问题统计:');
    console.log(`- 缺少描述: ${issues.missingDescription.length} 个项目`);
    console.log(`- 缺少图片URL: ${issues.missingImageUrl.length} 个项目`);
    console.log(`- 缺少所有者头像: ${issues.missingOwnerAvatar.length} 个项目`);
    console.log(`- 缺少标签: ${issues.missingTopics.length} 个项目`);
    console.log(`- 缺少README内容: ${issues.missingReadmeContent.length} 个项目`);
    console.log(`- 缺少相关性评级: ${issues.missingRelevance.length} 个项目`);
    console.log(`- 总计有问题的项目: ${issues.total} 个`);

    return { projects, issues };
  } catch (error) {
    console.error('❌ 检查项目数据时出错:', error);
    throw error;
  }
}

// 修复项目数据
async function fixProjectData(projects, issues) {
  console.log('\n🔧 开始修复项目数据...');
  
  let fixedCount = 0;
  
  for (const project of projects) {
    const fixes = {};
    let needsUpdate = false;
    
    // 修复缺少的描述
    if (!project.description || project.description.trim() === '') {
      fixes.description = `${project.name} 是一个与模型上下文协议(MCP)相关的项目。`;
      needsUpdate = true;
    }
    
    // 修复缺少的图片URL
    if (!project.image_url || project.image_url.trim() === '') {
      fixes.image_url = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop';
      needsUpdate = true;
    }
    
    // 修复缺少的所有者头像
    if (!project.owner_avatar || project.owner_avatar.trim() === '') {
      fixes.owner_avatar = 'https://avatars.githubusercontent.com/u/1?v=4';
      needsUpdate = true;
    }
    
    // 修复缺少的标签
    if (!project.topics || project.topics.length === 0) {
      fixes.topics = ['mcp', 'model-context-protocol'];
      needsUpdate = true;
    }
    
    // 修复缺少的相关性评级
    if (!project.relevance || project.relevance.trim() === '') {
      fixes.relevance = 'Medium';
      needsUpdate = true;
    }
    
    // 修复缺少的README内容
    if (!project.readme_content || project.readme_content.trim() === '') {
      fixes.readme_content = generateBasicReadme(project);
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      try {
        const { error } = await supabase
          .from('github_projects')
          .update(fixes)
          .eq('id', project.id);
        
        if (error) {
          console.error(`❌ 修复项目 ${project.name} 失败:`, error);
        } else {
          console.log(`✅ 已修复项目: ${project.name} (${Object.keys(fixes).join(', ')})`);
          fixedCount++;
        }
      } catch (error) {
        console.error(`❌ 修复项目 ${project.name} 时出错:`, error);
      }
    }
  }
  
  console.log(`\n🎉 修复完成! 总共修复了 ${fixedCount} 个项目`);
}

// 生成基本的README内容
function generateBasicReadme(project) {
  return `# ${project.name}

${project.description || '这是一个MCP相关项目。'}

## 项目信息

- **所有者**: ${project.owner}
- **语言**: ${project.language || 'Unknown'}
- **⭐ Stars**: ${project.stars}
- **🍴 Forks**: ${project.forks}

## 标签

${(project.topics || ['mcp', 'model-context-protocol']).map(topic => `- ${topic}`).join('\n')}

## 相关链接

- [GitHub 仓库](${project.url})
- [MCP 官方文档](https://modelcontextprotocol.io)

## 关于 Model Context Protocol

Model Context Protocol (MCP) 是 Anthropic 开发的一个协议，用于构建大型语言模型的上下文管理系统。

### 主要特性

- 🤖 智能上下文管理
- 📊 结构化数据处理
- 🔗 模型间通信协议
- ⚡ 高效的信息传递

### 使用场景

- 增强语言模型的理解能力
- 改善模型响应质量
- 构建更有效的AI应用程序

---

*此README由MCPHubs自动生成。如需查看完整项目信息，请访问 [GitHub仓库](${project.url})。*
`;
}

// 主函数
async function main() {
  console.log('🚀 MCPHubs 项目数据修复工具');
  console.log('================================\n');
  
  try {
    // 检查数据完整性
    const { projects, issues } = await checkProjectIntegrity();
    
    if (issues.total === 0) {
      console.log('🎉 所有项目数据都是完整的，无需修复!');
      return;
    }
    
    // 询问是否继续修复
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question('\n是否继续修复这些问题? (y/N): ', resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      await fixProjectData(projects, issues);
    } else {
      console.log('取消修复操作。');
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