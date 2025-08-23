#!/bin/bash

# 生产环境 Cron 状态检查脚本
# 检查 Vercel Cron 任务是否正常工作

echo "🔍 开始检查生产环境 Cron 任务状态..."
echo "=================================================="

# 基础 URL
BASE_URL="https://www.mcphubs.com"

echo "📊 1. 检查 API 端点状态"
echo "=========================="

# 检查 sync API 端点
echo -n "检查 /api/sync 端点 ... "
sync_response=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/sync")
if [ "$sync_response" = "200" ]; then
  echo "✅ 正常 (HTTP $sync_response)"
else
  echo "❌ 异常 (HTTP $sync_response)"
fi

# 检查 sync-status API 端点
echo -n "检查 /api/sync-status 端点 ... "
status_response=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/sync-status")
if [ "$status_response" = "200" ]; then
  echo "✅ 正常 (HTTP $status_response)"
else
  echo "❌ 异常 (HTTP $status_response)"
fi

echo ""
echo "📊 2. 检查同步状态"
echo "=================="

# 获取同步状态
echo "获取同步状态信息..."
status_data=$(curl -s "${BASE_URL}/api/sync-status")
echo "同步状态响应:"
echo "$status_data" | jq '.' 2>/dev/null || echo "$status_data"

echo ""
echo "📊 3. 检查首页 Auto Updates 信息"
echo "=================================="

# 获取首页内容，查找 Auto Updates 信息
echo "获取首页内容..."
homepage=$(curl -s "${BASE_URL}/")

# 查找 Auto Updates 相关信息
if echo "$homepage" | grep -q "Auto Updates"; then
  echo "✅ 首页包含 'Auto Updates' 信息"
  
  # 提取日期信息
  auto_updates_date=$(echo "$homepage" | grep -o "Auto Updates.*[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}" | head -1)
  if [ -n "$auto_updates_date" ]; then
    echo "📅 找到日期信息: $auto_updates_date"
  else
    echo "⚠️  未找到具体日期信息"
  fi
else
  echo "❌ 首页未找到 'Auto Updates' 信息"
fi

echo ""
echo "📊 4. 手动触发同步测试"
echo "========================"

echo "手动触发同步任务..."
echo "注意：这将消耗 API 配额"

read -p "是否要手动触发同步任务？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "正在触发同步任务..."
  
  # 发送 POST 请求到 sync API
  sync_result=$(curl -s -X POST "${BASE_URL}/api/sync" \
    -H "Content-Type: application/json" \
    -d '{"fastMode": true}')
  
  echo "同步结果:"
  echo "$sync_result" | jq '.' 2>/dev/null || echo "$sync_result"
  
  # 等待一下，然后检查状态
  echo "等待 5 秒后检查状态..."
  sleep 5
  
  new_status=$(curl -s "${BASE_URL}/api/sync-status")
  echo "更新后的同步状态:"
  echo "$new_status" | jq '.' 2>/dev/null || echo "$new_status"
else
  echo "跳过手动同步测试"
fi

echo ""
echo "📊 5. 检查 Vercel 部署状态"
echo "============================"

echo "请检查以下 Vercel 部署信息："
echo "1. 登录 Vercel 控制台"
echo "2. 检查项目部署状态"
echo "3. 查看 Functions 日志"
echo "4. 检查 Cron 任务执行历史"
echo ""
echo "Vercel 控制台链接: https://vercel.com/dashboard"

echo ""
echo "📊 6. 检查环境变量"
echo "=================="

echo "请确认以下环境变量已正确设置："
echo "- SYNC_API_KEY: 用于 API 认证"
echo "- GITHUB_TOKEN: GitHub API 访问令牌"
echo "- NEXT_PUBLIC_SITE_URL: 网站 URL"
echo ""
echo "可以在 Vercel 控制台的 Environment Variables 中查看"

echo ""
echo "🔍 7. 问题排查建议"
echo "=================="

echo "如果 Cron 任务没有执行，可能的原因："
echo "1. Vercel 计划不支持 Cron (免费计划不支持)"
echo "2. 环境变量缺失或错误"
echo "3. API 端点返回错误"
echo "4. GitHub API 配额用完"
echo "5. 网络或权限问题"

echo ""
echo "🎯 诊断完成！请根据以上信息排查问题。"
