'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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

const QuestionDetailPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');

  // 模拟数据
  const sampleQuestions: Question[] = [
    {
      id: '1',
      title: '如何在Python中创建一个简单的MCP服务器？',
      content: `我想开始开发MCP服务器，但不知道从哪里开始。有人能提供一个基础的Python示例吗？

我尝试阅读了官方文档，但感觉有些复杂。希望能有一个简单的入门示例，包括：
1. 基本的项目结构
2. 必要的依赖项
3. 简单的服务器实现
4. 如何测试服务器

谢谢大家的帮助！`,
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
      content: `在阅读MCP文档时，我对Tools和Resources的概念有些困惑。它们的具体用途和区别是什么？

具体来说：
- Tools是用来做什么的？
- Resources是用来做什么的？
- 它们之间有什么关系？
- 在什么情况下使用哪一个？

希望有经验的开发者能够解释一下。`,
      author: { name: '技术爱好者', avatar: '/api/placeholder/40/40' },
      tags: ['MCP协议', '概念理解', 'Tools', 'Resources'],
      votes: 8,
      answers: 2,
      createdAt: '2024-01-14T16:45:00Z',
      status: 'answered'
    }
  ];

  const sampleAnswers: { [key: string]: Answer[] } = {
    '1': [
      {
        id: 'a1',
        content: `这是一个简单的MCP服务器Python示例：

\`\`\`python
# server.py
from mcp import Server, get_model_capabilities
from mcp.server.models import InitializationOptions
import asyncio

# 创建服务器实例
server = Server("my-mcp-server")

@server.list_tools()
async def handle_list_tools():
    return [
        {
            "name": "echo",
            "description": "重复输入的文本",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "text": {"type": "string"}
                },
                "required": ["text"]
            }
        }
    ]

@server.call_tool()
async def handle_call_tool(name: str, arguments: dict):
    if name == "echo":
        return {"content": [{"type": "text", "text": f"Echo: {arguments['text']}"}]}
    else:
        raise ValueError(f"Unknown tool: {name}")

if __name__ == "__main__":
    import mcp.server.stdio
    mcp.server.stdio.run_server(server)
\`\`\`

这个示例展示了最基本的MCP服务器结构，包括：
1. 服务器初始化
2. 工具列表处理
3. 工具调用处理
4. 运行服务器

希望这能帮助你入门！`,
        author: { name: 'MCP专家', avatar: '/api/placeholder/40/40' },
        votes: 12,
        createdAt: '2024-01-15T14:20:00Z',
        isAccepted: true
      },
      {
        id: 'a2',
        content: `补充一下依赖项安装和项目结构：

**1. 安装依赖：**
\`\`\`bash
pip install mcp
\`\`\`

**2. 项目结构：**
\`\`\`
my-mcp-server/
├── server.py
├── requirements.txt
└── README.md
\`\`\`

**3. requirements.txt：**
\`\`\`
mcp>=0.1.0
\`\`\`

**4. 测试方法：**
你可以使用MCP客户端工具或者直接在Claude Desktop中配置测试。

配置文件示例：
\`\`\`json
{
  "mcpServers": {
    "my-server": {
      "command": "python",
      "args": ["path/to/server.py"]
    }
  }
}
\`\`\``,
        author: { name: 'Python开发者', avatar: '/api/placeholder/40/40' },
        votes: 8,
        createdAt: '2024-01-15T16:45:00Z',
        isAccepted: false
      }
    ],
    '2': [
      {
        id: 'a3',
        content: `Tools和Resources的区别：

**Tools（工具）：**
- 用于执行操作或计算
- 接受输入参数，返回结果
- 类似于函数调用
- 例如：计算器、文件操作、API调用

**Resources（资源）：**
- 用于提供数据或信息
- 通常是只读的
- 可以是文件、数据库记录、网页内容等
- 例如：配置文件、文档、数据集

**关系：**
- Tools可以操作Resources
- Resources为Tools提供数据
- 它们是互补的概念

**使用场景：**
- 需要执行操作时使用Tools
- 需要获取信息时使用Resources

希望这能帮助你理解！`,
        author: { name: 'MCP架构师', avatar: '/api/placeholder/40/40' },
        votes: 10,
        createdAt: '2024-01-14T18:30:00Z',
        isAccepted: true
      }
    ]
  };

  useEffect(() => {
    // 模拟数据加载
    const questionId = params.id as string;
    const foundQuestion = sampleQuestions.find(q => q.id === questionId);
    setQuestion(foundQuestion || null);
    setAnswers(sampleAnswers[questionId] || []);
    setLoading(false);
  }, [params.id]);

  const handleVote = (type: 'up' | 'down', targetId: string, isQuestion: boolean = false) => {
    if (isQuestion && question) {
      setQuestion({
        ...question,
        votes: question.votes + (type === 'up' ? 1 : -1)
      });
    } else {
      setAnswers(prev => prev.map(answer => 
        answer.id === targetId 
          ? { ...answer, votes: answer.votes + (type === 'up' ? 1 : -1) }
          : answer
      ));
    }
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim() || !session) return;

    const answer: Answer = {
      id: Date.now().toString(),
      content: newAnswer,
      author: {
        name: session.user?.name || '匿名用户',
        avatar: session.user?.image || '/api/placeholder/40/40'
      },
      votes: 0,
      createdAt: new Date().toISOString(),
      isAccepted: false
    };

    setAnswers(prev => [...prev, answer]);
    setNewAnswer('');
    setShowAnswerForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">问题不存在</h1>
            <button
              onClick={() => router.push('/community')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              返回论坛
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <button
          onClick={() => router.push('/community')}
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回论坛
        </button>

        {/* 问题详情 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img 
                className="w-12 h-12 rounded-full" 
                src={question.author.avatar} 
                alt={question.author.name} 
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{question.author.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(question.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              question.status === 'answered' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : question.status === 'open'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {question.status === 'answered' ? '已回答' : question.status === 'open' ? '开放' : '已关闭'}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {question.title}
          </h1>

          <div className="prose dark:prose-invert max-w-none mb-4">
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {question.content}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleVote('up', question.id, true)}
                className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {question.votes}
              </span>
              <button
                onClick={() => handleVote('down', question.id, true)}
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              {answers.length} 个回答
            </div>
          </div>
        </div>

        {/* 回答部分 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              回答 ({answers.length})
            </h2>
            <button
              onClick={() => setShowAnswerForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              写回答
            </button>
          </div>

          {/* 回答表单 */}
          {showAnswerForm && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">写回答</h3>
              {session ? (
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="请输入你的回答..."
                    required
                  />
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      发布回答
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAnswerForm(false)}
                      className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  请先登录后再回答问题。
                </p>
              )}
            </div>
          )}

          {/* 回答列表 */}
          <div className="space-y-4">
            {answers.map(answer => (
              <div key={answer.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center space-y-1">
                    <button
                      onClick={() => handleVote('up', answer.id)}
                      className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {answer.votes}
                    </span>
                    <button
                      onClick={() => handleVote('down', answer.id)}
                      className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {answer.isAccepted && (
                      <svg className="w-6 h-6 text-green-500 mt-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        className="w-8 h-8 rounded-full" 
                        src={answer.author.avatar} 
                        alt={answer.author.name} 
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {answer.author.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(answer.createdAt).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      {answer.isAccepted && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                          已采纳
                        </span>
                      )}
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {answer.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {answers.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无回答</h3>
              <p className="text-gray-500 dark:text-gray-400">
                成为第一个回答这个问题的人！
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuestionDetailPage; 