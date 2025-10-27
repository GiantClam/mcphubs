'use client';

import React from 'react';
import { FaCheck, FaStar, FaRocket, FaCog, FaBolt } from 'react-icons/fa';

interface ProjectFeaturesProps {
  project: any;
}

export default function ProjectFeatures({ project }: ProjectFeaturesProps) {
  const generateFeatures = (project: any) => {
    const features = [];

    // 基于项目数据生成特性
    if (project.stars > 100) {
      features.push({
        icon: <FaStar className="w-5 h-5" />,
        title: "Popular",
        description: "Highly starred project with active community"
      });
    }

    if (project.verified) {
      features.push({
        icon: <FaCheck className="w-5 h-5" />,
        title: "Verified",
        description: "Verified and trusted by the MCP community"
      });
    }

    if (project.official) {
      features.push({
        icon: <FaCheck className="w-5 h-5" />,
        title: "Official",
        description: "Official MCP server implementation"
      });
    }

    if (project.language === 'TypeScript' || project.language === 'JavaScript') {
      features.push({
        icon: <FaBolt className="w-5 h-5" />,
        title: "Fast Setup",
        description: "Quick installation with npm/yarn"
      });
    }

    if (project.documentation) {
      features.push({
        icon: <FaCog className="w-5 h-5" />,
        title: "Well Documented",
        description: "Comprehensive documentation and examples"
      });
    }

    // 添加一些通用特性
    features.push({
      icon: <FaRocket className="w-5 h-5" />,
      title: "Easy Integration",
      description: "Simple configuration for MCP clients"
    });

    return features;
  };

  const features = project.features || generateFeatures(project);

  return (
    <section className="project-features bg-white dark:bg-gray-900 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Key Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature: any, index: number) => (
          <div
            key={index}
            className="feature-card p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {features.length === 0 && (
        <div className="text-center py-8">
          <FaRocket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Features coming soon
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Feature information will be displayed here once available.
          </p>
        </div>
      )}
    </section>
  );
}
