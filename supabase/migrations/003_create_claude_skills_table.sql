-- 创建 claude_skills 表，用于存储 Claude Skills 信息
CREATE TABLE IF NOT EXISTS claude_skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    path TEXT NOT NULL,
    download_url TEXT NOT NULL,
    github_url TEXT NOT NULL,
    sync_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_claude_skills_name ON claude_skills(name);
CREATE INDEX IF NOT EXISTS idx_claude_skills_sync_at ON claude_skills(sync_at DESC);

-- 添加触发器以自动更新 sync_at 和 updated_at 字段
CREATE OR REPLACE FUNCTION update_claude_skills_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.sync_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_claude_skills_timestamp
    BEFORE UPDATE ON claude_skills
    FOR EACH ROW
    EXECUTE FUNCTION update_claude_skills_timestamp();

-- 启用 Row Level Security (RLS)
ALTER TABLE claude_skills ENABLE ROW LEVEL SECURITY;

-- 创建策略允许所有用户读取数据
CREATE POLICY "允许所有用户读取 Claude Skills 数据" ON claude_skills
    FOR SELECT USING (true);

-- 创建策略只允许服务角色插入和更新数据
CREATE POLICY "只允许服务角色修改 Claude Skills 数据" ON claude_skills
    FOR ALL USING (auth.role() = 'service_role');

-- 添加注释
COMMENT ON TABLE claude_skills IS '存储从 GitHub API 获取的 Claude Skills 信息';
COMMENT ON COLUMN claude_skills.id IS '技能 ID（与 name 相同）';
COMMENT ON COLUMN claude_skills.name IS '技能名称（文件夹名称）';
COMMENT ON COLUMN claude_skills.path IS '技能在 GitHub 仓库中的路径';
COMMENT ON COLUMN claude_skills.download_url IS 'Downgit 下载链接';
COMMENT ON COLUMN claude_skills.github_url IS 'GitHub 仓库链接';
COMMENT ON COLUMN claude_skills.sync_at IS '最后同步时间';

