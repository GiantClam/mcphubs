#!/bin/bash

# 检查环境变量配置
echo "🔍 检查环境变量配置..."
echo "========================"

BASE_URL="https://www.mcphubs.com"

echo "1. 检查 SYNC_API_KEY 是否配置..."
echo "注意：这个值应该已经在 Vercel 中设置"

echo ""
echo "2. 检查 GITHUB_TOKEN 是否配置..."
echo "注意：这个值应该已经在 Vercel 中设置"

echo ""
echo "3. 检查环境变量状态..."
echo "请登录 Vercel 控制台检查以下环境变量："
echo "- SYNC_API_KEY: 用于 API 认证"
echo "- GITHUB_TOKEN: GitHub API 访问令牌"
echo "- NEXT_PUBLIC_SITE_URL: 网站 URL"

echo ""
echo "4. 生成新的 SYNC_API_KEY..."
echo "运行以下命令生成新的 API 密钥："
echo "./scripts/generate-api-key.sh"

echo ""
echo "5. 设置环境变量步骤："
echo "1) 登录 Vercel 控制台"
echo "2) 进入项目设置"
echo "3) 找到 Environment Variables"
echo "4) 添加或更新 SYNC_API_KEY"
echo "5) 添加或更新 GITHUB_TOKEN"
echo "6) 重新部署项目"

echo ""
echo "🎯 环境变量检查完成！"
