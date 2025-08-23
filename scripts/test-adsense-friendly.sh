#!/bin/bash

# 测试 AdSense 友好性
# 这个脚本测试网站是否对 Google AdSense 爬虫友好

echo "🔄 开始测试 AdSense 友好性..."
echo "=================================================="

# 基础 URL
BASE_URL="https://www.mcphubs.com"

echo "🔍 1. 测试 robots.txt 可访问性"
echo "================================"

# 测试 robots.txt 是否可访问
robots_response=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/robots.txt")
if [ "$robots_response" = "200" ]; then
  echo "✅ robots.txt 可访问 (HTTP $robots_response)"
else
  echo "❌ robots.txt 不可访问 (HTTP $robots_response)"
fi

# 获取 robots.txt 内容
robots_content=$(curl -s "${BASE_URL}/robots.txt")
echo "📄 robots.txt 内容预览:"
echo "$robots_content" | head -10
echo ""

echo "🔍 2. 测试 sitemap.xml 可访问性"
echo "=================================="

# 测试 sitemap.xml 是否可访问
sitemap_response=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/sitemap.xml")
if [ "$sitemap_response" = "200" ]; then
  echo "✅ sitemap.xml 可访问 (HTTP $sitemap_response)"
else
  echo "❌ sitemap.xml 不可访问 (HTTP $sitemap_response)"
fi

# 获取 sitemap.xml 内容
sitemap_content=$(curl -s "${BASE_URL}/sitemap.xml")
echo "📄 sitemap.xml 内容预览:"
echo "$sitemap_content" | head -10
echo ""

echo "🔍 3. 测试主要页面可访问性"
echo "=============================="

# 主要页面列表
declare -a main_pages=(
  "/"
  "/what-is-mcp"
  "/awesome-mcp-servers"
  "/projects"
  "/integrations"
  "/community"
  "/development-guides"
  "/concepts"
  "/compare"
  "/troubleshooting"
  "/privacy-policy"
  "/terms-of-service"
  "/monitoring"
  "/blog"
  "/trends"
  "/seo"
  "/search"
  "/themes"
)

# 测试每个主要页面
successful_pages=0
total_pages=${#main_pages[@]}

for page in "${main_pages[@]}"; do
  echo -n "测试 $page ... "
  
  # 发送请求并检查状态码
  response=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${page}")
  
  if [ "$response" = "200" ]; then
    echo "✅ 可访问 (HTTP $response)"
    successful_pages=$((successful_pages + 1))
  else
    echo "❌ 不可访问 (HTTP $response)"
  fi
  
  # 添加小延迟
  sleep 0.1
done

echo ""
echo "📊 主要页面测试结果:"
echo "总页面数: $total_pages"
echo "✅ 成功访问: $successful_pages"
echo "❌ 访问失败: $((total_pages - successful_pages))"
echo "📈 成功率: $(( (successful_pages * 100) / total_pages ))%"

echo ""
echo "🔍 4. 测试多语言路径（AdSense 需要理解网站结构）"
echo "======================================================"

# 测试几个多语言路径
declare -a lang_pages=(
  "/es/troubleshooting"
  "/en/projects"
  "/fr/trends"
  "/de/compare"
  "/ja/what-is-mcp"
)

lang_success=0
lang_total=${#lang_pages[@]}

for page in "${lang_pages[@]}"; do
  echo -n "测试 $page ... "
  
  # 检查是否重定向
  response=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${page}")
  
  if [ "$response" = "301" ] || [ "$response" = "302" ]; then
    echo "✅ 正确重定向 (HTTP $response)"
    lang_success=$((lang_success + 1))
  else
    echo "❌ 重定向失败 (HTTP $response)"
  fi
  
  sleep 0.1
done

echo ""
echo "📊 多语言路径测试结果:"
echo "总路径数: $lang_total"
echo "✅ 正确重定向: $lang_success"
echo "❌ 重定向失败: $((lang_total - lang_success))"

echo ""
echo "🔍 5. AdSense 友好性评估"
echo "=========================="

# 计算总体评分
overall_score=0

# robots.txt 评分 (20分)
if [ "$robots_response" = "200" ]; then
  robots_score=20
  overall_score=$((overall_score + robots_score))
  echo "✅ robots.txt 评分: $robots_score/20"
else
  echo "❌ robots.txt 评分: 0/20"
fi

# sitemap.xml 评分 (20分)
if [ "$sitemap_response" = "200" ]; then
  sitemap_score=20
  overall_score=$((overall_score + sitemap_score))
  echo "✅ sitemap.xml 评分: $sitemap_score/20"
else
  echo "❌ sitemap.xml 评分: 0/20"
fi

# 主要页面可访问性评分 (30分)
page_score=$(( (successful_pages * 30) / total_pages ))
overall_score=$((overall_score + page_score))
echo "📄 主要页面可访问性评分: $page_score/30"

# 多语言路径处理评分 (30分)
lang_score=$(( (lang_success * 30) / lang_total ))
overall_score=$((overall_score + lang_score))
echo "🌐 多语言路径处理评分: $lang_score/30"

echo ""
echo "=================================================="
echo "📊 AdSense 友好性总体评分: $overall_score/100"
echo "=================================================="

if [ $overall_score -ge 90 ]; then
  echo "🎉 优秀！网站对 AdSense 非常友好"
  echo "Google AdSense 应该能够顺利审核通过"
elif [ $overall_score -ge 80 ]; then
  echo "✅ 良好！网站对 AdSense 比较友好"
  echo "建议优化一些细节以提高审核通过率"
elif [ $overall_score -ge 70 ]; then
  echo "⚠️  一般！网站对 AdSense 友好性中等"
  echo "需要进一步优化以提高审核通过率"
else
  echo "❌ 较差！网站对 AdSense 不够友好"
  echo "强烈建议优化以提高审核通过率"
fi

echo ""
echo "🔍 6. 优化建议"
echo "================"

if [ "$robots_response" != "200" ]; then
  echo "⚠️  确保 robots.txt 文件可访问"
fi

if [ "$sitemap_response" != "200" ]; then
  echo "⚠️  确保 sitemap.xml 文件可访问"
fi

if [ $page_score -lt 25 ]; then
  echo "⚠️  提高主要页面的可访问性"
fi

if [ $lang_score -lt 25 ]; then
  echo "⚠️  优化多语言路径的重定向处理"
fi

echo ""
echo "🎯 测试完成！现在网站应该对 Google AdSense 更加友好。"
