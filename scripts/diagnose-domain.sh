#!/bin/bash

# 域名重定向诊断脚本
# 用于检查 mcphubs.com 到 www.mcphubs.com 的重定向

echo "🔍 域名重定向诊断脚本"
echo "=========================="

DOMAIN="mcphubs.com"
WWW_DOMAIN="www.mcphubs.com"

echo "🌐 检查域名配置:"
echo "=========================="
echo "主域名: $DOMAIN"
echo "WWW 域名: $WWW_DOMAIN"
echo ""

echo "🔍 检查 DNS 解析:"
echo "=========================="
echo "主域名 A 记录:"
dig +short $DOMAIN A
echo ""

echo "WWW 域名 A 记录:"
dig +short $WWW_DOMAIN A
echo ""

echo "🔍 检查 HTTP 重定向:"
echo "=========================="
echo "主域名 HTTP 响应:"
curl -I -s "http://$DOMAIN" | head -5
echo ""

echo "主域名 HTTPS 响应:"
curl -I -s "https://$DOMAIN" | head -5
echo ""

echo "WWW 域名 HTTPS 响应:"
curl -I -s "https://$WWW_DOMAIN" | head -5
echo ""

echo "🔍 检查 API 端点:"
echo "=========================="
echo "主域名 API 测试:"
curl -s "https://$DOMAIN/api/cron-test" | head -3
echo ""

echo "WWW 域名 API 测试:"
curl -s "https://$WWW_DOMAIN/api/cron-test" | head -3
echo ""

echo "🔍 检查 Vercel Cron 配置:"
echo "=========================="
echo "当前 Cron 配置:"
echo "  - 路径: /api/sync"
echo "  - 时间: 每天 6:00 (UTC)"
echo "  - 对应北京时间: 14:00"
echo ""

echo "🔍 建议的修复步骤:"
echo "=========================="
echo "1. 在 Vercel 中设置环境变量:"
echo "   NEXT_PUBLIC_SITE_URL=https://$WWW_DOMAIN"
echo "   VERCEL_URL=https://$WWW_DOMAIN"
echo ""
echo "2. 在 Cloudflare 中设置重定向规则:"
echo "   - 301 重定向: $DOMAIN → $WWW_DOMAIN"
echo "   - 强制 HTTPS"
echo ""
echo "3. 更新 Vercel 项目域名设置"
echo "4. 重新部署项目"
echo "5. 等待 24 小时让 Cron 生效"
echo ""

echo "🧪 测试命令:"
echo "=========================="
echo "# 测试主域名重定向"
echo "curl -I https://$DOMAIN"
echo ""
echo "# 测试 WWW 域名"
echo "curl -I https://$WWW_DOMAIN"
echo ""
echo "# 测试 API 端点"
echo "curl https://$WWW_DOMAIN/api/cron-test"
echo ""

echo "⚠️  注意事项:"
echo "=========================="
echo "- 确保 Cloudflare 重定向规则正确"
echo "- 检查 Vercel 项目域名设置"
echo "- 验证环境变量配置"
echo "- 等待 DNS 传播完成"
