'use client';

import React, { useState } from 'react';
import AccessibleProjectCard from '@/components/AccessibleProjectCard';
import AccessibleModal from '@/components/AccessibleModal';
import { ProcessedRepo } from '@/lib/github';

// 示例数据
const sampleProjects: ProcessedRepo[] = [
  {
    id: '1',
    name: 'MCP Database Server',
    fullName: 'example/mcp-database-server',
    owner: 'example',
    ownerAvatar: '',
    url: 'https://github.com/example/mcp-database-server',
    description: 'A comprehensive database management server for MCP with support for multiple database types.',
    language: 'TypeScript',
    stars: 150,
    forks: 25,
    topics: ['database', 'mcp', 'typescript', 'server'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    relevance: 'high',
    imageUrl: ''
  },
  {
    id: '2',
    name: 'Web Scraping Tools',
    fullName: 'example/web-scraping-tools',
    owner: 'example',
    ownerAvatar: '',
    url: 'https://github.com/example/web-scraping-tools',
    description: 'Advanced web scraping capabilities for MCP with built-in anti-detection features.',
    language: 'Python',
    stars: 89,
    forks: 12,
    topics: ['web-scraping', 'python', 'automation'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-14',
    relevance: 'medium',
    imageUrl: ''
  },
  {
    id: '3',
    name: 'File Management System',
    fullName: 'example/file-management-system',
    owner: 'example',
    ownerAvatar: '',
    url: 'https://github.com/example/file-management-system',
    description: 'Complete file management solution with cloud storage integration.',
    language: 'JavaScript',
    stars: 203,
    forks: 45,
    topics: ['file-management', 'cloud', 'javascript'],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-13',
    relevance: 'high',
    imageUrl: ''
  }
];

export default function AccessibilityDemo() {
  const [selectedProject, setSelectedProject] = useState<ProcessedRepo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookmark = (projectId: string) => {
    console.log('Bookmark project:', projectId);
    // 这里可以添加书签逻辑
  };

  const handleShare = (project: ProcessedRepo) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Accessibility Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This page demonstrates the accessible components implemented for MCPHubs. 
          Try navigating with keyboard (Tab key) and using screen readers.
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Accessibility Features Demonstrated:
          </h2>
          <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 space-y-1">
            <li>ARIA labels and roles for screen readers</li>
            <li>Keyboard navigation support</li>
            <li>Focus management and visual indicators</li>
            <li>High contrast color schemes</li>
            <li>Skip navigation links</li>
            <li>Semantic HTML structure</li>
          </ul>
        </div>
      </div>

      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Accessible Project Cards
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProjects.map((project) => (
            <AccessibleProjectCard
              key={project.id}
              project={project}
              onBookmark={handleBookmark}
              onShare={handleShare}
            />
          ))}
        </div>
      </section>

      <AccessibleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Share Project"
      >
        {selectedProject && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Share &quot;{selectedProject.name}&quot; with others:
            </p>
            
            <div className="space-y-3">
              <button
                className="btn-accessible w-full bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
              >
                Copy Link
              </button>
              
              <button
                className="btn-accessible w-full bg-green-600 text-white hover:bg-green-700"
                onClick={() => {
                  const text = `Check out this MCP project: ${selectedProject.name} - ${selectedProject.description}`;
                  navigator.clipboard.writeText(text);
                  alert('Text copied to clipboard!');
                }}
              >
                Copy Description
              </button>
            </div>
          </div>
        )}
      </AccessibleModal>
    </div>
  );
}
