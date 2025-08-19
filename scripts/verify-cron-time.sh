#!/bin/bash

# Vercel Cron 时间验证脚本
# 验证定时器是否在北京时间早上 6 点执行

echo "🕐 Vercel Cron 时间验证脚本"
echo "=========================="

echo "📅 Cron 表达式: 0 22 * * *"
echo ""

echo "🌍 时区对照表:"
echo "=========================="
echo "UTC 时间:     22:00 (晚上 10 点)"
echo "北京时间:     06:00 (早上 6 点)"
echo "美国东部:     18:00 (下午 6 点)"
echo "美国西部:     15:00 (下午 3 点)"
echo ""

echo "🔄 执行逻辑:"
echo "=========================="
echo "1. Vercel 服务器在 UTC 时间 22:00 触发"
echo "2. 此时北京时间是第二天早上 6:00"
echo "3. 执行 GitHub 项目同步任务"
echo "4. 更新项目数据和统计信息"
echo ""

echo "⏰ 当前时间对照:"
echo "=========================="
echo "本地时间:     $(date)"
echo "UTC 时间:     $(date -u)"
echo "北京时间:     $(TZ=Asia/Shanghai date)"
echo ""

echo "📋 验证步骤:"
echo "=========================="
echo "1. 等待 Vercel 重新部署"
echo "2. 检查 Vercel 函数日志"
echo "3. 验证定时器是否在正确时间执行"
echo "4. 确认同步任务成功完成"
echo ""

echo "🧪 测试命令:"
echo "=========================="
echo "# 手动触发同步任务"
echo "curl -X POST https://www.mcphubs.com/api/sync \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-api-key: YOUR_API_KEY' \\"
echo "  -d '{\"source\":\"manual\",\"force\":true}'"
echo ""

echo "# 检查同步状态"
echo "curl -H 'x-api-key: YOUR_API_KEY' \\"
echo "  https://www.mcphubs.com/api/sync"
echo ""

echo "⚠️  注意事项:"
echo "=========================="
echo "- Vercel Cron 使用 UTC 时间"
echo "- 需要 Pro 或 Enterprise 计划"
echo "- 环境变量必须正确设置"
echo "- 等待 24 小时让 Cron 生效"
echo "- 检查 Vercel 函数日志确认执行"
