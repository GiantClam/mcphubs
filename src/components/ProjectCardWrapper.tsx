'use client';

import { useSession } from 'next-auth/react';
import ProjectCard from './ProjectCard';

interface ProjectCardWrapperProps {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  owner: string;
  relevance: string;
  imageUrl: string;
  topics?: string[];
  updatedAt?: string;
  aiScore?: number;
  likes?: number;
  comments?: number;
  githubUrl?: string;
  isLiked?: boolean;
}

export default function ProjectCardWrapper(props: ProjectCardWrapperProps) {
  const { data: session } = useSession();
  
  return (
    <ProjectCard
      {...props}
      userLoggedIn={!!session}
    />
  );
} 