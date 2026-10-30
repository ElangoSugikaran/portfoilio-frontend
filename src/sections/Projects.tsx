import { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ExternalLink, ArrowRight, Code2, Sparkles, Layers, Building2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProjects } from '@/hooks/api/useProjects'
import { isCompanyProject, formatProjectDisplay } from '@/lib/project-utils'
import { RenderTechIcon } from '@/lib/tech-icons'
import { QueryState } from '@/components/common/QueryState'
import { cn } from '@/lib/utils'
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

const CTA_CLASS =
  'min-h-11 rounded-lg px-3 text-xs font-semibold whitespace-nowrap shadow-2xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:rounded-xl sm:px-3.5 md:text-sm lg:min-h-10 pointer-coarse:min-h-11'

const PRIMARY_CTA_CLASS = `${CTA_CLASS} bg-primary text-primary-foreground shadow-md shadow-primary/10 hover:brightness-110`

const OUTLINE_CTA_CLASS = `${CTA_CLASS} border-border/70 bg-transparent hover:bg-muted/50`

function GithubIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
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
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// STORY CARD COMPONENT
// ─────────────────────────────────────────────

interface StoryCardProps {
  project: ApiProject;
  index: number;
  total: number;
}

const StoryCard = ({ project, index, total }: StoryCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const prefetchedRef = useRef(false)
  const theme = STORY_THEMES[index % STORY_THEMES.length];
  const projectSlug = project.slug || project.id;
  const primaryTech = project.technologies?.[0]?.name || 'Full Stack';
  const diagramCount = project.media?.filter((m) => m.role === 'DIAGRAM').length || 0;
  const technologies = project.technologies ?? [];

  const { title: displayTitle, tagline, summary } = formatProjectDisplay(project);
  const isCompany = isCompanyProject(project);
  const hasThreeActions = Boolean(project.liveUrl && (project.githubUrl || isCompany));
  const compactCtaSpacing = hasThreeActions ? 'px-1' : '';

  const prefetchProject = useCallback(() => {
    if (prefetchedRef.current) return;
    prefetchedRef.current = true;

    queryClient.prefetchQuery({
      queryKey: queryKeys.projects.detail(projectSlug),
      queryFn: () => projectService.getProjectById(projectSlug),
    });
  }, [projectSlug]);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          prefetchProject();
          observer.disconnect();
        }
      },
      { rootMargin: '240px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [prefetchProject]);

  const storyNumber = String(index + 1).padStart(2, '0');
  const totalCount = String(total).padStart(2, '0');

  return (
    <div
      ref={cardRef}
      onMouseEnter={prefetchProject}
      onFocusCapture={prefetchProject}
      onTouchStart={prefetchProject}
      className="relative flex min-h-0 w-full flex-1 flex-col justify-between gap-3"
    >
      {/* Dynamic Ambient Background */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-linear-to-br ${theme.gradient} opacity-40 dark:opacity-60`}
      />

      {/* ──────────────── Top Meta Bar ──────────────── */}
      <div
        data-anim="meta"
        className="relative z-10 flex flex-col items-start justify-between gap-2 border-b border-border/60 pb-2 sm:flex-row sm:items-center sm:gap-3 sm:pb-3.5"
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 sm:gap-2.5 md:gap-3">
          <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-foreground whitespace-nowrap sm:text-xs md:text-sm">
            FEATURED
          </span>
          <span className="hidden h-1.5 w-1.5 rounded-full bg-border sm:inline-block" />
          {isCompany ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-600 shadow-2xs whitespace-nowrap sm:px-2.5 dark:text-amber-400">
              <Building2 className="h-2.5 w-2.5 shrink-0 text-amber-500 sm:h-3 sm:w-3" />
              <span>Company</span>
            </span>
          ) : (
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap sm:px-2.5 ${theme.badge}`}
            >
              {project.category?.name || 'Full Stack'}
            </span>
          )}
        </div>

        {/* Story Pagination Step Indicator */}
        <div className="flex shrink-0 items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground sm:gap-2">
          <span className={theme.accent}>{storyNumber}</span>
          <span className="opacity-40">/</span>
          <span className="opacity-60">{totalCount}</span>
        </div>
      </div>

      {/* ──────────────── Main Narrative & Showcase Grid ──────────────── */}
      <div className="relative z-10 grid min-h-0 flex-1 grid-cols-1 items-start gap-4 py-1 sm:gap-6 sm:py-2 md:py-3 lg:grid-cols-12 lg:items-center lg:gap-8 xl:gap-10">

        {/* Left Column: Narrative & Technical Spec (6 cols) */}
        <div className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-col justify-center lg:col-span-6">
          <div className="mb-2 min-w-0 sm:mb-2.5">
            <h3
              data-anim="title"
              className="text-[clamp(1.5rem,7vw,2rem)] leading-[1.08] font-black tracking-tight text-foreground uppercase [overflow-wrap:anywhere] sm:text-[2.125rem] md:text-4xl lg:text-4xl xl:text-5xl [@media(min-width:1024px)_and_(max-height:760px)]:text-4xl"
            >
              {displayTitle}
            </h3>
            {tagline && (
              <p
                data-anim="tagline"
                className="mt-0.5 line-clamp-2 text-[11px] font-semibold tracking-wide text-primary/90 [overflow-wrap:anywhere] sm:mt-1 sm:text-sm"
              >
                {tagline}
              </p>
            )}
          </div>

          <p
            data-anim="summary"
            className="my-1.5 line-clamp-3 max-w-full text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere] sm:my-2.5 md:my-3 lg:max-w-lg"
          >
            {summary}
          </p>

          {/* Tech Stack Pills */}
          {technologies.length > 0 && (
            <div
              data-anim="chips"
              className="mb-2.5 flex min-w-0 max-w-full flex-wrap items-center gap-1 sm:mb-3.5 sm:gap-1.5 md:mb-4 md:gap-2"
            >
              {technologies.slice(0, 6).map((tech, techIndex) => (
                <div
                  key={tech.id}
                  data-anim="chip"
                  className={cn(
                    'inline-flex min-w-0 max-w-full items-center gap-1 rounded-md border border-border/60 bg-background/80 px-1.5 py-0.5 text-muted-foreground transition-colors duration-200 hover:border-border hover:text-foreground sm:gap-1.5 sm:px-2.5 sm:py-1 dark:bg-zinc-900/80',
                    techIndex >= 3 && 'hidden sm:inline-flex',
                  )}
                >
                  <RenderTechIcon
                    name={tech.name}
                    iconKey={tech.icon}
                    className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5"
                  />
                  <span className="min-w-0 text-[11px] font-semibold uppercase tracking-wider font-mono [overflow-wrap:anywhere]">
                    {tech.name}
                  </span>
                </div>
              ))}

              {technologies.length > 3 && (
                <span className="shrink-0 px-1 py-0.5 font-mono text-[11px] text-muted-foreground sm:hidden">
                  +{technologies.length - 3}
                </span>
              )}
              {technologies.length > 6 && (
                <span className="hidden shrink-0 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground sm:inline">
                  +{technologies.length - 6}
                </span>
              )}
            </div>
          )}

          {/* Action CTAs - Responsive Button Layout */}
          <div
            data-anim="cta-group"
            className={cn(
              'w-full max-w-full items-center gap-1.5 pt-0.5 sm:gap-2',
              hasThreeActions
                ? 'grid grid-cols-3 sm:flex sm:flex-wrap'
                : 'flex flex-wrap',
            )}
          >
            {project.liveUrl ? (
              // Scenario 1: Live Demo Available -> Live Demo (primary) + Project Details (outline) + Code/Private
              <>
                <Button asChild className={cn(PRIMARY_CTA_CLASS, 'w-full sm:w-auto', compactCtaSpacing)}>
                  <a
                    data-anim="cta"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn('flex items-center', hasThreeActions ? 'gap-1 sm:gap-1.5' : 'gap-1.5')}
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className={cn(OUTLINE_CTA_CLASS, 'flex-1 sm:flex-none', compactCtaSpacing)}
                >
                  <Link
                    data-anim="cta"
                    to={`/projects/${projectSlug}`}
                    className={cn('flex items-center', hasThreeActions ? 'gap-1 sm:gap-1.5' : 'gap-1.5')}
                  >
                    <span>Details</span>
                    <ArrowRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </Button>

                {isCompany ? (
                  <div
                    data-anim="cta"
                    role="note"
                    aria-label={`Private company repository for ${project.title}`}
                    title="Private Company Repository"
                    className={cn(
                      'inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2 font-mono text-xs font-semibold text-amber-600 select-none sm:flex-none sm:gap-1.5 sm:rounded-xl sm:px-3 lg:min-h-10 dark:text-amber-400 pointer-coarse:min-h-11',
                      compactCtaSpacing,
                    )}
                  >
                    <Lock className="h-2.5 w-2.5 shrink-0 text-amber-500 sm:h-3.5 sm:w-3.5" />
                    <span>Private</span>
                  </div>
                ) : project.githubUrl ? (
                  <Button
                    asChild
                    variant="outline"
                    className={cn(OUTLINE_CTA_CLASS, 'flex-1 sm:flex-none', compactCtaSpacing)}
                  >
                    <a
                      data-anim="cta"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`View source code for ${project.title} on GitHub`}
                      aria-label={`View source code for ${project.title} on GitHub`}
                      className={cn('flex items-center', hasThreeActions ? 'gap-1 sm:gap-1.5' : 'gap-1.5')}
                    >
                      <GithubIcon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                      <span>Code</span>
                    </a>
                  </Button>
                ) : null}
              </>
            ) : (
              // Scenario 2: No Live Demo -> Project Details (primary) + Code/Private
              <>
                <Button asChild className={cn(PRIMARY_CTA_CLASS, 'w-full sm:w-auto', compactCtaSpacing)}>
                  <Link
                    data-anim="cta"
                    to={`/projects/${projectSlug}`}
                    className={cn('flex items-center', hasThreeActions ? 'gap-1 sm:gap-1.5' : 'gap-1.5')}
                  >
                    <span>Details</span>
                    <ArrowRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </Button>

                {isCompany ? (
                  <div
                    data-anim="cta"
                    role="note"
                    aria-label={`Private company repository for ${project.title}`}
                    title="Private Company Repository"
                    className={cn(
                      'inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2 font-mono text-xs font-semibold text-amber-600 select-none sm:flex-none sm:gap-1.5 sm:rounded-xl sm:px-3 lg:min-h-10 dark:text-amber-400 pointer-coarse:min-h-11',
                      compactCtaSpacing,
                    )}
                  >
                    <Lock className="h-2.5 w-2.5 shrink-0 text-amber-500 sm:h-3.5 sm:w-3.5" />
                    <span>Private</span>
                  </div>
                ) : project.githubUrl ? (
                  <Button
                    asChild
                    variant="outline"
                    className={cn(OUTLINE_CTA_CLASS, 'flex-1 sm:flex-none', compactCtaSpacing)}
                  >
                    <a
                      data-anim="cta"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`View source code for ${project.title} on GitHub`}
                      aria-label={`View source code for ${project.title} on GitHub`}
                      className={cn('flex items-center', hasThreeActions ? 'gap-1 sm:gap-1.5' : 'gap-1.5')}
                    >
                      <GithubIcon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                      <span>Code</span>
                    </a>
                  </Button>
                ) : null}
              </>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Browser Frame Mockup (6 cols) - Responsive sizing */}
        <div className="relative order-first flex h-auto w-full min-w-0 items-center justify-center mb-2 sm:mb-4 lg:order-last lg:col-span-6 lg:mb-0">
          <Link
            data-anim="mockup"
            to={`/projects/${projectSlug}`}
            aria-label={`View ${project.title} project details`}
            className="group/mockup relative flex aspect-[16/10] w-full max-w-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-lg transition-[border-color,box-shadow] duration-500 hover:border-primary/50 hover:shadow-primary/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:aspect-video sm:max-w-[42rem] sm:rounded-2xl sm:shadow-xl lg:max-h-[calc(100dvh-14rem)] lg:max-w-135 [@media(min-width:1024px)_and_(max-height:720px)]:max-h-[calc(100dvh-12rem)] dark:border-white/10 dark:bg-zinc-950/90"
          >
            {/* Browser Header Bar */}
            <div className="flex h-6 shrink-0 items-center justify-between gap-1.5 border-b border-border/60 bg-muted/50 px-2 sm:h-7 sm:gap-2.5 sm:px-3 md:h-8 dark:bg-zinc-900/90">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#ff5f56]/80 sm:h-2.5 sm:w-2.5" />
                <div className="h-2 w-2 rounded-full bg-[#ffbd2e]/80 sm:h-2.5 sm:w-2.5" />
                <div className="h-2 w-2 rounded-full bg-[#27c93f]/80 sm:h-2.5 sm:w-2.5" />
              </div>
              <div className="flex h-3.5 max-w-32 flex-1 items-center truncate rounded border border-border/40 bg-background/50 px-1.5 font-mono text-[11px] text-muted-foreground select-none sm:h-4.5 sm:max-w-45 sm:px-2 md:h-5 md:max-w-60 dark:bg-zinc-800/60 max-[399px]:hidden">
                sugikaran.dev/{projectSlug}
              </div>
              <Sparkles className="h-2.5 w-2.5 shrink-0 text-muted-foreground/60 sm:h-3 sm:w-3" />
            </div>

            {/* Screen Viewport */}
            <div className="relative flex w-full flex-1 items-center justify-center overflow-hidden bg-muted/20 dark:bg-zinc-950/70">
              {project.thumbnail?.url ? (
                <div
                  data-anim="mockup-image"
                  className="relative flex h-full w-full items-start justify-center overflow-hidden"
                >
                  <img
                    src={project.thumbnail.url}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover/mockup:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/mockup:scale-100"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/mockup:opacity-100" />
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center sm:p-3 md:p-4">
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 sm:mb-2 sm:h-12 sm:w-12 sm:rounded-2xl md:h-14 md:w-14">
                    <RenderTechIcon name={primaryTech} className="h-5 w-5 text-primary sm:h-6 sm:w-6 md:h-7 md:w-7" />
                  </div>
                  <p className="line-clamp-1 text-xs font-bold text-foreground md:text-sm">{project.title}</p>
                  <p className="mt-0.5 line-clamp-1 font-mono text-[11px] text-muted-foreground">
                    Architecture & Source
                  </p>
                </div>
              )}

              {/* Bottom Badge Info Tag inside Screen */}
              {diagramCount > 0 && (
                <div className="absolute right-1.5 bottom-1.5 z-10 sm:right-2.5 sm:bottom-2.5">
                  <span className="inline-flex items-center gap-0.5 rounded-md border border-border/70 bg-background/90 px-1.5 py-0.5 font-mono text-[11px] font-bold text-foreground shadow-md whitespace-nowrap backdrop-blur-md sm:gap-1.5 sm:px-2 dark:bg-zinc-950/90">
                    <Layers className="h-2.5 w-2.5 shrink-0 text-primary sm:h-3 sm:w-3" />
                    {diagramCount} {diagramCount === 1 ? 'Diagram' : 'Diagrams'}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* ──────────────── Bottom Narrative Footer ──────────────── */}
      <div className="relative z-10 flex flex-row items-center justify-between gap-2 border-t border-border/60 pt-2 font-mono text-[11px] text-muted-foreground sm:pt-3">
        <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap sm:gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${theme.dot}`} />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-foreground/80">
            {project.status === 'PUBLISHED' ? 'Production Ready' : 'Engineering Showcase'}
          </span>
          <span className="truncate text-[11px] opacity-75 sm:hidden">
            · {isCompany ? 'Commercial' : 'Independent'}
          </span>
        </div>

        <div className="hidden flex-wrap items-center gap-2 text-[11px] opacity-75 sm:flex">
          <span className="whitespace-nowrap">{isCompany ? 'Commercial' : 'Independent'}</span>
          <span>•</span>
          <span className="whitespace-nowrap">Full Stack Dev</span>
        </div>
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
  const { data, isLoading, isError, error, refetch } = useProjects({
    feature: true,
    page: 1,
    pageSize: 5,
  });
  const projects = data?.projects ?? [];

  return (
    <section id="projects" data-ambient="projects" className="relative py-14 sm:py-20 px-2 sm:px-4 md:px-6 lg:px-8 overflow-visible">

      {/* Section Heading Container */}
      <div className="relative z-10 max-w-6xl mx-auto mb-6 sm:mb-10 px-2 sm:px-4">
        <SectionHeading
          icon={Code2}
          pillText="Portfolio"
          title="Featured"
          highlight="Works."
          subtitle="Selected production platforms, company deliverables, and full-stack web applications."
        >
          <Button asChild variant="link" className="text-primary font-bold text-lg p-0 group h-auto cursor-pointer">
            <Link to="/projects">
              Explore Full Archive
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </Button>
        </SectionHeading>
      </div>

      {/* Story Scroll Showcase Deck Container */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          data={projects}
          onRetry={() => refetch()}
          emptyTitle="No featured projects"
          emptyMessage="Check back soon for new projects and deliverables."
          loadingComponent={
            <div className="flex flex-col gap-12 pb-12">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-96 w-full rounded-3xl bg-card/40 border border-border/30 animate-pulse" />
              ))}
            </div>
          }
        >
          <StoryScroll
            className="w-full"
            showProgress
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
