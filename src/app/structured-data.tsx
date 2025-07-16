import Script from 'next/script';

export default function StructuredData() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MCPHubs",
    "url": "https://mcphubs.com",
    "description": "MCPHubs是专业的Model Context Protocol (MCP)开发者平台。了解MCP是什麼、awesome-mcp-servers项目集合、Claude MCP集成教程。",
    "inLanguage": ["zh-CN", "en-US", "ja-JP", "ko-KR", "de-DE", "fr-FR", "es-ES", "sv-SE", "ar-SA"],
    "audience": {
      "@type": "Audience",
      "audienceType": "Developers",
      "geographicArea": [
        {"@type": "Country", "name": "United States"},
        {"@type": "Country", "name": "Canada"},
        {"@type": "Country", "name": "Australia"},
        {"@type": "Country", "name": "Sweden"},
        {"@type": "Country", "name": "Japan"},
        {"@type": "Country", "name": "South Korea"},
        {"@type": "Country", "name": "Germany"},
        {"@type": "Country", "name": "France"},
        {"@type": "Country", "name": "Spain"}
      ]
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mcphubs.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MCPHubs",
    "url": "https://mcphubs.com",
    "logo": "https://mcphubs.com/images/logo.png",
    "description": "Model Context Protocol开发者资源中心",
    "sameAs": [
      "https://github.com/mcphubs"
    ]
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "首页",
        "item": "https://mcphubs.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "MCP是什麼",
        "item": "https://mcphubs.com/what-is-mcp"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Awesome MCP Servers",
        "item": "https://mcphubs.com/awesome-mcp-servers"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "项目展示",
        "item": "https://mcphubs.com/projects"
      }
    ]
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "MCP 是什麼？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MCP（Model Context Protocol）是Anthropic开发的AI协议，用于连接Claude等AI模型与外部工具和数据源。它提供了标准化的通信方式，使AI助手能够安全地访问和使用各种外部资源。"
        }
      },
      {
        "@type": "Question", 
        "name": "什么是awesome-mcp-servers？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "awesome-mcp-servers是精选的MCP服务器项目合集，包括playwright-mcp、fastapi-mcp、claude-mcp等优秀项目。这些服务器为AI应用提供各种功能扩展，如浏览器自动化、API开发、数据处理等。"
        }
      },
      {
        "@type": "Question",
        "name": "如何学习Claude MCP集成？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "您可以通过MCPHubs的开发指南学习Claude MCP集成。我们提供完整的MCP服务器教程，包括Python和TypeScript的实现示例，以及best mcp servers推荐。"
        }
      },
      {
        "@type": "Question",
        "name": "MCP协议有哪些优势？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MCP协议具有四大核心优势：易于构建（简单的API设计）、可组合性（灵活的模块化）、安全隔离（内置安全保护）、能力协商（智能功能匹配）。这使得开发者能够快速构建功能强大且安全的AI应用。"
        }
      }
    ]
  };

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "MCP 是什麼？完整的Model Context Protocol指南",
    "description": "深入了解MCP是什麼！Model Context Protocol (MCP)是Anthropic开发的AI协议，用于Claude等模型与外部工具的通信。学习MCP协议原理、应用场景和开发指南。",
    "author": {
      "@type": "Organization",
      "name": "MCPHubs Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MCPHubs",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mcphubs.com/images/logo.png"
      }
    },
    "datePublished": "2024-01-15T10:00:00Z",
    "dateModified": "2024-01-15T15:30:00Z",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://mcphubs.com"
    },
    "image": "https://mcphubs.com/images/og-mcphubs.jpg"
  };

  return (
    <>
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData)
        }}
      />
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData)
        }}
      />
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleData)
        }}
      />
    </>
  );
} 