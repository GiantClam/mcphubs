'use client';

import { useEffect, useState, type ReactElement } from 'react';
import { FaApple, FaWindows, FaLinux, FaGlobe } from 'react-icons/fa';

type Client = {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  homepage?: string;
  support_level?: string;
  platforms?: string[];
  features?: string[];
};

export default function ClientsPage() {
  const [items, setItems] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const supportColor = (level?: string): string => {
    switch ((level || '').toLowerCase()) {
      case 'full':
        return 'bg-green-600';
      case 'partial':
        return 'bg-yellow-500';
      case 'experimental':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const renderPlatforms = (platforms?: string[]) => {
    if (!platforms || platforms.length === 0) return null;
    const normalized = platforms.map(p => p.toLowerCase());
    const icons: ReactElement[] = [];
    if (normalized.some(p => p.includes('mac'))) icons.push(<FaApple key="mac" className="w-4 h-4" title="macOS" />);
    if (normalized.some(p => p.includes('win'))) icons.push(<FaWindows key="win" className="w-4 h-4" title="Windows" />);
    if (normalized.some(p => p.includes('linux'))) icons.push(<FaLinux key="linux" className="w-4 h-4" title="Linux" />);
    if (normalized.some(p => p.includes('web') || p.includes('browser'))) icons.push(<FaGlobe key="web" className="w-4 h-4" title="Web" />);
    if (icons.length === 0) return null;
    return (
      <div className="flex items-center gap-2 text-gray-300" aria-label="Supported platforms">
        {icons}
      </div>
    );
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/clients');
        const json = await res.json();
        setItems(json.data || []);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">MCP Clients</h1>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => (
            <div key={c.id} className="relative bg-gray-900 border border-gray-800 rounded-lg p-4">
              {/* 支持级别角标 */}
              <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full text-white ${supportColor(c.support_level)}`}>
                {c.support_level || 'unknown'}
              </span>

              <div className="flex items-center mb-2">
                {c.logo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.logo_url} alt={c.name} className="w-8 h-8 mr-2 rounded" />
                )}
                <div className="font-medium">{c.name}</div>
              </div>
              {c.description && <p className="text-sm text-gray-300 mb-2">{c.description}</p>}
              <div className="flex items-center justify-between mt-2">
                {renderPlatforms(c.platforms)}
                {c.features?.length ? (
                  <div className="text-[10px] text-gray-400 truncate max-w-[50%]" title={c.features.join(', ')}>
                    {c.features.slice(0, 2).join(', ')}{c.features.length > 2 ? '…' : ''}
                  </div>
                ) : <span />}
              </div>
              {c.homepage && (
                <a href={c.homepage} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm text-blue-400 hover:underline">Visit</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


