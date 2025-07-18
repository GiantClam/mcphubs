'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  FaSync, FaDatabase, FaGithub, FaPlay, FaStop, FaClock, 
  FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaChartBar, FaChartLine, FaCog
} from 'react-icons/fa';

interface SyncResult {
  success: boolean;
  message: string;
  stats: {
    totalFetched: number;
    inserted: number;
    updated: number;
    skipped: number;
    errors: number;
  };
  duration: number;
  timestamp: string;
}

interface SyncStatus {
  isRunning: boolean;
  lastSync: SyncResult | null;
  nextScheduledSync: string | null;
}

export default function SyncAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  // 检查权限
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // 简单的权限检查 - 可以根据需要扩展
    if (!session.user?.email?.includes('admin') && !session.user?.email?.includes('owner')) {
      alert('无权限访问此页面');
      router.push('/');
      return;
    }

    loadSyncStatus();
  }, [session, status, router]);

  const loadSyncStatus = async () => {
    try {
      if (!apiKey.trim()) {
        addLog('❌ 请先输入API密钥');
        return;
      }
      
      const response = await fetch(`/api/sync?key=${apiKey}`);
      
      if (response.ok) {
        const result = await response.json();
        setSyncStatus(result.data);
        addLog(`✅ 成功获取同步状态`);
      } else {
        addLog(`❌ 获取同步状态失败: ${response.status}`);
      }
    } catch (error: any) {
      addLog(`❌ 获取同步状态出错: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerSync = async (force: boolean = false) => {
    if (syncing) return;
    
    if (!apiKey.trim()) {
      addLog('❌ 请先输入API密钥');
      return;
    }
    
    setSyncing(true);
    addLog(`🚀 ${force ? '强制' : ''}启动同步任务...`);

    try {
      const response = await fetch(`/api/sync?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          force,
          source: 'manual',
          skipTimeWindow: true
        })
      });

      const result = await response.json();
      
      if (result.success) {
        addLog(`✅ 同步任务完成: ${result.message}`);
        if (result.data?.result) {
          const stats = result.data.result.stats;
          addLog(`📊 统计: 获取${stats.totalFetched} 新增${stats.inserted} 更新${stats.updated} 跳过${stats.skipped}`);
        }
      } else {
        addLog(`❌ 同步任务失败: ${result.message || result.error}`);
      }

      // 重新加载状态
      await loadSyncStatus();
      
    } catch (error: any) {
      addLog(`❌ 同步任务出错: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]); // 保留最近50条日志
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    });
  };

  const getStatusIcon = (success: boolean | undefined, isRunning: boolean) => {
    if (isRunning) return <FaSync className="animate-spin text-blue-500" />;
    if (success === true) return <FaCheckCircle className="text-green-500" />;
    if (success === false) return <FaExclamationTriangle className="text-red-500" />;
    return <FaInfoCircle className="text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaSync className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">加载同步状态...</p>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || !session.user?.email?.includes('admin')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">访问被拒绝</h1>
          <p className="text-gray-600">您没有权限访问此页面。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            同步任务管理
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            管理GitHub项目数据同步，查看状态和手动触发同步任务
          </p>
        </div>

        {/* API密钥输入 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            API配置
          </h2>
          <div className="flex gap-4">
            <input
              type="password"
              placeholder="同步API密钥 (留空使用默认)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={loadSyncStatus}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FaSync className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 当前状态 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">同步状态</h3>
              {getStatusIcon(syncStatus?.lastSync?.success, syncStatus?.isRunning || syncing)}
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {syncStatus?.isRunning || syncing ? '运行中' : 
               syncStatus?.lastSync?.success === true ? '正常' :
               syncStatus?.lastSync?.success === false ? '失败' : '未知'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">上次同步</h3>
              <FaClock className="text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {syncStatus?.lastSync ? formatDate(syncStatus.lastSync.timestamp) : '从未同步'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">下次定时</h3>
              <FaClock className="text-blue-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {syncStatus?.nextScheduledSync ? formatDate(syncStatus.nextScheduledSync) : '未设置'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">处理项目</h3>
              <FaChartBar className="text-green-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {syncStatus?.lastSync?.stats?.totalFetched || 0} 个
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            操作控制
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => triggerSync(false)}
              disabled={syncing || syncStatus?.isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
            >
              <FaPlay className="w-4 h-4" />
              启动同步
            </button>
            
            <button
              onClick={() => triggerSync(true)}
              disabled={syncing || syncStatus?.isRunning}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
            >
              <FaSync className="w-4 h-4" />
              强制同步
            </button>

            <button
              onClick={loadSyncStatus}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
            >
              <FaDatabase className="w-4 h-4" />
              刷新状态
            </button>

            <a
              href="https://github.com/search?q=model+context+protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <FaGithub className="w-4 h-4" />
              GitHub搜索
            </a>
          </div>
        </div>

        {/* 上次同步详情 */}
        {syncStatus?.lastSync && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              上次同步详情
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{syncStatus.lastSync.stats.totalFetched}</div>
                <div className="text-sm text-gray-500">总获取</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{syncStatus.lastSync.stats.inserted}</div>
                <div className="text-sm text-gray-500">新增</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{syncStatus.lastSync.stats.updated}</div>
                <div className="text-sm text-gray-500">更新</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{syncStatus.lastSync.stats.skipped}</div>
                <div className="text-sm text-gray-500">跳过</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{syncStatus.lastSync.stats.errors}</div>
                <div className="text-sm text-gray-500">错误</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>消息:</strong> {syncStatus.lastSync.message}</p>
              <p><strong>耗时:</strong> {syncStatus.lastSync.duration}ms</p>
              <p><strong>时间:</strong> {formatDate(syncStatus.lastSync.timestamp)}</p>
            </div>
          </div>
        )}

        {/* 实时日志 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              操作日志
            </h2>
            <button
              onClick={() => setLogs([])}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              清除日志
            </button>
          </div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            ) : (
              <div className="text-gray-500">暂无日志...</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
} 