import { motion } from 'framer-motion'
import { Award, GraduationCap, ShieldCheck, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Skeleton } from '@/components/ui/skeleton'
import { useCertificates } from '@/hooks/api/useCertificates'

const CategoryCard = ({
  title,
  description,
  count,
  countLoading,
  icon: Icon,
  to,
  delay
}: {
  title: string
  description: string
  count?: number
  countLoading: boolean
  icon: React.ElementType
  to: string
  delay: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className="group relative"
    >
      <Link to={to} className="block h-full">
        <div className="relative flex flex-col bg-card border border-border rounded-3xl p-8 transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden h-full">
          {/* Decorative Icon Background */}
          <div className="absolute -top-4 -right-4 w-28 h-28 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="w-7 h-7" />
                </div>
                {countLoading ? (
                  <Skeleton role="status" aria-label="Loading credential count" className="h-6 w-24 rounded-full" />
                ) : count !== undefined && count > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    {count} {count === 1 ? 'Credential' : 'Credentials'}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-[15px] font-medium leading-relaxed text-muted-foreground line-clamp-3">
                  {description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Explore All Credentials
              </span>
              <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1.5 duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function Certifications() {
  const { data: certificates = [], isLoading, isError, refetch } = useCertificates();

  const academicCount = certificates.filter(c => c.category === 'ACADEMIC').length;
  const digitalCount = certificates.filter(c => c.category === 'DIGITAL').length;

  return (
    <section id="certifications" data-ambient="certifications" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          icon={Award}
          pillText="Certifications"
          highlight="Credentials."
          subtitle="A comprehensive collection of academic achievements and professional certifications validating expertise across multiple domains."
          title="Professional "
        />

        {isError && (
          <div
            role="alert"
            className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
              Credential counts could not be loaded. You can still browse each category.
            </span>
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex shrink-0 items-center gap-1 font-semibold text-foreground hover:text-primary"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* 2 Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-12">
          <CategoryCard
            title="Primary Certifications"
            description="Formal academic degrees, institutional diplomas, and university-recognized achievements representing foundational education excellence."
            count={academicCount}
            countLoading={isLoading}
            icon={GraduationCap}
            to="/certifications/primary"
            delay={0}
          />
          <CategoryCard
            title="E-Certifications"
            description="Professional online certifications, cloud credentials, and industry-recognized training programs from leading technology platforms."
            count={digitalCount}
            countLoading={isLoading}
            icon={ShieldCheck}
            to="/certifications/e-certifications"
            delay={0.2}
          />
        </div>
      </div>
    </section>
  )
}
