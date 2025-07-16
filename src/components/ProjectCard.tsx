'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaGithub, FaStar, FaCodeBranch, FaHeart, FaComment, FaRobot, FaCalendarAlt, FaUser, FaExternalLinkAlt, FaTags } from 'react-icons/fa';
import { generateProjectSlug } from '@/lib/utils';

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  owner: string;
  relevance: string;
  imageUrl: string;
  topics?: string[];
  updatedAt?: string;
  aiScore?: number;
  likes?: number;
  comments?: number;
  githubUrl?: string;
  isLiked?: boolean;
  userLoggedIn?: boolean;
}

export default function ProjectCard({
  id,
  name,
  description,
  stars,
  forks,
  language,
  owner,
  relevance,
  imageUrl,
  topics = [],
  updatedAt,
  aiScore = 0,
  likes = 0,
  comments = 0,
  githubUrl,
  isLiked = false,
  userLoggedIn = false,
}: ProjectCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userLoggedIn) {
      // 提示用户登录
      return;
    }

    setIsLoading(true);
    try {
      // 这里应该调用API来处理点赞
      // const response = await fetch(`/api/projects/${id}/like`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error liking project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getAIScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 h-full flex flex-col group">
      {/* 项目图片 */}
      <div className="relative h-40 w-full">
        <Image 
          src={imageUrl || '/images/default-project.jpg'} 
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {/* AI 评分徽章 */}
        {aiScore > 0 && (
          <div className={`absolute top-2 left-2 ${getAIScoreBg(aiScore)} rounded-full px-2 py-1 flex items-center space-x-1`}>
            <FaRobot className={`w-3 h-3 ${getAIScoreColor(aiScore)}`} />
            <span className={`text-xs font-medium ${getAIScoreColor(aiScore)}`}>
              {aiScore}
            </span>
          </div>
        )}
        
        {/* 相关性标签 */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            relevance === 'High' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : relevance === 'Medium'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {relevance}
          </span>
        </div>
      </div>

      {/* 项目信息 */}
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between mb-3">
          <Link href={`/project/${generateProjectSlug(owner, name)}`} className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>
          
          {githubUrl && (
            <a 
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FaExternalLinkAlt className="w-4 h-4" />
            </a>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* 主题标签 */}
        {topics && topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <FaTags className="w-3 h-3 text-gray-400 mt-1" />
            {topics.slice(0, 3).map((topic, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
              >
                {topic}
              </span>
            ))}
            {topics.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{topics.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 项目统计 */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <FaStar className="mr-1 text-yellow-400" />
              {stars.toLocaleString()}
            </span>
            <span className="flex items-center">
              <FaCodeBranch className="mr-1" />
              {forks.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="flex items-center">
              <FaUser className="w-3 h-3 mr-1" />
              {owner}
            </span>
          </div>
        </div>

        {/* 更新时间 */}
        {updatedAt && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
            <FaCalendarAlt className="w-3 h-3 mr-1" />
            最后更新: {formatDate(updatedAt)}
          </div>
        )}
      </div>

      {/* 底部操作区 */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {language || 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 点赞按钮 */}
            <button
              onClick={handleLike}
              disabled={isLoading}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                liked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaHeart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>

            {/* 评论按钮 */}
            <Link 
              href={`/project/${generateProjectSlug(owner, name)}#comments`}
              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <FaComment className="w-4 h-4" />
              <span>{comments}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 