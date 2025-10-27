'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaRocket, FaBook, FaBolt } from 'react-icons/fa';
import SearchBar from './SearchBar';

interface HeroStats {
  totalProjects: number;
  totalStars: number;
  languages: number;
  lastUpdate: string;
}

export default function Hero() {
  const [stats, setStats] = useState<HeroStats>({
    totalProjects: 200,
    totalStars: 0,
    languages: 0,
    lastUpdate: 'Today'
  });

  useEffect(() => {
    // 获取实时统计数据
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      if (data.success && data.data) {
        const projects = data.data;
        const totalStars = projects.reduce((sum: number, project: any) => sum + (project.stars || 0), 0);
        const languages = new Set(projects.map((project: any) => project.language).filter(Boolean)).size;
        
        setStats({
          totalProjects: projects.length,
          totalStars,
          languages,
          lastUpdate: 'Today'
        });
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <section className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-20 overflow-hidden">
      {/* 动画背景 */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20"></div>
      
      {/* 装饰性几何图形 */}
      <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-20 w-16 h-16 border border-white/20 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/20 rounded-full animate-pulse delay-2000"></div>

      <div className="relative container mx-auto px-4 text-center">
        {/* 主标题 */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent leading-tight">
          Discover the <span className="highlight text-yellow-300">Future of AI Integration</span>
        </h1>
        
        {/* 副标题 */}
        <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-4xl mx-auto leading-relaxed">
          MCPHubs is your gateway to {stats.totalProjects}+ Model Context Protocol projects.
          <br />
          Search, compare, and integrate the best MCP servers and clients for your AI applications.
        </p>

        {/* 快速行动按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button 
            onClick={scrollToProjects}
            className="group px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaRocket className="inline mr-2 group-hover:animate-bounce" />
            Browse Projects
          </button>
          <Link
            href="/what-is-mcp"
            className="group px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
          >
            <FaBook className="inline mr-2 group-hover:animate-pulse" />
            Learn MCP Basics
          </Link>
          <Link
            href="/servers/tools"
            className="group px-8 py-4 border-2 border-purple-300 text-purple-100 rounded-lg font-semibold hover:bg-purple-300 hover:text-purple-600 transition-all duration-300"
          >
            <FaBolt className="inline mr-2 group-hover:animate-pulse" />
            Quick Setup Tool
          </Link>
        </div>

        {/* 实时统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="stat-item bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-3xl font-bold text-yellow-300 mb-1">{stats.totalProjects}+</div>
            <div className="text-purple-200 text-sm">MCP Projects</div>
          </div>
          <div className="stat-item bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-3xl font-bold text-green-300 mb-1">{stats.totalStars.toLocaleString()}</div>
            <div className="text-purple-200 text-sm">GitHub Stars</div>
          </div>
          <div className="stat-item bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-3xl font-bold text-blue-300 mb-1">{stats.languages}</div>
            <div className="text-purple-200 text-sm">Languages</div>
          </div>
          <div className="stat-item bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-3xl font-bold text-pink-300 mb-1">{stats.lastUpdate}</div>
            <div className="text-purple-200 text-sm">Last Update</div>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="hero-search max-w-2xl mx-auto">
          <SearchBar
            placeholder="Search 200+ MCP projects by name, description, or tag..."
            autoFocus={false}
            showSuggestions={true}
            className="mb-4"
          />
        </div>
      </div>

      {/* 动画 MCP 图表占位符 */}
      <div className="hero-visual absolute bottom-0 right-0 w-64 h-64 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-purple-600 rounded-full animate-pulse"></div>
      </div>
    </section>
  );
}
