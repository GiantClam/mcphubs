# 🚀 MCPHubs - Model Context Protocol 项目中心

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/GiantClam/mcphubs)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green?logo=supabase)](https://supabase.com/)

**智能化的 MCP 项目发现与管理平台**

[🌐 在线访问](https://mcphubs.vercel.app) • [📚 文档](./ENVIRONMENT_SETUP.md) • [🔒 安全指南](./SECURITY_DEPLOYMENT_GUIDE.md)

</div>

## 📖 项目简介

MCPHubs 是一个现代化的 Model Context Protocol (MCP) 项目展示平台，专注于发现、分析和展示与 Anthropic MCP 相关的开源项目。通过智能化的同步系统和AI驱动的项目分析，为开发者提供最全面的MCP生态系统信息。

### 🌟 核心亮点

- **🤖 智能项目发现**: 6种搜索策略覆盖200+项目
- **⚡ 10倍性能提升**: 多级缓存系统，响应时间从5秒降至500毫秒
- **🔄 自动化同步**: 每日6点自动更新项目数据
- **📊 实时数据库**: Supabase集成，数据持久化存储
- **🛡️ 企业级安全**: 全面的安全配置和检查机制
- **📱 现代化UI**: 响应式设计，暗色模式支持

## 🏗️ 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub API    │    │  Google Cloud   │    │   Supabase      │
│   项目数据源    │◄─┐ │   AI 分析       │    │   数据存储      │
└─────────────────┘  │ └─────────────────┘    └─────────────────┘
                     │                                   ▲
┌─────────────────┐  │ ┌─────────────────┐              │
│  Vercel Cron    │  │ │  同步服务层     │──────────────┘
│  定时任务       │──┼─┤  智能增量同步   │
└─────────────────┘  │ └─────────────────┘
                     │           ▲
┌─────────────────┐  │           │
│  缓存优化层     │◄─┘           │
│  多级缓存       │              │
└─────────────────┘              │
           ▲                     │
┌─────────────────┐              │
│   Next.js App   │──────────────┘
│   用户界面      │
└─────────────────┘
```

## 🛠️ 技术栈

### 前端技术
- **Next.js 15** - React 全栈框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 现代化 CSS 框架
- **React Icons** - 图标库
- **NextAuth.js** - 认证解决方案

### 后端服务
- **Supabase** - 开源 Firebase 替代方案
- **PostgreSQL** - 关系型数据库
- **Vercel Cron** - 定时任务
- **GitHub API** - 项目数据源

### AI & 分析
- **Google Vertex AI** - Gemini Pro 模型
- **智能评分算法** - 项目相关性分析
- **关键词权重分析** - 精准匹配 MCP 项目

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/GiantClam/mcphubs.git
cd mcphubs
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

复制环境变量模板：
```bash
cp env.template .env.local
```

配置必需的环境变量（详见 [环境配置指南](./ENVIRONMENT_SETUP.md)）：

```bash
# 🔒 必需的安全变量
SYNC_API_KEY=your-secure-api-key
NEXTAUTH_SECRET=your-nextauth-secret

# 📊 Supabase 数据库
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 🐙 GitHub API (推荐)
GITHUB_TOKEN=your-github-token
```

### 4. 数据库设置

执行数据库迁移：
```bash
# 在 Supabase 控制台中运行
supabase/migrations/001_create_github_projects_table.sql
```

### 5. 启动开发服务器

```bash
npm run dev
# 或使用开发脚本
./start-dev.sh
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📊 核心功能

### 🔍 智能项目发现
- **多策略搜索**: 6种不同的GitHub搜索策略
- **AI驱动分析**: Gemini Pro模型评估项目相关性
- **实时更新**: 支持手动和自动同步

### ⚡ 高性能缓存
- **内存缓存**: 1小时热数据缓存
- **数据库优先**: 优先从Supabase读取
- **智能降级**: API故障时的优雅处理

### 🛡️ 安全特性
- **API密钥保护**: 同步操作需要验证
- **环境变量检查**: 自动安全扫描
- **敏感信息保护**: 防止意外泄露

### 📱 用户体验
- **响应式设计**: 完美适配各种设备
- **暗色模式**: 护眼的深色主题
- **多语言支持**: 中英文界面
- **SEO优化**: 完整的元数据和结构化数据

## 🔧 管理功能

### 管理员面板
访问 `/admin/sync` 进行系统管理：
- 实时监控同步状态
- 手动触发数据同步
- 查看详细操作日志
- 系统健康检查

### API 端点
- `GET /api/projects` - 获取项目列表
- `GET /api/security-check` - 安全状态检查
- `POST /api/sync` - 触发数据同步
- `GET /api/sync` - 查询同步状态

## 🚀 部署指南

### Vercel 部署（推荐）

1. **连接 GitHub 仓库**
   - 在 Vercel 控制台导入项目
   - 连接到您的 GitHub 仓库

2. **配置环境变量**
   
   参考 [安全部署指南](./SECURITY_DEPLOYMENT_GUIDE.md) 在 Vercel 中设置：
   
   ```bash
   # 必需变量
   SYNC_API_KEY=<生成的32位密钥>
   NEXTAUTH_SECRET=<生成的32位密钥>
   NEXT_PUBLIC_SUPABASE_URL=<您的Supabase URL>
   SUPABASE_SERVICE_ROLE_KEY=<您的服务角色密钥>
   
   # 推荐变量
   GITHUB_TOKEN=<您的GitHub令牌>
   ```

3. **部署完成**
   - Vercel 自动检测 Next.js 项目
   - 自动配置 Cron 定时任务
   - 验证部署：访问 `/api/security-check`

### 密钥生成

```bash
# 生成安全密钥
openssl rand -base64 32  # SYNC_API_KEY
openssl rand -base64 32  # NEXTAUTH_SECRET
```

## 📚 文档索引

- 📖 [环境变量配置指南](./ENVIRONMENT_SETUP.md)
- 🔒 [安全部署指南](./SECURITY_DEPLOYMENT_GUIDE.md)
- 🤖 [自动化同步系统说明](./AUTOMATED_SYNC_SYSTEM.md)
- 📊 [环境变量状态检查](./ENVIRONMENT_VARIABLES_STATUS.md)
- 🛡️ [安全审核报告](./SECURITY_AUDIT_REPORT.md)

## 🔍 安全检查

部署前运行安全检查：

```bash
# 本地检查
node scripts/security-check.js

# 在线检查（部署后）
curl https://your-domain.vercel.app/api/security-check
```

## 📈 性能优化

### 加载性能
- **初始加载**: 2-5秒 → 200-500毫秒 (10x 提升)
- **缓存命中**: <50毫秒响应时间
- **API效率**: 90%减少GitHub API调用

### 数据同步
- **智能增量**: 只同步变更的项目
- **批量处理**: 优化数据库操作
- **错误处理**: 完善的重试机制

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Anthropic](https://www.anthropic.com/) - MCP 协议开发
- [Supabase](https://supabase.com/) - 数据库服务
- [Vercel](https://vercel.com/) - 部署平台
- [Next.js](https://nextjs.org/) - React 框架

---

<div align="center">

**🌟 如果这个项目对您有帮助，请给我们一个 Star！🌟**

[⬆ 回到顶部](#-mcphubs---model-context-protocol-项目中心)

</div>
