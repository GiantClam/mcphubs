'use client';

import React, { useState } from 'react';
import { FaComment, FaThumbsUp, FaThumbsDown, FaUser, FaStar, FaReply } from 'react-icons/fa';
import { ProcessedRepo } from '@/lib/github';

interface CommunityCommentsProps {
  project: ProcessedRepo;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  rating: number;
  timestamp: Date;
  likes: number;
  dislikes: number;
  replies: Comment[];
}

// 模拟评论数据（实际应用中应该从数据库获取）
function generateMockComments(projectName: string): Comment[] {
  const comments: Comment[] = [
    {
      id: '1',
      author: 'AI开发者小王',
      content: `我在项目中使用了${projectName}，发现它的MCP集成非常简洁。特别是在处理复杂对话上下文时，能够很好地保持语义连贯性。推荐给需要构建智能对话系统的开发者。`,
      rating: 5,
      timestamp: new Date('2024-01-15'),
      likes: 12,
      dislikes: 1,
      replies: [
        {
          id: '1-1',
          author: '技术架构师李明',
          content: '同意！我们在企业级应用中也使用了这个项目，稳定性很好。你有遇到过性能瓶颈吗？',
          rating: 0,
          timestamp: new Date('2024-01-16'),
          likes: 3,
          dislikes: 0,
          replies: []
        }
      ]
    },
    {
      id: '2',
      author: 'MCP爱好者',
      content: '这个项目的文档质量很高，代码结构清晰。作为MCP生态系统的一部分，它为我的学习提供了很好的参考。希望能看到更多实际应用案例。',
      rating: 4,
      timestamp: new Date('2024-01-10'),
      likes: 8,
      dislikes: 0,
      replies: []
    },
    {
      id: '3',
      author: '全栈开发小张',
      content: '部署过程遇到了一些依赖问题，但通过查看Issues页面找到了解决方案。整体体验不错，MCP协议的实现很标准。建议新手先从官方示例开始。',
      rating: 4,
      timestamp: new Date('2024-01-08'),
      likes: 6,
      dislikes: 2,
      replies: []
    }
  ];
  
  return comments;
}

const CommunityComments: React.FC<CommunityCommentsProps> = ({ project }) => {
  const [comments, setComments] = useState<Comment[]>(generateMockComments(project.name));
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: '当前用户',
        content: newComment,
        rating: rating,
        timestamp: new Date(),
        likes: 0,
        dislikes: 0,
        replies: []
      };
      
      setComments([comment, ...comments]);
      setNewComment('');
      setRating(5);
      setShowCommentForm(false);
    }
  };

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const handleDislike = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, dislikes: comment.dislikes + 1 }
        : comment
    ));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) return '今天';
    if (diffInDays < 7) return `${diffInDays}天前`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}周前`;
    return `${Math.floor(diffInDays / 30)}个月前`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaComment className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            社区评论 ({comments.length})
          </h2>
        </div>
        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          发表评论
        </button>
      </div>

      {/* 发表评论表单 */}
      {showCommentForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            分享您的使用体验
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              评分
            </label>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className="focus:outline-none"
                >
                  <FaStar
                    className={`w-6 h-6 ${
                      i < rating ? 'text-yellow-500' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              评论内容
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="分享您对这个项目的看法、使用经验或建议..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              发布评论
            </button>
            <button
              onClick={() => setShowCommentForm(false)}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {comment.author}
                    </h4>
                    {comment.rating > 0 && (
                      <div className="flex items-center space-x-1">
                        {renderStars(comment.rating)}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(comment.timestamp)}
                  </span>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                  {comment.content}
                </p>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
                  >
                    <FaThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{comment.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => handleDislike(comment.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <FaThumbsDown className="w-4 h-4" />
                    <span className="text-sm">{comment.dislikes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                    <FaReply className="w-4 h-4" />
                    <span className="text-sm">回复</span>
                  </button>
                </div>
                
                {/* 回复 */}
                {comment.replies.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="mb-4 last:mb-0">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                            <FaUser className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {reply.author}
                              </h5>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTimeAgo(reply.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 社区指南 */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
          Community Comment Guidelines
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Share genuine usage experiences and technical insights</li>
          <li>• Provide specific use cases and solutions</li>
          <li>• Respect other users and maintain a friendly discussion atmosphere</li>
          <li>• Avoid posting content unrelated to the project</li>
        </ul>
      </div>
    </div>
  );
};

export default CommunityComments; 