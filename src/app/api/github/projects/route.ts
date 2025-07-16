import { NextResponse } from 'next/server';
import { searchMCPProjects } from '@/lib/github';

export async function GET() {
  try {
    const projects = await searchMCPProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('API 错误:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
} 