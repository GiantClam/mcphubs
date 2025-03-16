export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} MCPHubs - A hub for Model Context Protocol projects
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/anthropics/anthropic-cookbook/tree/main/model_context_protocol" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-purple-300"
            >
              Model Context Protocol
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 