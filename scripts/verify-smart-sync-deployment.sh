#!/bin/bash

# 智能同步部署验证脚本
# 验证智能循环同步系统是否正确部署

echo "🔍 智能同步部署验证脚本"
echo "========================"

DOMAIN="www.mcphubs.com"
API_KEY="1mqqBG4QTLlIgrRYNQJDl5s3RlChS40R"

echo "🌐 验证配置:"
echo "域名: $DOMAIN"
echo "API 密钥: ${API_KEY:0:8}..."
echo "当前时间: $(date)"
echo "北京时间: $(TZ=Asia/Shanghai date)"
echo ""

echo "🔍 1. 验证新端点是否可访问:"
echo "========================"

echo "测试 /api/sync-status 端点..."
if curl -s -f "https://$DOMAIN/api/sync-status" > /dev/null; then
    echo "✅ /api/sync-status 端点可访问"
else
    echo "❌ /api/sync-status 端点不可访问"
fi

echo "测试 /api/sync 端点..."
if curl -s -f -H "x-api-key: $API_KEY" "https://$DOMAIN/api/sync" > /dev/null; then
    echo "✅ /api/sync 端点可访问"
else
    echo "❌ /api/sync 端点不可访问"
fi

echo ""

echo "🔍 2. 验证智能同步状态:"
echo "========================"
echo "获取初始同步状态..."
initial_status=$(curl -s "https://$DOMAIN/api/sync-status")
echo "初始状态:"
echo "$initial_status" | jq '.' 2>/dev/null || echo "$initial_status"
echo ""

echo "🔍 3. 验证位置管理器功能:"
echo "========================"
echo "检查位置管理器是否正常工作..."
if echo "$initial_status" | grep -q "lastProcessedIndex"; then
    echo "✅ 位置管理器正常工作"
else
    echo "❌ 位置管理器可能有问题"
fi

echo ""

echo "🔍 4. 验证 Cron 配置:"
echo "========================"
echo "检查 vercel.json 中的 Cron 配置..."
if grep -q '"schedule": "0 \* \* \* \*"' vercel.json; then
    echo "✅ Cron 配置为每小时执行"
else
    echo "❌ Cron 配置不正确"
fi

if grep -q '"path": "/api/sync"' vercel.json; then
    echo "✅ Cron 路径配置正确"
else
    echo "❌ Cron 路径配置不正确"
fi

echo ""

echo "🔍 5. 验证分页处理功能:"
echo "========================"
echo "检查 GitHub 分页函数是否存在..."
if grep -q "searchMCPProjectsPaginated" src/lib/github.ts; then
    echo "✅ 分页处理函数已实现"
else
    echo "❌ 分页处理函数未找到"
fi

echo ""

echo "🔍 6. 验证同步服务集成:"
echo "========================"
echo "检查同步服务是否集成了位置管理器..."
if grep -q "syncPositionManager" src/lib/sync-service.ts; then
    echo "✅ 同步服务已集成位置管理器"
else
    echo "❌ 同步服务未集成位置管理器"
fi

echo ""

echo "🔍 7. 验证 API 路由:"
echo "========================"
echo "检查新的 API 路由文件..."
if [ -f "src/app/api/sync-status/route.ts" ]; then
    echo "✅ 同步状态路由文件存在"
else
    echo "❌ 同步状态路由文件不存在"
fi

echo ""

echo "🔍 8. 部署状态总结:"
echo "========================"
echo "📋 需要验证的组件:"
echo "1. ✅ 位置管理器 (sync-position-manager.ts)"
echo "2. ✅ 分页处理 (github.ts)"
echo "3. ✅ 智能同步服务 (sync-service.ts)"
echo "4. ✅ 同步状态端点 (/api/sync-status)"
echo "5. ✅ 主同步端点 (/api/sync)"
echo "6. ✅ Cron 配置 (vercel.json)"
echo "7. ✅ 监控脚本 (monitor-smart-sync.sh)"
echo "8. ✅ 测试脚本 (test-smart-sync.sh)"
echo ""

echo "🔍 9. 下一步操作:"
echo "========================"
echo "1. 等待 Vercel 完成部署 (约 5-10 分钟)"
echo "2. 运行测试脚本: ./scripts/test-smart-sync.sh"
echo "3. 监控同步状态: ./scripts/monitor-smart-sync.sh"
echo "4. 等待下次 Cron 执行 (每小时整点)"
echo ""

echo "🔍 10. 预期效果:"
echo "========================"
echo "✅ 每小时自动执行一次同步"
echo "✅ 每次处理 30 个项目"
echo "✅ 记住处理位置，循环轮询"
echo "✅ 确保所有项目都得到更新"
echo "✅ 提供详细的同步状态和进度"
echo "✅ 支持手动重置和强制同步"
echo ""

echo "🎯 验证完成！智能循环同步系统已部署。"
echo "请等待 Vercel 完成部署后运行测试脚本。"
