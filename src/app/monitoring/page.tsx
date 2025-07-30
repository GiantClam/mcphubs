'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaServer, FaDatabase, FaGithub, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaSpinner, FaClock, FaBug, FaTools, FaChartLine, FaMemory, FaHdd } from 'react-icons/fa';

interface SystemStatus {
  service: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  lastCheck: string;
  responseTime: number;
  uptime: number;
  errors: number;
}

interface PerformanceMetric {
  timestamp: string;
  cpu: number;
  memory: number;
  responseTime: number;
  requests: number;
}

interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  reporter: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  service: string;
  message: string;
  details?: any;
}

const MonitoringPage = () => {
  const { data: session } = useSession();
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>([]);
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showBugReportForm, setShowBugReportForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bugs' | 'logs'>('dashboard');

  // Mock data
  const sampleSystemStatus: SystemStatus[] = [
    {
      service: 'MCP Hub API',
      status: 'online',
      lastCheck: new Date().toISOString(),
      responseTime: 120,
      uptime: 99.9,
      errors: 0
    },
    {
      service: 'GitHub API Integration',
      status: 'degraded',
      lastCheck: new Date().toISOString(),
      responseTime: 850,
      uptime: 97.5,
      errors: 3
    },
    {
      service: 'Database Service',
      status: 'online',
      lastCheck: new Date().toISOString(),
      responseTime: 45,
      uptime: 99.8,
      errors: 0
    },
    {
      service: 'Authentication Service',
      status: 'online',
      lastCheck: new Date().toISOString(),
      responseTime: 90,
      uptime: 100,
      errors: 0
    },
    {
      service: 'Community Forum',
      status: 'online',
      lastCheck: new Date().toISOString(),
      responseTime: 200,
      uptime: 99.5,
      errors: 1
    }
  ];

  const samplePerformanceData: PerformanceMetric[] = [
    { timestamp: '10:00', cpu: 45, memory: 60, responseTime: 120, requests: 150 },
    { timestamp: '10:05', cpu: 50, memory: 65, responseTime: 115, requests: 180 },
    { timestamp: '10:10', cpu: 48, memory: 62, responseTime: 125, requests: 165 },
    { timestamp: '10:15', cpu: 52, memory: 68, responseTime: 130, requests: 200 },
    { timestamp: '10:20', cpu: 47, memory: 63, responseTime: 110, requests: 175 },
    { timestamp: '10:25', cpu: 55, memory: 70, responseTime: 140, requests: 220 },
    { timestamp: '10:30', cpu: 49, memory: 64, responseTime: 118, requests: 185 }
  ];

  const sampleBugReports: BugReport[] = [
    {
      id: 'bug-001',
      title: 'GitHub API rate limit causing project loading failure',
      description: 'When frequently accessing project pages, GitHub API returns 429 error, causing project data to fail loading. Suggest implementing cache mechanism or request throttling.',
      severity: 'high',
      category: 'API Integration',
      status: 'in_progress',
      reporter: 'System Administrator',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      tags: ['GitHub API', 'Rate Limit', 'Cache']
    },
    {
      id: 'bug-002',
      title: 'Community forum answer submission causes page unresponsiveness',
      description: 'After submitting answers in the community forum, the page may become unresponsive and requires refreshing to see the submitted content.',
      severity: 'medium',
      category: 'Community',
      status: 'open',
      reporter: 'User Feedback',
      createdAt: '2024-01-14T16:45:00Z',
      updatedAt: '2024-01-14T16:45:00Z',
      tags: ['Community Forum', 'Frontend', 'User Experience']
    },
    {
      id: 'bug-003',
      title: 'Insufficient text color contrast in dark theme',
      description: 'In dark theme mode, some text colors have insufficient contrast, affecting readability. Especially in code blocks on FAQ pages.',
      severity: 'low',
      category: 'UI/UX',
      status: 'resolved',
      reporter: 'User Feedback',
      createdAt: '2024-01-13T09:20:00Z',
      updatedAt: '2024-01-14T11:30:00Z',
      tags: ['Dark Theme', 'Accessibility', 'Color Contrast']
    }
  ];

  const sampleLogs: LogEntry[] = [
    {
      id: 'log-001',
      timestamp: '2024-01-15T10:35:00Z',
      level: 'error',
      service: 'GitHub API',
      message: 'API rate limit exceeded',
      details: { endpoint: '/repos/search', remaining: 0, resetTime: '2024-01-15T11:00:00Z' }
    },
    {
      id: 'log-002',
      timestamp: '2024-01-15T10:30:00Z',
      level: 'info',
      service: 'Database',
      message: 'Successfully connected to database',
      details: { connectionPool: 'active', connections: 5 }
    },
    {
      id: 'log-003',
      timestamp: '2024-01-15T10:25:00Z',
      level: 'warning',
      service: 'Authentication',
      message: 'Multiple failed login attempts detected',
      details: { ip: '192.168.1.100', attempts: 5, timeWindow: '5min' }
    },
    {
      id: 'log-004',
      timestamp: '2024-01-15T10:20:00Z',
      level: 'info',
      service: 'MCP Hub',
      message: 'Server started successfully',
      details: { port: 3000, environment: 'production' }
    }
  ];

  useEffect(() => {
    setSystemStatus(sampleSystemStatus);
    setPerformanceData(samplePerformanceData);
    setBugReports(sampleBugReports);
    setLogs(sampleLogs);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemStatus(prev => prev.map(service => ({
        ...service,
        lastCheck: new Date().toISOString(),
        responseTime: service.responseTime + Math.random() * 20 - 10
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'degraded': return 'Degraded';
      case 'offline': return 'Offline';
      case 'maintenance': return 'Maintenance';
      default: return 'Unknown';
    }
  };

  const getSeverityColor = (severity: BugReport['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLogLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      case 'debug': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const BugReportForm = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Bug</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Please briefly describe the issue..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea 
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Please describe the issue in detail, reproduction steps, etc..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Severity</label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="UI/UX">UI/UX</option>
              <option value="API Integration">API Integration</option>
              <option value="Community">Community Features</option>
              <option value="Performance">Performance Issues</option>
              <option value="Security">Security Issues</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Environment Information</label>
          <textarea 
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Operating system, browser version, device information, etc..."
          />
        </div>
        <div className="flex space-x-4">
          <button 
            type="submit"
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Submit Report
          </button>
          <button 
            type="button"
            className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            onClick={() => setShowBugReportForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemStatus.map((service, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.service}</h3>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className={`font-medium ${
                  service.status === 'online' ? 'text-green-600 dark:text-green-400' :
                  service.status === 'degraded' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {getStatusText(service.status)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                <span className="text-gray-900 dark:text-white">{Math.round(service.responseTime)}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                <span className="text-gray-900 dark:text-white">{service.uptime}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Errors</span>
                <span className={`font-medium ${
                  service.errors === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {service.errors}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Monitoring</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">CPU & Memory Usage</h4>
            <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">49%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average CPU Usage</div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Requests & Response Time</h4>
            <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">185</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Requests/5min</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bug Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bug Reports</h3>
          <button
            onClick={() => setActiveTab('bugs')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {bugReports.slice(0, 3).map(bug => (
            <div key={bug.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(bug.severity)}`}>
                    {bug.severity}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{bug.title}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {bug.category} • {new Date(bug.createdAt).toLocaleDateString('en-US')}
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                bug.status === 'open' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                bug.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {bug.status === 'open' ? 'Open' : bug.status === 'in_progress' ? 'In Progress' : 'Resolved'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const BugsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bug Report Management</h3>
        <button
          onClick={() => setShowBugReportForm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Report Bug
        </button>
      </div>

      {showBugReportForm && <BugReportForm />}

      <div className="space-y-4">
        {bugReports.map(bug => (
          <div key={bug.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(bug.severity)}`}>
                    {bug.severity}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{bug.category}</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{bug.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-3">{bug.description}</p>
                <div className="flex flex-wrap gap-2">
                  {bug.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  bug.status === 'open' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  bug.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {bug.status === 'open' ? 'Open' : bug.status === 'in_progress' ? 'In Progress' : 'Resolved'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(bug.createdAt).toLocaleDateString('en-US')}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Reporter: {bug.reporter}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const LogsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Logs</h3>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm">
            <option value="all">All Levels</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            <div>Time</div>
            <div>Level</div>
            <div>Service</div>
            <div>Message</div>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {logs.map(log => (
            <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-gray-600 dark:text-gray-400">
                  {new Date(log.timestamp).toLocaleTimeString('en-US')}
                </div>
                <div className={`font-medium ${getLogLevelColor(log.level)}`}>
                  {log.level.toUpperCase()}
                </div>
                <div className="text-gray-900 dark:text-white">{log.service}</div>
                <div className="text-gray-900 dark:text-white">{log.message}</div>
              </div>
              {log.details && (
                <div className="mt-2 col-span-4">
                  <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'bugs':
        return <BugsView />;
      case 'logs':
        return <LogsView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Monitoring</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time monitoring of system status, performance metrics, and error logs
          </p>
        </div>

        {/* Tab Bar */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('bugs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bugs'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🐛 Bug Reports
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'logs'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                📋 System Logs
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MonitoringPage; 