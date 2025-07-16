#!/usr/bin/env node

/**
 * MCPHubs 安全检查脚本
 * 在部署前运行此脚本以确保没有敏感信息泄露
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始安全检查...\n');

// 危险模式列表
const dangerousPatterns = [
  /api[_-]?key\s*=\s*['"][^'"]+['"]/gi,
  /secret\s*=\s*['"][^'"]+['"]/gi,
  /password\s*=\s*['"][^'"]+['"]/gi,
  /token\s*=\s*['"][^'"]+['"]/gi,
  /default-sync-key/gi,
  // 排除明显的示例值
  !/your[_-]?api[_-]?key/gi,
  !/example[_-]?secret/gi,
  !/placeholder/gi
];

// 需要检查的文件扩展名
const checkExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];

// 需要跳过的目录
const skipDirs = ['node_modules', '.git', '.next', 'dist', 'build'];

let securityIssues = [];

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      dangerousPatterns.forEach(pattern => {
        if (pattern.test(line)) {
          securityIssues.push({
            file: filePath,
            line: index + 1,
            content: line.trim()
          });
        }
      });
    });
  } catch (error) {
    console.warn(`⚠️  无法读取文件: ${filePath}`);
  }
}

function scanDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!skipDirs.includes(item)) {
        scanDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (checkExtensions.includes(ext)) {
        checkFile(fullPath);
      }
    }
  });
}

// 检查必需的环境变量
console.log('1️⃣ 检查环境变量配置...');
const requiredEnvVars = [
  'SYNC_API_KEY',
  'NEXTAUTH_SECRET', 
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.log('❌ 缺少必需的环境变量:');
  missingEnvVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
} else {
  console.log('✅ 所有必需的环境变量已设置');
}

// 扫描代码文件
console.log('\n2️⃣ 扫描代码文件中的硬编码敏感信息...');
scanDirectory('./src');

// 输出结果
console.log('\n📊 检查结果:');

if (securityIssues.length === 0) {
  console.log('✅ 未发现硬编码的敏感信息');
} else {
  console.log(`❌ 发现 ${securityIssues.length} 个潜在的安全问题:`);
  securityIssues.forEach(issue => {
    console.log(`   📁 ${issue.file}:${issue.line}`);
    console.log(`   🔍 ${issue.content}`);
    console.log('');
  });
}

const hasIssues = missingEnvVars.length > 0 || securityIssues.length > 0;

if (hasIssues) {
  console.log('🚨 部署前请解决以上安全问题!');
  process.exit(1);
} else {
  console.log('🎉 安全检查通过，可以安全部署!');
  process.exit(0);
} 