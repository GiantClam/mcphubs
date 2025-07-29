import Link from 'next/link';
import { FaStar, FaGithub, FaExternalLinkAlt, FaUsers, FaCode, FaBook } from 'react-icons/fa';

export default function AwesomeMCPServersPage() {
  const mcpServers = [
    {
      name: 'awesome-mcp-servers',
      description: 'Curated collection of Model Context Protocol server projects',
      url: 'https://github.com/modelcontextprotocol/servers',
      stars: '2.1k',
      category: 'Official Project',
      language: 'TypeScript',
      tags: ['Official', 'Collection', 'TypeScript']
    },
    // ... more servers
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Awesome MCP Servers
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl">
          Curated collection of Model Context Protocol server projects, covering implementations in various use cases and programming languages.
          This collection brings together excellent MCP server projects contributed by the community, helping developers quickly find suitable tools.
        </p>
      </div>

      {/* Project grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mcpServers.map((server, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{server.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaStar className="w-4 h-4 text-yellow-500" />
                <span>{server.stars}</span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {server.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {server.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{server.language}</span>
              <a 
                href={server.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:underline"
              >
                <FaGithub className="w-4 h-4" />
                <span>View Project</span>
                <FaExternalLinkAlt className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 