'use client';

import { Suspense } from 'react';
import SearchInterface from '@/components/SearchInterface';

function SearchPageContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Project Search
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Search and discover Model Context Protocol related projects
        </p>
      </div>
      <SearchInterface />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
} 