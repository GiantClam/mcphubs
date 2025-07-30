import BlogList from '@/components/BlogList';

export const metadata = {
  title: 'MCP Tech Blog - MCPHubs',
  description: 'In-depth analysis of Model Context Protocol technology, sharing the latest industry trends and practical experience.'
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          MCP Tech Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl">
          Explore in-depth technical analysis of Model Context Protocol, share the latest industry trends and practical experience.
          We are committed to providing high-quality original technical content for the MCP community.
        </p>
      </div>

      <BlogList />
    </div>
  );
} 