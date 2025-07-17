# 🚀 Vercel环境变量配置指南

## 问题说明
**mcphubs.com/projects** 页面显示"0个项目"是因为生产环境缺少必要的环境变量配置。

## 解决步骤

### 1. 登录Vercel控制台
1. 访问: https://vercel.com/dashboard
2. 找到 `mcphubs` 项目
3. 点击项目名称进入项目设置

### 2. 配置环境变量
点击 **"Settings"** → **"Environment Variables"**

#### 🔑 必需的环境变量：

```bash
# === Supabase数据库配置 ===
NEXT_PUBLIC_SUPABASE_URL=https://vfpjxmylrmmsebvfixkq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGp4bXlscm1tc2VidmZpeGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ3MzMsImV4cCI6MjA1MDU1MDczM30.PEBcVJdP1rXS6wZvPCJnPE6P0W5LrBkbHHD1kZYNGds
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGp4bXlscm1tc2VidmZpeGtxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDk3NDczMywiZXhwIjoyMDUwNTUwNzMzfQ.YXZywDa1bMVOJiSJLOoaP-b-qxI3HGd6OLFd41tJCho

# === GitHub API配置 ===
GITHUB_TOKEN=[需要生成GitHub令牌]

# === 安全配置 ===
SYNC_API_KEY=mcp-sync-key-2024-secure
NEXTAUTH_SECRET=mcp-nextauth-secret-2024-ultra-secure
```

### 3. 生成GitHub令牌

#### 步骤：
1. 访问: https://github.com/settings/tokens
2. 点击 **"Generate new token (classic)"**
3. 设置名称: `MCPHubs Vercel Production`
4. 选择权限:
   - ✅ `public_repo` (访问公共仓库)
   - ✅ `read:user` (读取用户信息)
5. 点击 **"Generate token"**
6. 复制生成的token (以 `ghp_` 开头)
7. 在Vercel中将此token设置为 `GITHUB_TOKEN` 环境变量

### 4. 配置每个环境变量

对于每个环境变量：
1. 点击 **"Add New"**
2. 输入 **Name**: (如 `GITHUB_TOKEN`)
3. 输入 **Value**: (对应的值)
4. 选择 **Environment**: `Production`, `Preview`, `Development` (建议全选)
5. 点击 **"Save"**

### 5. 重新部署

配置完成后：
1. 回到项目主页
2. 点击最新的部署
3. 点击右上角的 **"Redeploy"** 按钮
4. 选择 **"Use existing Build Cache"** (可选)
5. 点击 **"Redeploy"**

## 🔍 验证步骤

重新部署完成后，检查：

1. **访问**: https://mcphubs.com/projects
2. **期望结果**: 应该显示MCP项目列表
3. **检查日志**: 在Vercel控制台的"Functions"标签中查看日志

## 📊 系统工作原理

配置完成后，系统将：

1. **数据库优先**: 尝试从Supabase获取项目
2. **GitHub备选**: 如果数据库失败，从GitHub API获取
3. **缓存机制**: 成功获取的数据会被缓存
4. **定时同步**: 每日6点自动同步GitHub项目到数据库

## 🚨 常见问题

### Q: 为什么需要两个数据源？
A: 
- **Supabase数据库**: 提供快速、稳定的数据服务
- **GitHub API**: 作为备选，确保即使数据库问题也能显示项目

### Q: GitHub令牌的权限范围？
A: 
- 只需要 `public_repo` 和 `read:user` 权限
- 不涉及私有仓库或写入操作
- 安全性较高

### Q: 如何确认配置成功？
A: 
- 项目页面显示项目列表
- 控制台日志显示"✅ 从数据库获取到 X 个项目"
- 不再有401认证错误

## 🔗 相关文档

- [Vercel环境变量文档](https://vercel.com/docs/concepts/projects/environment-variables)
- [GitHub令牌生成指南](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Supabase配置说明](https://supabase.com/docs/guides/getting-started) 