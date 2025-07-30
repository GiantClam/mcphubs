'use client';

import { getProviders, signIn, getCsrfToken } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FaGithub } from 'react-icons/fa';
import { useEffect, useState, Suspense } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const [providers, setProviders] = useState<any>(null);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    async function fetchData() {
      const providers = await getProviders();
      const csrfToken = await getCsrfToken();
      setProviders(providers);
      setCsrfToken(csrfToken || '');
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to MCPHubs
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in with your GitHub account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-600">
              Sign in failed, please try again
            </div>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          
          {providers &&
            Object.values(providers).map((provider: any) => (
              <div key={provider.name}>
                <button
                  onClick={() => signIn(provider.id)}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FaGithub className="h-5 w-5" />
                  </span>
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
} 