'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaUsers, FaComments, FaThumbsUp, FaClock, FaReply } from 'react-icons/fa';
import CommunityComments from '@/components/CommunityComments';

export default function CommunityDiscussionPage() {
  const params = useParams();
  const id = params?.id;
  const [discussion, setDiscussion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取讨论详情
    const mockDiscussion = {
      id: id,
      title: 'MCP 服务器开发最佳实践',
      content: `# MCP 服务器开发最佳实践

在开发 Model Context Protocol 服务器时，有几个关键的最佳实践需要遵循...

## 1. 错误处理
...

## 2. 安全性考虑
...`,
      author: 'Alice Johnson',
      category: '技术讨论',
      replies: 15,
      likes: 42,
      time: '2小时前',
      tags: ['mcp-server', '最佳实践', '开发指南']
    };
    
    setDiscussion(mockDiscussion);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">讨论不存在</h1>
        <Link href="/community" className="text-purple-600 hover:underline">
          返回社区
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <Link 
        href="/community"
        className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:underline mb-6"
      >
        <FaArrowLeft className="w-4 h-4" />
        <span>返回社区</span>
      </Link>

      {/* 讨论标题和元信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-md">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {discussion.title}
            </h1>
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
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {discussion.category}
          </span>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {discussion.tags.map((tag: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
              #{tag}
            </span>
          ))}
        </div>

        {/* 讨论内容 */}
        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: discussion.content.replace(/\n/g, '<br>') }} />
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
            <FaThumbsUp className="w-4 h-4" />
            <span>点赞</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <FaReply className="w-4 h-4" />
            <span>回复</span>
          </button>
        </div>
      </div>

      {/* 评论组件 */}
      <CommunityComments project={{
        id: String(id),
        name: 'Community Discussion',
        description: discussion?.title || '',
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
        category: 'discussion',
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
  );
} 