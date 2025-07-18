import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// 支持的语言配置
export const highValueLocales = {
  'zh-CN': {
    code: 'zh-CN',
    name: '中文',
    nativeName: '简体中文',
    flag: '🇨🇳',
    region: 'CN',
    dir: 'ltr',
    currency: 'CNY',
    priority: 1
  },
  'en-US': {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English (United States)',
    flag: '🇺🇸',
    region: 'US',
    dir: 'ltr',
    currency: 'USD',
    priority: 10
  },
  'en-CA': {
    code: 'en-CA',
    name: 'English (CA)',
    nativeName: 'English (Canada)',
    flag: '🇨🇦',
    region: 'CA',
    dir: 'ltr',
    currency: 'CAD',
    priority: 9
  },
  'en-AU': {
    code: 'en-AU',
    name: 'English (AU)',
    nativeName: 'English (Australia)',
    flag: '🇦🇺',
    region: 'AU',
    dir: 'ltr',
    currency: 'AUD',
    priority: 8
  },
  'ja-JP': {
    code: 'ja-JP',
    name: '日本語',
    nativeName: '日本語',
    flag: '🇯🇵',
    region: 'JP',
    dir: 'ltr',
    currency: 'JPY',
    priority: 6
  },
  'ko-KR': {
    code: 'ko-KR',
    name: '한국어',
    nativeName: '한국어',
    flag: '🇰🇷',
    region: 'KR',
    dir: 'ltr',
    currency: 'KRW',
    priority: 5
  },
  'de-DE': {
    code: 'de-DE',
    name: 'Deutsch',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    region: 'DE',
    dir: 'ltr',
    currency: 'EUR',
    priority: 4
  },
  'fr-FR': {
    code: 'fr-FR',
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'FR',
    dir: 'ltr',
    currency: 'EUR',
    priority: 3
  },
  'es-ES': {
    code: 'es-ES',
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸',
    region: 'ES',
    dir: 'ltr',
    currency: 'EUR',
    priority: 2
  },
  'sv-SE': {
    code: 'sv-SE',
    name: 'Svenska',
    nativeName: 'Svenska',
    flag: '🇸🇪',
    region: 'SE',
    dir: 'ltr',
    currency: 'SEK',
    priority: 7
  },
  'ar-SA': {
    code: 'ar-SA',
    name: 'العربية',
    nativeName: 'العربية',
    flag: '🇸🇦',
    region: 'SA',
    dir: 'rtl',
    currency: 'SAR',
    priority: 1
  }
} as const;

// 多语言关键词映射
export const keywordTranslations = {
  'mcp-definition': {
    'zh-CN': 'mcp 是 什麼',
    'en-US': 'what is mcp',
    'en-CA': 'what is mcp',
    'en-AU': 'what is mcp',
    'ja-JP': 'MCPとは',
    'ko-KR': 'MCP란 무엇',
    'de-DE': 'Was ist MCP',
    'fr-FR': 'Qu\'est-ce que MCP',
    'es-ES': 'Qué es MCP',
    'sv-SE': 'Vad är MCP',
    'ar-SA': 'ما هو MCP'
  },
  'awesome-servers': {
    'zh-CN': 'awesome-mcp-servers',
    'en-US': 'awesome-mcp-servers',
    'en-CA': 'awesome-mcp-servers',
    'en-AU': 'awesome-mcp-servers',
    'ja-JP': 'awesome-mcp-servers',
    'ko-KR': 'awesome-mcp-servers',
    'de-DE': 'awesome-mcp-servers',
    'fr-FR': 'awesome-mcp-servers',
    'es-ES': 'awesome-mcp-servers',
    'sv-SE': 'awesome-mcp-servers',
    'ar-SA': 'awesome-mcp-servers'
  },
  'claude-integration': {
    'zh-CN': 'claude mcp',
    'en-US': 'claude mcp',
    'en-CA': 'claude mcp',
    'en-AU': 'claude mcp',
    'ja-JP': 'Claude MCP',
    'ko-KR': 'Claude MCP',
    'de-DE': 'Claude MCP',
    'fr-FR': 'Claude MCP',
    'es-ES': 'Claude MCP',
    'sv-SE': 'Claude MCP',
    'ar-SA': 'Claude MCP'
  },
  'server-tutorial': {
    'zh-CN': 'mcp server教程',
    'en-US': 'mcp server tutorial',
    'en-CA': 'mcp server tutorial',
    'en-AU': 'mcp server tutorial',
    'ja-JP': 'MCP サーバー チュートリアル',
    'ko-KR': 'MCP 서버 튜토리얼',
    'de-DE': 'MCP Server Tutorial',
    'fr-FR': 'tutoriel serveur MCP',
    'es-ES': 'tutorial servidor MCP',
    'sv-SE': 'MCP server handledning',
    'ar-SA': 'دروس خادم MCP'
  }
} as const;

// UI翻译
export const uiTranslations = {
  navigation: {
    'zh-CN': {
      home: '首页',
      'what-is-mcp': '什么是MCP?',
      concepts: '核心概念',
      projects: '项目展示',
      'awesome-mcp': 'Awesome MCP',
      integrations: '集成案例',
      community: '社区论坛',
      troubleshooting: '故障排除',
      monitoring: '系统监控',
      'tools-services': '工具服务',
      profile: '个人资料',
      logout: '退出登录'
    },
    'en-US': {
      home: 'Home',
      'what-is-mcp': 'What is MCP?',
      concepts: 'Core Concepts',
      projects: 'Projects',
      'awesome-mcp': 'Awesome MCP',
      integrations: 'Integrations',
      community: 'Community',
      troubleshooting: 'Troubleshooting',
      monitoring: 'Monitoring',
      'tools-services': 'Tools & Services',
      profile: 'Profile',
      logout: 'Logout'
    },
    'ja-JP': {
      home: 'ホーム',
      'what-is-mcp': 'MCPとは？',
      concepts: '基本概念',
      projects: 'プロジェクト',
      'awesome-mcp': 'Awesome MCP',
      integrations: '統合',
      community: 'コミュニティ',
      troubleshooting: 'トラブルシューティング',
      monitoring: 'モニタリング'
    },
    'ko-KR': {
      home: '홈',
      'what-is-mcp': 'MCP란?',
      concepts: '핵심 개념',
      projects: '프로젝트',
      'awesome-mcp': 'Awesome MCP',
      integrations: '통합',
      community: '커뮤니티',
      troubleshooting: '문제 해결',
      monitoring: '모니터링'
    },
    'de-DE': {
      home: 'Startseite',
      'what-is-mcp': 'Was ist MCP?',
      concepts: 'Kernkonzepte',
      projects: 'Projekte',
      'awesome-mcp': 'Awesome MCP',
      integrations: 'Integrationen',
      community: 'Community',
      troubleshooting: 'Fehlerbehebung',
      monitoring: 'Überwachung'
    },
    'fr-FR': {
      home: 'Accueil',
      'what-is-mcp': 'Qu\'est-ce que MCP?',
      concepts: 'Concepts clés',
      projects: 'Projets',
      'awesome-mcp': 'Awesome MCP',
      integrations: 'Intégrations',
      community: 'Communauté',
      troubleshooting: 'Dépannage',
      monitoring: 'Surveillance'
    },
    'es-ES': {
      home: 'Inicio',
      'what-is-mcp': '¿Qué es MCP?',
      concepts: 'Conceptos básicos',
      projects: 'Proyectos',
      'awesome-mcp': 'Awesome MCP',
      integrations: 'Integraciones',
      community: 'Comunidad',
      troubleshooting: 'Resolución de problemas',
      monitoring: 'Monitoreo'
    }
  },
  homepage: {
    'zh-CN': {
      title: 'MCPHubs',
      subtitle: '探索 Model Context Protocol 的无限可能',
      description: '发现最新的 MCP 项目、工具和集成案例',
      dataLastUpdate: '数据最后更新时间',
      featuredProjects: '精选项目',
      autoUpdate: '自动更新',
      viewAll: '查看全部',
      projectsCount: '个项目',
      lastUpdate: '最后更新',
      from: '来源',
      database: '数据库',
      githubApi: 'GitHub API',
      cached: '缓存数据',
      realtime: '实时数据',
      total: '共'
    },
    'en-US': {
      title: 'MCPHubs',
      subtitle: 'Explore the infinite possibilities of Model Context Protocol',
      description: 'Discover the latest MCP projects, tools and integration cases',
      dataLastUpdate: 'Data last updated',
      featuredProjects: 'Featured Projects',
      autoUpdate: 'Auto Update',
      viewAll: 'View All',
      projectsCount: 'projects',
      lastUpdate: 'Last Updated',
      from: 'Source',
      database: 'Database',
      githubApi: 'GitHub API',
      cached: 'Cached Data',
      realtime: 'Real-time Data',
      total: 'Total'
    },
    'ja-JP': {
      title: 'MCPHubs',
      subtitle: 'Model Context Protocolの無限の可能性を探る',
      description: '最新のMCPプロジェクト、ツール、統合事例を発見',
      dataLastUpdate: 'データ最終更新時刻',
      featuredProjects: '注目プロジェクト',
      autoUpdate: '自動更新',
      viewAll: '全て見る',
      projectsCount: 'プロジェクト',
      lastUpdate: '最終更新',
      from: 'ソース',
      database: 'データベース',
      githubApi: 'GitHub API',
      cached: 'キャッシュデータ',
      realtime: 'リアルタイムデータ',
      total: '合計'
    },
    'ko-KR': {
      title: 'MCPHubs',
      subtitle: 'Model Context Protocol의 무한한 가능성을 탐색',
      description: '최신 MCP 프로젝트, 도구 및 통합 사례 발견',
      dataLastUpdate: '데이터 마지막 업데이트 시간',
      featuredProjects: '주요 프로젝트',
      autoUpdate: '자동 업데이트',
      viewAll: '전체 보기',
      projectsCount: '프로젝트',
      lastUpdate: '마지막 업데이트',
      from: '소스',
      database: '데이터베이스',
      githubApi: 'GitHub API',
      cached: '캐시된 데이터',
      realtime: '실시간 데이터',
      total: '총'
    },
    'de-DE': {
      title: 'MCPHubs',
      subtitle: 'Entdecke die unendlichen Möglichkeiten des Model Context Protocol',
      description: 'Entdecke die neuesten MCP-Projekte, Tools und Integrationsfälle',
      dataLastUpdate: 'Daten zuletzt aktualisiert',
      featuredProjects: 'Ausgewählte Projekte',
      autoUpdate: 'Automatische Aktualisierung',
      viewAll: 'Alle anzeigen',
      projectsCount: 'Projekte',
      lastUpdate: 'Letzte Aktualisierung',
      from: 'Quelle',
      database: 'Datenbank',
      githubApi: 'GitHub API',
      cached: 'Zwischengespeicherte Daten',
      realtime: 'Echtzeitdaten',
      total: 'Gesamt'
    },
    'fr-FR': {
      title: 'MCPHubs',
      subtitle: 'Explorez les possibilités infinies du Model Context Protocol',
      description: 'Découvrez les derniers projets MCP, outils et cas d\'intégration',
      dataLastUpdate: 'Données mises à jour pour la dernière fois',
      featuredProjects: 'Projets en vedette',
      autoUpdate: 'Mise à jour automatique',
      viewAll: 'Voir tout',
      projectsCount: 'projets',
      lastUpdate: 'Dernière mise à jour',
      from: 'Source',
      database: 'Base de données',
      githubApi: 'API GitHub',
      cached: 'Données en cache',
      realtime: 'Données en temps réel',
      total: 'Total'
    },
    'es-ES': {
      title: 'MCPHubs',
      subtitle: 'Explora las posibilidades infinitas del Model Context Protocol',
      description: 'Descubre los últimos proyectos MCP, herramientas y casos de integración',
      dataLastUpdate: 'Datos actualizados por última vez',
      featuredProjects: 'Proyectos destacados',
      autoUpdate: 'Actualización automática',
      viewAll: 'Ver todo',
      projectsCount: 'proyectos',
      lastUpdate: 'Última actualización',
      from: 'Fuente',
      database: 'Base de datos',
      githubApi: 'API de GitHub',
      cached: 'Datos en caché',
      realtime: 'Datos en tiempo real',
      total: 'Total'
    }
  },
  common: {
    'zh-CN': {
      loading: '加载中...',
      error: '错误',
      retry: '重试',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      save: '保存',
      cancel: '取消',
      confirm: '确认',
      edit: '编辑',
      delete: '删除',
      search: '搜索',
      filter: '筛选',
      sort: '排序',
      clear: '清除'
    },
    'en-US': {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      edit: 'Edit',
      delete: 'Delete',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      clear: 'Clear'
    }
  },
  hero: {
    'zh-CN': {
      description: '探索 Model Context Protocol 的无限可能',
      discover: '发现最新的 MCP 项目、工具和集成案例',
      featured_projects: '精选项目',
      cached_acceleration: '缓存加速',
      database: '数据库',
      github_api: 'GitHub API',
      auto_update: '24/7',
      auto_update_description: '自动更新',
      last_updated: '数据最后更新时间',
      source: '来源',
      cached_data: '缓存数据',
      real_time_data: '实时数据',
      projects: '个项目',
      hot_searches_title: '🔥 热门搜索：',
      what_is_mcp: 'mcp 是 什麼',
      awesome_mcp_servers: 'awesome-mcp-servers',
      claude_mcp: 'claude mcp',
      mcp_tutorial: 'mcp server教程',
      anthropic_mcp: 'anthropic mcp',
      model_context_protocol: 'model context protocol',
      browse_projects: '浏览项目',
      learn_mcp: '了解 MCP'
    },
    'en-US': {
      description: 'Explore the infinite possibilities of Model Context Protocol',
      discover: 'Discover the latest MCP projects, tools and integration cases',
      featured_projects: 'Featured Projects',
      cached_acceleration: 'Cache Acceleration',
      database: 'Database',
      github_api: 'GitHub API',
      auto_update: '24/7',
      auto_update_description: 'Auto Update',
      last_updated: 'Data last updated',
      source: 'Source',
      cached_data: 'Cached Data',
      real_time_data: 'Real-time Data',
      projects: 'projects',
      hot_searches_title: '🔥 Hot Searches:',
      what_is_mcp: 'what is mcp',
      awesome_mcp_servers: 'awesome-mcp-servers',
      claude_mcp: 'claude mcp',
      mcp_tutorial: 'mcp server tutorial',
      anthropic_mcp: 'anthropic mcp',
      model_context_protocol: 'model context protocol',
      browse_projects: 'Browse Projects',
      learn_mcp: 'Learn MCP'
    }
  },
  features: {
    'zh-CN': {
      why_choose_us: '为什么选择 MCPHubs？',
      smart_project_discovery: '智能项目发现',
      smart_project_description: '我们的 AI 系统自动分析和评估 GitHub 上的 MCP 相关项目，为您推荐最相关的工具和资源。',
      explore_projects: '探索项目',
      real_time_sync: '实时数据同步',
      real_time_sync_description: '每天早上6点自动同步最新的项目信息，确保您始终获得最新、最准确的 MCP 生态系统数据。',
      view_monitoring: '查看监控',
      community_interaction: '社区互动',
      community_interaction_description: '参与 MCP 社区讨论，分享经验，获取支持，与其他开发者交流合作。',
      join_community: '加入社区'
    },
    'en-US': {
      why_choose_us: 'Why Choose MCPHubs?',
      smart_project_discovery: 'Smart Project Discovery',
      smart_project_description: 'Our AI system automatically analyzes and evaluates MCP-related projects on GitHub, recommending the most relevant tools and resources for you.',
      explore_projects: 'Explore Projects',
      real_time_sync: 'Real-time Data Sync',
      real_time_sync_description: 'Automatically sync the latest project information at 6 AM daily, ensuring you always get the latest and most accurate MCP ecosystem data.',
      view_monitoring: 'View Monitoring',
      community_interaction: 'Community Interaction',
      community_interaction_description: 'Participate in MCP community discussions, share experiences, get support, and collaborate with other developers.',
      join_community: 'Join Community'
    }
  },
  quick_links: {
    'zh-CN': {
      title: '快速导航',
      awesome_mcp: 'Awesome MCP',
      awesome_mcp_description: '精选的 MCP 服务器项目合集',
      integrations: '集成案例',
      integrations_description: '真实的 MCP 集成应用场景',
      troubleshooting: '故障排除',
      troubleshooting_description: '常见问题解决方案',
      github_search: 'GitHub 搜索',
      github_search_description: '在 GitHub 上搜索更多项目'
    },
    'en-US': {
      title: 'Quick Navigation',
      awesome_mcp: 'Awesome MCP',
      awesome_mcp_description: 'Curated collection of MCP server projects',
      integrations: 'Integrations',
      integrations_description: 'Real MCP integration use cases',
      troubleshooting: 'Troubleshooting',
      troubleshooting_description: 'Common problem solutions',
      github_search: 'GitHub Search',
      github_search_description: 'Search for more projects on GitHub'
    }
  }
} as const;

// 地区定位配置
export const regionConfig = {
  'US': { currency: 'USD', timezone: 'America/New_York', priority: 10 },
  'CA': { currency: 'CAD', timezone: 'America/Toronto', priority: 9 },
  'AU': { currency: 'AUD', timezone: 'Australia/Sydney', priority: 8 },
  'SE': { currency: 'SEK', timezone: 'Europe/Stockholm', priority: 7 },
  'JP': { currency: 'JPY', timezone: 'Asia/Tokyo', priority: 6 },
  'KR': { currency: 'KRW', timezone: 'Asia/Seoul', priority: 5 },
  'DE': { currency: 'EUR', timezone: 'Europe/Berlin', priority: 4 },
  'FR': { currency: 'EUR', timezone: 'Europe/Paris', priority: 3 },
  'ES': { currency: 'EUR', timezone: 'Europe/Madrid', priority: 2 },
  'CN': { currency: 'CNY', timezone: 'Asia/Shanghai', priority: 1 },
  'SA': { currency: 'SAR', timezone: 'Asia/Riyadh', priority: 1 }
} as const;

// 获取当前语言设置
export function getCurrentLocale(): keyof typeof highValueLocales {
  if (typeof window !== 'undefined') {
    // 优先使用用户手动设置的语言
    const stored = localStorage.getItem('preferred-locale');
    if (stored && stored in highValueLocales) {
      return stored as keyof typeof highValueLocales;
    }
    
    // 基于浏览器语言检测
    const browserLang = navigator.language;
    
    // 精确匹配
    if (browserLang in highValueLocales) {
      return browserLang as keyof typeof highValueLocales;
    }
    
    // 部分匹配（例如 zh 匹配 zh-CN）
    const langCode = browserLang.split('-')[0];
    const matchingLocale = Object.keys(highValueLocales).find(locale => 
      locale.startsWith(langCode)
    );
    if (matchingLocale) {
      return matchingLocale as keyof typeof highValueLocales;
    }
    
    // 检查浏览器支持的所有语言（按优先级）
    if (navigator.languages) {
      for (const lang of navigator.languages) {
        if (lang in highValueLocales) {
          return lang as keyof typeof highValueLocales;
        }
        
        const code = lang.split('-')[0];
        const match = Object.keys(highValueLocales).find(locale => 
          locale.startsWith(code)
        );
        if (match) {
          return match as keyof typeof highValueLocales;
        }
      }
    }
  }
  
  return 'en-US'; // 默认语言为英文
}

// 获取翻译文本
export function getTranslation(
  category: keyof typeof uiTranslations,
  key: string,
  locale: keyof typeof highValueLocales = getCurrentLocale()
): string {
  const translations = uiTranslations[category];
  
  // 检查当前语言是否有翻译
  if (translations && locale in translations) {
    const localeTranslations = translations[locale as keyof typeof translations];
    if (localeTranslations && key in localeTranslations) {
      return localeTranslations[key as keyof typeof localeTranslations];
    }
  }
  
  // 回退到英文
  if (translations && 'en-US' in translations) {
    const enTranslations = translations['en-US'];
    if (enTranslations && key in enTranslations) {
      return enTranslations[key as keyof typeof enTranslations];
    }
  }
  
  return key; // 最后回退到原始key
} 