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
  # 基础多语言路径
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
  
  # 扩展语言变体
  "/en-ca/privacy-policy"
  "/en-au/privacy-policy"
  "/en-gb/terms-of-service"
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
  
  # 新增的路径
  "/en/search"
  "/en-au/seo"
  "/fr/troubleshooting"
  "/ko/privacy-policy"
  "/fr/seo"
  "/sv/community"
  "/en/terms-of-service"
  "/en-au/projects"
  "/en/trends"
  "/en-ca/seo"
  "/en-au/blog"
  "/es/blog"
  "/en-au/troubleshooting"
  "/ja/what-is-mcp"
  "/fr/search"
  "/de/what-is-mcp"
  "/en/development"
  "/fr/development"
  "/en"
  "/fr/compare"
  "/zh-tw"
  "/zh-hk"
  "/fr/monitoring"
  "/sv/seo"
  "/sv/privacy-policy"
  "/en-ca/concepts"
  "/en-gb/community"
  "/en-au/integrations"
  "/ja/community"
  "/ko/community"
  "/de/concepts"
  "/fr/concepts"
  "/es/concepts"
  "/ko/concepts"
  "/en-au/concepts"
  "/ja/trends"
  "/en-ca/compare"
  "/en-au/terms-of-service"
  "/en-ca/search"
  "/en-au/search"
  "/ko/terms-of-service"
  "/en/concepts"
  "/en/monitoring"
  "/en/themes"
  "/en/awesome-mcp-servers"
  "/en/integrations"
  "/en/seo"
  "/en/community"
  "/en/projects"
  "/en/what-is-mcp"
  "/en/compare"
  "/en/trends"
  "/en/development"
  "/en/blog"
  "/en/privacy-policy"
  "/en/terms-of-service"
  "/en/monitoring"
  "/en/search"
  "/en/integrations"
  "/en/seo"
  "/en/community"
  "/en/blog"
  "/en/awesome-mcp-servers"
  "/en/what-is-mcp"
  "/en/themes"
  "/en/concepts"
)

# 定义要测试的项目路径
declare -a project_test_paths=(
  "/project/01-CoreConcepts/README.md"
  "/project/03-GettingStarted/07-aitk/README.md"
  "/project/examples/usecases/marimo_mcp_basic_agent/"
  "/project/03-GettingStarted/08-testing/README.md"
  "/project/examples/usecases/streamlit_mcp_rag_agent/"
  "/project/03-GettingStarted/samples/typescript/README.md"
  "/project/04-PracticalImplementation/samples/csharp/README.md"
  "/project/translations/no/README.md"
  "/project/translations/mo/README.md"
  "/project/src/mcp_agent/workflows/swarm/swarm.py"
  "/project/translations/id/README.md"
  "/project/translations/sr/README.md"
  "/project/03-GettingStarted/03-llm-client/README.md"
  "/project/03-GettingStarted/samples/java/calculator/README.md"
  "/project/examples/basic/mcp_agent_server"
  "/project/translations/ar/README.md"
  "/project/translations/sl/README.md"
  "/project/07-LessonsFromEarlyAdoption/README.md"
  "/project/translations/tl/README.md"
  "/project/translations/pl/README.md"
  "/project/05-AdvancedTopics/mcp-scaling/README.md"
  "/project/translations/he/README.md"
  "/project/05-AdvancedTopics/mcp-foundry-agent-integration/README.md"
  "/project/src/mcp_agent/workflows/router/router_llm.py"
  "/project/src/mcp_agent/workflows/intent_classifier/intent_classifier_llm.py"
  "/project/src/mcp_agent/workflows/intent_classifier/intent_classifier_embedding.py"
  "/project/05-AdvancedTopics/mcp-root-contexts/README.md"
  "/project/03-GettingStarted/samples/javascript/README.md"
  "/project/translations/el/README.md"
  "/project/04-PracticalImplementation/samples/javascript/README.md"
  "/project/05-AdvancedTopics/web-search-mcp/README.md"
  "/project/04-PracticalImplementation/samples/typescript/README.md"
  "/project/05-AdvancedTopics/mcp-security/README.md"
  "/project/translations/hk/README.md"
  "/project/translations/fr/README.md"
  "/project/05-AdvancedTopics/mcp-oauth2-demo/README.md"
  "/project/03-GettingStarted/README.md"
  "/project/03-GettingStarted/02-client/README.md"
  "/project/src/mcp_agent/workflows/evaluator_optimizer/evaluator_optimizer.py"
  "/project/translations/sw/README.md"
  "/project/translations/bn/README.md"
  "/project/05-AdvancedTopics/mcp-realtimesearch/README.md"
  "/project/translations/da/README.md"
  "/project/translations/pa/README.md"
  "/project/translations/ne/README.md"
  "/project/09-CaseStudy/README.md"
  "/project/03-GettingStarted/01-first-server/README.md"
  "/project/src/mcp_agent/workflows/orchestrator/orchestrator.py"
  "/project/03-GettingStarted/samples/python/mcp_calculator_server.py"
  "/project/translations/zh/README.md"
  "/project/translations/it/README.md"
  "/project/translations/ms/README.md"
  "/project/03-GettingStarted/04-vscode/README.md"
  "/project/05-AdvancedTopics/mcp-realtimestreaming/README.md"
  "/project/translations/nl/README.md"
  "/project/03-GettingStarted/06-http-streaming/README.md"
  "/project/translations/uk/README.md"
  "/project/owner/projectname"
  "/project/translations/es/README.md"
  "/project/translations/tw/README.md"
  "/project/translations/ru/README.md"
  "/project/examples/clients/simple-auth-client/"
  "/project/translations/pt/README.md"
  "/project/05-AdvancedTopics/mcp-routing/README.md"
  "/project/translations/sv/README.md"
  "/project/10-StreamliningAIWorkflowsBuildingAnMCPServerWithAIToolkit/README.md"
  "/project/examples/basic/mcp_basic_agent/"
  "/project/05-AdvancedTopics/mcp-multi-modality/README.md"
  "/project/study_guide.md"
  "/project/04-PracticalImplementation/samples/python/mcp_sample.py"
  "/project/examples/workflows/workflow_swarm/"
)

# 定义要测试的无效路径
declare -a invalid_test_paths=(
  "/math"
  "/mcp"
  "/development"
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
echo "📊 多语言路径测试结果统计:"
echo "=============================="
echo "总路径数: $total_count"
echo "成功数: $success_count"
echo "失败数: $((total_count - success_count))"
echo "成功率: $((success_count * 100 / total_count))%"
echo ""

echo "🔍 2. 测试项目路径重定向:"
echo "=============================="

project_success_count=0
project_total_count=${#project_test_paths[@]}

for path in "${project_test_paths[@]}"; do
  echo -n "测试 $path ... "
  
  # 发送请求并获取状态码
  response=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN$path")
  
  if [ "$response" = "200" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
    echo "✅ 成功 (HTTP $response)"
    ((project_success_count++))
  else
    echo "❌ 失败 (HTTP $response)"
  fi
  
  # 添加小延迟避免请求过快
  sleep 0.5
done

echo ""
echo "📊 项目路径测试结果统计:"
echo "=============================="
echo "总路径数: $project_total_count"
echo "成功数: $project_success_count"
echo "失败数: $((project_total_count - project_success_count))"
echo "成功率: $((project_success_count * 100 / project_total_count))%"
echo ""

echo "🔍 3. 测试无效路径重定向:"
echo "=============================="

invalid_success_count=0
invalid_total_count=${#invalid_test_paths[@]}

for path in "${invalid_test_paths[@]}"; do
  echo -n "测试 $path ... "
  
  # 发送请求并获取状态码
  response=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN$path")
  
  if [ "$response" = "200" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
    echo "✅ 成功 (HTTP $response)"
    ((invalid_success_count++))
  else
    echo "❌ 失败 (HTTP $response)"
  fi
  
  # 添加小延迟避免请求过快
  sleep 0.5
done

echo ""
echo "📊 无效路径测试结果统计:"
echo "=============================="
echo "总路径数: $invalid_total_count"
echo "成功数: $invalid_success_count"
echo "失败数: $((invalid_total_count - invalid_success_count))"
echo "成功率: $((invalid_success_count * 100 / invalid_total_count))%"
echo ""

echo "🔍 4. 测试具体重定向路径:"
echo "=============================="

# 测试几个具体的重定向
echo "测试 /es/troubleshooting 重定向到 /troubleshooting:"
curl -s -I "https://$DOMAIN/es/troubleshooting" | grep -E "(HTTP|Location|Location:)"
echo ""

echo "测试 /en/projects 重定向到 /projects:"
curl -s -I "https://$DOMAIN/en/projects" | grep -E "(HTTP|Location|Location:)"
echo ""

echo "测试 /project/01-CoreConcepts/README.md 重定向到 /projects:"
curl -s -I "https://$DOMAIN/project/01-CoreConcepts/README.md" | grep -E "(HTTP|Location|Location:)"
echo ""

echo "测试 /math 重定向到 /:"
curl -s -I "https://$DOMAIN/math" | grep -E "(HTTP|Location|Location:)"
echo ""

echo "🔍 5. 测试 404 页面:"
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

echo "🔍 6. 验证 robots.txt:"
echo "========================"

echo "检查 robots.txt 中的多语言路径规则:"
robots_content=$(curl -s "https://$DOMAIN/robots.txt")
echo "$robots_content" | grep -E "(Disallow|Allow)" | head -30
echo ""

echo "🔍 7. 验证 sitemap.xml:"
echo "========================"

echo "检查 sitemap.xml 是否包含多语言路径:"
sitemap_content=$(curl -s "https://$DOMAIN/sitemap.xml")
if echo "$sitemap_content" | grep -q "/es/\|/en/\|/fr/\|/de/"; then
  echo "❌ sitemap.xml 仍包含多语言路径"
else
  echo "✅ sitemap.xml 已清理多语言路径"
fi
echo ""

echo "🔍 8. 测试结果分析:"
echo "======================"
echo "✅ 预期结果:"
echo "1. 多语言路径应该返回 200/301/302 状态码"
echo "2. 项目路径应该重定向到 /projects"
echo "3. 无效路径应该重定向到正确页面"
echo "4. 重定向应该指向对应的英文页面"
echo "5. 无效路径应该返回 404"
echo "6. robots.txt 应该禁止爬取多语言和项目路径"
echo "7. sitemap.xml 不应该包含多语言路径"
echo ""

echo "🔍 9. 下一步操作:"
echo "======================"
total_success=$((success_count + project_success_count + invalid_success_count))
total_tests=$((total_count + project_total_count + invalid_total_count))

if [ $total_success -eq $total_tests ]; then
  echo "🎉 所有测试通过！多语言路径、项目路径和无效路径重定向正常工作。"
  echo "Google 爬虫现在应该能够正确处理这些路径。"
else
  echo "⚠️  部分测试失败，需要检查重定向配置。"
  echo "建议："
  echo "1. 检查 Next.js 路由配置"
  echo "2. 验证重定向逻辑"
  echo "3. 重新部署应用"
fi
echo ""

echo "🔍 10. 监控命令:"
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

echo "🎯 测试完成！多语言路径、项目路径和无效路径重定向系统已部署。"
