# 🔐 MCPHubs 认证功能设置指南

## 问题描述
当前项目点击 "Sign In" 按钮出现 404 错误，这是因为缺少必要的环境变量配置。

## 🚀 快速解决方案

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# 在 mcphubs 目录下执行
touch .env.local
```

### 2. 配置基本环境变量

将以下内容复制到 `.env.local` 文件中：

```env
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
```

### 3. 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

## 🔧 完整 OAuth 配置 (可选)

如果你想要完整的 GitHub/Google 登录功能，需要配置 OAuth 应用：

### GitHub OAuth 配置

1. 访问 [GitHub OAuth Apps](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写信息：
   - **Application name**: MCPHubs Dev
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. 创建后获得 `Client ID` 和 `Client Secret`
5. 添加到 `.env.local`：

```env
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret
```

### Google OAuth 配置

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID
5. 添加授权重定向 URI：`http://localhost:3000/api/auth/callback/google`
6. 添加到 `.env.local`：

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🎯 功能说明

### 当前实现的功能

1. **用户认证系统**：
   - NextAuth.js 集成
   - GitHub OAuth 登录
   - Google OAuth 登录
   - JWT 会话管理

2. **用户界面**：
   - 登录/登出按钮
   - 用户头像和下拉菜单
   - 个人资料页面

3. **会员系统**：
   - 用户会话管理
   - 个人资料页面 (`/profile`)
   - 管理员权限检查

### 配置后的功能

- ✅ 点击 "Sign In" 不再出现 404 错误
- ✅ 显示登录页面
- ✅ 支持 GitHub/Google 登录
- ✅ 用户登录后显示头像和菜单
- ✅ 支持登出功能

## 🔍 故障排除

### 常见问题

1. **404 错误**：
   - 确保 `.env.local` 文件存在
   - 确保 `NEXTAUTH_URL` 配置正确
   - 重启开发服务器

2. **OAuth 错误**：
   - 检查 OAuth 应用配置
   - 确保回调 URL 正确
   - 检查环境变量拼写

3. **数据库连接错误**：
   - 如果不需要数据库功能，可以暂时不配置 Supabase
   - 项目会使用模拟数据

## 📝 下一步

1. 创建 `.env.local` 文件
2. 配置基本环境变量
3. 重启开发服务器
4. 测试登录功能

完成这些步骤后，登录功能应该可以正常工作了！ 