'use client'

import { motion } from 'framer-motion'
import { Monitor, Server, Database, GitBranch, Smartphone, Palette, Cpu, Globe, Rocket, Lock } from 'lucide-react'
import { LogoLoop } from '@/components/ui/LogoLoop'

const GlowingBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
    {/* Animated glowing orbs */}
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[120px] mix-blend-screen"
    />
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen"
    />
    {/* Soft subtle dots overlay instead of grid */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: 'radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        maskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 80%)'
      }}
    />
  </div>
)

const SPECIALTIES = [
  {
    icon: Monitor,
    title: 'Front-End Development',
    desc: 'Expertise in modern frameworks like React and Next.js, building ultra-responsive, accessible, and high-performance user interfaces.',
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    icon: Server,
    title: 'Back-End Development',
    desc: 'Architecting scalable server-side systems with Node.js and PHP. Focused on security, performance, and robust API design.',
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    icon: Database,
    title: 'Database Management',
    desc: 'Proficient in relational and NoSQL databases like MySQL, MongoDB, and MSSQL. Designing optimized schemas for data integrity.',
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    icon: GitBranch,
    title: 'Version Control & CI/CD',
    desc: 'Mastering Git workflows and collaborative development. Implementing automated deployment pipelines for continuous delivery.',
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    desc: 'Ensuring seamless user experiences across all devices and resolutions through mobile-first strategies and fluid layouts.',
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    icon: Palette,
    title: 'UI/UX Engineering',
    desc: 'Translating complex user requirements and prototypes into intuitive, pixel-perfect digital experiences with a focus on usability.',
    color: 'text-primary',
    bg: 'bg-primary/10'
  }
]

import { 
  Html5, Css3, Javascript, Typescript, _React, Vite, Nextjs, Tailwind, Bootstrap, Sass,
  Nodejs, Express, Fastify, Php, Laravel, Mysql, Mongodb, Postgresql, Firebase, Graphql,
  Git, Github, GithubActions, Docker, Aws, LinuxTux, Vercel, Netlify, Figma, VisualStudioCode, Postman
} from '@dev.icons/react'

const FRONTEND_TECHS = [
  { name: 'HTML5', component: Html5 },
  { name: 'CSS3', component: Css3 },
  { name: 'JavaScript', component: Javascript },
  { name: 'TypeScript', component: Typescript },
  { name: 'React', component: _React },
  { name: 'Vite', component: Vite },
  { name: 'Next.js', component: Nextjs },
  { name: 'Tailwind', component: Tailwind },
  { name: 'Bootstrap', component: Bootstrap },
  { name: 'Sass', component: Sass },
]

const BACKEND_TECHS = [
  { name: 'Node.js', component: Nodejs },
  { name: 'Express', component: Express },
  { name: 'Fastify', component: Fastify },
  { name: 'PHP', component: Php },
  { name: 'Laravel', component: Laravel },
  { name: 'MySQL', component: Mysql },
  { name: 'MongoDB', component: Mongodb },
  { name: 'MSSQL', component: Database },
  { name: 'PostgreSQL', component: Postgresql },
  { name: 'Firebase', component: Firebase },
  { name: 'GraphQL', component: Graphql },
  { name: 'REST API', component: Globe },
]

const TOOLS_TECHS = [
  { name: 'Git', component: Git },
  { name: 'GitHub', component: Github },
  { name: 'GitHub Actions', component: GithubActions },
  { name: 'Docker', component: Docker },
  { name: 'AWS', component: Aws },
  { name: 'Linux', component: LinuxTux },
  { name: 'Vercel', component: Vercel },
  { name: 'Netlify', component: Netlify },
  { name: 'Clerk', component: Lock },
  { name: 'Figma', component: Figma },
  { name: 'VS Code', component: VisualStudioCode },
  { name: 'Antigravity', component: Rocket },
  { name: 'Postman', component: Postman }
]

import { TechIcon } from '@/components/ui/TechIcon'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden scroll-margin-top">
      <GlowingBackground />
      
      {/* Subtle Background Gradients to match other sections */}
      <div className="absolute top-1/4 -right-1/4 w-100 h-100 bg-primary/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 -left-1/4 w-125 h-125 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          icon={Cpu}
          pillText="Domain Expertise"
          title="Full-Stack"
          highlight="Toolkit."
          subtitle="Bridging the gap between conceptual design and robust engineering through a comprehensive technical stack."
        />

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-32">
          {SPECIALTIES.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              className="group relative flex flex-col bg-card border border-border/50 rounded-3xl p-8 transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-3 text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                {item.desc}
              </p>

              {/* Decorative blur */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech Cloud / Scroll Section - Full width container */}
      <div className="border-t border-border/50 pt-24 relative overflow-hidden px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground mb-16">
            Powering my Daily Workflow
          </h4>

          <div className="flex flex-col gap-12 w-full max-w-[100vw] overflow-hidden">
            <LogoLoop
              logos={FRONTEND_TECHS}
              speed={40}
              direction="left"
              gap={48}
              hoverSpeed={10}
              scaleOnHover={true}
              fadeOut={true}
              fadeOutColor="hsl(var(--background))"
              renderItem={(tech) => (
                <div className="w-28 flex justify-center">
                  <TechIcon size="xl" showLabel {...(tech as any)} />
                </div>
              )}
            />

            <LogoLoop
              logos={BACKEND_TECHS}
              speed={40}
              direction="right"
              gap={48}
              hoverSpeed={10}
              scaleOnHover={true}
              fadeOut={true}
              fadeOutColor="hsl(var(--background))"
              renderItem={(tech) => (
                <div className="w-28 flex justify-center">
                  <TechIcon size="xl" showLabel {...(tech as any)} />
                </div>
              )}
            />

            <LogoLoop
              logos={TOOLS_TECHS}
              speed={40}
              direction="left"
              gap={48}
              hoverSpeed={10}
              scaleOnHover={true}
              fadeOut={true}
              fadeOutColor="hsl(var(--background))"
              renderItem={(tech) => (
                <div className="w-28 flex justify-center">
                  <TechIcon size="xl" showLabel {...(tech as any)} />
                </div>
              )}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

