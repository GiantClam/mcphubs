import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// 高价值地区语言配置
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
      monitoring: '系统监控'
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
      monitoring: 'Monitoring'
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
      troubleshooting: 'Solución de problemas',
      monitoring: 'Monitoreo'
    },
    'sv-SE': {
      home: 'Hem',
      'what-is-mcp': 'Vad är MCP?',
      concepts: 'Kärnbegrepp',
      projects: 'Projekt',
      'awesome-mcp': 'Awesome MCP',
      integrations: 'Integrationer',
      community: 'Gemenskap',
      troubleshooting: 'Felsökning',
      monitoring: 'Övervakning'
    },
    'en-CA': {
      home: 'Home',
      'what-is-mcp': 'What is MCP?',
      concepts: 'Core Concepts',
      projects: 'Projects',
      'awesome-mcp': 'Awesome MCP',
      integrations: 'Integrations',
      community: 'Community',
      troubleshooting: 'Troubleshooting',
      monitoring: 'Monitoring'
    },
    'en-AU': {
      home: 'Home',
      'what-is-mcp': 'What is MCP?',
      concepts: 'Core Concepts',
      projects: 'Projects',
      'awesome-mcp': 'Awesome MCP',
      integrations: 'Integrations',
      community: 'Community',
      troubleshooting: 'Troubleshooting',
      monitoring: 'Monitoring'
    },
    'ar-SA': {
      home: 'الرئيسية',
      'what-is-mcp': 'ما هو MCP؟',
      concepts: 'المفاهيم الأساسية',
      projects: 'المشاريع',
      'awesome-mcp': 'Awesome MCP',
      integrations: 'التكامل',
      community: 'المجتمع',
      troubleshooting: 'حل المشاكل',
      monitoring: 'المراقبة'
    }
  },
  seo: {
    'zh-CN': {
      title: 'MCPHubs - MCP是什麼？Model Context Protocol开发者资源中心',
      description: 'MCPHubs是专业的Model Context Protocol (MCP)开发者平台。了解MCP是什麼、awesome-mcp-servers项目集合、Claude MCP集成教程。',
      keywords: 'mcp 是 什麼,awesome-mcp-servers,claude mcp,mcp server教程,MCP协议'
    },
    'en-US': {
      title: 'MCPHubs - What is MCP? Model Context Protocol Developer Hub',
      description: 'MCPHubs is the professional Model Context Protocol (MCP) developer platform. Learn what is MCP, discover awesome-mcp-servers, and master Claude MCP integration.',
      keywords: 'what is mcp,awesome-mcp-servers,claude mcp,mcp server tutorial,Model Context Protocol'
    },
    'ja-JP': {
      title: 'MCPHubs - MCPとは？Model Context Protocol開発者ハブ',
      description: 'MCPHubsは専門的なModel Context Protocol (MCP)開発者プラットフォームです。MCPとは何か、awesome-mcp-servers、Claude MCP統合を学びましょう。',
      keywords: 'MCPとは,awesome-mcp-servers,Claude MCP,MCPサーバーチュートリアル'
    },
    'ko-KR': {
      title: 'MCPHubs - MCP란 무엇? Model Context Protocol 개발자 허브',
      description: 'MCPHubs는 전문적인 Model Context Protocol (MCP) 개발자 플랫폼입니다. MCP란 무엇인지, awesome-mcp-servers, Claude MCP 통합을 배워보세요.',
      keywords: 'MCP란 무엇,awesome-mcp-servers,Claude MCP,MCP 서버 튜토리얼'
    },
    'de-DE': {
      title: 'MCPHubs - Was ist MCP? Model Context Protocol Entwickler Hub',
      description: 'MCPHubs ist die professionelle Model Context Protocol (MCP) Entwicklerplattform. Lernen Sie was MCP ist, entdecken Sie awesome-mcp-servers und meistern Sie Claude MCP Integration.',
      keywords: 'Was ist MCP,awesome-mcp-servers,Claude MCP,MCP Server Tutorial'
    },
    'fr-FR': {
      title: 'MCPHubs - Qu\'est-ce que MCP? Hub développeur Model Context Protocol',
      description: 'MCPHubs est la plateforme professionnelle de développeurs Model Context Protocol (MCP). Apprenez ce qu\'est MCP, découvrez awesome-mcp-servers et maîtrisez l\'intégration Claude MCP.',
      keywords: 'Qu\'est-ce que MCP,awesome-mcp-servers,Claude MCP,tutoriel serveur MCP'
    },
    'es-ES': {
      title: 'MCPHubs - ¿Qué es MCP? Hub de desarrolladores Model Context Protocol',
      description: 'MCPHubs es la plataforma profesional de desarrolladores Model Context Protocol (MCP). Aprende qué es MCP, descubre awesome-mcp-servers y domina la integración Claude MCP.',
      keywords: 'Qué es MCP,awesome-mcp-servers,Claude MCP,tutorial servidor MCP'
    },
    'sv-SE': {
      title: 'MCPHubs - Vad är MCP? Model Context Protocol utvecklarhubb',
      description: 'MCPHubs är den professionella Model Context Protocol (MCP) utvecklarplattformen. Lär dig vad MCP är, upptäck awesome-mcp-servers och bemästra Claude MCP integration.',
      keywords: 'Vad är MCP,awesome-mcp-servers,Claude MCP,MCP server handledning'
    },
    'en-CA': {
      title: 'MCPHubs - What is MCP? Model Context Protocol Developer Hub',
      description: 'MCPHubs is the professional Model Context Protocol (MCP) developer platform. Learn what is MCP, discover awesome-mcp-servers, and master Claude MCP integration.',
      keywords: 'what is mcp,awesome-mcp-servers,claude mcp,mcp server tutorial,Model Context Protocol'
    },
    'en-AU': {
      title: 'MCPHubs - What is MCP? Model Context Protocol Developer Hub',
      description: 'MCPHubs is the professional Model Context Protocol (MCP) developer platform. Learn what is MCP, discover awesome-mcp-servers, and master Claude MCP integration.',
      keywords: 'what is mcp,awesome-mcp-servers,claude mcp,mcp server tutorial,Model Context Protocol'
    },
    'ar-SA': {
      title: 'MCPHubs - ما هو MCP؟ مركز مطوري Model Context Protocol',
      description: 'MCPHubs هو منصة مطوري Model Context Protocol (MCP) المهنية. تعلم ما هو MCP، اكتشف awesome-mcp-servers، وأتقن تكامل Claude MCP.',
      keywords: 'ما هو MCP,awesome-mcp-servers,Claude MCP,دروس خادم MCP'
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
    const stored = localStorage.getItem('preferred-locale');
    if (stored && stored in highValueLocales) {
      return stored as keyof typeof highValueLocales;
    }
    
    // 基于浏览器语言检测
    const browserLang = navigator.language;
    if (browserLang in highValueLocales) {
      return browserLang as keyof typeof highValueLocales;
    }
    
    // 回退到最接近的语言
    const langCode = browserLang.split('-')[0];
    const matchingLocale = Object.keys(highValueLocales).find(locale => 
      locale.startsWith(langCode)
    );
    if (matchingLocale) {
      return matchingLocale as keyof typeof highValueLocales;
    }
  }
  
  return 'zh-CN'; // 默认语言
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