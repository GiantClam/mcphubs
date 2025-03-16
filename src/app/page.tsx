import Image from "next/image";
import { searchMCPProjects } from "@/lib/github";
import ProjectCard from "@/components/ProjectCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const revalidate = 3600; // 每小时重新验证一次数据

export default async function Home() {
  const projects = await searchMCPProjects();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Model Context Protocol <span className="text-purple-600">Hub</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover projects related to Anthropic's Model Context Protocol (MCP) - 
            a protocol for structuring context for large language models.
          </p>
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              MCP Projects
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {projects.length} projects
            </div>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Loading projects or no projects found. Please try again later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  description={project.description}
                  stars={project.stars}
                  forks={project.forks}
                  language={project.language}
                  owner={project.owner}
                  relevance={project.relevance}
                  imageUrl={project.imageUrl}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
