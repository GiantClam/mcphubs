import { Metadata } from 'next';
import ClaudeSkillsClient from './ClaudeSkillsClient';

export const metadata: Metadata = {
  title: 'Claude Skills - Official Skills Library | MCPHubs',
  description: 'Discover and download official Claude Skills from Anthropic. These reusable packages of instructions and code teach Claude to perform specialized tasks and automate complex workflows.',
  keywords: [
    'claude skills', 'anthropic skills', 'claude ai skills', 'claude agent skills',
    'claude automation', 'claude workflow', 'claude instructions', 'claude code packages'
  ],
  openGraph: {
    title: 'Claude Skills - Official Skills Library',
    description: 'Discover and download official Claude Skills from Anthropic.',
    type: 'website'
  }
};

export default async function ClaudeSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title and Description */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Claude Skills
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Claude Skills are reusable packages of instructions and code officially recommended by Anthropic. 
          They teach Claude to perform specialized tasks and automate complex workflows. 
          These skills can be used in Claude applications, Claude Code, and the API.
        </p>
        
        {/* Feature Introduction */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            🎯 What are Claude Skills?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Claude Skills are folders containing instructions, scripts, and resources that Claude can load when needed. 
            Claude only accesses skills when they&apos;re relevant to the task, enabling it to perform specialized tasks more effectively, 
            such as processing Excel files or following organizational brand guidelines.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">✨ Features</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• <strong>Composable</strong>: Skills can be stacked and Claude automatically identifies which ones are needed</li>
                <li>• <strong>Portable</strong>: Unified format across all Claude products</li>
                <li>• <strong>Efficient</strong>: Only loads necessary content when needed</li>
                <li>• <strong>Powerful</strong>: Can include executable code</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📚 Use Cases</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Document creation and editing (Word, Excel, PDF, PPT)</li>
                <li>• Code development and test automation</li>
                <li>• Creative design and brand guidelines</li>
                <li>• Data analysis and research</li>
                <li>• Media processing and enhancement</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
              📄 Document Processing
            </span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              💻 Development Tools
            </span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
              🎨 Creative Design
            </span>
            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm">
              📊 Data Analysis
            </span>
            <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full text-sm">
              🎬 Media Processing
            </span>
          </div>
        </div>

        {/* Reference Links */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            📖 Learn more: {' '}
            <a 
              href="https://claude.com/blog/skills" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Claude Skills Official Blog
            </a>
            {' • '}
            <a 
              href="https://github.com/anthropics/skills" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              GitHub Repository
            </a>
          </p>
        </div>
      </div>

      {/* Skills List */}
      <ClaudeSkillsClient />
    </div>
  );
}

