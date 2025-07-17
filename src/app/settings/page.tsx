'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FaUser, FaCog, FaBell, FaEye, FaSignInAlt, FaGithub } from 'react-icons/fa';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      newProjects: true,
      updates: false
    },
    display: {
      theme: 'auto',
      language: 'zh',
      itemsPerPage: 20
    },
    privacy: {
      profilePublic: true,
      showEmail: false,
      allowMessages: true
    }
  });

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <FaCog className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            设置中心
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            请先登录以管理您的设置
          </p>
          <button
            onClick={() => signIn('github')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
          >
            <FaGithub className="w-5 h-5" />
            使用 GitHub 登录
            <FaSignInAlt className="w-4 h-4" />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            设置中心
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            管理您的账户设置和偏好
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边导航 */}
          <div className="lg:col-span-1">
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <ul className="space-y-2">
                <li>
                  <a href="#notifications" className="flex items-center px-3 py-2 text-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <FaBell className="w-4 h-4 mr-3" />
                    通知设置
                  </a>
                </li>
                <li>
                  <a href="#display" className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <FaEye className="w-4 h-4 mr-3" />
                    显示设置
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <FaUser className="w-4 h-4 mr-3" />
                    隐私设置
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* 设置内容 */}
          <div className="lg:col-span-3 space-y-8">
            {/* 通知设置 */}
            <section id="notifications" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaBell className="w-5 h-5" />
                通知设置
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      邮件通知
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      接收重要更新的邮件通知
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      新项目通知
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      当有新的MCP项目发布时通知我
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.newProjects}
                    onChange={(e) => handleSettingChange('notifications', 'newProjects', e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                </div>
              </div>
            </section>

            {/* 显示设置 */}
            <section id="display" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaEye className="w-5 h-5" />
                显示设置
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    主题模式
                  </label>
                  <select
                    value={settings.display.theme}
                    onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="auto">跟随系统</option>
                    <option value="light">浅色模式</option>
                    <option value="dark">深色模式</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    每页显示项目数
                  </label>
                  <select
                    value={settings.display.itemsPerPage}
                    onChange={(e) => handleSettingChange('display', 'itemsPerPage', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 隐私设置 */}
            <section id="privacy" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaUser className="w-5 h-5" />
                隐私设置
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      公开个人资料
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      让其他用户可以查看您的个人资料
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.profilePublic}
                    onChange={(e) => handleSettingChange('privacy', 'profilePublic', e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      显示邮箱地址
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      在个人资料中显示您的邮箱地址
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showEmail}
                    onChange={(e) => handleSettingChange('privacy', 'showEmail', e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                </div>
              </div>
            </section>

            {/* 保存按钮 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  重置
                </button>
                <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
                  保存设置
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 