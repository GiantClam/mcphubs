'use client';

import { useEffect, useState } from 'react';
import ProjectCardWrapper from './ProjectCardWrapper';
import { ProcessedRepo } from '@/lib/github';
import Link from 'next/link';

interface ProjectShowcaseProps {
  initialProjects: ProcessedRepo[];
}

export default function ProjectShowcase({ initialProjects }: ProjectShowcaseProps) {
  const [projects, setProjects] = useState<ProcessedRepo[]>(initialProjects);

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
        
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              加载项目中或未找到项目。请稍后再试。
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