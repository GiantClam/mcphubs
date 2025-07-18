'use client';

import { useState, useEffect } from 'react';

interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  description: string;
  preview: string;
}

interface ComponentDemo {
  id: string;
  name: string;
  description: string;
  component: React.ReactNode;
  code: string;
}

const ThemesPage = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>('light');
  const [activeTab, setActiveTab] = useState<'themes' | 'components' | 'colors'>('themes');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const themes: Theme[] = [
    {
      id: 'light',
      name: '浅色主题',
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#10B981',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#111827',
        textSecondary: '#6B7280'
      },
      description: '经典的浅色主题，适合日间使用',
      preview: 'bg-white text-gray-900'
    },
    {
      id: 'dark',
      name: '深色主题',
      colors: {
        primary: '#60A5FA',
        secondary: '#A78BFA',
        accent: '#34D399',
        background: '#111827',
        surface: '#1F2937',
        text: '#F9FAFB',
        textSecondary: '#D1D5DB'
      },
      description: '护眼深色主题，适合夜间使用',
      preview: 'bg-gray-900 text-white'
    },
    {
      id: 'blue',
      name: '蓝色主题',
      colors: {
        primary: '#2563EB',
        secondary: '#1E40AF',
        accent: '#3B82F6',
        background: '#F8FAFC',
        surface: '#EFF6FF',
        text: '#1E293B',
        textSecondary: '#475569'
      },
      description: '专业蓝色主题，商务风格',
      preview: 'bg-blue-50 text-blue-900'
    },
    {
      id: 'purple',
      name: '紫色主题',
      colors: {
        primary: '#7C3AED',
        secondary: '#A855F7',
        accent: '#C084FC',
        background: '#FAFAFA',
        surface: '#FAF5FF',
        text: '#1F2937',
        textSecondary: '#6B7280'
      },
      description: '创意紫色主题，现代感十足',
      preview: 'bg-purple-50 text-purple-900'
    },
    {
      id: 'green',
      name: '绿色主题',
      colors: {
        primary: '#059669',
        secondary: '#10B981',
        accent: '#34D399',
        background: '#F9FAFB',
        surface: '#ECFDF5',
        text: '#1F2937',
        textSecondary: '#6B7280'
      },
      description: '自然绿色主题，清新护眼',
      preview: 'bg-green-50 text-green-900'
    }
  ];

  const componentDemos: ComponentDemo[] = [
    {
      id: 'buttons',
      name: '按钮组件',
      description: '各种样式的按钮组件',
      component: (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              主要按钮
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              次要按钮
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              成功按钮
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              危险按钮
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              大按钮
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
              小按钮
            </button>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              全宽按钮
            </button>
          </div>
        </div>
      ),
      code: `// 主要按钮
<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
  主要按钮
</button>

// 次要按钮
<button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
  次要按钮
</button>`
    },
    {
      id: 'forms',
      name: '表单组件',
      description: '输入框、选择器等表单元素',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              文本输入
            </label>
            <input
              type="text"
              placeholder="请输入内容..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              选择器
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option>选项 1</option>
              <option>选项 2</option>
              <option>选项 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              多行文本
            </label>
            <textarea
              rows={3}
              placeholder="请输入多行内容..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="checkbox" className="text-sm text-gray-700 dark:text-gray-300">
              我同意相关条款
            </label>
          </div>
        </div>
      ),
      code: `// 文本输入
<input
  type="text"
  placeholder="请输入内容..."
  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
/>

// 选择器
<select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
  <option>选项 1</option>
  <option>选项 2</option>
</select>`
    },
    {
      id: 'cards',
      name: '卡片组件',
      description: '各种样式的卡片布局',
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">基础卡片</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              这是一个基础的卡片组件，包含标题和内容区域。
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              查看详情
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">图片卡片</h3>
              <p className="text-gray-600 dark:text-gray-300">
                带有图片头部的卡片组件。
              </p>
            </div>
          </div>
        </div>
      ),
      code: `// 基础卡片
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">基础卡片</h3>
  <p className="text-gray-600 dark:text-gray-300 mb-4">
    这是一个基础的卡片组件，包含标题和内容区域。
  </p>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
    查看详情
  </button>
</div>`
    },
    {
      id: 'alerts',
      name: '警告组件',
      description: '不同类型的警告和通知',
      component: (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">信息提示</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  这是一个信息提示消息。
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">成功</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  操作已成功完成。
                </p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">错误</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  发生了一个错误，请重试。
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      code: `// 信息提示
<div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
  <div className="flex items-center">
    <div className="flex-shrink-0">
      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
        {/* 图标 */}
      </svg>
    </div>
    <div className="ml-3">
      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">信息提示</h3>
      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
        这是一个信息提示消息。
      </p>
    </div>
  </div>
</div>`
    },
    {
      id: 'badges',
      name: '徽章组件',
      description: '状态标签和徽章',
      component: (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
              信息
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm">
              成功
            </span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm">
              警告
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-sm">
              错误
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-md text-sm font-medium">
              新功能
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-md text-sm font-medium">
              测试版
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded-md text-sm font-medium">
              已弃用
            </span>
          </div>
        </div>
      ),
      code: `// 基础徽章
<span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
  信息
</span>

// 状态徽章
<span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-md text-sm font-medium">
  新功能
</span>`
    }
  ];

  useEffect(() => {
    // 检查系统主题偏好
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme.id);
    // 这里可以实现主题切换逻辑
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
  };

  const ThemesView = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">主题选择</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map(theme => (
            <div
              key={theme.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedTheme === theme.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => applyTheme(theme)}
            >
              <div className={`w-full h-20 rounded-md mb-3 ${theme.preview}`}>
                <div className="p-3 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium mb-1">MCPHubs</div>
                    <div className="text-xs opacity-70">预览效果</div>
                  </div>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{theme.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{theme.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">主题控制</h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">深色模式</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              切换到深色主题以获得更好的夜间体验
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const ComponentsView = () => (
    <div className="space-y-6">
      {componentDemos.map(demo => (
        <div key={demo.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{demo.name}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{demo.description}</p>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">预览</h4>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {demo.component}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">代码</h4>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="text-gray-800 dark:text-gray-200">{demo.code}</code>
            </pre>
          </div>
        </div>
      ))}
    </div>
  );

  const ColorsView = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">颜色系统</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map(theme => (
            <div key={theme.id} className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">{theme.name}</h4>
              <div className="space-y-2">
                {Object.entries(theme.colors).map(([key, color]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {color}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">颜色使用指南</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">主要颜色</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                用于主要操作按钮、链接和重要元素
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">次要颜色</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                用于次要操作和辅助元素
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">强调色</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                用于突出显示和状态指示
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">背景色</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                页面主背景和容器背景
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">主题与组件</h1>
          <p className="text-gray-600 dark:text-gray-300">
            探索不同的主题选项和UI组件库
          </p>
        </div>

        {/* 标签栏 */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('themes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'themes'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🎨 主题选择
              </button>
              <button
                onClick={() => setActiveTab('components')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'components'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🧩 组件展示
              </button>
              <button
                onClick={() => setActiveTab('colors')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'colors'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🎯 颜色系统
              </button>
            </nav>
          </div>
        </div>

        {/* 标签内容 */}
        {activeTab === 'themes' && <ThemesView />}
        {activeTab === 'components' && <ComponentsView />}
        {activeTab === 'colors' && <ColorsView />}
      </div>
    </div>
  );
};

export default ThemesPage; 