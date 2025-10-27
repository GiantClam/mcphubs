import Script from 'next/script';

export default function StructuredData() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MCPHubs - Model Context Protocol Developer Resource Center",
    "alternateName": ["MCP Hubs", "MCP Developer Center", "Model Context Protocol Hub"],
    "url": "https://mcphubs.com",
    "description": "MCPHubs is the ultimate Model Context Protocol (MCP) developer platform. Discover 200+ MCP projects, learn Claude MCP integration, explore awesome-mcp-servers collection, and master AI application development with comprehensive tutorials and tools.",
    "inLanguage": ["zh-CN", "en-US", "ja-JP", "ko-KR", "de-DE", "fr-FR", "es-ES", "sv-SE", "ar-SA"],
    "keywords": [
      "Model Context Protocol", "MCP", "Claude MCP", "awesome-mcp-servers", "AI development",
      "MCP server", "MCP client", "Anthropic", "Claude integration", "AI tools",
      "web scraping", "database", "TypeScript", "Python", "MCP tutorial"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": ["Developers", "AI Engineers", "Software Engineers", "Tech Professionals"],
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
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "MCP Projects Collection",
      "description": "Curated collection of 200+ Model Context Protocol projects",
      "numberOfItems": 200
    }
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MCPHubs",
    "url": "https://mcphubs.com",
    "logo": "https://mcphubs.com/images/logo.png",
    "description": "Model Context Protocol Developer Resource Center",
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
        "name": "Home",
        "item": "https://mcphubs.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "What is MCP",
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
        "name": "Projects",
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
        "name": "What is MCP?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MCP (Model Context Protocol) is an AI protocol developed by Anthropic for connecting Claude and other AI models with external tools and data sources. It provides standardized communication methods, enabling AI assistants to securely access and use various external resources."
        }
      },
      {
        "@type": "Question", 
        "name": "What is awesome-mcp-servers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "awesome-mcp-servers is a curated collection of MCP server projects, including excellent projects like playwright-mcp, fastapi-mcp, claude-mcp, etc. These servers provide various functional extensions for AI applications, such as browser automation, API development, data processing, etc."
        }
      },
      {
        "@type": "Question",
        "name": "How to learn Claude MCP integration?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can learn Claude MCP integration through MCPHubs' development guides. We provide complete MCP server tutorials, including Python and TypeScript implementation examples, as well as best mcp servers recommendations."
        }
      },
      {
        "@type": "Question",
        "name": "What are the advantages of the MCP protocol?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The MCP protocol has four core advantages: Easy to Build (simple API design), Composable (flexible modularity), Secure Isolation (built-in security protection), and Capability Negotiation (intelligent feature matching). This enables developers to quickly build powerful and secure AI applications."
        }
      }
    ]
  };

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What is MCP? Complete Model Context Protocol Guide",
    "description": "Deep dive into what MCP is! Model Context Protocol (MCP) is an AI protocol developed by Anthropic for communication between Claude and other models with external tools. Learn MCP protocol principles, application scenarios, and development guides.",
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

  const softwareApplicationData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MCPHubs Platform",
    "description": "Comprehensive Model Context Protocol developer platform with project discovery, tutorials, and tools",
    "url": "https://mcphubs.com",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    },
    "featureList": [
      "200+ MCP Projects Discovery",
      "Claude MCP Integration Tutorials", 
      "Awesome MCP Servers Collection",
      "Real-time Project Updates",
      "Multi-language Support",
      "Developer Tools & Resources"
    ]
  };

  const collectionPageData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "MCP Projects Collection",
    "description": "Curated collection of 200+ Model Context Protocol projects including servers, clients, and tools",
    "url": "https://mcphubs.com/projects",
    "mainEntity": {
      "@type": "ItemList",
      "name": "MCP Projects",
      "description": "Featured Model Context Protocol projects",
      "numberOfItems": 200,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Awesome MCP Servers",
          "description": "Curated collection of excellent MCP server implementations",
          "url": "https://mcphubs.com/awesome-mcp-servers"
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Web Scraping Tools",
          "description": "MCP servers for web scraping and data extraction",
          "url": "https://mcphubs.com/projects?category=web-scraping"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Database Connectors",
          "description": "MCP servers for database access and management",
          "url": "https://mcphubs.com/projects?category=database"
        }
      ]
    }
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
      <Script
        id="software-application-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationData)
        }}
      />
      <Script
        id="collection-page-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageData)
        }}
      />
    </>
  );
} 