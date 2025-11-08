-- Add full SKILL.md content column to claude_skills
ALTER TABLE claude_skills 
ADD COLUMN IF NOT EXISTS skill_md TEXT DEFAULT NULL;

-- Optional: add comment
COMMENT ON COLUMN claude_skills.skill_md IS 'Full SKILL.md markdown content for the Claude Skill';
