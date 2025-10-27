'use client';

import React, { useState } from 'react';
import { FaCopy, FaCheck, FaTerminal, FaFileCode } from 'react-icons/fa';

interface CodeBlockProps {
  code: string;
  language?: string;
  fileName?: string;
  copyable?: boolean;
  readonly?: boolean;
  className?: string;
}

export default function CodeBlock({ 
  code, 
  language = 'text', 
  fileName,
  copyable = true,
  readonly = false,
  className = ''
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLanguageIcon = () => {
    switch (language) {
      case 'bash':
      case 'shell':
        return <FaTerminal className="h-4 w-4" />;
      default:
        return <FaFileCode className="h-4 w-4" />;
    }
  };

  return (
    <div className={`code-block ${className}`}>
      {/* 头部 */}
      {(fileName || copyable) && (
        <div className="code-block-header">
          <div className="flex items-center space-x-2">
            {getLanguageIcon()}
            {fileName && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {fileName}
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {language}
            </span>
          </div>
          
          {copyable && !readonly && (
            <button
              onClick={handleCopy}
              className="copy-button"
              aria-label="Copy code"
            >
              {copied ? (
                <FaCheck className="h-4 w-4 text-green-500" />
              ) : (
                <FaCopy className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      )}

      {/* 代码内容 */}
      <div className="code-block-content">
        <pre className="code-block-pre">
          <code className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
