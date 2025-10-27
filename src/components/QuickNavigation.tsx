'use client';

import Link from 'next/link';
import { FaBullseye, FaCode, FaBookOpen, FaToolbox, FaArrowRight, FaRocket, FaDatabase, FaFileAlt, FaCloud, FaJs, FaPython, FaTerminal, FaRust } from 'react-icons/fa';

interface NavigationCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavigationItem[];
}

interface NavigationItem {
  label: string;
  href: string;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function QuickNavigation() {
  const categories: NavigationCategory[] = [
    {
      title: 'By Use Case',
      icon: FaBullseye,
      items: [
        { 
          label: 'Web Scraping', 
          href: '/projects?category=web-scraping', 
          count: 25,
          icon: FaRocket
        },
        { 
          label: 'Database Access', 
          href: '/projects?category=database', 
          count: 18,
          icon: FaDatabase
        },
        { 
          label: 'File Management', 
          href: '/projects?category=file-system', 
          count: 22,
          icon: FaFileAlt
        },
        { 
          label: 'Cloud Services', 
          href: '/projects?category=cloud-service', 
          count: 15,
          icon: FaCloud
        }
      ]
    },
    {
      title: 'By Language',
      icon: FaCode,
      items: [
        { 
          label: 'TypeScript', 
          href: '/projects?language=typescript', 
          count: 45,
          icon: FaJs
        },
        { 
          label: 'Python', 
          href: '/projects?language=python', 
          count: 38,
          icon: FaPython
        },
        { 
          label: 'Go', 
          href: '/projects?language=go', 
          count: 12,
          icon: FaTerminal
        },
        { 
          label: 'Rust', 
          href: '/projects?language=rust', 
          count: 8,
          icon: FaRust
        }
      ]
    },
    {
      title: 'Resources',
      icon: FaBookOpen,
      items: [
        { 
          label: 'Getting Started', 
          href: '/what-is-mcp',
          icon: FaRocket
        },
        { 
          label: 'Tutorials', 
          href: '/tutorials',
          icon: FaBookOpen
        },
        { 
          label: 'Best Practices', 
          href: '/guides/best-practices',
          icon: FaBullseye
        },
        { 
          label: 'API Docs', 
          href: '/api-docs',
          icon: FaCode
        }
      ]
    },
    {
      title: 'Tools',
      icon: FaToolbox,
      items: [
        { 
          label: 'Quick Connect', 
          href: '/servers/tools',
          icon: FaRocket
        },
        { 
          label: 'Config Generator', 
          href: '/tools/config-generator',
          icon: FaCode
        },
        { 
          label: 'Compatibility Checker', 
          href: '/tools/compatibility',
          icon: FaBullseye
        },
        { 
          label: 'Code Examples', 
          href: '/tools/code-examples',
          icon: FaBookOpen
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore by Category
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find exactly what you need with our organized collection of MCP resources
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div 
                key={category.title} 
                className="nav-card bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
              >
                <div className="nav-card-header p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <CategoryIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category.title}
                    </h3>
                  </div>
                </div>
                
                <div className="nav-card-items p-6">
                  <ul className="space-y-3">
                    {category.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <li key={item.label}>
                          <Link 
                            href={item.href}
                            className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              {ItemIcon && (
                                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                                  <ItemIcon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                                </div>
                              )}
                              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                                {item.label}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {item.count && (
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">
                                  {item.count}
                                </span>
                              )}
                              <FaArrowRight className="w-3 h-3 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* 快速统计 */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="stat-item">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">200+</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Total Projects</div>
            </div>
            <div className="stat-item">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Categories</div>
            </div>
            <div className="stat-item">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">8+</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Languages</div>
            </div>
            <div className="stat-item">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Auto Updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
