'use client';

import React from 'react';
import Link from 'next/link';

interface SkipNavigationProps {
  links?: Array<{
    href: string;
    label: string;
  }>;
}

export default function SkipNavigation({ 
  links = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#search', label: 'Skip to search' },
    { href: '#footer', label: 'Skip to footer' }
  ]
}: SkipNavigationProps) {
  return (
    <nav className="skip-navigation" aria-label="Skip navigation">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className="skip-to-content sr-only-focusable"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
