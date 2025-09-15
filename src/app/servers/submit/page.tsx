'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function SubmitServerPage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [desc, setDesc] = useState('');
  const [install, setInstall] = useState('');
  const [docs, setDocs] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore draft after login
  useEffect(() => {
    try {
      const raw = localStorage.getItem('submit_mcp_server_draft');
      if (raw) {
        const d = JSON.parse(raw);
        setName(d.name || '');
        setEndpoint(d.endpoint || '');
        setDesc(d.description || '');
        setInstall(d.installCommand || '');
        setDocs(d.documentationUrl || '');
      }
    } catch {}
  }, []);

  const onSubmit = async () => {
    try {
      // Require login at submit time
      if (!session && status !== 'loading') {
        const draft = {
          name,
          endpoint,
          description: desc,
          installCommand: install,
          documentationUrl: docs,
        };
        try { localStorage.setItem('submit_mcp_server_draft', JSON.stringify(draft)); } catch {}
        setMsg('Please sign in to submit. Your draft was saved.');
        await signIn(undefined, { callbackUrl: '/servers/submit' });
        return;
      }

      setIsSubmitting(true);
      const res = await fetch('/api/community/submit-server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, endpoint, description: desc, installCommand: install, documentationUrl: docs }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || '提交失败');
      setMsg('Submitted successfully. Thank you!');
      setName(''); setEndpoint(''); setDesc(''); setInstall(''); setDocs('');
      try { localStorage.removeItem('submit_mcp_server_draft'); } catch {}
    } catch (e: any) {
      setMsg(e?.message || 'Submit failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Submit your MCP server</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Share public MCP server endpoints with the community.</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4 max-w-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Server name" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
          <input value={endpoint} onChange={e => setEndpoint(e.target.value)} type="text" placeholder="Server endpoint (stdio:// or https://)" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
        </div>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description and key features" rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={install} onChange={e => setInstall(e.target.value)} type="text" placeholder="Install command (optional)" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
          <input value={docs} onChange={e => setDocs(e.target.value)} type="text" placeholder="Documentation URL (optional)" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
        </div>
        <button disabled={isSubmitting} onClick={onSubmit} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Submit</button>
        {msg && <div className="text-sm text-gray-700 dark:text-gray-300">{msg}</div>}
      </div>
    </div>
  );
}


