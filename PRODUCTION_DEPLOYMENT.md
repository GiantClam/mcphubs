# 🚀 MCPHubs 生产环境部署指南

## 📋 **环境变量配置**

本项目使用环境变量来保护敏感信息，确保源代码中不包含真实的API密钥和配置。

### 🔐 **Google Services 配置**

#### **1. Google AdSense (必需)**
```bash
# 您的真实AdSense Publisher ID
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-1234567890123456
```

**获取方式：**
1. 登录 [Google AdSense](https://www.google.com/adsense/)
2. 进入"账户" → "账户信息"
3. 复制"发布商ID"（格式：ca-pub-xxxxxxxxxxxxxxxxx）

#### **2. Google Analytics (可选)**
```bash
# 您的GA4测量ID
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

**获取方式：**
1. 登录 [Google Analytics](https://analytics.google.com/)
2. 选择属性 → "管理" → "数据流"
3. 复制"测量ID"（格式：G-XXXXXXXXXX）

#### **3. Google Site Verification (可选)**
```bash
# Google Search Console验证代码
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

### 🌐 **不同平台的配置方法**

#### **Vercel 部署**
```bash
# 1. 通过CLI配置
vercel env add NEXT_PUBLIC_GOOGLE_ADSENSE_ID

# 2. 或在Vercel Dashboard中设置
# 项目设置 → Environment Variables → 添加变量
```

#### **Netlify 部署**
```bash
# 在Netlify Dashboard中：
# Site settings → Environment variables → 添加变量
```

#### **Docker 部署**
```bash
# docker-compose.yml
environment:
  - NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-your-real-id
  - NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-YOUR-ANALYTICS-ID
```

#### **传统服务器部署**
```bash
# 创建 .env.production 文件
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-your-real-id
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-YOUR-ANALYTICS-ID
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

## 🔒 **安全最佳实践**

### ✅ **推荐做法**
- ✅ 在生产环境中设置真实的环境变量
- ✅ 源代码中只使用占位符或环境变量
- ✅ 不同环境使用不同的配置文件
- ✅ 定期检查和更新敏感信息

### ❌ **避免做法**
- ❌ 在源代码中硬编码真实ID
- ❌ 将 .env.local 提交到Git
- ❌ 在公开仓库中暴露真实配置
- ❌ 使用生产环境的ID进行开发测试

## 🧪 **测试配置**

### **验证AdSense配置**
1. 构建项目：`npm run build`
2. 检查构建输出中的AdSense ID
3. 确认不是占位符 `ca-pub-XXXXXXXXXXXXXXXXX`

### **验证Analytics配置**
1. 访问部署的网站
2. 打开浏览器开发者工具
3. 检查Network面板是否有GA请求

## 🔄 **更新流程**

当需要更新Google服务配置时：

1. **更新环境变量**（不修改源代码）
2. **重新部署**应用
3. **验证**新配置是否生效

## 📞 **技术支持**

如果遇到配置问题：
- 📧 Email: contact@mcphubs.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📚 文档: [项目文档](https://github.com/your-repo/docs)

---

**⚠️ 重要提醒：永远不要将真实的API密钥提交到公开仓库！** 