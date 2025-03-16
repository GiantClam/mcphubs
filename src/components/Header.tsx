import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight text-purple-400 hover:text-purple-300">
          MCPHubs
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/" className="hover:text-purple-300">
            Home
          </Link>
          <Link href="https://github.com/search?q=model+context+protocol" 
                className="flex items-center space-x-2 hover:text-purple-300"
                target="_blank">
            <FaGithub />
            <span>GitHub</span>
          </Link>
        </nav>
      </div>
    </header>
  );
} 