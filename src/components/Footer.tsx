import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Website Information */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">MCPHubs</h3>
            <p className="text-gray-300 mb-4">
              Professional Model Context Protocol developer resource platform, providing the latest MCP projects, tools and integration examples.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/anthropics/anthropic-cookbook/tree/main/model_context_protocol" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-300 transition-colors"
              >
                Official Docs
              </a>
              <a 
                href="https://github.com/search?q=model+context+protocol" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-300 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/what-is-mcp" className="text-gray-300 hover:text-purple-300 transition-colors">
                  What is MCP?
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-300 hover:text-purple-300 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/awesome-mcp-servers" className="text-gray-300 hover:text-purple-300 transition-colors">
                  Awesome MCP
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-gray-300 hover:text-purple-300 transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-300 hover:text-purple-300 transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal Information</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-purple-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-300 hover:text-purple-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="text-gray-300 hover:text-purple-300 transition-colors">
                  Sitemap
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:contact@mcphubs.com" 
                  className="text-gray-300 hover:text-purple-300 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} MCPHubs - A hub for Model Context Protocol projects
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-400">
                Made with ❤️ for the MCP community
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 