import Link from "next/link";
import { FaCode, FaBook, FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";

export const metadata = {
  title: 'What is MCP? Complete Guide to Model Context Protocol | MCPHubs',
  description: 'Deep dive into what MCP is! Model Context Protocol (MCP) is an AI protocol developed by Anthropic for communication between models like Claude and external tools. Learn MCP protocol principles, applications, and development guides.',
  keywords: [
    'what is mcp', 'Model Context Protocol', 'MCP protocol', 'claude mcp', 'anthropic mcp',
    'mcp meaning', 'AI protocol', 'context protocol', 'MCP definition', 'what does MCP mean',
    'mcp tutorial', 'mcp development', 'AI tool integration', 'Claude integration'
  ],
  openGraph: {
    title: 'What is MCP? Complete Guide to Model Context Protocol',
    description: 'Comprehensive analysis of MCP protocol: from basic concepts to practical applications, understand how Anthropic Model Context Protocol revolutionizes AI application development',
    images: ['/images/og-what-is-mcp.jpg'],
    url: 'https://mcphubs.com/what-is-mcp'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What is MCP? Model Context Protocol Guide',
    description: 'Deep dive into MCP protocol, learn how to develop AI applications using Model Context Protocol'
  },
  alternates: {
    canonical: 'https://mcphubs.com/what-is-mcp'
  }
};

export default function WhatIsMCP() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page title */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            What is MCP?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            MCP has multiple meanings, this page will help you find the correct information
          </p>
        </section>

        {/* Anthropic MCP Definition Section */}
        <section className="mb-12">
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-8">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                <FaCode className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Anthropic Model Context Protocol (MCP)
                </h2>
                <div className="text-gray-700 dark:text-gray-300 space-y-4">
                  <p className="text-lg">
                    <strong>Model Context Protocol (MCP)</strong> is a standardized protocol developed by Anthropic
                    for connecting AI assistants (like Claude) with external data sources and tools.
                  </p>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Core Features:</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-start">
                        <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                        <span><strong>Client-Host-Server Architecture</strong>: Clear three-layer architecture design</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                        <span><strong>Easy to Build</strong>: Simple APIs and rich development tools</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                        <span><strong>Composability</strong>: Modular design supporting flexible composition</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                        <span><strong>Security Isolation</strong>: Built-in security mechanisms and permission controls</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                        <span><strong>Capability Negotiation</strong>: Dynamic discovery and matching functionality</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Core Primitives:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-600 dark:text-purple-400">Prompts</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Define and manage prompt templates</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-600 dark:text-purple-400">Resources</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Access external data sources and files</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-600 dark:text-purple-400">Tools</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Execute external operations and functions</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-600 dark:text-purple-400">Sampling</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Interact with language models</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/concepts" 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                  >
                    <FaBook className="w-5 h-5" />
                    Deep Dive into MCP Concepts
                    <FaArrowRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    href="/projects" 
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                  >
                    <FaCode className="w-5 h-5" />
                    Browse MCP Projects
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other MCP Meanings Disambiguation Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Other MCP Meanings
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
            MCP has different meanings in different fields, here are some common other meanings:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Microsoft Certified Professional</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Microsoft Certified Professional, Microsoft's technical certification program
              </p>
              <a 
                href="https://learn.microsoft.com/en-us/certifications/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm inline-flex items-center gap-1"
              >
                Learn More <FaExternalLinkAlt className="w-3 h-3" />
              </a>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Master Control Program</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Master Control Program, control program concept in computer science
              </p>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Computer Science Term</span>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Metacarpophalangeal</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Metacarpophalangeal, medical anatomical terminology
              </p>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Medical Term</span>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Monocyte Chemoattractant Protein</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Monocyte Chemoattractant Protein, important protein in biological research
              </p>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Biological Term</span>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Multi-Channel Protocol</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Multi-Channel Protocol, protocol type in network communication
              </p>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Network Technology</span>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">其他含义</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                MCP has more meanings in other fields, depending on the usage context
              </p>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Various Fields</span>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            About This Website
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            <strong>MCPHubs.com</strong> focuses on Anthropic's Model Context Protocol (MCP).
            All content on this website revolves around this specific MCP protocol, including project showcases, development guides, community discussions, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/concepts" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <FaBook className="w-5 h-5" />
              Start Learning MCP
            </Link>
            <Link 
              href="/community" 
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Join Community Discussion
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 