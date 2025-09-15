'use client';

import { useState } from 'react';
import { FaCopy, FaExternalLinkAlt, FaCheckCircle, FaExclamationCircle, FaClock, FaStar } from 'react-icons/fa';
import MCPConnector from './MCPConnector';

interface Server {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  status: 'active' | 'community' | 'inactive';
  features: string[];
  compatibility: string[];
  documentation?: string;
  installCommand?: string;
  category: string;
}

interface ServerCardProps {
  server: Server;
}

export default function ServerCard({ server }: ServerCardProps) {
  const [showConnector, setShowConnector] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFaCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusIcon = () => {
    switch (server.status) {
      case 'active':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'community':
        return <FaStar className="w-4 h-4 text-yellow-500" />;
      case 'inactive':
        return <FaExclamationCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (server.status) {
      case 'active':
        return '官方维护';
      case 'community':
        return '社区项目';
      case 'inactive':
        return '已停止';
      default:
        return '未知状态';
    }
  };

  const getStatusColor = () => {
    switch (server.status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'community':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      {/* 头部 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {server.name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="ml-1">{getStatusText()}</span>
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {server.description}
          </p>
          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded">
            {server.category}
          </span>
        </div>
      </div>

      {/* 端点信息 */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          服务器端点
        </label>
        <div className="flex items-center space-x-2">
          <code className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono">
            {server.endpoint}
          </code>
          <button
            onClick={() => handleFaCopy(server.endpoint)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            title="复制端点"
          >
            <FaCopy className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* 功能特性 */}
      {server.features.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            功能特性
          </label>
          <div className="flex flex-wrap gap-1">
            {server.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
              >
                {feature}
              </span>
            ))}
            {server.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded">
                +{server.features.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 兼容性 */}
      {server.compatibility.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            兼容客户端
          </label>
          <div className="flex flex-wrap gap-1">
            {server.compatibility.map((client, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded"
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 安装命令 */}
      {server.installCommand && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            安装命令
          </label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono">
              {server.installCommand}
            </code>
            <button
              onClick={() => handleFaCopy(server.installCommand!)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              title="复制安装命令"
            >
              <FaCopy className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex space-x-2">
        <button
          onClick={() => setShowConnector(!showConnector)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {showConnector ? '隐藏连接器' : '一键连接'}
        </button>
        {server.documentation && (
          <a
            href={server.documentation}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1"
          >
            <FaExternalLinkAlt className="w-4 h-4" />
            <span>文档</span>
          </a>
        )}
      </div>

      {/* 连接器 */}
      {showConnector && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <MCPConnector defaultEndpoint={server.endpoint} />
        </div>
      )}

      {/* 成功提示 */}
      {copied && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          已复制到剪贴板！
        </div>
      )}
    </div>
  );
}
