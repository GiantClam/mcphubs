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
    { id: 'all', name: 'All', icon: '📋' },
    { id: 'installation', name: 'Installation', icon: '⚙️' },
    { id: 'development', name: 'Development', icon: '💻' },
    { id: 'deployment', name: 'Deployment', icon: '🚀' },
    { id: 'integration', name: 'Integration', icon: '🔗' },
    { id: 'performance', name: 'Performance', icon: '⚡' },
    { id: 'debugging', name: 'Debugging', icon: '🐛' }
  ];

  const sampleFAQs: FAQItem[] = [
    {
      id: 'faq1',
      question: 'How to resolve "Unable to connect to MCP server" error?',
      answer: `This error is usually caused by the following reasons:

**1. Check Server Status**
\`\`\`bash
# Check if server is running
ps aux | grep python | grep server.py

# Check if port is occupied
lsof -i :8000
\`\`\`

**2. Verify Configuration File**
Ensure the server path in Claude Desktop configuration file is correct:
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

**3. Check Python Environment**
\`\`\`bash
# Ensure using correct Python version
python --version
pip list | grep mcp
\`\`\`

**4. View Logs**
Check Claude Desktop log files:
- macOS: ~/Library/Logs/Claude/
- Windows: %APPDATA%/Claude/logs/`,
      category: 'installation',
      tags: ['Connection Error', 'Configuration', 'Server'],
      helpful: 45,
      views: 120
    },
    {
      id: 'faq2',
      question: 'What to do when MCP server crashes immediately after startup?',
      answer: `Server crashes are usually caused by the following issues:

**1. Check Error Logs**
\`\`\`bash
# Run server directly in terminal to see errors
python server.py
\`\`\`

**2. Common Errors and Solutions**

**Missing Dependencies:**
\`\`\`bash
pip install mcp typing-extensions
\`\`\`

**Port Conflict:**
\`\`\`python
# Modify port in server.py
if __name__ == "__main__":
    import mcp.server.stdio
    mcp.server.stdio.run_server(server, port=8001)  # Change port
\`\`\`

**Permission Issues:**
\`\`\`bash
# Ensure script has execution permission
chmod +x server.py
\`\`\`

**3. Debug Mode**
Enable detailed logging:
\`\`\`python
import logging
logging.basicConfig(level=logging.DEBUG)
\`\`\``,
      category: 'debugging',
      tags: ['Server Crash', 'Startup Error', 'Debugging'],
      helpful: 38,
      views: 95
    },
    {
      id: 'faq3',
      question: 'How to resolve Claude Desktop not recognizing MCP tools?',
      answer: `Common reasons and solutions for tools not being recognized:

**1. Check Tool Definition**
Ensure tool definition format is correct:
\`\`\`python
@server.list_tools()
async def handle_list_tools():
    return [
        {
            "name": "my_tool",
            "description": "Detailed description of the tool",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "param1": {
                        "type": "string",
                        "description": "Parameter description"
                    }
                },
                "required": ["param1"]
            }
        }
    ]
\`\`\`

**2. Verify Tool Response**
\`\`\`python
@server.call_tool()
async def handle_call_tool(name: str, arguments: dict):
    if name == "my_tool":
        return {
            "content": [
                {
                    "type": "text",
                    "text": "Tool execution result"
                }
            ]
        }
    raise ValueError(f"Unknown tool: {name}")
\`\`\`

**3. Restart Claude Desktop**
After modifying tool definitions, you need to restart Claude Desktop for changes to take effect.

**4. Check Tool Names**
Ensure tool names only contain letters, numbers, and underscores.`,
      category: 'integration',
      tags: ['Tool Recognition', 'Claude Desktop', 'Integration'],
      helpful: 52,
      views: 140
    },
    {
      id: 'faq4',
      question: 'How to optimize MCP server performance?',
      answer: `Key aspects of performance optimization:

**1. Asynchronous Processing**
\`\`\`python
import asyncio
from concurrent.futures import ThreadPoolExecutor

@server.call_tool()
async def handle_call_tool(name: str, arguments: dict):
    if name == "heavy_task":
        # Use thread pool for CPU-intensive tasks
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as executor:
            result = await loop.run_in_executor(executor, cpu_intensive_task, arguments)
        return {"content": [{"type": "text", "text": result}]}
\`\`\`

**2. Caching Mechanism**
\`\`\`python
from functools import lru_cache
import time

@lru_cache(maxsize=128)
def expensive_computation(param):
    # Cache computation results
    return compute_result(param)
\`\`\`

**3. Connection Pool**
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

**4. Memory Management**
- Release large objects promptly
- Use generators for large data processing
- Monitor memory usage`,
      category: 'performance',
      tags: ['Performance Optimization', 'Async Processing', 'Caching'],
      helpful: 29,
      views: 85
    },
    {
      id: 'faq5',
      question: 'How to develop MCP server in TypeScript?',
      answer: `TypeScript MCP Server Development Guide:

**1. Project Initialization**
\`\`\`bash
npm init -y
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node ts-node
\`\`\`

**2. TypeScript Configuration**
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

**3. Server Implementation**
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
        description: 'Perform mathematical calculations',
        inputSchema: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: 'Mathematical expression'
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
            text: \`Calculation result: \${result}\`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: \`Calculation error: \${error.message}\`
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

**4. Run Scripts**
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
      tags: ['TypeScript', 'Server Development', 'Configuration'],
      helpful: 34,
      views: 76
    }
  ];

  const troubleshootingSteps: TroubleshootingStep[] = [
    {
      step: 1,
      title: 'Check Environment Configuration',
      description: 'Ensure all necessary dependencies are properly installed',
      code: `# 检查Python版本
python --version

# 检查MCP SDK安装
pip show mcp

# 验证Node.js版本（如果使用TypeScript）
node --version
npm --version`,
      expected: 'Python 3.8+, MCP SDK installed, Node.js 18+',
      troubleshooting: [
        'If Python version is too low, upgrade to 3.8 or higher',
        'If MCP SDK is not installed: pip install mcp',
        'Ensure using correct Python environment (virtual environment)'
      ]
    },
    {
      step: 2,
      title: 'Verify Server Startup',
      description: 'Test if MCP server can start normally',
      code: `# 直接运行服务器
python server.py

# 或者使用调试模式
PYTHONPATH=. python -m server`,
      expected: 'Server starts successfully, no error messages',
      troubleshooting: [
        'Check if import statements are correct',
        'Ensure all dependencies are installed',
        'Check if port is occupied'
      ]
    },
    {
      step: 3,
      title: 'Configure Claude Desktop',
      description: 'Ensure Claude Desktop is properly configured with MCP server',
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
      expected: 'Configuration file format is correct, paths are valid',
      troubleshooting: [
        'Ensure using absolute paths',
        'Check if JSON format is correct',
        'Restart Claude Desktop application'
      ]
    },
    {
      step: 4,
      title: 'Test Tool Functionality',
      description: 'Verify MCP tools are working properly',
      code: `# 在Claude Desktop中测试
# 询问: "你有什么工具可以使用？"
# 或者: "帮我调用工具XYZ"`,
      expected: 'Claude can recognize and call MCP tools',
      troubleshooting: [
        'Check if tool definition format is correct',
        'Ensure tool names comply with specifications',
        'View Claude Desktop log files'
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Troubleshooting & FAQ</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Solve common problems in MCP development process, quickly find solutions
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
                  placeholder="Search problems, solutions or tags..."
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🔧 System Troubleshooting Steps</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Follow these steps to systematically troubleshoot and resolve MCP-related issues
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
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Execute Commands:</h4>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-x-auto text-sm">
                          <code>{step.code}</code>
                        </pre>
                      </div>
                    )}
                    
                    {step.expected && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Expected Results:</h4>
                        <p className="text-green-600 dark:text-green-400 text-sm">{step.expected}</p>
                      </div>
                    )}
                    
                    {step.troubleshooting && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Troubleshooting:</h4>
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">❓ Frequently Asked Questions</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredFAQs.length} questions
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
                        <span>Useful</span>
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No related questions found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting search keywords or selecting different categories
            </p>
          </div>
        )}

        {/* 联系支持 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📞 Need more help?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            If the above solutions cannot resolve your issue, please contact us through the following methods:
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Community Forum</span>
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