'use client';

import { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';
import { ProcessedRepo } from '@/lib/github';

interface ProjectCarouselProps {
  projects: ProcessedRepo[];
  title?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export default function ProjectCarousel({ 
  projects, 
  title = "Featured Projects",
  autoPlay = true,
  autoPlayInterval = 5000,
  className = ""
}: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 自动播放逻辑
  useEffect(() => {
    if (isPlaying && projects.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === projects.length - 1 ? 0 : prevIndex + 1
        );
      }, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, projects.length, autoPlayInterval]);

  // 滚动到指定项目
  const scrollToProject = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0]?.clientWidth || 0;
      const gap = 24; // gap-6 = 24px
      const scrollPosition = index * (cardWidth + gap);
      
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  };

  // 触摸/鼠标事件处理
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setIsPlaying(false); // 暂停自动播放
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    
    if (carouselRef.current) {
      setScrollLeft(carouselRef.current.scrollLeft);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - startX;
    
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - x;
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    // 恢复自动播放
    setTimeout(() => setIsPlaying(true), 2000);
  };

  // 导航按钮
  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    scrollToProject(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    scrollToProject(newIndex);
  };

  // 暂停/播放切换
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`project-carousel-container ${className}`}>
      {/* 标题和控制栏 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        
        <div className="flex items-center space-x-4">
          {/* 播放/暂停按钮 */}
          <button
            onClick={togglePlayPause}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <FaPause className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <FaPlay className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* 导航按钮 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              disabled={projects.length <= 1}
              aria-label="Previous project"
            >
              <FaChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              disabled={projects.length <= 1}
              aria-label="Next project"
            >
              <FaChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 轮播容器 */}
      <div
        ref={carouselRef}
        className="project-card-carousel flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="project-card flex-shrink-0 w-80 scroll-snap-align-start"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {/* 指示器 */}
      {projects.length > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToProject(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-purple-600'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 项目卡片组件
function ProjectCard({ project }: { project: ProcessedRepo }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* 项目信息 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {project.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* 项目统计 */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-500">⭐</span>
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {project.stars?.toLocaleString() || '0'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">👤</span>
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {project.owner}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-blue-500">💻</span>
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {project.language || 'N/A'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-green-500">📅</span>
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>

      {/* 技术栈标签 */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {project.techStack.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <a
          href={`/project/${project.id}`}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-medium transition-colors"
        >
          View Details
        </a>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm transition-colors"
        >
          GitHub →
        </a>
      </div>
    </div>
  );
}
