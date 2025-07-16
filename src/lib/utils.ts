// SEO友好的URL工具函数

/**
 * 生成SEO友好的项目URL slug
 * 格式: owner-projectname
 */
export function generateProjectSlug(owner: string, name: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')  // 替换非字母数字为-
    .replace(/-+/g, '-')         // 合并多个-
    .replace(/^-|-$/g, '');      // 移除首尾-
  
  const cleanOwner = owner
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
    
  return `${cleanOwner}-${cleanName}`;
}

/**
 * 从项目slug解析出owner和name
 * 支持多种格式：
 * - owner-name
 * - fullName (owner/name)
 * - 数字ID (向后兼容)
 */
export function parseProjectSlug(slug: string): {
  owner?: string;
  name?: string;
  fullName?: string;
  isNumericId: boolean;
} {
  // 如果是纯数字，认为是老的ID格式
  if (/^\d+$/.test(slug)) {
    return {
      isNumericId: true
    };
  }
  
  // 如果包含斜杠，认为是 owner/name 格式
  if (slug.includes('/')) {
    const [owner, name] = slug.split('/');
    return {
      owner,
      name,
      fullName: slug,
      isNumericId: false
    };
  }
  
  // 如果包含连字符，尝试解析为 owner-name 格式
  if (slug.includes('-')) {
    const parts = slug.split('-');
    if (parts.length >= 2) {
      const owner = parts[0];
      const name = parts.slice(1).join('-');
      return {
        owner,
        name,
        fullName: `${owner}/${name}`,
        isNumericId: false
      };
    }
  }
  
  // 其他情况，当作项目名称处理
  return {
    name: slug,
    isNumericId: false
  };
}

/**
 * 验证项目slug的有效性
 */
export function isValidProjectSlug(slug: string): boolean {
  if (!slug || slug.trim() === '') return false;
  
  // 允许数字ID、owner/name格式、或owner-name格式
  return /^[\w\-\/]+$/.test(slug);
} 