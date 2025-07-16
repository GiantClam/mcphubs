# 🔒 MCPHubs 安全部署指南

## ⚠️ 重要安全提醒

**绝对不要将敏感信息提交到代码仓库！** 包括但不限于：
- 数据库密码
- API密钥
- JWT密钥
- OAuth客户端密钥

## 🚀 Vercel 部署步骤

### 1. 环境变量配置

在Vercel仪表板中设置以下环境变量：

#### 🔒 必需的安全变量
```bash
# 同步API保护密钥 (请生成强密钥)
SYNC_API_KEY=your-secure-sync-api-key-here

# NextAuth会话密钥 (请生成强密钥)
NEXTAUTH_SECRET=your-super-secure-nextauth-secret-key
```

#### 📊 Supabase配置
```bash
# 使用您从Supabase获取的真实值替换这些示例
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key...

# 可选: JWT密钥和数据库直连
SUPABASE_JWT_SECRET=your-jwt-secret
POSTGRES_URL=postgres://postgres.your-project:your-password@...
```

#### 🐙 GitHub API配置 (推荐)
```bash
GITHUB_TOKEN=your-github-personal-access-token
```

#### 🔐 OAuth配置 (可选)
```bash
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

### 2. 强密钥生成

#### SYNC_API_KEY 生成方法：
```bash
# 方法1: 使用openssl
openssl rand -base64 32

# 方法2: 使用Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 方法3: 在线生成器 (请使用可信的工具)
# 建议长度: 32字符以上
```

#### NEXTAUTH_SECRET 生成方法：
```bash
# 使用openssl生成
openssl rand -base64 32

# 或访问: https://generate-secret.vercel.app/32
```

### 3. Vercel配置步骤

1. **登录Vercel控制台**
2. **选择您的项目**
3. **进入Settings → Environment Variables**
4. **逐一添加上述环境变量**
5. **确保选择正确的环境** (Production/Preview/Development)

### 4. 部署前安全检查

运行安全检查脚本：
```bash
node scripts/security-check.js
```

或访问部署后的安全检查端点：
```
https://your-domain.vercel.app/api/security-check
```

## 🛡️ 安全最佳实践

### 1. 环境变量安全
- ✅ 使用Vercel环境变量管理
- ✅ 为不同环境配置不同的密钥
- ❌ 不要在代码中硬编码敏感信息
- ❌ 不要将.env文件提交到Git

### 2. API密钥管理
- ✅ 定期轮换API密钥
- ✅ 使用最小权限原则
- ✅ 监控API使用情况
- ❌ 不要在客户端暴露服务端密钥

### 3. 数据库安全
- ✅ 启用Row Level Security (RLS)
- ✅ 使用Supabase内置的认证
- ✅ 定期备份数据
- ❌ 不要在客户端直接操作敏感数据

### 4. 代码安全
- ✅ 定期运行安全检查
- ✅ 使用TypeScript增强类型安全
- ✅ 实施输入验证
- ❌ 不要忽略ESLint安全警告

## 🔍 安全检查清单

部署前请确认：

- [ ] 所有敏感环境变量已在Vercel中配置
- [ ] 没有硬编码的密钥在代码中
- [ ] SYNC_API_KEY使用强密码
- [ ] Supabase RLS策略已启用
- [ ] GitHub Token权限最小化
- [ ] 安全检查API返回SECURE状态

## 🚨 应急响应

如果不小心泄露了敏感信息：

1. **立即轮换所有相关密钥**
2. **检查日志是否有异常访问**
3. **更新Vercel环境变量**
4. **重新部署应用**
5. **监控系统异常活动**

## 📞 支持

如有安全相关问题，请：
1. 检查安全检查API的建议
2. 查看系统日志
3. 联系项目维护者

---

**记住**: 安全是一个持续的过程，不是一次性的任务！ 