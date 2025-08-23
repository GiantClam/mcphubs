#!/bin/bash

# 测试服务器路径重定向功能
# 这个脚本专门测试所有 /servers/* 路径的重定向

echo "🖥️  开始测试服务器路径重定向功能..."
echo "=================================================="

# 基础 URL
BASE_URL="https://www.mcphubs.com"

# 服务器路径测试数组
declare -a server_paths=(
  # 已知的服务器路径
  "/servers/amap"
  "/servers/sibbl"
  "/servers/ethangillani"
  "/servers/kukapay"
  "/servers/baranwang"
  "/servers/cuongtl1992"
  "/servers/amitsh06"
  "/servers/unravel-team"
  
  # 可能的其他服务器路径
  "/servers/test"
  "/servers/example"
  "/servers/demo"
  "/servers/sample"
  "/servers/unknown"
)

# 计数器
total_tests=0
successful_redirects=0
failed_redirects=0

echo "📊 总共需要测试 ${#server_paths[@]} 个服务器路径"
echo ""

# 测试每个服务器路径
for path in "${server_paths[@]}"; do
  total_tests=$((total_tests + 1))
  
  echo -n "🔍 测试路径 ${total_tests}/${#server_paths[@]}: ${path} ... "
  
  # 发送请求并检查状态码
  response=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${path}")
  
  if [ "$response" = "301" ] || [ "$response" = "302" ]; then
    echo "✅ 重定向成功 (${response})"
    successful_redirects=$((successful_redirects + 1))
  else
    echo "❌ 重定向失败 (${response})"
    failed_redirects=$((failed_redirects + 1))
  fi
  
  # 添加小延迟避免请求过快
  sleep 0.1
done

echo ""
echo "=================================================="
echo "📊 服务器路径测试结果汇总"
echo "=================================================="
echo "总测试数: ${total_tests}"
echo "✅ 成功重定向: ${successful_redirects}"
echo "❌ 重定向失败: ${failed_redirects}"
echo "📈 成功率: $(( (successful_redirects * 100) / total_tests ))%"

if [ $failed_redirects -eq 0 ]; then
  echo ""
  echo "🎉 所有服务器路径重定向测试通过！"
  echo "Google 爬虫现在应该能够正确处理所有 /servers/* 路径。"
  exit 0
else
  echo ""
  echo "⚠️  有 ${failed_redirects} 个服务器路径重定向失败，需要检查"
  exit 1
fi
