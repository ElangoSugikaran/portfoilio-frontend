import { motion, useScroll, useTransform } from 'framer-motion'
import { MapPin, Code2, Rocket, Sparkles, User } from 'lucide-react'
import { useRef } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'

const GridBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.15 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(var(--foreground) 1px, transparent 1px),
          linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at 50% 50%, black 50%, transparent 90%)'
      }}
    />
  </div>
)

export function About() {
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Subtle parallax for the image placeholder
  const imageY = useTransform(scrollYProgress, [0, 1], [15, -15])

  return (
    <section ref={containerRef} id="about" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-background overflow-hidden scroll-margin-top">
      {/* Restored Animated Grid Background */}
      <GridBackground />

      {/* Subtle Background Gradients */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-16">
        <SectionHeading
          icon={User}
          pillText="Introduction"
          title="About"
          highlight="Me."
          subtitle="An overview of my background, engineering philosophy, and what drives me as a developer."
        />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 auto-rows-[minmax(180px,auto)]">

          {/* Card 2: The Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="col-span-1 md:col-span-3 lg:col-span-2 row-span-2 bg-card rounded-3xl border border-border/50 overflow-hidden relative group min-h-100"
          >
            {/* Parallax Image */}
            <motion.div style={{ y: imageY }} className="absolute inset-x-0 -top-3.75 -bottom-3.75 w-full h-[110%]">
              <img
                src="/images/about-section/about-me.png"
                alt="About Me"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            {/* Gradient overlay removed to keep image clear */}
          </motion.div>

          {/* Card 1: The Bio (Span 3 columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="md:col-span-3 md:row-span-2 bg-card text-card-foreground border border-border rounded-[2rem] p-8 md:p-12 flex flex-col justify-between overflow-hidden relative group shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-transform duration-700 group-hover:scale-150" />
            <Sparkles className="w-8 h-8 text-primary mb-8 relative z-10" />
            <div className="space-y-6 relative z-10">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-[1.1] tracking-tight">
                Architecting <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">scalable systems</span> & crafting <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">fluid experiences</span>.
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl font-medium">
                I am a Full Stack Engineer who doesn't just write code; I build digital infrastructure. My approach merges the rigor of backend systems architecture with the precision of modern frontend engineering to transform complex challenges into seamless, intuitive platforms.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Location / Availability */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="md:col-span-2 bg-card text-card-foreground border border-border rounded-[2rem] p-8 flex flex-col justify-center gap-6 relative overflow-hidden shadow-lg group hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Base</p>
                <p className="text-foreground font-bold tracking-wide">Global Remote</p>
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="flex items-center gap-4">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </span>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Status</p>
                <p className="text-foreground font-bold tracking-wide">Available for Work</p>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Philosophy / Stack summary */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="md:col-span-3 bg-linear-to-br from-primary to-primary/80 text-primary-foreground rounded-[2rem] p-8 md:p-10 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition-all duration-500 shadow-lg shadow-primary/20 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-[url('/images/hero-section/hero-section-video.mp4')] bg-cover opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="flex justify-between items-start relative z-10">
              <Rocket className="w-10 h-10 mb-8 text-white" />
              <Code2 className="w-10 h-10 mb-8 text-white/30" />
            </div>
            <div className="relative z-10">
              <h4 className="text-2xl md:text-4xl font-black leading-none tracking-tighter uppercase">
                Clean Engineering.<br />Result Driven.
              </h4>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
