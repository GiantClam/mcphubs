import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogList from '@/components/BlogList';

export const metadata = {
  title: 'MCP技术博客 - MCPHubs',
  description: '深度解析Model Context Protocol技术，分享最新行业动态和实践经验'
};

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            MCP技术博客
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl">
            探索Model Context Protocol的深度技术解析，分享行业最新动态和实践经验。
            我们致力于为MCP社区提供高质量的原创技术内容。
          </p>
        </div>

        <BlogList />
      </main>

      <Footer />
    </div>
  );
} 