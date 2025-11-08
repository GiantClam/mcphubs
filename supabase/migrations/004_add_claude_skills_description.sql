-- Add description column to claude_skills table
ALTER TABLE claude_skills 
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT NULL;

-- Add index for description search
CREATE INDEX IF NOT EXISTS idx_claude_skills_description ON claude_skills USING gin(to_tsvector('english', description));

-- Update comment
COMMENT ON COLUMN claude_skills.description IS 'Skill description extracted from SKILL.md file';

