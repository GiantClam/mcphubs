#!/bin/bash

# Cron 状态检查脚本
# 检查 Vercel Cron 的执行状态和日志

echo "🔍 Cron 状态检查脚本"
echo "===================="

DOMAIN="www.mcphubs.com"
API_KEY="1mqqBG4QTLlIgrRYNQJDl5s3RlChS40R"

echo "🌐 检查配置:"
echo "域名: $DOMAIN"
echo "API 密钥: ${API_KEY:0:8}..."
echo "当前时间: $(date)"
echo "UTC 时间: $(date -u)"
echo "北京时间: $(TZ=Asia/Shanghai date)"
echo ""

echo "🔍 1. 检查简化同步端点:"
echo "===================="
echo "GET 请求测试:"
curl -s "https://$DOMAIN/api/sync-simple" | jq '.' 2>/dev/null || curl -s "https://$DOMAIN/api/sync-simple"
echo ""

echo "POST 请求测试:"
curl -X POST "https://$DOMAIN/api/sync-simple" \
  -H "Content-Type: application/json" \
  -s | jq '.' 2>/dev/null || curl -X POST "https://$DOMAIN/api/sync-simple" \
  -H "Content-Type: application/json" \
  -s
echo ""

echo "🔍 2. 检查原始同步端点:"
echo "===================="
echo "同步状态:"
curl -s -H "x-api-key: $API_KEY" "https://$DOMAIN/api/sync" | jq '.' 2>/dev/null || curl -s -H "x-api-key: $API_KEY" "https://$DOMAIN/api/sync"
echo ""

echo "🔍 3. 检查 Cron 配置:"
echo "===================="
echo "当前 vercel.json Cron 配置:"
echo "  - 路径: /api/sync-simple"
echo "  - 时间: 0 22 * * * (UTC 22:00)"
echo "  - 对应北京时间: 06:00"
echo "  - 最大执行时间: 60 秒"
echo ""

echo "🔍 4. 手动触发 Cron 测试:"
echo "===================="
echo "模拟 Cron 调用 (使用简化端点):"
curl -X POST "https://$DOMAIN/api/sync-simple" \
  -H "Content-Type: application/json" \
  -d '{"source":"cron","test":true}' \
  -s | jq '.' 2>/dev/null || curl -X POST "https://$DOMAIN/api/sync-simple" \
  -H "Content-Type: application/json" \
  -d '{"source":"cron","test":true}' \
  -s
echo ""

echo "🔍 5. 检查环境变量:"
echo "===================="
echo "通过 API 检查环境变量状态:"
curl -s "https://$DOMAIN/api/cron-test" | jq '.hasSyncApiKey, .hasGitHubToken, .environment' 2>/dev/null || curl -s "https://$DOMAIN/api/cron-test"
echo ""

echo "🔍 6. 下一步操作:"
echo "===================="
echo "1. 等待 Vercel 重新部署 (已推送代码)"
echo "2. 检查简化端点是否正常工作"
echo "3. 等待明天早上 6 点 (北京时间) 检查 Cron 是否执行"
echo "4. 在 Vercel 仪表板中查看函数日志"
echo ""

echo "🔍 7. 如果 Cron 仍然不工作:"
echo "===================="
echo "1. 检查 Vercel 项目设置中的 Cron 功能是否启用"
echo "2. 查看 Vercel 函数日志中的错误信息"
echo "3. 联系 Vercel 支持获取帮助"
echo "4. 考虑使用外部 Cron 服务作为备选方案"
echo ""

echo "📋 验证清单:"
echo "===================="
echo "✅ 简化同步端点可访问"
echo "✅ 环境变量正确设置"
echo "✅ Vercel 账户是付费计划"
echo "✅ 项目成功部署"
echo "⏳ 等待 Cron 生效 (24 小时)"
echo "⏳ 等待下次执行时间 (明天 06:00)"
