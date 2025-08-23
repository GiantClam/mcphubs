#!/bin/bash

# 多语言路径测试脚本
# 测试多语言路径的重定向功能

echo "🌐 多语言路径测试脚本"
echo "======================"

DOMAIN="www.mcphubs.com"

echo "🌐 测试配置:"
echo "域名: $DOMAIN"
echo "当前时间: $(date)"
echo "北京时间: $(TZ=Asia/Shanghai date)"
echo ""

# 定义要测试的多语言路径
declare -a test_paths=(
  "/es/troubleshooting"
  "/en/projects"
  "/fr/trends"
  "/de/development"
  "/ja/blog"
  "/ko/compare"
  "/sv/search"
  "/ar"
  "/zh"
  "/ru"
  "/pt"
  "/it"
  "/nl"
  "/en-ca/privacy-policy"
  "/en-au/privacy-policy"
  "/es/terms-of-service"
  "/fr/terms-of-service"
  "/de/privacy-policy"
  "/ja/privacy-policy"
  "/ko/troubleshooting"
  "/sv/terms-of-service"
  "/es/monitoring"
  "/ja/troubleshooting"
  "/ko/what-is-mcp"
  "/de/themes"
  "/es/themes"
  "/ko/blog"
)

echo "🔍 1. 测试多语言路径重定向:"
echo "================================"

success_count=0
total_count=${#test_paths[@]}

for path in "${test_paths[@]}"; do
  echo -n "测试 $path ... "
  
  # 发送请求并获取状态码
  response=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN$path")
  
  if [ "$response" = "200" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
    echo "✅ 成功 (HTTP $response)"
    ((success_count++))
  else
    echo "❌ 失败 (HTTP $response)"
  fi
  
  # 添加小延迟避免请求过快
  sleep 0.5
done

echo ""
echo "📊 测试结果统计:"
echo "=================="
echo "总路径数: $total_count"
echo "成功数: $success_count"
echo "失败数: $((total_count - success_count))"
echo "成功率: $((success_count * 100 / total_count))%"
echo ""

echo "🔍 2. 测试具体重定向路径:"
echo "=============================="

# 测试几个具体的重定向
echo "测试 /es/troubleshooting 重定向到 /troubleshooting:"
curl -s -I "https://$DOMAIN/es/troubleshooting" | grep -E "(HTTP|Location|Location:)"
echo ""

echo "测试 /en/projects 重定向到 /projects:"
curl -s -I "https://$DOMAIN/en/projects" | grep -E "(HTTP|Location|Location:)"
echo ""

echo "测试 /fr/trends 重定向到 /trends:"
curl -s -I "https://$DOMAIN/fr/trends" | grep -E "(HTTP|Location|Location:)"
echo ""

echo "🔍 3. 测试 404 页面:"
echo "======================"

echo "测试无效路径 /invalid-page:"
invalid_response=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/invalid-page")
echo "状态码: $invalid_response"

if [ "$invalid_response" = "404" ]; then
  echo "✅ 404 页面正常工作"
else
  echo "❌ 404 页面可能有问题"
fi
echo ""

echo "🔍 4. 验证 robots.txt:"
echo "========================"

echo "检查 robots.txt 中的多语言路径规则:"
robots_content=$(curl -s "https://$DOMAIN/robots.txt")
echo "$robots_content" | grep -E "(Disallow|Allow)" | head -20
echo ""

echo "🔍 5. 验证 sitemap.xml:"
echo "========================"

echo "检查 sitemap.xml 是否包含多语言路径:"
sitemap_content=$(curl -s "https://$DOMAIN/sitemap.xml")
if echo "$sitemap_content" | grep -q "/es/\|/en/\|/fr/\|/de/"; then
  echo "❌ sitemap.xml 仍包含多语言路径"
else
  echo "✅ sitemap.xml 已清理多语言路径"
fi
echo ""

echo "🔍 6. 测试结果分析:"
echo "======================"
echo "✅ 预期结果:"
echo "1. 多语言路径应该返回 200/301/302 状态码"
echo "2. 重定向应该指向对应的英文页面"
echo "3. 无效路径应该返回 404"
echo "4. robots.txt 应该禁止爬取多语言路径"
echo "5. sitemap.xml 不应该包含多语言路径"
echo ""

echo "🔍 7. 下一步操作:"
echo "======================"
if [ $success_count -eq $total_count ]; then
  echo "🎉 所有测试通过！多语言路径重定向正常工作。"
  echo "Google 爬虫现在应该能够正确处理这些路径。"
else
  echo "⚠️  部分测试失败，需要检查重定向配置。"
  echo "建议："
  echo "1. 检查 Next.js 路由配置"
  echo "2. 验证重定向逻辑"
  echo "3. 重新部署应用"
fi
echo ""

echo "🔍 8. 监控命令:"
echo "======================"
echo "# 实时监控多语言路径状态"
echo "watch -n 10 './scripts/test-multilingual-paths.sh'"
echo ""
echo "# 测试单个路径"
echo "curl -I https://$DOMAIN/es/troubleshooting"
echo ""
echo "# 查看重定向链"
echo "curl -L -I https://$DOMAIN/es/troubleshooting"
echo ""

echo "🎯 测试完成！多语言路径重定向系统已部署。"
