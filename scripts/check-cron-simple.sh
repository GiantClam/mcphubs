#!/bin/bash

# 简单的 Cron 状态检查脚本
echo "🔍 检查 Cron 任务状态..."
echo "========================"

BASE_URL="https://www.mcphubs.com"

echo "1. 检查 sync-status API..."
status=$(curl -s "${BASE_URL}/api/sync-status")
echo "状态: $status"

echo ""
echo "2. 检查首页..."
homepage=$(curl -s "${BASE_URL}/")
if echo "$homepage" | grep -q "Auto Updates"; then
  echo "✅ 首页包含 Auto Updates"
  date_info=$(echo "$homepage" | grep -o "Auto Updates.*[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}" | head -1)
  echo "📅 日期信息: $date_info"
else
  echo "❌ 首页未找到 Auto Updates"
fi

echo ""
echo "3. 手动触发同步测试..."
echo "发送 POST 请求到 /api/sync..."
result=$(curl -s -X POST "${BASE_URL}/api/sync" -H "Content-Type: application/json" -d '{"fastMode": true}')
echo "结果: $result"

echo ""
echo "🎯 检查完成！"
