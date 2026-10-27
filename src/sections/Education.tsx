import { motion } from 'framer-motion'
import { Landmark, Calendar, ArrowRight, BookOpen, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useEducation } from '@/hooks/api/useEducation'
import { formatDateRange } from '@/lib/date'
import { QueryState } from '@/components/common/QueryState'
import { getEducationIcon } from '@/lib/education-icons'
import type { ApiEducation } from '@/types/api'

const GridBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.04 }}
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

const typeStyles: Record<string, string> = {
  degree: "bg-primary/10 text-primary border-primary/20",
  diploma: "bg-primary/10 text-primary border-primary/20",
  certificate: "bg-primary/10 text-primary border-primary/20",
  academic: "bg-primary/10 text-primary border-primary/20",
  professional: "bg-primary/10 text-primary border-primary/20",
  training: "bg-primary/10 text-primary border-primary/20",
  school: "bg-primary/10 text-primary border-primary/20",
}

export function Education() {
  const { data: educationList = [], isLoading, isError, error, refetch } = useEducation();
  // Show top 3 most recent entries from API (prioritizing showOnHome if configured)
  const homeItems = educationList.filter((item) => item.showOnHome);
  const recentEducation = (homeItems.length > 0 ? homeItems : educationList).slice(0, 3);

  return (
    <section id="education" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden scroll-margin-top border-t border-border/30">
      <GridBackground />
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          icon={BookOpen}
          pillText="Academic Background"
          title="My "
          highlight="Education."
          subtitle="A solid multidisciplinary foundation in software engineering and professional computing."
        >
          <Button asChild variant="link" className="text-primary font-bold text-lg p-0 group h-auto cursor-pointer">
            <Link to="/education">
              View Full History
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </Button>
        </SectionHeading>

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          data={recentEducation}
          onRetry={() => refetch()}
          loadingComponent={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-72 rounded-3xl bg-card/40 border border-border/40 animate-pulse" />
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentEducation.map((item: ApiEducation, index: number) => {
              const Icon = getEducationIcon(item.icon, item.type);
              const period = formatDateRange(item.startDate, item.endDate);
              const typeKey = (item.type || 'degree').toLowerCase();
              const cleanDescription = item.description ? item.description.replace(/<[^>]*>/g, '').trim() : '';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  className="group relative flex flex-col bg-card border border-border rounded-3xl p-8 transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      typeStyles[typeKey] || typeStyles.degree
                    )}>
                      {item.type.toLowerCase()}
                    </span>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Landmark className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-sm">{item.institution}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary/70">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{period}</span>
                    </div>

                    {item.grade && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary w-fit">
                        <Award className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{item.grade}</span>
                      </div>
                    )}

                    {cleanDescription && (
                      <p className="text-[14px] leading-relaxed text-muted-foreground pt-2 line-clamp-3">
                        {cleanDescription}
                      </p>
                    )}
                  </div>

                  {/* Decorative ambient element */}
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </QueryState>
      </div>
    </section>
  )
}
