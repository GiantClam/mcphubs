import React from 'react';
import { FaBook, FaRocket, FaCode, FaLightbulb, FaTerminal, FaCog, FaCheck, FaUser } from 'react-icons/fa';
import { ProcessedRepo } from '@/lib/github';

interface TutorialGuideProps {
  project: ProcessedRepo;
}

interface TutorialStep {
  title: string;
  description: string;
  code?: string;
  tips?: string[];
}

interface TutorialSection {
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: TutorialStep[];
}

// 基于项目特征生成教程内容
function generateTutorialContent(project: ProcessedRepo): TutorialSection[] {
  const tutorials: TutorialSection[] = [];

  // 快速入门教程
  const quickStartSteps: TutorialStep[] = [
    {
      title: "环境准备",
      description: `设置${project.language}开发环境和必要的依赖项`,
      code: project.language === 'Python' 
        ? `# 创建虚拟环境\npython -m venv mcp_env\nsource mcp_env/bin/activate  # Linux/Mac\nmcp_env\\Scripts\\activate     # Windows\n\n# 安装项目依赖\npip install -r requirements.txt`
        : project.language === 'JavaScript' || project.language === 'TypeScript'
        ? `# 安装依赖\nnpm install\n# 或使用yarn\nyarn install`
        : `# 克隆项目\ngit clone ${project.url}\ncd ${project.name}`,
      tips: [
        "确保使用正确的环境隔离",
        "检查系统兼容性要求",
        "建议使用稳定版本的运行时环境"
      ]
    },
    {
      title: "项目配置",
      description: "配置项目的基本参数和MCP相关设置",
      code: project.language === 'Python' 
        ? `# 配置文件示例 (config.py)\nMCP_SERVER_URL = "your_mcp_server_url"\nAPI_KEY = "your_api_key"\nDEBUG = True\n\n# 验证配置\npython -c "import config; print('配置加载成功')"`
        : `// 配置文件示例 (config.js)\nmodule.exports = {\n  mcpServerUrl: 'your_mcp_server_url',\n  apiKey: 'your_api_key',\n  debug: true\n};`,
      tips: [
        "妥善保管API密钥和敏感信息",
        "使用环境变量管理配置",
        "测试配置是否正确加载"
      ]
    },
    {
      title: "运行项目",
      description: "启动项目并验证MCP功能",
      code: project.language === 'Python' 
        ? `# 启动项目\npython main.py\n\n# 或使用开发模式\npython -m ${project.name} --dev`
        : `# 启动项目\nnpm start\n\n# 或开发模式\nnpm run dev`,
      tips: [
        "首次运行可能需要较长时间",
        "检查日志输出是否有错误",
        "验证MCP连接是否正常"
      ]
    }
  ];

  tutorials.push({
    title: "Quick Start",
    icon: <FaRocket className="w-5 h-5" />,
    description: "Get started with this MCP project from scratch",
    steps: quickStartSteps
  });

  // 部署指南
  const deploymentSteps: TutorialStep[] = [
    {
      title: "生产环境准备",
      description: "配置生产环境的基础设施和依赖",
      code: project.language === 'Python' 
        ? `# 生产环境依赖\npip install gunicorn\n\n# 环境变量设置\nexport FLASK_ENV=production\nexport MCP_SERVER_URL=your_production_url`
        : `# 构建生产版本\nnpm run build\n\n# 设置环境变量\nexport NODE_ENV=production\nexport MCP_SERVER_URL=your_production_url`,
      tips: [
        "使用专用的生产服务器",
        "配置SSL证书和安全设置",
        "设置监控和日志记录"
      ]
    },
    {
      title: "Containerized Deployment",
      description: "Deploy using Docker containers",
      code: `# Dockerfile示例\nFROM ${project.language === 'Python' ? 'python:3.9-slim' : 'node:16-alpine'}\n\nWORKDIR /app\nCOPY . .\n\n${project.language === 'Python' 
        ? 'RUN pip install -r requirements.txt\nCMD ["python", "main.py"]'
        : 'RUN npm install\nCMD ["npm", "start"]'}\n\n# 构建和运行\ndocker build -t mcp-${project.name.toLowerCase()} .\ndocker run -p 3000:3000 mcp-${project.name.toLowerCase()}`,
      tips: [
        "优化Docker镜像大小",
        "使用多阶段构建",
        "配置健康检查"
      ]
    },
    {
      title: "Cloud Platform Deployment",
      description: "Deploy to mainstream cloud platforms",
      code: `# Vercel部署 (适合JavaScript/TypeScript项目)\nvercel --prod\n\n# 或使用Heroku\nheroku create mcp-${project.name.toLowerCase()}\ngit push heroku main\n\n# AWS Lambda部署\naws lambda create-function --function-name mcp-${project.name.toLowerCase()}`,
      tips: [
        "选择合适的云平台方案",
        "配置自动扩展策略",
        "设置监控和告警"
      ]
    }
  ];

  tutorials.push({
    title: "Deployment Guide",
    icon: <FaCog className="w-5 h-5" />,
    description: "Complete guide to deploy the project to production environment",
    steps: deploymentSteps
  });

  // 最佳实践
  const bestPracticesSteps: TutorialStep[] = [
    {
      title: "性能优化",
      description: "优化项目性能和响应速度",
      code: project.language === 'Python' 
        ? `# 使用缓存优化\nfrom functools import lru_cache\n\n@lru_cache(maxsize=128)\ndef get_mcp_data(query):\n    # 缓存MCP查询结果\n    return fetch_from_mcp(query)\n\n# 异步处理\nimport asyncio\n\nasync def process_mcp_requests():\n    # 并发处理多个MCP请求\n    tasks = [process_request(req) for req in requests]\n    await asyncio.gather(*tasks)`
        : `// 使用缓存优化\nconst mcpCache = new Map();\n\nfunction getMCPData(query) {\n  if (mcpCache.has(query)) {\n    return mcpCache.get(query);\n  }\n  const result = fetchFromMCP(query);\n  mcpCache.set(query, result);\n  return result;\n}\n\n// 批量处理\nconst batchProcessor = new BatchProcessor({\n  maxBatchSize: 10,\n  flushInterval: 100\n});`,
      tips: [
        "合理使用缓存机制",
        "实现请求批处理",
        "监控内存使用情况"
      ]
    },
    {
      title: "错误处理",
      description: "实现健壮的错误处理机制",
      code: project.language === 'Python' 
        ? `# 异常处理示例\nimport logging\nfrom functools import wraps\n\ndef mcp_error_handler(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        try:\n            return func(*args, **kwargs)\n        except MCPConnectionError as e:\n            logging.error(f"MCP连接错误: {e}")\n            return {"error": "MCP服务暂时不可用"}\n        except Exception as e:\n            logging.error(f"未知错误: {e}")\n            return {"error": "处理请求时发生错误"}\n    return wrapper\n\n@mcp_error_handler\ndef process_mcp_request(data):\n    # 处理MCP请求\n    pass`
        : `// 错误处理示例\nclass MCPErrorHandler {\n  static handle(error) {\n    if (error instanceof MCPConnectionError) {\n      console.error('MCP连接错误:', error.message);\n      return { error: 'MCP服务暂时不可用' };\n    }\n    \n    console.error('未知错误:', error);\n    return { error: '处理请求时发生错误' };\n  }\n}\n\n// 使用中间件\napp.use((error, req, res, next) => {\n  const result = MCPErrorHandler.handle(error);\n  res.status(500).json(result);\n});`,
      tips: [
        "分类处理不同类型的错误",
        "记录详细的错误日志",
        "为用户提供友好的错误信息"
      ]
    },
    {
      title: "安全最佳实践",
      description: "确保项目的安全性",
      code: `# 安全配置示例\n# 1. 环境变量管理\nMCP_API_KEY=your_secure_api_key\nALLOWED_HOSTS=your_domain.com\n\n# 2. 输入验证\n${project.language === 'Python' 
        ? `from marshmallow import Schema, fields, validate\n\nclass MCPRequestSchema(Schema):\n    query = fields.Str(required=True, validate=validate.Length(min=1, max=1000))\n    user_id = fields.Str(required=True, validate=validate.UUID())`
        : `const joi = require('joi');\n\nconst mcpRequestSchema = joi.object({\n  query: joi.string().min(1).max(1000).required(),\n  userId: joi.string().uuid().required()\n});`}`,
      tips: [
        "始终验证输入数据",
        "使用HTTPS加密传输",
        "定期更新依赖项",
        "实施访问控制和速率限制"
      ]
    }
  ];

  tutorials.push({
    title: "最佳实践",
    icon: <FaLightbulb className="w-5 h-5" />,
    description: "遵循行业最佳实践，构建高质量的MCP应用",
    steps: bestPracticesSteps
  });

  // 集成示例
  const integrationSteps: TutorialStep[] = [
    {
      title: "与LangChain集成",
      description: "将项目与LangChain框架集成",
      code: project.language === 'Python' 
        ? `# LangChain集成示例\nfrom langchain.llms import OpenAI\nfrom langchain.chains import ConversationChain\nfrom langchain.memory import ConversationBufferMemory\n\n# 设置MCP作为上下文提供者\nclass MCPContextProvider:\n    def __init__(self, mcp_client):\n        self.mcp_client = mcp_client\n    \n    def get_context(self, query):\n        return self.mcp_client.fetch_context(query)\n\n# 创建对话链\nllm = OpenAI(temperature=0.7)\nmemory = ConversationBufferMemory()\nconversation = ConversationChain(\n    llm=llm,\n    memory=memory,\n    verbose=True\n)`
        : `// LangChain集成示例\nconst { OpenAI } = require('langchain/llms/openai');\nconst { ConversationChain } = require('langchain/chains');\nconst { BufferMemory } = require('langchain/memory');\n\nclass MCPContextProvider {\n  constructor(mcpClient) {\n    this.mcpClient = mcpClient;\n  }\n  \n  async getContext(query) {\n    return await this.mcpClient.fetchContext(query);\n  }\n}\n\n// 创建对话链\nconst llm = new OpenAI({ temperature: 0.7 });\nconst memory = new BufferMemory();\nconst conversation = new ConversationChain({ llm, memory });`,
      tips: [
        "合理设置LLM参数",
        "优化上下文窗口大小",
        "实现智能的上下文筛选"
      ]
    },
    {
      title: "API集成",
      description: "与其他API服务集成",
      code: `# RESTful API集成示例\n${project.language === 'Python' 
        ? `import requests\nfrom typing import Dict, Any\n\nclass MCPAPIClient:\n    def __init__(self, base_url: str, api_key: str):\n        self.base_url = base_url\n        self.headers = {\n            'Authorization': f'Bearer {api_key}',\n            'Content-Type': 'application/json'\n        }\n    \n    def send_context(self, context: Dict[str, Any]):\n        response = requests.post(\n            f'{self.base_url}/context',\n            json=context,\n            headers=self.headers\n        )\n        return response.json()`
        : `class MCPAPIClient {\n  constructor(baseUrl, apiKey) {\n    this.baseUrl = baseUrl;\n    this.headers = {\n      'Authorization': \`Bearer \${apiKey}\`,\n      'Content-Type': 'application/json'\n    };\n  }\n  \n  async sendContext(context) {\n    const response = await fetch(\`\${this.baseUrl}/context\`, {\n      method: 'POST',\n      headers: this.headers,\n      body: JSON.stringify(context)\n    });\n    return await response.json();\n  }\n}`}`,
      tips: [
        "实现API调用的重试机制",
        "处理API限流和超时",
        "缓存API响应结果"
      ]
    }
  ];

  tutorials.push({
    title: "集成示例",
    icon: <FaCode className="w-5 h-5" />,
    description: "与主流AI框架和服务的集成示例",
    steps: integrationSteps
  });

  return tutorials;
}

const TutorialGuide: React.FC<TutorialGuideProps> = ({ project }) => {
  const tutorials = generateTutorialContent(project);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center mb-6">
        <FaBook className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Practical Tutorial Guide
        </h2>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400">
          Here you'll find detailed tutorials and best practices for the {project.name} project, helping you get started quickly and successfully deploy to production.
        </p>
      </div>

      <div className="space-y-8">
        {tutorials.map((tutorial, tutorialIndex) => (
          <div key={tutorialIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <div className="text-blue-600 dark:text-blue-400 mr-3">
                  {tutorial.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {tutorial.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {tutorial.description}
              </p>
            </div>
            
            <div className="p-4">
              <div className="space-y-6">
                {tutorial.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="border-l-4 border-blue-400 pl-4">
                    <div className="flex items-start mb-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        {stepIndex + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    {step.code && (
                      <div className="mb-4">
                        <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
                          <div className="px-4 py-2 bg-gray-800 text-gray-400 text-xs font-mono flex items-center">
                            <FaTerminal className="mr-2" />
                            代码示例
                          </div>
                          <pre className="p-4 overflow-x-auto">
                            <code className="text-sm">
                              {step.code}
                            </code>
                          </pre>
                        </div>
                      </div>
                    )}
                    
                    {step.tips && step.tips.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                                                 <div className="flex items-center mb-2">
                           <FaLightbulb className="text-yellow-600 dark:text-yellow-400 mr-2" />
                           <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                             实用提示
                           </span>
                         </div>
                        <ul className="space-y-1">
                          {step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start text-sm text-yellow-700 dark:text-yellow-300">
                              <FaCheck className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
          需要帮助？
        </h4>
        <p className="text-purple-700 dark:text-purple-400 text-sm mb-3">
          如果在使用过程中遇到问题，建议查看以下资源：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-purple-600 dark:text-purple-400 hover:underline"
          >
            <FaBook className="mr-2" />
            项目文档
          </a>
          <a 
            href={`${project.url}/issues`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-purple-600 dark:text-purple-400 hover:underline"
          >
            <FaTerminal className="mr-2" />
            问题反馈
          </a>
                     <a 
             href={`${project.url}/discussions`} 
             target="_blank" 
             rel="noopener noreferrer"
             className="flex items-center text-purple-600 dark:text-purple-400 hover:underline"
           >
             <FaUser className="mr-2" />
             社区讨论
           </a>
        </div>
      </div>
    </div>
  );
};

export default TutorialGuide; 