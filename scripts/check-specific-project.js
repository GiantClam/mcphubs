const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
  console.log('✅ 已加载 .env.local 文件');
} else {
  console.log('⚠️ 未找到 .env.local 文件');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 配置');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSpecificProject(projectName) {
  console.log(`🔍 检查项目: ${projectName}`);
  console.log('=====================================');

  try {
    // 查询项目数据
    const { data: projects, error } = await supabase
      .from('github_projects')
      .select('*')
      .ilike('name', `%${projectName}%`)
      .limit(5);

    if (error) {
      console.error('❌ 查询失败:', error);
      return;
    }

    if (!projects || projects.length === 0) {
      console.log('❌ 未找到项目');
      return;
    }

    console.log(`📊 找到 ${projects.length} 个项目:`);
    console.log('');

    projects.forEach((project, index) => {
      console.log(`📋 项目 ${index + 1}: ${project.name}`);
      console.log(`   ID: ${project.id}`);
      console.log(`   Owner: ${project.owner}`);
      console.log(`   Description: ${project.description}`);
      console.log(`   Relevance: ${project.relevance}`);
      console.log('');
      
      console.log('🔍 AI分析字段检查:');
      console.log(`   gemini_summary: ${project.gemini_summary ? '✅ 有内容' : '❌ 无内容'}`);
      if (project.gemini_summary) {
        console.log(`   内容预览: ${project.gemini_summary.substring(0, 100)}...`);
        // 检查是否包含中文
        if (/[\u4e00-\u9fff]/.test(project.gemini_summary)) {
          console.log('   ⚠️ 包含中文内容!');
        } else {
          console.log('   ✅ 纯英文内容');
        }
      }
      
      console.log(`   gemini_key_features: ${project.gemini_key_features ? '✅ 有内容' : '❌ 无内容'}`);
      if (project.gemini_key_features) {
        const keyFeaturesStr = Array.isArray(project.gemini_key_features) 
          ? project.gemini_key_features.join(', ') 
          : String(project.gemini_key_features);
        console.log(`   内容预览: ${keyFeaturesStr.substring(0, 100)}...`);
        // 检查是否包含中文
        if (/[\u4e00-\u9fff]/.test(keyFeaturesStr)) {
          console.log('   ⚠️ 包含中文内容!');
        } else {
          console.log('   ✅ 纯英文内容');
        }
      }
      
      console.log(`   gemini_use_cases: ${project.gemini_use_cases ? '✅ 有内容' : '❌ 无内容'}`);
      if (project.gemini_use_cases) {
        const useCasesStr = Array.isArray(project.gemini_use_cases) 
          ? project.gemini_use_cases.join(', ') 
          : String(project.gemini_use_cases);
        console.log(`   内容预览: ${useCasesStr.substring(0, 100)}...`);
        // 检查是否包含中文
        if (/[\u4e00-\u9fff]/.test(useCasesStr)) {
          console.log('   ⚠️ 包含中文内容!');
        } else {
          console.log('   ✅ 纯英文内容');
        }
      }
      
      console.log('');
      console.log('📝 完整内容:');
      if (project.gemini_summary) {
        console.log('   Summary:', project.gemini_summary);
      }
      if (project.gemini_key_features) {
        const keyFeaturesStr = Array.isArray(project.gemini_key_features) 
          ? project.gemini_key_features.join(', ') 
          : String(project.gemini_key_features);
        console.log('   Key Features:', keyFeaturesStr);
      }
      if (project.gemini_use_cases) {
        const useCasesStr = Array.isArray(project.gemini_use_cases) 
          ? project.gemini_use_cases.join(', ') 
          : String(project.gemini_use_cases);
        console.log('   Use Cases:', useCasesStr);
      }
      console.log('');
      console.log('-------------------------------------');
      console.log('');
    });

  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
}

// 获取命令行参数
const projectName = process.argv[2];

if (!projectName) {
  console.log('🚀 MCPHubs 项目数据检查工具');
  console.log('=====================================');
  console.log('');
  console.log('用法: node scripts/check-specific-project.js <项目名称>');
  console.log('');
  console.log('示例:');
  console.log('  node scripts/check-specific-project.js xcodebuildmcp');
  console.log('  node scripts/check-specific-project.js cameroncooke');
  console.log('');
  process.exit(1);
}

checkSpecificProject(projectName); 