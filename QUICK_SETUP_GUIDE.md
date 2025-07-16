# 🚀 MCPHubs 快速设置指南

## 问题诊断
您遇到的问题是环境变量未正确配置，导致：
- ❌ 数据库连接失败 (Supabase配置缺失)
- ❌ GitHub API 401错误 (GitHub token缺失)

## 解决步骤

### 1. 配置 Supabase 数据库 ✅

请编辑 `.env.local` 文件，替换以下变量为真实值：

```bash
# 将这些行替换为：
NEXT_PUBLIC_SUPABASE_URL=https://vfpjxmylrmmsebvfixkq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGp4bXlscm1tc2VidmZpeGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ3MzMsImV4cCI6MjA1MDU1MDczM30.PEBcVJdP1rXS6wZvPCJnPE6P0W5LrBkbHHD1kZYNGds
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGp4bXlscm1tc2VidmZpeGtxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDk3NDczMywiZXhwIjoyMDUwNTUwNzMzfQ.YXZywDa1bMVOJiSJLOoaP-b-qxI3HGd6OLFd41tJCho
```

### 2. 配置 GitHub Token 🔑

#### 生成GitHub个人访问令牌：
1. 访问: https://github.com/settings/tokens
2. 点击 **"Generate new token (classic)"**
3. 设置名称: `MCPHubs API Access`
4. 选择权限:
   - ✅ `public_repo` (访问公共仓库)
   - ✅ `read:user` (读取用户信息)
5. 点击 **"Generate token"**
6. 复制生成的token (以 `ghp_` 开头)

#### 添加到环境变量：
在 `.env.local` 文件中替换：
```bash
GITHUB_TOKEN=你生成的GitHub令牌
```

### 3. 配置安全密钥 🔒

在 `.env.local` 文件中设置：
```bash
SYNC_API_KEY=mcp-sync-key-2024-secure
NEXTAUTH_SECRET=mcp-nextauth-secret-2024-ultra-secure
```

## 快速修复命令

```bash
# 1. 停止开发服务器 (Ctrl+C)

# 2. 编辑环境变量
nano .env.local

# 3. 重启开发服务器
npm run dev
```

## 验证配置

配置完成后，你应该看到：
- ✅ 数据库连接成功
- ✅ GitHub API正常工作
- ✅ 项目数据正常加载

## 环境变量优先级

Next.js加载顺序：
1. `.env.local` (最高优先级，本地覆盖)
2. `.env.development` (开发环境)
3. `.env.production` (生产环境)
4. `.env` (默认)

---

💡 **提示**: 配置完成后刷新页面，应该可以看到菜单栏正常显示，并且项目数据正常加载。 