#!/bin/bash

# 智能同步监控脚本
# 监控每小时执行的智能循环同步状态

echo "🔍 智能同步监控脚本"
echo "===================="

DOMAIN="www.mcphubs.com"
API_KEY="1mqqBG4QTLlIgrRYNQJDl5s3RlChS40R"

echo "🌐 监控配置:"
echo "域名: $DOMAIN"
echo "API 密钥: ${API_KEY:0:8}..."
echo "当前时间: $(date)"
echo "北京时间: $(TZ=Asia/Shanghai date)"
echo ""

echo "🔍 1. 检查智能同步状态:"
echo "===================="
echo "获取详细同步状态和位置信息..."
curl -s "https://$DOMAIN/api/sync-status" | jq '.' 2>/dev/null || curl -s "https://$DOMAIN/api/sync-status"
echo ""

echo "🔍 2. 检查原始同步端点:"
echo "===================="
echo "同步状态:"
curl -s -H "x-api-key: $API_KEY" "https://$DOMAIN/api/sync" | jq '.' 2>/dev/null || curl -s -H "x-api-key: $API_KEY" "https://$DOMAIN/api/sync"
echo ""

echo "🔍 3. 手动触发智能同步:"
echo "===================="
echo "触发一次智能同步 (处理 30 个项目):"
curl -X POST "https://$DOMAIN/api/sync" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"source":"manual","force":true,"fastMode":false}' \
  -s | jq '.' 2>/dev/null || curl -X POST "https://$DOMAIN/api/sync" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"source":"manual","force":true,"fastMode":false}' \
  -s
echo ""

echo "🔍 4. 检查 Cron 配置:"
echo "===================="
echo "当前 vercel.json Cron 配置:"
echo "  - 路径: /api/sync"
echo "  - 时间: 0 * * * * (每小时执行)"
echo "  - 批次大小: 30 个项目"
echo "  - 智能循环: 记住位置，循环处理"
echo ""

echo "🔍 5. 智能同步工作原理:"
echo "===================="
echo "1. 每小时自动执行一次"
echo "2. 每次处理 30 个项目"
echo "3. 记住上次处理的位置"
echo "4. 下次从位置+1 开始"
echo "5. 循环到底后从头开始"
echo "6. 确保所有项目都得到更新"
echo ""

echo "🔍 6. 监控要点:"
echo "===================="
echo "✅ 检查同步位置是否正确更新"
echo "✅ 确认项目数量是否递增"
echo "✅ 验证循环是否正常工作"
echo "✅ 监控错误和异常情况"
echo ""

echo "🔍 7. 重置同步位置:"
echo "===================="
echo "如果需要强制从头开始:"
echo "curl -X POST https://$DOMAIN/api/sync-status \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"action\":\"reset\"}'"
echo ""

echo "🔍 8. 预期效果:"
echo "===================="
echo "每小时执行一次，每次处理 30 个项目"
echo "项目位置: 1-30 → 31-60 → 61-90 → ..."
echo "循环完成后: 重新从 1 开始"
echo "确保所有项目都能得到定期更新"
echo ""

echo "📊 监控命令:"
echo "===================="
echo "# 查看同步状态"
echo "curl https://$DOMAIN/api/sync-status"
echo ""
echo "# 手动触发同步"
echo "curl -X POST https://$DOMAIN/api/sync \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-api-key: $API_KEY' \\"
echo "  -d '{\"source\":\"manual\",\"force\":true}'"
echo ""
echo "# 重置同步位置"
echo "curl -X POST https://$DOMAIN/api/sync-status \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"action\":\"reset\"}'"
echo ""

echo "⏰ 下次执行时间:"
echo "===================="
echo "Cron 将在每小时整点执行 (0 分)"
echo "例如: 10:00, 11:00, 12:00, 13:00..."
echo "每次处理 30 个项目，循环往复"
