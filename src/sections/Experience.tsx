import { useId, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Building2,
  Laptop,
  Code2,
  Terminal,
  Globe,
  MapPin,
  CheckCircle2,
} from 'lucide-react'
import DOMPurify from 'dompurify'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useExperience } from '@/hooks/api/useExperience'
import { useSettings } from '@/hooks/api/useSettings'
import { formatDateRange } from '@/lib/date'
import { QueryState } from '@/components/common/QueryState'
import type { ApiExperience } from '@/types/api'

interface ExperienceView extends ApiExperience {
  techTags?: string[] | null;
  duration?: string | null;
  statusLabel?: string | null;
}

// Resolve an icon element without creating a component type during render.
function getExperienceIcon(iconName?: string | null) {
  switch (iconName?.toLowerCase()) {
    case 'building2':
    case 'building':
    case 'company':
      return <Building2 className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />;
    case 'laptop':
    case 'freelance':
    case 'remote':
      return <Laptop className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />;
    case 'code':
    case 'code2':
    case 'developer':
      return <Code2 className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />;
    case 'terminal':
      return <Terminal className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />;
    case 'globe':
      return <Globe className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />;
    default:
      return <Briefcase className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />;
  }
}

// Helper to calculate human-readable duration (e.g. "6 mos", "1 yr 9 mos")
function formatDuration(startDate?: string | null, endDate?: string | null): string | null {
  if (!startDate) return null;
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (totalMonths <= 0) return '1 mo';
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) return `${years} yr ${months} mo${months > 1 ? 's' : ''}`;
  if (years > 0) return `${years} yr${years > 1 ? 's' : ''}`;
  return `${totalMonths} mo${totalMonths > 1 ? 's' : ''}`;
}

// Parses HTML or newline bullets while preserving rich formatting (<strong>, <em>, etc.)
const parseBullets = (desc?: string | null): string[] => {
  if (!desc) return [];
  if (/<li[^>]*>/i.test(desc)) {
    const matches = desc.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (matches && matches.length > 0) {
      return matches
        .map(m =>
          m
            .replace(/^<li[^>]*>/i, '')
            .replace(/<\/li>$/i, '')
            .replace(/^<p[^>]*>/i, '')
            .replace(/<\/p>$/i, '')
            .trim()
        )
        .filter(Boolean);
    }
  }
  const lines = desc
    .split('\n')
    .map(l => l.trim().replace(/^[-•*]\s*/, ''))
    .filter(Boolean);
  if (lines.length > 0) return lines;
  return desc.trim() ? [desc.trim()] : [];
};

// Sanitize bullet HTML to allow safe formatting tags
const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'b', 'em', 'i', 'code', 'span', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
};

function ExperienceCard({ exp, index }: { exp: ExperienceView; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  const techPanelId = useId();
  const bulletsPanelId = useId();

  const [techExpanded, setTechExpanded] = useState(false);
  const [bulletsExpanded, setBulletsExpanded] = useState(false);

  const bulletPoints = parseBullets(exp.description);
  const duration = exp.duration || formatDuration(exp.startDate, exp.endDate);
  const dateRange = formatDateRange(exp.startDate, exp.endDate);
  const isPresent = !exp.endDate;
  const rawStatus = exp.statusLabel?.trim();
  const statusLabel = rawStatus || (isPresent ? 'Active Role' : 'Completed');
  const isActive = /active|present|current|ongoing/i.test(statusLabel) || (!rawStatus && isPresent);

  const TECH_LIMIT = 8;
  const techTags = exp.techTags ?? [];
  const visibleTechTags = techTags.slice(0, TECH_LIMIT);
  const extraTechTags = techTags.slice(TECH_LIMIT);
  const hasMoreTech = extraTechTags.length > 0;

  const MOBILE_BULLET_LIMIT = 2;
  const firstBullets = bulletPoints.slice(0, MOBILE_BULLET_LIMIT);
  const extraBullets = bulletPoints.slice(MOBILE_BULLET_LIMIT);
  const hasMoreBullets = extraBullets.length > 0;

  const bulletListVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const bulletItemVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
  };

  const cardHover =
    'transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card/70 motion-reduce:hover:translate-y-0';

  return (
    <motion.li
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={
        shouldReduceMotion
          ? undefined
          : { duration: 0.5, ease: 'easeOut', delay: Math.min(index * 0.08, 0.24) }
      }
      className="group relative min-w-0 pl-5 sm:pl-16 lg:pl-24"
    >
      {/* Mobile timeline dot */}
      <span
        className="absolute left-0 top-6 h-3 w-3 rounded-full border-2 border-background bg-primary shadow-sm sm:hidden"
        aria-hidden="true"
      />

      {/* Tablet / desktop icon rail */}
      <div className="absolute left-0 top-0 z-10 hidden h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border-2 border-border/80 bg-card shadow-md ring-4 ring-background transition-all duration-300 group-hover:scale-110 group-hover:border-primary motion-reduce:group-hover:scale-100 sm:flex lg:h-[52px] lg:w-[52px]">
        {getExperienceIcon(exp.icon)}
      </div>

      {/* Card */}
      <div
        className={`relative flex w-full min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-4 shadow-xs sm:rounded-3xl sm:p-6 lg:p-8 ${cardHover}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Header */}
        <div className="relative z-10 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-6 lg:gap-y-2">
          <div className="order-1 flex min-w-0 items-start gap-3 lg:col-start-1 lg:row-start-1">
            {/* Mobile company icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-border/80 bg-card ring-2 ring-background sm:hidden">
              {getExperienceIcon(exp.icon)}
            </div>
            <h3 className="min-w-0 text-[clamp(1.25rem,5vw,1.75rem)] font-extrabold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary lg:text-3xl [overflow-wrap:anywhere]">
              {exp.role}
            </h3>
          </div>

          <div className="order-2 flex min-w-0 flex-wrap items-center gap-2 lg:col-start-2 lg:row-start-1 lg:justify-end">
            {dateRange && (
              <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-3.5 py-1.5 font-mono text-xs font-semibold text-muted-foreground shadow-2xs sm:text-sm">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{dateRange}</span>
              </span>
            )}
            {duration && (
              <span className="inline-flex max-w-full items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-[11px] font-bold text-primary">
                {duration}
              </span>
            )}
          </div>

          {statusLabel && (
            <div className="order-3 lg:col-start-2 lg:row-start-2 lg:justify-self-end">
              {isActive ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 sm:text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
                  {statusLabel}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-border/50 bg-muted px-2.5 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground sm:text-xs">
                  {statusLabel}
                </span>
              )}
            </div>
          )}

          {(exp.company || exp.location) && (
            <div className="order-4 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 text-sm font-medium text-foreground/85 lg:col-start-1 lg:row-start-2">
              {exp.company &&
                (exp.companyUrl ? (
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex min-h-11 min-w-0 items-center gap-1.5 rounded-sm py-1 font-bold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:min-h-0 lg:py-0"
                  >
                    <span className="min-w-0 [overflow-wrap:anywhere]">{exp.company}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60 transition-all group-hover/link:translate-x-0.5 group-hover/link:opacity-100" />
                  </a>
                ) : (
                  <span className="min-w-0 font-bold text-foreground [overflow-wrap:anywhere]">
                    {exp.company}
                  </span>
                ))}
              {exp.company && exp.location && (
                <span className="text-muted-foreground/40" aria-hidden="true">
                  •
                </span>
              )}
              {exp.location && (
                <span className="flex min-w-0 items-center gap-1.5 font-mono text-xs text-muted-foreground sm:text-sm">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                  <span className="min-w-0 [overflow-wrap:anywhere]">{exp.location}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bullets */}
        {bulletPoints.length > 0 && (
          <div className="relative z-10 space-y-3">
            <motion.ul
              variants={bulletListVariants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView={shouldReduceMotion ? undefined : 'visible'}
              viewport={{ once: true, margin: '-40px' }}
              className="space-y-2.5 sm:space-y-3"
            >
              {firstBullets.map((item, i) => (
                <motion.li
                  key={i}
                  variants={bulletItemVariants}
                  className="group/bullet flex items-start gap-2.5 sm:gap-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary transition-transform group-hover/bullet:scale-110 motion-reduce:group-hover/bullet:scale-100">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <div
                    className="min-w-0 flex-1 text-sm leading-[1.6] text-muted-foreground md:text-[15px] lg:text-base [&_a]:text-primary [&_a]:underline [&_strong]:font-semibold [&_strong]:text-foreground [overflow-wrap:anywhere]"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(item) }}
                  />
                </motion.li>
              ))}
            </motion.ul>

            {hasMoreBullets && (
              <div
                id={bulletsPanelId}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none sm:grid-rows-[1fr] sm:opacity-100 ${
                  bulletsExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <motion.ul
                    variants={bulletListVariants}
                    initial={shouldReduceMotion ? false : 'hidden'}
                    whileInView={shouldReduceMotion ? undefined : 'visible'}
                    viewport={{ once: true, margin: '-40px' }}
                    className="space-y-2.5 pt-2.5 sm:space-y-3 sm:pt-3"
                  >
                    {extraBullets.map((item, i) => (
                      <motion.li
                        key={i}
                        variants={bulletItemVariants}
                        className="group/bullet flex items-start gap-2.5 sm:gap-3"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary transition-transform group-hover/bullet:scale-110 motion-reduce:group-hover/bullet:scale-100">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                        <div
                          className="min-w-0 flex-1 text-sm leading-[1.6] text-muted-foreground md:text-[15px] lg:text-base [&_a]:text-primary [&_a]:underline [&_strong]:font-semibold [&_strong]:text-foreground [overflow-wrap:anywhere]"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(item) }}
                        />
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </div>
            )}

            {hasMoreBullets && (
              <button
                type="button"
                onClick={() => setBulletsExpanded((value) => !value)}
                aria-expanded={bulletsExpanded}
                aria-controls={bulletsPanelId}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary shadow-2xs transition-colors hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
              >
                <span>{bulletsExpanded ? 'Show less' : 'Show more'}</span>
                {bulletsExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
        )}

        {/* Technologies & Tools */}
        {techTags.length > 0 && (
          <div className="relative z-10 border-t border-border/50 pt-3.5">
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground/90 sm:text-[11px]">
              <Terminal className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>Technologies & Tools</span>
              <span className="ml-auto hidden font-mono text-[10px] text-muted-foreground/50 sm:inline">
                {techTags.length} technologies
              </span>
            </div>

            <ul className="mt-2 flex flex-wrap gap-x-1.5 gap-y-2">
              {visibleTechTags.map((tech) => (
                <li key={`${exp.id}-${tech}`} className="min-w-0 max-w-full">
                  <span tabIndex={0} className="inline-flex min-h-7 max-w-full items-center rounded-md border border-border/70 bg-muted/60 px-2.5 py-1 font-mono text-xs font-medium leading-snug text-foreground shadow-2xs select-none transition-colors hover:border-primary/40 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [overflow-wrap:anywhere]">
                    {tech}
                  </span>
                </li>
              ))}
              {hasMoreTech && (
                <li>
                  <button
                    type="button"
                    onClick={() => setTechExpanded((value) => !value)}
                    aria-expanded={techExpanded}
                    aria-controls={techPanelId}
                    className="inline-flex min-h-11 items-center rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-xs font-semibold text-primary shadow-2xs transition-colors hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {techExpanded ? 'Show less' : `+${extraTechTags.length} more`}
                  </button>
                </li>
              )}
            </ul>

            {hasMoreTech && (
              <div
                id={techPanelId}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  techExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <ul className="flex flex-wrap gap-x-1.5 gap-y-2 pt-2">
                    {extraTechTags.map((tech) => (
                      <li key={`${exp.id}-more-${tech}`} className="min-w-0 max-w-full">
                        <span tabIndex={0} className="inline-flex min-h-7 max-w-full items-center rounded-md border border-border/70 bg-muted/60 px-2.5 py-1 font-mono text-xs font-medium leading-snug text-foreground shadow-2xs select-none transition-colors hover:border-primary/40 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [overflow-wrap:anywhere]">
                          {tech}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.li>
  );
}

export function Experience() {
  const { data: apiExperiences = [], isLoading, isError, error, refetch } = useExperience();
  const { data: settings } = useSettings();
  const shouldReduceMotion = useReducedMotion();

  // Keep the existing API shape and only normalise optional tag support.
  const experiences: ExperienceView[] = useMemo(
    () =>
      apiExperiences.map((exp) => {
        const enriched = exp as ExperienceView;
        return {
          ...exp,
          techTags: Array.isArray(enriched.techTags) ? enriched.techTags : [],
        };
      }),
    [apiExperiences],
  );

  return (
    <section id="experience" data-ambient="experience" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">

      {/* Main Container - Matches About Section Width */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12 md:gap-16">
        <SectionHeading
          icon={Briefcase}
          pillText="Career Journey"
          title="Work"
          highlight="Experience."
          subtitle="A timeline of my professional journey, building scalable software and delivering seamless digital experiences."
        />

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          data={experiences}
          onRetry={() => refetch()}
          emptyTitle="Career In Progress"
          emptyMessage={settings?.experienceFallbackText || "Willing to kick start my career with an internship or full-stack opportunity."}
          loadingComponent={
            <div className="relative mt-4 w-full max-w-[980px] space-y-8 pl-5 sm:pl-16 lg:pl-24 md:mt-8">
              {[1, 2].map((n) => (
                <div key={n} className="h-48 rounded-2xl border border-border/30 bg-card/30 animate-pulse sm:rounded-3xl" />
              ))}
            </div>
          }
        >
          <div className="relative mt-2 w-full max-w-[980px] md:mt-6">
            {/* Continuous vertical timeline line */}
            <motion.div
              initial={shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
              whileInView={shouldReduceMotion ? undefined : { scaleY: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={shouldReduceMotion ? undefined : { duration: 1.1, ease: 'easeOut' }}
              aria-hidden="true"
              className="absolute bottom-0 left-[5px] top-2 w-px origin-top bg-border/60 sm:left-[19px] lg:left-[25px]"
            />

            <ol className="relative flex flex-col gap-8 md:gap-12">
              {experiences.map((exp, index) => (
                <ExperienceCard key={exp.id} exp={exp} index={index} />
              ))}
            </ol>
          </div>
        </QueryState>
      </div>
    </section>
  )
}
