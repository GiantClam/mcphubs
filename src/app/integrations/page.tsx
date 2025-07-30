import { FaCode, FaDatabase, FaCloud, FaRobot, FaGithub, FaDocker, FaSlack, FaDiscord, FaTelegram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { SiJetbrains, SiNotion, SiObsidian, SiFilezilla, SiElasticsearch, SiGrafana } from 'react-icons/si';

export const metadata = {
  title: 'MCP Integration Examples - MCPHubs',
  description: 'Explore Model Context Protocol integration examples with various tools and platforms, learn how to use MCP in different environments'
};

export default function IntegrationsPage() {
  const integrations = [
    {
      category: "AI Programming Tools",
      description: "Integration with mainstream AI programming assistants",
      items: [
        {
          name: "Claude Desktop",
          icon: <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">C</div>,
          description: "Anthropic's official AI assistant client with native MCP support",
          features: ["Native MCP Support", "Tool Calling", "Resource Access", "Prompt Management"],
          status: "Official Support",
          link: "https://claude.ai/desktop"
        },
        {
          name: "Cursor",
          icon: <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">⚡</div>,
          description: "AI code editor with MCP extension capabilities",
          features: ["Code Generation", "Project Understanding", "Documentation Generation", "Code Refactoring"],
          status: "Community Support",
          link: "https://cursor.sh"
        },
        {
          name: "Windsurf",
          icon: <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">🏄</div>,
          description: "AI development environment with integrated MCP toolchain",
          features: ["Full-stack Development", "Real-time Collaboration", "Smart Suggestions", "Automated Testing"],
          status: "Community Support",
          link: "https://windsurf.dev"
        }
      ]
    },
    {
      category: "IDE Integration",
      description: "Deep integration with integrated development environments",
      items: [
        {
          name: "VS Code",
          icon: <FaCode className="w-12 h-12 text-blue-600" />,
          description: "MCP protocol support through extensions",
          features: ["Syntax Highlighting", "Code Completion", "Debug Support", "Plugin Ecosystem"],
          status: "Extension Support",
          link: "https://marketplace.visualstudio.com/vscode"
        },
        {
          name: "JetBrains IDEs",
          icon: <SiJetbrains className="w-12 h-12 text-black dark:text-white" />,
          description: "MCP integration for IntelliJ, PyCharm, WebStorm, etc.",
          features: ["Smart Code Analysis", "Refactoring Tools", "Version Control", "Team Collaboration"],
          status: "Official Plugin",
          link: "https://github.com/JetBrains/mcp-jetbrains"
        }
      ]
    },
    {
      category: "Database Integration",
      description: "Connection with various database systems",
      items: [
        {
          name: "MySQL",
          icon: <FaDatabase className="w-12 h-12 text-orange-600" />,
          description: "MCP server implementation for MySQL database",
          features: ["Query Execution", "Schema Inspection", "Data Export", "Secure Access"],
          status: "Community Implementation",
          link: "https://github.com/designcomputer/mysql_mcp_server"
        },
        {
          name: "PostgreSQL",
          icon: <FaDatabase className="w-12 h-12 text-blue-600" />,
          description: "Advanced MCP integration for PostgreSQL",
          features: ["Complex Queries", "JSON Support", "Full-text Search", "Performance Analysis"],
          status: "Community Implementation",
          link: "#"
        },
        {
          name: "Qdrant",
          icon: <FaDatabase className="w-12 h-12 text-purple-600" />,
          description: "MCP server for vector database",
          features: ["Vector Search", "Semantic Retrieval", "AI Embeddings", "Similarity Calculation"],
          status: "Official Support",
          link: "https://github.com/qdrant/mcp-server-qdrant"
        }
      ]
    },
    {
      category: "Cloud Services Integration",
      description: "Integration with mainstream cloud platforms and services",
      items: [
        {
          name: "AWS",
          icon: <FaCloud className="w-12 h-12 text-orange-600" />,
          description: "MCP connector for Amazon Web Services",
          features: ["EC2 Management", "S3 Storage", "Lambda Functions", "CloudWatch Monitoring"],
          status: "Community Implementation",
          link: "#"
        },
        {
          name: "Azure",
          icon: <FaCloud className="w-12 h-12 text-blue-600" />,
          description: "Microsoft Azure platform integration",
          features: ["Virtual Machines", "Storage Services", "AI Services", "DevOps Tools"],
          status: "In Development",
          link: "#"
        },
        {
          name: "Google Cloud",
          icon: <FaCloud className="w-12 h-12 text-red-600" />,
          description: "MCP adaptation for Google Cloud Platform",
          features: ["Compute Engine", "BigQuery", "AI Platform", "Kubernetes"],
          status: "Planned",
          link: "#"
        }
      ]
    },
    {
      category: "Collaboration Tools",
      description: "Integration with team collaboration platforms",
      items: [
        {
          name: "Slack",
          icon: <FaSlack className="w-12 h-12 text-purple-600" />,
          description: "MCP integration for Slack bots",
          features: ["Message Processing", "File Sharing", "Workflow Automation", "Notification Management"],
          status: "Community Implementation",
          link: "#"
        },
        {
          name: "Discord",
          icon: <FaDiscord className="w-12 h-12 text-indigo-600" />,
          description: "Discord bot with MCP protocol support",
          features: ["Voice Processing", "Text Analysis", "User Management", "Channel Automation"],
          status: "Community Implementation",
          link: "#"
        },
        {
          name: "Notion",
          icon: <SiNotion className="w-12 h-12 text-black dark:text-white" />,
          description: "MCP connection for Notion workspace",
          features: ["Page Creation", "Database Operations", "Content Generation", "Knowledge Management"],
          status: "In Development",
          link: "#"
        }
      ]
    },
    {
      category: "Development Tools",
      description: "Integration with development workflows",
      items: [
        {
          name: "GitHub",
          icon: <FaGithub className="w-12 h-12 text-black dark:text-white" />,
          description: "MCP integration for GitHub repositories and API",
          features: ["Code Review", "Issue Management", "PR Automation", "CI/CD Integration"],
          status: "Community Implementation",
          link: "#"
        },
        {
          name: "Docker",
          icon: <FaDocker className="w-12 h-12 text-blue-600" />,
          description: "MCP support for containerized environments",
          features: ["Image Management", "Container Operations", "Network Configuration", "Storage Management"],
          status: "Community Implementation",
          link: "#"
        },
        {
          name: "Figma",
          icon: <div className="w-12 h-12 bg-purple-600 rounded flex items-center justify-center text-white font-bold">F</div>,
          description: "MCP integration for design tools",
          features: ["Design Reading", "Component Generation", "Prototype Analysis", "Automated Design"],
          status: "Community Implementation",
          link: "https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp"
        }
      ]
    }
  ];

  const useCases = [
    {
      title: "Intelligent Code Assistant",
      description: "Combine multiple MCP servers to create a comprehensive programming assistant",
      technologies: ["Claude Desktop", "GitHub MCP", "Database MCP", "Documentation MCP"],
      benefits: ["Code Generation", "Database Queries", "Documentation Generation", "Project Understanding"]
    },
    {
      title: "Automated DevOps",
      description: "Automate deployment and monitoring processes through MCP protocol",
      technologies: ["AWS MCP", "Docker MCP", "Slack MCP", "Monitoring MCP"],
      benefits: ["Automated Deployment", "Status Monitoring", "Failure Notifications", "Resource Management"]
    },
    {
      title: "Intelligent Customer Service",
      description: "Build MCP-based customer service solutions",
      technologies: ["Discord MCP", "Database MCP", "Knowledge Base MCP", "Analytics MCP"],
      benefits: ["Auto Reply", "Knowledge Retrieval", "Issue Classification", "Service Analytics"]
    },
    {
      title: "Content Creation Assistant",
      description: "Leverage MCP to integrate multiple content creation tools",
      technologies: ["Notion MCP", "Image Gen MCP", "Research MCP", "Social Media MCP"],
      benefits: ["Content Planning", "Asset Generation", "Research Assistance", "Publishing Automation"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Official Support": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Official Plugin": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Community Implementation": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Extension Support": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "In Development": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Planned": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            MCP Integration Examples
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore Model Context Protocol integration examples with various tools, platforms, and services, understand how to leverage MCP's powerful capabilities in different environments
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
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Features:</h4>
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
                        Learn More
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
              Real-world Application Scenarios
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See how MCP integration solves real-world problems
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
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-2">
                    {useCase.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Core Benefits:</h4>
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
            Start Your MCP Integration Journey
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Choose integration solutions suitable for your project, or create your own MCP server to extend existing tool capabilities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/development-guides"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Development Guides
            </a>
            <a
              href="/projects"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Browse Project Examples
            </a>
          </div>
        </section>
      </div>
    </div>
  );
} 