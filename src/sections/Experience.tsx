import { motion } from 'framer-motion'
import { Briefcase, Calendar, ChevronRight, ExternalLink } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useExperience } from '@/hooks/api/useExperience'
import { useSettings } from '@/hooks/api/useSettings'
import { formatDateRange } from '@/lib/date'
import { QueryState } from '@/components/common/QueryState'

export function Experience() {
  const { data: experiences = [], isLoading, isError, error, refetch } = useExperience();
  const { data: settings } = useSettings();

  const parseBullets = (desc?: string | null): string[] => {
    if (!desc) return [];
    if (/<li[^>]*>/i.test(desc)) {
      const matches = desc.match(/<li[^>]*>(.*?)<\/li>/gi);
      if (matches && matches.length > 0) {
        return matches
          .map(m => m.replace(/<\/?li[^>]*>/gi, '').replace(/<[^>]*>/g, '').trim())
          .filter(Boolean);
      }
    }
    const lines = desc
      .split('\n')
      .map(l => l.replace(/<[^>]*>/g, '').trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);
    if (lines.length > 0) return lines;
    const clean = desc.replace(/<[^>]*>/g, '').trim();
    return clean ? [clean] : [];
  };

  return (
    <section id="experience" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-background overflow-hidden">
      {/* Subtle Background Gradients */}
      <div className="absolute top-0 left-1/4 w-100 h-100 bg-primary/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Main Container - Matches About Section Width */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12 md:gap-16">

        <SectionHeading
          icon={Briefcase}
          pillText="Career Journey"
          title="My"
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
            <div className="relative w-full md:ml-22 max-w-4xl mt-4 md:mt-8 space-y-8">
              {[1, 2].map((n) => (
                <div key={n} className="h-48 rounded-3xl bg-card/30 border border-border/30 animate-pulse" />
              ))}
            </div>
          }
        >
          <div className="relative w-full md:ml-22 max-w-4xl mt-4 md:mt-8">
            {/* Continuous Vertical Line */}
            <div className="absolute left-6 md:left-7 top-4 bottom-0 w-0.5 bg-border/50" />

            <div className="flex flex-col gap-10 md:gap-16">
              {experiences.map((exp, index) => {
                const bulletPoints = parseBullets(exp.description);

                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                    className="relative pl-16 md:pl-24 group"
                  >
                    {/* Company Logo / Icon Bubble on Timeline */}
                    <div className="absolute left-1 md:left-1 top-0 w-11 h-11 md:w-13 md:h-13 rounded-full bg-background border-4 border-background ring-2 ring-border z-10 flex items-center justify-center overflow-hidden group-hover:ring-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
                      <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    {/* Experience Card */}
                    <div className="flex flex-col gap-4 md:gap-6 p-6 md:p-8 rounded-3xl bg-card/30 border border-border/50 hover:bg-card/60 transition-colors duration-500 relative overflow-hidden">

                      {/* Subtle hover glow inside card */}
                      <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Header Row (Role, Company, Date) */}
                      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-1.5 md:mb-2">
                            {exp.role}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base md:text-lg font-medium text-foreground/80">
                            {exp.companyUrl ? (
                              <a 
                                href={exp.companyUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-1.5 hover:text-primary transition-colors group/link"
                              >
                                {exp.company}
                                <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100" />
                              </a>
                            ) : (
                              <span className="font-semibold">{exp.company}</span>
                            )}
                            {exp.location && (
                              <>
                                <span className="text-muted-foreground/40 hidden sm:block">•</span>
                                <span className="text-muted-foreground">{exp.location}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base font-semibold text-muted-foreground bg-muted/50 border border-border/50 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full w-fit shrink-0 mt-2 sm:mt-0 font-mono">
                          <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          {formatDateRange(exp.startDate, exp.endDate)}
                        </div>
                      </div>

                      {/* Bullet Points */}
                      {bulletPoints.length > 0 && (
                        <div className="relative z-10 space-y-3 mt-1 md:mt-2">
                          {bulletPoints.map((item, i) => (
                            <p key={i} className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed flex items-start gap-3">
                              <span className="text-primary mt-1.25 shrink-0">
                                <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              </span>
                              <span>{item}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </QueryState>
      </div>
    </section>
  )
}
