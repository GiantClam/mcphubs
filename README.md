# MCPHubs - Model Context Protocol Projects Hub

MCPHubs 是一个展示与 Anthropic 的 Model Context Protocol (MCP) 相关项目的网站。该网站使用 Next.js 构建，提供了以下功能：

- 从 GitHub 检索与 MCP 相关的项目
- 使用 AI 分析项目内容，评估与 MCP 的相关性
- 展示项目列表和详细信息
- 提供项目的 README 内容和相关分析

## 技术栈

- Next.js 15
- TypeScript
- Tailwind CSS
- React Icons
- Axios (用于 API 请求)
- Google Cloud Vertex AI (Gemini Pro 模型，用于 AI 分析)
- React Markdown (用于渲染 README)

## 特性

- 环境自适应代理：在开发环境自动使用代理解决 CORS 问题，生产环境直接调用 API
- GitHub API 集成：检索与 MCP 相关的项目
- AI 分析：使用 Google Gemini Pro 评估项目与 MCP 的相关性
- 响应式设计：适配各种设备尺寸

## 本地开发

1. 克隆仓库

```bash
git clone https://github.com/yourusername/mcphubs.git
cd mcphubs
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

创建 `.env.local` 文件并添加以下内容：

```
# GitHub API Token (可选，但推荐使用以避免 API 速率限制)
GITHUB_TOKEN=your_github_token_here

# Google Cloud Vertex AI 配置
GOOGLE_CLOUD_PROJECT=zippy-aurora-444204-q2
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./zippy-aurora-444204-q2-a8b576f1c6e4.json
VERTEX_LOCATION=us-central1
```

4. 配置 Google Cloud 服务账号

将您的 Google Cloud 服务账号凭据文件（JSON 格式）放在项目根目录下，文件名与 `GOOGLE_APPLICATION_CREDENTIALS` 环境变量中指定的名称一致。

如果您还没有服务账号，可以按照以下步骤创建：
   - 前往 [Google Cloud Console](https://console.cloud.google.com/)
   - 选择您的项目
   - 导航到 "IAM & Admin" > "Service Accounts"
   - 创建新的服务账号，并授予必要的权限（Vertex AI 使用者）
   - 创建并下载 JSON 密钥文件
   - 将文件放在项目根目录下

5. 启动开发服务器

```bash
./start-dev.sh
```

6. 在浏览器中访问 [http://localhost:3001](http://localhost:3001) (或控制台显示的其他端口)

## 代理配置说明

该项目具有环境自适应的代理配置：

- **开发环境**：自动启用 API 代理，解决本地开发时的 CORS 问题
  - GitHub API: `/api/github/*` → `https://api.github.com/*`
  - Vertex AI: `/api/vertex/*` → `https://us-central1-aiplatform.googleapis.com/v1/*`

- **生产环境**：自动禁用代理，直接调用外部 API

这种配置无需手动切换，系统会根据 `NODE_ENV` 环境变量自动决定是否使用代理。

## 部署

该项目可以部署到 Vercel、Netlify 或其他支持 Next.js 的平台。

部署时，请确保设置以下环境变量：
- `GITHUB_TOKEN`
- `GOOGLE_CLOUD_PROJECT`
- `GOOGLE_CLOUD_LOCATION`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `VERTEX_LOCATION`

对于云平台部署，您可能需要将 Google Cloud 凭据作为环境变量直接设置，而不是使用文件。

## 功能

- **首页**：展示 MCP 相关项目的列表
- **项目详情页**：展示单个项目的详细信息，包括：
  - 项目基本信息（名称、描述、星数等）
  - AI 分析的 MCP 相关性评分 (使用 Google Gemini Pro 模型)
  - 项目的关键特性和用例
  - 项目的 README 内容

## 许可证

MIT
