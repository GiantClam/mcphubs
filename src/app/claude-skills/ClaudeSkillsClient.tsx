'use client';

import { useState, useEffect } from 'react';
import { FaDownload, FaGithub, FaSpinner, FaSearch, FaFolder } from 'react-icons/fa';

interface SkillInfo {
  name: string;
  path: string;
  type: 'file' | 'dir';
  downloadUrl: string;
  githubUrl: string;
  description?: string;
}

interface SkillsResponse {
  success: boolean;
  skills: SkillInfo[];
  total: number;
  lastSync?: string | null;
  error?: string;
}

export default function ClaudeSkillsClient() {
  const [skills, setSkills] = useState<SkillInfo[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<SkillInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSkills(skills);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredSkills(
        skills.filter(skill => 
          skill.name.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, skills]);

  async function fetchSkills() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/github/skills');
      const data: SkillsResponse = await response.json();
      
      if (data.success) {
        setSkills(data.skills);
        setFilteredSkills(data.skills);
        setLastSync(data.lastSync || null);
      } else {
        setError(data.error || 'Failed to fetch skills');
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to fetch skills. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FaSpinner className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading Claude Skills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
          Failed to Load
        </h3>
        <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
        <button
          onClick={fetchSkills}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Statistics */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Found <span className="font-semibold text-purple-600 dark:text-purple-400">{filteredSkills.length}</span> skills
          </div>
          {lastSync && (
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Last synced: {new Date(lastSync).toLocaleString('en-US')}
            </div>
          )}
        </div>
      </div>

      {/* Skills List */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'No matching skills found' : 'No skills available'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <a
              key={skill.name}
              href={`/claude-skills/${encodeURIComponent(skill.name)}`}
              className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3 flex-1">
                  <FaFolder className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {skill.name}
                    </h3>
                    {skill.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {skill.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-purple-600 dark:text-purple-400">View details →</div>
            </a>
          ))}
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          💡 How to Use
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>Click the &ldquo;Download Zip&rdquo; button to download the complete skill folder using Downgit</li>
          <li>Extract the downloaded file and place the skill folder in a location accessible to Claude</li>
          <li>Enable the skill in the Claude application or add it to your Claude Code project</li>
          <li>The skill will automatically load and be used when relevant to tasks</li>
        </ol>
      </div>
    </div>
  );
}

