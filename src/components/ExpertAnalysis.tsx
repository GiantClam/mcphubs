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

// Generate expert insights based on project characteristics
function generateExpertInsights(project: ProcessedRepo): ExpertInsight[] {
  const insights: ExpertInsight[] = [];
  
  // Analysis based on project popularity
  if (project.stars > 1000) {
    insights.push({
      title: "Community Impact",
      content: `This project has ${project.stars} stars and significant influence in the MCP ecosystem. High attention usually indicates reliable code quality and active community support, making it ideal for enterprise applications.`,
      icon: <FaTrophy className="w-5 h-5" />,
      type: 'positive'
    });
  } else if (project.stars > 100) {
    insights.push({
      title: "Growth Potential",
      content: `The project currently has ${project.stars} stars and is in a rapid development phase. Such projects are typically more innovative and worth attention from early adopters, but stability risks need evaluation.`,
      icon: <FaRocket className="w-5 h-5" />,
      type: 'neutral'
    });
  }

  // Analysis based on programming language
  if (project.language === 'Python') {
    insights.push({
      title: "Technology Stack Advantages",
      content: "Python implementation provides excellent AI ecosystem compatibility, particularly suitable for integration with machine learning frameworks. Python's rich ecosystem offers unlimited possibilities for MCP extensions.",
      icon: <FaCode className="w-5 h-5" />,
      type: 'positive'
    });
  } else if (project.language === 'JavaScript' || project.language === 'TypeScript') {
    insights.push({
      title: "Frontend Integration Friendly",
      content: "JavaScript/TypeScript implementation allows seamless integration into modern web applications, providing strong support for building interactive MCP applications.",
      icon: <FaCode className="w-5 h-5" />,
      type: 'positive'
    });
  }

  // Analysis based on activity
  const lastUpdateDate = new Date(project.updatedAt);
  const monthsAgo = (Date.now() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  if (monthsAgo < 1) {
    insights.push({
      title: "Active Maintenance",
      content: "The project has been updated within the last month, showing good maintenance status. Active development pace usually means timely bug fixes and continuous addition of new features.",
      icon: <FaLightbulb className="w-5 h-5" />,
      type: 'positive'
    });
  } else if (monthsAgo > 6) {
    insights.push({
      title: "Maintenance Status Alert",
      content: `The project was last updated ${Math.floor(monthsAgo)} months ago, recommend evaluating maintenance status. Long periods without updates may pose compatibility or security risks.`,
      icon: <FaExclamationTriangle className="w-5 h-5" />,
      type: 'warning'
    });
  }

  // Analysis based on Fork count
  if (project.forks > 50) {
    insights.push({
      title: "Developer Ecosystem",
      content: `${project.forks} forks indicate the project has an active developer community. High fork count usually means the code is widely studied and improved, beneficial for long-term project development.`,
      icon: <FaUsers className="w-5 h-5" />,
      type: 'positive'
    });
  }

  return insights;
}

// Generate practical advice based on project characteristics
function generatePracticalAdvice(project: ProcessedRepo): string[] {
  const advice: string[] = [];
  
  // Advice based on project scale
  if (project.stars > 1000) {
    advice.push("Suitable for production deployment with sufficient community support");
    advice.push("Recommend checking Issues page for common problems and solutions");
  } else {
    advice.push("Suitable for experimentation and learning, verify in test environment first");
    advice.push("Consider contributing to help project development");
  }

  // Language-specific advice
  if (project.language === 'Python') {
    advice.push("Recommend using virtual environments for dependency management");
    advice.push("Consider integration with LangChain, OpenAI and other frameworks");
  } else if (project.language === 'JavaScript' || project.language === 'TypeScript') {
    advice.push("Recommend using npm or yarn for package management");
    advice.push("Consider integration with React, Vue and other frontend frameworks");
  }

  // General advice
  advice.push("Carefully read documentation and example code");
  advice.push("Pay attention to project License and terms of use");
  
  return advice;
}

// Generate technical assessment based on project characteristics
function generateTechnicalAssessment(project: ProcessedRepo): {
  strengths: string[];
  considerations: string[];
  futureOutlook: string;
} {
  const strengths: string[] = [];
  const considerations: string[] = [];
  
  // Assessment based on project maturity
  if (project.stars > 500) {
    strengths.push("High project maturity with strong community recognition");
    strengths.push("Relatively reliable code quality, verified through actual usage");
  } else {
    considerations.push("Project is relatively new, stability evaluation needed");
  }

  // Assessment based on maintenance status
  const lastUpdateDate = new Date(project.updatedAt);
  const monthsAgo = (Date.now() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  if (monthsAgo < 3) {
    strengths.push("Active maintenance with timely responses");
  } else {
    considerations.push("Maintenance frequency needs attention");
  }

  // Assessment based on Fork count
  if (project.forks > 20) {
    strengths.push("High developer participation, code widely studied");
  }

  // Generate future outlook
  let futureOutlook = "";
  if (project.stars > 1000) {
    futureOutlook = "As an important component of the MCP ecosystem, this project is expected to play a key role in AI application development. It will likely continue to receive community support and feature improvements.";
  } else if (project.stars > 100) {
    futureOutlook = "The project is in a rapid development phase with good growth potential. As MCP standards become more widespread, it may receive more attention and contributions.";
  } else {
    futureOutlook = "As an emerging project, it has innovation potential. We recommend keeping track of its development progress and considering participation or adoption at the right time.";
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Expert In-Depth Analysis</h2>
      </div>

      {/* Expert Insights */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Professional Insights</h3>
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

      {/* Technical Assessment */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Technical Assessment</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3 text-green-700 dark:text-green-400">Project Strengths</h4>
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
            <h4 className="font-medium mb-3 text-orange-700 dark:text-orange-400">Considerations</h4>
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

      {/* Practical Recommendations */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Practical Recommendations</h3>
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

      {/* Future Outlook */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Future Outlook</h3>
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