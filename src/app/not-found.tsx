import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">404 - Not Found</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        The page or project you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
} 