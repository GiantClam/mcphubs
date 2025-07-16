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
      title: 'MCP 服务器开发最佳实践',
      preview: '分享一些在开发 MCP 服务器过程中的经验和最佳实践...',
      author: 'developer123',
      replies: 15,
      likes: 42,
      time: '2小时前',
      category: '技术讨论'
    },
    {
      id: '2',
      title: 'Claude Desktop 集成问题解决',
      preview: '遇到 Claude Desktop 集成问题？这里有一些常见解决方案...',
      author: 'mcphelper',
      replies: 8,
      likes: 23,
      time: '4小时前',
      category: '问题求助'
    },
    {
      id: '3',
      title: '新版本 MCP 协议更新解析',
      preview: '详细解析最新版本的 MCP 协议变更和新特性...',
      author: 'protocol_expert',
      replies: 32,
      likes: 67,
      time: '1天前',
      category: '协议讨论'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          MCP 社区论坛
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl">
          与 Model Context Protocol 社区交流，分享经验，获取支持，共同推动 MCP 生态系统的发展。
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
              💬 讨论区
            </button>
            <button
              onClick={() => setActiveTab('showcase')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'showcase'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              🚀 项目展示
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'help'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              🙋 求助专区
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
                      <span>{discussion.replies} 回复</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaThumbsUp className="w-4 h-4" />
                      <span>{discussion.likes} 点赞</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaClock className="w-4 h-4" />
                      <span>{discussion.time}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  discussion.category === '技术讨论' ? 'bg-blue-100 text-blue-800' :
                  discussion.category === '项目分享' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {discussion.category}
                </span>
              </div>
              <Link 
                href={`/community/${discussion.id}`}
                className="inline-flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:underline"
              >
                <span>查看详情</span>
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