'use client';

import { useState } from 'react';
import { FaCode, FaRocket, FaUsers, FaCogs, FaBook, FaLightbulb, FaNetworkWired, FaPlug, FaCheckCircle, FaCopy, FaDesktop, FaServer, FaDatabase, FaArrowRight, FaArrowLeft, FaExclamationTriangle, FaGithub, FaBug } from 'react-icons/fa';
import Link from 'next/link';

export default function ConceptsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: FaBook },
    { id: 'architecture', label: 'Architecture', icon: FaNetworkWired },
    { id: 'protocol', label: 'Protocol', icon: FaCode },
    { id: 'servers', label: 'MCP Servers', icon: FaCogs },
    { id: 'clients', label: 'MCP Clients', icon: FaPlug },
    { id: 'integration', label: 'Integration Guide', icon: FaRocket },
    { id: 'examples', label: 'Examples', icon: FaLightbulb },
    { id: 'community', label: 'Community Resources', icon: FaUsers },
  ];

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
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar navigation */}
            <aside className="lg:w-64 bg-white dark:bg-gray-800 rounded-lg p-6 h-fit lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Learning Directory</h2>
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left ${
                      activeSection === item.id
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main content area */}
            <div className="flex-grow">
              {activeSection === 'overview' && (
                <section className="bg-white dark:bg-gray-800 rounded-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">MCP Overview</h1>
                  
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">What is Model Context Protocol?</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Model Context Protocol (MCP) is an open protocol developed by Anthropic that enables AI assistants to securely access external data sources and tools.
                        Through standardized interfaces, MCP allows AI applications to interact with various resources such as file systems, databases, API services, etc.,
                        greatly expanding the capabilities of AI.
                      </p>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Core Advantages</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-100 dark:bg-green-900 w-8 h-8 rounded-full flex items-center justify-center mt-1">
                              <FaCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">Standardized Interface</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Unified protocol specification, simplifying integration development</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 dark:bg-blue-900 w-8 h-8 rounded-full flex items-center justify-center mt-1">
                              <FaCheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">Secure and Reliable</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Built-in security mechanisms and access control</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-100 dark:bg-purple-900 w-8 h-8 rounded-full flex items-center justify-center mt-1">
                              <FaCheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">Easy to Extend</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Support for custom tools and resources</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="bg-yellow-100 dark:bg-yellow-900 w-8 h-8 rounded-full flex items-center justify-center mt-1">
                              <FaCheckCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">Open Ecosystem</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Open source protocol, community-driven development</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Application Scenarios</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                          <FaCode className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Code Assistant</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Connect to IDEs, version control systems, providing intelligent code analysis and automated development tools
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                          <FaDatabase className="w-8 h-8 text-green-600 dark:text-green-400 mb-4" />
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Analysis</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Access databases, APIs, perform complex data queries and analysis tasks
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                          <FaCogs className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-4" />
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Workflow Automation</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Integrate various tools and services to build intelligent workflows
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Quick Start</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Getting started with MCP only requires a few simple steps:
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-blue-100 dark:bg-blue-900 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Understand Architecture</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Learn MCP's three-layer architecture design and core concepts</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="bg-green-100 dark:bg-green-900 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-green-600 dark:text-green-400 font-semibold text-sm">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Choose Tools</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Select appropriate MCP servers or develop your own implementation based on needs</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="bg-purple-100 dark:bg-purple-900 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Integrate Applications</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Connect MCP servers to AI clients and start experiencing enhanced capabilities</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'protocol' && (
                <section className="bg-white dark:bg-gray-800 rounded-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">MCP Protocol Details</h1>
                  
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Protocol Architecture</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        MCP is based on the JSON-RPC 2.0 protocol, providing bidirectional communication capabilities. The protocol defines standard interaction methods between clients and servers.
                      </p>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Core Components</h3>
                        <div className="space-y-4">
                          <div className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-medium text-gray-900 dark:text-white">Transport Layer</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Supports multiple transport methods: stdio, HTTP, WebSocket, etc.
                            </p>
                          </div>
                          <div className="border-l-4 border-green-500 pl-4">
                            <h4 className="font-medium text-gray-900 dark:text-white">Message Protocol</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              JSON-RPC 2.0 based message format and processing mechanism
                            </p>
                          </div>
                          <div className="border-l-4 border-purple-500 pl-4">
                            <h4 className="font-medium text-gray-900 dark:text-white">Capability Discovery</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Dynamic discovery and negotiation of server-provided capabilities
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Message Types</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <FaArrowRight className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Request Messages
                          </h3>
                          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li>• initialize - Initialize connection</li>
                            <li>• tools/list - Get tool list</li>
                            <li>• tools/call - Call tool</li>
                            <li>• resources/list - Get resource list</li>
                            <li>• resources/read - Read resource</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <FaArrowLeft className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                            Response Messages
                          </h3>
                          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li>• result - Success response</li>
                            <li>• error - Error response</li>
                            <li>• notification - Notification message</li>
                            <li>• progress - Progress update</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Protocol Examples</h2>
                      
                      <CodeBlock 
                        id="protocol-example"
                        language="json"
                        code={`// Initialize request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "experimental": {},
      "sampling": {}
    },
    "clientInfo": {
      "name": "my-client",
      "version": "1.0.0"
    }
  }
}

// Tool call request
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "read-file",
    "arguments": {
      "path": "/path/to/file.txt"
    }
  }
}

// Success response
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "File content..."
      }
    ]
  }
}`}
                      />
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'servers' && (
                <section className="bg-white dark:bg-gray-800 rounded-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">MCP Server Development</h1>
                  
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Server Basics</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        MCP servers are backend components that provide tools and resources, responding to client requests and executing specific operations.
                      </p>
                      
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Server Responsibilities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <FaServer className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <span className="font-medium text-gray-900 dark:text-white">Tool Registration</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <FaDatabase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium text-gray-900 dark:text-white">Resource Management</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <FaCogs className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              <span className="font-medium text-gray-900 dark:text-white">Request Processing</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <FaNetworkWired className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                              <span className="font-medium text-gray-900 dark:text-white">Communication Management</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Development Process</h2>
                      <div className="space-y-6">
                        <div className="border-l-4 border-blue-500 pl-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Environment Setup</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Install MCP SDK and necessary dependencies, set up development environment.
                          </p>
                          
                          <CodeBlock 
                            id="server-setup"
                            language="bash"
                            code={`# Install MCP SDK
npm install @anthropic-ai/mcp-sdk

# Or use Python
pip install mcp`}
                          />
                        </div>

                        <div className="border-l-4 border-green-500 pl-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Create Server</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Use SDK to create basic server instance.
                          </p>
                          
                          <CodeBlock 
                            id="server-basic"
                            code={`import { Server } from '@anthropic-ai/mcp-sdk/server/index.js';
import { StdioServerTransport } from '@anthropic-ai/mcp-sdk/server/stdio.js';

const server = new Server({
  name: 'my-server',
  version: '1.0.0'
});

// Connect transport layer
const transport = new StdioServerTransport();
await server.connect(transport);`}
                          />
                        </div>

                        <div className="border-l-4 border-purple-500 pl-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Register Features</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Define and register tools and resources provided by the server.
                          </p>
                          
                          <CodeBlock 
                            id="server-tools"
                            code={`// Register tool list
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [{
      name: 'calculate',
      description: 'Perform mathematical calculations',
      inputSchema: {
        type: 'object',
        properties: {
          expression: { type: 'string' }
        }
      }
    }]
  };
});

// Handle tool calls
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'calculate') {
    const result = eval(args.expression);
    return { content: [{ type: 'text', text: String(result) }] };
  }
  
  throw new Error(\`Unknown tool: \${name}\`);
});`}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Best Practices</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Security</h3>
                          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li>• Input validation and sanitization</li>
                            <li>• Permission checking and restrictions</li>
                            <li>• Error handling and logging</li>
                            <li>• Resource access control</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">性能优化</h3>
                          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li>• 异步处理和并发</li>
                            <li>• 缓存机制</li>
                            <li>• 资源池管理</li>
                            <li>• 超时和重试策略</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'clients' && (
                <section className="bg-white dark:bg-gray-800 rounded-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">MCP Client Development</h1>
                  
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Client Overview</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        MCP clients are applications that connect to and use MCP servers. They are responsible for discovering server capabilities, sending requests, and handling responses.
                      </p>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Client Types</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <FaDesktop className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                            <h4 className="font-medium text-gray-900 dark:text-white">Desktop Applications</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Claude Desktop, VS Code, etc.</p>
                          </div>
                          <div className="text-center">
                            <FaCode className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                            <h4 className="font-medium text-gray-900 dark:text-white">Development Tools</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">IDE plugins, CLI tools, etc.</p>
                          </div>
                          <div className="text-center">
                            <FaNetworkWired className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                            <h4 className="font-medium text-gray-900 dark:text-white">Web Applications</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Browser extensions, Web apps, etc.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Development Steps</h2>
                      <div className="space-y-6">
                        <div className="border-l-4 border-blue-500 pl-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Initialize Client</h3>
                          
                          <CodeBlock 
                            id="client-init"
                            code={`import { Client } from '@anthropic-ai/mcp-sdk/client/index.js';
import { StdioClientTransport } from '@anthropic-ai/mcp-sdk/client/stdio.js';

const client = new Client({
  name: 'my-client',
  version: '1.0.0'
});

// 连接到服务器
const transport = new StdioClientTransport({
  command: 'node',
  args: ['path/to/server.js']
});

await client.connect(transport);`}
                          />
                        </div>

                        <div className="border-l-4 border-green-500 pl-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. 发现服务器功能</h3>
                          
                          <CodeBlock 
                            id="client-discovery"
                            code={`// 初始化连接
const initResult = await client.request('initialize', {
  protocolVersion: '2024-11-05',
  capabilities: {},
  clientInfo: {
    name: 'my-client',
    version: '1.0.0'
  }
});

// 获取可用工具
const tools = await client.request('tools/list', {});
console.log('可用工具:', tools.tools);

// 获取可用资源
const resources = await client.request('resources/list', {});
console.log('可用资源:', resources.resources);`}
                          />
                        </div>

                        <div className="border-l-4 border-purple-500 pl-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. 使用服务器功能</h3>
                          
                          <CodeBlock 
                            id="client-usage"
                            code={`// 调用工具
const toolResult = await client.request('tools/call', {
  name: 'read-file',
  arguments: {
    path: '/path/to/file.txt'
  }
});

// 读取资源
const resourceResult = await client.request('resources/read', {
  uri: 'file:///config/app.json'
});

// 处理结果
console.log('工具结果:', toolResult.content);
console.log('资源内容:', resourceResult.contents);`}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">高级功能</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <FaRocket className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                            异步处理
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            支持异步工具调用和进度通知
                          </p>
                          <CodeBlock 
                            id="client-async"
                            language="javascript"
                            code={`// 处理进度通知
client.setNotificationHandler('notifications/progress', (params) => {
  console.log(\`进度: \${params.progress}%\`);
});`}
                          />
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <FaExclamationTriangle className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
                            错误处理
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            完善的错误处理和重试机制
                          </p>
                          <CodeBlock 
                            id="client-error"
                            language="javascript"
                            code={`try {
  const result = await client.request('tools/call', params);
} catch (error) {
  if (error.code === -32601) {
    console.log('方法不存在');
  }
}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'integration' && (
                <section className="bg-white dark:bg-gray-800 rounded-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">MCP Integration Guide</h1>
                  
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Integration Strategy</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Integrating MCP into existing applications requires consideration of architecture design, performance optimization, and user experience, among other aspects.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
                          <FaPlug className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Plugin Mode</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Integrate as plugins or extensions into existing applications
                          </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
                          <FaNetworkWired className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Microservice Architecture</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Run as independent services in distributed architecture
                          </p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center">
                          <FaCogs className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Embedded Integration</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Directly embed into the core functionality of applications
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Common Integration Scenarios</h2>
                      
                      <div className="space-y-6">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FaCode className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                            IDE Integration
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Integrate MCP servers in code editors to provide intelligent code analysis and automation features.
                          </p>
                          
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Implementation Points:</h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                              <li>• Integrate MCP client through plugin API</li>
                              <li>• Listen to file change events to trigger analysis</li>
                              <li>• Display analysis results in editor UI</li>
                              <li>• Provide configuration interface to manage MCP servers</li>
                            </ul>
                          </div>
                        </div>

                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FaUsers className="w-5 h-5 mr-3 text-green-600 dark:text-green-400" />
                            团队协作工具
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            在团队协作平台中集成 MCP，实现智能化的项目管理和自动化工作流。
                          </p>
                          
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">集成功能：</h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                              <li>• 自动化任务分配和跟踪</li>
                              <li>• 智能代码审查和反馈</li>
                              <li>• 项目进度分析和预测</li>
                              <li>• 团队绩效监控和优化建议</li>
                            </ul>
                          </div>
                        </div>

                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FaRocket className="w-5 h-5 mr-3 text-purple-600 dark:text-purple-400" />
                            CI/CD 流水线
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            在持续集成和部署流程中使用 MCP 服务器进行智能化的构建和测试。
                          </p>
                          
                          <CodeBlock 
                            id="cicd-integration"
                            language="yaml"
                            code={`# .github/workflows/mcp-analysis.yml
name: MCP Code Analysis
on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup MCP Server
      run: |
        npm install @my-org/mcp-code-analyzer
    - name: Run Analysis
      run: |
        mcp-analyzer --config .mcp-config.json --output analysis.json
    - name: Upload Results
      uses: actions/upload-artifact@v3
      with:
        name: analysis-results
        path: analysis.json`}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">集成最佳实践</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">技术考虑</h3>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">性能优化</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">使用连接池、缓存和异步处理</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">错误处理</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">实现重试机制和故障转移</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">安全性</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">权限控制和数据加密</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">用户体验</h3>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <FaLightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">渐进式集成</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">分阶段引入新功能</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <FaLightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">透明度</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">清晰的状态反馈和进度指示</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <FaLightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">可配置性</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">允许用户自定义集成行为</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'community' && (
                <section className="bg-white dark:bg-gray-800 rounded-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Community Resources</h1>
                  
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Official Resources</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <FaBook className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                            Official Documentation
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                            Complete protocol specification, API reference and development guide
                          </p>
                          <a 
                            href="https://modelcontextprotocol.io/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                          >
                            Visit Official Docs →
                          </a>
                        </div>
                        
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <FaGithub className="w-5 h-5 mr-2 text-gray-800 dark:text-gray-200" />
                            GitHub Repository
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                            SDK source code, example projects and issue tracking
                          </p>
                          <a 
                            href="https://github.com/anthropics/mcp" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-800 dark:text-gray-200 hover:underline text-sm"
                          >
                            View GitHub →
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Community Projects</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Excellent MCP projects and tools contributed by the community, covering various use cases and programming languages.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-center space-x-2 mb-3">
                            <FaCode className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Python</span>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">文件系统服务器</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            提供文件读写、目录浏览等功能的 Python 实现
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                              <span>⭐ 245</span>
                              <span>🍴 42</span>
                            </div>
                            <Link href="/projects" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                              查看详情 →
                            </Link>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-center space-x-2 mb-3">
                            <FaCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">TypeScript</span>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">数据库连接器</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            支持多种数据库的 MCP 服务器实现
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                              <span>⭐ 189</span>
                              <span>🍴 31</span>
                            </div>
                            <Link href="/projects" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                              查看详情 →
                            </Link>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-center space-x-2 mb-3">
                            <FaCode className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Rust</span>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">高性能计算</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            专注于高性能计算场景的 Rust 实现
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                              <span>⭐ 156</span>
                              <span>🍴 23</span>
                            </div>
                            <Link href="/projects" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                              查看详情 →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">学习资源</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                            <FaLightbulb className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                            教程文章
                          </h3>
                          <div className="space-y-3">
                            <div className="border-l-4 border-blue-500 pl-4">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm">MCP 入门指南</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-300">从零开始学习 MCP 协议和实现</p>
                            </div>
                            <div className="border-l-4 border-green-500 pl-4">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm">最佳实践分享</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-300">社区经验总结和开发技巧</p>
                            </div>
                            <div className="border-l-4 border-purple-500 pl-4">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm">高级用法指南</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-300">深入探索 MCP 的高级特性</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                            <FaUsers className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                            社区交流
                          </h3>
                          <div className="space-y-3">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">讨论论坛</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                加入我们的社区论坛，与其他开发者交流经验
                              </p>
                              <Link href="/community" className="text-blue-600 dark:text-blue-400 hover:underline text-xs">
                                访问论坛 →
                              </Link>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">技术支持</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                遇到问题？查看 FAQ 或提交 Issue
                              </p>
                              <a 
                                href="https://github.com/anthropics/mcp/issues" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                              >
                                获取帮助 →
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">贡献指南</h2>
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          MCP 是一个开源项目，我们欢迎社区的贡献！无论是代码贡献、文档改进还是 Bug 报告，都是对项目的宝贵支持。
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <FaCode className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">代码贡献</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-300">提交 PR 改进核心功能</p>
                          </div>
                          <div className="text-center">
                            <FaBook className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">文档改进</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-300">完善文档和示例</p>
                          </div>
                          <div className="text-center">
                            <FaBug className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">问题反馈</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-300">报告 Bug 和功能请求</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'architecture' && (
                <section className="bg-white dark:bg-gray-800 rounded-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">MCP 架构与设计原则</h1>
                  
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">三层架构设计</h2>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <FaDesktop className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">客户端 (Client)</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              AI 应用程序，如 Claude Desktop、IDE 插件等
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <FaUsers className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">主机 (Host)</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              协调客户端和服务器之间的通信
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <FaServer className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">服务器 (Server)</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              提供具体功能的 MCP 服务器实现
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">核心设计原则</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🚀 易于构建</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            简单的 API 设计和丰富的开发工具，让开发者可以快速构建 MCP 服务器和客户端。
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🧩 可组合性</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            模块化设计，允许不同的 MCP 服务器组合使用，提供灵活的功能扩展。
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🔒 安全隔离</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            内置安全机制，确保不同服务器之间的隔离，保护用户数据和系统安全。
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">⚡ 能力协商</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            动态发现和匹配功能，客户端和服务器可以协商支持的能力和功能。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'primitives' && (
                <section className="bg-white dark:bg-gray-800 rounded-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">MCP 核心原语详解</h1>
                  
                  <div className="space-y-8">
                    <div className="border-l-4 border-purple-500 pl-6">
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Prompts - 提示管理</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Prompts 允许服务器定义和管理可重用的提示模板，客户端可以发现和使用这些提示。
                      </p>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">使用场景：</h3>
                        <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• 代码生成模板</li>
                          <li>• 文档写作助手</li>
                          <li>• 数据分析提示</li>
                          <li>• 创意写作指导</li>
                        </ul>
                      </div>

                      <CodeBlock 
                        id="prompts-example"
                        code={`// 定义提示模板
const prompts = {
  "code-review": {
    name: "代码审查",
    description: "帮助审查代码质量和潜在问题",
    template: \`请审查以下代码：
{code}

重点关注：
- 代码质量和可读性
- 潜在的bug和安全问题
- 性能优化建议
- 最佳实践遵循情况\`
  }
};`}
                      />
                    </div>

                    <div className="border-l-4 border-blue-500 pl-6">
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Resources - 资源访问</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Resources 允许客户端访问服务器管理的数据源，如文件、数据库记录、API 响应等。
                      </p>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">资源类型：</h3>
                        <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• 文件系统资源</li>
                          <li>• 数据库记录</li>
                          <li>• API 端点</li>
                          <li>• 网络资源</li>
                        </ul>
                      </div>

                      <CodeBlock 
                        id="resources-example"
                        code={`// 资源访问示例
const resources = {
  "file://config.json": {
    name: "配置文件",
    description: "应用程序配置",
    mimeType: "application/json"
  },
  "database://users": {
    name: "用户数据",
    description: "用户信息表",
    mimeType: "application/json"
  }
};`}
                      />
                    </div>

                    <div className="border-l-4 border-green-500 pl-6">
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Tools - 工具执行</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Tools 允许客户端请求服务器执行特定操作，如运行命令、调用 API、处理数据等。
                      </p>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">工具类型：</h3>
                        <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• 命令行工具</li>
                          <li>• API 调用</li>
                          <li>• 数据处理</li>
                          <li>• 文件操作</li>
                        </ul>
                      </div>

                      <CodeBlock 
                        id="tools-example"
                        code={`// 工具定义示例
const tools = {
  "run-command": {
    name: "执行命令",
    description: "在系统中执行命令行命令",
    inputSchema: {
      type: "object",
      properties: {
        command: { type: "string" },
        args: { type: "array", items: { type: "string" } }
      }
    }
  }
};`}
                      />
                    </div>

                    <div className="border-l-4 border-orange-500 pl-6">
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Sampling - 模型交互</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Sampling 允许服务器请求客户端的语言模型生成文本，实现双向的模型交互。
                      </p>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">应用场景：</h3>
                        <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• 智能数据处理</li>
                          <li>• 自然语言分析</li>
                          <li>• 代码生成辅助</li>
                          <li>• 内容创作支持</li>
                        </ul>
                      </div>

                      <CodeBlock 
                        id="sampling-example"
                        code={`// Sampling 请求示例
const samplingRequest = {
  method: "sampling/createMessage",
  params: {
    messages: [
      {
        role: "user",
        content: "请帮我分析这段代码的功能"
      }
    ],
    modelPreferences: {
      temperature: 0.7,
      maxTokens: 1000
    }
  }
};`}
                      />
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'quickstart' && (
                <section className="bg-white dark:bg-gray-800 rounded-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">MCP 快速入门指南</h1>
                  
                  <div className="space-y-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">选择您的角色</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center cursor-pointer hover:bg-white dark:hover:bg-gray-700 p-4 rounded-lg transition-colors">
                          <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaServer className="w-8 h-8 text-green-600 dark:text-green-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">服务器开发者</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            构建 MCP 服务器，提供工具和资源
                          </p>
                        </div>
                        <div className="text-center cursor-pointer hover:bg-white dark:hover:bg-gray-700 p-4 rounded-lg transition-colors">
                          <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaDesktop className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">客户端开发者</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            集成 MCP 到您的应用程序
                          </p>
                        </div>
                        <div className="text-center cursor-pointer hover:bg-white dark:hover:bg-gray-700 p-4 rounded-lg transition-colors">
                          <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUsers className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Claude 桌面用户</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            在 Claude Desktop 中使用 MCP
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">环境准备</h2>
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Node.js 环境</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">
                            安装 Node.js 18+ 和 npm/yarn
                          </p>
                          <CodeBlock 
                            id="nodejs-install"
                            language="bash"
                            code={`# 检查 Node.js 版本
node --version

# 安装 MCP SDK
npm install @anthropic-ai/mcp-sdk`}
                          />
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Python 环境</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">
                            安装 Python 3.8+ 和 pip
                          </p>
                          <CodeBlock 
                            id="python-install"
                            language="bash"
                            code={`# 检查 Python 版本
python --version

# 安装 MCP SDK
pip install anthropic-mcp-sdk`}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">第一个 MCP 服务器</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        让我们创建一个简单的 MCP 服务器，提供文件系统访问功能：
                      </p>
                      
                      <CodeBlock 
                        id="first-server"
                        language="typescript"
                        code={`import { Server } from '@anthropic-ai/mcp-sdk/server/index.js';
import { StdioServerTransport } from '@anthropic-ai/mcp-sdk/server/stdio.js';

const server = new Server({
  name: 'file-server',
  version: '1.0.0'
});

// 注册工具
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'read-file',
        description: '读取文件内容',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string' }
          }
        }
      }
    ]
  };
});

// 工具执行
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'read-file') {
    const fs = await import('fs/promises');
    const content = await fs.readFile(args.path, 'utf8');
    return { content };
  }
  
  throw new Error(\`Unknown tool: \${name}\`);
});

// 启动服务器
const transport = new StdioServerTransport();
server.connect(transport);`}
                      />
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'server-dev' && (
                <section className="bg-white dark:bg-gray-800 rounded-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">MCP 服务器开发指南</h1>
                  
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">服务器架构</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        MCP 服务器负责提供具体的功能实现，包括工具、资源和提示的管理。
                      </p>
                      
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">核心组件</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Transport Layer</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              处理与客户端的通信，支持 stdio, HTTP, WebSocket 等
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Request Handler</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              处理客户端请求，执行具体的业务逻辑
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Resource Manager</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              管理可访问的资源，如文件、数据库等
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tool Registry</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              注册和管理可执行的工具和功能
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">高级功能实现</h2>
                      
                      <div className="space-y-6">
                        <div className="border-l-4 border-purple-500 pl-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">资源提供器</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            实现资源提供功能，让客户端可以访问服务器管理的数据。
                          </p>
                          
                          <CodeBlock 
                            id="resource-provider"
                            code={`// 资源列表处理
server.setRequestHandler('resources/list', async () => {
  return {
    resources: [
      {
        uri: 'file:///config/app.json',
        name: '应用配置',
        description: '应用程序配置文件',
        mimeType: 'application/json'
      },
      {
        uri: 'database://users',
        name: '用户数据',
        description: '用户信息表',
        mimeType: 'application/json'
      }
    ]
  };
});

// 资源读取处理
server.setRequestHandler('resources/read', async (request) => {
  const { uri } = request.params;
  
  if (uri.startsWith('file://')) {
    const path = uri.replace('file://', '');
    const content = await fs.readFile(path, 'utf8');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: content
      }]
    };
  }
  
  throw new Error(\`Unsupported resource: \${uri}\`);
});`}
                          />
                        </div>

                        <div className="border-l-4 border-blue-500 pl-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">工具实现</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            创建可执行的工具，扩展 AI 助手的能力。
                          </p>
                          
                          <CodeBlock 
                            id="tool-implementation"
                            code={`// 工具执行示例
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'execute-command':
      const { spawn } = await import('child_process');
      const result = await new Promise((resolve, reject) => {
        const child = spawn(args.command, args.args || []);
        let stdout = '';
        let stderr = '';
        
        child.stdout.on('data', (data) => stdout += data);
        child.stderr.on('data', (data) => stderr += data);
        
        child.on('close', (code) => {
          resolve({ stdout, stderr, exitCode: code });
        });
      });
      
      return {
        content: [{
          type: 'text',
          text: \`Command executed with exit code \${result.exitCode}\n\nStdout:\n\${result.stdout}\n\nStderr:\n\${result.stderr}\`
        }]
      };
      
    case 'send-notification':
      // 发送通知逻辑
      await sendNotification(args.message, args.type);
      return {
        content: [{
          type: 'text',
          text: '通知已发送'
        }]
      };
      
    default:
      throw new Error(\`Unknown tool: \${name}\`);
  }
});`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'client-dev' && (
                <section className="bg-white dark:bg-gray-800 rounded-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">MCP 客户端开发指南</h1>
                  
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">客户端架构</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        MCP 客户端负责连接和使用 MCP 服务器提供的功能。
                      </p>
                      
                      <CodeBlock 
                        id="client-basic"
                        code={`import { Client } from '@anthropic-ai/mcp-sdk/client/index.js';
import { StdioClientTransport } from '@anthropic-ai/mcp-sdk/client/stdio.js';

// 创建客户端
const client = new Client({
  name: 'my-client',
  version: '1.0.0'
});

// 连接到服务器
const transport = new StdioClientTransport({
  command: 'node',
  args: ['path/to/server.js']
});

await client.connect(transport);

// 获取服务器能力
const capabilities = await client.request('initialize', {
  protocolVersion: '0.1.0',
  capabilities: {},
  clientInfo: {
    name: 'my-client',
    version: '1.0.0'
  }
});`}
                      />
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">使用服务器功能</h2>
                      
                      <div className="space-y-6">
                        <div className="border-l-4 border-green-500 pl-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">调用工具</h3>
                          <CodeBlock 
                            id="client-tools"
                            code={`// 获取可用工具
const tools = await client.request('tools/list', {});

// 调用工具
const result = await client.request('tools/call', {
  name: 'read-file',
  arguments: {
    path: '/path/to/file.txt'
  }
});

console.log('工具执行结果:', result);`}
                          />
                        </div>

                        <div className="border-l-4 border-blue-500 pl-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">访问资源</h3>
                          <CodeBlock 
                            id="client-resources"
                            code={`// 获取可用资源
const resources = await client.request('resources/list', {});

// 读取资源
const content = await client.request('resources/read', {
  uri: 'file:///config/app.json'
});

console.log('资源内容:', content);`}
                          />
                        </div>

                        <div className="border-l-4 border-purple-500 pl-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">使用提示</h3>
                          <CodeBlock 
                            id="client-prompts"
                            code={`// 获取可用提示
const prompts = await client.request('prompts/list', {});

// 获取提示内容
const prompt = await client.request('prompts/get', {
  name: 'code-review',
  arguments: {
    code: 'function hello() { return "world"; }'
  }
});

console.log('提示内容:', prompt);`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'examples' && (
                <section className="bg-white dark:bg-gray-800 rounded-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">MCP 实例演示</h1>
                  
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">完整示例项目</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">文件系统服务器</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            提供文件读写、目录浏览等功能的 MCP 服务器
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded text-sm">
                              Node.js
                            </span>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded text-sm">
                              TypeScript
                            </span>
                          </div>
                          <button className="text-purple-600 dark:text-purple-400 hover:underline">
                            查看源码 →
                          </button>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">数据库连接器</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            连接数据库，提供查询和操作功能的 MCP 服务器
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded text-sm">
                              Python
                            </span>
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded text-sm">
                              SQLite
                            </span>
                          </div>
                          <button className="text-blue-600 dark:text-blue-400 hover:underline">
                            查看源码 →
                          </button>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-lg p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">API 集成器</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            调用外部 API 服务的 MCP 服务器实现
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded text-sm">
                              Node.js
                            </span>
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 rounded text-sm">
                              REST API
                            </span>
                          </div>
                          <button className="text-green-600 dark:text-green-400 hover:underline">
                            查看源码 →
                          </button>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Claude 桌面集成</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            在 Claude Desktop 中使用 MCP 服务器的完整示例
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded text-sm">
                              Claude Desktop
                            </span>
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded text-sm">
                              配置
                            </span>
                          </div>
                          <button className="text-orange-600 dark:text-orange-400 hover:underline">
                            查看教程 →
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">交互式演示</h2>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">MCP 协议演示</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          这里可以集成一个交互式的 MCP 协议演示，让用户直接体验 MCP 的功能。
                        </p>
                        <div className="bg-white dark:bg-gray-800 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
                          <p className="text-gray-500 dark:text-gray-400">
                            交互式演示区域 - 待开发
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
    </div>
  );
} 