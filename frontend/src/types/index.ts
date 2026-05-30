export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  avatar?: string;
}

export interface Experience {
  _id: string;
  title: string;
  company: string;
  companyWebsite?: string;
  companyLogo?: string;
  location?: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
  order: number;
  isPublished: boolean;
  duration?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage?: string;
  images: string[];
  technologies: string[];
  category: 'Web' | 'Mobile' | 'AI/ML' | 'DevOps' | 'API' | 'Open Source' | 'Other';
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  startDate?: string;
  endDate?: string;
  views: number;
  clicks: number;
}

export interface Skill {
  _id: string;
  name: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Cloud' | 'Tools' | 'Other';
  proficiency: number;
  icon?: string;
  color?: string;
  yearsOfExperience: number;
  order: number;
  isPublished: boolean;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  readingTime: number;
  views: number;
  publishedAt?: string;
  createdAt: string;
}

export interface PortfolioData {
  experiences: Experience[];
  projects: Project[];
  skillsByCategory: Record<string, Skill[]>;
  blogs: Blog[];
}
