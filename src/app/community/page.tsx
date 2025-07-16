'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Question {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
  votes: number;
  answers: number;
  createdAt: string;
  status: 'open' | 'answered' | 'closed';
}

interface Answer {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  votes: number;
  createdAt: string;
  isAccepted: boolean;
}

const CommunityPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'unanswered'>('latest');

  // 模拟问题数据
  const sampleQuestions: Question[] = [
    {
      id: '1',
      title: '如何在Python中创建一个简单的MCP服务器？',
      content: '我想开始开发MCP服务器，但不知道从哪里开始。有人能提供一个基础的Python示例吗？',
      author: { name: '开发者小王', avatar: '/api/placeholder/40/40' },
      tags: ['Python', 'MCP服务器', '初学者'],
      votes: 15,
      answers: 3,
      createdAt: '2024-01-15T10:30:00Z',
      status: 'answered'
    },
    {
      id: '2',
      title: 'MCP协议中的Tools和Resources有什么区别？',
      content: '在阅读MCP文档时，我对Tools和Resources的概念有些困惑。它们的具体用途和区别是什么？',
      author: { name: '技术爱好者', avatar: '/api/placeholder/40/40' },
      tags: ['MCP协议', '概念理解', 'Tools', 'Resources'],
      votes: 8,
      answers: 2,
      createdAt: '2024-01-14T16:45:00Z',
      status: 'answered'
    },
    {
      id: '3',
      title: '如何在Claude Desktop中配置自定义MCP服务器？',
      content: '我已经开发了一个MCP服务器，但不知道如何在Claude Desktop中正确配置它。配置文件应该怎么写？',
      author: { name: 'AI研究员', avatar: '/api/placeholder/40/40' },
      tags: ['Claude Desktop', '配置', '部署'],
      votes: 12,
      answers: 0,
      createdAt: '2024-01-13T09:20:00Z',
      status: 'open'
    },
    {
      id: '4',
      title: 'MCP服务器的错误处理最佳实践是什么？',
      content: '在开发MCP服务器时，应该如何处理各种错误情况？有推荐的错误处理模式吗？',
      author: { name: '全栈工程师', avatar: '/api/placeholder/40/40' },
      tags: ['错误处理', '最佳实践', '开发经验'],
      votes: 6,
      answers: 1,
      createdAt: '2024-01-12T14:30:00Z',
      status: 'open'
    },
    {
      id: '5',
      title: '如何测试MCP服务器的性能？',
      content: '我想对我的MCP服务器进行性能测试，有什么推荐的工具或方法吗？',
      author: { name: '性能优化师', avatar: '/api/placeholder/40/40' },
      tags: ['性能测试', '工具推荐', '优化'],
      votes: 4,
      answers: 0,
      createdAt: '2024-01-11T11:15:00Z',
      status: 'open'
    }
  ];

  const allTags = ['Python', 'TypeScript', 'MCP服务器', 'Claude Desktop', '初学者', '最佳实践', '错误处理', '性能测试', '配置', '部署'];

  useEffect(() => {
    setQuestions(sampleQuestions);
  }, []);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         q.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === '' || q.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.votes - a.votes;
      case 'unanswered':
        return a.answers - b.answers;
      case 'latest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const QuestionCard = ({ question }: { question: Question }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 
            className="text-xl font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-blue-600"
            onClick={() => router.push(`/community/${question.id}`)}
          >
            {question.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {question.content}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {question.tags.map(tag => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                {question.votes}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                {question.answers}
              </span>
              <span className="flex items-center">
                <img className="w-5 h-5 rounded-full mr-2" src={question.author.avatar} alt={question.author.name} />
                {question.author.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                question.status === 'answered' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : question.status === 'open'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {question.status === 'answered' ? '已回答' : question.status === 'open' ? '开放' : '已关闭'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(question.createdAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const QuestionForm = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">提出问题</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标题</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="请输入问题标题..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">内容</label>
          <textarea 
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="请详细描述你的问题..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标签</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                type="button"
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-blue-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="flex space-x-4">
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            发布问题
          </button>
          <button 
            type="button"
            className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            onClick={() => setShowQuestionForm(false)}
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">社区论坛</h1>
          <p className="text-gray-600 dark:text-gray-300">
            与其他开发者交流 MCP 开发经验，提问解答，分享最佳实践
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索问题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">所有标签</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular' | 'unanswered')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="latest">最新</option>
              <option value="popular">热门</option>
              <option value="unanswered">未回答</option>
            </select>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setShowQuestionForm(true)}
            >
              提出问题
            </button>
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => {
                setSearchTerm('');
                setSelectedTag('');
                setSortBy('latest');
              }}
            >
              清除筛选
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            显示 {sortedQuestions.length} 个问题
          </div>
        </div>

        {/* 问题表单 */}
        {showQuestionForm && session && <QuestionForm />}

        {/* 未登录提示 */}
        {showQuestionForm && !session && (
          <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200">
              请先登录后再提问。
            </p>
          </div>
        )}

        {/* 问题列表 */}
        <div className="space-y-4">
          {sortedQuestions.map(question => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>

        {/* 空状态 */}
        {sortedQuestions.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无问题</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || selectedTag ? '没有找到匹配的问题' : '成为第一个提问的人吧！'}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CommunityPage; 