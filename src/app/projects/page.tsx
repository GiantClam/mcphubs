import ProjectShowcase from '@/components/ProjectShowcase';
import ClientFilter from '@/components/ClientFilter';
import { getProjects } from '@/lib/project-service';
import { ProcessedRepo } from '@/lib/github';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MCP Clients - Development Tools & Libraries | MCPHubs',
  description: 'Discover MCP client tools, libraries, and development resources. Filter by programming language, features, and compatibility. Find the perfect MCP client for your project.',
  keywords: [
    'MCP clients', 'MCP libraries', 'MCP tools', 'MCP development', 'Model Context Protocol clients',
    'MCP Python', 'MCP TypeScript', 'MCP JavaScript', 'MCP Go', 'MCP integration'
  ],
  openGraph: {
    title: 'MCP Clients - Development Tools & Libraries',
    description: 'Discover and filter MCP client tools, libraries, and development resources.',
    type: 'website'
  }
};

export default async function ProjectsPage() {
  // Fetch project data directly on server side
  let projects: ProcessedRepo[] = [];
  try {
    const result = await getProjects();
    projects = result.projects || [];
  } catch (error) {
    console.error('Failed to fetch projects on server:', error);
  }

  // Filter out client-type projects
  const clientProjects = projects.filter(project => 
    project.projectType === 'Client' || 
    project.projectType === 'Library' ||
    project.projectType === 'Tool' ||
    project.name.toLowerCase().includes('client') ||
    project.description.toLowerCase().includes('client') ||
    project.description.toLowerCase().includes('library') ||
    project.description.toLowerCase().includes('sdk')
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          MCP Clients & Libraries
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Discover and filter MCP client tools, libraries, and development resources. Filter by programming language, features, and compatibility.
        </p>
      </div>

      {/* Advanced Filter */}
      <div className="mb-8">
        <ClientFilter projects={clientProjects} />
      </div>

      {/* Project Showcase */}
      <ProjectShowcase 
        initialProjects={clientProjects} 
        showAll={true}
        showFilters={false} // Use our custom filter
      />
    </div>
  );
} 