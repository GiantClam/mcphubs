import { FaCode, FaDatabase, FaCloud, FaRobot, FaGithub, FaDocker, FaSlack, FaDiscord, FaTelegram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { SiJetbrains, SiNotion, SiObsidian, SiFilezilla, SiElasticsearch, SiGrafana } from 'react-icons/si';

export const metadata = {
  title: 'MCP集成案例 - MCPHubs',
  description: '探索Model Context Protocol与各种工具和平台的集成示例，学习如何在不同环境中使用MCP'
};

export default function IntegrationsPage() {
  const integrations = [
    {
      category: "AI 编程工具",
      description: "与主流 AI 编程助手的集成",
      items: [
        {
          name: "Claude Desktop",
          icon: <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">C</div>,
          description: "Anthropic 官方 AI 助手客户端，原生支持 MCP",
          features: ["原生 MCP 支持", "工具调用", "资源访问", "提示管理"],
          status: "官方支持",
          link: "https://claude.ai/desktop"
        },
        {
          name: "Cursor",
          icon: <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">⚡</div>,
          description: "AI 代码编辑器，通过 MCP 扩展功能",
          features: ["代码生成", "项目理解", "文档生成", "代码重构"],
          status: "社区支持",
          link: "https://cursor.sh"
        },
        {
          name: "Windsurf",
          icon: <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">🏄</div>,
          description: "AI 开发环境，集成 MCP 工具链",
          features: ["全栈开发", "实时协作", "智能建议", "自动化测试"],
          status: "社区支持",
          link: "https://windsurf.dev"
        }
      ]
    },
    {
      category: "IDE 集成",
      description: "与集成开发环境的深度集成",
      items: [
        {
          name: "VS Code",
          icon: <FaCode className="w-12 h-12 text-blue-600" />,
          description: "通过扩展支持 MCP 协议",
          features: ["语法高亮", "代码补全", "调试支持", "插件生态"],
          status: "扩展支持",
          link: "https://marketplace.visualstudio.com/vscode"
        },
        {
          name: "JetBrains IDEs",
          icon: <SiJetbrains className="w-12 h-12 text-black dark:text-white" />,
          description: "IntelliJ、PyCharm、WebStorm 等的 MCP 集成",
          features: ["智能代码分析", "重构工具", "版本控制", "团队协作"],
          status: "官方插件",
          link: "https://github.com/JetBrains/mcp-jetbrains"
        }
      ]
    },
    {
      category: "数据库集成",
      description: "与各种数据库系统的连接",
      items: [
        {
          name: "MySQL",
          icon: <FaDatabase className="w-12 h-12 text-orange-600" />,
          description: "MySQL 数据库的 MCP 服务器实现",
          features: ["查询执行", "模式检查", "数据导出", "安全访问"],
          status: "社区实现",
          link: "https://github.com/designcomputer/mysql_mcp_server"
        },
        {
          name: "PostgreSQL",
          icon: <FaDatabase className="w-12 h-12 text-blue-600" />,
          description: "PostgreSQL 的高级 MCP 集成",
          features: ["复杂查询", "JSON 支持", "全文搜索", "性能分析"],
          status: "社区实现",
          link: "#"
        },
        {
          name: "Qdrant",
          icon: <FaDatabase className="w-12 h-12 text-purple-600" />,
          description: "向量数据库的 MCP 服务器",
          features: ["向量搜索", "语义检索", "AI 嵌入", "相似度计算"],
          status: "官方支持",
          link: "https://github.com/qdrant/mcp-server-qdrant"
        }
      ]
    },
    {
      category: "云服务集成",
      description: "与主流云平台和服务的集成",
      items: [
        {
          name: "AWS",
          icon: <FaCloud className="w-12 h-12 text-orange-600" />,
          description: "Amazon Web Services 的 MCP 连接器",
          features: ["EC2 管理", "S3 存储", "Lambda 函数", "CloudWatch 监控"],
          status: "社区实现",
          link: "#"
        },
        {
          name: "Azure",
          icon: <FaCloud className="w-12 h-12 text-blue-600" />,
          description: "Microsoft Azure 平台集成",
          features: ["虚拟机", "存储服务", "AI 服务", "DevOps 工具"],
          status: "开发中",
          link: "#"
        },
        {
          name: "Google Cloud",
          icon: <FaCloud className="w-12 h-12 text-red-600" />,
          description: "Google Cloud Platform 的 MCP 适配",
          features: ["Compute Engine", "BigQuery", "AI Platform", "Kubernetes"],
          status: "计划中",
          link: "#"
        }
      ]
    },
    {
      category: "协作工具",
      description: "与团队协作平台的集成",
      items: [
        {
          name: "Slack",
          icon: <FaSlack className="w-12 h-12 text-purple-600" />,
          description: "Slack 机器人的 MCP 集成",
          features: ["消息处理", "文件共享", "工作流自动化", "通知管理"],
          status: "社区实现",
          link: "#"
        },
        {
          name: "Discord",
          icon: <FaDiscord className="w-12 h-12 text-indigo-600" />,
          description: "Discord 机器人支持 MCP 协议",
          features: ["语音处理", "文本分析", "用户管理", "频道自动化"],
          status: "社区实现",
          link: "#"
        },
        {
          name: "Notion",
          icon: <SiNotion className="w-12 h-12 text-black dark:text-white" />,
          description: "Notion 工作空间的 MCP 连接",
          features: ["页面创建", "数据库操作", "内容生成", "知识管理"],
          status: "开发中",
          link: "#"
        }
      ]
    },
    {
      category: "开发工具",
      description: "与开发工作流的集成",
      items: [
        {
          name: "GitHub",
          icon: <FaGithub className="w-12 h-12 text-black dark:text-white" />,
          description: "GitHub 仓库和 API 的 MCP 集成",
          features: ["代码审查", "Issue 管理", "PR 自动化", "CI/CD 集成"],
          status: "社区实现",
          link: "#"
        },
        {
          name: "Docker",
          icon: <FaDocker className="w-12 h-12 text-blue-600" />,
          description: "容器化环境的 MCP 支持",
          features: ["镜像管理", "容器操作", "网络配置", "存储管理"],
          status: "社区实现",
          link: "#"
        },
        {
          name: "Figma",
          icon: <div className="w-12 h-12 bg-purple-600 rounded flex items-center justify-center text-white font-bold">F</div>,
          description: "设计工具的 MCP 集成",
          features: ["设计读取", "组件生成", "原型分析", "自动化设计"],
          status: "社区实现",
          link: "https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp"
        }
      ]
    }
  ];

  const useCases = [
    {
      title: "智能代码助手",
      description: "结合多个 MCP 服务器，创建全能的编程助手",
      technologies: ["Claude Desktop", "GitHub MCP", "Database MCP", "Documentation MCP"],
      benefits: ["代码生成", "数据库查询", "文档生成", "项目理解"]
    },
    {
      title: "自动化 DevOps",
      description: "通过 MCP 协议自动化部署和监控流程",
      technologies: ["AWS MCP", "Docker MCP", "Slack MCP", "Monitoring MCP"],
      benefits: ["自动部署", "状态监控", "故障通知", "资源管理"]
    },
    {
      title: "智能客服系统",
      description: "构建基于 MCP 的客户服务解决方案",
      technologies: ["Discord MCP", "Database MCP", "Knowledge Base MCP", "Analytics MCP"],
      benefits: ["自动回复", "知识检索", "问题分类", "服务分析"]
    },
    {
      title: "内容创作助手",
      description: "利用 MCP 集成多种内容创作工具",
      technologies: ["Notion MCP", "Image Gen MCP", "Research MCP", "Social Media MCP"],
      benefits: ["内容规划", "素材生成", "研究辅助", "发布自动化"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "官方支持": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "官方插件": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "社区实现": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "扩展支持": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "开发中": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "计划中": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            MCP 集成案例
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            探索 Model Context Protocol 与各种工具、平台和服务的集成示例，了解如何在不同环境中发挥 MCP 的强大能力
          </p>
        </section>

        {/* 集成案例展示 */}
        <div className="space-y-12">
          {integrations.map((category, categoryIndex) => (
            <section key={categoryIndex} className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {category.category}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {category.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <div className="mr-4">
                        {item.icon}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {item.description}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">主要功能：</h4>
                      <ul className="space-y-1">
                        {item.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                            <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {item.link !== "#" && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium"
                      >
                        了解更多
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* 应用场景 */}
        <section className="mt-16 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              实际应用场景
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              看看 MCP 集成如何解决真实世界的问题
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {useCase.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">技术栈：</h4>
                  <div className="flex flex-wrap gap-2">
                    {useCase.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">核心优势：</h4>
                  <ul className="space-y-1">
                    {useCase.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 开始集成 */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-center text-white mt-12">
          <h2 className="text-3xl font-bold mb-4">
            开始您的 MCP 集成之旅
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            选择适合您项目的集成方案，或者创建自己的 MCP 服务器来扩展现有工具的功能
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/development-guides"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              查看开发指南
            </a>
            <a
              href="/projects"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              浏览项目示例
            </a>
          </div>
        </section>
      </div>
    </div>
  );
} 