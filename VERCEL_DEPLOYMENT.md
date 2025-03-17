# Vercel部署指南

本文档提供在Vercel上部署MCPHubs项目的详细步骤，重点说明如何正确配置Google Cloud凭据。

## 配置Google Cloud凭据

由于Vercel是无服务器环境，不支持直接读取文件系统上的凭据文件，我们需要使用环境变量来存储Google Cloud凭据：

### 步骤1：准备凭据内容

1. 打开您的Google Cloud服务账号JSON凭据文件：`google-credentials.json`
2. 复制**整个文件内容**（包括所有大括号、引号和内部内容）

### 步骤2：在Vercel上配置项目

1. 登录[Vercel](https://vercel.com)并导入您的GitHub项目
2. 在"Import Project"页面，保持默认设置不变，点击"Deploy"
3. 部署完成后，点击项目进入项目控制面板

### 步骤3：配置环境变量

1. 在项目控制面板，点击"Settings"选项卡
2. 在左侧菜单中选择"Environment Variables"
3. 添加以下环境变量：

   | 名称 | 值 | 环境 |
   |------|-----|------|
   | `GOOGLE_CLOUD_PROJECT` | `your-project-id` | Production, Preview |
   | `GOOGLE_CLOUD_LOCATION` | `us-central1` | Production, Preview |
   | `VERTEX_LOCATION` | `us-central1` | Production, Preview |
   | `GOOGLE_APPLICATION_CREDENTIALS_JSON` | *粘贴整个JSON凭据文件的内容* | Production, Preview |

   > **注意**：`GOOGLE_APPLICATION_CREDENTIALS_JSON`变量需要包含完整的JSON内容，确保格式正确。

4. 点击"Save"保存环境变量

### 步骤4：重新部署项目

1. 前往"Deployments"选项卡
2. 点击"Redeploy"以使用新的环境变量重新部署项目

## 验证部署

部署完成后，您可以通过访问以下端点来验证Google Cloud凭据是否正确配置：

```
https://your-vercel-domain.vercel.app/api/vertex
```

该端点应返回包含以下信息的JSON响应：

```json
{
  "status": "ok",
  "environment": "production",
  "credentials": {
    "exists": true,
    "type": "environment-variable",
    "project": "your-project-id",
    "location": "us-central1"
  },
  "deploymentPlatform": "Vercel"
}
```

## 注意事项

1. **安全性**：Vercel会加密存储环境变量，但请确保：
   - 不要在代码中硬编码或泄露凭据
   - 使用最小权限原则设置服务账号
   - 定期轮换服务账号密钥

2. **费用**：使用Google Cloud Vertex AI可能产生费用，请密切关注您的使用情况

3. **本地开发**：
   - 本地开发环境仍然使用文件系统凭据
   - 代码已更新，能够同时支持文件系统凭据和环境变量凭据

4. **调试问题**：
   - 检查Vercel的Function Logs以查看详细错误信息
   - 使用`/api/vertex`端点验证凭据配置
   - 确认环境变量中的JSON格式正确无误

## 其他Vercel设置

您可能还需要配置以下Vercel设置：

1. **自定义域名**：在"Domains"选项卡中添加
2. **构建命令**：默认为`next build`，通常无需更改
3. **输出目录**：默认为`.next`，通常无需更改
4. **Node.js版本**：在"Settings" > "General" > "Node.js Version"中设置，推荐使用Node.js 18.x或更高版本

## 进一步信息

- [Vercel文档](https://vercel.com/docs)
- [Next.js部署文档](https://nextjs.org/docs/deployment)
- [Google Cloud Vertex AI文档](https://cloud.google.com/vertex-ai/docs)
- [Vertex AI Node.js客户端库](https://www.npmjs.com/package/@google-cloud/vertexai) 