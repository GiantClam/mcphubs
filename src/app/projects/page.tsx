'use client';

import { Suspense } from 'react';
import ProjectShowcase from '@/components/ProjectShowcase';

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            MCP Projects Showcase
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore the latest Model Context Protocol projects and tools
          </p>
        </div>
        <ProjectShowcase initialProjects={[]} />
      </div>
    </Suspense>
  );
} 