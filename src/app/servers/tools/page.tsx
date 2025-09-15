'use client';

import MCPConnector from '@/components/MCPConnector';

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">MCP Quick Connect Tools</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Generate MCP connection configs for VS Code, Cursor, Claude, and more — in one click.</p>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
        <MCPConnector />
      </div>
    </div>
  );
}


