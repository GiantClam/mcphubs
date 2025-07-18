'use client';

import { useEffect, useState } from 'react';
import ProjectCardWrapper from './ProjectCardWrapper';
import { ProcessedRepo } from '@/lib/github';
import Link from 'next/link';

interface ProjectShowcaseProps {
  initialProjects?: ProcessedRepo[]; // 改为可选参数
}

export default function ProjectShowcase({ initialProjects = [] }: ProjectShowcaseProps) {
  const [projects, setProjects] = useState<ProcessedRepo[]>(initialProjects);
  const [loading, setLoading] = useState(false);

  // 如果没有初始项目数据，则从API获取
  useEffect(() => {
    if (initialProjects.length === 0) {
      setLoading(true);
      fetch('/api/projects')
        .then(response => response.json())
        .then(data => {
          if (data.projects && Array.isArray(data.projects)) {
            setProjects(data.projects);
          }
        })
        .catch(error => {
          console.error('获取项目数据失败:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [initialProjects.length]);

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            热门 MCP 项目
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              显示 {projects.length} 个项目
            </div>
            <Link 
              href="/projects"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              查看全部
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              正在加载项目数据...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              暂无项目数据。请稍后再试。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <ProjectCardWrapper
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
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 