import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Monitor, 
  Server, 
  Database, 
  GitBranch, 
  Layers, 
  Palette, 
  Cpu, 
  Sparkles 
} from 'lucide-react'
import { LogoLoop, type LogoItem } from '@/components/ui/LogoLoop'
import { TechIcon } from '@/components/ui/TechIcon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useSkills } from '@/hooks/api/useSkills'
import { getTechComponent } from '@/lib/tech-icons'
import { QueryState } from '@/components/common/QueryState'
import type { ApiSkill } from '@/types/api'

interface TypedLogoItem extends LogoItem {
  name: string;
  component: React.ElementType;
}

// 6 Core Engineering Domains aligned with real full-stack commercial delivery
const SPECIALTIES = [
  {
    icon: Monitor,
    title: 'Front-End Development',
    desc: 'Building responsive, reusable React interfaces from Figma designs, with API integration, loading and error handling, localization and role-based screens.',
    tags: ['React', 'JavaScript', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Material UI'],
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    icon: Server,
    title: 'Back-End & APIs',
    desc: 'Developing REST APIs with Node.js, Fastify and Express, with input validation and role-based authentication.',
    tags: ['Node.js', 'Fastify', 'Express', 'TypeScript', 'REST APIs'],
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    icon: Database,
    title: 'Database & Schema Design',
    desc: 'Designing relational and document data models with Prisma, PostgreSQL, MySQL and MongoDB, including a 93-entity schema for a backend migration project.',
    tags: ['PostgreSQL', 'MongoDB', 'MySQL', 'Prisma'],
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    icon: GitBranch,
    title: 'Workflow & Deployment',
    desc: 'Working with GitHub Actions CI/CD, pull requests and code reviews in an Agile Scrum team, and deploying across development, testing, staging and production environments.',
    tags: ['GitHub Actions', 'Git', 'Jira', 'Vercel', 'Firebase'],
    color: 'text-violet-500',
    bg: 'bg-violet-500/10'
  },
  {
    icon: Layers,
    title: 'Full-Stack Integration',
    desc: 'Connecting React frontends to backend services and third-party tools such as Stripe payments, Clerk and Firebase authentication, and Resend email, in role-based and multi-tenant products.',
    tags: ['Stripe', 'Firebase', 'Clerk', 'Resend', 'Multi-Tenant Apps'],
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    icon: Palette,
    title: 'UI Development & Design Tools',
    desc: 'Turning Figma designs into responsive interfaces with Tailwind CSS, shadcn/ui and Material UI.',
    tags: ['Figma', 'Tailwind CSS', 'shadcn/ui', 'Material UI'],
    color: 'text-pink-500',
    bg: 'bg-pink-500/10'
  }
]

// Fallback skills database matching the live backend response
const STATIC_SKILLS: ApiSkill[] = [
  { id: '1', name: 'Next.js', category: 'FRAMEWORK', icon: 'NextjsIcon', showInSkills: true, sortOrder: 1 },
  { id: '2', name: 'React', category: 'FRONTEND', icon: '_React', showInSkills: true, sortOrder: 2 },
  { id: '3', name: 'TypeScript', category: 'FRONTEND', icon: 'TypescriptIcon', showInSkills: true, sortOrder: 3 },
  { id: '4', name: 'JavaScript', category: 'FRONTEND', icon: 'Javascript', showInSkills: true, sortOrder: 4 },
  { id: '5', name: 'HTML5', category: 'FRONTEND', icon: 'Html5', showInSkills: true, sortOrder: 5 },
  { id: '6', name: 'CSS3', category: 'FRONTEND', icon: 'Css3', showInSkills: true, sortOrder: 6 },
  { id: '7', name: 'Tailwind CSS', category: 'CSS_FRAMEWORK', icon: 'TailwindIcon', showInSkills: true, sortOrder: 7 },
  { id: '8', name: 'Bootstrap', category: 'CSS_FRAMEWORK', icon: 'Bootstrap', showInSkills: true, sortOrder: 8 },
  { id: '9', name: 'Shadcn UI', category: 'FRONTEND', icon: 'ShadcnUi', showInSkills: true, sortOrder: 9 },
  { id: '10', name: 'MaterialUi', category: 'CSS_FRAMEWORK', icon: 'MaterialUi', showInSkills: true, sortOrder: 10 },
  { id: '11', name: 'Redux Toolkit', category: 'FRONTEND', icon: 'Redux', showInSkills: true, sortOrder: 11 },
  { id: '12', name: 'Zustand', category: 'FRONTEND', icon: 'zustand', showInSkills: true, sortOrder: 12 },
  { id: '13', name: 'TanStack Query', category: 'FRONTEND', icon: 'TanstackIcon', showInSkills: true, sortOrder: 13 },
  { id: '14', name: 'Node.js', category: 'BACKEND', icon: 'NodejsIcon', showInSkills: true, sortOrder: 14 },
  { id: '15', name: 'Express.js', category: 'BACKEND', icon: 'Express', showInSkills: true, sortOrder: 15 },
  { id: '16', name: 'Fastify', category: 'BACKEND', icon: 'Fastify', showInSkills: true, sortOrder: 16 },
  { id: '17', name: 'PHP', category: 'BACKEND', icon: 'Php', showInSkills: true, sortOrder: 17 },
  { id: '18', name: 'Laravel', category: 'BACKEND', icon: 'Laravel', showInSkills: true, sortOrder: 18 },
  { id: '19', name: 'Python', category: 'BACKEND', icon: 'Python', showInSkills: true, sortOrder: 19 },
  { id: '20', name: 'Flask', category: 'BACKEND', icon: 'Flask', showInSkills: true, sortOrder: 20 },
  { id: '21', name: 'PyTorch', category: 'BACKEND', icon: 'Pytorch', showInSkills: true, sortOrder: 21 },
  { id: '22', name: 'C#', category: 'BACKEND', icon: 'CSharp', showInSkills: true, sortOrder: 22 },
  { id: '23', name: 'ASP.NET MVC', category: 'BACKEND', icon: 'Dotnet', showInSkills: true, sortOrder: 23 },
  { id: '24', name: 'Prisma ORM', category: 'BACKEND', icon: 'Prisma', showInSkills: true, sortOrder: 24 },
  { id: '25', name: 'PostgreSQL', category: 'DATABASE', icon: 'Postgresql', showInSkills: true, sortOrder: 25 },
  { id: '26', name: 'MySQL', category: 'DATABASE', icon: 'Mysql', showInSkills: true, sortOrder: 26 },
  { id: '27', name: 'MongoDB', category: 'DATABASE', icon: 'MongodbIcon', showInSkills: true, sortOrder: 27 },
  { id: '28', name: 'Git', category: 'TOOL', icon: 'GitIcon', showInSkills: true, sortOrder: 28 },
  { id: '29', name: 'GitHub', category: 'TOOL', icon: 'GithubIcon', showInSkills: true, sortOrder: 29 },
  { id: '30', name: 'GitHub Actions', category: 'TOOL', icon: 'GithubActions', showInSkills: true, sortOrder: 30 },
  { id: '31', name: 'Vite', category: 'TOOL', icon: 'Vite', showInSkills: true, sortOrder: 31 },
  { id: '32', name: 'Docker', category: 'TOOL', icon: 'DockerIcon', showInSkills: true, sortOrder: 32 },
  { id: '33', name: 'Postman', category: 'TOOL', icon: 'Postman', showInSkills: true, sortOrder: 33 },
  { id: '34', name: 'Figma', category: 'DESIGN_TOOL', icon: 'Figma', showInSkills: true, sortOrder: 34 },
  { id: '35', name: 'Clerk', category: 'SERVICE', icon: 'Clerk', showInSkills: true, sortOrder: 35 },
  { id: '36', name: 'Firebase', category: 'SERVICE', icon: 'FirebaseIcon', showInSkills: true, sortOrder: 36 },
  { id: '37', name: 'Stripe', category: 'SERVICE', icon: 'Stripe', showInSkills: true, sortOrder: 37 },
  { id: '38', name: 'Cloudflare R2', category: 'SERVICE', icon: 'CloudflareIcon', showInSkills: true, sortOrder: 38 },
  { id: '39', name: 'Vercel', category: 'SERVICE', icon: 'VercelIcon', showInSkills: true, sortOrder: 39 },
  { id: '40', name: 'Netlify', category: 'SERVICE', icon: 'Netlify', showInSkills: true, sortOrder: 40 },
  { id: '41', name: 'Resend', category: 'SERVICE', icon: 'resend', showInSkills: true, sortOrder: 41 },
  { id: '42', name: 'Vapi.ai', category: 'SERVICE', icon: 'vapi', showInSkills: true, sortOrder: 42 },
  { id: '43', name: 'Zod', category: 'TOOL', icon: 'Zod', showInSkills: true, sortOrder: 43 },
  { id: '44', name: 'Render', category: 'SERVICE', icon: 'render', showInSkills: true, sortOrder: 44 },
]

export function Skills() {
  const { data: apiSkills = [], isLoading, isError, error, refetch } = useSkills();

  // Combine API skills with fallback and ensure proper sort ordering
  const skillsList = useMemo(() => {
    const source = (apiSkills && apiSkills.length > 0) ? apiSkills : STATIC_SKILLS;
    return source.slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [apiSkills]);

  // Categorize live skills dynamically from backend
  const { frontendTechs, backendTechs, toolsTechs } = useMemo(() => {
    if (!skillsList || skillsList.length === 0) {
      return { frontendTechs: [], backendTechs: [], toolsTechs: [] };
    }

    const frontendCategories = ['FRONTEND', 'CSS_FRAMEWORK'];
    const backendCategories = ['BACKEND', 'DATABASE'];
    const toolCategories = ['TOOL', 'SERVICE', 'DESIGN_TOOL'];

    const frontend = skillsList.filter((s: ApiSkill) => 
      frontendCategories.includes(s.category) || (s.category === 'FRAMEWORK' && ['React', 'Next.js', 'Vite'].includes(s.name))
    );

    const backend = skillsList.filter((s: ApiSkill) => 
      backendCategories.includes(s.category) || (s.category === 'FRAMEWORK' && ['Laravel', 'Express', 'Fastify', 'NestJS'].includes(s.name))
    );

    const tools = skillsList.filter((s: ApiSkill) => 
      toolCategories.includes(s.category) || (!frontendCategories.includes(s.category) && !backendCategories.includes(s.category) && s.category !== 'FRAMEWORK')
    );

    const toLogoItem = (s: ApiSkill): TypedLogoItem => ({
      title: s.name,
      name: s.name,
      component: getTechComponent(s.name, s.icon)
    });

    return {
      frontendTechs: frontend.map(toLogoItem),
      backendTechs: backend.map(toLogoItem),
      toolsTechs: tools.map(toLogoItem)
    };
  }, [skillsList]);

  return (
    <section id="skills" data-ambient="skills" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          icon={Cpu}
          pillText="Domain Expertise"
          title="Full-Stack"
          highlight="Toolkit."
          subtitle="Bridging the gap between conceptual design and robust engineering through a comprehensive technical stack."
        />

        {/* 6 Core Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-24 sm:mb-28">
          {SPECIALTIES.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
              className="group relative flex flex-col justify-between bg-card border border-border/60 rounded-3xl p-6 sm:p-7 transition-all duration-500 hover:border-primary/50 hover:-translate-y-1.5 hover:rotate-[0.25deg] hover:shadow-xl hover:shadow-primary/5 overflow-hidden"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xs`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2.5 text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-[13.5px] leading-relaxed text-muted-foreground mb-4">
                  {item.desc}
                </p>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/40">
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-foreground group-hover:border-primary/30 border border-border/60 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Decorative blur */}
              <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech Cloud / Scroll Section - Full width container */}
      <div className="border-t border-border/50 pt-16 sm:pt-20 relative overflow-hidden px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 border border-border/60 text-muted-foreground text-[11px] font-mono uppercase tracking-[0.25em] mb-12">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Powering My Daily Workflow</span>
          </div>

          <QueryState
            isLoading={isLoading}
            isError={isError}
            error={error}
            data={isError ? null : skillsList}
            onRetry={() => refetch()}
            loadingComponent={
              <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8">
                <div className="h-16 w-full rounded-2xl bg-muted/30 animate-pulse" />
                <div className="h-16 w-full rounded-2xl bg-muted/30 animate-pulse" />
              </div>
            }
          >
            <div className="flex flex-col gap-10 sm:gap-12 w-full max-w-[100vw] overflow-hidden">
              {frontendTechs.length > 0 && (
                <LogoLoop
                  logos={frontendTechs}
                  speed={35}
                  direction="left"
                  gap={44}
                  hoverSpeed={10}
                  scaleOnHover={true}
                  fadeOut={true}
                  renderItem={(item) => {
                    const tech = item as TypedLogoItem;
                    return (
                      <div className="w-24 sm:w-28 flex justify-center">
                        <TechIcon size="xl" showLabel name={tech.name} component={tech.component} />
                      </div>
                    );
                  }}
                />
              )}

              {backendTechs.length > 0 && (
                <LogoLoop
                  logos={backendTechs}
                  speed={35}
                  direction="right"
                  gap={44}
                  hoverSpeed={10}
                  scaleOnHover={true}
                  fadeOut={true}
                  renderItem={(item) => {
                    const tech = item as TypedLogoItem;
                    return (
                      <div className="w-24 sm:w-28 flex justify-center">
                        <TechIcon size="xl" showLabel name={tech.name} component={tech.component} />
                      </div>
                    );
                  }}
                />
              )}

              {toolsTechs.length > 0 && (
                <LogoLoop
                  logos={toolsTechs}
                  speed={35}
                  direction="left"
                  gap={44}
                  hoverSpeed={10}
                  scaleOnHover={true}
                  fadeOut={true}
                  renderItem={(item) => {
                    const tech = item as TypedLogoItem;
                    return (
                      <div className="w-24 sm:w-28 flex justify-center">
                        <TechIcon size="xl" showLabel name={tech.name} component={tech.component} />
                      </div>
                    );
                  }}
                />
              )}
            </div>
          </QueryState>
        </motion.div>
      </div>
    </section>
  )
}
