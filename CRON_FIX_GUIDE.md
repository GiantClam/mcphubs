# 🔧 Cron 任务修复指南

## 📋 **问题描述**

首页的 "Auto Updates" 日期没有更新，表示 Vercel Cron 定时器任务没有完成或者没有生效。

## 🔍 **诊断结果**

通过诊断脚本发现以下问题：

1. **✅ 首页包含 Auto Updates 信息**
   - 显示 "Auto Updates: 08/20"
   - 显示 "Next: Daily at 6:00 AM"

2. **❌ 同步状态异常**
   - `lastSync: null` - 从未成功同步
   - `totalProjects: 0` - 没有项目数据
   - `nextScheduledSync: "2025-08-24T06:00:00.000Z"` - 下次同步时间异常

3. **❌ API 认证失败**
   - 手动触发同步返回 "Unauthorized: Invalid API key"
   - 说明 `SYNC_API_KEY` 环境变量有问题

## 🔧 **解决方案**

### **步骤 1：设置环境变量**

#### **1.1 生成新的 SYNC_API_KEY**

```bash
# 运行脚本生成新的 API 密钥
./scripts/generate-api-key.sh
```

**新生成的 API 密钥**: `iB3HHMyTaY6P06J0msfC6Tv5FkQ5FbG9`

#### **1.2 在 Vercel 中设置环境变量**

1. 登录 [Vercel 控制台](https://vercel.com/dashboard)
2. 进入项目设置
3. 找到 **Environment Variables** 部分
4. 添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `SYNC_API_KEY` | `iB3HHMyTaY6P06J0msfC6Tv5FkQ5FbG9` | API 认证密钥 |
| `GITHUB_TOKEN` | `ghp_xxxxxxxxxxxxxxxxxxxx` | GitHub API 访问令牌 |
| `NEXT_PUBLIC_SITE_URL` | `https://www.mcphubs.com` | 网站 URL |

#### **1.3 重新部署项目**

设置环境变量后，需要重新部署项目：

1. 在 Vercel 控制台中点击 **Redeploy**
2. 等待部署完成

### **步骤 2：验证修复**

#### **2.1 检查环境变量**

```bash
# 运行环境变量检查脚本
./scripts/check-env-vars.sh
```

#### **2.2 测试 API 端点**

```bash
# 测试同步状态
curl https://www.mcphubs.com/api/sync-status

# 手动触发同步（使用新的 API 密钥）
curl -X POST https://www.mcphubs.com/api/sync \
  -H "Content-Type: application/json" \
  -H "x-api-key: iB3HHMyTaY6P06J0msfC6Tv5FkQ5FbG9" \
  -d '{"fastMode": true}'
```

#### **2.3 检查 Cron 任务状态**

```bash
# 运行 Cron 状态检查脚本
./scripts/check-cron-simple.sh
```

### **步骤 3：监控 Cron 任务**

#### **3.1 检查 Vercel 日志**

1. 在 Vercel 控制台中查看 **Functions** 日志
2. 检查 `/api/sync` 端点的执行情况
3. 查看是否有错误信息

#### **3.2 检查 Cron 执行历史**

1. 在 Vercel 控制台中查看 **Cron** 部分
2. 检查任务是否按计划执行
3. 查看执行状态和结果

## 📊 **预期结果**

修复成功后，应该看到：

1. **同步状态正常**
   - `lastSync` 有具体时间
   - `totalProjects` 有项目数量
   - `nextScheduledSync` 时间正确

2. **首页更新**
   - "Auto Updates" 日期会更新
   - 显示最新的同步时间

3. **Cron 任务正常**
   - 每小时自动执行一次
   - 成功同步 GitHub 项目数据

## 🚨 **常见问题**

### **问题 1：环境变量未生效**

**原因**: 环境变量设置后需要重新部署
**解决**: 在 Vercel 控制台中重新部署项目

### **问题 2：API 密钥无效**

**原因**: API 密钥格式错误或未正确设置
**解决**: 重新生成并设置 API 密钥

### **问题 3：GitHub Token 过期**

**原因**: GitHub Token 可能已过期
**解决**: 生成新的 GitHub Token 并更新环境变量

### **问题 4：Cron 任务不执行**

**原因**: Vercel 计划不支持 Cron 或配置错误
**解决**: 检查 Vercel 计划，确保支持 Cron 功能

## 📞 **获取帮助**

如果问题仍然存在：

1. 检查 Vercel 控制台中的错误日志
2. 运行诊断脚本获取详细信息
3. 确认环境变量设置正确
4. 验证 Vercel 计划支持 Cron 功能

## 🎯 **总结**

首页 "Auto Updates" 日期不更新的主要原因是：

1. **环境变量配置错误** - `SYNC_API_KEY` 无效
2. **Cron 任务从未成功执行** - 认证失败导致同步失败
3. **没有项目数据** - 同步失败导致数据库为空

按照本指南设置正确的环境变量后，Cron 任务应该能够正常工作，首页的更新日期也会正常显示。

---

*🔧 修复完成后，你的网站应该能够正常自动更新 GitHub 项目数据了！*
