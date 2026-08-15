export const TECH_ICONS: Record<string, string> = {
  'PHP': 'devicon-php-plain',
  'MySQL': 'devicon-mysql-plain',
  'JavaScript': 'devicon-javascript-plain',
  'Bootstrap': 'devicon-bootstrap-plain',
  'React': 'devicon-react-original',
  'Node.js': 'devicon-nodejs-plain',
  'MongoDB': 'devicon-mongodb-plain',
  'Express.js': 'devicon-express-original',
  'Next.js': 'devicon-nextjs-plain',
  'Tailwind CSS': 'devicon-tailwindcss-plain',
  'Framer Motion': 'devicon-framer-original',
  'TypeScript': 'devicon-typescript-plain',
};

export interface Project {
  id: number;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  category: string;
  github: string;
  live: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    tagline: 'Enterprise-grade scalable shopping solution',
    description:
      'A high-performance e-commerce engine featuring advanced inventory scaling, secure checkout flows, and real-time order tracking with high reliability.',
    tech: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap'],
    category: 'Full Stack',
    github: 'https://github.com/elangosugikaran/ecommerce',
    live: 'https://ecommerce-demo.com',
  },
  {
    id: 2,
    title: 'Task Management System',
    tagline: 'Team collaboration & workflow engine',
    description:
      'Collaborative workspace with real-time syncing, role-based access control, and kanban-style task orchestration for modern distributed teams.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express.js'],
    category: 'SaaS Tool',
    github: 'https://github.com/elangosugikaran/task-manager',
    live: 'https://taskmanager-demo.com',
  },
  {
    id: 3,
    title: 'Portfolio Website',
    tagline: 'Performance-first personal showcase',
    description:
      'A high-end developer portfolio built with React and Tailwind, focusing on performance, accessibility, and modern aesthetics.',
    tech: ['React', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
    category: 'Design Engineering',
    github: 'https://github.com/elangosugikaran/portfolio',
    live: 'https://elangosugikaran.com',
  },
];
