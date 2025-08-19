#!/usr/bin/env node

/**
 * MCPHubs Vercel 诊断脚本
 * 用于检查环境变量配置和服务连接状态
 */

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(title) {
  console.log();
  log('bright', `${'='.repeat(50)}`);
  log('bright', ` ${title}`);
  log('bright', `${'='.repeat(50)}`);
}

function checkmark(success, message) {
  log(success ? 'green' : 'red', `${success ? '✅' : '❌'} ${message}`);
}

async function diagnoseEnvironment() {
  header('MCPHubs Vercel 环境诊断');
  
  // 1. 检查环境变量
  header('1. 环境变量检查');
  
  const requiredEnvVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'GITHUB_TOKEN': process.env.GITHUB_TOKEN,
    'SYNC_API_KEY': process.env.SYNC_API_KEY,
    'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET
  };

  let envVarsOk = true;
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    const isSet = !!value && !value.includes('placeholder') && !value.includes('your-');
    checkmark(isSet, `${key}: ${isSet ? '已配置' : '未配置或包含占位符'}`);
    if (!isSet) envVarsOk = false;
    
    if (value && (value.includes('placeholder') || value.includes('your-'))) {
      log('yellow', `  ⚠️  检测到占位符值: ${value.substring(0, 20)}...`);
    }
  }

  // 2. Supabase 连接测试
  header('2. Supabase 数据库连接测试');
  
  let supabaseOk = false;
  if (requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL && requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(
        requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL,
        requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );

      // 测试基本连接
      const { data, error } = await supabase
        .from('github_projects')
        .select('count')
        .limit(1);

      if (error) {
        checkmark(false, `数据库连接失败: ${error.message}`);
        
        // 检查常见错误
        if (error.message.includes('relation "github_projects" does not exist')) {
          log('yellow', '  ⚠️  github_projects 表不存在，需要运行数据库迁移');
        } else if (error.message.includes('Invalid API key')) {
          log('yellow', '  ⚠️  Supabase Service Role Key 无效');
        } else if (error.message.includes('Project not found')) {
          log('yellow', '  ⚠️  Supabase URL 无效');
        }
      } else {
        checkmark(true, '数据库连接成功');
        supabaseOk = true;
        
        // 检查项目数量
        const { count } = await supabase
          .from('github_projects')
          .select('*', { count: 'exact' });
        
        log('blue', `  📊 数据库中有 ${count || 0} 个项目`);
      }
    } catch (err) {
      checkmark(false, `Supabase 连接异常: ${err.message}`);
    }
  } else {
    checkmark(false, 'Supabase 环境变量未配置');
  }

  // 3. GitHub API 测试
  header('3. GitHub API 连接测试');
  
  let githubOk = false;
  if (requiredEnvVars.GITHUB_TOKEN) {
    try {
      const response = await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${requiredEnvVars.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'mcphubs-diagnostic/1.0'
        },
        timeout: 10000
      });

      checkmark(true, `GitHub API 连接成功 (用户: ${response.data.login})`);
      githubOk = true;

      // 检查 API 限制
      const rateLimit = await axios.get('https://api.github.com/rate_limit', {
        headers: {
          'Authorization': `token ${requiredEnvVars.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      const { remaining, limit } = rateLimit.data.rate;
      log('blue', `  📊 API 限制: ${remaining}/${limit} 剩余`);

      if (remaining < 100) {
        log('yellow', '  ⚠️  GitHub API 调用次数即将耗尽');
      }

    } catch (err) {
      checkmark(false, `GitHub API 连接失败: ${err.response?.status || err.message}`);
      
      if (err.response?.status === 401) {
        log('yellow', '  ⚠️  GitHub Token 无效或已过期');
      } else if (err.response?.status === 403) {
        log('yellow', '  ⚠️  GitHub API 限制或权限不足');
      }
    }
  } else {
    checkmark(false, 'GitHub Token 未配置');
  }

  // 4. 测试项目获取
  header('4. 项目获取测试');
  
  if (githubOk) {
    try {
      // 测试搜索一个简单的查询
      const searchResponse = await axios.get('https://api.github.com/search/repositories', {
        params: {
          q: 'model context protocol',
          sort: 'stars',
          order: 'desc',
          per_page: 5
        },
        headers: {
          'Authorization': `token ${requiredEnvVars.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      const projectCount = searchResponse.data.total_count;
      checkmark(true, `GitHub 搜索测试成功，找到 ${projectCount} 个相关项目`);

      if (projectCount === 0) {
        log('yellow', '  ⚠️  搜索结果为空，可能是搜索条件问题');
      }

    } catch (err) {
      checkmark(false, `GitHub 搜索测试失败: ${err.message}`);
    }
  }

  // 5. 总结和建议
  header('5. 诊断总结');
  
  if (envVarsOk && supabaseOk && githubOk) {
    log('green', '🎉 所有检查都通过了！系统应该正常工作。');
    log('blue', '如果网站仍然显示0个项目，可能是缓存问题，请尝试：');
    log('blue', '  1. 在 Vercel 控制台重新部署项目');
    log('blue', '  2. 等待几分钟让缓存刷新');
    log('blue', '  3. 访问 /api/sync 手动触发同步');
  } else {
    log('red', '❌ 发现以下问题需要解决：');
    
    if (!envVarsOk) {
      log('yellow', '  • 环境变量配置不完整');
    }
    if (!supabaseOk) {
      log('yellow', '  • Supabase 数据库连接失败');
    }
    if (!githubOk) {
      log('yellow', '  • GitHub API 访问失败');
    }
  }

  header('6. 推荐操作');
  log('blue', '1. 检查 Vercel 项目设置中的环境变量配置');
  log('blue', '2. 确认环境变量值不包含占位符文本');
  log('blue', '3. 验证 GitHub Token 权限包含 public_repo 和 read:user');
  log('blue', '4. 确认 Supabase 项目 URL 和密钥正确');
  log('blue', '5. 在修改环境变量后重新部署项目');
}

// 运行诊断
diagnoseEnvironment().catch(console.error); 