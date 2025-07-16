'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface SEOMetric {
  category: string;
  score: number;
  status: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  items: SEOItem[];
}

interface SEOItem {
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  recommendation?: string;
  value?: string;
}

interface PageMetadata {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  canonicalUrl: string;
  lastModified: string;
  status: 'optimized' | 'needs_work' | 'missing';
}

const SEOPage = () => {
  const [seoMetrics, setSeoMetrics] = useState<SEOMetric[]>([]);
  const [pageMetadata, setPageMetadata] = useState<PageMetadata[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'analysis' | 'metadata' | 'keywords' | 'technical'>('analysis');

  const sampleSEOMetrics: SEOMetric[] = [
    {
      category: '页面优化',
      score: 85,
      status: 'good',
      items: [
        {
          title: '页面标题',
          description: '所有页面都有唯一的标题',
          status: 'pass',
          value: '8/8 页面'
        },
        {
          title: '元描述',
          description: '大部分页面有元描述',
          status: 'warning',
          value: '6/8 页面',
          recommendation: '为项目详情页和社区页面添加元描述'
        },
        {
          title: '标题结构',
          description: '页面标题层次结构良好',
          status: 'pass',
          value: '正确的H1-H6结构'
        }
      ]
    },
    {
      category: '内容质量',
      score: 78,
      status: 'good',
      items: [
        {
          title: '内容长度',
          description: '页面内容长度适中',
          status: 'pass',
          value: '平均1500字/页'
        },
        {
          title: '关键词密度',
          description: '关键词使用合理',
          status: 'warning',
          value: '2.5%',
          recommendation: '增加MCP相关长尾关键词'
        },
        {
          title: '内容原创性',
          description: '内容原创且有价值',
          status: 'pass',
          value: '100%原创内容'
        }
      ]
    },
    {
      category: '技术SEO',
      score: 92,
      status: 'excellent',
      items: [
        {
          title: '页面加载速度',
          description: '页面加载速度优秀',
          status: 'pass',
          value: '1.2秒'
        },
        {
          title: '移动友好性',
          description: '网站完全适配移动设备',
          status: 'pass',
          value: '响应式设计'
        },
        {
          title: 'HTTPS安全',
          description: '网站使用HTTPS协议',
          status: 'pass',
          value: 'SSL证书有效'
        }
      ]
    },
    {
      category: '用户体验',
      score: 88,
      status: 'good',
      items: [
        {
          title: '页面结构',
          description: '页面结构清晰易导航',
          status: 'pass',
          value: '良好的导航结构'
        },
        {
          title: '内部链接',
          description: '内部链接分布合理',
          status: 'pass',
          value: '平均15个内部链接/页'
        },
        {
          title: '跳出率',
          description: '用户参与度良好',
          status: 'warning',
          value: '45%',
          recommendation: '优化首页内容以降低跳出率'
        }
      ]
    }
  ];

  const samplePageMetadata: PageMetadata[] = [
    {
      url: '/',
      title: 'MCPHubs - Model Context Protocol 开发者资源中心',
      description: 'MCPHubs是一个专为MCP（Model Context Protocol）开发者打造的综合资源平台，提供项目展示、开发指南、集成案例和社区支持。',
      keywords: ['MCP', 'Model Context Protocol', 'AI开发', 'Claude', '开发者工具'],
      ogTitle: 'MCPHubs - MCP开发者资源中心',
      ogDescription: '发现最新的MCP项目，学习开发技巧，与开发者社区互动',
      ogImage: '/images/og-homepage.jpg',
      twitterCard: 'summary_large_image',
      canonicalUrl: 'https://mcphubs.com/',
      lastModified: '2024-01-15T10:30:00Z',
      status: 'optimized'
    },
    {
      url: '/what-is-mcp',
      title: '什么是MCP？ - Model Context Protocol详解',
      description: '了解Model Context Protocol (MCP)的核心概念、工作原理和应用场景，掌握AI应用开发的下一代协议。',
      keywords: ['MCP协议', 'Model Context Protocol', 'AI协议', '上下文协议'],
      ogTitle: 'MCP协议详解 - 理解AI应用开发的新标准',
      ogDescription: '深入了解MCP协议的架构、特性和优势',
      ogImage: '/images/og-what-is-mcp.jpg',
      twitterCard: 'summary_large_image',
      canonicalUrl: 'https://mcphubs.com/what-is-mcp',
      lastModified: '2024-01-14T16:45:00Z',
      status: 'optimized'
    },
    {
      url: '/community',
      title: '开发者社区 - MCPHubs论坛',
      description: '加入MCPHubs开发者社区，与其他开发者交流MCP开发经验，获取技术支持和最佳实践。',
      keywords: ['MCP社区', '开发者论坛', '技术交流', '问答'],
      ogTitle: 'MCPHubs开发者社区',
      ogDescription: '与全球MCP开发者连接，分享经验，解决问题',
      ogImage: '/images/og-community.jpg',
      twitterCard: 'summary',
      canonicalUrl: 'https://mcphubs.com/community',
      lastModified: '2024-01-13T09:20:00Z',
      status: 'needs_work'
    },
    {
      url: '/project',
      title: 'MCP项目展示 - 发现优秀的MCP应用',
      description: '浏览精选的MCP项目库，发现创新的AI应用和工具，获取项目灵感和技术实现参考。',
      keywords: ['MCP项目', 'AI应用', '开源项目', '项目展示'],
      ogTitle: 'MCP项目展示',
      ogDescription: '发现最新最优秀的MCP项目和应用',
      ogImage: '/images/og-projects.jpg',
      twitterCard: 'summary_large_image',
      canonicalUrl: 'https://mcphubs.com/project',
      lastModified: '2024-01-12T14:30:00Z',
      status: 'optimized'
    }
  ];

  const keywordSuggestions = [
    {
      keyword: 'mcp 是 什麼',
      difficulty: 'low',
      volume: '5,400',
      competition: 'low',
      trend: 'rising',
      cpc: '$0.00'
    },
    {
      keyword: 'awesome-mcp-servers',
      difficulty: 'medium',
      volume: '3,600',
      competition: 'medium',
      trend: 'rising',
      cpc: '$0.00'
    },
    {
      keyword: 'claude mcp',
      difficulty: 'low',
      volume: '2,400',
      competition: 'low',
      trend: 'rising',
      cpc: '$0.00'
    },
    {
      keyword: 'mcp server教程',
      difficulty: 'medium',
      volume: '1,900',
      competition: 'medium',
      trend: 'rising',
      cpc: '$0.00'
    },
    {
      keyword: 'playwright-mcp',
      difficulty: 'medium',
      volume: '2,400',
      competition: 'medium',
      trend: 'stable',
      cpc: '$0.00'
    },
    {
      keyword: 'fastapi-mcp',
      difficulty: 'medium',
      volume: '2,900',
      competition: 'medium',
      trend: 'rising',
      cpc: '$0.00'
    },
    {
      keyword: 'cursor mcp',
      difficulty: 'medium',
      volume: '1,300',
      competition: 'medium',
      trend: 'rising',
      cpc: '$0.00'
    },
    {
      keyword: 'best mcp servers',
      difficulty: 'medium',
      volume: '390',
      competition: 'low',
      trend: 'rising',
      cpc: '$0.14'
    },
    {
      keyword: 'awesome mcp',
      difficulty: 'low',
      volume: '2,900',
      competition: 'low',
      trend: 'rising',
      cpc: '$0.00'
    },
    {
      keyword: 'mcp协议',
      difficulty: 'low',
      volume: '320',
      competition: 'low',
      trend: 'stable',
      cpc: '$0.00'
    }
  ];

  const technicalChecks = [
    {
      category: '爬虫优化',
      items: [
        { name: 'robots.txt', status: 'pass', value: '已配置' },
        { name: 'sitemap.xml', status: 'warning', value: '需要更新' },
        { name: '结构化数据', status: 'fail', value: '未实现' }
      ]
    },
    {
      category: '性能优化',
      items: [
        { name: '图片优化', status: 'pass', value: 'WebP格式' },
        { name: '代码压缩', status: 'pass', value: '已启用' },
        { name: '缓存策略', status: 'warning', value: '需要优化' }
      ]
    },
    {
      category: '移动优化',
      items: [
        { name: '响应式设计', status: 'pass', value: '完全适配' },
        { name: '触摸优化', status: 'pass', value: '已优化' },
        { name: '页面速度', status: 'warning', value: '3.2秒' }
      ]
    }
  ];

  useEffect(() => {
    setSeoMetrics(sampleSEOMetrics);
    setPageMetadata(samplePageMetadata);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
      case 'optimized':
      case 'excellent':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
      case 'needs_work':
      case 'good':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'fail':
      case 'missing':
      case 'poor':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
      case 'optimized':
      case 'excellent':
        return '✅';
      case 'warning':
      case 'needs_work':
      case 'good':
        return '⚠️';
      case 'fail':
      case 'missing':
      case 'poor':
        return '❌';
      default:
        return '❓';
    }
  };

  const AnalysisView = () => (
    <div className="space-y-6">
      {/* 总体评分 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO总体评分</h3>
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">86</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">总分</div>
              </div>
            </div>
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${86 * 3.516} 351.6`}
                className="text-blue-600 dark:text-blue-400"
              />
            </svg>
          </div>
        </div>
        <div className="text-center text-gray-600 dark:text-gray-300">
          您的网站SEO表现良好，还有一些改进空间
        </div>
      </div>

      {/* 分类评分 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {seoMetrics.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{metric.category}</h4>
              <div className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                {metric.score}
              </div>
            </div>
            <div className="space-y-3">
              {metric.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start space-x-3">
                  <div className="mt-1">{getStatusIcon(item.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900 dark:text-white">{item.title}</h5>
                      {item.value && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.value}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                    {item.recommendation && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        💡 {item.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MetadataView = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">页面元数据管理</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">页面</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">标题</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">描述</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">状态</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">操作</th>
              </tr>
            </thead>
            <tbody>
              {pageMetadata.map((page, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {page.url}
                    </code>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white max-w-xs">
                    <div className="truncate" title={page.title}>
                      {page.title}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                    <div className="truncate" title={page.description}>
                      {page.description}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      page.status === 'optimized' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      page.status === 'needs_work' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {page.status === 'optimized' ? '已优化' : page.status === 'needs_work' ? '需要改进' : '缺失'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm">
                      编辑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 元数据详情 */}
      {selectedPage && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">元数据详情</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标题</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">关键词</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">描述</label>
              <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const KeywordsView = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">关键词优化建议</h3>
        <div className="space-y-4">
          {keywordSuggestions.map((keyword, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{keyword.keyword}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    keyword.trend === 'rising' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {keyword.trend === 'rising' ? '上升' : '稳定'}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>搜索量: {keyword.volume}</span>
                  <span>难度: {keyword.difficulty}</span>
                  <span>竞争: {keyword.competition}</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                使用
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TechnicalView = () => (
    <div className="space-y-6">
      {technicalChecks.map((section, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{section.category}</h3>
          <div className="space-y-3">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex items-center space-x-3">
                  <div>{getStatusIcon(item.status)}</div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.value}</div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                  {item.status === 'pass' ? '通过' : item.status === 'warning' ? '警告' : '失败'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">SEO优化</h1>
          <p className="text-gray-600 dark:text-gray-300">
            分析网站SEO表现，优化搜索引擎排名和用户体验
          </p>
        </div>

        {/* 标签栏 */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analysis'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                📊 SEO分析
              </button>
              <button
                onClick={() => setActiveTab('metadata')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'metadata'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                📝 元数据管理
              </button>
              <button
                onClick={() => setActiveTab('keywords')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'keywords'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🔍 关键词优化
              </button>
              <button
                onClick={() => setActiveTab('technical')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'technical'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                ⚙️ 技术SEO
              </button>
            </nav>
          </div>
        </div>

        {/* 标签内容 */}
        {activeTab === 'analysis' && <AnalysisView />}
        {activeTab === 'metadata' && <MetadataView />}
        {activeTab === 'keywords' && <KeywordsView />}
        {activeTab === 'technical' && <TechnicalView />}
      </main>
      <Footer />
    </div>
  );
};

export default SEOPage; 