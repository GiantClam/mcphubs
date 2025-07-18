import ProjectShowcase from '@/components/ProjectShowcase';
import { getProjects } from '@/lib/project-service';
import { ProcessedRepo } from '@/lib/github';

export default async function ProjectsPage() {
  // 在服务端直接获取项目数据
  let projects: ProcessedRepo[] = [];
  try {
    const result = await getProjects();
    projects = result.projects || [];
  } catch (error) {
    console.error('Failed to fetch projects on server:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          MCP Projects Showcase
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Explore the latest Model Context Protocol projects and tools
        </p>
      </div>
      <ProjectShowcase initialProjects={projects} showAll={true} />
    </div>
  );
} 