import React from 'react';
import { FaBook, FaRocket, FaCode, FaLightbulb, FaTerminal, FaCog, FaCheck, FaUser } from 'react-icons/fa';
import { ProcessedRepo } from '@/lib/github';

interface TutorialGuideProps {
  project: ProcessedRepo;
}

interface TutorialStep {
  title: string;
  description: string;
  code?: string;
  tips?: string[];
}

interface TutorialSection {
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: TutorialStep[];
}

// Generate tutorial content based on project characteristics
function generateTutorialContent(project: ProcessedRepo): TutorialSection[] {
  const tutorials: TutorialSection[] = [];

  // Quick start tutorial
  const quickStartSteps: TutorialStep[] = [
    {
      title: "Environment Setup",
      description: `Set up ${project.language} development environment and necessary dependencies`,
      code: project.language === 'Python' 
        ? `# Create virtual environment\npython -m venv mcp_env\nsource mcp_env/bin/activate  # Linux/Mac\nmcp_env\\Scripts\\activate     # Windows\n\n# Install project dependencies\npip install -r requirements.txt`
        : project.language === 'JavaScript' || project.language === 'TypeScript'
        ? `# Install dependencies\nnpm install\n# or use yarn\nyarn install`
        : `# Clone project\ngit clone ${project.url}\ncd ${project.name}`,
      tips: [
        "Ensure proper environment isolation",
        "Check system compatibility requirements",
        "Recommend using stable versions of runtime environment"
      ]
    },
    {
      title: "Project Configuration",
      description: "Configure basic parameters and MCP-related settings",
      code: project.language === 'Python' 
        ? `# Configuration file example (config.py)\nMCP_SERVER_URL = "your_mcp_server_url"\nAPI_KEY = "your_api_key"\nDEBUG = True\n\n# Verify configuration\npython -c "import config; print('Configuration loaded successfully')"`
        : `// Configuration file example (config.js)\nmodule.exports = {\n  mcpServerUrl: 'your_mcp_server_url',\n  apiKey: 'your_api_key',\n  debug: true\n};`,
      tips: [
        "Properly secure API keys and sensitive information",
        "Use environment variables for configuration management",
        "Test if configuration loads correctly"
      ]
    },
    {
      title: "Run Project",
      description: "Start project and verify MCP functionality",
      code: project.language === 'Python' 
        ? `# Start project\npython main.py\n\n# or use development mode\npython -m ${project.name} --dev`
        : `# Start project\nnpm start\n\n# or development mode\nnpm run dev`,
      tips: [
        "First run may take longer time",
        "Check log output for any errors",
        "Verify MCP connection is working properly"
      ]
    }
  ];

  tutorials.push({
    title: "Quick Start",
    icon: <FaRocket className="w-5 h-5" />,
    description: "Get started with this MCP project from scratch",
    steps: quickStartSteps
  });

  // Deployment guide
  const deploymentSteps: TutorialStep[] = [
    {
      title: "Production Environment Setup",
      description: "Configure production environment infrastructure and dependencies",
      code: project.language === 'Python' 
        ? `# Production dependencies\npip install gunicorn\n\n# Environment variables setup\nexport FLASK_ENV=production\nexport MCP_SERVER_URL=your_production_url`
        : `# Build production version\nnpm run build\n\n# Set environment variables\nexport NODE_ENV=production\nexport MCP_SERVER_URL=your_production_url`,
      tips: [
        "Use dedicated production servers",
        "Configure SSL certificates and security settings",
        "Set up monitoring and logging"
      ]
    },
    {
      title: "Containerized Deployment",
      description: "Deploy using Docker containers",
      code: `# Dockerfile example\nFROM ${project.language === 'Python' ? 'python:3.9-slim' : 'node:16-alpine'}\n\nWORKDIR /app\nCOPY . .\n\n${project.language === 'Python' 
        ? 'RUN pip install -r requirements.txt\nCMD ["python", "main.py"]'
        : 'RUN npm install\nCMD ["npm", "start"]'}\n\n# Build and run\ndocker build -t mcp-${project.name.toLowerCase()} .\ndocker run -p 3000:3000 mcp-${project.name.toLowerCase()}`,
      tips: [
        "Optimize Docker image size",
        "Use multi-stage builds",
        "Configure health checks"
      ]
    },
    {
      title: "Cloud Platform Deployment",
      description: "Deploy to mainstream cloud platforms",
      code: `# Vercel deployment (suitable for JavaScript/TypeScript projects)\nvercel --prod\n\n# or use Heroku\nheroku create mcp-${project.name.toLowerCase()}\ngit push heroku main\n\n# AWS Lambda deployment\naws lambda create-function --function-name mcp-${project.name.toLowerCase()}`,
      tips: [
        "Choose appropriate cloud platform solutions",
        "Configure auto-scaling strategies",
        "Set up monitoring and alerting"
      ]
    }
  ];

  tutorials.push({
    title: "Deployment Guide",
    icon: <FaCog className="w-5 h-5" />,
    description: "Complete guide to deploy the project to production environment",
    steps: deploymentSteps
  });

  // Best practices
  const bestPracticesSteps: TutorialStep[] = [
    {
      title: "Performance Optimization",
      description: "Optimize project performance and response speed",
      code: project.language === 'Python' 
        ? `# Use caching optimization\nfrom functools import lru_cache\n\n@lru_cache(maxsize=128)\ndef get_mcp_data(query):\n    # Cache MCP query results\n    return fetch_from_mcp(query)\n\n# Async processing\nimport asyncio\n\nasync def process_mcp_requests():\n    # Process multiple MCP requests concurrently\n    tasks = [process_request(req) for req in requests]\n    await asyncio.gather(*tasks)`
        : `// Use caching optimization\nconst mcpCache = new Map();\n\nfunction getMCPData(query) {\n  if (mcpCache.has(query)) {\n    return mcpCache.get(query);\n  }\n  const result = fetchFromMCP(query);\n  mcpCache.set(query, result);\n  return result;\n}\n\n// Batch processing\nconst batchProcessor = new BatchProcessor({\n  maxBatchSize: 10,\n  flushInterval: 100\n});`,
      tips: [
        "Use caching mechanisms appropriately",
        "Implement request batching",
        "Monitor memory usage"
      ]
    },
    {
      title: "Error Handling",
      description: "Implement robust error handling mechanisms",
      code: project.language === 'Python' 
        ? `# Exception handling example\nimport logging\nfrom functools import wraps\n\ndef mcp_error_handler(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        try:\n            return func(*args, **kwargs)\n        except MCPConnectionError as e:\n            logging.error(f"MCP connection error: {e}")\n            return {"error": "MCP service temporarily unavailable"}\n        except Exception as e:\n            logging.error(f"Unknown error: {e}")\n            return {"error": "Error occurred while processing request"}\n    return wrapper\n\n@mcp_error_handler\ndef process_mcp_request(data):\n    # Process MCP request\n    pass`
        : `// Error handling example\nclass MCPErrorHandler {\n  static handle(error) {\n    if (error instanceof MCPConnectionError) {\n      console.error('MCP connection error:', error.message);\n      return { error: 'MCP service temporarily unavailable' };\n    }\n    \n    console.error('Unknown error:', error);\n    return { error: 'Error occurred while processing request' };\n  }\n}\n\n// Use middleware\napp.use((error, req, res, next) => {\n  const result = MCPErrorHandler.handle(error);\n  res.status(500).json(result);\n});`,
      tips: [
        "Categorize and handle different types of errors",
        "Log detailed error information",
        "Provide user-friendly error messages"
      ]
    },
    {
      title: "Security Best Practices",
      description: "Ensure project security",
      code: `# Security configuration example\n# 1. Environment variable management\nMCP_API_KEY=your_secure_api_key\nALLOWED_HOSTS=your_domain.com\n\n# 2. Input validation\n${project.language === 'Python' 
        ? `from marshmallow import Schema, fields, validate\n\nclass MCPRequestSchema(Schema):\n    query = fields.Str(required=True, validate=validate.Length(min=1, max=1000))\n    user_id = fields.Str(required=True, validate=validate.UUID())`
        : `const joi = require('joi');\n\nconst mcpRequestSchema = joi.object({\n  query: joi.string().min(1).max(1000).required(),\n  userId: joi.string().uuid().required()\n});`}`,
      tips: [
        "Always validate input data",
        "Use HTTPS encryption for transmission",
        "Regularly update dependencies",
        "Implement access control and rate limiting"
      ]
    }
  ];

  tutorials.push({
    title: "Best Practices",
    icon: <FaLightbulb className="w-5 h-5" />,
    description: "Follow industry best practices to build high-quality MCP applications",
    steps: bestPracticesSteps
  });

  // Integration examples
  const integrationSteps: TutorialStep[] = [
    {
      title: "LangChain Integration",
      description: "Integrate project with LangChain framework",
      code: project.language === 'Python' 
        ? `# LangChain integration example\nfrom langchain.llms import OpenAI\nfrom langchain.chains import ConversationChain\nfrom langchain.memory import ConversationBufferMemory\n\n# Set up MCP as context provider\nclass MCPContextProvider:\n    def __init__(self, mcp_client):\n        self.mcp_client = mcp_client\n    \n    def get_context(self, query):\n        return self.mcp_client.fetch_context(query)\n\n# Create conversation chain\nllm = OpenAI(temperature=0.7)\nmemory = ConversationBufferMemory()\nconversation = ConversationChain(\n    llm=llm,\n    memory=memory,\n    verbose=True\n)`
        : `// LangChain integration example\nconst { OpenAI } = require('langchain/llms/openai');\nconst { ConversationChain } = require('langchain/chains');\nconst { BufferMemory } = require('langchain/memory');\n\nclass MCPContextProvider {\n  constructor(mcpClient) {\n    this.mcpClient = mcpClient;\n  }\n  \n  async getContext(query) {\n    return await this.mcpClient.fetchContext(query);\n  }\n}\n\n// Create conversation chain\nconst llm = new OpenAI({ temperature: 0.7 });\nconst memory = new BufferMemory();\nconst conversation = new ConversationChain({ llm, memory });`,
      tips: [
        "Properly configure LLM parameters",
        "Optimize context window size",
        "Implement intelligent context filtering"
      ]
    },
    {
      title: "API Integration",
      description: "Integration with other API services",
      code: `# RESTful API integration example\n${project.language === 'Python' 
        ? `import requests\nfrom typing import Dict, Any\n\nclass MCPAPIClient:\n    def __init__(self, base_url: str, api_key: str):\n        self.base_url = base_url\n        self.headers = {\n            'Authorization': f'Bearer {api_key}',\n            'Content-Type': 'application/json'\n        }\n    \n    def send_context(self, context: Dict[str, Any]):\n        response = requests.post(\n            f'{self.base_url}/context',\n            json=context,\n            headers=self.headers\n        )\n        return response.json()`
        : `class MCPAPIClient {\n  constructor(baseUrl, apiKey) {\n    this.baseUrl = baseUrl;\n    this.headers = {\n      'Authorization': \`Bearer \${apiKey}\`,\n      'Content-Type': 'application/json'\n    };\n  }\n  \n  async sendContext(context) {\n    const response = await fetch(\`\${this.baseUrl}/context\`, {\n      method: 'POST',\n      headers: this.headers,\n      body: JSON.stringify(context)\n    });\n    return await response.json();\n  }\n}`}`,
      tips: [
        "Implement retry mechanisms for API calls",
        "Handle API rate limiting and timeouts",
        "Cache API response results"
      ]
    }
  ];

  tutorials.push({
    title: "Integration Examples",
    icon: <FaCode className="w-5 h-5" />,
    description: "Integration examples with mainstream AI frameworks and services",
    steps: integrationSteps
  });

  return tutorials;
}

const TutorialGuide: React.FC<TutorialGuideProps> = ({ project }) => {
  const tutorials = generateTutorialContent(project);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center mb-6">
        <FaBook className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Practical Tutorial Guide
        </h2>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400">
          Here you&apos;ll find detailed tutorials and best practices for the {project.name} project, helping you get started quickly and successfully deploy to production.
        </p>
      </div>

      <div className="space-y-8">
        {tutorials.map((tutorial, tutorialIndex) => (
          <div key={tutorialIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <div className="text-blue-600 dark:text-blue-400 mr-3">
                  {tutorial.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {tutorial.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {tutorial.description}
              </p>
            </div>
            
            <div className="p-4">
              <div className="space-y-6">
                {tutorial.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="border-l-4 border-blue-400 pl-4">
                    <div className="flex items-start mb-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        {stepIndex + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    {step.code && (
                      <div className="mb-4">
                        <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
                          <div className="px-4 py-2 bg-gray-800 text-gray-400 text-xs font-mono flex items-center">
                            <FaTerminal className="mr-2" />
                            代码示例
                          </div>
                          <pre className="p-4 overflow-x-auto">
                            <code className="text-sm">
                              {step.code}
                            </code>
                          </pre>
                        </div>
                      </div>
                    )}
                    
                    {step.tips && step.tips.length > 0 && (
                                              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                         <div className="flex items-center mb-2">
                           <FaLightbulb className="text-yellow-600 dark:text-yellow-400 mr-2" />
                           <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                             Practical Tips
                           </span>
                         </div>
                        <ul className="space-y-1">
                          {step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start text-sm text-yellow-700 dark:text-yellow-300">
                              <FaCheck className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
          Need Help?
        </h4>
        <p className="text-purple-700 dark:text-purple-400 text-sm mb-3">
          If you encounter issues while using the project, we recommend checking the following resources:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-purple-600 dark:text-purple-400 hover:underline"
          >
            <FaBook className="mr-2" />
            Project Documentation
          </a>
          <a 
            href={`${project.url}/issues`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-purple-600 dark:text-purple-400 hover:underline"
          >
            <FaTerminal className="mr-2" />
            Issue Reporting
          </a>
          <a 
            href={`${project.url}/discussions`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-purple-600 dark:text-purple-400 hover:underline"
          >
            <FaUser className="mr-2" />
            Community Discussions
          </a>
        </div>
      </div>
    </div>
  );
};

export default TutorialGuide; 