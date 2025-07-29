import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaGithub, FaStar, FaCodeBranch, FaList } from 'react-icons/fa';
import { getProjectDetails } from '@/lib/project-service';
import { analyzeProjectRelevance } from '@/lib/analysis';
import { parseProjectSlug, isValidProjectSlug } from '@/lib/utils';
import ExpertAnalysis from '@/components/ExpertAnalysis';
import TutorialGuide from '@/components/TutorialGuide';
import CommunityComments from '@/components/CommunityComments';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ComponentPropsWithoutRef } from 'react';

export const revalidate = 3600; // Revalidate data every hour

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Validate slug format
  if (!isValidProjectSlug(slug)) {
    return {
      title: 'Invalid Project URL - MCPHubs',
    };
  }
  
  const project = await getProjectDetails(slug);
  
  if (!project) {
    return {
      title: 'Project Not Found - MCPHubs',
    };
  }
  
  return {
    title: `${project.name} by ${project.owner} - MCPHubs`,
    description: project.description,
    openGraph: {
      title: `${project.name} - MCP项目`,
      description: project.description,
      images: [project.imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.name} - MCP项目`,
      description: project.description,
      images: [project.imageUrl],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Validate slug format
  if (!isValidProjectSlug(slug)) {
    console.error(`Invalid project slug format: ${slug}`);
    notFound();
  }
  
  const project = await getProjectDetails(slug);
  
  if (!project) {
    notFound();
  }
  
  // Analyze project relevance to MCP
  const analysis = await analyzeProjectRelevance(project);
  
  // Extract headings from README for table of contents
  const extractHeadings = (markdown: string) => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: {level: number; text: string; id: string}[] = [];
    let match;
    
    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      // Create anchor ID
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      headings.push({ level, text, id });
    }
    
    return headings;
  };
  
  const headings = project.readmeContent ? extractHeadings(project.readmeContent) : [];
  const hasTableOfContents = headings.length > 3; // Only show TOC when there are enough headings
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/projects" className="text-purple-600 hover:text-purple-800 flex items-center">
          ← Back to projects
        </Link>
      </div>
      
      {/* Expert Deep Analysis */}
      <ExpertAnalysis project={project} />
      
      {/* Practical Tutorial Guide */}
      <TutorialGuide project={project} />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Project header information */}
        <div className="relative h-64 w-full">
          <Image 
            src={project.imageUrl || '/images/default-project.jpg'} 
            alt={project.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-lg opacity-90">{project.description}</p>
            </div>
          </div>
        </div>
        
        {/* Project metadata */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image 
              src={project.ownerAvatar} 
              alt={project.owner}
              width={40}
              height={40}
              className="rounded-full mr-3"
            />
            <span className="text-gray-700 dark:text-gray-300">{project.owner}</span>
          </div>
          
          <div className="flex space-x-6">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">{project.stars} stars</span>
            </div>
            <div className="flex items-center">
              <FaCodeBranch className="text-gray-500 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">{project.forks} forks</span>
            </div>
            <div>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                {project.language}
              </span>
            </div>
          </div>
        </div>
        
        {/* AI 分析结果 */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">MCP Relevance Analysis</h2>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Relevance Score</span>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                analysis.relevanceCategory === 'High' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : analysis.relevanceCategory === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {analysis.relevanceScore}/100 - {analysis.relevanceCategory} Relevance
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className={`h-2.5 rounded-full ${
                  analysis.relevanceCategory === 'High' 
                    ? 'bg-green-600' 
                    : analysis.relevanceCategory === 'Medium'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${analysis.relevanceScore}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Summary</h3>
            <p className="text-gray-600 dark:text-gray-400">{analysis.summary}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Key Features</h3>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                {analysis.keyFeatures.map((feature, index) => (
                  <li key={index} className="mb-1">{feature}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Use Cases</h3>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                {analysis.useCases.map((useCase, index) => (
                  <li key={index} className="mb-1">{useCase}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Project links */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <FaGithub className="mr-2" />
            View on GitHub
          </a>
        </div>
        
        {/* README content */}
        {project.readmeContent && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-l-4 border-purple-600 pl-3">
              README
            </h2>
            
            {/* Table of contents - only show when there are enough headings */}
            {hasTableOfContents && (
              <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium mb-2">
                  <FaList className="mr-2" />
                  <span>Table of Contents</span>
                </div>
                <ul className="space-y-1">
                  {headings.map((heading, index) => (
                    <li 
                      key={index} 
                      className={`
                        ${heading.level === 1 ? 'font-medium' : heading.level === 2 ? 'pl-4 text-sm' : 'pl-8 text-xs'}
                        hover:text-purple-600 dark:hover:text-purple-400 transition-colors
                      `}
                    >
                      <a 
                        href={`#${heading.id}`} 
                        className="block py-1 hover:underline"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="prose prose-lg dark:prose-invert max-w-none 
              prose-headings:border-b prose-headings:border-gray-200 prose-headings:pb-2 prose-headings:font-bold 
              prose-a:text-purple-600 prose-img:rounded-md prose-img:shadow-md
              prose-table:border-collapse prose-table:w-full 
              prose-th:bg-gray-100 prose-th:dark:bg-gray-700 prose-th:p-2 prose-th:text-left
              prose-td:border prose-td:border-gray-200 prose-td:dark:border-gray-700 prose-td:p-2
              prose-li:my-1 prose-ol:pl-6 prose-ul:pl-6 
              prose-blockquote:border-l-4 prose-blockquote:border-purple-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:dark:text-gray-400
              prose-hr:border-gray-300 prose-hr:dark:border-gray-700 prose-hr:my-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                components={{
                  img: (props) => (
                    <div className="flex justify-center my-4">
                      <Image 
                        src={props.src || ''} 
                        alt={props.alt || 'Project image'}
                        className="max-w-full h-auto rounded-lg shadow-md" 
                        style={{ maxHeight: '500px' }}
                        width={800}
                        height={500}
                        loading="lazy"
                      />
                    </div>
                  ),
                  h1: (props) => {
                    const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                    return (
                      <h1 id={id} className="text-2xl font-bold mt-6 mb-4 text-purple-800 dark:text-purple-300 pt-2 group">
                        {props.children}
                        <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity">
                          #
                        </a>
                      </h1>
                    );
                  },
                  h2: (props) => {
                    const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                    return (
                      <h2 id={id} className="text-xl font-bold mt-5 mb-3 text-purple-700 dark:text-purple-300 pt-1 group">
                        {props.children}
                        <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity">
                          #
                        </a>
                      </h2>
                    );
                  },
                  h3: (props) => {
                    const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                    return (
                      <h3 id={id} className="text-lg font-bold mt-4 mb-2 text-purple-600 dark:text-purple-400 group">
                        {props.children}
                        <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity">
                          #
                        </a>
                      </h3>
                    );
                  },
                  code: ({ className, children, ...props }: ComponentPropsWithoutRef<'code'> & { className?: string }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match && !className;
                    
                    return isInline ? (
                      <code 
                        className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-pink-600 dark:text-pink-400"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <div className="bg-gray-900 text-gray-100 rounded-md overflow-hidden my-4">
                        {match && (
                          <div className="px-4 py-2 bg-gray-800 text-gray-400 text-xs font-mono">
                            {match[1]}
                          </div>
                        )}
                        <pre className="p-4 overflow-x-auto">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    );
                  },
                  strong: (props) => (
                    <strong className="font-bold text-purple-700 dark:text-purple-400">
                      {props.children}
                    </strong>
                  ),
                  a: (props) => (
                    <a 
                      href={props.href}
                      className="text-purple-600 hover:text-purple-800 underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {props.children}
                    </a>
                  ),
                  
                  // Enhanced table styles
                  table: (props) => (
                    <div className="my-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        {props.children}
                      </table>
                    </div>
                  ),
                  thead: (props) => (
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      {props.children}
                    </thead>
                  ),
                  th: (props) => (
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      {props.children}
                    </th>
                  ),
                  td: (props) => (
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      {props.children}
                    </td>
                  ),
                  
                  // Enhanced list styles
                  ul: (props) => (
                    <ul className="list-disc pl-6 space-y-2 my-4">
                      {props.children}
                    </ul>
                  ),
                  ol: (props) => (
                    <ol className="list-decimal pl-6 space-y-2 my-4">
                      {props.children}
                    </ol>
                  ),
                  li: (props) => (
                    <li className="pl-2">
                      {props.children}
                    </li>
                  ),
                  
                  // Enhanced blockquote styles
                  blockquote: (props) => (
                    <blockquote className="border-l-4 border-purple-400 dark:border-purple-600 pl-4 py-1 my-4 italic bg-gray-50 dark:bg-gray-800 rounded-r-md">
                      {props.children}
                    </blockquote>
                  ),
                  
                  // Enhanced horizontal rule
                  hr: () => (
                    <hr className="my-8 h-px border-0 bg-gradient-to-r from-purple-500/10 via-purple-500/50 to-purple-500/10 dark:from-purple-400/10 dark:via-purple-400/50 dark:to-purple-400/10" />
                  ),
                  
                  // Emphasized paragraphs
                  p: (props) => (
                    <p className="leading-relaxed my-4">
                      {props.children}
                    </p>
                  )
                }}
              >
                {project.readmeContent}
              </ReactMarkdown>
            </div>
            
            {/* Back to top button */}
            <div className="flex justify-end mt-8">
              <a 
                href="#" 
                className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
              >
                ↑ Back to top
              </a>
            </div>
          </div>
        )}
      </div>
      
      {/* Community comments */}
      <CommunityComments project={project} />
    </div>
  );
} 