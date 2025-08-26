#!/bin/bash

echo "🔍 测试所有 API 端点状态"
echo "================================"

# API 端点列表
apis=(
    "/api/auth/[...nextauth]"
    "/api/cron-test"
    "/api/diagnose"
    "/api/geo"
    "/api/github/projects"
    "/api/github/projects/123"
    "/api/placeholder/test"
    "/api/projects"
    "/api/projects/integrity"
    "/api/security-check"
    "/api/startup-sync"
    "/api/sync"
    "/api/sync-simple"
    "/api/sync-status"
    "/api/test-proxy"
    "/api/vertex"
)

base_url="https://www.mcphubs.com"

echo "测试时间: $(date)"
echo "基础URL: $base_url"
echo ""

for api in "${apis[@]}"; do
    echo "测试: $api"
    
    # 测试 API 端点
    response=$(curl -s -o /dev/null -w "%{http_code}" "$base_url$api")
    
    if [ "$response" = "200" ]; then
        echo "  ✅ 状态: $response (正常)"
    elif [ "$response" = "401" ] || [ "$response" = "403" ]; then
        echo "  🔒 状态: $response (需要认证)"
    elif [ "$response" = "404" ]; then
        echo "  ❌ 状态: $response (未找到)"
    elif [ "$response" = "500" ]; then
        echo "  💥 状态: $response (服务器错误)"
    else
        echo "  ⚠️  状态: $response (其他)"
    fi
    
    # 检查 X-Robots-Tag 头
    robots_header=$(curl -s -I "$base_url$api" | grep -i "x-robots-tag" || echo "无")
    if [[ "$robots_header" == *"noindex"* ]]; then
        echo "  🚫 X-Robots-Tag: $robots_header (正确设置)"
    else
        echo "  ⚠️  X-Robots-Tag: $robots_header (可能需要设置)"
    fi
    
    echo ""
done

echo "✅ API 测试完成！"
echo ""
echo "📋 API 端点说明："
echo "  🔐 auth/[...nextauth] - NextAuth.js 认证"
echo "  ⏰ cron-test - Cron 任务测试"
echo "  🔍 diagnose - 诊断工具"
echo "  🌍 geo - 地理位置服务"
echo "  📦 github/projects - GitHub 项目数据"
echo "  📄 placeholder - 占位符路由"
echo "  📋 projects - 项目数据"
echo "  🔒 security-check - 安全检查"
echo "  🚀 startup-sync - 启动同步"
echo "  🔄 sync - 主要同步服务"
echo "  ⚡ sync-simple - 简化同步"
echo "  📊 sync-status - 同步状态"
echo "  🌐 test-proxy - 代理测试"
echo "  🧠 vertex - Vertex AI 服务"
