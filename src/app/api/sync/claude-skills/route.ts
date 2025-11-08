import { NextRequest, NextResponse } from 'next/server';
import { syncClaudeSkillsToDatabase } from '@/lib/claude-skills-sync';

// Validate API key
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || 
                 request.nextUrl.searchParams.get('key');
  const expectedKey = process.env.SYNC_API_KEY;
  
  if (!expectedKey) {
    console.warn('⚠️ SYNC_API_KEY environment variable not set, skipping validation');
    return true; // Allow access if key is not set (development environment)
  }
  
  return apiKey === expectedKey;
}

// Get sync status or execute sync (GET - supports Vercel Cron)
export async function GET(request: NextRequest) {
  try {
    // Check if it's a cron task
    const isCron = request.headers.get('user-agent')?.includes('vercel-cron') || 
                   request.headers.get('x-vercel-cron') === '1';
    
    // Cron tasks directly execute sync, other GET requests return status information
    if (isCron) {
      console.log('🔄 Vercel Cron triggered Claude Skills sync...');
      const result = await syncClaudeSkillsToDatabase(false);
      
      return NextResponse.json({
        success: result.success,
        message: result.message,
        stats: {
          total: result.total,
          inserted: result.inserted,
          updated: result.updated,
          errors: result.errors,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Non-cron requests need API key validation
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API key' },
        { status: 401 }
      );
    }

    // Return sync status information
    return NextResponse.json({
      success: true,
      message: 'Claude Skills sync endpoint',
      endpoints: {
        sync: 'POST /api/sync/claude-skills?key=YOUR_API_KEY',
        cron: 'GET /api/sync/claude-skills (Vercel Cron)',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Failed to get sync status:', error);
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}

// Execute sync task (POST)
export async function POST(request: NextRequest) {
  try {
    // Check if it's a cron task (Vercel Cron sets specific headers)
    const isCron = request.headers.get('user-agent')?.includes('vercel-cron') || 
                   request.headers.get('x-vercel-cron') === '1' ||
                   request.nextUrl.searchParams.get('cron') === '1';
    
    // Cron tasks don't need API key validation, other requests do
    if (!isCron && !validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API key' },
        { status: 401 }
      );
    }

    // Parse request parameters
    const body = await request.json().catch(() => ({}));
    const force = body.force === true;
    const source = isCron ? 'cron' : (body.source || 'manual'); // manual, cron, auto

    console.log(`🔄 Received Claude Skills sync request - Source: ${source}, Force: ${force}`);

    // Execute sync
    console.log('🚀 Starting Claude Skills sync task...');
    const result = await syncClaudeSkillsToDatabase(force);
    
    console.log(`📝 Sync result: ${result.message}`);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      stats: {
        total: result.total,
        inserted: result.inserted,
        updated: result.updated,
        errors: result.errors,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Claude Skills sync failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to sync Claude Skills',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

