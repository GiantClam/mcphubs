'use client';

import React, { useState } from 'react';
import { FaPlay, FaCode } from 'react-icons/fa';
import CodeBlock from './CodeBlock';

interface UsageExample {
  title: string;
  description: string;
  code: string;
  language: string;
  fileName: string;
  output?: string;
  interactive?: boolean;
}

interface ProjectUsageExamplesProps {
  project: any;
}

export default function ProjectUsageExamples({ project }: ProjectUsageExamplesProps) {
  const [selectedExample, setSelectedExample] = useState(0);

  const generateExamples = (project: any): UsageExample[] => {
    const baseExamples: UsageExample[] = [
      {
        title: "Basic Usage",
        description: "Get started with the most common use case",
        code: `// Basic usage example
import { ${project.name} } from '${project.npmPackage || project.name}';

const client = new ${project.name}();

// Example function call
const result = await client.exampleFunction();
console.log(result);`,
        language: "javascript",
        fileName: "example.js",
        output: "Example output here..."
      },
      {
        title: "Configuration",
        description: "Learn how to configure the client with custom settings",
        code: `// Configuration example
const config = {
  apiKey: process.env.API_KEY,
  timeout: 5000,
  retries: 3
};

const client = new ${project.name}(config);`,
        language: "javascript",
        fileName: "config.js"
      }
    ];

    // 如果有自定义示例，使用它们
    if (project.examples && project.examples.length > 0) {
      return project.examples.map((example: any, index: number) => ({
        title: example.title || `Example ${index + 1}`,
        description: example.description || "Usage example",
        code: example.code || example.content || "",
        language: example.language || "javascript",
        fileName: example.fileName || `example-${index + 1}.js`,
        output: example.output,
        interactive: example.interactive
      }));
    }

    return baseExamples;
  };

  const examples = generateExamples(project);

  return (
    <section className="project-usage-examples bg-white dark:bg-gray-900 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Usage Examples
      </h2>

      {/* 示例选择器 */}
      {examples.length > 1 && (
        <div className="example-tabs mb-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {examples.map((example, index) => (
              <button
                key={index}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedExample === index
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setSelectedExample(index)}
              >
                <FaCode className="w-4 h-4" />
                <span>{example.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 当前示例 */}
      <div className="example-content">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {examples[selectedExample].title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {examples[selectedExample].description}
          </p>
        </div>

        <div className="mb-6">
          <CodeBlock
            code={examples[selectedExample].code}
            language={examples[selectedExample].language}
            copyable
            fileName={examples[selectedExample].fileName}
          />
        </div>

        {/* 输出示例 */}
        {examples[selectedExample].output && (
          <div className="example-output mb-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
              Expected Output:
            </h4>
            <CodeBlock
              code={examples[selectedExample].output!}
              language="text"
              readonly
              fileName="output.txt"
            />
          </div>
        )}

        {/* 交互式示例 */}
        {examples[selectedExample].interactive && (
          <div className="interactive-example">
            <button className="btn-primary inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaPlay className="w-4 h-4 mr-2" />
              Try it in Playground
            </button>
          </div>
        )}
      </div>

      {/* 更多示例提示 */}
      {examples.length === 0 && (
        <div className="text-center py-8">
          <FaCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No examples available
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Check the project&apos;s README or documentation for usage examples.
          </p>
        </div>
      )}
    </section>
  );
}
