#!/usr/bin/env node

/**
 * 检查定时任务中AI分析结果的语言
 * 确保所有分析结果都是英文
 * 使用方法: node scripts/check-analysis-language.js
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 错误: 缺少Supabase环境变量');
  console.error('请确保设置了 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 检测文本中的中文字符
function containsChinese(text) {
  if (!text) return false;
  return /[\u4e00-\u9fff]/.test(text);
}

// 检查分析结果的语言
async function checkAnalysisLanguage() {
  console.log('🔍 检查AI分析结果的语言...');
  
  try {
    // 获取有分析结果的项目
    const { data: projects, error } = await supabase
      .from('github_projects')
      .select('id, name, description, gemini_summary, gemini_key_features, gemini_use_cases, gemini_analyzed_at, relevance_score')
      .not('gemini_analyzed_at', 'is', null)
      .order('gemini_analyzed_at', { ascending: false });

    if (error) {
      throw error;
    }

    console.log(`📊 总共 ${projects.length} 个已分析的项目`);

    const languageStats = {
      totalAnalyzed: projects.length,
      chineseSummary: 0,
      chineseKeyFeatures: 0,
      chineseUseCases: 0,
      fullyEnglish: 0,
      partialChinese: 0,
      recentAnalysis: 0
    };

    const problemProjects = [];
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 1); // 最近1天

    // 检查每个项目的分析结果
    for (const project of projects) {
      let hasChineseContent = false;
      const issues = [];

      // 检查分析时间（最近的分析）
      const analyzedAt = new Date(project.gemini_analyzed_at);
      const isRecent = analyzedAt > recentDate;
      if (isRecent) {
        languageStats.recentAnalysis++;
      }

      // 检查摘要
      if (containsChinese(project.gemini_summary)) {
        languageStats.chineseSummary++;
        issues.push('summary');
        hasChineseContent = true;
      }

      // 检查关键特性
      if (project.gemini_key_features && project.gemini_key_features.some(f => containsChinese(f))) {
        languageStats.chineseKeyFeatures++;
        issues.push('keyFeatures');
        hasChineseContent = true;
      }

      // 检查使用案例
      if (project.gemini_use_cases && project.gemini_use_cases.some(u => containsChinese(u))) {
        languageStats.chineseUseCases++;
        issues.push('useCases');
        hasChineseContent = true;
      }

      if (hasChineseContent) {
        languageStats.partialChinese++;
        problemProjects.push({
          ...project,
          issues,
          isRecent
        });
        
        const recentFlag = isRecent ? ' 🕐最近分析' : '';
        console.log(`🔤 发现中文内容: ${project.name} (${project.id}) - ${issues.join(', ')}${recentFlag}`);
      } else {
        languageStats.fullyEnglish++;
      }
    }

    console.log('\n📋 分析结果语言统计:');
    console.log(`- 总分析项目: ${languageStats.totalAnalyzed}`);
    console.log(`- 完全英文: ${languageStats.fullyEnglish} 个项目`);
    console.log(`- 包含中文: ${languageStats.partialChinese} 个项目`);
    console.log(`- 中文摘要: ${languageStats.chineseSummary} 个项目`);
    console.log(`- 中文关键特性: ${languageStats.chineseKeyFeatures} 个项目`);
    console.log(`- 中文使用案例: ${languageStats.chineseUseCases} 个项目`);
    console.log(`- 最近1天分析: ${languageStats.recentAnalysis} 个项目`);

    // 检查英文占比
    const englishPercentage = Math.round((languageStats.fullyEnglish / languageStats.totalAnalyzed) * 100);
    console.log(`\n📈 英文分析占比: ${englishPercentage}%`);

    if (englishPercentage >= 95) {
      console.log('✅ 优秀: 分析结果基本都是英文');
    } else if (englishPercentage >= 80) {
      console.log('🟡 良好: 大部分分析结果是英文');
    } else {
      console.log('🔴 需要改进: 存在较多中文分析结果');
    }

    // 检查最近的分析结果
    const recentChineseProjects = problemProjects.filter(p => p.isRecent);
    if (recentChineseProjects.length > 0) {
      console.log(`\n⚠️ 最近1天的分析中有 ${recentChineseProjects.length} 个项目包含中文内容:`);
      recentChineseProjects.forEach(project => {
        console.log(`  - ${project.name}: ${project.issues.join(', ')}`);
      });
      console.log('\n🔧 建议: 检查定时任务的分析逻辑，确保生成英文结果');
    } else {
      console.log('\n✅ 最近的分析结果都是英文');
    }

    return { languageStats, problemProjects };
  } catch (error) {
    console.error('❌ 检查分析语言时出错:', error);
    throw error;
  }
}

// 检查分析函数的配置
function checkAnalysisConfiguration() {
  console.log('\n🔧 检查分析函数配置...');
  
  const analysisFile = path.join(process.cwd(), 'src/lib/analysis.ts');
  if (fs.existsSync(analysisFile)) {
    const content = fs.readFileSync(analysisFile, 'utf8');
    
    const checks = {
      hasEnglishPrompt: content.includes('Please provide the following in JSON format'),
      hasChineseContent: /[\u4e00-\u9fff]/.test(content),
      hasGeminiModel: content.includes('gemini-2.5-flash'),
      hasTemperatureConfig: content.includes('temperature: 0')
    };

    console.log('📝 分析函数配置检查:');
    console.log(`  - 英文提示语: ${checks.hasEnglishPrompt ? '✅' : '❌'}`);
    console.log(`  - 包含中文: ${checks.hasChineseContent ? '⚠️ 是' : '✅ 否'}`);
    console.log(`  - Gemini模型: ${checks.hasGeminiModel ? '✅' : '❌'}`);
    console.log(`  - 温度配置: ${checks.hasTemperatureConfig ? '✅' : '❌'}`);

    if (checks.hasChineseContent) {
      console.log('\n🔧 建议: 分析函数中存在中文内容，可能影响生成英文结果');
    }

    return checks;
  } else {
    console.log('❌ 未找到分析函数文件');
    return null;
  }
}

// 生成修复建议
function generateRecommendations(languageStats, problemProjects) {
  console.log('\n🎯 修复建议:');
  
  if (languageStats.partialChinese === 0) {
    console.log('✅ 所有分析结果都是英文，系统运行良好!');
    return;
  }

  console.log('1. 🔧 立即修复措施:');
  console.log('   - 运行翻译脚本: node scripts/translate-project-details.js');
  console.log('   - 重新分析最近的中文项目');

  console.log('\n2. 🛠️ 系统改进措施:');
  console.log('   - 确保分析函数只生成英文内容');
  console.log('   - 在定时任务中添加语言检查');
  console.log('   - 设置Gemini模型的语言偏好');

  console.log('\n3. 📊 监控措施:');
  console.log('   - 定期运行此检查脚本');
  console.log('   - 在同步完成后自动检查语言');
  console.log('   - 设置语言质量报警');

  if (problemProjects.length > 10) {
    console.log('\n⚠️ 问题较多，建议批量重新分析');
  }
}

// 主函数
async function main() {
  console.log('🚀 MCPHubs AI分析语言检查工具');
  console.log('==================================\n');
  
  try {
    // 检查分析结果语言
    const { languageStats, problemProjects } = await checkAnalysisLanguage();
    
    // 检查分析函数配置
    const configChecks = checkAnalysisConfiguration();
    
    // 生成修复建议
    generateRecommendations(languageStats, problemProjects);

    console.log('\n📋 总结:');
    console.log(`- 定时任务分析状态: ${languageStats.fullyEnglish > languageStats.partialChinese ? '✅ 良好' : '⚠️ 需要改进'}`);
    console.log(`- 英文分析占比: ${Math.round((languageStats.fullyEnglish / languageStats.totalAnalyzed) * 100)}%`);
    console.log(`- 需要翻译的项目: ${languageStats.partialChinese} 个`);
    
  } catch (error) {
    console.error('❌ 执行失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
} 