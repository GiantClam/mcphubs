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
      alert('No permission to access this page');
      router.push('/');
      return;
    }

    loadSyncStatus();
  }, [session, status, router]);

  const loadSyncStatus = async () => {
    try {
      if (!apiKey.trim()) {
        addLog('❌ Please enter API key first');
        return;
      }
      
      const response = await fetch(`/api/sync?key=${apiKey}`);
      
      if (response.ok) {
        const result = await response.json();
        setSyncStatus(result.data);
        addLog(`✅ Successfully retrieved sync status`);
      } else {
        addLog(`❌ Failed to get sync status: ${response.status}`);
      }
    } catch (error: any) {
      addLog(`❌ Error getting sync status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerSync = async (force: boolean = false) => {
    if (syncing) return;
    
    if (!apiKey.trim()) {
      addLog('❌ Please enter API key first');
      return;
    }
    
    setSyncing(true);
    addLog(`🚀 ${force ? 'Force ' : ''}Starting sync task...`);

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
        addLog(`✅ Sync task completed: ${result.message}`);
        if (result.data?.result) {
          const stats = result.data.result.stats;
          addLog(`📊 Stats: Fetched ${stats.totalFetched} Added ${stats.inserted} Updated ${stats.updated} Skipped ${stats.skipped}`);
        }
      } else {
        addLog(`❌ Sync task failed: ${result.message || result.error}`);
      }

      // Reload status
      await loadSyncStatus();
      
    } catch (error: any) {
      addLog(`❌ Sync task error: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      timeZone: 'America/New_York'
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
          <p className="text-gray-600 dark:text-gray-300">Loading sync status...</p>
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
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sync Task Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage GitHub project data synchronization, view status and manually trigger sync tasks
          </p>
        </div>

        {/* API密钥输入 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            API Configuration
          </h2>
          <div className="flex gap-4">
            <input
              type="password"
              placeholder="Sync API Key (leave empty to use default)"
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
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sync Status</h3>
              {getStatusIcon(syncStatus?.lastSync?.success, syncStatus?.isRunning || syncing)}
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {syncStatus?.isRunning || syncing ? 'Running' : 
               syncStatus?.lastSync?.success === true ? 'Normal' :
               syncStatus?.lastSync?.success === false ? 'Failed' : 'Unknown'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Sync</h3>
              <FaClock className="text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {syncStatus?.lastSync ? formatDate(syncStatus.lastSync.timestamp) : 'Never synced'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Scheduled</h3>
              <FaClock className="text-blue-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {syncStatus?.nextScheduledSync ? formatDate(syncStatus.nextScheduledSync) : 'Not set'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Processed Projects</h3>
              <FaChartBar className="text-green-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {syncStatus?.lastSync?.stats?.totalFetched || 0} items
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Operation Control
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => triggerSync(false)}
              disabled={syncing || syncStatus?.isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
            >
              <FaPlay className="w-4 h-4" />
              Start Sync
            </button>
            
            <button
              onClick={() => triggerSync(true)}
              disabled={syncing || syncStatus?.isRunning}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
            >
              <FaSync className="w-4 h-4" />
              Force Sync
            </button>

            <button
              onClick={loadSyncStatus}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
            >
              <FaDatabase className="w-4 h-4" />
              Refresh Status
            </button>

            <a
              href="https://github.com/search?q=model+context+protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <FaGithub className="w-4 h-4" />
              GitHub Search
            </a>
          </div>
        </div>

        {/* 上次同步详情 */}
        {syncStatus?.lastSync && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Last Sync Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{syncStatus.lastSync.stats.totalFetched}</div>
                <div className="text-sm text-gray-500">Total Fetched</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{syncStatus.lastSync.stats.inserted}</div>
                <div className="text-sm text-gray-500">Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{syncStatus.lastSync.stats.updated}</div>
                <div className="text-sm text-gray-500">Updated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{syncStatus.lastSync.stats.skipped}</div>
                <div className="text-sm text-gray-500">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{syncStatus.lastSync.stats.errors}</div>
                <div className="text-sm text-gray-500">Errors</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Message:</strong> {syncStatus.lastSync.message}</p>
              <p><strong>Duration:</strong> {syncStatus.lastSync.duration}ms</p>
              <p><strong>Time:</strong> {formatDate(syncStatus.lastSync.timestamp)}</p>
            </div>
          </div>
        )}

        {/* 实时日志 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Operation Logs
            </h2>
            <button
              onClick={() => setLogs([])}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear Logs
            </button>
          </div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            ) : (
              <div className="text-gray-500">No logs yet...</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
} 