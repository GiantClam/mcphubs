import React from 'react';
import { FaLightbulb, FaRocket, FaExclamationTriangle, FaTrophy, FaCode, FaUsers } from 'react-icons/fa';
import { ProcessedRepo } from '@/lib/github';

interface ExpertAnalysisProps {
  project: ProcessedRepo;
}

interface ExpertInsight {
  title: string;
  content: string;
  icon: React.ReactNode;
  type: 'positive' | 'neutral' | 'warning';
}

// 基于项目特征生成专家见解
function generateExpertInsights(project: ProcessedRepo): ExpertInsight[] {
  const insights: ExpertInsight[] = [];
  
  // 基于项目人气分析
  if (project.stars > 1000) {
    insights.push({
      title: "社区影响力",
      content: `该项目拥有${project.stars}个stars，在MCP生态系统中具有显著影响力。高关注度通常意味着代码质量可靠，社区支持活跃，是企业级应用的理想选择。`,
      icon: <FaTrophy className="w-5 h-5" />,
      type: 'positive'
    });
  } else if (project.stars > 100) {
    insights.push({
      title: "成长潜力",
      content: `项目目前有${project.stars}个stars，处于快速发展阶段。这类项目通常更具创新性，值得早期采用者关注，但需要评估稳定性风险。`,
      icon: <FaRocket className="w-5 h-5" />,
      type: 'neutral'
    });
  }

  // 基于编程语言分析
  if (project.language === 'Python') {
    insights.push({
      title: "技术栈优势",
      content: "Python实现使得该项目具有良好的AI生态兼容性，特别适合与机器学习框架集成。Python的丰富生态系统为MCP扩展提供了无限可能。",
      icon: <FaCode className="w-5 h-5" />,
      type: 'positive'
    });
  } else if (project.language === 'JavaScript' || project.language === 'TypeScript') {
    insights.push({
      title: "前端集成友好",
      content: "JavaScript/TypeScript实现使得该项目能够无缝集成到现代Web应用中，为构建交互式MCP应用提供了强大支持。",
      icon: <FaCode className="w-5 h-5" />,
      type: 'positive'
    });
  }

  // 基于活跃度分析
  const lastUpdateDate = new Date(project.updatedAt);
  const monthsAgo = (Date.now() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  if (monthsAgo < 1) {
    insights.push({
      title: "活跃维护",
      content: "项目最近一个月内仍有更新，显示出良好的维护状态。活跃的开发节奏通常意味着bug修复及时，新功能持续添加。",
      icon: <FaLightbulb className="w-5 h-5" />,
      type: 'positive'
    });
  } else if (monthsAgo > 6) {
    insights.push({
      title: "维护状态提醒",
      content: `项目最后更新于${Math.floor(monthsAgo)}个月前，建议评估维护状态。长期未更新可能存在兼容性或安全性风险。`,
      icon: <FaExclamationTriangle className="w-5 h-5" />,
      type: 'warning'
    });
  }

  // 基于Fork数量分析
  if (project.forks > 50) {
    insights.push({
      title: "开发者生态",
      content: `${project.forks}个Fork表明项目拥有活跃的开发者社区。高Fork数通常意味着代码被广泛研究和改进，有利于项目长期发展。`,
      icon: <FaUsers className="w-5 h-5" />,
      type: 'positive'
    });
  }

  return insights;
}

// 基于项目特征生成实用建议
function generatePracticalAdvice(project: ProcessedRepo): string[] {
  const advice: string[] = [];
  
  // 基于项目规模的建议
  if (project.stars > 1000) {
    advice.push("适合生产环境部署，社区支持充足");
    advice.push("建议查看Issues页面了解常见问题和解决方案");
  } else {
    advice.push("适合实验和学习，建议先在测试环境中验证");
    advice.push("考虑参与贡献，帮助项目发展");
  }

  // 基于语言的建议
  if (project.language === 'Python') {
    advice.push("建议使用虚拟环境管理依赖");
    advice.push("可考虑与LangChain、OpenAI等框架集成");
  } else if (project.language === 'JavaScript' || project.language === 'TypeScript') {
    advice.push("建议使用npm或yarn进行包管理");
    advice.push("可考虑与React、Vue等前端框架集成");
  }

  // 通用建议
  advice.push("仔细阅读文档和示例代码");
  advice.push("关注项目的License和使用条款");
  
  return advice;
}

// 基于项目特征生成技术评估
function generateTechnicalAssessment(project: ProcessedRepo): {
  strengths: string[];
  considerations: string[];
  futureOutlook: string;
} {
  const strengths: string[] = [];
  const considerations: string[] = [];
  
  // 基于项目成熟度评估
  if (project.stars > 500) {
    strengths.push("项目成熟度高，社区认可度强");
    strengths.push("代码质量相对可靠，经过实际使用验证");
  } else {
    considerations.push("项目相对较新，需要评估稳定性");
  }

  // 基于维护状态评估
  const lastUpdateDate = new Date(project.updatedAt);
  const monthsAgo = (Date.now() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  if (monthsAgo < 3) {
    strengths.push("维护活跃，响应及时");
  } else {
    considerations.push("维护频率需要关注");
  }

  // 基于Fork数量评估
  if (project.forks > 20) {
    strengths.push("开发者参与度高，代码被广泛研究");
  }

  // 生成未来展望
  let futureOutlook = "";
  if (project.stars > 1000) {
    futureOutlook = "作为MCP生态系统的重要组成部分，该项目有望在AI应用开发中发挥关键作用。预计将持续获得社区支持和功能改进。";
  } else if (project.stars > 100) {
    futureOutlook = "项目正处于快速发展期，具有良好的成长潜力。随着MCP标准的普及，可能会获得更多关注和贡献。";
  } else {
    futureOutlook = "作为新兴项目，具有创新潜力。建议持续关注其发展动态，适时参与贡献或采用。";
  }

  return { strengths, considerations, futureOutlook };
}

const ExpertAnalysis: React.FC<ExpertAnalysisProps> = ({ project }) => {
  const insights = generateExpertInsights(project);
  const practicalAdvice = generatePracticalAdvice(project);
  const { strengths, considerations, futureOutlook } = generateTechnicalAssessment(project);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center mb-6">
        <FaLightbulb className="w-6 h-6 text-purple-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">专家深度分析</h2>
      </div>

      {/* 专家见解 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">专业见解</h3>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'positive' 
                  ? 'bg-green-50 border-green-400 dark:bg-green-900/20 dark:border-green-500' 
                  : insight.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-500'
                  : 'bg-blue-50 border-blue-400 dark:bg-blue-900/20 dark:border-blue-500'
              }`}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 mr-3 ${
                  insight.type === 'positive' 
                    ? 'text-green-600 dark:text-green-400' 
                    : insight.type === 'warning'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}>
                  {insight.icon}
                </div>
                <div>
                  <h4 className={`font-semibold mb-2 ${
                    insight.type === 'positive' 
                      ? 'text-green-800 dark:text-green-300' 
                      : insight.type === 'warning'
                      ? 'text-yellow-800 dark:text-yellow-300'
                      : 'text-blue-800 dark:text-blue-300'
                  }`}>
                    {insight.title}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {insight.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 技术评估 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">技术评估</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3 text-green-700 dark:text-green-400">项目优势</h4>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-orange-700 dark:text-orange-400">考虑因素</h4>
            <ul className="space-y-2">
              {considerations.map((consideration, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-500 mr-2">!</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{consideration}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 实用建议 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">实用建议</h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <ul className="space-y-2">
            {practicalAdvice.map((advice, index) => (
              <li key={index} className="flex items-start">
                <span className="text-purple-500 mr-2">→</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 发展前景 */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">发展前景</h3>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {futureOutlook}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpertAnalysis; 