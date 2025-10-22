'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CommunityServer {
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
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  approved_by?: string;
  rejected_by?: string;
}

export default function CommunityServersAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [servers, setServers] = useState<CommunityServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 检查管理员权限
  const isAdmin = session?.user?.email === 'liulanggoukk@gmail.com';

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/admin/curation');
      const data = await response.json();
      
      if (data.success) {
        setServers(data.pendingSubmissions || []);
      } else {
        console.error('获取服务器列表失败:', data.message);
      }
    } catch (error) {
      console.error('获取服务器列表时出错:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (serverId: string) => {
    setActionLoading(serverId);
    try {
      const response = await fetch('/api/admin/curation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          submissionId: serverId
        })
      });

      const data = await response.json();
      if (data.success) {
        await fetchServers(); // 重新获取列表
      } else {
        alert('批准失败: ' + data.message);
      }
    } catch (error) {
      console.error('批准服务器时出错:', error);
      alert('批准失败');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (serverId: string, reason: string) => {
    setActionLoading(serverId);
    try {
      const response = await fetch('/api/admin/curation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          submissionId: serverId,
          reason: reason
        })
      });

      const data = await response.json();
      if (data.success) {
        await fetchServers(); // 重新获取列表
      } else {
        alert('拒绝失败: ' + data.message);
      }
    } catch (error) {
      console.error('拒绝服务器时出错:', error);
      alert('拒绝失败');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    // 检查权限
    if (status === 'loading') return; // 等待认证状态
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/admin/community-servers');
      return;
    }
    
    if (!isAdmin) {
      router.push('/');
      return;
    }
    
    fetchServers();
  }, [session, status, isAdmin, router]);

  // 显示加载状态
  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  // 权限检查失败，显示错误信息
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">需要登录</h1>
          <p className="text-gray-600 dark:text-gray-300">请先登录以访问管理员页面</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">权限不足</h1>
          <p className="text-gray-600 dark:text-gray-300">您没有权限访问此页面</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          社区服务器审核
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          审核社区提交的MCP服务器，批准后将在servers页面展示。
        </p>
      </div>

      {servers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            暂无待审核的服务器提交
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {servers.map((server) => (
            <div key={server.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {server.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {server.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Endpoint
                      </label>
                      <code className="block px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                        {server.endpoint}
                      </code>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-sm rounded">
                        {server.category}
                      </span>
                    </div>
                  </div>

                  {server.features && server.features.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Features
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {server.features.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {server.install_command && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Install Command
                      </label>
                      <code className="block px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                        {server.install_command}
                      </code>
                    </div>
                  )}

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p>Submitter: {server.submitter_name || server.submitter_email || 'Anonymous'}</p>
                    <p>Submitted: {new Date(server.submitted_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleApprove(server.id)}
                  disabled={actionLoading === server.id}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {actionLoading === server.id ? 'Processing...' : 'Approve'}
                </button>
                
                <button
                  onClick={() => {
                    const reason = prompt('Please enter rejection reason:');
                    if (reason && reason.trim()) {
                      handleReject(server.id, reason.trim());
                    }
                  }}
                  disabled={actionLoading === server.id}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {actionLoading === server.id ? 'Processing...' : 'Reject'}
                </button>

                {server.documentation_url && (
                  <a
                    href={server.documentation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    View Docs
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
