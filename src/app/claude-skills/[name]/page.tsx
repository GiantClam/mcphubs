import { Metadata } from 'next';
import { getClaudeSkillByName } from '@/lib/supabase';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const skill = await getClaudeSkillByName(name);
  return {
    title: `${skill?.name || name} - Claude Skill | MCPHubs`,
    description: skill?.description || 'Claude Skills detail',
  };
}

export default async function SkillDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const skill = await getClaudeSkillByName(name);

  if (!skill) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Skill not found</h1>
        <p className="mt-2 text-gray-600">The requested skill does not exist.</p>
        <Link href="/claude-skills" className="text-purple-600 hover:text-purple-800 dark:hover:text-purple-400 mt-4 inline-block">Back to Skills</Link>
      </div>
    );
  }

  const markdown = (skill as any).skill_md as string | null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{skill.name}</h1>
        {skill.description && (
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-3xl">{skill.description}</p>
        )}
        <div className="mt-4 flex gap-3">
          <a
            href={skill.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
          >
            Download Zip
          </a>
          <a
            href={skill.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md"
          >
            View on GitHub
          </a>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        {markdown ? (
          <MarkdownRenderer content={markdown} />
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No SKILL.md content available.</p>
        )}
      </div>
    </div>
  );
}
