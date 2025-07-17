'use client';

import { useState } from 'react';
import { FaServer, FaDesktop, FaCode, FaRocket, FaBook, FaDownload, FaCopy, FaCheckCircle, FaGithub, FaNodeJs, FaPython, FaJs } from 'react-icons/fa';

export default function DevelopmentGuidesPage() {
  const [activeTab, setActiveTab] = useState('server');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language = 'typescript', id }: { code: string; language?: string; id: string }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 my-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {copiedCode === id ? <FaCheckCircle className="w-4 h-4" /> : <FaCopy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="text-green-400 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            MCP 开发指南
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            学习如何构建 MCP 服务器和客户端，开发强大的 AI 集成应用
          </p>
        </section>

        {/* 标签导航 */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('server')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'server' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600'
              }`}
            >
              <FaServer className="w-4 h-4 inline mr-2" />
              服务器开发
            </button>
            <button
              onClick={() => setActiveTab('client')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'client' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600'
              }`}
            >
              <FaDesktop className="w-4 h-4 inline mr-2" />
              客户端开发
            </button>
          </div>
        </div>

        {/* 服务器开发指南 */}
        {activeTab === 'server' && (
          <div className="space-y-8">
            {/* 快速开始 */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <FaRocket className="w-6 h-6 mr-2 text-purple-600" />
                快速开始
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaPython className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Python SDK</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">官方 Python SDK，易于使用</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaNodeJs className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Node.js SDK</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">TypeScript/JavaScript 支持</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCode className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">其他语言</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Go, Rust, Java 等</p>
                </div>
              </div>
            </section>

            {/* Python MCP 服务器开发 */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <FaPython className="w-6 h-6 mr-2 text-blue-600" />
                Python MCP 服务器开发
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. 安装 Python SDK</h3>
                  <CodeBlock
                    id="python-install"
                    language="bash"
                    code={`pip install mcp`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. 创建基础服务器</h3>
                  <CodeBlock
                    id="python-basic-server"
                    language="python"
                    code={`import asyncio
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
from mcp.server.stdio import stdio_server
from mcp.types import (
    Resource,
    Tool,
    TextContent,
    ImageContent,
    EmbeddedResource,
    LoggingLevel
)

# 创建 MCP 服务器实例
server = Server("my-mcp-server")

# 注册资源
@server.list_resources()
async def handle_list_resources() -> list[Resource]:
    """返回可用资源列表"""
    return [
        Resource(
            uri="config://app.json",
            name="应用配置",
            description="应用程序配置文件",
            mimeType="application/json",
        )
    ]

# 读取资源
@server.read_resource()
async def handle_read_resource(uri: str) -> str:
    """读取资源内容"""
    if uri == "config://app.json":
        return json.dumps({
            "app_name": "MCP Server",
            "version": "1.0.0",
            "debug": True
        })
    else:
        raise ValueError(f"未知资源: {uri}")

# 注册工具
@server.list_tools()
async def handle_list_tools() -> list[Tool]:
    """返回可用工具列表"""
    return [
        Tool(
            name="echo",
            description="回显输入的文本",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {"type": "string", "description": "要回显的文本"}
                },
                "required": ["text"]
            },
        ),
        Tool(
            name="get_weather",
            description="获取天气信息",
            inputSchema={
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "城市名称"}
                },
                "required": ["location"]
            },
        )
    ]

# 调用工具
@server.call_tool()
async def handle_call_tool(name: str, arguments: dict) -> list[TextContent]:
    """处理工具调用"""
    if name == "echo":
        return [TextContent(type="text", text=arguments["text"])]
    elif name == "get_weather":
        location = arguments["location"]
        # 这里应该调用真实的天气API
        weather_data = {
            "location": location,
            "temperature": "22°C",
            "description": "晴天",
            "humidity": "65%"
        }
        return [TextContent(
            type="text", 
            text=f"天气信息 - {location}: {weather_data['temperature']}, {weather_data['description']}"
        )]
    else:
        raise ValueError(f"未知工具: {name}")

# 运行服务器
async def main():
    # 使用 stdio 传输
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="my-mcp-server",
                server_version="1.0.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )

if __name__ == "__main__":
    asyncio.run(main())`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3. 高级功能示例</h3>
                  <CodeBlock
                    id="python-advanced"
                    language="python"
                    code={`# 添加提示 (Prompts)
@server.list_prompts()
async def handle_list_prompts() -> list[Prompt]:
    return [
        Prompt(
            name="summarize",
            description="总结文本内容",
            arguments=[
                PromptArgument(
                    name="text",
                    description="要总结的文本",
                    required=True
                )
            ]
        )
    ]

@server.get_prompt()
async def handle_get_prompt(name: str, arguments: dict) -> GetPromptResult:
    if name == "summarize":
        text = arguments["text"]
        prompt = f"请总结以下文本：\\n\\n{text}\\n\\n总结："
        return GetPromptResult(
            description="文本总结提示",
            messages=[
                PromptMessage(
                    role="user",
                    content=TextContent(type="text", text=prompt)
                )
            ]
        )

# 处理通知
@server.notification()
async def handle_notification(notification):
    """处理来自客户端的通知"""
    print(f"收到通知: {notification}")

# 错误处理
@server.error()
async def handle_error(error):
    """处理错误"""
    print(f"发生错误: {error}")
    return {"error": str(error)}`}
                  />
                </div>
              </div>
            </section>

            {/* TypeScript MCP 服务器开发 */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <FaJs className="w-6 h-6 mr-2 text-yellow-600" />
                TypeScript MCP 服务器开发
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. 安装依赖</h3>
                  <CodeBlock
                    id="ts-install"
                    language="bash"
                    code={`npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. 创建 TypeScript 服务器</h3>
                  <CodeBlock
                    id="ts-server"
                    language="typescript"
                    code={`import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  TextContent,
} from '@modelcontextprotocol/sdk/types.js';

// 创建服务器实例
const server = new Server(
  {
    name: 'my-typescript-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// 注册工具列表处理器
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
              description: '数学表达式 (例如: "2 + 3 * 4")',
            },
          },
          required: ['expression'],
        },
      },
      {
        name: 'get_time',
        description: '获取当前时间',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ] as Tool[],
  };
});

// 注册工具调用处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'calculate':
      try {
        const expression = args.expression as string;
        // 简单的数学计算 (生产环境应使用安全的表达式解析器)
        const result = eval(expression);
        return {
          content: [
            {
              type: 'text',
              text: \`计算结果: \${expression} = \${result}\`,
            } as TextContent,
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: \`计算错误: \${error.message}\`,
            } as TextContent,
          ],
        };
      }

    case 'get_time':
      const now = new Date();
      return {
        content: [
          {
            type: 'text',
            text: \`当前时间: \${now.toLocaleString('zh-CN')}\`,
          } as TextContent,
        ],
      };

    default:
      throw new Error(\`未知工具: \${name}\`);
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('MCP 服务器已启动');
}

main().catch((error) => {
  console.error('服务器启动失败:', error);
  process.exit(1);
});`}
                  />
                </div>
              </div>
            </section>

            {/* 部署和配置 */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <FaRocket className="w-6 h-6 mr-2 text-green-600" />
                部署和配置
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Claude Desktop 配置</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    在 Claude Desktop 中配置您的 MCP 服务器：
                  </p>
                  <CodeBlock
                    id="claude-config"
                    language="json"
                    code={`{
  "mcpServers": {
    "my-mcp-server": {
      "command": "python",
      "args": ["path/to/your/server.py"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">环境变量配置</h3>
                  <CodeBlock
                    id="env-config"
                    language="bash"
                    code={`# .env 文件
DATABASE_URL=postgresql://user:password@localhost/dbname
API_KEY=your-api-key
LOG_LEVEL=info
DEBUG=true`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Docker 部署</h3>
                  <CodeBlock
                    id="dockerfile"
                    language="dockerfile"
                    code={`FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "server.py"]`}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 客户端开发指南 */}
        {activeTab === 'client' && (
          <div className="space-y-8">
            {/* 客户端概述 */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <FaDesktop className="w-6 h-6 mr-2 text-blue-600" />
                MCP 客户端开发概述
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">主要功能</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                      连接到 MCP 服务器
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                      发现和调用工具
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                      访问资源
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                      使用提示模板
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">支持的传输层</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      Stdio (标准输入/输出)
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      Server-Sent Events (SSE)
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      WebSocket
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      HTTP
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Python 客户端开发 */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <FaPython className="w-6 h-6 mr-2 text-blue-600" />
                Python 客户端开发
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. 基础客户端</h3>
                  <CodeBlock
                    id="python-client"
                    language="python"
                    code={`import asyncio
from mcp.client import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    # 配置服务器参数
    server_params = StdioServerParameters(
        command="python",
        args=["path/to/your/server.py"],
        env={"API_KEY": "your-api-key"}
    )
    
    # 创建客户端会话
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # 初始化连接
            await session.initialize()
            
            # 列出可用工具
            tools = await session.list_tools()
            print(f"可用工具: {[tool.name for tool in tools.tools]}")
            
            # 调用工具
            result = await session.call_tool("echo", {"text": "Hello MCP!"})
            print(f"工具结果: {result.content}")
            
            # 列出资源
            resources = await session.list_resources()
            print(f"可用资源: {[res.name for res in resources.resources]}")
            
            # 读取资源
            if resources.resources:
                resource_content = await session.read_resource(resources.resources[0].uri)
                print(f"资源内容: {resource_content.contents}")

if __name__ == "__main__":
    asyncio.run(main())`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. 高级客户端功能</h3>
                  <CodeBlock
                    id="python-advanced-client"
                    language="python"
                    code={`async def advanced_client_example():
    server_params = StdioServerParameters(
        command="python",
        args=["server.py"]
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # 批量调用工具
            tasks = []
            for i in range(5):
                task = session.call_tool("calculate", {"expression": f"2 + {i}"})
                tasks.append(task)
            
            results = await asyncio.gather(*tasks)
            for i, result in enumerate(results):
                print(f"计算 {i}: {result.content}")
            
            # 使用提示模板
            prompts = await session.list_prompts()
            if prompts.prompts:
                prompt_result = await session.get_prompt(
                    prompts.prompts[0].name,
                    {"text": "这是一个需要总结的长文本..."}
                )
                print(f"提示结果: {prompt_result.messages}")
            
            # 错误处理
            try:
                await session.call_tool("nonexistent_tool", {})
            except Exception as e:
                print(f"工具调用失败: {e}")
            
            # 监听通知
            def notification_handler(notification):
                print(f"收到通知: {notification}")
            
            session.set_notification_handler(notification_handler)`}
                  />
                </div>
              </div>
            </section>

            {/* JavaScript 客户端开发 */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <FaJs className="w-6 h-6 mr-2 text-yellow-600" />
                JavaScript 客户端开发
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. 基础客户端</h3>
                  <CodeBlock
                    id="js-client"
                    language="javascript"
                    code={`import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  // 创建传输层
  const transport = new StdioClientTransport({
    command: 'python',
    args: ['path/to/your/server.py'],
    env: { API_KEY: 'your-api-key' }
  });

  // 创建客户端
  const client = new Client(
    {
      name: 'my-mcp-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  // 连接到服务器
  await client.connect(transport);

  try {
    // 列出工具
    const toolsResponse = await client.request(
      { method: 'tools/list' },
      { tools: [] }
    );
    console.log('可用工具:', toolsResponse.tools);

    // 调用工具
    const result = await client.request(
      {
        method: 'tools/call',
        params: {
          name: 'get_time',
          arguments: {}
        }
      },
      { content: [] }
    );
    console.log('工具结果:', result.content);

    // 列出资源
    const resourcesResponse = await client.request(
      { method: 'resources/list' },
      { resources: [] }
    );
    console.log('可用资源:', resourcesResponse.resources);

  } catch (error) {
    console.error('客户端错误:', error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. React 集成示例</h3>
                  <CodeBlock
                    id="react-client"
                    language="tsx"
                    code={`import React, { useState, useEffect } from 'react';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

interface Tool {
  name: string;
  description: string;
  inputSchema: any;
}

const MCPClient: React.FC = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeClient();
    return () => {
      if (client) {
        client.close();
      }
    };
  }, []);

  const initializeClient = async () => {
    try {
      const transport = new StdioClientTransport({
        command: 'python',
        args: ['server.py']
      });

      const newClient = new Client(
        { name: 'react-mcp-client', version: '1.0.0' },
        { capabilities: {} }
      );

      await newClient.connect(transport);
      setClient(newClient);

      // 获取工具列表
      const toolsResponse = await newClient.request(
        { method: 'tools/list' },
        { tools: [] }
      );
      setTools(toolsResponse.tools);

    } catch (error) {
      console.error('初始化客户端失败:', error);
    }
  };

  const callTool = async (toolName: string, args: any) => {
    if (!client) return;

    setLoading(true);
    try {
      const response = await client.request(
        {
          method: 'tools/call',
          params: { name: toolName, arguments: args }
        },
        { content: [] }
      );
      
      setResult(JSON.stringify(response.content, null, 2));
    } catch (error) {
      setResult(\`错误: \${error.message}\`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">MCP 客户端演示</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">可用工具</h2>
        <div className="space-y-2">
          {tools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => callTool(tool.name, {})}
              className="block w-full text-left p-3 bg-blue-100 hover:bg-blue-200 rounded"
              disabled={loading}
            >
              <div className="font-medium">{tool.name}</div>
              <div className="text-sm text-gray-600">{tool.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">结果</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {loading ? '加载中...' : result || '点击工具查看结果'}
        </pre>
      </div>
    </div>
  );
};

export default MCPClient;`}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 最佳实践和资源 */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
            <FaBook className="w-6 h-6 mr-2 text-green-600" />
            最佳实践和资源
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">开发最佳实践</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  使用类型注解和输入验证
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  实现适当的错误处理
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  添加详细的工具描述
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  支持异步操作
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  使用环境变量管理配置
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">有用资源</h3>
              <div className="space-y-2">
                <a
                  href="https://github.com/modelcontextprotocol/python-sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <FaGithub className="w-4 h-4 mr-2" />
                  Python SDK
                </a>
                <a
                  href="https://github.com/modelcontextprotocol/typescript-sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <FaGithub className="w-4 h-4 mr-2" />
                  TypeScript SDK
                </a>
                <a
                  href="/concepts"
                  className="flex items-center text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <FaBook className="w-4 h-4 mr-2" />
                  核心概念
                </a>
                <a
                  href="/projects"
                  className="flex items-center text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <FaRocket className="w-4 h-4 mr-2" />
                  项目示例
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 