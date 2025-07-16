'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { FaSearch, FaFilter, FaSort, FaGithub, FaPlus, FaSpinner } from 'react-icons/fa';
import type { ProcessedRepo } from "@/lib/github";

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ProcessedRepo[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProcessedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedRelevance, setSelectedRelevance] = useState('all');
  const [sortBy, setSortBy] = useState('stars');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, searchTerm, selectedLanguage, selectedRelevance, sortBy, sortOrder]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      // 使用新的projects API，优先从数据库获取
      const response = await fetch('/api/projects?strategy=database-first&cached=true');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const result = await response.json();
      
      if (result.success) {
        console.log(`📦 加载项目成功: ${result.data.length} 个项目 (来源: ${result.meta.source}, 缓存: ${result.meta.cached})`);
        setProjects(result.data);
        
        // 显示数据来源信息给用户（可选）
        if (result.meta.source === 'github') {
          console.log('📡 数据来源: GitHub API (实时)');
        } else if (result.meta.cached) {
          console.log('💾 数据来源: 缓存 (快速加载)');
        } else {
          console.log('🗄️ 数据来源: 数据库 (最新同步)');
        }
      } else {
        throw new Error(result.error || 'Failed to load projects');
      }
    } catch (error: any) {
      console.error('Error loading projects:', error);
      // 显示用户友好的错误信息
      alert('加载项目失败，请刷新页面重试。如果问题持续存在，请联系管理员。');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProjects = () => {
    let filtered = [...projects];

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 语言过滤
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(project => project.language === selectedLanguage);
    }

    // 相关性过滤
    if (selectedRelevance !== 'all') {
      filtered = filtered.filter(project => project.relevance === selectedRelevance);
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case 'stars':
          aValue = a.stars;
          bValue = b.stars;
          break;
        case 'forks':
          aValue = a.forks;
          bValue = b.forks;
          break;
        case 'updated':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'aiScore':
          aValue = (a as any).aiScore || 0;
          bValue = (b as any).aiScore || 0;
          break;
        case 'likes':
          aValue = (a as any).likes || 0;
          bValue = (b as any).likes || 0;
          break;
        default:
          aValue = a.stars;
          bValue = b.stars;
      }

      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const getUniqueLanguages = () => {
    const languages = projects.map(p => p.language).filter(Boolean);
    return [...new Set(languages)].sort();
  };

  const getUniqueRelevances = () => {
    const relevances = projects.map(p => p.relevance).filter(Boolean);
    return [...new Set(relevances)].sort();
  };

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            MCP 项目展示
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            发现和探索最新的 Model Context Protocol 项目，找到您需要的工具和灵感
          </p>
        </div>

        {/* 搜索和筛选栏 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-grow relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索项目名称、描述或作者..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* 筛选器 */}
            <div className="flex flex-wrap gap-4">
              {/* 语言筛选 */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">所有语言</option>
                {getUniqueLanguages().map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>

              {/* 相关性筛选 */}
              <select
                value={selectedRelevance}
                onChange={(e) => setSelectedRelevance(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">所有相关性</option>
                {getUniqueRelevances().map(rel => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>

              {/* 排序选择 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="stars">按星标排序</option>
                <option value="forks">按Fork数排序</option>
                <option value="updated">按更新时间排序</option>
                <option value="aiScore">按AI评分排序</option>
                <option value="likes">按点赞数排序</option>
              </select>

              {/* 排序顺序 */}
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <FaSort className="inline mr-2" />
                {sortOrder === 'desc' ? '降序' : '升序'}
              </button>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600 dark:text-gray-300">
            共找到 <span className="font-semibold text-purple-600 dark:text-purple-400">{filteredProjects.length}</span> 个项目
          </div>
          
          <div className="flex items-center space-x-4">
            {session && (
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
                <FaPlus className="w-4 h-4" />
                提交项目
              </button>
            )}
            
            <a
              href="https://github.com/search?q=model+context+protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <FaGithub className="w-4 h-4" />
              GitHub 搜索
            </a>
          </div>
        </div>

        {/* 项目列表 */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">加载项目中...</span>
          </div>
        ) : paginatedProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
              没有找到符合条件的项目
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedLanguage('all');
                setSelectedRelevance('all');
              }}
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              清除所有筛选条件
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  description={project.description}
                  stars={project.stars}
                  forks={project.forks}
                  language={project.language}
                  owner={project.owner}
                  relevance={project.relevance}
                  imageUrl={project.imageUrl}
                  topics={(project as any).topics}
                  updatedAt={project.updatedAt}
                  aiScore={(project as any).aiScore}
                  likes={(project as any).likes}
                  comments={(project as any).comments}
                  githubUrl={(project as any).githubUrl}
                  isLiked={(project as any).isLiked}
                  userLoggedIn={!!session}
                />
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-purple-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 