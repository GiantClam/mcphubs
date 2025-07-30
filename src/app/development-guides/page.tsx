'use client';

import { useState } from 'react';
import { FaServer, FaDesktop, FaCode, FaRocket, FaBook, FaCopy, FaCheckCircle, FaGithub, FaNodeJs, FaPython, FaJs } from 'react-icons/fa';

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            MCP Development Guides
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Learn how to build MCP servers and clients, develop powerful AI integration applications
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
              Server Development
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
              Client Development
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
                Quick Start
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaPython className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Python SDK</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Official Python SDK, easy to use</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaNodeJs className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Node.js SDK</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">TypeScript/JavaScript support</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCode className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Other Languages</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Go, Rust, Java, etc.</p>
                </div>
              </div>
            </section>

            {/* Python MCP 服务器开发 */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <FaPython className="w-6 h-6 mr-2 text-blue-600" />
                Python MCP Server Development
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Install Python SDK</h3>
                  <CodeBlock
                    id="python-install"
                    language="bash"
                    code={`pip install mcp`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. Create Basic Server</h3>
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

# Create MCP server instance
server = Server("my-mcp-server")

# Register resources
@server.list_resources()
async def handle_list_resources() -> list[Resource]:
    """Return list of available resources"""
    return [
        Resource(
            uri="config://app.json",
            name="App Configuration",
            description="Application configuration file",
            mimeType="application/json",
        )
    ]

# Read resources
@server.read_resource()
async def handle_read_resource(uri: str) -> str:
    """Read resource content"""
    if uri == "config://app.json":
        return json.dumps({
            "app_name": "MCP Server",
            "version": "1.0.0",
            "debug": True
        })
    else:
        raise ValueError(f&quot;Unknown resource: {uri}&quot;)

# Register tools
@server.list_tools()
async def handle_list_tools() -> list[Tool]:
    """Return list of available tools"""
    return [
        Tool(
            name="echo",
            description="Echo input text",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {"type": "string", "description": "Text to echo"}
                },
                "required": ["text"]
            },
        ),
        Tool(
            name="get_weather",
            description="Get weather information",
            inputSchema={
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "City name"}
                },
                "required": ["location"]
            },
        )
    ]

# Call tools
@server.call_tool()
async def handle_call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    if name == "echo":
        return [TextContent(type="text", text=arguments["text"])]
    elif name == "get_weather":
        location = arguments["location"]
        # Here should call real weather API
        weather_data = {
            "location": location,
            "temperature": "22°C",
            "description": "Sunny",
            "humidity": "65%"
        }
        return [TextContent(
            type="text", 
            text=f"Weather info - {location}: {weather_data['temperature']}, {weather_data['description']}"
        )]
    else:
        raise ValueError(f&quot;Unknown tool: {name}&quot;)

# Run server
async def main():
    # Use stdio transport
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3. Advanced Features Example</h3>
                  <CodeBlock
                    id="python-advanced"
                    language="python"
                    code={`# Add prompts (Prompts)
@server.list_prompts()
async def handle_list_prompts() -> list[Prompt]:
    return [
        Prompt(
            name="summarize",
            description="Summarize text content",
            arguments=[
                PromptArgument(
                    name="text",
                    description="Text to summarize",
                    required=True
                )
            ]
        )
    ]

@server.get_prompt()
async def handle_get_prompt(name: str, arguments: dict) -> GetPromptResult:
    if name == "summarize":
        text = arguments["text"]
        prompt = f"Please summarize the following text:\\n\\n{text}\\n\\nSummary:"
        return GetPromptResult(
            description="Text summarization prompt",
            messages=[
                PromptMessage(
                    role="user",
                    content=TextContent(type="text", text=prompt)
                )
            ]
        )

# Handle notifications
@server.notification()
async def handle_notification(notification):
    """Handle notifications from client"""
    print(f"Received notification: {notification}")

# Error handling
@server.error()
async def handle_error(error):
    """Handle errors"""
    print(f"Error occurred: {error}")
    return {"error": str(error)}`}
                  />
                </div>
              </div>
            </section>

            {/* TypeScript MCP 服务器开发 */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <FaJs className="w-6 h-6 mr-2 text-yellow-600" />
                TypeScript MCP Server Development
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Install Dependencies</h3>
                  <CodeBlock
                    id="ts-install"
                    language="bash"
                    code={`npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. Create TypeScript Server</h3>
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

// Create server instance
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

// Register tool list handler
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
              description: 'Mathematical expression (e.g., "2 + 3 * 4")',
            },
          },
          required: ['expression'],
        },
      },
      {
        name: 'get_time',
        description: 'Get current time',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ] as Tool[],
  };
});

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'calculate':
      try {
        const expression = args.expression as string;
        // Simple math calculation (production should use safe expression parser)
        const result = eval(expression);
        return {
          content: [
            {
              type: 'text',
              text: \`Calculation result: \${expression} = \${result}\`,
            } as TextContent,
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: \`Calculation error: \${error.message}\`,
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
            text: \`Current time: \${now.toLocaleString('en-US')}\`,
          } as TextContent,
        ],
      };

    default:
      throw new Error(\`Unknown tool: \${name}\`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('MCP server started');
}

main().catch((error) => {
  console.error('Server startup failed:', error);
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
                Deployment and Configuration
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Claude Desktop Configuration</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Configure your MCP server in Claude Desktop:
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Environment Variables Configuration</h3>
                  <CodeBlock
                    id="env-config"
                    language="bash"
                    code={`# .env file
DATABASE_URL=postgresql://user:password@localhost/dbname
API_KEY=your-api-key
LOG_LEVEL=info
DEBUG=true`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Docker Deployment</h3>
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
                MCP Client Development Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Main Features</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                      Connect to MCP servers
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                      Discover and call tools
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                      Access resources
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                      Use prompt templates
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Supported Transport Layers</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      Stdio (Standard Input/Output)
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
                Python Client Development
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Basic Client</h3>
                  <CodeBlock
                    id="python-client"
                    language="python"
                    code={`import asyncio
from mcp.client import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    # Configure server parameters
    server_params = StdioServerParameters(
        command="python",
        args=["path/to/your/server.py"],
        env={"API_KEY": "your-api-key"}
    )
    
    # Create client session
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize connection
            await session.initialize()
            
            # List available tools
            tools = await session.list_tools()
            print(f"Available tools: {[tool.name for tool in tools.tools]}")
            
            # Call tool
            result = await session.call_tool("echo", {"text": "Hello MCP!"})
            print(f"Tool result: {result.content}")
            
            # List resources
            resources = await session.list_resources()
            print(f"Available resources: {[res.name for res in resources.resources]}")
            
            # Read resource
            if resources.resources:
                resource_content = await session.read_resource(resources.resources[0].uri)
                print(f"Resource content: {resource_content.contents}")

if __name__ == "__main__":
    asyncio.run(main())`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. Advanced Client Features</h3>
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
            
            # Batch tool calls
            tasks = []
            for i in range(5):
                task = session.call_tool("calculate", {"expression": f"2 + {i}"})
                tasks.append(task)
            
            results = await asyncio.gather(*tasks)
            for i, result in enumerate(results):
                print(f"Calculation {i}: {result.content}")
            
            # Use prompt templates
            prompts = await session.list_prompts()
            if prompts.prompts:
                prompt_result = await session.get_prompt(
                    prompts.prompts[0].name,
                    {"text": "This is a long text that needs summarization..."}
                )
                print(f"Prompt result: {prompt_result.messages}")
            
            # Error handling
            try:
                await session.call_tool("nonexistent_tool", {})
            except Exception as e:
                print(f"Tool call failed: {e}")
            
            # Listen for notifications
            def notification_handler(notification):
                print(f"Received notification: {notification}")
            
            session.set_notification_handler(notification_handler)`}
                  />
                </div>
              </div>
            </section>

            {/* JavaScript 客户端开发 */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <FaJs className="w-6 h-6 mr-2 text-yellow-600" />
                JavaScript Client Development
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Basic Client</h3>
                  <CodeBlock
                    id="js-client"
                    language="javascript"
                    code={`import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  // Create transport layer
  const transport = new StdioClientTransport({
    command: 'python',
    args: ['path/to/your/server.py'],
    env: { API_KEY: 'your-api-key' }
  });

  // Create client
  const client = new Client(
    {
      name: 'my-mcp-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  // Connect to server
  await client.connect(transport);

  try {
    // List tools
    const toolsResponse = await client.request(
      { method: 'tools/list' },
      { tools: [] }
    );
    console.log('Available tools:', toolsResponse.tools);

    // Call tool
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
    console.log('Tool result:', result.content);

    // List resources
    const resourcesResponse = await client.request(
      { method: 'resources/list' },
      { resources: [] }
    );
    console.log('Available resources:', resourcesResponse.resources);

  } catch (error) {
    console.error('Client error:', error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. React Integration Example</h3>
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

      // Get tool list
      const toolsResponse = await newClient.request(
        { method: 'tools/list' },
        { tools: [] }
      );
      setTools(toolsResponse.tools);

    } catch (error) {
      console.error('Failed to initialize client:', error);
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
      setResult(\`Error: \${error.message}\`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">MCP Client Demo</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Available Tools</h2>
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
        <h2 className="text-xl font-semibold mb-2">Result</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {loading ? 'Loading...' : result || 'Click tool to see result'}
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
            Best Practices and Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Development Best Practices</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  Use type annotations and input validation
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  Implement proper error handling
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  Add detailed tool descriptions
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  Support asynchronous operations
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  Use environment variables for configuration management
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Useful Resources</h3>
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
                  Core Concepts
                </a>
                <a
                  href="/projects"
                  className="flex items-center text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <FaRocket className="w-4 h-4 mr-2" />
                  Project Examples
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 