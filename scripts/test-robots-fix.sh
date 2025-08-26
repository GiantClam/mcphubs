#!/bin/bash

echo "🔍 测试 robots.txt 修复效果"
echo "================================"

echo "1. 检查 robots.txt 内容："
curl -s https://www.mcphubs.com/robots.txt
echo -e "\n"

echo "2. 检查主页的 X-Robots-Tag 头："
curl -s -I https://www.mcphubs.com/ | grep -i "x-robots\|robots" || echo "✅ 主页没有 X-Robots-Tag 头"

echo "3. 检查 API 路径的 X-Robots-Tag 头："
curl -s -I https://www.mcphubs.com/api/sync | grep -i "x-robots\|robots" || echo "❌ API 路径也没有 X-Robots-Tag 头"

echo "4. 测试 Google 爬虫模拟："
curl -s -H "User-Agent: Googlebot" https://www.mcphubs.com/ | head -20

echo -e "\n5. 检查 sitemap.xml："
curl -s https://www.mcphubs.com/sitemap.xml | head -10

echo -e "\n✅ 测试完成！"
echo "📝 如果主页没有 X-Robots-Tag 头，说明修复成功"
echo "🔄 请等待几分钟后再次在 Google Search Console 中测试"
