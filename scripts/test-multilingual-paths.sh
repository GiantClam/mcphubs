#!/bin/bash

# 测试多语言路径重定向功能
# 这个脚本测试所有应该被重定向的路径

echo "🧪 开始测试多语言路径重定向功能..."
echo "=================================================="

# 基础 URL
BASE_URL="https://www.mcphubs.com"

# 测试路径数组
declare -a test_paths=(
  # 基础多语言路径
  "/es/troubleshooting"
  "/en/projects"
  "/fr/trends"
  "/de/compare"
  "/ja/privacy-policy"
  "/ko/development"
  "/sv/terms-of-service"
  "/ar/monitoring"
  "/zh/search"
  "/ru/integrations"
  "/pt/seo"
  "/it/community"
  "/nl/blog"
  
  # 扩展语言变体
  "/en-ca/awesome-mcp-servers"
  "/en-au/what-is-mcp"
  "/en-gb/themes"
  "/zh-tw/concepts"
  "/zh-cn/troubleshooting"
  "/zh-hk/projects"
  
  # 更多多语言路径
  "/ja/monitoring"
  "/ko/search"
  "/ja"
  "/en-ca/blog"
  "/en/blog"
  "/de/terms-of-service"
  "/sv/themes"
  "/ja/search"
  "/sv/monitoring"
  "/en-ca/awesome-mcp-servers"
  "/en-au/development"
  "/de/awesome-mcp-servers"
  "/sv/concepts"
  "/en-ca/themes"
  "/fr/projects"
  "/en-au/what-is-mcp"
  "/sv/development"
  "/fr/what-is-mcp"
  "/en-ca/community"
  "/en-ca/troubleshooting"
  "/ja/development"
  "/ko/seo"
  "/es/development"
  "/fr/blog"
  "/en-au/monitoring"
  "/de/trends"
  "/de/compare"
  "/ko/trends"
  "/en-ca"
  "/de/community"
  "/en-au"
  "/ko/awesome-mcp-servers"
  "/es/awesome-mcp-servers"
  "/ja/compare"
  "/en/compare"
  "/sv/awesome-mcp-servers"
  "/es/seo"
  "/en-au/trends"
  "/ko/development"
  
  # 项目路径
  "/project/translations/tr/README.md"
  "/project/05-AdvancedTopics/mcp-integration/README.md"
  "/project/02-Security/README.md"
  "/project/translations/ja/README.md"
  "/project/translations/my/README.md"
  "/project/translations/hi/README.md"
  "/project/05-AdvancedTopics/mcp-security-entra/README.md"
  "/project/translations/ur/README.md"
  "/project/03-GettingStarted/09-deployment/README.md"
  "/project/translations/hu/README.md"
  "/project/translations/sk/README.md"
  "/project/06-CommunityContributions/README.md"
  "/project/translations/mr/README.md"
  "/project/examples"
  "/project/translations/br/README.md"
  "/project/translations/ko/README.md"
  "/project/translations/th/README.md"
  "/project/src/mcp_agent/workflows/router/router_embedding.py"
  "/project/05-AdvancedTopics/mcp-sampling/README.md"
  "/project/03-GettingStarted/samples/csharp/README.md"
  "/project/translations/fa/README.md"
  "/project/08-BestPractices/README.md"
  "/project/translations/de/README.md"
  "/project/translations/bg/README.md"
  "/project/examples/workflows/workflow_swarm/main.py"
  "/project/examples/workflows/workflow_evaluator_optimizer/main.py"
  "/project/src/mcp_agent/executor/temporal.py"
  "/project/examples/workflows/workflow_router/main.py"
  "/project/examples/workflows/workflow_orchestrator_worker/main.py"
  "/project/(src/mcp_agent/mcp/gen_client.py)"
  "/project/src/mcp_agent/mcp/gen_client.py"
  "/project/src/mcp_agent/mcp/mcp_aggregator.py"
  "/project/src/mcp_agent/workflows/router/"
  "/project/examples/workflows/workflow_parallel/main.py"
  "/project/src/mcp_agent/workflows/parallel/parallel_llm.py"
  "/project/src/mcp_agent/agents/agent.py"
  "/project/src/mcp_agent/workflows/intent_classifier/"
  "/project/examples/basic/mcp_basic_agent/mcp_agent.secrets.yaml.example"
  "/project/README_ja.md"
  "/project/eval-harness.sh"
  "/project/src/filesystem"
  "/project/README_zh.md"
  "/project/train.sh"
  "/project/ModelsCommunityLicenseAgreement"
  "/project/README_ko.md"
  "/project/eval.sh"
  "/project/examples/servers/simple-streamablehttp-stateless/"
  "/project/LICENSE"
  "/project/TOOLS.md"
  "/project/excel_files"
  "/project/896296825"
  "/project/CONTRIBUTING.md"
  "/project/examples/workflow_swarm/"
  "/project/word_example.sh"
  "/project/README_ja.md"
  
  # 特殊路径
  "/schema/mcp-agent.config.schema.json"
  "/examples/"
  "/servers/amap"
  "/servers/sibbl"
  "/servers/ethangillani"
  "/servers/kukapay"
  "/servers/baranwang"
  "/servers/cuongtl1992"
  "/servers/amitsh06"
  "/servers/unravel-team"
  "/$"
  
  # 无效路径
  "/math"
  "/mcp"
  "/development"
)

# 计数器
total_tests=0
successful_redirects=0
failed_redirects=0

echo "📊 总共需要测试 ${#test_paths[@]} 个路径"
echo ""

# 测试每个路径
for path in "${test_paths[@]}"; do
  total_tests=$((total_tests + 1))
  
  echo -n "🔍 测试路径 ${total_tests}/${#test_paths[@]}: ${path} ... "
  
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
echo "📊 测试结果汇总"
echo "=================================================="
echo "总测试数: ${total_tests}"
echo "✅ 成功重定向: ${successful_redirects}"
echo "❌ 重定向失败: ${failed_redirects}"
echo "📈 成功率: $(( (successful_redirects * 100) / total_tests ))%"

if [ $failed_redirects -eq 0 ]; then
  echo ""
  echo "🎉 所有路径重定向测试通过！"
  exit 0
else
  echo ""
  echo "⚠️  有 ${failed_redirects} 个路径重定向失败，需要检查"
  exit 1
fi
