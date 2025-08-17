'use client';

import { useState, useEffect } from 'react';
import { signIn, getProviders, getCsrfToken } from 'next-auth/react';
import { FaGithub, FaGoogle, FaTimes, FaSpinner } from 'react-icons/fa';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [providers, setProviders] = useState<any>(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchProviders();
    }
  }, [isOpen]);

  // 添加 ESC 键关闭弹窗
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const fetchProviders = async () => {
    try {
      const providersData = await getProviders();
      const csrfTokenData = await getCsrfToken();
      setProviders(providersData);
      setCsrfToken(csrfTokenData || '');
    } catch (err) {
      console.error('Error fetching providers:', err);
    }
  };

  const handleSignIn = async (providerId: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      await signIn(providerId, { callbackUrl: '/' });
      // 登录成功后关闭弹窗
      onClose();
    } catch (err) {
      setError('登录失败，请重试');
      setIsLoading(false);
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return <FaGithub className="h-5 w-5" />;
      case 'google':
        return <FaGoogle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getProviderName = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return 'GitHub';
      case 'google':
        return 'Google';
      default:
        return providerId;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          disabled={isLoading}
        >
          <FaTimes className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            登录到 MCPHubs
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            选择您的登录方式
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          </div>
        )}

        {/* CSRF Token */}
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        {/* Login buttons */}
        <div className="space-y-3">
          {providers &&
            Object.values(providers).map((provider: any) => (
              <button
                key={provider.id}
                onClick={() => handleSignIn(provider.id)}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <FaSpinner className="h-5 w-5 animate-spin" />
                ) : (
                  getProviderIcon(provider.id)
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  使用 {getProviderName(provider.id)} 登录
                </span>
              </button>
            ))}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            登录即表示您同意我们的服务条款和隐私政策
          </p>
        </div>
      </div>
    </div>
  );
} 