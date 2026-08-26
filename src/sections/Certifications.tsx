import { motion } from 'framer-motion'
import { Award, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/ui/SectionHeading'

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

const CategoryCard = ({ 
    title, 
    description, 
    icon: Icon, 
    to, 
    delay 
}: { 
    title: string
    description: string
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
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />

                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                            <Icon className="w-7 h-7" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                                    {title}
                                </h3>
                            </div>
                            <p className="text-[14px] font-medium leading-relaxed text-muted-foreground/80 line-clamp-2">
                                {description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">
                                View All
                            </span>
                            <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export function Certifications() {
    return (
        <section id="certifications" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden scroll-margin-top border-t border-border/30">
            <GridBackground />
            <div className="relative z-10 max-w-6xl mx-auto">
                <SectionHeading
                    icon={Award}
                    pillText="Certifications"
                    highlight="Credentials."
                    subtitle="A comprehensive collection of academic achievements and professional certifications validating expertise across multiple domains."
                    title="Professional "
                />

                {/* Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-12">
                    <CategoryCard
                        title="Primary Certifications"
                        description="Formal academic degrees, institutional diplomas, and university-recognized achievements representing foundational education excellence."
                        icon={GraduationCap}
                        to="/certifications/primary"
                        delay={0}
                    />
                    <CategoryCard
                        title="E-Certifications"
                        description="Professional online certifications, cloud credentials, and industry-recognized training programs from leading technology platforms."
                        icon={ShieldCheck}
                        to="/certifications/e-certifications"
                        delay={0.2}
                    />
                </div>
            </div>
        </section>
    )
}
