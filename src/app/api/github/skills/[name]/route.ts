import { NextResponse } from 'next/server';
import { getClaudeSkillByName } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const skill = await getClaudeSkillByName(name);
    if (!skill) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      skill: {
        name: skill.name,
        path: skill.path,
        downloadUrl: skill.download_url,
        githubUrl: skill.github_url,
        description: skill.description || null,
        markdown: (skill as any).skill_md || null,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch skill' }, { status: 500 });
  }
}
