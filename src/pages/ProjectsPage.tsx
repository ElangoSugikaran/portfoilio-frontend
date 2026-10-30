import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ExternalLink,
  Building2,
  Lock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProjects } from '@/hooks/api/useProjects'
import { isCompanyProject, formatProjectDisplay } from '@/lib/project-utils'
import { RenderTechIcon } from '@/lib/tech-icons'
import { QueryState } from '@/components/common/QueryState'
import { queryClient } from '@/lib/query-client'
import { queryKeys } from '@/lib/query-keys'
import { projectService } from '@/services/project.service'
import { SEO } from '@/components/common/SEO'
import type { ApiProject } from '@/types/api'

// ─────────────────────────────────────────────
// COMPONENTS & ICONS
// ─────────────────────────────────────────────

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
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

const ITEMS_PER_PAGE = 6;

const ProjectCardSkeleton = () => (
  <div className="flex flex-col bg-card/60 border border-border/40 rounded-3xl overflow-hidden animate-pulse">
    {/* Visual Header Skeleton */}
    <div className="relative aspect-[16/10] bg-muted/40 overflow-hidden">
      <div className="absolute top-3.5 left-3.5 w-24 h-6 rounded-full bg-muted/80" />
    </div>

    {/* Content Skeleton */}
    <div className="flex flex-col flex-1 p-6">
      <div className="h-6 w-3/4 rounded-lg bg-muted/70 mb-2" />
      <div className="h-3.5 w-1/2 rounded bg-primary/20 mb-4" />
      <div className="space-y-2 mb-5">
        <div className="h-3.5 w-full rounded bg-muted/60" />
        <div className="h-3.5 w-4/5 rounded bg-muted/50" />
      </div>

      {/* Tech Chips Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-6 w-16 rounded-lg bg-muted/60" />
        <div className="h-6 w-20 rounded-lg bg-muted/60" />
        <div className="h-6 w-16 rounded-lg bg-muted/60" />
      </div>

      {/* Buttons Skeleton */}
      <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-border/40">
        <div className="h-10 flex-1 rounded-xl bg-muted/70" />
        <div className="h-10 flex-1 rounded-xl bg-muted/50" />
        <div className="h-10 w-16 rounded-xl bg-muted/50 shrink-0" />
      </div>
    </div>
  </div>
);

const ArchiveProjectCard = ({
  project,
  index,
}: {
  project: ApiProject;
  index: number;
}) => {
  const primaryTech = project.technologies?.[0]?.name || 'Code';
  const projectSlug = project.slug || project.id;
  const isCompany = isCompanyProject(project);
  const display = formatProjectDisplay(project);

  const prefetchProject = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.projects.detail(projectSlug),
      queryFn: () => projectService.getProjectById(projectSlug),
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.4), ease: 'easeOut' }}
      onMouseEnter={prefetchProject}
      className="group relative flex flex-col bg-card border border-border/50 rounded-3xl overflow-hidden transition-all duration-400 hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Visual Header (Top) */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted/20 border-b border-border/40">
        {project.thumbnail?.url ? (
          <div className="w-full h-full relative overflow-hidden">
            <img
              src={project.thumbnail.url}
              alt={display.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-400" />
          </div>
        ) : (
          <div className="absolute inset-0 p-6 flex items-center justify-center">
            <div className="w-full h-full relative border border-border/50 rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute top-0 left-0 right-0 h-5 border-b border-border/40 bg-muted/50 flex items-center px-3 gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="w-full h-full opacity-25 group-hover:opacity-90 transition-opacity duration-400 flex items-center justify-center text-foreground">
                <RenderTechIcon name={primaryTech} className="w-20 h-20" />
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between gap-2 pointer-events-none">
          <div>
            {isCompany ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 backdrop-blur-md font-mono shadow-xs">
                <Building2 className="w-3 h-3 text-amber-500" />
                Company Work
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-background/85 backdrop-blur-md border border-border/60 text-muted-foreground font-mono shadow-xs">
                {project.category?.name || 'Full Stack'}
              </span>
            )}
          </div>

          {project.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-500 dark:text-sky-400 border border-sky-500/30 backdrop-blur-md font-mono shadow-xs">
              ★ Featured
            </span>
          )}
        </div>
      </div>

      {/* Content Area (Bottom) */}
      <div className="flex flex-col flex-1 p-6 relative z-10">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground tracking-tight mb-1.5 group-hover:text-primary transition-colors duration-200">
            {display.title}
          </h3>
          <p className="text-xs font-semibold text-primary/90 tracking-wide font-mono uppercase mb-2.5">
            {display.tagline}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground mb-5 line-clamp-2">
            {display.summary}
          </p>

          {/* Tech Stack Chips */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {project.technologies.slice(0, 4).map((tech) => (
                <div
                  key={tech.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/40 border border-border/40 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  <RenderTechIcon
                    name={tech.name}
                    iconKey={tech.icon}
                    className="w-3.5 h-3.5 shrink-0"
                  />
                  <span>{tech.name}</span>
                </div>
              ))}
              {project.technologies.length > 4 && (
                <span className="text-[11px] font-mono text-muted-foreground/70 px-1.5 py-0.5 rounded bg-muted/30">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: Clean & Explicit (No duplicate Overview button) */}
        {/* Action Buttons: 100% Unified & Consistent across all cards */}
        <div className="mt-auto flex flex-col items-stretch gap-2 border-t border-border/40 pt-4 lg:flex-row lg:items-center lg:gap-2.5">
          {project.liveUrl ? (
            // Scenario 1: Live Demo Available -> Live Demo (primary) + Project Details + Code/Private
            <>
              <Button
                asChild
                size="sm"
                className="h-10 w-full rounded-xl bg-primary px-2.5 text-xs font-medium text-primary-foreground shadow-md shadow-primary/20 transition-all hover:brightness-110 active:scale-95 sm:text-sm sm:px-4 lg:flex-1"
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-10 w-full rounded-xl border-border/60 px-2.5 text-xs font-medium hover:border-primary/40 hover:bg-muted/60 sm:text-sm sm:px-4 lg:flex-1"
              >
                <Link to={`/projects/${projectSlug}`} className="flex items-center justify-center gap-1.5">
                  <span>Project Details</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </Button>

              {project.githubUrl ? (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-10 w-full shrink-0 rounded-xl border-border/60 px-3 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-muted/60 hover:text-primary sm:text-sm lg:w-auto"
                  title={`View source code for ${display.title} on GitHub`}
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View source code for ${display.title} on GitHub`}
                    className="flex items-center gap-1.5"
                  >
                    <GithubIcon className="w-4 h-4 shrink-0" />
                    <span>Code</span>
                  </a>
                </Button>
              ) : isCompany ? (
                <div
                  className="flex h-10 w-full shrink-0 items-center justify-center gap-1.5 self-stretch select-none rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 lg:w-fit lg:self-auto"
                  title="Private Company Repository"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Private</span>
                </div>
              ) : null}
            </>
          ) : (
            // Scenario 2: No Live Demo -> Project Details (primary) + Code/Private
            <>
              <Button
                asChild
                size="sm"
                className="h-10 w-full rounded-xl bg-primary px-3 text-xs font-medium text-primary-foreground shadow-md shadow-primary/20 transition-all hover:brightness-110 active:scale-95 sm:text-sm sm:px-4 lg:flex-1"
              >
                <Link to={`/projects/${projectSlug}`} className="flex items-center justify-center gap-1.5">
                  <span>Project Details</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </Button>

              {project.githubUrl ? (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-10 w-full shrink-0 rounded-xl border-border/60 px-3.5 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-muted/60 hover:text-primary sm:text-sm lg:w-auto"
                  title={`View source code for ${display.title} on GitHub`}
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View source code for ${display.title} on GitHub`}
                    className="flex items-center gap-1.5"
                  >
                    <GithubIcon className="w-4 h-4 shrink-0" />
                    <span>Code</span>
                  </a>
                </Button>
              ) : isCompany ? (
                <div
                  className="flex h-10 w-full shrink-0 items-center justify-center gap-1.5 self-stretch select-none rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 lg:w-fit lg:self-auto"
                  title="Private Company Repository"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Private</span>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const {
    data: projectList,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useProjects({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    ...(selectedCategory !== 'all' ? { category: selectedCategory } : {}),
  });
  const projects = projectList?.projects ?? [];

  // Filter counts are computed across all matching projects, not just this page.
  const categoriesWithCounts = useMemo(() => {
    const list: { id: string; label: string; count: number }[] = [
      { id: 'all', label: 'All Projects', count: projectList?.filters?.total ?? 0 },
    ];

    for (const category of projectList?.filters?.categories ?? []) {
      list.push({
        id: category.id,
        label: category.name,
        count: category.count,
      });
    }

    return list;
  }, [projectList?.filters]);

  // Auto-fallback to 'all' if the selected category is no longer available
  useEffect(() => {
    if (
      selectedCategory !== 'all' &&
      projectList?.filters &&
      !categoriesWithCounts.some((c) => c.id === selectedCategory)
    ) {
      setSelectedCategory('all');
      setCurrentPage(1);
    }
  }, [categoriesWithCounts, projectList?.filters, selectedCategory]);

  const totalPages = projectList?.pagination?.totalPages ?? 0;
  const totalProjects = projectList?.pagination?.total ?? 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = projects;

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || isFetching) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 140, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId: string) => {
    if (catId === selectedCategory || isFetching) return;
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  return (
    <div data-ambient="projects" className="min-h-dvh relative pt-20 sm:pt-24 pb-28 px-4 sm:px-6 md:px-12 lg:px-20">
      <SEO
        title="All Projects | Elango Sugikaran"
        description="A comprehensive showcase of commercial platforms, web applications, open-source architectures, and engineering experiments built by Elango Sugikaran."
      />
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section (No Back Button, No Dash) */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold font-mono tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portfolio Showcase</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight">
              All <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500">Projects</span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl">
              A comprehensive showcase of commercial platforms, web applications, open-source architectures, and engineering experiments.
            </p>
          </div>
        </motion.div>

        {/* Category Filters Bar (Wrap layout, clean alignment, no clipped edges) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-8 sm:mb-10">
          {categoriesWithCounts.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`group relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 font-semibold'
                    : 'bg-card/70 hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/60 hover:border-primary/40'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono transition-colors ${
                    isActive
                      ? 'bg-primary-foreground/20 text-primary-foreground font-semibold'
                      : 'bg-muted text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Query State with Rich Skeleton Loading */}
        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          data={projects}
          onRetry={() => refetch()}
          emptyTitle="No projects available"
          emptyMessage="No published projects found at this time."
          loadingComponent={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <ProjectCardSkeleton key={n} />
              ))}
            </div>
          }
        >
          {paginatedProjects.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <Layers className="w-12 h-12 text-muted-foreground/40 mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-1">No projects in this category</h3>
              <p className="text-sm text-muted-foreground mb-5">Try selecting another filter above.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCategorySelect('all')}
                className="rounded-xl"
              >
                View All Projects
              </Button>
            </div>
          ) : isFetching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <ProjectCardSkeleton key={n} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                <AnimatePresence mode="popLayout">
                  {paginatedProjects.map((project, index) => (
                    <ArchiveProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination Section */}
              {totalPages > 1 && (
                <div className="mt-12 sm:mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium order-2 sm:order-1 font-mono">
                    Showing <span className="text-foreground font-semibold">{startIndex + 1}</span>–
                    <span className="text-foreground font-semibold">
                      {Math.min(startIndex + ITEMS_PER_PAGE, totalProjects)}
                    </span>{' '}
                    of <span className="text-foreground font-semibold">{totalProjects}</span> projects
                  </p>

                  <div className="flex items-center gap-1.5 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="rounded-xl h-9 px-3 gap-1 border-border/60 text-xs font-medium disabled:opacity-40"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>

                    <div className="flex items-center gap-1 mx-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        const isCurrent = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 rounded-xl text-xs font-mono transition-all ${
                              isCurrent
                                ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/25'
                                : 'bg-card/60 hover:bg-muted border border-border/60 text-muted-foreground hover:text-foreground'
                            }`}
                            aria-label={`Go to page ${pageNum}`}
                            aria-current={isCurrent ? 'page' : undefined}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-xl h-9 px-3 gap-1 border-border/60 text-xs font-medium disabled:opacity-40"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </QueryState>
      </div>
    </div>
  );
}
