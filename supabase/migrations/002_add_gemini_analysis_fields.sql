-- 添加 Gemini 分析结果字段到 github_projects 表
ALTER TABLE github_projects 
ADD COLUMN IF NOT EXISTS gemini_analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS gemini_summary TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS gemini_key_features TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gemini_use_cases TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gemini_analysis_version INTEGER DEFAULT 1;

-- 为分析时间添加索引
CREATE INDEX IF NOT EXISTS idx_github_projects_gemini_analyzed_at ON github_projects(gemini_analyzed_at);

-- 添加分析状态索引
CREATE INDEX IF NOT EXISTS idx_github_projects_analysis_status ON github_projects(gemini_analyzed_at) WHERE gemini_analyzed_at IS NOT NULL;

-- 更新项目统计视图，包含 Gemini 分析统计
DROP VIEW IF EXISTS github_projects_stats;
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
    COUNT(CASE WHEN github_updated_at > CURRENT_TIMESTAMP - INTERVAL '30 days' THEN 1 END) as recently_updated_count,
    COUNT(CASE WHEN gemini_analyzed_at IS NOT NULL THEN 1 END) as gemini_analyzed_count,
    COUNT(CASE WHEN gemini_analyzed_at IS NULL THEN 1 END) as pending_analysis_count,
    ROUND(AVG(relevance_score), 2) as avg_relevance_score
FROM github_projects;

-- 创建 Gemini 分析状态视图
CREATE OR REPLACE VIEW github_projects_analysis_stats AS
SELECT 
    CASE 
        WHEN gemini_analyzed_at IS NOT NULL THEN 'Analyzed'
        ELSE 'Pending'
    END as analysis_status,
    COUNT(*) as project_count,
    AVG(relevance_score) as avg_relevance_score,
    MAX(gemini_analyzed_at) as last_analysis_time
FROM github_projects
GROUP BY analysis_status
ORDER BY analysis_status; 