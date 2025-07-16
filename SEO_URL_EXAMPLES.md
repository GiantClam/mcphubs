# SEO友好URL结构示例

本文档展示MCPHubs项目详情页的新SEO友好URL结构和功能。

## 🎯 URL格式类型

### 1. 推荐格式：owner-projectname
```
/project/anthropic-mcp-server
/project/microsoft-semantic-kernel
/project/openai-chatgpt-retrieval-plugin
```

**优势：**
- SEO友好，包含关键词
- 易于阅读和记忆
- 避免特殊字符问题

### 2. 兼容格式：owner/projectname
```
/project/anthropic/mcp-server
/project/microsoft/semantic-kernel
/project/openai/chatgpt-retrieval-plugin
```

### 3. 向后兼容：数字ID
```
/project/123456789
/project/987654321
```

## 🔧 技术实现

### URL生成函数
```typescript
// 生成SEO友好的URL slug
generateProjectSlug("Microsoft", "Semantic-Kernel")
// 输出: "microsoft-semantic-kernel"

generateProjectSlug("OpenAI", "ChatGPT Retrieval Plugin") 
// 输出: "openai-chatgpt-retrieval-plugin"
```

### URL解析函数
```typescript
// 解析不同格式的URL
parseProjectSlug("microsoft-semantic-kernel")
// 输出: { owner: "microsoft", name: "semantic-kernel", fullName: "microsoft/semantic-kernel" }

parseProjectSlug("openai/chatgpt-retrieval-plugin")
// 输出: { owner: "openai", name: "chatgpt-retrieval-plugin", fullName: "openai/chatgpt-retrieval-plugin" }

parseProjectSlug("123456")
// 输出: { isNumericId: true }
```

## 📊 SEO优化特性

### 1. 改进的Meta标签
```html
<title>Semantic Kernel by Microsoft - MCPHubs</title>
<meta name="description" content="Microsoft's Semantic Kernel for AI orchestration" />
<meta property="og:title" content="Semantic Kernel - MCP项目" />
<meta property="og:description" content="Microsoft's Semantic Kernel for AI orchestration" />
```

### 2. 结构化数据支持
- OpenGraph标签
- Twitter Card支持
- JSON-LD结构化数据（可扩展）

### 3. 面包屑导航
```
MCPHubs > 项目 > Microsoft > Semantic Kernel
```

## 🛡️ 容错机制

### 多层级查找策略
1. **精确匹配**：从数据库或缓存查找
2. **API调用**：直接GitHub API获取
3. **搜索匹配**：在已获取项目中查找
4. **模糊匹配**：处理URL编码问题
5. **演示数据**：优雅降级，避免404

### 错误处理
- 无效URL格式验证
- 网络请求超时处理
- API限制优雅降级
- 友好的错误提示页面

## 📈 性能优化

### 缓存策略
- 项目数据内存缓存
- README内容缓存
- 静态页面预渲染

### 懒加载
- 图片懒加载
- 组件按需加载
- API请求优化

## 🧪 测试示例

### 可以测试的URL：
```bash
# SEO友好格式
http://localhost:3002/project/microsoft-semantic-kernel
http://localhost:3002/project/anthropic-mcp-server
http://localhost:3002/project/openai-chatgpt

# 传统格式
http://localhost:3002/project/microsoft/semantic-kernel
http://localhost:3002/project/123456

# 演示数据
http://localhost:3002/project/demo-project
http://localhost:3002/project/test-mcp-server
```

### 预期行为：
✅ 所有URL都能正常访问（不会404）
✅ 显示相应的项目信息或演示数据
✅ SEO meta标签正确生成
✅ 面包屑导航显示正确
✅ 社交分享卡片工作正常

## 📝 迁移说明

### 从旧URL到新URL
旧的数字ID URL仍然工作，新的项目卡片会自动生成SEO友好的URL。

### 重定向策略（未来可实现）
```javascript
// 可选：添加重定向逻辑
if (isNumericId && realProject) {
  redirect(`/project/${generateProjectSlug(realProject.owner, realProject.name)}`);
}
```

## 🔍 SEO检查清单

- [x] URL包含关键词
- [x] 标题包含项目名和所有者
- [x] 描述信息清晰
- [x] OpenGraph标签完整
- [x] Twitter Card支持
- [x] 响应式设计
- [x] 快速加载时间
- [x] 结构化数据（可扩展）
- [x] 面包屑导航
- [x] 内部链接优化

这个新的URL结构将显著提升MCPHubs在搜索引擎中的表现！🚀 