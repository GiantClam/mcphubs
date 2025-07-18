'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FaHome, FaQuestionCircle, FaUsers, FaChartLine, FaCode, FaToolbox, FaBars, FaTimes, FaStar, FaGithub, FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  // 简化的翻译函数 - 使用固定的英文值
  const t = (key: string): string => {
    const translations: Record<string, string> = {
      'home': 'Home',
      'what-is-mcp': 'What is MCP?',
      'projects': 'Projects',
      'awesome-mcp': 'Awesome MCP',
      'community': 'Community',
      'tools-services': 'Tools & Services',
      'profile': 'Profile',
      'logout': 'Logout',
      'sign-in': 'Sign In'
    };
    return translations[key] || key;
  };

  // 检查是否有认证配置（避免在没有OAuth配置时显示登录按钮）
  const hasAuthConfig = status !== 'loading';
  const showAuthFeatures = hasAuthConfig;

  // 检查是否是管理员
  const isAdmin = session?.user?.email?.includes('admin') || session?.user?.email?.includes('owner');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu') && !target.closest('.tools-menu')) {
        setIsUserMenuOpen(false);
        setIsToolsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleToolsMenu = () => {
    setIsToolsMenuOpen(!isToolsMenuOpen);
  };

  // Main navigation items - displayed on desktop
  const mainNavigationItems = [
    { href: '/', label: t('home'), icon: FaHome },
    { href: '/what-is-mcp', label: t('what-is-mcp'), icon: FaQuestionCircle },
    { href: '/projects', label: t('projects'), icon: FaToolbox },
    { href: '/awesome-mcp-servers', label: t('awesome-mcp'), icon: FaStar },
    { href: '/community', label: t('community'), icon: FaUsers },
  ];

  // Admin navigation items
  const adminNavigationItems = [
    { href: '/admin/sync', label: 'Sync Management', icon: FaChartLine },
  ];

  // Tools and services - in dropdown menu
  const toolsNavigationItems = [
    { href: '/concepts', label: t('concepts'), icon: FaCode },
    { href: '/integrations', label: t('integrations'), icon: FaChartLine },
    { href: '/troubleshooting', label: t('troubleshooting'), icon: FaQuestionCircle },
    { href: '/monitoring', label: t('monitoring'), icon: FaChartLine },
  ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl lg:text-2xl font-bold tracking-tight text-purple-400 hover:text-purple-300 transition-colors flex-shrink-0"
          >
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              MCPHubs
            </span>
          </Link>

          {/* Desktop Navigation - Extra Large screens */}
          <nav className="hidden xl:flex items-center space-x-1">
            {mainNavigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors text-sm whitespace-nowrap"
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Tools & Services Dropdown */}
            <div className="relative">
              <button
                onClick={toggleToolsMenu}
                className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors text-sm whitespace-nowrap"
              >
                <FaToolbox className="w-3 h-3" />
                <span>{t('tools-services')}</span>
                <FaChevronDown className={`w-3 h-3 transition-transform ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-50">
                  {toolsNavigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-700 transition-colors text-sm first:rounded-t-md last:rounded-b-md"
                        onClick={() => setIsToolsMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Admin links */}
            {isAdmin && adminNavigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors text-sm whitespace-nowrap"
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Navigation - Large screens (simplified) */}
          <nav className="hidden lg:flex xl:hidden items-center space-x-1">
            {mainNavigationItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors text-sm"
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side controls */}
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            {/* GitHub Link */}
            <Link
              href="https://github.com/search?q=model+context+protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors text-sm"
            >
              <FaGithub className="w-3 h-3" />
              <span className="hidden xl:block">GitHub</span>
            </Link>

            {/* User Authentication - 只在有配置时显示 */}
            {showAuthFeatures && (
              <>
                {session ? (
                  <div className="relative">
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors"
                    >
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                      </div>
                      <span className="hidden md:block text-sm">{session.user?.name || session.user?.email}</span>
                      <FaChevronDown className="w-3 h-3" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute top-full right-0 mt-1 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-50">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-gray-800 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaUser className="w-5 h-5" />
                          <span>{t('profile')}</span>
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-gray-800 transition-colors w-full text-left"
                        >
                          <FaSignOutAlt className="w-5 h-5" />
                          <span>{t('logout')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md font-medium transition-colors text-sm"
                  >
                    {t('sign-in')}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-xl hover:text-purple-300 transition-colors"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mobile-menu bg-gray-800 rounded-md mt-2 mb-4 shadow-lg">
            <div className="px-4 py-3 space-y-2">
              {mainNavigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-gray-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {toolsNavigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-gray-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Admin links in mobile */}
              {isAdmin && adminNavigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-gray-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="border-t border-gray-700 pt-3">
                <Link
                  href="https://github.com/search?q=model+context+protocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-gray-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaGithub className="w-5 h-5" />
                  <span>GitHub</span>
                </Link>

                {/* 移动端认证部分 - 只在有配置时显示 */}
                {showAuthFeatures && (
                  <>
                    {session ? (
                      <>
                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-gray-700 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FaUser className="w-5 h-5" />
                          <span>{t('profile')}</span>
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-gray-700 transition-colors w-full text-left"
                        >
                          <FaSignOutAlt className="w-5 h-5" />
                          <span>{t('logout')}</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          signIn();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-3 py-3 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors w-full text-left"
                      >
                        <FaUser className="w-5 h-5" />
                        <span>{t('sign-in')}</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 