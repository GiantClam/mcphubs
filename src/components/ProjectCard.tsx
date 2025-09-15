'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaStar, FaCodeBranch, FaHeart, FaComment, FaRobot, FaCalendarAlt, FaUser, FaExternalLinkAlt, FaTags, FaCode, FaDownload, FaBook, FaServer, FaDesktop, FaCopy, FaTerminal } from 'react-icons/fa';
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
  // 新增结构化字段
  projectType?: string;
  coreFeatures?: string[];
  techStack?: string[];
  compatibility?: string[];
  installCommand?: string;
  quickStartCode?: string;
  documentationUrl?: string;
  serverEndpoint?: string;
  clientCapabilities?: string[];
}

export default function ProjectCard({
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
  // 新增结构化字段
  projectType,
  coreFeatures = [],
  techStack = [],
  compatibility = [],
  installCommand,
  quickStartCode,
  documentationUrl,
  serverEndpoint,
}: ProjectCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userLoggedIn) {
      // Prompt user to login
      return;
    }

    setIsLoading(true);
    try {
      // Here should call API to handle like
      // const response = await fetch(`/api/projects/${id}/like`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      
      // Mock API call
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
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getProjectTypeIcon = (type?: string) => {
    switch (type) {
      case 'Server':
        return <FaServer className="w-4 h-4 text-green-500" />;
      case 'Client':
        return <FaDesktop className="w-4 h-4 text-blue-500" />;
      case 'Library':
        return <FaCode className="w-4 h-4 text-purple-500" />;
      case 'Tool':
        return <FaTerminal className="w-4 h-4 text-orange-500" />;
      default:
        return <FaCode className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Link 
      href={`/project/${generateProjectSlug(owner, name)}`}
      className="block border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 h-full flex flex-col group"
    >
              {/* Project image */}
      <div className="relative h-40 w-full">
        <Image 
          src={imageUrl || '/images/default-project.jpg'} 
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {/* AI score badge */}
        {aiScore > 0 && (
          <div className={`absolute top-2 left-2 ${getAIScoreBg(aiScore)} rounded-full px-2 py-1 flex items-center space-x-1`}>
            <FaRobot className={`w-3 h-3 ${getAIScoreColor(aiScore)}`} />
            <span className={`text-xs font-medium ${getAIScoreColor(aiScore)}`}>
              {aiScore}
            </span>
          </div>
        )}
        
        {/* Relevance tag */}
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

      {/* Project information */}
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-grow">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                {name}
              </h3>
              {projectType && (
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  {getProjectTypeIcon(projectType)}
                  <span>{projectType}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {githubUrl && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(githubUrl, '_blank', 'noopener,noreferrer');
                }}
                className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                title="打开GitHub"
              >
                <FaExternalLinkAlt className="w-4 h-4" />
              </button>
            )}
            {documentationUrl && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(documentationUrl, '_blank', 'noopener,noreferrer');
                }}
                className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="查看文档"
              >
                <FaBook className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Topic tags */}
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

        {/* 核心特性 */}
        {coreFeatures && coreFeatures.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {coreFeatures.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
              {coreFeatures.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{coreFeatures.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 技术栈 */}
        {techStack && techStack.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {techStack.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full"
                >
                  {tech}
                </span>
              ))}
              {techStack.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{techStack.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 兼容性 */}
        {compatibility && compatibility.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {compatibility.slice(0, 2).map((comp, index) => (
                <span
                  key={index}
                  className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full"
                >
                  {comp}
                </span>
              ))}
              {compatibility.length > 2 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{compatibility.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Project statistics */}
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

        {/* Update time */}
        {updatedAt && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
            <FaCalendarAlt className="w-3 h-3 mr-1" />
            Last updated: {formatDate(updatedAt)}
          </div>
        )}
      </div>

              {/* Bottom action area */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {language || 'N/A'}
            </span>
            {serverEndpoint && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopy(serverEndpoint);
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center space-x-1"
                title="复制服务器端点"
              >
                <FaCopy className="w-3 h-3" />
                <span>端点</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 安装命令复制 */}
            {installCommand && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopy(installCommand);
                }}
                className="text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 flex items-center space-x-1"
                title="复制安装命令"
              >
                <FaDownload className="w-3 h-3" />
                <span>安装</span>
              </button>
            )}

            {/* 快速开始代码复制 */}
            {quickStartCode && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopy(quickStartCode);
                }}
                className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center space-x-1"
                title="复制快速开始代码"
              >
                <FaCode className="w-3 h-3" />
                <span>代码</span>
              </button>
            )}

            {/* Like button */}
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

            {/* Comment button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/project/${generateProjectSlug(owner, name)}#comments`;
              }}
              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <FaComment className="w-4 h-4" />
              <span>{comments}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 成功提示 */}
      {copied && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          已复制到剪贴板！
        </div>
      )}
    </Link>
  );
} 