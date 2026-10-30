import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  Target, 
  Sparkles, 
  Compass, 
  Cpu,
  Building2,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProject } from '@/hooks/api/useProjects';
import { isCompanyProject } from '@/lib/project-utils';
import { RenderTechIcon } from '@/lib/tech-icons';
import { RichText } from '@/components/common/RichText';
import { formatDateRange } from '@/lib/date';
import { SEO } from '@/components/common/SEO';
import { QueryState } from '@/components/common/QueryState';
import { ProjectMediaGallery } from '@/components/common/ProjectMediaGallery';

export default function ProjectDetailPage() {
  const { id: slugOrId } = useParams<{ id: string }>();
  const { data: project, isLoading, isError, error, refetch } = useProject(slugOrId);
  const isCompany = isCompanyProject(project);
  const isProjectNotFound =
    isError && typeof error === 'object' && error !== null && 'status' in error && error.status === 404;

  return (
    <div data-ambient="projects" className="min-h-dvh pt-28 pb-36 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-12">
        <QueryState
          isLoading={isLoading}
          isError={isError && !isProjectNotFound}
          error={error}
          data={project}
          onRetry={() => refetch()}
          emptyTitle="Project Not Found"
          emptyMessage="The requested project could not be found or may have been unpublished."
          emptyAction={
            <Button asChild className="rounded-xl mt-4">
              <Link to="/projects">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Projects
              </Link>
            </Button>
          }
          loadingComponent={
            <div className="flex flex-col gap-8 w-full">
              <div className="h-8 w-40 rounded-xl bg-muted/40 animate-pulse" />
              <div className="h-16 w-3/4 rounded-2xl bg-muted/40 animate-pulse" />
              <div className="h-96 w-full rounded-3xl bg-muted/40 animate-pulse" />
            </div>
          }
        >
          {project && (
            <>
              <SEO
                title={`${project.title} | Case Study & Engineering Details`}
                description={project.shortDescription || project.aim || undefined}
                image={project.thumbnail?.url}
              />

              {/* Navigation & Header */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col gap-6"
              >
                {/* Clean Top Navigation Bar */}
                <div className="flex items-center justify-between gap-4">
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group py-1"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-primary" />
                    <span>Back to All Projects</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    {isCompany ? (
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 flex items-center gap-1.5 font-mono shadow-2xs">
                        <Building2 className="w-3.5 h-3.5 text-amber-500" />
                        Company Project
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                        {project.category?.name || 'Project'}
                      </span>
                    )}
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight">
                  {project.title}
                </h1>

                <p className="text-base sm:text-lg text-primary font-mono uppercase tracking-wide">
                  {project.shortDescription}
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {project.liveUrl && (
                    <Button asChild className="h-12 px-7 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        Live Preview
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}

                  {project.githubUrl ? (
                    <Button asChild variant="outline" className="h-12 px-7 rounded-2xl border-border/60 hover:bg-muted/50 font-semibold gap-2 hover:scale-105 transition-all">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        Source Code
                      </a>
                    </Button>
                  ) : isCompany ? (
                    <div 
                      className="h-12 px-5 rounded-2xl border border-amber-500/25 bg-amber-500/10 text-muted-foreground text-xs sm:text-sm font-semibold flex items-center gap-2 select-none"
                      title="Source code is private and proprietary to the company"
                    >
                      <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Private Company Repository</span>
                    </div>
                  ) : null}
                </div>
              </motion.div>

              {/* Thumbnail Hero Container */}
              {project.thumbnail?.url && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="w-full aspect-video rounded-3xl overflow-hidden border border-border/50 shadow-2xl relative bg-muted/20"
                >
                  <img
                    src={project.thumbnail.url}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              )}

              {/* Company Project Notice Banner */}
              {isCompany && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="p-5 sm:p-7 rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start gap-4 sm:gap-5 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-foreground">
                        Company Project · Authorized Showcase
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        Commercial Production
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Company Project. This is a company-owned commercial product that I worked on as a Full Stack Developer. It is showcased here with the company’s authorization. The source code is private and proprietary, so there is no public repository, but I’m happy to walk through the architecture and my contributions on request.
                    </p>
                    {project.liveUrl && (
                      <div className="flex items-center gap-2 pt-1 text-xs font-mono text-primary font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>
                          Live production site active at{' '}
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:opacity-80"
                          >
                            {project.liveUrl}
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Overview & Sanitized Description with RichText */}
              <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border/50 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Project Overview</h2>
                </div>

                <RichText html={project.description} className="text-base sm:text-lg" />
              </div>

              {/* Aim & Purpose */}
              {project.aim && (
                <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border/50 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Project Aim & Purpose</h2>
                  </div>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {project.aim}
                  </p>
                </div>
              )}

              {/* Objectives */}
              {project.objectives && project.objectives.length > 0 && (
                <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border/50 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Compass className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Key Objectives</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5">
                    {project.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-muted/20 border border-border/40 text-sm text-foreground/90">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Core Features */}
              {project.features && project.features.length > 0 && (
                <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border/50 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Core Features</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.features.map((feat, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-muted/20 border border-border/40 text-sm text-foreground/90 flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Showcase & Architecture Gallery */}
              {project.media && project.media.length > 0 && (
                <ProjectMediaGallery
                  media={project.media}
                  projectTitle={project.title}
                />
              )}

              {/* Project Phases / Lifecycle */}
              {project.phases && project.phases.length > 0 && (
                <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border/50 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Project Lifecycle & Execution Phases</h2>
                  </div>

                  <div className="space-y-4">
                    {project.phases.map((phase) => (
                      <div key={phase.id} className="p-5 rounded-2xl bg-muted/20 border border-border/40">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <h3 className="font-bold text-base text-foreground">{phase.name}</h3>
                          {(phase.startDate || phase.endDate) && (
                            <span className="text-xs font-mono text-muted-foreground bg-background px-3 py-1 rounded-full border border-border/50 w-fit">
                              {formatDateRange(phase.startDate, phase.endDate)}
                            </span>
                          )}
                        </div>
                        {phase.tasks && phase.tasks.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {phase.tasks.map((task, idx) => (
                              <span key={idx} className="px-3 py-1 rounded-lg text-xs bg-card border border-border text-muted-foreground">
                                {task}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies Stack */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border/50 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Technologies & Frameworks</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {project.technologies.map((tech) => (
                      <div key={tech.id} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 border border-border/40 group hover:border-primary/50 transition-all">
                        <RenderTechIcon
                          name={tech.name}
                          iconKey={tech.icon}
                          className="w-6 h-6 text-primary group-hover:scale-110 transition-transform"
                        />
                        <span className="text-sm font-bold text-foreground">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom CTA bar */}
              <div className="p-8 rounded-3xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {isCompany ? 'Interested in this company project?' : 'Interested in this project?'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isCompany 
                      ? 'Explore the live platform or reach out to discuss the architecture and implementation details.'
                      : 'Explore the source code or preview the deployment.'}
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {project.liveUrl && (
                    <Button asChild className="w-full sm:w-auto rounded-xl bg-primary text-primary-foreground font-bold">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        Live Demo
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                  {project.githubUrl ? (
                    <Button asChild variant="outline" className="w-full sm:w-auto rounded-xl">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        GitHub Code
                      </a>
                    </Button>
                  ) : isCompany ? (
                    <div 
                      className="px-4 py-2.5 rounded-xl border border-amber-500/25 bg-amber-500/10 text-muted-foreground text-xs font-semibold flex items-center justify-center gap-1.5 select-none"
                      title="Private Company Repository"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Private Repo</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </QueryState>
      </div>
    </div>
  );
}
