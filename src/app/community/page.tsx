'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaUsers, FaComments, FaThumbsUp, FaClock, FaArrowRight } from 'react-icons/fa';
import CommunityComments from '@/components/CommunityComments';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('discussions');

  // 模拟讨论数据
  const discussions = [
    {
      id: '1',
      title: 'Best Practices for MCP Server Development',
      preview: 'Sharing some experiences and best practices in developing MCP servers...',
      author: 'developer123',
      replies: 15,
      likes: 42,
      time: '2 hours ago',
      category: 'Technical Discussion'
    },
    {
      id: '2',
      title: 'Claude Desktop Integration Solutions',
      preview: 'Encountering Claude Desktop integration issues? Here are some common solutions...',
      author: 'mcphelper',
      replies: 8,
      likes: 23,
      time: '4 hours ago',
      category: 'Help Request'
    },
    {
      id: '3',
      title: 'Analysis of New MCP Protocol Updates',
      preview: 'Detailed analysis of the latest MCP protocol changes and new features...',
      author: 'protocol_expert',
      replies: 32,
      likes: 67,
      time: '1 day ago',
      category: 'Protocol Discussion'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          MCP Community Forum
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl">
          Communicate with the Model Context Protocol community, share experiences, get support, and jointly promote the development of the MCP ecosystem.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('discussions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'discussions'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              💬 Discussions
            </button>
            <button
              onClick={() => setActiveTab('showcase')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'showcase'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              🚀 Project Showcase
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'help'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              🙋 Help Center
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'discussions' && (
        <div className="space-y-6">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {discussion.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {discussion.preview}
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FaUsers className="w-4 h-4" />
                      <span>{discussion.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaComments className="w-4 h-4" />
                      <span>{discussion.replies} replies</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaThumbsUp className="w-4 h-4" />
                      <span>{discussion.likes} likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaClock className="w-4 h-4" />
                      <span>{discussion.time}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  discussion.category === 'Technical Discussion' ? 'bg-blue-100 text-blue-800' :
                  discussion.category === 'Project Sharing' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {discussion.category}
                </span>
              </div>
              <Link 
                href={`/community/${discussion.id}`}
                className="inline-flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:underline"
              >
                <span>View Details</span>
                <FaArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Comments Component */}
      <div className="mt-12">
        <CommunityComments project={{
          id: 'community',
          name: 'MCP Community',
          description: 'Model Context Protocol Community Forum',
          url: '',
          stars: 0,
          forks: 0,
          language: '',
          topics: [],
          createdAt: '',
          updatedAt: '',
          owner: '',
          fullName: '',
          hasIssues: true,
          hasWiki: true,
          openIssues: 0,
          watchers: 0,
          defaultBranch: 'main',
          size: 0,
          score: 0,
          lastCommitSha: '',
          lastCommitDate: '',
          license: null,
          hasDocumentation: false,
          readmeContent: '',
          contributorsCount: 0,
          releaseCount: 0,
          hasActions: false,
          primaryLanguageColor: '',
          languageStats: {},
          weeklyCommits: 0,
          monthlyCommits: 0,
          yearlyCommits: 0,
          averageCommitsPerWeek: 0,
          lastActivityDays: 0,
          healthScore: 0,
          communityScore: 0,
          trendingScore: 0,
          qualityScore: 0,
          category: 'community',
          tags: [],
          logoUrl: null,
          screenshotUrl: null,
          demoUrl: null,
          tutorialUrl: null,
          installationGuide: '',
          usageExample: '',
          dependencies: [],
          devDependencies: [],
          supportedPlatforms: [],
          integrations: [],
          features: [],
          status: 'active',
          maturityLevel: 'stable',
          lastAnalyzed: '',
          analysisVersion: 1
        } as any} />
      </div>
    </div>
  );
} 