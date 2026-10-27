import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Server, Database, GitBranch, Smartphone, Palette, Cpu } from 'lucide-react'
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
    desc: 'Proficient in relational and NoSQL databases like MySQL, MongoDB, and PostgreSQL. Designing optimized schemas for data integrity.',
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

export function Skills() {
  const { data: skills = [], isLoading, isError, error, refetch } = useSkills();

  // Categorize live skills dynamically from backend
  const { frontendTechs, backendTechs, toolsTechs } = useMemo(() => {
    if (!skills || skills.length === 0) {
      return { frontendTechs: [], backendTechs: [], toolsTechs: [] };
    }

    const frontendCategories = ['FRONTEND', 'CSS_FRAMEWORK'];
    const backendCategories = ['BACKEND', 'DATABASE'];
    const toolCategories = ['TOOL', 'SERVICE', 'DESIGN_TOOL'];

    const frontend = skills.filter((s: ApiSkill) => 
      frontendCategories.includes(s.category) || (s.category === 'FRAMEWORK' && ['React', 'Next.js', 'Vite'].includes(s.name))
    );

    const backend = skills.filter((s: ApiSkill) => 
      backendCategories.includes(s.category) || (s.category === 'FRAMEWORK' && ['Laravel', 'Express', 'Fastify', 'NestJS'].includes(s.name))
    );

    const tools = skills.filter((s: ApiSkill) => 
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
  }, [skills]);

  return (
    <section id="skills" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
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

          <QueryState
            isLoading={isLoading}
            isError={isError}
            error={error}
            data={skills}
            onRetry={() => refetch()}
            loadingComponent={
              <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8">
                <div className="h-16 w-full rounded-2xl bg-muted/30 animate-pulse" />
                <div className="h-16 w-full rounded-2xl bg-muted/30 animate-pulse" />
              </div>
            }
          >
            <div className="flex flex-col gap-12 w-full max-w-[100vw] overflow-hidden">
              {frontendTechs.length > 0 && (
                <LogoLoop
                  logos={frontendTechs}
                  speed={40}
                  direction="left"
                  gap={48}
                  hoverSpeed={10}
                  scaleOnHover={true}
                  fadeOut={true}
                  fadeOutColor="var(--background)"
                  renderItem={(item) => {
                    const tech = item as TypedLogoItem;
                    return (
                      <div className="w-28 flex justify-center">
                        <TechIcon size="xl" showLabel name={tech.name} component={tech.component} />
                      </div>
                    );
                  }}
                />
              )}

              {backendTechs.length > 0 && (
                <LogoLoop
                  logos={backendTechs}
                  speed={40}
                  direction="right"
                  gap={48}
                  hoverSpeed={10}
                  scaleOnHover={true}
                  fadeOut={true}
                  fadeOutColor="var(--background)"
                  renderItem={(item) => {
                    const tech = item as TypedLogoItem;
                    return (
                      <div className="w-28 flex justify-center">
                        <TechIcon size="xl" showLabel name={tech.name} component={tech.component} />
                      </div>
                    );
                  }}
                />
              )}

              {toolsTechs.length > 0 && (
                <LogoLoop
                  logos={toolsTechs}
                  speed={40}
                  direction="left"
                  gap={48}
                  hoverSpeed={10}
                  scaleOnHover={true}
                  fadeOut={true}
                  fadeOutColor="var(--background)"
                  renderItem={(item) => {
                    const tech = item as TypedLogoItem;
                    return (
                      <div className="w-28 flex justify-center">
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
