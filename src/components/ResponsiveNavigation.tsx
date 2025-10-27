'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FaBars, FaTimes, FaSearch, FaHome, FaQuestionCircle, FaCode, FaToolbox, FaUsers, FaRocket, FaBookOpen, FaGlobe, FaUser, FaSignOutAlt, FaGithub, FaPlusCircle, FaShieldAlt } from 'react-icons/fa';
import SearchBar from './SearchBar';
import SignInModal from './SignInModal';

interface ResponsiveNavigationProps {
  className?: string;
}

export default function ResponsiveNavigation({ className = '' }: ResponsiveNavigationProps) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // 检查认证配置
  const hasAuthConfig = status !== 'loading';
  const showAuthFeatures = hasAuthConfig;

  // 检查是否为管理员
  const isAdmin = session?.user?.email === 'liulanggoukk@gmail.com';

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 关闭移动菜单
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // 认证相关函数
  const openSignInModal = () => {
    setIsSignInModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  // 防止背景滚动
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // 主菜单项
  const mainMenuItems = [
    { href: '/projects', label: 'Projects', icon: FaCode },
    { href: '/clients', label: 'Clients', icon: FaToolbox },
    { href: '/servers', label: 'Servers', icon: FaRocket },
    { href: '/what-is-mcp', label: 'What is MCP?', icon: FaQuestionCircle },
  ];

  // 快速链接
  const quickLinks = [
    { href: '/servers/tools', label: 'Quick Connect', icon: FaRocket },
    { href: '/development-guides', label: 'Guides', icon: FaBookOpen },
    { href: '/community', label: 'Community', icon: FaUsers },
  ];

  return (
    <>
      {/* 桌面端导航 */}
      <nav className={`desktop-nav hidden md:flex items-center space-x-1 ${className}`}>
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors text-sm whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 移动端导航 */}
      <nav className={`mobile-nav md:hidden ${className}`}>
        {/* 菜单切换按钮 */}
        <button
          className="menu-toggle p-2 rounded-md hover:bg-gray-800 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <motion.div
            animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {mobileMenuOpen ? (
              <FaTimes className="w-5 h-5 text-white" />
            ) : (
              <FaBars className="w-5 h-5 text-white" />
            )}
          </motion.div>
        </button>

        {/* 移动端侧边栏菜单 */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* 背景遮罩 */}
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={closeMobileMenu}
              />

              {/* 侧边栏内容 */}
              <motion.div
                className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-900 shadow-2xl z-50 overflow-y-auto"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <div className="mobile-menu-content p-6">
                  {/* 头部 */}
                  <div className="flex items-center justify-between mb-8">
                    <Link href="/" onClick={closeMobileMenu}>
                      <span className="text-xl font-bold text-purple-400">MCPHubs</span>
                    </Link>
                    <button
                      onClick={closeMobileMenu}
                      className="p-2 rounded-md hover:bg-gray-800 transition-colors"
                      aria-label="Close menu"
                    >
                      <FaTimes className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* 搜索栏 */}
                  <div className="mb-8">
                    <SearchBar 
                      placeholder="Search MCP projects..."
                      showSuggestions={true}
                      className="w-full"
                    />
                  </div>

                  {/* 主菜单 */}
                  <div className="mobile-menu-section mb-8">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                      Explore
                    </h3>
                    <ul className="space-y-2">
                      {mainMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={closeMobileMenu}
                              className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* 快速链接 */}
                  <div className="mobile-menu-section mb-8">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                      Quick Links
                    </h3>
                    <ul className="space-y-2">
                      {quickLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={closeMobileMenu}
                              className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* 认证和工具 */}
                  <div className="mobile-menu-section mb-8">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                      Tools & Account
                    </h3>
                    <ul className="space-y-2">
                      {/* Submit Server */}
                      <li>
                        <Link
                          href="/servers/submit"
                          onClick={closeMobileMenu}
                          className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                        >
                          <FaPlusCircle className="w-5 h-5" />
                          <span className="font-medium">Submit Server</span>
                        </Link>
                      </li>

                      {/* GitHub Link */}
                      <li>
                        <Link
                          href="https://github.com/search?q=model+context+protocol"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={closeMobileMenu}
                          className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                        >
                          <FaGithub className="w-5 h-5" />
                          <span className="font-medium">GitHub</span>
                        </Link>
                      </li>

                      {/* 用户认证 */}
                      {showAuthFeatures && (
                        <>
                          {session ? (
                            <>
                              <li>
                                <Link
                                  href="/profile"
                                  onClick={closeMobileMenu}
                                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                                >
                                  <FaUser className="w-5 h-5" />
                                  <span className="font-medium">Profile</span>
                                </Link>
                              </li>
                              
                              {/* 管理员功能 */}
                              {isAdmin && (
                                <li>
                                  <Link
                                    href="/admin/community-servers"
                                    onClick={closeMobileMenu}
                                    className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors text-yellow-400 hover:text-yellow-300"
                                  >
                                    <FaShieldAlt className="w-5 h-5" />
                                    <span className="font-medium">Review Servers</span>
                                  </Link>
                                </li>
                              )}
                              
                              <li>
                                <button
                                  onClick={() => {
                                    signOut();
                                    closeMobileMenu();
                                  }}
                                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white w-full text-left"
                                >
                                  <FaSignOutAlt className="w-5 h-5" />
                                  <span className="font-medium">Logout</span>
                                </button>
                              </li>
                            </>
                          ) : (
                            <li>
                              <button
                                onClick={() => {
                                  openSignInModal();
                                  closeMobileMenu();
                                }}
                                className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-white w-full text-left"
                              >
                                <FaUser className="w-5 h-5" />
                                <span className="font-medium">Sign In</span>
                              </button>
                            </li>
                          )}
                        </>
                      )}
                    </ul>
                  </div>

                  {/* 语言选择器 */}
                  <div className="mobile-menu-section">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                      Language
                    </h3>
                    <LanguageSwitcher compact />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* 登录模态框 */}
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={closeSignInModal} 
      />
    </>
  );
}

// 语言切换器组件
function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
  ];

  const [currentLang, setCurrentLang] = useState('en');

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setCurrentLang(lang.code)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              currentLang === lang.code
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setCurrentLang(lang.code)}
          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
            currentLang === lang.code
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <span className="text-lg">{lang.flag}</span>
          <span className="font-medium">{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
