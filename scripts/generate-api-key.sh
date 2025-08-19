#!/bin/bash

# 生成安全的 SYNC_API_KEY 脚本
# 用于保护同步 API 端点

echo "🔑 生成 SYNC_API_KEY 脚本"
echo "=========================="

# 生成 32 位随机字符串作为 API 密钥
API_KEY=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

echo "✅ 生成的 SYNC_API_KEY:"
echo "   $API_KEY"
echo ""

echo "📋 使用说明:"
echo "=========================="
echo "1. 复制上面的 API 密钥"
echo "2. 在 Vercel 项目设置中添加环境变量:"
echo "   - 名称: SYNC_API_KEY"
echo "   - 值: $API_KEY"
echo ""

echo "🔒 安全建议:"
echo "=========================="
echo "- 不要将 API 密钥提交到代码仓库"
echo "- 定期更换 API 密钥"
echo "- 在生产环境中使用强密码"
echo ""

echo "🧪 测试命令:"
echo "=========================="
echo "# 测试同步端点"
echo "curl -X POST https://your-domain.vercel.app/api/sync \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-api-key: $API_KEY' \\"
echo "  -d '{\"source\":\"manual\",\"force\":true}'"
echo ""

echo "📝 环境变量配置:"
echo "=========================="
echo "在 Vercel 项目设置中添加:"
echo "SYNC_API_KEY=$API_KEY"
echo ""

echo "⚠️  重要提醒:"
echo "=========================="
echo "- 保存好这个 API 密钥"
echo "- 不要分享给其他人"
echo "- 如果泄露，立即重新生成"
