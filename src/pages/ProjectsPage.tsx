import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProjects } from '@/hooks/api/useProjects'
import { RenderTechIcon } from '@/lib/tech-icons'
import { QueryState } from '@/components/common/QueryState'
import { queryClient } from '@/main'
import { queryKeys } from '@/lib/query-keys'
import { projectService } from '@/services/project.service'
import { SEO } from '@/components/common/SEO'
import type { ApiProject } from '@/types/api'

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

const GridBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
    <div
      className="absolute inset-0 opacity-[0.04]"
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

const ArchiveProjectCard = ({ 
  project, 
  index 
}: { 
  project: ApiProject; 
  index: number;
}) => {
  const primaryTech = project.technologies?.[0]?.name || 'Code';
  const projectSlug = project.slug || project.id;

  const prefetchProject = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.projects.detail(projectSlug),
      queryFn: () => projectService.getProjectById(projectSlug),
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      onMouseEnter={prefetchProject}
      className="group relative flex flex-col bg-card border border-border/50 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
    >
      {/* Visual Header (Top) */}
      <div className="relative aspect-video overflow-hidden bg-muted/30 border-b border-border/50">
        {project.thumbnail?.url ? (
          <div className="w-full h-full relative overflow-hidden">
            <img
              src={project.thumbnail.url}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
          </div>
        ) : (
          <div className="absolute inset-0 p-6 flex items-center justify-center">
            <div className="w-full h-full relative border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col items-center justify-center">
              {/* Minimal UI Simulation */}
              <div className="absolute top-0 left-0 right-0 h-5 border-b border-border/50 bg-muted/50 flex items-center px-3 gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              </div>

              <div className="w-full h-full opacity-20 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center text-foreground">
                <RenderTechIcon name={primaryTech} className="w-24 h-24" />
              </div>

              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-background/90 backdrop-blur-md border border-border/50 text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-all duration-300">
            {project.category?.name || 'Full Stack'}
          </span>
        </div>
      </div>

      {/* Content Area (Bottom) */}
      <div className="flex flex-col flex-1 p-6 relative z-10">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-xs font-medium text-primary opacity-80 mb-3 tracking-wide font-mono uppercase">
            {project.shortDescription}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground mb-6 line-clamp-3">
            {project.description.replace(/<[^>]*>?/gm, '')}
          </p>

          {/* Tech Stack Icons */}
          <div className="flex flex-wrap gap-x-4 gap-y-3 mb-6">
            {project.technologies?.slice(0, 5).map((tech) => (
              <div key={tech.id} className="flex items-center gap-2 group/icon transition-colors duration-200">
                <RenderTechIcon
                  name={tech.name}
                  iconKey={tech.icon}
                  className="text-lg text-muted-foreground group-hover/icon:text-primary transition-colors w-5 h-5"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover/icon:text-foreground transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          {project.liveUrl ? (
            <Button asChild className="w-full rounded-xl bg-primary text-primary-foreground hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10 border-none h-10">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                Live Demo
                <ExternalLink className="w-3.5 h-3.5 ml-2" />
              </a>
            </Button>
          ) : (
            <Button asChild className="w-full rounded-xl bg-primary text-primary-foreground hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10 border-none h-10">
              <Link to={`/projects/${projectSlug}`}>
                Overview
              </Link>
            </Button>
          )}

          <div className="flex gap-2 flex-1">
            <Button asChild variant="outline" className="flex-1 rounded-xl border-border/50 text-foreground hover:bg-muted/50 h-10">
              <Link to={`/projects/${projectSlug}`}>
                Details
              </Link>
            </Button>

            {project.githubUrl && (
              <Button asChild variant="ghost" size="icon" className="rounded-xl w-10 h-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50 group/gh">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover/gh:scale-110"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function ProjectsPage() {
  const { data: projects = [], isLoading, isError, error, refetch } = useProjects();

  return (
    <div className="min-h-screen relative bg-background pt-24 pb-32 px-4 sm:px-6 md:px-12 lg:px-24">
      <SEO
        title="Project Archive | Sugikaran"
        description="A comprehensive archive of engineering projects, systems, architectures, and open-source applications built by Sugikaran."
      />
      <GridBackground />
      
      {/* Subtle Background Gradients */}
      <div className="fixed top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-0 left-0 w-125 h-125 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Button asChild variant="ghost" className="mb-8 hover:bg-muted/50 rounded-xl">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-0.5 bg-linear-to-r from-primary to-transparent shrink-0" />
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase">
              Full <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">Archive</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl ml-0 md:ml-22">
            A comprehensive collection of my engineering projects, experiments, and open-source contributions.
          </p>
        </motion.div>

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          data={projects}
          onRetry={() => refetch()}
          emptyTitle="Archive is empty"
          emptyMessage="No published projects found in the archive at this time."
          loadingComponent={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-96 w-full rounded-3xl bg-card/40 border border-border/30 animate-pulse" />
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {projects.map((project, index) => (
              <ArchiveProjectCard 
                key={project.id} 
                project={project} 
                index={index}
              />
            ))}
          </div>
        </QueryState>
      </div>
    </div>
  )
}
