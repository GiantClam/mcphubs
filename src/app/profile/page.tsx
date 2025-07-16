'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ClientWrapper from '@/components/ClientWrapper';
import { FaUser, FaEnvelope, FaCalendar, FaGithub } from 'react-icons/fa';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <ClientWrapper>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
          </div>
        </main>
      </ClientWrapper>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <ClientWrapper>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            个人资料
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 个人信息卡片 */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="text-center">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || '用户头像'}
                      width={120}
                      height={120}
                      className="rounded-full mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUser className="w-16 h-16 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {session.user?.name || '未知用户'}
                  </h2>
                  
                  {session.user?.email && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {session.user.email}
                    </p>
                  )}

                  <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                    <FaCalendar className="w-4 h-4 mr-2" />
                    加入时间: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* 详细信息 */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  账户信息
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaUser className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        用户名
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {session.user?.name || '未设置'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaEnvelope className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        邮箱地址
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {session.user?.email || '未设置'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaGithub className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        GitHub账户
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        通过GitHub登录
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 活动统计 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  活动统计
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      0
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      发布的项目
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      0
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      社区评论
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ClientWrapper>
  );
} 