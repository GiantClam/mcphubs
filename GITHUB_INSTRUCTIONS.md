# GitHub分支设置说明

由于原始的`main`分支包含了敏感信息（Google Cloud服务账号凭据），我们创建了一个全新的干净分支`clean-branch`。请按照以下步骤在GitHub上完成设置：

## 将clean-branch设为默认分支

1. 访问GitHub上的项目仓库: https://github.com/GiantClam/mcphubs
2. 点击"Settings"（在仓库页面顶部）
3. 在左侧菜单中，点击"Branches"
4. 在"Default branch"部分，点击切换图标
5. 从下拉菜单中选择`clean-branch`
6. 点击"Update"确认更改

## 删除包含敏感信息的main分支

1. 在仓库页面，点击"Branches"查看所有分支
2. 找到`main`分支
3. 点击分支旁边的垃圾桶图标删除它
4. 确认删除

## 本地设置说明

在完成上述步骤后，团队成员应该在本地执行以下命令来使用新的默认分支：

```bash
git fetch mcphubs
git checkout clean-branch
git pull

# 可选：删除本地的main分支
git branch -D main
```

## 注意事项

- 确保所有团队成员都使用新的`clean-branch`
- 记住不要将任何包含敏感信息的文件（如JSON密钥）提交到仓库
- `.gitignore`已更新，将排除所有JSON文件（除了指定的项目配置文件） 