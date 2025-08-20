#!/bin/bash

# 手动测试 Cron 调用脚本
# 模拟 Vercel Cron 的行为

echo "🧪 手动测试 Cron 调用脚本"
echo "=========================="

DOMAIN="www.mcphubs.com"
API_KEY="1mqqBG4QTLlIgrRYNQJDl5s3RlChS40R"

echo "🌐 测试配置:"
echo "域名: $DOMAIN"
echo "API 密钥: ${API_KEY:0:8}..."
echo ""

echo "🔍 测试 1: 检查同步状态"
echo "=========================="
curl -s -H "x-api-key: $API_KEY" "https://$DOMAIN/api/sync" | jq '.' 2>/dev/null || curl -s -H "x-api-key: $API_KEY" "https://$DOMAIN/api/sync"
echo ""

echo "🔍 测试 2: 快速同步模式 (推荐用于 Cron)"
echo "=========================="
echo "使用快速模式减少执行时间，避免超时..."
curl -X POST "https://$DOMAIN/api/sync" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"source":"cron","force":false,"skipTimeWindow":true,"fastMode":true}' \
  -s | jq '.' 2>/dev/null || curl -X POST "https://$DOMAIN/api/sync" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"source":"cron","force":false,"skipTimeWindow":true,"fastMode":true}' \
  -s
echo ""

echo "🔍 测试 3: 标准同步模式"
echo "=========================="
echo "标准模式处理更多项目，但可能超时..."
curl -X POST "https://$DOMAIN/api/sync" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"source":"cron","force":false,"skipTimeWindow":true,"fastMode":false}' \
  -s | jq '.' 2>/dev/null || curl -X POST "https://$DOMAIN/api/sync" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"source":"cron","force":false,"skipTimeWindow":true,"fastMode":false}' \
  -s
echo ""

echo "🔍 测试 4: 强制同步模式"
echo "=========================="
echo "强制模式忽略所有检查..."
curl -X POST "https://$DOMAIN/api/sync" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"source":"manual","force":true,"fastMode":true}' \
  -s | jq '.' 2>/dev/null || curl -X POST "https://$DOMAIN/api/sync" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"source":"manual","force":true,"fastMode":true}' \
  -s
echo ""

echo "📋 测试结果分析:"
echo "=========================="
echo "✅ 如果快速模式成功: Cron 应该可以正常工作"
echo "❌ 如果快速模式也超时: 需要进一步优化或增加超时时间"
echo "⚠️  如果标准模式超时: 建议 Cron 使用快速模式"
echo ""

echo "🔧 建议的 Cron 配置:"
echo "=========================="
echo "在 vercel.json 中:"
echo "  - 使用快速模式: fastMode: true"
echo "  - 增加超时时间: maxDuration: 600"
echo "  - 减少项目数量: 20 个而不是 50 个"
echo ""

echo "📞 如果问题持续:"
echo "=========================="
echo "1. 检查 Vercel 计划类型 (需要 Pro/Enterprise)"
echo "2. 查看 Vercel 函数日志"
echo "3. 联系 Vercel 支持"
echo "4. 考虑使用外部 Cron 服务 (如 cron-job.org)"
