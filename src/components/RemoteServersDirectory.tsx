'use client';

import { useEffect, useState } from 'react';

type RemoteServer = {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  homepage?: string;
  connect_url?: string;
  auth_type?: string;
  tags?: string[];
};

export default function RemoteServersDirectory({ initialItems }: { initialItems?: RemoteServer[] }) {
  const [items, setItems] = useState<RemoteServer[]>(initialItems || []);
  const [loading, setLoading] = useState(!initialItems);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const encodeBase64Utf8 = (str: string) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch {
      return btoa(str);
    }
  };

  const buildCursorDeeplink = (name: string, url?: string) => {
    const config = { url };
    const encoded = encodeBase64Utf8(JSON.stringify(config));
    const qName = encodeURIComponent((name || '').toLowerCase());
    return `cursor://anysphere.cursor-deeplink/mcp/install?name=${qName}&config=${encoded}`;
  };

  const buildVsCodeDeeplink = (name: string, url?: string) => {
    const payload = encodeURIComponent(JSON.stringify({ name: (name || '').toLowerCase(), url }));
    return `vscode:mcp/install?${payload}`;
  };

  const buildVsCodeConfigJson = (name: string, url?: string) => {
    const key = (name || 'remote').toLowerCase();
    // A conservative settings shape to paste into VS Code settings.json
    return `{
  "mcp.remoteServers": {
    "${key}": {
      "url": "${url || ''}"
    }
  }
}`;
  };

  useEffect(() => {
    if (initialItems && initialItems.length > 0) return; // already have SSR data
    async function fetchData() {
      try {
        const res = await fetch('/api/remote-servers');
        const json = await res.json();
        setItems(json.data || []);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((s) => (
        <div key={s.id} className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{s.name}</h3>
                {s.tags?.includes('community') && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 flex items-center">
                    <svg viewBox="0 0 576 512" className="w-4 h-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/></svg>
                    <span className="ml-1">社区项目</span>
                  </span>
                )}
              </div>
              {s.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{s.description}</p>
              )}
              <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded">
                {s.auth_type ? s.auth_type : 'Remote'}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">服务器端点</label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono">{s.connect_url || s.homepage}</code>
              <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="复制端点" onClick={() => navigator.clipboard.writeText(s.connect_url || s.homepage || '')}>
                <svg viewBox="0 0 448 512" className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/></svg>
              </button>
            </div>
          </div>

          <div className="flex space-x-2 relative">
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors text-center"
              onClick={() => setOpenMenuId(prev => (prev === s.id ? null : s.id))}
            >
              Connect
            </button>
            {openMenuId === s.id && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <a
                  className="block w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                  href={buildCursorDeeplink(s.name, s.connect_url || s.homepage)}
                  onClick={() => setOpenMenuId(null)}
                >
                  Add to Cursor
                </a>
                <button
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    const cfg = buildVsCodeConfigJson(s.name, s.connect_url || s.homepage);
                    navigator.clipboard.writeText(cfg);
                    setOpenMenuId(null);
                  }}
                >
                  Copy VS Code config
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                  onClick={() => {
                    const type = (s.connect_url || '').startsWith('stdio://') ? 'stdio' : ((s.connect_url || '').includes('/sse') ? 'sse' : 'http');
                    const config = JSON.stringify({ name: s.name, type, url: s.connect_url || s.homepage }, null, 2);
                    navigator.clipboard.writeText(config);
                    setOpenMenuId(null);
                  }}
                >
                  Copy text
                </button>
              </div>
            )}
            {(s.homepage || s.connect_url) && (
              <a href={s.homepage || s.connect_url!} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1">
                <svg viewBox="0 0 512 512" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"/></svg>
                <span>Docs</span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


