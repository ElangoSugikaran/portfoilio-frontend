import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ExternalLink, ArrowRight, Code2, Sparkles, CheckCircle2, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProjects } from '@/hooks/api/useProjects'
import { RenderTechIcon } from '@/lib/tech-icons'
import { QueryState } from '@/components/common/QueryState'
import { queryClient } from '@/lib/query-client'
import { queryKeys } from '@/lib/query-keys'
import { projectService } from '@/services/project.service'
import { StoryScroll, StorySection } from '@/components/ui/story-scroll'
import type { ApiProject } from '@/types/api'

// ─────────────────────────────────────────────
// STORY THEMES CONFIGURATION
// ─────────────────────────────────────────────

const STORY_THEMES = [
  {
    glow: 'rgba(16, 185, 129, 0.22)',
    accent: 'text-emerald-500 dark:text-emerald-400',
    border: 'border-emerald-500/20 dark:border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    gradient: 'from-emerald-500/10 via-cyan-500/5 to-transparent',
    dot: 'bg-emerald-500',
  },
  {
    glow: 'rgba(139, 92, 246, 0.22)',
    accent: 'text-violet-500 dark:text-violet-400',
    border: 'border-violet-500/20 dark:border-violet-500/30',
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    gradient: 'from-violet-500/10 via-fuchsia-500/5 to-transparent',
    dot: 'bg-violet-500',
  },
  {
    glow: 'rgba(59, 130, 246, 0.22)',
    accent: 'text-blue-500 dark:text-blue-400',
    border: 'border-blue-500/20 dark:border-blue-500/30',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    gradient: 'from-blue-500/10 via-amber-500/5 to-transparent',
    dot: 'bg-blue-500',
  },
];

// ─────────────────────────────────────────────
// BACKGROUND DECORATION
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
);

// ─────────────────────────────────────────────
// STORY CARD COMPONENT
// ─────────────────────────────────────────────

interface StoryCardProps {
  project: ApiProject;
  index: number;
  total: number;
}

const StoryCard = ({ project, index, total }: StoryCardProps) => {
  const theme = STORY_THEMES[index % STORY_THEMES.length];
  const projectSlug = project.slug || project.id;
  const primaryTech = project.technologies?.[0]?.name || 'Full Stack';
  const diagramCount = project.media?.filter((m) => m.role === 'DIAGRAM').length || 0;
  
  // Extract key bullet highlights (from features or objectives)
  const keyHighlights = (project.features && project.features.length > 0
    ? project.features
    : project.objectives || []
  ).slice(0, 3);

  const cleanDescription = project.description
    ? project.description.replace(/<[^>]*>?/gm, '').trim()
    : project.shortDescription || '';

  const prefetchProject = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.projects.detail(projectSlug),
      queryFn: () => projectService.getProjectById(projectSlug),
    });
  };

  const storyNumber = String(index + 1).padStart(2, '0');
  const totalCount = String(total).padStart(2, '0');

  return (
    <div
      onMouseEnter={prefetchProject}
      className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-hidden"
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${theme.gradient} pointer-events-none opacity-50 dark:opacity-70`}
      />

      {/* ──────────────── Top Meta Bar ──────────────── */}
      <div className="relative z-10 flex items-center justify-between gap-4 pb-3 sm:pb-4 border-b border-border/60">
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.2em] text-foreground">
            {storyNumber} — CASE STUDY
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-border" />
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${theme.badge}`}
          >
            {project.category?.name || 'Full Stack'}
          </span>
        </div>

        {/* Story Pagination Step Indicator */}
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-muted-foreground">
          <span className={theme.accent}>{storyNumber}</span>
          <span className="opacity-40">/</span>
          <span className="opacity-60">{totalCount}</span>
        </div>
      </div>

      {/* ──────────────── Main Narrative & Showcase Grid ──────────────── */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 py-3 sm:py-4 items-center min-h-0">
        
        {/* Left Column: Narrative & Technical Spec (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center h-full min-h-0 overflow-y-auto lg:overflow-visible pr-1">
          <div className="mb-1.5">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight uppercase leading-[1.15] group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="mt-1 text-[11px] sm:text-xs font-mono font-semibold tracking-wide uppercase text-primary/80">
              {project.shortDescription}
            </p>
          </div>

          <p className="text-xs sm:text-[13px] md:text-sm leading-relaxed text-muted-foreground line-clamp-2 sm:line-clamp-3 mt-1.5 mb-3">
            {cleanDescription}
          </p>

          {/* Key Engineering Highlights / Deliverables */}
          {keyHighlights.length > 0 && (
            <div className="hidden md:flex flex-col gap-1 mb-3.5">
              {keyHighlights.map((highlight, hIdx) => (
                <div key={hIdx} className="flex items-start gap-2 text-xs text-foreground/90">
                  <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${theme.accent}`} />
                  <span className="line-clamp-1">{highlight}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
            {project.technologies?.slice(0, 6).map((tech) => (
              <div
                key={tech.id}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-background/80 dark:bg-zinc-900/80 border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200"
              >
                <RenderTechIcon
                  name={tech.name}
                  iconKey={tech.icon}
                  className="w-3.5 h-3.5 shrink-0"
                />
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider font-mono">
                  {tech.name}
                </span>
              </div>
            ))}
            {project.technologies && project.technologies.length > 6 && (
              <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5">
                +{project.technologies.length - 6} more
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
            {project.liveUrl ? (
              <Button
                asChild
                className="rounded-xl bg-primary text-primary-foreground hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10 h-9 sm:h-10 px-4 cursor-pointer font-semibold text-xs sm:text-sm"
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live Preview
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </Button>
            ) : (
              <Button
                asChild
                className="rounded-xl bg-primary text-primary-foreground hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10 h-9 sm:h-10 px-4 cursor-pointer font-semibold text-xs sm:text-sm"
              >
                <Link to={`/projects/${projectSlug}`}>
                  Explore Case Study
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              className="rounded-xl border-border/70 hover:bg-muted/50 h-9 sm:h-10 px-4 cursor-pointer font-semibold text-xs sm:text-sm"
            >
              <Link to={`/projects/${projectSlug}`}>
                Technical Details
              </Link>
            </Button>

            {project.githubUrl && (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="rounded-xl w-9 sm:w-10 h-9 sm:h-10 border border-border/60 hover:bg-muted/50 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={`View ${project.title} on GitHub`}
              >
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Browser Frame Mockup (5 cols) */}
        <div className="lg:col-span-5 relative w-full h-full min-h-[190px] sm:min-h-[240px] lg:min-h-[300px] flex items-center justify-center">
          <Link
            to={`/projects/${projectSlug}`}
            className="group/mockup relative w-full h-full rounded-2xl border border-border/80 dark:border-zinc-800 bg-background/60 dark:bg-zinc-900/60 backdrop-blur-md overflow-hidden flex flex-col shadow-xl transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
          >
            {/* Browser Header Bar */}
            <div className="h-7 sm:h-8 px-3 bg-muted/40 dark:bg-zinc-900/90 border-b border-border/60 flex items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
              </div>
              <div className="flex-1 max-w-[180px] sm:max-w-[220px] h-4.5 sm:h-5 rounded bg-background/50 dark:bg-zinc-800/60 border border-border/40 px-2 flex items-center text-[9px] sm:text-[10px] font-mono text-muted-foreground truncate select-none">
                sugikaran.dev/{projectSlug}
              </div>
              <Sparkles className="w-3 h-3 text-muted-foreground/60" />
            </div>

            {/* Screen Viewport */}
            <div className="relative flex-1 w-full overflow-hidden bg-muted/20">
              {project.thumbnail?.url ? (
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={project.thumbnail.url}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top group-hover/mockup:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-60 group-hover/mockup:opacity-30 transition-opacity duration-500" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
                    <RenderTechIcon name={primaryTech} className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground">{project.title}</p>
                  <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                    Architecture & Source Code
                  </p>
                </div>
              )}

              {/* Bottom Badge Info Tag inside Screen */}
              {diagramCount > 0 && (
                <div className="absolute bottom-2.5 right-2.5 z-10">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono font-bold bg-background/90 dark:bg-zinc-950/90 border border-border/70 backdrop-blur-md text-foreground shadow-md">
                    <Layers className="w-3 h-3 text-primary" />
                    {diagramCount} Diagrams
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* ──────────────── Bottom Narrative Footer ──────────────── */}
      <div className="relative z-10 pt-2.5 border-t border-border/60 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${theme.dot} animate-pulse`} />
          <span className="uppercase tracking-widest text-[9px] sm:text-[10px]">
            {project.status === 'PUBLISHED' ? 'Production Ready' : 'Engineering Showcase'}
          </span>
        </div>

        <Link
          to={`/projects/${projectSlug}`}
          className="hover:text-primary transition-colors flex items-center gap-1 font-semibold"
        >
          View Case Study
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PROJECTS SECTION ROOT
// ─────────────────────────────────────────────

const getShortProjectTitle = (project: ApiProject) => {
  const t = project.title.toLowerCase();
  if (t.includes('dentassist')) return 'DentAssist AI';
  if (t.includes('mebius')) return 'Mebius Store';
  if (t.includes('crystal vision')) return 'Crystal Vision';
  const clean = project.title.split(/[-—:]/)[0].trim();
  return clean.length > 16 ? clean.slice(0, 15) + '…' : clean;
};

export function Projects() {
  const { data: projects = [], isLoading, isError, error, refetch } = useProjects({ featured: true });

  return (
    <section id="projects" className="relative py-20 sm:py-28 px-3 sm:px-6 md:px-12 lg:px-20 overflow-visible">
      <GridBackground />
      
      {/* Background Gradients constrained to avoid horizontal overflow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          icon={Code2}
          pillText="Portfolio"
          title="Featured"
          highlight="Works."
          subtitle="An unfolding scrollytelling journey through selected engineering case studies, modern architectures, and full-stack solutions."
        >
          <Button asChild variant="link" className="text-primary font-bold text-lg p-0 group h-auto cursor-pointer">
            <Link to="/projects">
              Explore Full Archive
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </Button>
        </SectionHeading>

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          data={projects}
          onRetry={() => refetch()}
          emptyTitle="No featured projects"
          emptyMessage="Check back soon for new case studies and projects."
          loadingComponent={
            <div className="flex flex-col gap-12 pb-12">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 w-full rounded-3xl bg-card/40 border border-border/30 animate-pulse" />
              ))}
            </div>
          }
        >
          {/* ──────────────── Story Scroll Deck ──────────────── */}
          <StoryScroll
            className="mt-4 sm:mt-6"
            totalCards={projects.length}
            projectTitles={projects.map(getShortProjectTitle)}
          >
            {projects.map((project, index) => (
              <StorySection
                key={project.id}
                index={index}
                total={projects.length}
                themeColor={STORY_THEMES[index % STORY_THEMES.length].glow}
              >
                <StoryCard
                  project={project}
                  index={index}
                  total={projects.length}
                />
              </StorySection>
            ))}
          </StoryScroll>
        </QueryState>
      </div>
    </section>
  );
}
