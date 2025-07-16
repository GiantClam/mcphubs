'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaGithub, FaBars, FaTimes, FaHome, FaCode, FaQuestionCircle, FaUsers, FaChartLine, FaToolbox, FaUser, FaSignOutAlt, FaStar, FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleToolsMenu = () => {
    setIsToolsMenuOpen(!isToolsMenuOpen);
  };

  // 主要导航项目 - 在桌面版显示
  const mainNavigationItems = [
    { href: '/', label: '首页', icon: FaHome },
    { href: '/what-is-mcp', label: '什么是MCP?', icon: FaQuestionCircle },
    { href: '/projects', label: '项目展示', icon: FaToolbox },
    { href: '/awesome-mcp-servers', label: 'Awesome MCP', icon: FaStar },
    { href: '/community', label: '社区论坛', icon: FaUsers },
  ];

  // 管理员导航项目
  const adminNavigationItems = [
    { href: '/admin/sync', label: '同步管理', icon: FaChartLine },
  ];

  // 检查是否为管理员
  const isAdmin = session?.user?.email?.includes('admin') || session?.user?.email?.includes('owner');

  // 工具和服务 - 放在下拉菜单中
  const toolsNavigationItems = [
    { href: '/concepts', label: '核心概念', icon: FaCode },
    { href: '/integrations', label: '集成案例', icon: FaChartLine },
    { href: '/troubleshooting', label: '故障排除', icon: FaQuestionCircle },
    { href: '/monitoring', label: '系统监控', icon: FaChartLine },
  ];

  // 移动端显示所有导航项目
  const allNavigationItems = [...mainNavigationItems, ...toolsNavigationItems];

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/" className="text-xl lg:text-2xl font-bold tracking-tight text-purple-400 hover:text-purple-300 transition-colors flex-shrink-0">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              MCPHubs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {mainNavigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors text-sm whitespace-nowrap"
              >
                <item.icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* 管理员导航 */}
            {isAdmin && adminNavigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 hover:text-orange-300 transition-colors text-sm whitespace-nowrap border border-orange-400/30"
              >
                <item.icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* 工具下拉菜单 */}
            <div className="relative">
              <button
                onClick={toggleToolsMenu}
                className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors text-sm whitespace-nowrap"
              >
                <FaToolbox className="w-3 h-3" />
                <span>工具服务</span>
                <FaChevronDown className={`w-3 h-3 transition-transform ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isToolsMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  {toolsNavigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      onClick={() => setIsToolsMenuOpen(false)}
                    >
                      <item.icon className="w-3 h-3" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Simplified Desktop Navigation for Large screens */}
          <nav className="hidden lg:flex xl:hidden items-center space-x-1">
            <Link
              href="/"
              className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors text-sm"
            >
              <FaHome className="w-3 h-3" />
              <span>首页</span>
            </Link>
            <Link
              href="/what-is-mcp"
              className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors text-sm"
            >
              <FaQuestionCircle className="w-3 h-3" />
              <span>MCP</span>
            </Link>
            <Link
              href="/projects"
              className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors text-sm"
            >
              <FaToolbox className="w-3 h-3" />
              <span>项目</span>
            </Link>
            <Link
              href="/community"
              className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors text-sm"
            >
              <FaUsers className="w-3 h-3" />
              <span>社区</span>
            </Link>
          </nav>

          {/* User Actions & Language Switcher */}
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            <LanguageSwitcher />
            
            <Link
              href="https://github.com/search?q=model+context+protocol"
              className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="w-3 h-3" />
              <span className="hidden xl:block">GitHub</span>
            </Link>

            {/* User Authentication */}
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-1 px-2 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || '用户头像'}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <FaUser className="w-4 h-4" />
                  )}
                  <span className="hidden xl:block text-sm">{session.user?.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      个人资料
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      设置
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    >
                      <FaSignOutAlt className="w-3 h-3 inline mr-2" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md font-medium transition-colors text-sm"
              >
                登录
              </button>
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

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t border-gray-800">
            <div className="py-4 space-y-2">
              {allNavigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* 移动端管理员导航 */}
              {isAdmin && (
                <div className="border-t border-gray-800 pt-4 mt-4">
                  <div className="px-4 py-2">
                    <span className="text-xs text-orange-400 font-semibold uppercase tracking-wider">管理功能</span>
                  </div>
                  {adminNavigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-gray-800 hover:text-orange-300 transition-colors border border-orange-400/20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
              
              <div className="border-t border-gray-800 pt-4 mt-4">
                <div className="px-4 py-3">
                  <LanguageSwitcher />
                </div>
                
                <Link
                  href="https://github.com/search?q=model+context+protocol"
                  className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaGithub className="w-5 h-5" />
                  <span>GitHub</span>
                </Link>

                {/* Mobile User Authentication */}
                {status === 'loading' ? (
                  <div className="px-4 py-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
                  </div>
                ) : session ? (
                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-4 py-3">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || '用户头像'}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <FaUser className="w-5 h-5" />
                      )}
                      <span>{session.user?.name}</span>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-gray-800 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUser className="w-5 h-5" />
                      <span>个人资料</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-gray-800 transition-colors w-full text-left"
                    >
                      <FaSignOutAlt className="w-5 h-5" />
                      <span>退出登录</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      signIn();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md font-medium transition-colors mx-4 mb-4"
                  >
                    登录
                  </button>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
} 