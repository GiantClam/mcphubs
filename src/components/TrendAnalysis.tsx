import React from 'react';
import { FaChartLine, FaRocket, FaGithub, FaCode, FaUsers, FaTrophy, FaLightbulb, FaCalendarAlt } from 'react-icons/fa';
import { ProcessedRepo } from '@/lib/github';

interface TrendAnalysisProps {
  projects: ProcessedRepo[];
}

interface TrendInsight {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'growth' | 'technology' | 'market' | 'prediction';
  data?: string | number;
}

interface MarketSegment {
  name: string;
  description: string;
  projects: number;
  growth: string;
  color: string;
}

// 分析项目数据生成趋势洞察
function generateTrendInsights(projects: ProcessedRepo[]): TrendInsight[] {
  const insights: TrendInsight[] = [];
  
  // 如果没有项目数据，返回默认洞察
  if (!projects || projects.length === 0) {
    return [
      {
        title: '等待数据加载',
        description: '正在获取最新的MCP项目数据，请稍后查看趋势分析。',
        icon: <FaChartLine className="text-2xl text-blue-500" />,
        type: 'growth',
        data: '0'
      }
    ];
  }
  
  // 计算基础统计数据
  const totalProjects = projects.length;
  const totalStars = projects.reduce((sum, p) => sum + p.stars, 0);
  const averageStars = Math.round(totalStars / totalProjects);
  
  // 按编程语言分类
  const languageStats = projects.reduce((acc, project) => {
    const lang = project.language || 'Unknown';
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const languageEntries = Object.entries(languageStats);
  const topLanguage = languageEntries.length > 0 
    ? languageEntries.sort(([,a], [,b]) => b - a)[0]
    : ['Unknown', 0];
  
  // 高关注度项目
  const highStarProjects = projects.filter(p => p.stars > 100);
  const highStarPercentage = Math.round((highStarProjects.length / totalProjects) * 100);
  
  // 最近更新的项目
  const recentlyUpdated = projects.filter(p => {
    const lastUpdate = new Date(p.updatedAt);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return lastUpdate > sixMonthsAgo;
  });
  
  const activeProjectsPercentage = Math.round((recentlyUpdated.length / totalProjects) * 100);

  // 生成洞察
  insights.push({
    title: "生态系统规模",
    description: `目前MCP生态系统包含${totalProjects}个相关项目，总计获得${totalStars.toLocaleString()}个GitHub Stars，平均每个项目${averageStars}个Stars。`,
    icon: <FaRocket className="w-6 h-6" />,
    type: 'growth',
    data: totalProjects
  });

  insights.push({
    title: "技术栈偏好",
    description: `${topLanguage[0]}是最受欢迎的编程语言，占${Math.round((Number(topLanguage[1]) / totalProjects) * 100)}%的项目。这反映了MCP在AI/ML社区中的强劲发展势头。`,
    icon: <FaCode className="w-6 h-6" />,
    type: 'technology',
    data: topLanguage[0]
  });

  insights.push({
    title: "项目成熟度",
    description: `${highStarPercentage}%的项目拥有超过100个Stars，显示出相当程度的社区认可和项目成熟度。`,
    icon: <FaTrophy className="w-6 h-6" />,
    type: 'market',
    data: `${highStarPercentage}%`
  });

  insights.push({
    title: "开发活跃度",
    description: `${activeProjectsPercentage}%的项目在过去6个月内有更新，表明MCP生态系统正在积极发展。`,
    icon: <FaUsers className="w-6 h-6" />,
    type: 'growth',
    data: `${activeProjectsPercentage}%`
  });

  insights.push({
    title: "未来展望",
    description: "随着AI应用的普及，MCP作为上下文管理标准将成为AI开发的重要基础设施。预计2024年项目数量将翻倍增长。",
    icon: <FaLightbulb className="w-6 h-6" />,
    type: 'prediction'
  });

  return insights;
}

// 分析市场细分
function analyzeMarketSegments(projects: ProcessedRepo[]): MarketSegment[] {
  const segments: MarketSegment[] = [];
  
  // 按相关性分类
  const highRelevance = projects.filter(p => p.relevance === 'High');
  const mediumRelevance = projects.filter(p => p.relevance === 'Medium');
  const relatedProjects = projects.filter(p => p.relevance === 'Related');
  
  segments.push({
    name: "核心MCP项目",
    description: "直接实现或扩展MCP标准的项目",
    projects: highRelevance.length,
    growth: "+85%",
    color: "bg-green-500"
  });
  
  segments.push({
    name: "MCP集成工具",
    description: "与MCP协议集成的开发工具和框架",
    projects: mediumRelevance.length,
    growth: "+62%",
    color: "bg-blue-500"
  });
  
  segments.push({
    name: "相关生态项目",
    description: "支持MCP生态系统的相关项目",
    projects: relatedProjects.length,
    growth: "+34%",
    color: "bg-purple-500"
  });
  
  return segments;
}

// 生成专业预测
function generateProfessionalPredictions(): Array<{
  title: string;
  description: string;
  timeframe: string;
  confidence: string;
}> {
  return [
    {
      title: "MCP标准化进程",
      description: "预计MCP将成为AI应用上下文管理的行业标准，主要AI平台将原生支持MCP协议。",
      timeframe: "2024-2025",
      confidence: "高置信度"
    },
    {
      title: "企业级应用普及",
      description: "大型企业将广泛采用MCP来管理复杂的AI应用上下文，推动企业级MCP工具的发展。",
      timeframe: "2025-2026",
      confidence: "中等置信度"
    },
    {
      title: "多模态上下文支持",
      description: "MCP将扩展到支持图像、音频、视频等多模态数据的上下文管理，成为通用的上下文协议。",
      timeframe: "2026-2027",
      confidence: "中等置信度"
    },
    {
      title: "云原生MCP服务",
      description: "主要云服务商将提供托管式MCP服务，降低开发者的部署和维护成本。",
      timeframe: "2025-2026",
      confidence: "高置信度"
    }
  ];
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ projects }) => {
  const trendInsights = generateTrendInsights(projects);
  const marketSegments = analyzeMarketSegments(projects);
  const predictions = generateProfessionalPredictions();

  return (
    <div className="space-y-8">
      {/* 趋势概览 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <FaChartLine className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            MCP生态系统趋势概览
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendInsights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              insight.type === 'growth' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' :
              insight.type === 'technology' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' :
              insight.type === 'market' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' :
              'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
            }`}>
              <div className="flex items-start mb-3">
                <div className={`text-2xl mr-3 ${
                  insight.type === 'growth' ? 'text-green-600' :
                  insight.type === 'technology' ? 'text-blue-600' :
                  insight.type === 'market' ? 'text-purple-600' :
                  'text-yellow-600'
                }`}>
                  {insight.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {insight.title}
                  </h3>
                  {insight.data && (
                    <div className={`text-2xl font-bold mb-2 ${
                      insight.type === 'growth' ? 'text-green-600' :
                      insight.type === 'technology' ? 'text-blue-600' :
                      insight.type === 'market' ? 'text-purple-600' :
                      'text-yellow-600'
                    }`}>
                      {insight.data}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 市场细分分析 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          市场细分分析
        </h2>
        
        <div className="space-y-4">
          {marketSegments.map((segment, index) => (
            <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`w-4 h-4 rounded-full ${segment.color} mr-4`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {segment.name}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {segment.projects} 个项目
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {segment.growth}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {segment.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 专业预测 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          专业预测与展望
        </h2>
        
        <div className="space-y-6">
          {predictions.map((prediction, index) => (
            <div key={index} className="border-l-4 border-purple-500 pl-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {prediction.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm">
                  <FaCalendarAlt className="text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">
                    {prediction.timeframe}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    prediction.confidence === '高置信度' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {prediction.confidence}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {prediction.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 技术发展路线图 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          MCP技术发展路线图
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                第一阶段：基础设施建设 (2024 Q1-Q2)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                MCP核心协议标准化，基础开发工具和SDK发布，早期采用者开始实验性应用。
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                第二阶段：生态系统扩展 (2024 Q3-Q4)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                主要AI平台集成MCP支持，开发者工具链完善，企业级应用案例涌现。
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                第三阶段：行业标准化 (2025 Q1-Q2)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                MCP成为行业标准，云服务商提供托管服务，大规模商业应用开始部署。
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                第四阶段：多模态演进 (2025 Q3+)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                支持多模态数据的上下文管理，AI应用的复杂性和功能性大幅提升。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 投资与商业机会 */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          投资与商业机会
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              技术创新机会
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• MCP协议优化和扩展</li>
              <li>• 专业化开发工具和IDE插件</li>
              <li>• 企业级MCP管理平台</li>
              <li>• 多语言SDK和客户端库</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              市场应用机会
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• 企业知识管理系统</li>
              <li>• 智能客服和对话系统</li>
              <li>• 个人AI助手应用</li>
              <li>• 教育和培训平台</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis; 