'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaGithub, FaCode, FaUsers, FaLightbulb, FaRocket, FaBolt } from 'react-icons/fa';
import ProjectShowcase from '@/components/ProjectShowcase';
import { ProcessedRepo } from '@/lib/github';

interface ProjectFetchResult {
  projects: ProcessedRepo[];
  source: 'database' | 'github';
  cached: boolean;
  timestamp: string;
  stats: {
    total: number;
    fromDatabase: number;
    fromGitHub: number;
  };
}

export default function Homepage() {
  const [projectResult, setProjectResult] = useState<ProjectFetchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch project data
    fetch('/api/projects')
      .then(response => response.json())
      .then(data => {
        setProjectResult(data);
      })
      .catch(error => {
        console.error('Failed to fetch project data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const projects = projectResult?.projects || [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            MCPHubs
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto leading-relaxed">
            Explore the endless possibilities of <span className="font-semibold text-yellow-300">Model Context Protocol</span>
            <br />
            Discover the latest MCP projects, tools and integration examples
          </p>
          
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-8 mb-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">{projects.length}+</div>
              <div className="text-purple-200">Featured Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">
                {projectResult?.source === 'database' ? '⚡' : '🔄'}
              </div>
              <div className="text-purple-200">
                {projectResult?.cached ? 'Cache Accelerated' : projectResult?.source === 'database' ? 'Database' : 'GitHub API'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300">
                {projectResult?.timestamp ? 
                  new Date(projectResult.timestamp).toLocaleDateString('en-US', { 
                    timeZone: 'Asia/Shanghai',
                    month: '2-digit',
                    day: '2-digit'
                  }) : 
                  new Date().toLocaleDateString('en-US', { 
                    timeZone: 'Asia/Shanghai',
                    month: '2-digit',
                    day: '2-digit'
                  })
                }
              </div>
              <div className="text-purple-200">Auto Updates</div>
              {projectResult?.timestamp && (
                <div className="text-xs text-purple-300 mt-1">
                  Last: {new Date(projectResult.timestamp).toLocaleString('en-US', { 
                    timeZone: 'Asia/Shanghai',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                Next: Daily at 6:00 AM
              </div>
            </div>
          </div>

          {/* Popular search keywords */}
          <div className="mb-8">
            <p className="text-purple-200 mb-4">Popular Search Keywords</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'MCP Server', 'Claude MCP', 'Playwright MCP', 'FastAPI MCP',
                'Browser Tools', 'Grafana MCP', 'MCP Client', 'Awesome MCP'
              ].map((keyword) => (
                <span 
                  key={keyword}
                  className="px-4 py-2 bg-purple-500/20 rounded-full text-sm hover:bg-purple-500/30 transition-colors cursor-pointer"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/projects"
              className="inline-flex items-center px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg"
            >
              <FaCode className="mr-2" />
              Browse Projects
            </Link>
            <Link 
              href="/what-is-mcp"
              className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              <FaLightbulb className="mr-2" />
              Learn About MCP
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose MCPHubs?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg mb-6">
                <FaRocket className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Smart Project Discovery</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Through advanced algorithms and community contributions, help you quickly discover high-quality projects related to MCP.
              </p>
              <Link href="/projects" className="text-purple-600 dark:text-purple-400 hover:underline">Explore Projects</Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg mb-6">
                <FaBolt className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Real-time Data Sync</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our data sources are continuously updated to ensure you get the latest and most accurate MCP project information.
              </p>
              <Link href="/monitoring" className="text-blue-600 dark:text-blue-400 hover:underline">View Monitoring</Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg mb-6">
                <FaUsers className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Community Interaction</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Join our community to communicate with MCP developers, users and project maintainers, and jointly promote the development of MCP ecosystem.
              </p>
              <Link href="/community" className="text-green-600 dark:text-green-400 hover:underline">Join Community</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Quick Navigation
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/awesome-mcp-servers" className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🌟</div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600">Awesome MCP Servers</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Curated list of MCP servers and configuration guides.</p>
            </Link>
            
            <Link href="/integrations" className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🔗</div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600">Integration Cases</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Integration examples of various MCP projects with mainstream AI models.</p>
            </Link>
            
            <Link href="/troubleshooting" className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🛠️</div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600">Troubleshooting</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Common problems and solutions to help you quickly resolve MCP-related issues.</p>
            </Link>
            
            <a 
              href="https://github.com/search?q=model+context+protocol" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-3"><FaGithub /></div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600">GitHub Search</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Search for MCP-related projects and discussions on GitHub.</p>
            </a>
          </div>
        </div>
      </section>

      {/* Project Showcase */}
      <ProjectShowcase initialProjects={projects} />
    </>
  );
}
