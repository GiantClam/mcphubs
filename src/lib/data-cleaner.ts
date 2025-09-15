import { ProcessedRepo } from './github';

export interface DataQualityReport {
  totalProjects: number;
  qualityScore: number;
  issues: DataIssue[];
  recommendations: string[];
  statistics: {
    withProjectType: number;
    withCoreFeatures: number;
    withTechStack: number;
    withCompatibility: number;
    withInstallCommand: number;
    withQuickStartCode: number;
    withDocumentationUrl: number;
    withServerEndpoint: number;
    withClientCapabilities: number;
  };
}

export interface DataIssue {
  projectId: string;
  projectName: string;
  issueType: 'missing_field' | 'invalid_data' | 'incomplete_data' | 'format_error';
  field: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestedFix?: string;
}

export interface CleanedProject extends ProcessedRepo {
  _cleaned: boolean;
  _issues: DataIssue[];
  _qualityScore: number;
}

/**
 * 清洗项目数据
 */
export function cleanProjectData(project: ProcessedRepo): CleanedProject {
  const issues: DataIssue[] = [];
  let qualityScore = 100;

  // 检查必需字段
  if (!project.name) {
    issues.push({
      projectId: project.id,
      projectName: project.name || 'Unknown',
      issueType: 'missing_field',
      field: 'name',
      description: '项目名称缺失',
      severity: 'high'
    });
    qualityScore -= 20;
  }

  if (!project.description) {
    issues.push({
      projectId: project.id,
      projectName: project.name,
      issueType: 'missing_field',
      field: 'description',
      description: '项目描述缺失',
      severity: 'medium'
    });
    qualityScore -= 10;
  }

  // 检查项目类型
  if (!project.projectType) {
    issues.push({
      projectId: project.id,
      projectName: project.name,
      issueType: 'missing_field',
      field: 'projectType',
      description: '项目类型未分类',
      severity: 'medium',
      suggestedFix: '使用AI分析推断项目类型'
    });
    qualityScore -= 15;
  }

  // 检查核心特性
  if (!project.coreFeatures || project.coreFeatures.length === 0) {
    issues.push({
      projectId: project.id,
      projectName: project.name,
      issueType: 'missing_field',
      field: 'coreFeatures',
      description: '核心特性信息缺失',
      severity: 'medium',
      suggestedFix: '使用AI分析提取核心特性'
    });
    qualityScore -= 10;
  }

  // 检查技术栈
  if (!project.techStack || project.techStack.length === 0) {
    issues.push({
      projectId: project.id,
      projectName: project.name,
      issueType: 'missing_field',
      field: 'techStack',
      description: '技术栈信息缺失',
      severity: 'low',
      suggestedFix: '从项目语言和README中提取技术栈'
    });
    qualityScore -= 5;
  }

  // 检查兼容性信息
  if (!project.compatibility || project.compatibility.length === 0) {
    issues.push({
      projectId: project.id,
      projectName: project.name,
      issueType: 'missing_field',
      field: 'compatibility',
      description: '兼容性信息缺失',
      severity: 'low',
      suggestedFix: '分析项目描述和文档推断兼容的LLM模型'
    });
    qualityScore -= 5;
  }

  // 检查安装命令
  if (!project.installCommand) {
    issues.push({
      projectId: project.id,
      projectName: project.name,
      issueType: 'missing_field',
      field: 'installCommand',
      description: '安装命令缺失',
      severity: 'low',
      suggestedFix: '从README中提取安装命令'
    });
    qualityScore -= 5;
  }

  // 检查快速开始代码
  if (!project.quickStartCode) {
    issues.push({
      projectId: project.id,
      projectName: project.name,
      issueType: 'missing_field',
      field: 'quickStartCode',
      description: '快速开始代码示例缺失',
      severity: 'low',
      suggestedFix: '从README中提取代码示例'
    });
    qualityScore -= 5;
  }

  // 检查文档链接
  if (!project.documentationUrl) {
    issues.push({
      projectId: project.id,
      projectName: project.name,
      issueType: 'missing_field',
      field: 'documentationUrl',
      description: '文档链接缺失',
      severity: 'low',
      suggestedFix: '从README中提取文档链接'
    });
    qualityScore -= 5;
  }

  // 验证数据格式
  if (project.installCommand && !isValidInstallCommand(project.installCommand)) {
    issues.push({
      projectId: project.id,
      projectName: project.name,
      issueType: 'invalid_data',
      field: 'installCommand',
      description: '安装命令格式可能不正确',
      severity: 'low'
    });
    qualityScore -= 2;
  }

  if (project.serverEndpoint && !isValidEndpoint(project.serverEndpoint)) {
    issues.push({
      projectId: project.id,
      projectName: project.name,
      issueType: 'invalid_data',
      field: 'serverEndpoint',
      description: '服务器端点格式可能不正确',
      severity: 'medium'
    });
    qualityScore -= 8;
  }

  // 确保质量分数不为负数
  qualityScore = Math.max(0, qualityScore);

  return {
    ...project,
    _cleaned: true,
    _issues: issues,
    _qualityScore: qualityScore
  };
}

/**
 * 批量清洗项目数据
 */
export function cleanProjectDataBatch(projects: ProcessedRepo[]): CleanedProject[] {
  return projects.map(project => cleanProjectData(project));
}

/**
 * 生成数据质量报告
 */
export function generateDataQualityReport(projects: ProcessedRepo[]): DataQualityReport {
  const cleanedProjects = cleanProjectDataBatch(projects);
  
  const totalProjects = projects.length;
  const allIssues = cleanedProjects.flatMap(p => p._issues);
  const averageQualityScore = cleanedProjects.reduce((sum, p) => sum + p._qualityScore, 0) / totalProjects;

  const statistics = {
    withProjectType: cleanedProjects.filter(p => p.projectType).length,
    withCoreFeatures: cleanedProjects.filter(p => p.coreFeatures?.length).length,
    withTechStack: cleanedProjects.filter(p => p.techStack?.length).length,
    withCompatibility: cleanedProjects.filter(p => p.compatibility?.length).length,
    withInstallCommand: cleanedProjects.filter(p => p.installCommand).length,
    withQuickStartCode: cleanedProjects.filter(p => p.quickStartCode).length,
    withDocumentationUrl: cleanedProjects.filter(p => p.documentationUrl).length,
    withServerEndpoint: cleanedProjects.filter(p => p.serverEndpoint).length,
    withClientCapabilities: cleanedProjects.filter(p => p.clientCapabilities?.length).length
  };

  const recommendations = generateRecommendations(statistics, totalProjects);

  return {
    totalProjects,
    qualityScore: Math.round(averageQualityScore),
    issues: allIssues,
    recommendations,
    statistics
  };
}

/**
 * 生成改进建议
 */
function generateRecommendations(statistics: any, totalProjects: number): string[] {
  const recommendations: string[] = [];
  const percentage = (count: number) => Math.round((count / totalProjects) * 100);

  if (percentage(statistics.withProjectType) < 80) {
    recommendations.push(`项目类型分类率仅${percentage(statistics.withProjectType)}%，建议启用AI自动分类`);
  }

  if (percentage(statistics.withCoreFeatures) < 70) {
    recommendations.push(`核心特性提取率仅${percentage(statistics.withCoreFeatures)}%，建议优化AI分析提示`);
  }

  if (percentage(statistics.withTechStack) < 60) {
    recommendations.push(`技术栈信息完整率仅${percentage(statistics.withTechStack)}%，建议从README中提取更多技术信息`);
  }

  if (percentage(statistics.withInstallCommand) < 50) {
    recommendations.push(`安装命令提取率仅${percentage(statistics.withInstallCommand)}%，建议改进安装命令识别算法`);
  }

  if (percentage(statistics.withQuickStartCode) < 40) {
    recommendations.push(`快速开始代码提取率仅${percentage(statistics.withQuickStartCode)}%，建议从README代码块中提取示例`);
  }

  if (percentage(statistics.withDocumentationUrl) < 30) {
    recommendations.push(`文档链接提取率仅${percentage(statistics.withDocumentationUrl)}%，建议从项目描述和README中提取文档链接`);
  }

  return recommendations;
}

/**
 * 验证安装命令格式
 */
function isValidInstallCommand(command: string): boolean {
  const validPatterns = [
    /^npm install/i,
    /^yarn add/i,
    /^pip install/i,
    /^pip3 install/i,
    /^go get/i,
    /^cargo add/i,
    /^gem install/i,
    /^composer require/i,
    /^nuget install/i
  ];

  return validPatterns.some(pattern => pattern.test(command.trim()));
}

/**
 * 验证端点格式
 */
function isValidEndpoint(endpoint: string): boolean {
  try {
    const url = new URL(endpoint);
    return url.protocol === 'https:' || url.protocol === 'http:' || endpoint.startsWith('stdio://');
  } catch {
    return endpoint.startsWith('stdio://') || endpoint.includes('://');
  }
}

/**
 * 自动修复常见数据问题
 */
export function autoFixProjectData(project: ProcessedRepo): ProcessedRepo {
  const fixed = { ...project };

  // 自动推断项目类型
  if (!fixed.projectType) {
    fixed.projectType = inferProjectType(project);
  }

  // 自动提取技术栈
  if (!fixed.techStack || fixed.techStack.length === 0) {
    fixed.techStack = extractTechStack(project);
  }

  // 自动提取安装命令
  if (!fixed.installCommand) {
    fixed.installCommand = extractInstallCommand(project);
  }

  // 自动提取文档链接
  if (!fixed.documentationUrl) {
    fixed.documentationUrl = extractDocumentationUrl(project);
  }

  return fixed;
}

/**
 * 推断项目类型
 */
function inferProjectType(project: ProcessedRepo): string {
  const name = project.name.toLowerCase();
  const description = (project.description || '').toLowerCase();
  const topics = project.topics.map(t => t.toLowerCase());
  
  if (name.includes('server') || description.includes('server') || topics.includes('server')) {
    return 'Server';
  }
  if (name.includes('client') || description.includes('client') || topics.includes('client')) {
    return 'Client';
  }
  if (name.includes('lib') || name.includes('sdk') || description.includes('library')) {
    return 'Library';
  }
  if (name.includes('tool') || name.includes('cli') || description.includes('tool')) {
    return 'Tool';
  }
  if (name.includes('example') || name.includes('demo') || description.includes('example')) {
    return 'Example';
  }
  
  return 'Unknown';
}

/**
 * 提取技术栈
 */
function extractTechStack(project: ProcessedRepo): string[] {
  const techStack = new Set<string>();
  
  if (project.language) {
    techStack.add(project.language);
  }

  const readme = project.readmeContent || '';
  const commonTechs = [
    'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Java', 'C++', 'C#',
    'Node.js', 'React', 'Vue', 'Angular', 'Django', 'Flask', 'Express',
    'FastAPI', 'Spring', 'Laravel', 'Rails', 'Next.js', 'Nuxt.js'
  ];

  commonTechs.forEach(tech => {
    if (readme.toLowerCase().includes(tech.toLowerCase())) {
      techStack.add(tech);
    }
  });

  return Array.from(techStack);
}

/**
 * 提取安装命令
 */
function extractInstallCommand(project: ProcessedRepo): string | undefined {
  const readme = project.readmeContent || '';
  
  const patterns = [
    /npm install[^\n]+/i,
    /yarn add[^\n]+/i,
    /pip install[^\n]+/i,
    /pip3 install[^\n]+/i,
    /go get[^\n]+/i,
    /cargo add[^\n]+/i,
    /gem install[^\n]+/i,
    /composer require[^\n]+/i
  ];

  for (const pattern of patterns) {
    const match = readme.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }

  return undefined;
}

/**
 * 提取文档链接
 */
function extractDocumentationUrl(project: ProcessedRepo): string | undefined {
  const readme = project.readmeContent || '';
  
  const patterns = [
    /\[.*?\]\((https?:\/\/[^)]+)\)/g,
    /(https?:\/\/[^\s]+)/g
  ];

  for (const pattern of patterns) {
    const matches = readme.match(pattern);
    if (matches) {
      for (const match of matches) {
        const url = match.replace(/\[.*?\]\(/, '').replace(/\)$/, '');
        if (url.includes('docs') || url.includes('documentation') || url.includes('readme')) {
          return url;
        }
      }
    }
  }

  return undefined;
}
