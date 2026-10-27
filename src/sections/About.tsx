import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  MapPin, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Cpu, 
  Layers, 
  Code2, 
  Rocket, 
  Terminal, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { useSettings } from '@/hooks/api/useSettings'
import { useAbout } from '@/hooks/api/useAbout'

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

const SLIDES = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'bio', label: 'Biography', icon: Terminal },
  { id: 'pillars', label: 'Pillars', icon: Layers },
]

export function About() {
  const [activeSlide, setActiveSlide] = useState(0)
  const { data: about } = useAbout()
  const { data: settings } = useSettings()

  const fullName = about?.fullName || settings?.ownerName || 'Elango Sugikaran'
  const roleTitle = about?.title || settings?.roles?.[0] || 'Full Stack Developer'

  const bioText = about?.bio || settings?.aboutText || 
    "I am a Full Stack Engineer who doesn't just write code; I build digital infrastructure. My approach merges the rigor of backend systems architecture with the precision of modern frontend engineering to transform complex challenges into seamless, intuitive platforms."

  const heroIntro = about?.tagline || settings?.heroIntro || 
    "Architecting scalable systems & crafting fluid experiences."

  const aboutImageUrl = about?.avatar?.url || 
    settings?.aboutImage?.url || 
    settings?.profileImage?.url || 
    "/images/about-section/about-me.png"

  const bioParagraphs = bioText.split('\n\n').filter(p => p.trim().length > 0)

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length)
  }

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  return (
    <section id="about" className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24 bg-background overflow-hidden">
      {/* Background Grid & Glows */}
      <GridBackground />
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <ContainerScroll
        titleComponent={
          <SectionHeading
            icon={User}
            pillText="Introduction"
            title="About"
            highlight="Me."
            subtitle="An interactive overview of my background, engineering philosophy, and what drives me as a developer."
          />
        }
      >
        {/* ── Tablet OS Chrome / Top Bar ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/50 bg-muted/40 backdrop-blur-md select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-foreground/80 hidden sm:inline">
              Sugikaran.os
            </span>
          </div>

          {/* Slide Tab Buttons */}
          <div className="flex items-center gap-1 bg-background/80 p-1 rounded-full border border-border/60 shadow-xs">
            {SLIDES.map((slide, idx) => {
              const Icon = slide.icon
              const isActive = activeSlide === idx
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{slide.label}</span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-muted-foreground hidden md:inline">
              Colombo, LK
            </span>
          </div>
        </div>

        {/* ── Tablet Inner Screen Content (Slidable) ── */}
        <div className="flex-1 relative overflow-y-auto p-4 sm:p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* ── SLIDE 1 · Profile & Overview ── */}
            {activeSlide === 0 && (
              <motion.div
                key="slide-profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="h-full flex flex-col justify-between gap-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left Column: Image Card with Badges */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-4/5 rounded-2xl overflow-hidden border-2 border-border/70 shadow-xl bg-muted/40 group">
                      <img
                        src={aboutImageUrl}
                        alt={fullName}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Floating Badges */}
                      <div className="absolute bottom-3 inset-x-3 flex flex-col gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-md">
                          <span className="relative flex h-2.5 w-2.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                          </span>
                          <span>Available for Work</span>
                        </div>

                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium shadow-md">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>Colombo, Sri Lanka</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Bio Excerpt & Pillars */}
                  <div className="lg:col-span-7 flex flex-col gap-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
                        {roleTitle}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
                      {heroIntro}
                    </h3>

                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-4">
                      {bioParagraphs[0]}
                    </p>

                    {/* Quick Highlights Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-muted/50 border border-border/50 flex flex-col gap-1">
                        <Cpu className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-foreground">Scalable Systems</span>
                        <span className="text-[11px] text-muted-foreground">Robust Backends</span>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/50 border border-border/50 flex flex-col gap-1">
                        <Rocket className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-bold text-foreground">Fluid UX</span>
                        <span className="text-[11px] text-muted-foreground">60fps Animations</span>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/50 border border-border/50 flex flex-col gap-1">
                        <Code2 className="w-4 h-4 text-violet-500" />
                        <span className="text-xs font-bold text-foreground">Clean Code</span>
                        <span className="text-[11px] text-muted-foreground">Strict TypeScript</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveSlide(1)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md group cursor-pointer"
                      >
                        <span>Explore Full Biography</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SLIDE 2 · Biography & Journey ── */}
            {activeSlide === 1 && (
              <motion.div
                key="slide-bio"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="h-full flex flex-col justify-between gap-6 text-left max-w-3xl mx-auto"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-black text-foreground">
                      Engineering Journey & Philosophy
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Bridging systems engineering and fluid digital experiences
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed bg-muted/30 p-5 sm:p-6 rounded-2xl border border-border/50">
                  {bioParagraphs.map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Core Stack Pill Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-2">
                    Core Arsenal:
                  </span>
                  {['React 19', 'TypeScript', 'Node.js', 'Express', 'Cloudinary', 'Tailwind CSS', 'PostgreSQL', 'RESTful APIs'].map(tech => (
                    <span 
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-card border border-border/70 text-foreground/90 shadow-2xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveSlide(2)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md group cursor-pointer"
                  >
                    <span>View Architectural Pillars</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── SLIDE 3 · Architecture Pillars ── */}
            {activeSlide === 2 && (
              <motion.div
                key="slide-pillars"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="h-full flex flex-col justify-between gap-6 text-left max-w-4xl mx-auto"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                      Architectural Pillars
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      The core engineering values guiding every project from concept to production
                    </p>
                  </div>
                  <Layers className="w-7 h-7 text-primary/70 hidden sm:block" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-sm sm:text-base text-foreground mb-1.5">
                        Resilient Architecture
                      </h5>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Designing modular backend services, normalized schemas, and scalable APIs that gracefully handle growth.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary pt-4">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Zero Downtime Mindset</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 mb-4">
                        <Rocket className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-sm sm:text-base text-foreground mb-1.5">
                        Fluid User Experience
                      </h5>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Every transition and layout is crafted for 60fps responsiveness, keyboard accessibility, and tactile feedback.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary pt-4">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sub-100ms Interactions</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-sm sm:text-base text-foreground mb-1.5">
                        Clean, Typed Code
                      </h5>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Self-documenting codebases with strict TypeScript types, defensive validation, and modular maintainability.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary pt-4">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Production Quality</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveSlide(0)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer"
                  >
                    <span>Back to Overview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Tablet Bottom Dock / Slide Controls ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-border/50 bg-muted/40 backdrop-blur-md select-none">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="w-8 h-8 rounded-full flex items-center justify-center border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeSlide === idx
                    ? 'w-6 h-2 bg-primary'
                    : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="w-8 h-8 rounded-full flex items-center justify-center border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </ContainerScroll>
    </section>
  )
}
