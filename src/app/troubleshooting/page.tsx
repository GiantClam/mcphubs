'use client';

import { useState, useEffect } from 'react';
import { FaQuestionCircle, FaBug, FaTools, FaLightbulb, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  views: number;
}

interface TroubleshootingStep {
  step: number;
  title: string;
  description: string;
  code?: string;
  expected?: string;
  troubleshooting?: string[];
}

const TroubleshootingPage = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', name: '全部', icon: '📋' },
    { id: 'installation', name: '安装配置', icon: '⚙️' },
    { id: 'development', name: '开发问题', icon: '💻' },
    { id: 'deployment', name: '部署运行', icon: '🚀' },
    { id: 'integration', name: '集成问题', icon: '🔗' },
    { id: 'performance', name: '性能优化', icon: '⚡' },
    { id: 'debugging', name: '调试技巧', icon: '🐛' }
  ];

  const sampleFAQs: FAQItem[] = [
    {
      id: 'faq1',
      question: '如何解决"无法连接到MCP服务器"的错误？',
      answer: `这个错误通常由以下原因引起：

**1. 检查服务器状态**
\`\`\`bash
# 检查服务器是否运行
ps aux | grep python | grep server.py

# 检查端口是否被占用
lsof -i :8000
\`\`\`

**2. 验证配置文件**
确保Claude Desktop的配置文件中服务器路径正确：
\`\`\`json
{
  "mcpServers": {
    "my-server": {
      "command": "python",
      "args": ["/path/to/your/server.py"]
    }
  }
}
\`\`\`

**3. 检查Python环境**
\`\`\`bash
# 确保使用正确的Python版本
python --version
pip list | grep mcp
\`\`\`

**4. 查看日志**
检查Claude Desktop的日志文件：
- macOS: ~/Library/Logs/Claude/
- Windows: %APPDATA%/Claude/logs/`,
      category: 'installation',
      tags: ['连接错误', '配置', '服务器'],
      helpful: 45,
      views: 120
    },
    {
      id: 'faq2',
      question: 'MCP服务器启动后立即崩溃怎么办？',
      answer: `服务器崩溃通常是由以下问题引起：

**1. 检查错误日志**
\`\`\`bash
# 在终端中直接运行服务器查看错误
python server.py
\`\`\`

**2. 常见错误和解决方案**

**依赖缺失：**
\`\`\`bash
pip install mcp typing-extensions
\`\`\`

**端口冲突：**
\`\`\`python
# 在server.py中修改端口
if __name__ == "__main__":
    import mcp.server.stdio
    mcp.server.stdio.run_server(server, port=8001)  # 更改端口
\`\`\`

**权限问题：**
\`\`\`bash
# 确保脚本有执行权限
chmod +x server.py
\`\`\`

**3. 调试模式**
启用详细日志记录：
\`\`\`python
import logging
logging.basicConfig(level=logging.DEBUG)
\`\`\``,
      category: 'debugging',
      tags: ['服务器崩溃', '启动错误', '调试'],
      helpful: 38,
      views: 95
    },
    {
      id: 'faq3',
      question: '如何解决Claude Desktop无法识别MCP工具的问题？',
      answer: `工具无法识别的常见原因和解决方案：

**1. 检查工具定义**
确保工具定义格式正确：
\`\`\`python
@server.list_tools()
async def handle_list_tools():
    return [
        {
            "name": "my_tool",
            "description": "工具的详细描述",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "param1": {
                        "type": "string",
                        "description": "参数描述"
                    }
                },
                "required": ["param1"]
            }
        }
    ]
\`\`\`

**2. 验证工具响应**
\`\`\`python
@server.call_tool()
async def handle_call_tool(name: str, arguments: dict):
    if name == "my_tool":
        return {
            "content": [
                {
                    "type": "text",
                    "text": "工具执行结果"
                }
            ]
        }
    raise ValueError(f"Unknown tool: {name}")
\`\`\`

**3. 重启Claude Desktop**
修改工具定义后，需要重启Claude Desktop才能生效。

**4. 检查工具名称**
确保工具名称中只包含字母、数字和下划线。`,
      category: 'integration',
      tags: ['工具识别', 'Claude Desktop', '集成'],
      helpful: 52,
      views: 140
    },
    {
      id: 'faq4',
      question: '如何优化MCP服务器的性能？',
      answer: `性能优化的几个关键方面：

**1. 异步处理**
\`\`\`python
import asyncio
from concurrent.futures import ThreadPoolExecutor

@server.call_tool()
async def handle_call_tool(name: str, arguments: dict):
    if name == "heavy_task":
        # 使用线程池处理CPU密集型任务
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as executor:
            result = await loop.run_in_executor(executor, cpu_intensive_task, arguments)
        return {"content": [{"type": "text", "text": result}]}
\`\`\`

**2. 缓存机制**
\`\`\`python
from functools import lru_cache
import time

@lru_cache(maxsize=128)
def expensive_computation(param):
    # 缓存计算结果
    return compute_result(param)
\`\`\`

**3. 连接池**
\`\`\`python
import aiohttp
import asyncio

class HTTPClient:
    def __init__(self):
        self.session = None
    
    async def get_session(self):
        if self.session is None:
            connector = aiohttp.TCPConnector(limit=100)
            self.session = aiohttp.ClientSession(connector=connector)
        return self.session
\`\`\`

**4. 内存管理**
- 及时释放大对象
- 使用生成器处理大量数据
- 监控内存使用情况`,
      category: 'performance',
      tags: ['性能优化', '异步处理', '缓存'],
      helpful: 29,
      views: 85
    },
    {
      id: 'faq5',
      question: '如何在TypeScript中开发MCP服务器？',
      answer: `TypeScript MCP服务器开发指南：

**1. 项目初始化**
\`\`\`bash
npm init -y
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node ts-node
\`\`\`

**2. TypeScript配置**
\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
\`\`\`

**3. 服务器实现**
\`\`\`typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({
  name: 'my-typescript-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
  },
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'calculate',
        description: '执行数学计算',
        inputSchema: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: '数学表达式'
            }
          },
          required: ['expression']
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'calculate') {
    try {
      const result = eval(args.expression);
      return {
        content: [
          {
            type: 'text',
            text: \`计算结果: \${result}\`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: \`计算错误: \${error.message}\`
          }
        ],
        isError: true
      };
    }
  }
  
  throw new Error(\`Unknown tool: \${name}\`);
});

const transport = new StdioServerTransport();
server.connect(transport);
\`\`\`

**4. 运行脚本**
\`\`\`json
// package.json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "ts-node src/server.ts"
  }
}
\`\`\``,
      category: 'development',
      tags: ['TypeScript', '服务器开发', '配置'],
      helpful: 34,
      views: 76
    }
  ];

  const troubleshootingSteps: TroubleshootingStep[] = [
    {
      step: 1,
      title: '检查环境配置',
      description: '确保所有必要的依赖项都已正确安装',
      code: `# 检查Python版本
python --version

# 检查MCP SDK安装
pip show mcp

# 验证Node.js版本（如果使用TypeScript）
node --version
npm --version`,
      expected: 'Python 3.8+, MCP SDK已安装, Node.js 18+',
      troubleshooting: [
        '如果Python版本过低，请升级到3.8或更高版本',
        '如果MCP SDK未安装：pip install mcp',
        '确保使用正确的Python环境（虚拟环境）'
      ]
    },
    {
      step: 2,
      title: '验证服务器启动',
      description: '测试MCP服务器是否能正常启动',
      code: `# 直接运行服务器
python server.py

# 或者使用调试模式
PYTHONPATH=. python -m server`,
      expected: '服务器启动成功，无错误消息',
      troubleshooting: [
        '检查import语句是否正确',
        '确保所有依赖项都已安装',
        '检查端口是否被占用'
      ]
    },
    {
      step: 3,
      title: '配置Claude Desktop',
      description: '确保Claude Desktop正确配置了MCP服务器',
      code: `# Claude Desktop配置文件位置
# macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
# Windows: %APPDATA%/Claude/claude_desktop_config.json

{
  "mcpServers": {
    "my-server": {
      "command": "python",
      "args": ["/absolute/path/to/server.py"]
    }
  }
}`,
      expected: '配置文件格式正确，路径有效',
      troubleshooting: [
        '确保使用绝对路径',
        '检查JSON格式是否正确',
        '重启Claude Desktop应用程序'
      ]
    },
    {
      step: 4,
      title: '测试工具功能',
      description: '验证MCP工具是否正常工作',
      code: `# 在Claude Desktop中测试
# 询问: "你有什么工具可以使用？"
# 或者: "帮我调用工具XYZ"`,
      expected: 'Claude能识别并调用MCP工具',
      troubleshooting: [
        '检查工具定义格式是否正确',
        '确保工具名称符合规范',
        '查看Claude Desktop日志文件'
      ]
    }
  ];

  useEffect(() => {
    setFaqs(sampleFAQs);
  }, []);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const markHelpful = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, helpful: faq.helpful + 1 } : faq
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">故障排除 & FAQ</h1>
          <p className="text-gray-600 dark:text-gray-300">
            解决MCP开发过程中的常见问题，快速找到解决方案
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="搜索问题、解决方案或标签..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 系统故障排除步骤 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🔧 系统故障排除步骤</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            按照以下步骤系统性地排查和解决MCP相关问题
          </p>
          <div className="space-y-6">
            {troubleshootingSteps.map((step, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{step.description}</p>
                    
                    {step.code && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">执行命令：</h4>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-x-auto text-sm">
                          <code>{step.code}</code>
                        </pre>
                      </div>
                    )}
                    
                    {step.expected && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">期望结果：</h4>
                        <p className="text-green-600 dark:text-green-400 text-sm">{step.expected}</p>
                      </div>
                    )}
                    
                    {step.troubleshooting && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">故障排除：</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          {step.troubleshooting.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-red-500 mr-2">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ列表 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">❓ 常见问题解答</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              显示 {filteredFAQs.length} 个问题
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredFAQs.map(faq => (
              <div key={faq.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => toggleExpanded(faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                      {faq.question}
                    </h3>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedItems.has(faq.id) ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {categories.find(c => c.id === faq.category)?.name}
                    </span>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                      <span>👍 {faq.helpful}</span>
                      <span>👁️ {faq.views}</span>
                    </div>
                  </div>
                </div>
                
                {expandedItems.has(faq.id) && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                    <div className="prose dark:prose-invert max-w-none mb-4">
                      <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {faq.answer}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {faq.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => markHelpful(faq.id)}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span>有用</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 空状态 */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">没有找到相关问题</h3>
            <p className="text-gray-500 dark:text-gray-400">
              尝试调整搜索关键词或选择不同的分类
            </p>
          </div>
        )}

        {/* 联系支持 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📞 需要更多帮助？</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            如果以上解决方案无法解决您的问题，请通过以下方式联系我们：
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>社区论坛</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub Issues</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingPage; 