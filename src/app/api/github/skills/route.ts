import { NextResponse } from 'next/server';
import { getAllClaudeSkills } from '@/lib/supabase';

interface SkillInfo {
  name: string;
  path: string;
  type: 'file' | 'dir';
  downloadUrl: string;
  githubUrl: string;
  description?: string;
}

export async function GET() {
  try {
    // Fetch Claude Skills from database
    const skills = await getAllClaudeSkills();

    // Convert to API response format and filter out hidden/system folders
    const skillsList: SkillInfo[] = skills
      .filter(skill => !skill.name.startsWith('.'))
      .map(skill => ({
        name: skill.name,
        path: skill.path,
        type: 'dir' as const,
        downloadUrl: skill.download_url,
        githubUrl: skill.github_url,
        description: skill.description || undefined,
      }));

    // Get the latest sync time
    const lastSync = skillsList.length > 0 && skills.length > 0
      ? skills.reduce((latest, skill) => {
          const skillTime = new Date(skill.sync_at).getTime();
          const latestTime = latest ? new Date(latest).getTime() : 0;
          return skillTime > latestTime ? skill.sync_at : latest;
        }, skills[0]?.sync_at || null)
      : null;

    return NextResponse.json({
      success: true,
      skills: skillsList,
      total: skillsList.length,
      lastSync,
    });
  } catch (error: any) {
    console.error('Failed to fetch Claude Skills from database:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch skills from database',
        skills: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}

