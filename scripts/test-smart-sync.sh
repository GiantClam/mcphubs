#!/bin/bash

# 智能同步测试脚本
# 测试智能循环同步系统的各项功能

echo "🧪 智能同步系统测试脚本"
echo "========================"

DOMAIN="www.mcphubs.com"
API_KEY="1mqqBG4QTLlIgrRYNQJDl5s3RlChS40R"

echo "🌐 测试配置:"
echo "域名: $DOMAIN"
echo "API 密钥: ${API_KEY:0:8}..."
echo "当前时间: $(date)"
echo "北京时间: $(TZ=Asia/Shanghai date)"
echo ""

echo "🔍 1. 测试同步状态端点:"
echo "========================"
echo "获取智能同步状态..."
response=$(curl -s "https://$DOMAIN/api/sync-status")
echo "响应:"
echo "$response" | jq '.' 2>/dev/null || echo "$response"
echo ""

echo "🔍 2. 测试手动触发同步:"
echo "========================"
echo "触发一次智能同步 (处理 30 个项目)..."
sync_response=$(curl -X POST "https://$DOMAIN/api/sync" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"source":"test","force":true,"fastMode":false}' \
  -s)
echo "同步响应:"
echo "$sync_response" | jq '.' 2>/dev/null || echo "$sync_response"
echo ""

echo "🔍 3. 等待同步完成并检查状态:"
echo "========================"
echo "等待 10 秒让同步完成..."
sleep 10

echo "再次检查同步状态..."
status_response=$(curl -s "https://$DOMAIN/api/sync-status")
echo "状态响应:"
echo "$status_response" | jq '.' 2>/dev/null || echo "$status_response"
echo ""

echo "🔍 4. 测试重置同步位置:"
echo "========================"
echo "重置同步位置到开始位置..."
reset_response=$(curl -X POST "https://$DOMAIN/api/sync-status" \
  -H "Content-Type: application/json" \
  -d '{"action":"reset"}' \
  -s)
echo "重置响应:"
echo "$reset_response" | jq '.' 2>/dev/null || echo "$reset_response"
echo ""

echo "🔍 5. 验证重置后的状态:"
echo "========================"
echo "检查重置后的状态..."
final_status=$(curl -s "https://$DOMAIN/api/sync-status")
echo "最终状态:"
echo "$final_status" | jq '.' 2>/dev/null || echo "$final_status"
echo ""

echo "🔍 6. 测试快速模式同步:"
echo "========================"
echo "触发快速模式同步 (处理 20 个项目)..."
fast_sync=$(curl -X POST "https://$DOMAIN/api/sync" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"source":"test","force":true,"fastMode":true}' \
  -s)
echo "快速同步响应:"
echo "$fast_sync" | jq '.' 2>/dev/null || echo "$fast_sync"
echo ""

echo "🔍 7. 测试结果分析:"
echo "========================"
echo "✅ 测试完成！"
echo ""
echo "📊 预期结果:"
echo "1. 同步状态端点应该返回位置信息"
echo "2. 手动同步应该成功执行"
echo "3. 位置应该正确更新"
echo "4. 重置功能应该工作"
echo "5. 快速模式应该减少处理时间"
echo ""

echo "🔍 8. 监控命令:"
echo "========================"
echo "# 实时监控同步状态"
echo "watch -n 5 'curl -s https://$DOMAIN/api/sync-status | jq .'"
echo ""
echo "# 查看同步日志"
echo "curl -s https://$DOMAIN/api/sync-status"
echo ""
echo "# 手动触发同步"
echo "curl -X POST https://$DOMAIN/api/sync \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-api-key: $API_KEY' \\"
echo "  -d '{\"source\":\"manual\",\"force\":true}'"
echo ""

echo "⏰ 下次 Cron 执行时间:"
echo "========================"
echo "Cron 将在每小时整点执行 (0 分)"
echo "例如: 10:00, 11:00, 12:00, 13:00..."
echo "每次处理 30 个项目，循环往复"
echo ""
echo "🎯 智能循环工作原理:"
echo "1. 记住上次处理的位置"
echo "2. 下次从位置+1 开始"
echo "3. 循环到底后重新开始"
echo "4. 确保所有项目都得到更新"
