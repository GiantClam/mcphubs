'use client';

import { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaStarHalfAlt,
  FaClock,
  FaUser,
  FaExternalLinkAlt,
  FaSyncAlt,
  FaSearch
} from 'react-icons/fa';

interface PendingSubmission {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  category: string;
  features: string[];
  compatibility: string[];
  install_command?: string;
  documentation_url?: string;
  submitter_email?: string;
  submitter_name?: string;
  submitted_at: string;
}

interface FeaturedProject {
  id: string;
  project_id: string;
  featured_at: string;
  featured_until: string;
  reason?: string;
  github_projects?: {
    id: string;
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    owner: string;
    url: string;
    image_url: string;
  };
}

export default function CurationDashboard() {
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'submissions' | 'featured'>('submissions');
  const [searchQuery, setFaSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCurationData();
  }, []);

  const fetchCurationData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/curation');
      const data = await response.json();
      
      if (data.success) {
        setPendingSubmissions(data.pendingSubmissions || []);
        setFeaturedProjects(data.featuredProjects || []);
      }
    } catch (error) {
      console.error('获取策展数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, id: string, reason?: string) => {
    setActionLoading(id);
    try {
      const response = await fetch('/api/admin/curation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action, 
          submissionId: action.includes('submission') ? id : undefined,
          projectId: action.includes('feature') ? id : undefined,
          reason 
        })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchCurationData(); // 刷新数据
      } else {
        alert(`操作失败: ${data.message}`);
      }
    } catch (error) {
      console.error('执行操作失败:', error);
      alert('操作失败');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSubmissions = pendingSubmissions.filter(submission =>
    submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeatured = featuredProjects.filter(project =>
    project.github_projects?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.github_projects?.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSyncAlt className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">加载中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 标签页切换 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('submissions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'submissions'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            待审核提交 ({pendingSubmissions.length})
          </button>
          <button
            onClick={() => setSelectedTab('featured')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'featured'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            推荐项目 ({featuredProjects.length})
          </button>
        </nav>
      </div>

      {/* 搜索栏 */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`搜索${selectedTab === 'submissions' ? '提交' : '推荐项目'}...`}
            value={searchQuery}
            onChange={(e) => setFaSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          onClick={fetchCurationData}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <FaSyncAlt className="w-4 h-4" />
          <span>刷新</span>
        </button>
      </div>

      {/* 待审核提交 */}
      {selectedTab === 'submissions' && (
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              暂无待审核的提交
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div key={submission.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {submission.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {submission.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <FaClock className="w-4 h-4" />
                        <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
                      </span>
                      {submission.submitter_name && (
                        <span className="flex items-center space-x-1">
                          <FaUser className="w-4 h-4" />
                          <span>{submission.submitter_name}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAction('approve', submission.id)}
                      disabled={actionLoading === submission.id}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <FaCheckCircle className="w-4 h-4" />
                      <span>批准</span>
                    </button>
                    <button
                      onClick={() => handleAction('reject', submission.id, '不符合要求')}
                      disabled={actionLoading === submission.id}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <FaTimesCircle className="w-4 h-4" />
                      <span>拒绝</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      服务器端点
                    </label>
                    <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {submission.endpoint}
                    </code>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      分类
                    </label>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {submission.category}
                    </span>
                  </div>
                </div>

                {submission.features.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      功能特性
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {submission.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {submission.compatibility.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      兼容性
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {submission.compatibility.map((comp, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(submission.install_command || submission.documentation_url) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {submission.install_command && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          安装命令
                        </label>
                        <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block">
                          {submission.install_command}
                        </code>
                      </div>
                    )}
                    {submission.documentation_url && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          文档链接
                        </label>
                        <a
                          href={submission.documentation_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                        >
                          <span>查看文档</span>
                          <FaExternalLinkAlt className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 推荐项目 */}
      {selectedTab === 'featured' && (
        <div className="space-y-4">
          {filteredFeatured.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              暂无推荐项目
            </div>
          ) : (
            filteredFeatured.map((featured) => (
              <div key={featured.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {featured.github_projects?.name || '未知项目'}
                      </h3>
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">
                        推荐中
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {featured.github_projects?.description || '无描述'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>推荐时间: {new Date(featured.featured_at).toLocaleDateString()}</span>
                      <span>推荐至: {new Date(featured.featured_until).toLocaleDateString()}</span>
                      {featured.reason && <span>原因: {featured.reason}</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAction('unfeature', featured.project_id)}
                      disabled={actionLoading === featured.project_id}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <FaStarHalfAlt className="w-4 h-4" />
                      <span>取消推荐</span>
                    </button>
                    {featured.github_projects?.url && (
                      <a
                        href={featured.github_projects.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                        <span>查看</span>
                      </a>
                    )}
                  </div>
                </div>

                {featured.github_projects && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">⭐ 星标</span>
                      <div className="font-medium">{featured.github_projects.stars}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">🍴 Fork</span>
                      <div className="font-medium">{featured.github_projects.forks}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">语言</span>
                      <div className="font-medium">{featured.github_projects.language || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">作者</span>
                      <div className="font-medium">{featured.github_projects.owner}</div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
