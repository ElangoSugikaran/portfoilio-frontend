import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ExternalLink, ArrowRight, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────
// DATA - Professional & Focused
// ─────────────────────────────────────────────

import { projects, TECH_ICONS } from '@/data/projects'

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

const GridBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.04 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(var(--foreground) 1px, transparent 1px),
          linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 90%)'
      }}
    />
  </div>
)

const ProjectCard = ({ project }: { project: typeof projects[0] }) => {
  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.25, 1, 0.5, 1]
          }
        }
      }}
      className="group relative flex flex-col lg:flex-row bg-card border border-border/50 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 w-full h-full"
    >
      {/* Visual Header */}
      <div className="relative w-full lg:w-[45%] aspect-video lg:aspect-auto overflow-hidden bg-muted/30 shrink-0 border-b lg:border-b-0 lg:border-r border-border/50">
        <div className="absolute inset-0 p-8 flex items-center justify-center">
          <div className="w-full h-full relative border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col items-center justify-center">
            {/* Minimal UI Simulation */}
            <div className="absolute top-0 left-0 right-0 h-6 border-b border-border/50 bg-muted/50 flex items-center px-3 gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="w-full h-full opacity-20 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              {(() => {
                const TechComp = TECH_ICONS[project.tech[0]];
                return TechComp ? <TechComp className="w-32 h-32" /> : null;
              })()}
            </div>

            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-background/90 backdrop-blur-md border border-border/50 text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-all duration-300">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-7 sm:p-9 relative z-10">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm font-medium text-primary opacity-80 mb-4 tracking-wide font-mono uppercase text-[10px]">
            {project.tagline}
          </p>
          <p className="text-[15px] leading-relaxed text-muted-foreground mb-8 line-clamp-3">
            {project.description}
          </p>

          {/* Tech Stack Icons with Staggered Animation */}
          <div className="flex flex-wrap gap-x-5 gap-y-4 mb-9">
            {project.tech.map((t, index) => {
              const TechComp = TECH_ICONS[t];
              return (
                <motion.div 
                  key={t} 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 group/icon transition-colors duration-200"
                >
                  {TechComp ? (
                    <TechComp className="text-lg md:text-xl text-muted-foreground group-hover/icon:text-primary transition-colors w-5 h-5 md:w-6 md:h-6" />
                  ) : null}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover/icon:text-foreground transition-colors">{t}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button className="w-full rounded-xl bg-primary text-primary-foreground hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10 border-none h-11">
              Live Demo
              <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </Button>
          </a>
          <div className="flex gap-2">
            <Link to={`/projects/${project.id}`} className="flex-1">
              <Button variant="outline" className="w-full rounded-xl border-border/50 text-foreground hover:bg-muted/50 h-11">
                Details
              </Button>
            </Link>
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="rounded-xl w-11 h-11 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50 group/gh">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 transition-transform group-hover/gh:scale-110"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-clip scroll-margin-top">
      <GridBackground />
      
      {/* Subtle Background Gradients to match Experience section */}
      <div className="absolute top-1/4 right-0 w-100 h-100 bg-primary/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          icon={Code2}
          pillText="Portfolio"
          title="Featured"
          highlight="Work."
          subtitle="A curated selection of engineering projects focused on scalability, performance, and refined user experience."
        >
          <Link to="/projects">
            <Button variant="link" className="text-primary font-bold text-lg p-0 group h-auto">
              Explore Full Archive
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </Link>
        </SectionHeading>

        {/* Projects Grid - Native CSS Sticky Stack */}
        <div className="flex flex-col gap-16 lg:gap-24 pb-12 md:pb-24 relative">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="sticky"
              style={{ top: `calc(12vh + ${index * 2}rem)` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
