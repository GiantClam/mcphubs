import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaStar, FaCodeBranch } from 'react-icons/fa';

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  owner: string;
  relevance: string;
  imageUrl: string;
}

export default function ProjectCard({
  id,
  name,
  description,
  stars,
  forks,
  language,
  owner,
  relevance,
  imageUrl,
}: ProjectCardProps) {
  return (
    <Link href={`/project/${id}`}>
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800 h-full flex flex-col">
        <div className="relative h-40 w-full">
          <Image 
            src={imageUrl || '/images/default-project.jpg'} 
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-5 flex-grow">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">{name}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <FaGithub className="mr-1" />
              {owner}
            </span>
            
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <FaStar className="mr-1 text-yellow-400" />
                {stars}
              </span>
              <span className="flex items-center">
                <FaCodeBranch className="mr-1" />
                {forks}
              </span>
            </div>
          </div>
        </div>
        
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {language || 'N/A'}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              relevance === 'High' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : relevance === 'Medium'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {relevance} Relevance
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 