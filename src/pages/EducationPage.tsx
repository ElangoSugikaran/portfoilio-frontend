import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { GraduationCap, Calendar, Award, Landmark } from 'lucide-react'
import { useEducation } from '@/hooks/api/useEducation'
import { formatDateRange } from '@/lib/date'
import { SEO } from '@/components/common/SEO'
import { QueryState } from '@/components/common/QueryState'
import { getGlobalLenis } from '@/lib/scroll'
import { cn } from '@/lib/utils'
import { getEducationIcon } from '@/lib/education-icons'
import type { ApiEducation } from '@/types/api'

gsap.registerPlugin(ScrollTrigger);

const typeStyles: Record<string, { badge: string; dot: string; core: string }> = {
  DEGREE: {
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    dot: "border-blue-500 shadow-blue-500/30",
    core: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]",
  },
  DIPLOMA: {
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    dot: "border-purple-500 shadow-purple-500/30",
    core: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]",
  },
  CERTIFICATE: {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dot: "border-emerald-500 shadow-emerald-500/30",
    core: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
  },
  TRAINING: {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    dot: "border-amber-500 shadow-amber-500/30",
    core: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]",
  },
  SCHOOL: {
    badge: "bg-primary/10 text-primary border-primary/20",
    dot: "border-primary shadow-primary/30",
    core: "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]",
  },
}

/**
 * Cleans raw API descriptions by removing HTML tags and repetitive boilerplate sentences.
 */
function cleanApiDescription(desc?: string | null): string {
  if (!desc) return '';
  let clean = desc.replace(/<[^>]*>/g, '').trim();
  clean = clean.replace(/^I have successfully completed (a|my|the)?\s*/i, '');
  clean = clean.replace(/^(During this program,|In this course,)\s*/i, '');
  if (clean.length > 0) {
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  return clean;
}

interface EducationCardProps {
  item: ApiEducation;
  period: string;
  Icon: React.ComponentType<{ className?: string }>;
  styleConfig: { badge: string; dot: string; core: string };
  cleanedDescription: string;
}

function EducationCard({ item, period, Icon, styleConfig, cleanedDescription }: EducationCardProps) {
  return (
    <div className="timeline-card group relative flex flex-col bg-card/75 dark:bg-zinc-900/75 backdrop-blur-md border border-border/60 hover:border-primary/40 rounded-3xl p-5 sm:p-7 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full">
      {/* Ambient hover glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          {/* Prominent API-driven Icon */}
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110 shadow-xs",
            styleConfig.badge
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <span className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border font-mono",
            styleConfig.badge
          )}>
            {item.type.toLowerCase()}
          </span>
        </div>

        {/* Date Badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-full border border-border/40">
          <Calendar className="w-3 h-3 text-primary shrink-0" />
          <span>{period}</span>
        </div>
      </div>


      {/* Title & Institution */}
      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
          {item.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-muted-foreground">
          <Landmark className="w-3.5 h-3.5 shrink-0 text-muted-foreground/80" />
          <span className="line-clamp-1">{item.institution}</span>
        </div>
      </div>

      {/* Grade / Honors Callout (if available from API) */}
      {item.grade && (
        <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary w-fit text-xs font-semibold">
          <Award className="w-3.5 h-3.5 shrink-0" />
          <span>{item.grade}</span>
        </div>
      )}

      {/* Cleaned, Readable Description from API */}
      {cleanedDescription && (
        <p className="mt-3 text-xs sm:text-[13px] leading-relaxed text-muted-foreground line-clamp-3">
          {cleanedDescription}
        </p>
      )}
    </div>
  );
}

export default function EducationPage() {
  const { data: educationList = [], isLoading, isError, error, refetch } = useEducation();
  const containerRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);

  // Sync GSAP ScrollTrigger with global Lenis instance
  useEffect(() => {
    const lenis = getGlobalLenis();
    if (!lenis) return;
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on('scroll', handleScroll);
    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, []);

  // GSAP ScrollTrigger timeline line drawing and card entrance animations
  useGSAP(
    () => {
      if (!containerRef.current) return;

      // 1. Scrub the middle timeline line fill as user scrolls down and up
      if (lineFillRef.current) {
        gsap.fromTo(
          lineFillRef.current,
          { height: '0%' },
          {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
              end: 'bottom 80%',
              scrub: 0.4,
            },
          }
        );
      }

      // 2. Animate each item and dot with smooth scrub/reverse behavior
      const items = containerRef.current.querySelectorAll('.timeline-item');
      items.forEach((item, index) => {
        const card = item.querySelector('.timeline-card');
        const dot = item.querySelector('.timeline-dot');
        const isLeft = index % 2 === 0;

        if (card) {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              x: isLeft ? -40 : 40,
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }

        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: item,
                start: 'top 82%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }
      });

      ScrollTrigger.refresh();
      const timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => {
        window.clearTimeout(timer);
      };
    },
    { scope: containerRef, dependencies: [educationList.length] }
  );

  return (
    <div className="min-h-screen relative bg-background pt-24 pb-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
      <SEO
        title="Educational History | Sugikaran"
        description="Comprehensive timeline of academic qualifications, engineering degrees, and specialized computing certifications."
      />

      {/* Subtle Background Gradients */}
      <div className="fixed top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-0 left-0 w-125 h-125 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-10 md:gap-14">
        
        {/* Clean Header Section */}
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest w-fit font-mono">
            <GraduationCap className="w-3.5 h-3.5" />
            Full Journey
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase">
            Educational <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">History</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mt-1">
            A comprehensive, chronological timeline of academic qualifications, specialized engineering degrees, and professional certifications.
          </p>
        </div>

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          data={educationList}
          onRetry={() => refetch()}
          emptyTitle="No education entries"
          emptyMessage="No educational entries have been published yet."
          loadingComponent={
            <div className="relative max-w-5xl mx-auto mt-12 space-y-12">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-56 rounded-3xl bg-card/40 border border-border/40 animate-pulse" />
              ))}
            </div>
          }
        >
          <div ref={containerRef} className="relative max-w-5xl mx-auto mt-6 md:mt-10 w-full">
            
            {/* Center Timeline Track (Mobile: left aligned, Desktop: centered) */}
            <div className="absolute left-4 sm:left-6 md:left-1/2 top-6 bottom-10 w-1 -translate-x-1/2 bg-border/60 dark:bg-zinc-800 rounded-full overflow-hidden">
              {/* Scroll-driven Glowing Progress Line that fills down as user scrolls */}
              <div
                ref={lineFillRef}
                className="w-full bg-linear-to-b from-primary via-blue-500 to-indigo-500 rounded-full shadow-[0_0_14px_rgba(59,130,246,0.85)]"
                style={{ height: '0%' }}
              />
            </div>

            {/* Alternating Journey Items */}
            <div className="flex flex-col gap-10 md:gap-16">
              {educationList.map((item: ApiEducation, index: number) => {
                const Icon = getEducationIcon(item.icon, item.type);
                const period = formatDateRange(item.startDate, item.endDate);
                const isLeft = index % 2 === 0;
                const styleConfig = typeStyles[item.type] || typeStyles.DEGREE;
                const cleanedDescription = cleanApiDescription(item.description);

                return (
                  <div
                    key={item.id}
                    className="timeline-item relative flex flex-col md:flex-row items-center w-full"
                  >
                    {/* Timeline Milestone Dot (Center on Desktop, Left on Mobile) */}
                    <div className="timeline-dot absolute left-4 sm:left-6 md:left-1/2 top-7 md:top-9 -translate-x-1/2 z-20 flex items-center justify-center">
                      <div className={cn(
                        "w-5 h-5 rounded-full bg-background border-2 shadow-md flex items-center justify-center transition-all duration-300",
                        styleConfig.dot
                      )}>
                        <div className={cn("w-2 h-2 rounded-full", styleConfig.core)} />
                      </div>
                    </div>


                    {/* Alternating Layout: Card on Left (even) or Right (odd); Opposite side is clean */}
                    <div className="w-full flex flex-col md:flex-row items-center pl-10 sm:pl-14 md:pl-0">
                      
                      {/* Left Column (Card on Even, Empty on Odd) */}
                      <div className="w-full md:w-[calc(50%-2.5rem)] md:mr-auto">
                        {isLeft ? (
                          <EducationCard
                            item={item}
                            period={period}
                            Icon={Icon}
                            styleConfig={styleConfig}
                            cleanedDescription={cleanedDescription}
                          />
                        ) : (
                          <div className="hidden md:block w-full h-1" />
                        )}
                      </div>

                      {/* Right Column (Empty on Even, Card on Odd) */}
                      <div className="w-full md:w-[calc(50%-2.5rem)] md:ml-auto mt-4 md:mt-0">
                        {!isLeft ? (
                          <EducationCard
                            item={item}
                            period={period}
                            Icon={Icon}
                            styleConfig={styleConfig}
                            cleanedDescription={cleanedDescription}
                          />
                        ) : (
                          <div className="hidden md:block w-full h-1" />
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </QueryState>
      </div>
    </div>
  )
}
