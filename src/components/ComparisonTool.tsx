'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { FaCheck, FaTimes, FaPlus, FaGithub, FaStar, FaCodeBranch, FaCode, FaChartBar } from 'react-icons/fa';
import { ProcessedRepo } from '@/lib/github';
import { searchMCPProjects } from '@/lib/github';
import Image from 'next/image';

interface ComparisonToolProps {
  projects?: ProcessedRepo[];
}

interface ComparisonMetric {
  key: string;
  label: string;
  type: 'number' | 'text' | 'date' | 'relevance' | 'boolean';
  getValue: (project: ProcessedRepo) => any;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ projects: initialProjects }) => {
  const [projects, setProjects] = useState<ProcessedRepo[]>(initialProjects || []);
  const [selectedProjects, setSelectedProjects] = useState<ProcessedRepo[]>([]);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [loading, setLoading] = useState(!initialProjects);

  // Load projects if not provided
  useEffect(() => {
    if (!initialProjects) {
      const loadProjects = async () => {
        try {
          setLoading(true);
          const fetchedProjects = await searchMCPProjects();
          setProjects(fetchedProjects);
        } catch (error) {
          console.error('Failed to load projects:', error);
        } finally {
          setLoading(false);
        }
      };
      loadProjects();
    }
  }, [initialProjects]);

  // Define comparison metrics
  const comparisonMetrics: ComparisonMetric[] = [
    {
      key: 'stars',
      label: 'Community Attention (Stars)',
      type: 'number',
      getValue: (project) => project.stars
    },
    {
      key: 'forks',
      label: 'Development Participation (Forks)',
      type: 'number',
      getValue: (project) => project.forks
    },
    {
      key: 'language',
      label: 'Primary Programming Language',
      type: 'text',
      getValue: (project) => project.language
    },
    {
      key: 'relevance',
      label: 'MCP Relevance',
      type: 'relevance',
      getValue: (project) => project.relevance
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      type: 'date',
      getValue: (project) => new Date(project.updatedAt)
    },
    {
      key: 'owner',
      label: 'Project Maintainer',
      type: 'text',
      getValue: (project) => project.owner
    }
  ];

  // Add project to comparison list
  const addProject = (project: ProcessedRepo) => {
    if (selectedProjects.length < 4 && !selectedProjects.find(p => p.id === project.id)) {
      setSelectedProjects([...selectedProjects, project]);
    }
    setShowProjectSelector(false);
  };

  // Remove project from comparison list
  const removeProject = (projectId: string) => {
    setSelectedProjects(selectedProjects.filter(p => p.id !== projectId));
  };

  // Available projects (excluding selected ones)
  const availableProjects = useMemo(() => {
    return projects.filter(project => !selectedProjects.find(p => p.id === project.id));
  }, [projects, selectedProjects]);

  // Format value display
  const formatValue = (value: any, type: string) => {
    switch (type) {
      case 'number':
        return value.toLocaleString();
      case 'date':
        return value.toLocaleDateString('en-US');
      case 'relevance':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'High' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : value === 'Medium'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {value}
          </span>
        );
      case 'boolean':
        return value ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />;
      default:
        return value;
    }
  };

  // Get best value for metric (for highlighting)
  const getBestValue = (metric: ComparisonMetric) => {
    if (selectedProjects.length === 0) return null;
    
    const values = selectedProjects.map(project => metric.getValue(project));
    
    switch (metric.type) {
      case 'number':
        return Math.max(...values);
      case 'date':
        return Math.max(...values.map(v => v.getTime()));
      case 'relevance':
        const relevanceOrder = { 'High': 3, 'Medium': 2, 'Related': 1 };
        const maxRelevance = Math.max(...values.map(v => relevanceOrder[v as keyof typeof relevanceOrder] || 0));
        return Object.keys(relevanceOrder).find(key => relevanceOrder[key as keyof typeof relevanceOrder] === maxRelevance);
      default:
        return null;
    }
  };

  // Check if it's the best value
  const isBestValue = (project: ProcessedRepo, metric: ComparisonMetric) => {
    const bestValue = getBestValue(metric);
    if (bestValue === null) return false;
    
    const projectValue = metric.getValue(project);
    
    switch (metric.type) {
      case 'number':
        return projectValue === bestValue;
      case 'date':
        return projectValue.getTime() === bestValue;
      case 'relevance':
        return projectValue === bestValue;
      default:
        return false;
    }
  };

  // Generate expert recommendations
  const generateExpertRecommendation = () => {
    if (selectedProjects.length < 2) return null;

    const highStarsProject = selectedProjects.reduce((prev, current) => 
      prev.stars > current.stars ? prev : current
    );
    
    const mostRecentProject = selectedProjects.reduce((prev, current) => 
      new Date(prev.updatedAt) > new Date(current.updatedAt) ? prev : current
    );

    const highRelevanceProjects = selectedProjects.filter(p => p.relevance === 'High');

    return (
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-300">
          Expert Recommendation
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <FaStar className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>{highStarsProject.name}</strong> has the highest community attention ({highStarsProject.stars} stars),
              suitable for projects requiring stable, proven solutions.
            </span>
          </div>
          
          <div className="flex items-start">
            <FaCode className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>{mostRecentProject.name}</strong> is the most recently updated project,
              may contain the latest features and fixes, suitable for applications requiring cutting-edge technology.
            </span>
          </div>
          
          {highRelevanceProjects.length > 0 && (
            <div className="flex items-start">
              <FaChartBar className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                {highRelevanceProjects.map(p => p.name).join(', ')} have the highest relevance to MCP,
                making them preferred projects focused on the MCP ecosystem.
              </span>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border">
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              💡 We recommend weighing community support, technological advancement, and MCP compatibility based on your specific needs.
              For production environments, prioritize high-star projects; for experimental projects, consider more frequently updated ones.
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Select Projects to Compare ({selectedProjects.length}/4)
          </h2>
          <button
            onClick={() => setShowProjectSelector(!showProjectSelector)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            disabled={selectedProjects.length >= 4}
          >
            <FaPlus className="mr-2" />
            Add Project
          </button>
        </div>

        {/* Selected projects */}
        {selectedProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {selectedProjects.map(project => (
              <div key={project.id} className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <button
                  onClick={() => removeProject(project.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
                <div className="flex items-center mb-2">
                  <Image
                    src={project.imageUrl}
                    alt={project.name}
                    width={32}
                    height={32}
                    className="rounded mr-2"
                  />
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {project.name}
                  </h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Project selection dropdown */}
        {showProjectSelector && (
          <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            {availableProjects.map(project => (
              <button
                key={project.id}
                onClick={() => addProject(project)}
                className="w-full flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0"
              >
                <Image
                  src={project.imageUrl}
                  alt={project.name}
                  width={40}
                  height={40}
                  className="rounded mr-3"
                />
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="flex items-center">
                    <FaStar className="mr-1" />
                    {project.stars}
                  </span>
                  <span className="flex items-center">
                    <FaCodeBranch className="mr-1" />
                    {project.forks}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comparison table */}
      {selectedProjects.length >= 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Detailed Comparison Analysis
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Comparison Items
                  </th>
                  {selectedProjects.map(project => (
                    <th key={project.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Image
                          src={project.imageUrl}
                          alt={project.name}
                          width={24}
                          height={24}
                          className="rounded mr-2"
                        />
                        <span className="truncate">{project.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {comparisonMetrics.map(metric => (
                  <tr key={metric.key}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {metric.label}
                    </td>
                    {selectedProjects.map(project => {
                      const value = metric.getValue(project);
                      const isBest = isBestValue(project, metric);
                      
                      return (
                        <td key={project.id} className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isBest 
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300 font-semibold' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {formatValue(value, metric.type)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    GitHub Link
                  </td>
                  {selectedProjects.map(project => (
                    <td key={project.id} className="px-6 py-4 whitespace-nowrap text-sm">
                      <a 
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        <FaGithub className="mr-1" />
                        View Project
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expert recommendations */}
      {selectedProjects.length >= 2 && generateExpertRecommendation()}
    </div>
  );
};

export default ComparisonTool; 