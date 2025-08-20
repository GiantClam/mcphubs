#!/bin/bash

# 生产环境 Vercel Cron 诊断脚本
# 全面排查定时器不启动的问题

echo "🔍 生产环境 Vercel Cron 诊断脚本"
echo "=================================="

DOMAIN="www.mcphubs.com"
API_KEY="1mqqBG4QTLlIgrRYNQJDl5s3RlChS40R"

echo "🌐 基础信息检查:"
echo "=================================="
echo "域名: $DOMAIN"
echo "API 密钥: ${API_KEY:0:8}..."
echo "当前时间: $(date)"
echo "UTC 时间: $(date -u)"
echo "北京时间: $(TZ=Asia/Shanghai date)"
echo ""

echo "🔍 1. 检查 Vercel 计划类型:"
echo "=================================="
echo "⚠️  重要: Vercel Cron 功能需要 Pro 或 Enterprise 计划"
echo "   免费计划不支持 Cron 功能"
echo "   请访问: https://vercel.com/account/billing"
echo ""

echo "🔍 2. 检查环境变量配置:"
echo "=================================="
echo "在 Vercel 项目设置中必须设置以下环境变量:"
echo "   ✅ SYNC_API_KEY=$API_KEY"
echo "   ✅ NEXT_PUBLIC_SITE_URL=https://$DOMAIN"
echo "   ✅ VERCEL_URL=https://$DOMAIN"
echo "   ✅ GITHUB_TOKEN=your-github-token"
echo ""

echo "🔍 3. 检查 Cron 配置:"
echo "=================================="
echo "当前 vercel.json 配置:"
echo "   - 路径: /api/sync"
echo "   - 时间: 0 22 * * * (UTC 22:00)"
echo "   - 对应北京时间: 06:00"
echo "   - 最大执行时间: 300 秒"
echo ""

echo "🔍 4. 测试 API 端点:"
echo "=================================="
echo "测试 Cron 测试端点:"
curl -s "https://$DOMAIN/api/cron-test" | head -3
echo ""

echo "测试同步端点状态:"
curl -s -H "x-api-key: $API_KEY" "https://$DOMAIN/api/sync" | head -3
echo ""

echo "🔍 5. 检查 Vercel 部署状态:"
echo "=================================="
echo "请检查以下内容:"
echo "   1. 项目是否成功部署到 Vercel"
echo "   2. 部署日志中是否有错误"
echo "   3. 函数是否正常创建"
echo "   4. 环境变量是否正确设置"
echo ""

echo "🔍 6. 手动触发测试:"
echo "=================================="
echo "手动触发同步任务:"
curl -X POST "https://$DOMAIN/api/sync" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"source":"manual","force":true}' \
  -s | head -5
echo ""

echo "🔍 7. 检查 Vercel 函数日志:"
echo "=================================="
echo "在 Vercel 仪表板中:"
echo "   1. 进入项目 → Functions"
echo "   2. 查看 /api/sync 函数的日志"
echo "   3. 检查是否有错误信息"
echo "   4. 查看执行历史"
echo ""

echo "🔍 8. 常见问题排查:"
echo "=================================="
echo "❌ 计划不支持: 免费计划无法使用 Cron"
echo "❌ 环境变量缺失: SYNC_API_KEY 未设置"
echo "❌ 部署失败: 项目构建或部署有问题"
echo "❌ 函数错误: API 端点返回错误"
echo "❌ 权限问题: API 密钥无效"
echo "❌ 网络问题: 域名无法访问"
echo ""

echo "🔍 9. 解决步骤:"
echo "=================================="
echo "1. 确认 Vercel 计划类型 (Pro/Enterprise)"
echo "2. 检查并设置所有必需的环境变量"
echo "3. 重新部署项目"
echo "4. 等待 24 小时让 Cron 生效"
echo "5. 检查 Vercel 函数日志"
echo "6. 联系 Vercel 支持 (如果问题持续)"
echo ""

echo "🔍 10. 验证命令:"
echo "=================================="
echo "# 测试网站可访问性"
echo "curl -I https://$DOMAIN"
echo ""
echo "# 测试 API 端点"
echo "curl https://$DOMAIN/api/cron-test"
echo ""
echo "# 手动触发同步"
echo "curl -X POST https://$DOMAIN/api/sync \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-api-key: $API_KEY' \\"
echo "  -d '{\"source\":\"manual\",\"force\":true}'"
echo ""

echo "📞 获取帮助:"
echo "=================================="
echo "如果问题持续存在:"
echo "1. Vercel 支持: https://vercel.com/support"
echo "2. Vercel Cron 文档: https://vercel.com/docs/cron-jobs"
echo "3. 检查项目部署状态: https://vercel.com/dashboard"
echo "4. 查看函数日志和错误信息"
