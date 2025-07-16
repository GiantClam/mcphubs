'use client';

import React from 'react';
import { FaCalendarAlt, FaUser, FaClock, FaTag, FaArrowRight } from 'react-icons/fa';
import MarkdownRenderer from './MarkdownRenderer';
import { blogContent } from '../data/blogContent';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  contentKey: keyof typeof blogContent;
  author: string;
  publishDate: Date;
  readTime: string;
  tags: string[];
  category: string;
}

// 模拟博客文章数据（实际应用中应该从CMS或数据库获取）
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Model Context Protocol深度解析：重新定义AI应用的上下文管理',
    excerpt: '深入探讨MCP协议的核心原理、技术架构和实际应用场景。从协议设计理念到具体实现细节，全面解析这一革命性的AI上下文管理标准。',
    contentKey: 'mcp_analysis',
    author: 'MCPHubs团队',
    publishDate: new Date('2024-03-15'),
    readTime: '8分钟阅读',
    tags: ['MCP协议', '技术架构', 'AI应用'],
    category: '技术深度'
  },
  {
    id: '2',
    title: 'MCPHubs生态系统分析：构建开放的AI协议社区',
    excerpt: '全面分析MCPHubs平台的生态发展状况，探讨开发者社区的贡献模式，以及如何推动MCP协议的标准化进程。',
    contentKey: 'mcphubs_ecosystem',
    author: '社区管理员',
    publishDate: new Date('2024-03-10'),
    readTime: '6分钟阅读',
    tags: ['社区生态', '开源协作', '标准化'],
    category: '生态分析'
  },
  {
    id: '3',
    title: 'MCP项目开发最佳实践：从架构设计到部署运维',
    excerpt: '基于实际项目经验，总结MCP应用开发的最佳实践，包括架构设计、性能优化、安全考虑和运维部署等关键环节。',
    contentKey: 'development_practices',
    author: '技术团队',
    publishDate: new Date('2024-03-05'),
    readTime: '12分钟阅读',
    tags: ['最佳实践', '架构设计', '性能优化', '安全'],
    category: '开发指南'
  }
];

const BlogList: React.FC = () => {
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '技术深度': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      '生态分析': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      '开发指南': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      '社区动态': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* 返回按钮 */}
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-6 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <span className="mr-2">←</span>
            返回文章列表
          </button>

          {/* 文章标题区域 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedPost.category)}`}>
                {selectedPost.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedPost.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center mr-6 mb-2">
                <FaUser className="mr-2" />
                {selectedPost.author}
              </div>
              <div className="flex items-center mr-6 mb-2">
                <FaCalendarAlt className="mr-2" />
                {formatDate(selectedPost.publishDate)}
              </div>
              <div className="flex items-center mr-6 mb-2">
                <FaClock className="mr-2" />
                {selectedPost.readTime}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedPost.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md"
                >
                  <FaTag className="mr-1 text-xs" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 文章内容 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <MarkdownRenderer 
              content={blogContent[selectedPost.contentKey]}
              className="max-w-none"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 标题部分 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            MCP技术博客
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            探索Model Context Protocol的技术深度，分享开发实践和生态洞察
          </p>
        </div>

        {/* 文章列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              {/* 文章分类标签 */}
              <div className="p-6 pb-0">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
              </div>

              <div className="p-6">
                {/* 文章标题 */}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>

                {/* 文章摘要 */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* 文章元信息 */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FaUser className="mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    {formatDate(post.publishDate)}
                  </div>
                </div>

                {/* 阅读时间和标签 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                    <FaClock className="mr-2" />
                    {post.readTime}
                  </div>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                    阅读更多
                    <FaArrowRight className="ml-2" />
                  </div>
                </div>

                {/* 标签列表 */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                    >
                      <FaTag className="mr-1 text-xs" />
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 加载更多按钮 */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            加载更多文章
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogList; 