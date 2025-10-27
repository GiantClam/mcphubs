'use client';

import React, { useState } from 'react';
import { FaNpm, FaYarn, FaPython, FaRust } from 'react-icons/fa';
import CodeBlock from './CodeBlock';
import Accordion, { createTroubleshootingItems } from './Accordion';

interface ProjectInstallationProps {
  project: any;
}

export default function ProjectInstallation({ project }: ProjectInstallationProps) {
  const [selectedPackageManager, setSelectedPackageManager] = useState('npm');

  const packageManagers = {
    npm: { 
      name: 'npm', 
      icon: <FaNpm className="w-4 h-4" />,
      command: `npm install ${project.npmPackage || project.name}`,
      available: !!project.npmPackage
    },
    yarn: { 
      name: 'yarn', 
      icon: <FaYarn className="w-4 h-4" />,
      command: `yarn add ${project.npmPackage || project.name}`,
      available: !!project.npmPackage
    },
    pnpm: { 
      name: 'pnpm', 
      icon: <FaNpm className="w-4 h-4" />,
      command: `pnpm add ${project.npmPackage || project.name}`,
      available: !!project.npmPackage
    },
    pip: { 
      name: 'pip', 
      icon: <FaPython className="w-4 h-4" />,
      command: `pip install ${project.pipPackage || project.name}`,
      available: !!project.pipPackage
    },
    cargo: { 
      name: 'cargo', 
      icon: <FaRust className="w-4 h-4" />,
      command: `cargo add ${project.cargoPackage || project.name}`,
      available: !!project.cargoPackage
    }
  };

  const availableManagers = Object.entries(packageManagers)
    .filter(([_, manager]) => manager.available);

  const generateConfigExample = (project: any) => {
    return `{
  "mcpServers": {
    "${project.name}": {
      "command": "${project.command || 'node'}",
      "args": ["${project.args || 'index.js'}"],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}`;
  };

  const configExample = project.configExample || generateConfigExample(project);

  return (
    <section className="project-installation bg-white dark:bg-gray-900 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Installation & Setup
      </h2>

      {/* 安装命令 */}
      <div className="installation-section mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Install the Package
        </h3>

        {/* 包管理器选择器 */}
        {availableManagers.length > 1 && (
          <div className="package-manager-tabs mb-4">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {availableManagers.map(([key, manager]) => (
                <button
                  key={key}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedPackageManager === key
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setSelectedPackageManager(key)}
                >
                  {manager.icon}
                  <span>{manager.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 安装命令 */}
        <CodeBlock
          code={packageManagers[selectedPackageManager as keyof typeof packageManagers]?.command || ''}
          language="bash"
          copyable
          fileName="Terminal"
        />
      </div>

      {/* 配置示例 */}
      <div className="installation-section mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Configuration
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Add this to your MCP client configuration:
        </p>

        <CodeBlock
          code={configExample}
          language="json"
          copyable
          fileName="claude_desktop_config.json"
        />
      </div>

      {/* 快速开始指南 */}
      <div className="installation-section mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Start
        </h3>
        <ol className="quick-start-steps space-y-3">
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
              1
            </span>
            <div>
              <strong className="text-gray-900 dark:text-white">Install the package</strong> using your preferred package manager
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </span>
            <div>
              <strong className="text-gray-900 dark:text-white">Add configuration</strong> to your MCP client
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </span>
            <div>
              <strong className="text-gray-900 dark:text-white">Restart your MCP client</strong> (e.g., Claude Desktop)
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
              4
            </span>
            <div>
              <strong className="text-gray-900 dark:text-white">Test the connection</strong> by asking your AI assistant to use the tools
            </div>
          </li>
        </ol>
      </div>

      {/* 故障排除 */}
      <div className="installation-section">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Troubleshooting
        </h3>
        <Accordion items={createTroubleshootingItems(project)} />
      </div>
    </section>
  );
}
