# MCPHubs 环境变量配置指南

> **🚨 安全警告**: 本项目部署在Vercel等生产环境时，请务必正确配置所有安全环境变量。绝不要在代码中硬编码任何敏感信息！

## 🔒 关键安全要求

### 生产环境必需配置
以下环境变量在生产环境中**必须**设置，否则系统将拒绝关键操作：

- `SYNC_API_KEY` - 同步API保护密钥（强烈建议使用强密码）
- `NEXTAUTH_SECRET` - NextAuth会话加密密钥
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase数据库访问密钥

### 安全检查工具
访问 `/api/security-check` 可以检查您的环境配置安全状态。

---

本文档详细说明了MCPHubs项目所需的环境变量配置，包括GitHub API、Google Cloud、Supabase数据库和定时任务等。

## 必需的环境变量

### 1. GitHub API 配置
```bash
# GitHub API 访问令牌（推荐配置以避免API限制）
GITHUB_TOKEN=your_github_personal_access_token

# 代理配置（仅开发环境）
PROXY_HOST=127.0.0.1
PROXY_PORT=7890
```

**获取GitHub Token:**
1. 访问 [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择权限: `public_repo`, `read:user`, `read:org`
4. 复制生成的token

### 2. Google Cloud Vertex AI 配置
```bash
# Google Cloud 项目信息
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
VERTEX_LOCATION=us-central1

# 本地开发 - 凭据文件路径
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# 生产环境 - JSON凭据内容（Vercel等云平台）
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
```

**获取Google Cloud凭据:**
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建项目并启用 Vertex AI API
3. 创建服务账号并下载JSON密钥文件
4. 授予服务账号 "Vertex AI User" 权限

### 3. Supabase 数据库配置
```bash
# Supabase 项目配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 数据库连接（可选，用于直接连接）
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

**获取Supabase配置:**
1. 访问 [Supabase Dashboard](https://app.supabase.com/)
2. 创建新项目
3. 在项目设置中找到 "API" 页面
4. 复制 Project URL 和 Service Role Key

### 4. 认证配置
```bash
# NextAuth.js 配置
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3001  # 开发环境
NEXTAUTH_URL=https://your-domain.com  # 生产环境

# GitHub OAuth 应用
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret

# Google OAuth 应用
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

### 5. 定时任务配置
```bash
# 同步任务API密钥（保护定时任务端点）
SYNC_API_KEY=your-secure-sync-api-key

# 可选 - 自定义同步API基础URL
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
```

## 环境文件示例

### 开发环境 (.env.local)
```bash
# GitHub API
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# 代理设置（如需要）
PROXY_HOST=127.0.0.1
PROXY_PORT=7890

# Google Cloud
GOOGLE_CLOUD_PROJECT=my-mcp-project
GOOGLE_CLOUD_LOCATION=us-central1
VERTEX_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NextAuth
NEXTAUTH_SECRET=my-super-secret-key
NEXTAUTH_URL=http://localhost:3001

# OAuth Apps
GITHUB_ID=Iv1.xxxxxxxxxxxx
GITHUB_SECRET=xxxxxxxxxxxxxxxxxxxx
GOOGLE_CLIENT_ID=123456789-xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxx

# 定时任务
SYNC_API_KEY=my-secure-sync-key-123
```

### 生产环境 (Vercel)
```bash
# GitHub API
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# Google Cloud (使用JSON凭据)
GOOGLE_CLOUD_PROJECT=my-mcp-project
GOOGLE_CLOUD_LOCATION=us-central1
VERTEX_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"my-mcp-project",...}

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NextAuth
NEXTAUTH_SECRET=production-super-secret-key
NEXTAUTH_URL=https://mcphubs.example.com

# OAuth Apps (生产环境应用)
GITHUB_ID=Iv1.prod_xxxxxxxx
GITHUB_SECRET=prod_xxxxxxxxxxxxxxxxxxxx
GOOGLE_CLIENT_ID=123456789-prod.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-prod_xxxxxxxxxxxxxxxx

# 定时任务
SYNC_API_KEY=production-secure-sync-key-456
```

## Supabase 数据库设置

### 1. 创建表结构
执行以下SQL在Supabase SQL编辑器中：

```sql
-- 运行 supabase/migrations/001_create_github_projects_table.sql 中的内容
```

### 2. 设置Row Level Security (RLS)
表已自动配置RLS策略：
- 允许所有用户读取数据
- 只允许服务角色修改数据

### 3. 验证数据库连接
访问 `/api/sync?key=your-sync-api-key` 测试数据库连接

## Vercel 部署配置

### 1. 环境变量设置
在Vercel项目设置中添加所有生产环境变量

### 2. 定时任务配置
项目已包含 `vercel.json` 配置：
```json
{
  "crons": [
    {
      "path": "/api/sync",
      "schedule": "0 6 * * *"
    }
  ]
}
```

### 3. 函数超时设置
同步任务函数配置了5分钟超时，适合处理大量项目数据。

## 测试配置

### 1. 测试GitHub API
```bash
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

### 2. 测试数据库连接
访问: `http://localhost:3001/api/sync?key=your-sync-api-key`

### 3. 测试项目API
访问: `http://localhost:3001/api/projects`

### 4. 手动触发同步
```bash
curl -X POST "http://localhost:3001/api/sync?key=your-sync-api-key" \
  -H "Content-Type: application/json" \
  -d '{"force": true, "source": "manual"}'
```

## 常见问题

### Q: GitHub API 频率限制
A: 配置 `GITHUB_TOKEN` 可将限制从每小时60次提升到5000次

### Q: Google Cloud 认证失败
A: 检查服务账号权限和凭据文件格式

### Q: Supabase 连接失败
A: 验证URL和密钥格式，确保网络可访问

### Q: 定时任务不执行
A: 检查Vercel Cron配置和API密钥设置

### Q: 项目数据为空
A: 首次使用需手动触发同步任务初始化数据

## 安全建议

1. **API密钥轮换**: 定期更换所有API密钥
2. **最小权限原则**: 只授予必要的权限
3. **环境隔离**: 开发和生产环境使用不同的凭据
4. **监控访问**: 启用API访问日志和监控
5. **备份策略**: 定期备份重要的环境配置

## 监控和日志

### 查看同步状态
- 访问: `/api/sync?key=your-sync-api-key` (GET)
- 查看控制台日志了解同步详情

### 项目统计
- 数据库中的统计视图提供项目分布信息
- 可通过Supabase Dashboard查看数据变化

---

如有问题，请查看项目日志或提交Issue。 