'use client';

import { useState, useRef, useEffect } from 'react';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';
import { highValueLocales, getCurrentLocale, type highValueLocales as HighValueLocales } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<keyof typeof highValueLocales>('en-US');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentLocale(getCurrentLocale());
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (locale: keyof typeof highValueLocales) => {
    setCurrentLocale(locale);
    setIsOpen(false);
    
    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', locale);
    }
    
    // 构建新的URL
    const currentPath = window.location.pathname;
    const currentLang = highValueLocales[currentLocale];
    const newLang = highValueLocales[locale];
    
    let newPath = currentPath;
    
    // 移除当前语言前缀
    if (currentLang.code !== 'zh-CN') {
      const prefix = `/${currentLang.code.toLowerCase().replace('-', '-')}`;
      if (currentPath.startsWith(prefix)) {
        newPath = currentPath.replace(prefix, '');
      }
    }
    
    // 添加新语言前缀
    if (newLang.code !== 'zh-CN') {
      const newPrefix = `/${newLang.code.toLowerCase().replace('-', '-')}`;
      newPath = newPrefix + newPath;
    }
    
    // 确保路径以/开头
    if (!newPath.startsWith('/')) {
      newPath = '/' + newPath;
    }
    
    // 导航到新URL
    window.location.href = newPath;
  };

  // 按优先级排序语言（高价值地区优先）
  const sortedLocales = Object.entries(highValueLocales)
    .sort((a, b) => b[1].priority - a[1].priority)
    .map(([key]) => key as keyof typeof highValueLocales);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-800 hover:text-purple-300 transition-colors"
        aria-label="Select language"
      >
        <FaGlobe className="w-4 h-4" />
        <span className="hidden sm:inline">{highValueLocales[currentLocale].flag}</span>
        <span className="hidden md:inline">{highValueLocales[currentLocale].nativeName}</span>
        <FaChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          {sortedLocales.map((locale) => {
            const localeData = highValueLocales[locale];
            const isActive = locale === currentLocale;
            
            return (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{localeData.flag}</span>
                  <div>
                    <div className="font-medium">{localeData.nativeName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {localeData.name} • {localeData.region} • {localeData.currency}
                    </div>
                  </div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </button>
            );
          })}
          
          <div className="px-4 py-2 mt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            💡 针对开发者和高价值市场优化
          </div>
        </div>
      )}
    </div>
  );
} 