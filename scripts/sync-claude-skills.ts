#!/usr/bin/env node

/**
 * Local script to sync Claude Skills from GitHub to Supabase database
 * 
 * Usage:
 *   npm run sync:claude-skills
 *   npm run sync:claude-skills -- --force
 * 
 * Environment variables required (in .env.local):
 *   - GITHUB_TOKEN (optional, but recommended)
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - GOOGLE_CLOUD_PROJECT_ID or GOOGLE_CLOUD_PROJECT
 *   - GOOGLE_APPLICATION_CREDENTIALS_JSON (JSON string) or GOOGLE_APPLICATION_CREDENTIALS (file path)
 *   - VERTEX_AI_REGION or VERTEX_LOCATION (optional, defaults to us-central1)
 * 
 * Proxy/VPN configuration (optional):
 *   - PROXY_HOST (default: 127.0.0.1) - Proxy host for GitHub API
 *   - PROXY_PORT (default: 7890) - Proxy port for GitHub API
 *   - USE_PROXY (default: true) - Set to 'false' to disable proxy for GitHub API
 *   - USE_VERTEX_PROXY (default: true) - Set to 'false' to use direct connection for Vertex AI
 *   - HTTP_PROXY or HTTPS_PROXY - System proxy for Vertex AI (if not using Next.js proxy)
 *   - NEXT_PUBLIC_API_BASE_URL (default: http://localhost:3000) - Next.js API base URL for Vertex AI proxy
 */

// IMPORTANT: Load environment variables BEFORE importing any modules that depend on them
// This ensures that supabase.ts and other modules can read the environment variables correctly
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
// Try multiple possible locations for .env.local
// When running `npm run sync:claude-skills` from project root, process.cwd() should be mcphubs/
const possiblePaths = [
  resolve(process.cwd(), '.env.local'), // Project root (mcphubs/)
  resolve(process.cwd(), '..', '.env.local'), // Parent directory
];

let envLoaded = false;
for (const envPath of possiblePaths) {
  const result = dotenv.config({ path: envPath, override: false });
  if (!result.error && result.parsed && Object.keys(result.parsed).length > 0) {
    console.log(`✅ Loaded environment variables from: ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn('⚠️  Could not find .env.local file in any of the expected locations:');
  possiblePaths.forEach(p => console.warn(`   - ${p}`));
  console.warn('   Continuing anyway - environment variables may be set elsewhere');
}

// Now dynamically import sync function AFTER environment variables are loaded
// This ensures supabase.ts can read the environment variables correctly
// We use dynamic import because ES modules execute imports at module load time,
// but we need to load .env.local first

async function main() {
  // Dynamically import the sync function after environment variables are loaded
  const { syncClaudeSkillsToDatabase } = await import('../src/lib/claude-skills-sync');
  const args = process.argv.slice(2);
  const force = args.includes('--force') || args.includes('-f');

  console.log('🚀 Starting Claude Skills sync script...');
  console.log(`   Force mode: ${force ? 'enabled' : 'disabled'}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');

  // Check required environment variables
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('');
    console.error('Please set these variables in .env.local file');
    console.error(`Current working directory: ${process.cwd()}`);
    process.exit(1);
  } else {
    console.log('✅ All required environment variables are set');
    console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET'}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET'}`);
  }

  // Check optional but recommended variables
  const recommendedVars = [
    'GOOGLE_CLOUD_PROJECT_ID',
    'GOOGLE_APPLICATION_CREDENTIALS_JSON',
  ];

  const missingRecommended = recommendedVars.filter(varName => !process.env[varName]);
  if (missingRecommended.length > 0) {
    console.warn('⚠️  Missing recommended environment variables:');
    missingRecommended.forEach(varName => {
      console.warn(`   - ${varName}`);
    });
    console.warn('   AI summarization will be disabled, using heuristic extraction instead');
    console.warn('');
  }

  try {
    const startTime = Date.now();
    const result = await syncClaudeSkillsToDatabase(force);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('');
    console.log('📊 Sync Summary:');
    console.log(`   Success: ${result.success ? '✅' : '❌'}`);
    console.log(`   Total skills: ${result.total}`);
    console.log(`   Inserted: ${result.inserted}`);
    console.log(`   Updated: ${result.updated}`);
    console.log(`   Errors: ${result.errors}`);
    console.log(`   Duration: ${duration}s`);
    console.log(`   Message: ${result.message}`);
    console.log('');

    if (result.success) {
      console.log('✅ Sync completed successfully!');
      process.exit(0);
    } else {
      console.error('❌ Sync failed!');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('');
    console.error('❌ Fatal error during sync:');
    console.error(error);
    if (error.stack) {
      console.error('');
      console.error('Stack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the script
main();

