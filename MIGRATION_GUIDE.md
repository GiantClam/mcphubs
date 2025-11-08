# Database Migration Guide

## Issue: Missing `description` Column

If you see the error:
```
Could not find the 'description' column of 'claude_skills' in the schema cache
```

This means the database migration hasn't been executed yet.

## Solution: Execute Migration

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Execute Migration

Copy and paste the following SQL into the editor:

```sql
-- Add description column to claude_skills table
ALTER TABLE claude_skills 
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT NULL;

-- Add index for description search
CREATE INDEX IF NOT EXISTS idx_claude_skills_description ON claude_skills USING gin(to_tsvector('english', description));

-- Update comment
COMMENT ON COLUMN claude_skills.description IS 'Skill description extracted from SKILL.md file';
```

### Step 3: Run the Query

1. Click **Run** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
2. Wait for the query to complete
3. You should see a success message

### Step 4: Verify

Check if the column was added:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'claude_skills' 
AND column_name = 'description';
```

You should see the `description` column listed.

### Step 5: Re-run Sync

After executing the migration, re-run the sync:

```bash
curl -X POST "http://localhost:3000/api/sync/claude-skills?key=YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

## Alternative: Execute All Migrations

If you haven't executed any migrations yet, run them in order:

1. `001_create_github_projects_table.sql`
2. `002_add_gemini_analysis_fields.sql`
3. `003_create_claude_skills_table.sql`
4. `004_add_claude_skills_description.sql` ← **This one fixes the current issue**

## Notes

- The migration uses `IF NOT EXISTS`, so it's safe to run multiple times
- After migration, Supabase may take a few seconds to update the schema cache
- If errors persist, try refreshing the Supabase dashboard

