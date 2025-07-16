'use client';

import { signIn, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return <FaGithub className="w-5 h-5" />;
      case 'google':
        return <FaGoogle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getProviderColor = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return 'bg-gray-800 hover:bg-gray-900 text-white';
      case 'google':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              登录到 MCPHubs
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              使用您的社交账户登录以享受完整功能
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
            <div className="space-y-4">
              {providers && Object.values(providers).map((provider: any) => (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className={`w-full flex justify-center items-center gap-3 px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors ${getProviderColor(provider.id)}`}
                >
                  {getProviderIcon(provider.id)}
                  使用 {provider.name} 登录
                </button>
              ))}
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    或
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                暂时不想登录？
              </p>
              <button
                onClick={() => window.history.back()}
                className="mt-2 text-purple-600 dark:text-purple-400 hover:text-purple-500 font-medium"
              >
                返回浏览
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              登录即表示您同意我们的
              <a href="/terms" className="text-purple-600 dark:text-purple-400 hover:underline mx-1">
                服务条款
              </a>
              和
              <a href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline mx-1">
                隐私政策
              </a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 