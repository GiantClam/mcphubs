'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCode, FaRocket, FaUsers, FaSearch } from 'react-icons/fa';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  // Listen to scroll, show/hide bottom navigation on mobile
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Hide navigation when near bottom
      const isNearBottom = scrollY + windowHeight >= documentHeight - 100;
      setIsVisible(!isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: FaHome,
      active: pathname === '/'
    },
    {
      href: '/projects',
      label: 'Projects',
      icon: FaCode,
      active: pathname.startsWith('/projects')
    },
    {
      href: '/servers',
      label: 'Servers',
      icon: FaRocket,
      active: pathname.startsWith('/servers')
    },
    {
      href: '/community',
      label: 'Community',
      icon: FaUsers,
      active: pathname.startsWith('/community')
    },
    {
      href: '/search',
      label: 'Search',
      icon: FaSearch,
      active: pathname.startsWith('/search')
    }
  ];

  return (
    <div 
      className={`mobile-bottom-nav fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center px-2 z-50 transition-transform duration-300 md:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-bottom-nav-item flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] justify-center ${
              item.active
                ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
