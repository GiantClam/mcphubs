'use client';

import { useState, useEffect } from 'react';
import { DataQualityReport } from '@/lib/data-cleaner';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimesCircle, 
  FaSyncAlt, 
  FaUpload,
  FaChartBar,
  FaChartLine,
  FaFilter,
  FaSearch
} from 'react-icons/fa';

interface DataQualityDashboardProps {
  initialReport?: DataQualityReport;
  totalProjects?: number;
}

export default function DataQualityDashboard({ 
  initialReport, 
  totalProjects: initialTotalProjects 
}: DataQualityDashboardProps) {
  const [report, setReport] = useState<DataQualityReport | null>(initialReport || null);
  const [, setTotalProjects] = useState(initialTotalProjects || 0);
  const [loading, setLoading] = useState(!initialReport);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setFaSearchQuery] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  // Load initial data if not provided
  useEffect(() => {
    if (!initialReport) {
      const loadData = async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/ai/process-projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'validate_data' })
          });
          
          const data = await response.json();
          if (data.success) {
            setReport(data.validation);
            setTotalProjects(data.totalProjects || 0);
          }
        } catch (error) {
          console.error('加载数据质量报告失败:', error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [initialReport]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/process-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate_data' })
      });
      
      const data = await response.json();
      if (data.success) {
        setReport(data.validation);
      }
    } catch (error) {
      console.error('刷新数据质量报告失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessAll = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/process-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'process_all', forceReanalysis: true })
      });
      
      const data = await response.json();
      if (data.success) {
        // 刷新页面以显示更新后的数据
        window.location.reload();
      }
    } catch (error) {
      console.error('处理所有项目失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = report?.issues.filter(issue => {
    const matchesSeverity = selectedSeverity === 'all' || issue.severity === selectedSeverity;
    const matchesFaSearch = searchQuery === '' || 
      issue.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesFaSearch;
  }) || [];

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getQualityBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <FaTimesCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <FaExclamationTriangle className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <FaCheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading || !report) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">数据质量分数</p>
              <p className={`text-2xl font-bold ${getQualityColor(report.qualityScore)}`}>
                {report.qualityScore}
              </p>
            </div>
            <div className={`p-3 rounded-full ${getQualityBgColor(report.qualityScore)}`}>
              <FaChartBar className={`w-6 h-6 ${getQualityColor(report.qualityScore)}`} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">总项目数</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {report.totalProjects}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <FaChartLine className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">数据问题</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {report.issues.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
              <FaExclamationTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">完整项目</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {report.totalProjects - report.issues.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <FaCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 数据完整性统计 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          数据完整性统计
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(report.statistics).map(([key, value]) => {
            const percentage = Math.round((value / report.totalProjects) * 100);
            const displayName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            
            return (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {displayName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {value}/{report.totalProjects}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
        >
          <FaSyncAlt className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>刷新报告</span>
        </button>
        
        <button
          onClick={handleProcessAll}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
        >
          <FaUpload className="w-4 h-4" />
          <span>AI处理所有项目</span>
        </button>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <FaFilter className="w-4 h-4" />
          <span>{showDetails ? '隐藏详情' : '显示详情'}</span>
        </button>
      </div>

      {/* 改进建议 */}
      {report.recommendations.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
            💡 改进建议
          </h3>
          <ul className="space-y-2">
            {report.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-2 text-yellow-700 dark:text-yellow-300">
                <span className="text-yellow-500 mt-1">•</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 详细问题列表 */}
      {showDetails && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                数据问题详情
              </h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="搜索问题..."
                    value={searchQuery}
                    onChange={(e) => setFaSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">所有严重程度</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredIssues.map((issue, index) => (
              <div key={index} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getSeverityIcon(issue.severity)}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {issue.projectName}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {issue.description}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">字段:</span> {issue.field} | 
                      <span className="font-medium ml-2">类型:</span> {issue.issueType}
                    </div>
                    {issue.suggestedFix && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-medium">建议修复:</span> {issue.suggestedFix}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredIssues.length === 0 && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              没有找到匹配的问题
            </div>
          )}
        </div>
      )}
    </div>
  );
}
