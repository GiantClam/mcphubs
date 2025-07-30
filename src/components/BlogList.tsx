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

  // Mock blog post data (in real applications should be fetched from CMS or database)
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Deep Dive into Model Context Protocol: Redefining Context Management for AI Applications',
    excerpt: 'In-depth exploration of MCP protocol core principles, technical architecture, and practical application scenarios. From protocol design philosophy to specific implementation details, comprehensive analysis of this revolutionary AI context management standard.',
    contentKey: 'mcp_analysis',
    author: 'MCPHubs Team',
    publishDate: new Date('2024-03-15'),
    readTime: '8 min read',
    tags: ['MCP Protocol', 'Technical Architecture', 'AI Applications'],
    category: 'Technical Deep Dive'
  },
  {
    id: '2',
    title: 'MCPHubs Ecosystem Analysis: Building an Open AI Protocol Community',
    excerpt: 'Comprehensive analysis of MCPHubs platform ecosystem development, exploring developer community contribution patterns, and how to promote MCP protocol standardization process.',
    contentKey: 'mcphubs_ecosystem',
    author: 'Community Manager',
    publishDate: new Date('2024-03-10'),
    readTime: '6 min read',
    tags: ['Community Ecosystem', 'Open Source Collaboration', 'Standardization'],
    category: 'Ecosystem Analysis'
  },
  {
    id: '3',
    title: 'MCP Project Development Best Practices: From Architecture Design to Deployment Operations',
    excerpt: 'Based on actual project experience, summarize best practices for MCP application development, including architecture design, performance optimization, security considerations, and operational deployment key aspects.',
    contentKey: 'development_practices',
    author: 'Technical Team',
    publishDate: new Date('2024-03-05'),
    readTime: '12 min read',
    tags: ['Best Practices', 'Architecture Design', 'Performance Optimization', 'Security'],
    category: 'Development Guide'
  }
];

const BlogList: React.FC = () => {
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Technical Deep Dive': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Ecosystem Analysis': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Development Guide': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Community Updates': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back button */}
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-6 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Article List
          </button>

          {/* Article title area */}
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