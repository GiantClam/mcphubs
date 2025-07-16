-- 创建 github_projects 表，用于存储从 GitHub API 获取的项目信息
CREATE TABLE IF NOT EXISTS github_projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL UNIQUE,
    owner TEXT NOT NULL,
    owner_avatar TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    description TEXT,
    stars INTEGER DEFAULT 0,
    forks INTEGER DEFAULT 0,
    language TEXT,
    topics TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    github_updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    relevance TEXT NOT NULL DEFAULT 'Low',
    relevance_score INTEGER DEFAULT 0,
    image_url TEXT,
    readme_content TEXT,
    sync_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_relevance CHECK (relevance IN ('High', 'Medium', 'Low'))
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_github_projects_relevance_score ON github_projects(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_github_projects_stars ON github_projects(stars DESC);
CREATE INDEX IF NOT EXISTS idx_github_projects_language ON github_projects(language);
CREATE INDEX IF NOT EXISTS idx_github_projects_relevance ON github_projects(relevance);
CREATE INDEX IF NOT EXISTS idx_github_projects_updated_at ON github_projects(github_updated_at);
CREATE INDEX IF NOT EXISTS idx_github_projects_sync_at ON github_projects(sync_at);
CREATE INDEX IF NOT EXISTS idx_github_projects_full_name ON github_projects(full_name);

-- 创建复合索引以支持复杂查询
CREATE INDEX IF NOT EXISTS idx_github_projects_relevance_stars ON github_projects(relevance_score DESC, stars DESC);
CREATE INDEX IF NOT EXISTS idx_github_projects_language_relevance ON github_projects(language, relevance_score DESC);

-- 添加触发器以自动更新 sync_at 字段
CREATE OR REPLACE FUNCTION update_sync_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.sync_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_github_projects_sync_at
    BEFORE UPDATE ON github_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_sync_at_column();

-- 创建项目统计视图
CREATE OR REPLACE VIEW github_projects_stats AS
SELECT 
    COUNT(*) as total_projects,
    COUNT(CASE WHEN relevance = 'High' THEN 1 END) as high_relevance_count,
    COUNT(CASE WHEN relevance = 'Medium' THEN 1 END) as medium_relevance_count,
    COUNT(CASE WHEN relevance = 'Low' THEN 1 END) as low_relevance_count,
    AVG(stars) as avg_stars,
    AVG(forks) as avg_forks,
    MAX(stars) as max_stars,
    COUNT(DISTINCT language) as unique_languages,
    MAX(sync_at) as last_sync_time,
    COUNT(CASE WHEN github_updated_at > CURRENT_TIMESTAMP - INTERVAL '30 days' THEN 1 END) as recently_updated_count
FROM github_projects;

-- 创建语言分布视图
CREATE OR REPLACE VIEW github_projects_language_stats AS
SELECT 
    COALESCE(language, 'Unknown') as language,
    COUNT(*) as project_count,
    AVG(stars) as avg_stars,
    MAX(stars) as max_stars,
    AVG(relevance_score) as avg_relevance_score
FROM github_projects
GROUP BY language
ORDER BY project_count DESC;

-- 创建相关性分布视图
CREATE OR REPLACE VIEW github_projects_relevance_stats AS
SELECT 
    relevance,
    COUNT(*) as project_count,
    AVG(stars) as avg_stars,
    AVG(forks) as avg_forks,
    AVG(relevance_score) as avg_relevance_score
FROM github_projects
GROUP BY relevance
ORDER BY 
    CASE 
        WHEN relevance = 'High' THEN 1
        WHEN relevance = 'Medium' THEN 2
        WHEN relevance = 'Low' THEN 3
    END;

-- 启用 Row Level Security (RLS)
ALTER TABLE github_projects ENABLE ROW LEVEL SECURITY;

-- 创建策略允许所有用户读取数据
CREATE POLICY "允许所有用户读取项目数据" ON github_projects
    FOR SELECT USING (true);

-- 创建策略只允许服务角色插入和更新数据
CREATE POLICY "只允许服务角色修改项目数据" ON github_projects
    FOR ALL USING (auth.role() = 'service_role');

-- 添加注释
COMMENT ON TABLE github_projects IS '存储从GitHub API获取的MCP相关项目信息';
COMMENT ON COLUMN github_projects.id IS 'GitHub项目ID';
COMMENT ON COLUMN github_projects.name IS '项目名称';
COMMENT ON COLUMN github_projects.full_name IS '完整项目名称 (owner/repo)';
COMMENT ON COLUMN github_projects.owner IS '项目所有者';
COMMENT ON COLUMN github_projects.owner_avatar IS '所有者头像URL';
COMMENT ON COLUMN github_projects.url IS 'GitHub项目URL';
COMMENT ON COLUMN github_projects.description IS '项目描述';
COMMENT ON COLUMN github_projects.stars IS '星标数';
COMMENT ON COLUMN github_projects.forks IS 'Fork数';
COMMENT ON COLUMN github_projects.language IS '主要编程语言';
COMMENT ON COLUMN github_projects.topics IS '项目标签';
COMMENT ON COLUMN github_projects.created_at IS 'GitHub项目创建时间';
COMMENT ON COLUMN github_projects.updated_at IS 'GitHub项目更新时间';
COMMENT ON COLUMN github_projects.github_updated_at IS 'GitHub上的最后更新时间';
COMMENT ON COLUMN github_projects.relevance IS 'MCP相关性级别';
COMMENT ON COLUMN github_projects.relevance_score IS 'MCP相关性分数';
COMMENT ON COLUMN github_projects.image_url IS '项目图片URL';
COMMENT ON COLUMN github_projects.readme_content IS 'README内容';
COMMENT ON COLUMN github_projects.sync_at IS '数据库同步时间'; 