'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaUsers, FaComments, FaThumbsUp, FaClock, FaArrowRight } from 'react-icons/fa';
import CommunityComments from '@/components/CommunityComments';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('discussions');

  // ... existing discussions data ...

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
        <CommunityComments />
      </div>
    </div>
  );
} 