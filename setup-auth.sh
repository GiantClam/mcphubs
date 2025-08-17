#!/bin/bash

# MCPHubs 认证功能快速设置脚本

echo "🔐 正在设置 MCPHubs 认证功能..."

# 检查是否已存在 .env.local 文件
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local 文件已存在，将备份为 .env.local.backup"
    cp .env.local .env.local.backup
fi

# 创建 .env.local 文件
cat > .env.local << 'EOF'
# MCPHubs 本地开发环境变量

# ===== 🔒 必需的安全变量 =====
SYNC_API_KEY=dev-sync-api-key-2024
NEXTAUTH_SECRET=dev-nextauth-secret-key-2024-mcphubs

# ===== 🔐 NextAuth 基础配置 =====
NEXTAUTH_URL=http://localhost:3000

# ===== 🐙 GitHub API (可选) =====
# GITHUB_TOKEN=your-github-token

# ===== 📊 Supabase 数据库配置 (可选) =====
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase

# ===== 🔐 OAuth 配置 (可选) =====
# GitHub OAuth (需要先在 GitHub 创建 OAuth App)
# GITHUB_ID=your-github-oauth-id
# GITHUB_SECRET=your-github-oauth-secret

# Google OAuth (需要先在 Google Cloud Console 创建 OAuth 2.0 客户端)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
EOF

echo "✅ .env.local 文件已创建"
echo ""
echo "📝 下一步："
echo "1. 重启开发服务器：npm run dev"
echo "2. 访问 http://localhost:3000"
echo "3. 点击 'Sign In' 按钮测试登录功能"
echo ""
echo "🔧 如需完整 OAuth 功能，请参考 AUTH_SETUP_GUIDE.md"
echo ""
echo "🎉 认证功能设置完成！" 