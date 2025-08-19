#!/usr/bin/env node

/**
 * 检查和修复数据库中无效的GitHub链接
 * 使用方法: node scripts/fix-github-links.js [--auto-fix] [--dry-run]
 */

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 读取环境变量
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
    console.log('⚠️ 未找到 .env.local 文件');
  }
}

loadEnvFile();

// 检查必需的环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const githubToken = process.env.GITHUB_TOKEN;

console.log('🔧 环境变量检查:');
console.log(`   Supabase URL: ${supabaseUrl ? '✅ 已配置' : '❌ 未配置'}`);
console.log(`   Supabase Service Key: ${supabaseServiceKey ? '✅ 已配置' : '❌ 未配置'}`);
console.log(`   GitHub Token: ${githubToken ? '✅ 已配置' : '⚠️ 未配置 (可能受限制)'}`);
console.log('');

if (!supabaseUrl || !supabaseServiceKey || 
    supabaseUrl.includes('your-project') || supabaseServiceKey.includes('your-service')) {
  console.error('❌ 错误: Supabase环境变量未正确配置');
  console.error('请确保在 .env.local 中设置了真实的配置');
  process.exit(1);
}

// 解析命令行参数
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const autoFix = args.includes('--auto-fix');
const helpRequested = args.includes('--help') || args.includes('-h');

if (helpRequested) {
  console.log('GitHub链接检查和修复工具');
  console.log('');
  console.log('使用方法:');
  console.log('  node scripts/fix-github-links.js           # 仅检查，不修复');
  console.log('  node scripts/fix-github-links.js --dry-run # 模拟运行，显示会做什么');
  console.log('  node scripts/fix-github-links.js --auto-fix # 自动修复发现的问题');
  console.log('');
  process.exit(0);
}

// 初始化Supabase客户端
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 初始化GitHub客户端  
const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 10000,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'mcphubs-link-checker/1.0',
    ...(githubToken && { 'Authorization': `token ${githubToken}` }),
  }
});

// 检查GitHub仓库是否存在
async function checkGitHubRepo(owner, repo) {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}`);
    return {
      exists: true,
      data: response.data,
      url: response.data.html_url,
      fullName: response.data.full_name
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return { exists: false, error: '仓库不存在或已被删除' };
    } else if (error.response?.status === 403) {
      return { exists: false, error: 'API限制或权限不足' };
    }
    return { exists: false, error: `检查失败: ${error.message}` };
  }
}

// 尝试查找正确的仓库名
async function findCorrectRepo(originalOwner, originalRepo) {
  console.log(`   🔍 尝试查找 ${originalOwner}/${originalRepo} 的正确链接...`);
  
  // 可能的变体
  const variations = [
    // 大小写变体
    { owner: originalOwner.toLowerCase(), repo: originalRepo },
    { owner: originalOwner.toUpperCase(), repo: originalRepo },
    { owner: originalOwner, repo: originalRepo.toLowerCase() },
    { owner: originalOwner, repo: originalRepo.toUpperCase() },
    
    // 连字符和下划线变体
    { owner: originalOwner.replace('-', '_'), repo: originalRepo },
    { owner: originalOwner.replace('_', '-'), repo: originalRepo },
    { owner: originalOwner, repo: originalRepo.replace('-', '_') },
    { owner: originalOwner, repo: originalRepo.replace('_', '-') },
    
    // 可能的组织名变体
    { owner: `${originalOwner}-AI`, repo: originalRepo },
    { owner: `${originalOwner}AI`, repo: originalRepo },
    { owner: originalOwner.replace(/ai$/i, '-AI'), repo: originalRepo },
    
    // 可能的仓库名变体
    { owner: originalOwner, repo: `${originalRepo}-server` },
    { owner: originalOwner, repo: `${originalRepo}-client` },
    { owner: originalOwner, repo: originalRepo.replace(/^mcp-/, '') },
  ];

  // 搜索用户的所有仓库
  try {
    console.log(`   📂 搜索 ${originalOwner} 的所有仓库...`);
    const userRepos = await githubApi.get(`/users/${originalOwner}/repos?per_page=100`);
    
    // 查找名称相似的仓库
    const similarRepos = userRepos.data.filter(repo => {
      const repoName = repo.name.toLowerCase();
      const targetName = originalRepo.toLowerCase();
      
      return repoName.includes(targetName) || 
             targetName.includes(repoName) ||
             levenshteinDistance(repoName, targetName) <= 2;
    });
    
    if (similarRepos.length > 0) {
      console.log(`   ✅ 在 ${originalOwner} 下找到相似的仓库:`);
      similarRepos.forEach(repo => {
        console.log(`      - ${repo.full_name} (${repo.html_url})`);
      });
      
      // 返回最相似的仓库
      return {
        exists: true,
        data: similarRepos[0],
        url: similarRepos[0].html_url,
        fullName: similarRepos[0].full_name,
        suggested: true
      };
    }
  } catch (error) {
    console.log(`   ⚠️ 搜索 ${originalOwner} 的仓库失败: ${error.message}`);
  }

  // 尝试所有变体
  for (const variation of variations) {
    const result = await checkGitHubRepo(variation.owner, variation.repo);
    if (result.exists) {
      console.log(`   ✅ 找到正确的仓库: ${result.fullName}`);
      return { ...result, suggested: true };
    }
    
    // 避免API速率限制
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { exists: false, error: '未找到正确的仓库' };
}

// 计算字符串相似度 (Levenshtein距离)
function levenshteinDistance(str1, str2) {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

// 解析GitHub URL
function parseGitHubUrl(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') {
      return null;
    }
    
    const pathParts = urlObj.pathname.split('/').filter(part => part);
    if (pathParts.length >= 2) {
      return {
        owner: pathParts[0],
        repo: pathParts[1],
        fullName: `${pathParts[0]}/${pathParts[1]}`
      };
    }
  } catch (error) {
    return null;
  }
  return null;
}

// 获取所有项目
async function getAllProjects() {
  try {
    const { data, error } = await supabase
      .from('github_projects')
      .select('id, name, full_name, owner, url')
      .order('name');

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('获取项目列表失败:', error);
    return [];
  }
}

// 更新项目URL
async function updateProjectUrl(projectId, newUrl, newFullName) {
  if (dryRun) {
    console.log(`   🧪 [模拟] 会更新项目 ${projectId}: ${newUrl}`);
    return true;
  }

  try {
    const { error } = await supabase
      .from('github_projects')
      .update({ 
        url: newUrl,
        full_name: newFullName 
      })
      .eq('id', projectId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`   ❌ 更新项目 ${projectId} 失败:`, error);
    return false;
  }
}

// 主函数
async function main() {
  console.log('🚀 GitHub链接检查和修复工具');
  console.log('================================');
  
  if (dryRun) {
    console.log('🧪 模拟运行模式 - 不会实际修改数据');
  } else if (autoFix) {
    console.log('🔧 自动修复模式 - 将自动修复发现的问题');
  } else {
    console.log('👀 检查模式 - 仅检查不修复');
  }
  console.log('');

  const projects = await getAllProjects();
  if (projects.length === 0) {
    console.log('❌ 未找到任何项目数据');
    return;
  }

  console.log(`📊 总共检查 ${projects.length} 个项目`);
  console.log('');

  const results = {
    total: projects.length,
    valid: 0,
    invalid: 0,
    fixed: 0,
    unfixable: 0
  };

  const invalidProjects = [];
  const fixedProjects = [];

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const progress = `[${i + 1}/${projects.length}]`;
    
    console.log(`${progress} 检查: ${project.name}`);
    console.log(`   URL: ${project.url}`);

    // 解析GitHub URL
    const parsed = parseGitHubUrl(project.url);
    if (!parsed) {
      console.log(`   ⚠️ 无效的GitHub URL格式`);
      results.invalid++;
      invalidProjects.push({ ...project, reason: '无效URL格式' });
      console.log('');
      continue;
    }

    // 检查仓库是否存在
    const checkResult = await checkGitHubRepo(parsed.owner, parsed.repo);
    
    if (checkResult.exists) {
      console.log(`   ✅ 链接有效`);
      results.valid++;
    } else {
      console.log(`   ❌ 链接无效: ${checkResult.error}`);
      results.invalid++;

      // 尝试查找正确的仓库
      const fixResult = await findCorrectRepo(parsed.owner, parsed.repo);
      
      if (fixResult.exists && fixResult.suggested) {
        console.log(`   🔧 建议修复为: ${fixResult.url}`);
        
        if (autoFix || dryRun) {
          const updated = await updateProjectUrl(project.id, fixResult.url, fixResult.fullName);
          if (updated) {
            console.log(`   ✅ ${dryRun ? '[模拟]' : ''}已修复链接`);
            results.fixed++;
            fixedProjects.push({
              ...project,
              oldUrl: project.url,
              newUrl: fixResult.url,
              newFullName: fixResult.fullName
            });
          } else {
            console.log(`   ❌ 修复失败`);
            results.unfixable++;
          }
        } else {
          console.log(`   💡 可以使用 --auto-fix 参数自动修复`);
          results.unfixable++;
        }
      } else {
        console.log(`   ❌ 无法找到正确的仓库`);
        results.unfixable++;
        invalidProjects.push({ ...project, reason: checkResult.error });
      }
    }

    console.log('');
    
    // 避免API速率限制
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // 输出统计结果
  console.log('📊 检查完成统计:');
  console.log(`   总项目数: ${results.total}`);
  console.log(`   有效链接: ${results.valid} (${(results.valid/results.total*100).toFixed(1)}%)`);
  console.log(`   无效链接: ${results.invalid} (${(results.invalid/results.total*100).toFixed(1)}%)`);
  console.log(`   已修复: ${results.fixed}`);
  console.log(`   无法修复: ${results.unfixable}`);
  console.log('');

  // 生成报告
  if (invalidProjects.length > 0) {
    console.log('❌ 无效项目列表:');
    invalidProjects.forEach(project => {
      console.log(`   - ${project.name}: ${project.url}`);
      console.log(`     原因: ${project.reason}`);
    });
    console.log('');
  }

  if (fixedProjects.length > 0) {
    console.log(`✅ ${dryRun ? '[模拟]' : ''}已修复项目列表:`);
    fixedProjects.forEach(project => {
      console.log(`   - ${project.name}:`);
      console.log(`     旧链接: ${project.oldUrl}`);
      console.log(`     新链接: ${project.newUrl}`);
    });
    console.log('');
  }

  // 保存报告
  const report = {
    timestamp: new Date().toISOString(),
    mode: dryRun ? 'dry-run' : (autoFix ? 'auto-fix' : 'check-only'),
    summary: results,
    invalidProjects,
    fixedProjects
  };

  const reportPath = `github-links-report-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 详细报告已保存到: ${reportPath}`);

  // 推荐下一步操作
  if (!dryRun && !autoFix && results.invalid > 0) {
    console.log('');
    console.log('💡 推荐操作:');
    console.log('  1. 运行 node scripts/fix-github-links.js --dry-run 查看修复预览');
    console.log('  2. 运行 node scripts/fix-github-links.js --auto-fix 自动修复问题');
  }
}

// 错误处理
process.on('unhandledRejection', (error) => {
  console.error('❌ 未处理的异常:', error);
  process.exit(1);
});

main().catch(error => {
  console.error('❌ 脚本执行失败:', error);
  process.exit(1);
});
