'use client';

import React, { useState, useMemo } from 'react';
import { FaCheck, FaTimes, FaPlus, FaGithub, FaStar, FaCodeBranch, FaCode, FaUsers, FaChartBar } from 'react-icons/fa';
import { ProcessedRepo } from '@/lib/github';
import Image from 'next/image';

interface ComparisonToolProps {
  projects: ProcessedRepo[];
}

interface ComparisonMetric {
  key: string;
  label: string;
  type: 'number' | 'text' | 'date' | 'relevance' | 'boolean';
  getValue: (project: ProcessedRepo) => any;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ projects }) => {
  const [selectedProjects, setSelectedProjects] = useState<ProcessedRepo[]>([]);
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  // 定义对比指标
  const comparisonMetrics: ComparisonMetric[] = [
    {
      key: 'stars',
      label: '社区关注度 (Stars)',
      type: 'number',
      getValue: (project) => project.stars
    },
    {
      key: 'forks',
      label: '开发参与度 (Forks)',
      type: 'number',
      getValue: (project) => project.forks
    },
    {
      key: 'language',
      label: '主要编程语言',
      type: 'text',
      getValue: (project) => project.language
    },
    {
      key: 'relevance',
      label: 'MCP相关性',
      type: 'relevance',
      getValue: (project) => project.relevance
    },
    {
      key: 'updatedAt',
      label: '最后更新时间',
      type: 'date',
      getValue: (project) => new Date(project.updatedAt)
    },
    {
      key: 'owner',
      label: '项目维护者',
      type: 'text',
      getValue: (project) => project.owner
    }
  ];

  // 添加项目到对比列表
  const addProject = (project: ProcessedRepo) => {
    if (selectedProjects.length < 4 && !selectedProjects.find(p => p.id === project.id)) {
      setSelectedProjects([...selectedProjects, project]);
    }
    setShowProjectSelector(false);
  };

  // 移除项目从对比列表
  const removeProject = (projectId: string) => {
    setSelectedProjects(selectedProjects.filter(p => p.id !== projectId));
  };

  // 可选择的项目（排除已选择的）
  const availableProjects = useMemo(() => {
    return projects.filter(project => !selectedProjects.find(p => p.id === project.id));
  }, [projects, selectedProjects]);

  // 格式化值显示
  const formatValue = (value: any, type: string) => {
    switch (type) {
      case 'number':
        return value.toLocaleString();
      case 'date':
        return value.toLocaleDateString('zh-CN');
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

  // 获取指标的最佳值（用于高亮显示）
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

  // 判断是否为最佳值
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

  // 生成专家建议
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
              <strong>{highStarsProject.name}</strong> 拥有最高的社区关注度（{highStarsProject.stars} stars），
              适合需要稳定、经过验证的解决方案的项目。
            </span>
          </div>
          
          <div className="flex items-start">
            <FaCode className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>{mostRecentProject.name}</strong> 是最近更新的项目，
              可能包含最新的功能和修复，适合需要前沿技术的应用。
            </span>
          </div>
          
          {highRelevanceProjects.length > 0 && (
            <div className="flex items-start">
              <FaChartBar className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                {highRelevanceProjects.map(p => p.name).join('、')} 与MCP的相关性最高，
                是专注于MCP生态系统的首选项目。
              </span>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border">
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              💡 建议根据您的具体需求权衡社区支持、技术先进性和MCP兼容性。
              对于生产环境，优先考虑高星级项目；对于实验性项目，可以选择更新更频繁的项目。
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 项目选择器 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            选择要对比的项目 ({selectedProjects.length}/4)
          </h2>
          <button
            onClick={() => setShowProjectSelector(!showProjectSelector)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            disabled={selectedProjects.length >= 4}
          >
            <FaPlus className="mr-2" />
            添加项目
          </button>
        </div>

        {/* 已选择的项目 */}
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

        {/* 项目选择下拉 */}
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

      {/* 对比表格 */}
      {selectedProjects.length >= 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              详细对比分析
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    对比项目
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
                    GitHub链接
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
                        查看项目
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 专家建议 */}
      {selectedProjects.length >= 2 && generateExpertRecommendation()}
    </div>
  );
};

export default ComparisonTool; 