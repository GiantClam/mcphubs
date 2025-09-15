'use client';

import { useEffect, useState } from 'react';
import { FaCopy, FaExternalLinkAlt, FaCode, FaDesktop } from 'react-icons/fa';

interface MCPConnectorProps {
  defaultEndpoint?: string;
}

export default function MCPConnector({ defaultEndpoint = '' }: MCPConnectorProps) {
  const [endpoint, setEndpoint] = useState(defaultEndpoint);
  const [copied, setCopied] = useState(false);
  const [probe, setProbe] = useState<{ ok: boolean; status?: number; contentType?: string; reachable?: boolean; requireAuth?: boolean } | null>(null);
  const [probing, setProbing] = useState(false);

  useEffect(() => {
    let active = true;
    async function doProbe() {
      setProbe(null);
      if (!endpoint) return;
      if (!/^https?:\/\//i.test(endpoint)) {
        // 仅对 http/https 进行探测，其它协议跳过
        return;
      }
      setProbing(true);
      try {
        const res = await fetch(`/api/ping-mcp?url=${encodeURIComponent(endpoint)}`);
        const json = await res.json();
        if (!active) return;
        setProbe({ ok: !!json.ok, status: json.status, contentType: json.contentType, reachable: json.reachable, requireAuth: json.requireAuth });
      } catch (e) {
        if (!active) return;
        setProbe({ ok: false });
      } finally {
        if (active) setProbing(false);
      }
    }
    const t = setTimeout(doProbe, 400);
    return () => { active = false; clearTimeout(t); };
  }, [endpoint]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateVSCodeConfig = (endpoint: string) => {
    return `{
  "mcp.servers": {
    "custom-server": {
      "command": "${endpoint}",
      "args": []
    }
  }
}`;
  };

  const generateCursorConfig = (endpoint: string) => {
    return `{
  "mcp.servers": {
    "custom-server": {
      "command": "${endpoint}",
      "args": []
    }
  }
}`;
  };

  const generateClaudeDesktopConfig = (endpoint: string) => {
    return `{
  "mcpServers": {
    "custom-server": {
      "command": "${endpoint}",
      "args": []
    }
  }
}`;
  };

  const connectionMethods = [
    {
      id: 'vscode',
      name: 'VS Code',
      icon: <FaCode className="w-5 h-5" />,
      description: 'Configure MCP server in VS Code',
      action: () => handleCopy(generateVSCodeConfig(endpoint)),
      config: generateVSCodeConfig(endpoint)
    },
    {
      id: 'cursor',
      name: 'Cursor',
      icon: <FaDesktop className="w-5 h-5" />,
      description: 'Configure MCP server in Cursor IDE',
      action: () => handleCopy(generateCursorConfig(endpoint)),
      config: generateCursorConfig(endpoint)
    },
    {
      id: 'claude-desktop',
      name: 'Claude Desktop',
      icon: <FaExternalLinkAlt className="w-5 h-5" />,
      description: 'Configure MCP server in Claude Desktop',
      action: () => handleCopy(generateClaudeDesktopConfig(endpoint)),
      config: generateClaudeDesktopConfig(endpoint)
    },
    {
      id: 'copy-url',
      name: 'Copy Endpoint',
      icon: <FaCopy className="w-5 h-5" />,
      description: 'Copy server endpoint URL',
      action: () => handleCopy(endpoint),
      config: endpoint
    }
  ];

  return (
    <div className="space-y-6">
      {/* Endpoint input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          MCP Server Endpoint
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="stdio://mcp-server-filesystem or https://api.example.com/mcp"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
            <button
              onClick={() => handleCopy(endpoint)}
              disabled={!endpoint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <FaCopy className="w-4 h-4" />
              <span>Copy</span>
            </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Supports stdio:// and https:// protocols
        </p>
        {/^https?:\/\//i.test(endpoint) && (
          <div className="mt-2 text-xs">
            {probing ? (
              <span className="text-gray-400">Checking availability...</span>
            ) : probe ? (
              probe.ok || probe.reachable ? (
                <span className="text-green-500">
                  Reachable{probe.requireAuth ? ' (auth required)' : ''} (HTTP {probe.status}{probe.contentType ? `, ${probe.contentType}` : ''})
                </span>
              ) : (
                <span className="text-red-500">Unavailable</span>
              )
            ) : null}
          </div>
        )}
      </div>

      {/* Connection methods */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          One-click connection methods
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectionMethods.map((method) => (
            <div
              key={method.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {method.icon}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {method.name}
                  </span>
                </div>
                <button
                  onClick={method.action}
                  disabled={!endpoint || (/^https?:\/\//i.test(endpoint) && !(probe?.ok || probe?.reachable))}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm rounded transition-colors flex items-center space-x-1"
                >
                  <FaCopy className="w-3 h-3" />
                  <span>Copy config</span>
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {method.description}
              </p>
              {endpoint && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    View config code
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
                    {method.config}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Copied toast */}
      {copied && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Copied to clipboard!
        </div>
      )}

      {/* How to use */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 How to use
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• After copying, paste the config into your client settings.</li>
          <li>• VS Code: Settings → search "mcp" → edit settings.json</li>
          <li>• Cursor: Settings → MCP → Add server</li>
          <li>• Claude Desktop: config file → mcpServers</li>
        </ul>
      </div>
    </div>
  );
}
