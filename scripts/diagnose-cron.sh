#!/bin/bash

# Vercel Cron 诊断脚本
# 用于检查定时器配置和排查问题

echo "🔍 Vercel Cron 诊断脚本"
echo "=========================="

# 检查当前时间
echo "🕐 当前时间:"
echo "  本地时间: $(date)"
echo "  UTC时间: $(date -u)"
echo "  北京时间: $(TZ=Asia/Shanghai date)"

echo ""
echo "📋 检查清单:"
echo "=========================="

# 1. 检查 Vercel 计划
echo "1. ✅ Vercel 账户计划:"
echo "   - 确认是否为 Pro 或 Enterprise 计划"
echo "   - 免费计划不支持 Cron 功能"
echo "   - 访问: https://vercel.com/account/billing"

# 2. 检查环境变量
echo ""
echo "2. 🔑 必需的环境变量:"
echo "   - SYNC_API_KEY: 用于验证同步请求"
echo "   - GITHUB_TOKEN: 用于 GitHub API 调用"
echo "   - 在 Vercel 项目设置中添加这些变量"

# 3. 检查 Cron 配置
echo ""
echo "3. ⏰ Cron 配置:"
echo "   - 路径: /api/sync"
echo "   - 时间: 每天 6:00 (UTC)"
echo "   - 对应北京时间: 14:00"

# 4. 测试端点
echo ""
echo "4. 🧪 测试端点:"
echo "   - 健康检查: GET /api/sync (需要 API key)"
echo "   - Cron 测试: GET /api/cron-test"
echo "   - 手动同步: POST /api/sync (需要 API key)"

# 5. 常见问题
echo ""
echo "5. 🚨 常见问题:"
echo "   - 环境变量未设置"
echo "   - Vercel 计划不支持 Cron"
echo "   - API 端点返回错误"
echo "   - 时区配置问题"

# 6. 解决步骤
echo ""
echo "6. 🛠️ 解决步骤:"
echo "   1) 升级到 Vercel Pro 计划"
echo "   2) 设置必需的环境变量"
echo "   3) 重新部署项目"
echo "   4) 等待 24 小时让 Cron 生效"
echo "   5) 检查 Vercel 函数日志"

# 7. 手动测试
echo ""
echo "7. 🧪 手动测试命令:"
echo "   # 测试 Cron 端点"
echo "   curl https://your-domain.vercel.app/api/cron-test"
echo ""
echo "   # 测试同步端点 (需要 API key)"
echo "   curl -X POST https://your-domain.vercel.app/api/sync \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -H 'x-api-key: YOUR_API_KEY' \\"
echo "     -d '{\"source\":\"manual\",\"force\":true}'"

echo ""
echo "📞 如果问题持续:"
echo "   - 检查 Vercel 函数日志"
echo "   - 联系 Vercel 支持"
echo "   - 查看项目部署状态"

echo ""
echo "🔗 相关链接:"
echo "   - Vercel Cron 文档: https://vercel.com/docs/cron-jobs"
echo "   - Vercel 定价: https://vercel.com/pricing"
echo "   - 项目设置: https://vercel.com/dashboard"
