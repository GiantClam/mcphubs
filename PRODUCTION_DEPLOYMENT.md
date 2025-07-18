# 🚀 MCPHubs 生产环境部署指南

## 📋 **环境变量配置**

本项目使用环境变量来保护敏感信息，确保源代码中不包含真实的API密钥和配置。

### 🔐 **Google Services 配置**

#### **1. Google AdSense (已硬编码) ✅**
```typescript
// AdSense Publisher ID 已直接写入代码中
'google-adsense-account': 'ca-pub-7958390626430202'
```

**✅ 无需配置**: AdSense Publisher ID 已硬编码在 `src/app/layout.tsx` 中，部署时无需设置环境变量。

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
# 只需要设置Analytics和Site Verification（可选）
vercel env add NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
vercel env add NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
```

#### **Netlify 部署**
```bash
# 在Netlify Dashboard中：
# Site settings → Environment variables → 添加可选变量
```

#### **Docker 部署**
```bash
# docker-compose.yml（可选变量）
environment:
  - NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-YOUR-ANALYTICS-ID
  - NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

#### **传统服务器部署**
```bash
# 创建 .env.production 文件（可选变量）
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-YOUR-ANALYTICS-ID
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

## 🔒 **安全最佳实践**

### ✅ **推荐做法**
- ✅ AdSense ID 硬编码 - 简单有效
- ✅ 不同环境使用不同的可选配置文件
- ✅ 定期检查和更新敏感信息

### ❌ **避免做法**
- ❌ 将 .env.local 提交到Git
- ❌ 在公开仓库中暴露OAuth secrets
- ❌ 使用生产环境的敏感ID进行开发测试

## 🧪 **测试配置**

### **验证AdSense配置 ✅**
```bash
# AdSense已硬编码，无需验证环境变量
# 直接检查网页源代码即可看到：
# <script src="...client=ca-pub-7958390626430202">
```

### **验证Analytics配置**
1. 访问部署的网站
2. 打开浏览器开发者工具
3. 检查Network面板是否有GA请求

## 🔄 **更新流程**

### **更新AdSense ID**
1. 修改 `src/app/layout.tsx` 中的 Publisher ID
2. 重新部署应用

### **更新其他Google服务**
1. 更新环境变量
2. 重新部署应用
3. 验证新配置是否生效

## 📞 **技术支持**

如果遇到配置问题：
- 📧 Email: contact@mcphubs.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📚 文档: [项目文档](https://github.com/your-repo/docs)

---

**📌 重要说明：AdSense Publisher ID 现在已硬编码，部署更加简单！** 