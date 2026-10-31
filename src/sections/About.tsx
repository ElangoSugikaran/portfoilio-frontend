import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { 
  User, 
  MapPin, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Cpu, 
  Rocket, 
  Terminal, 
  Download,
  Mail,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { SectionBackground } from '@/components/ui/SectionBackground'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAbout } from '@/hooks/api/useAbout'
import { scrollToAnchor } from '@/lib/scroll'
import { SITE_ROLE } from '@/lib/brand'
import { getResumeDownloadUrl } from '@/lib/resume-download'
import { trackEvent } from '@/lib/analytics'

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.13c-.93 0-1.68.75-1.68 1.68 0 .93.75 1.69 1.68 1.69.93 0 1.69-.76 1.69-1.69 0-.93-.76-1.68-1.69-1.68z" />
  </svg>
)

const SLIDES = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'story', label: 'Engineering Story', icon: Terminal },
]

export function About() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [imageUnavailable, setImageUnavailable] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const aboutQuery = useAbout()
  const about = aboutQuery.data

  // Live tablet OS clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      setCurrentTime(`${timeStr} • ${dateStr}`)
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  // Dynamic API fields with resilient, high-quality fallbacks
  const fullName = about?.fullName?.trim() || 'Elango Sugikaran'
  const roleTitle = about?.title?.trim() || SITE_ROLE
  const displayLocation = about?.location?.trim() || 'Colombo, Sri Lanka'
  const isAvailable = about?.availableForWork ?? true

  const resumes = about?.resumes ?? []
  const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0]
  const cvDownloadUrl = primaryResume?.downloadUrl || (
    primaryResume?.fileUrl
      ? getResumeDownloadUrl(primaryResume.fileUrl, primaryResume.fileName)
      : undefined
  )

  const aboutImageUrl = about?.avatar?.url
  useEffect(() => {
    setImageUnavailable(false)
  }, [aboutImageUrl])

  useEffect(() => {
    document.getElementById(`about-panel-${SLIDES[activeSlide].id}`)?.scrollTo({ top: 0 })
  }, [activeSlide])

  const bioSummary = 
    "Software Engineering graduate with a BEng (Hons) from London Metropolitan University and certified Full Stack (MERN) professional. Experienced across agile teams on commercial platforms like Rentzee and Digital Tourism, I architect scalable web applications—from multi-tenant relational schemas to fluid, accessible user interfaces."

  const bioText = about?.bio?.trim() || bioSummary
  const headline = about?.tagline?.trim() || "Architecting scalable systems & crafting fluid experiences."

  // Social links are managed with the About profile.
  const aboutGithub = about?.socialLinks?.find(
    l => l.platform.toLowerCase().includes('github') && l.url
  )
  const aboutLinkedin = about?.socialLinks?.find(
    l => l.platform.toLowerCase().includes('linkedin') && l.url
  )
  const githubUrl = aboutGithub?.url || 'https://github.com/ElangoSugikaran'

  const linkedinUrl = aboutLinkedin?.url || 'https://linkedin.com/in/elango-sugikaran'

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length)
  }

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToAnchor('contact', { offset: -20 })
  }

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const key = event.key
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return

    event.preventDefault()

    let nextIndex = activeSlide
    if (key === 'ArrowLeft') nextIndex = (activeSlide - 1 + SLIDES.length) % SLIDES.length
    if (key === 'ArrowRight') nextIndex = (activeSlide + 1) % SLIDES.length
    if (key === 'Home') nextIndex = 0
    if (key === 'End') nextIndex = SLIDES.length - 1

    setActiveSlide(nextIndex)
    requestAnimationFrame(() => {
      document.getElementById(`about-tab-${SLIDES[nextIndex].id}`)?.focus()
    })
  }

  const slideTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: 'easeOut' as const }

  return (
    <section id="about" data-ambient="about" className="relative py-6 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
      <SectionBackground variant="grid" />

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
        <div className="sticky top-0 z-20 flex h-12 min-h-12 shrink-0 select-none items-center justify-between gap-1.5 border-b border-border/50 bg-muted/40 px-3 py-0.5 backdrop-blur-md sm:grid sm:h-auto sm:min-h-0 sm:grid-cols-[1fr_auto_1fr] sm:gap-2 sm:px-6 sm:py-2.5">
          {/* Left: sugikaran.dev with green status */}
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
            <span className="truncate text-[10px] font-mono font-semibold tracking-wide text-foreground min-[360px]:text-[11px] sm:text-[12px]">
              sugikaran.dev
            </span>
          </div>

          {/* Center: 2 Slide Tab Buttons (Profile & Engineering Story) */}
          <div
            role="tablist"
            aria-label="About me"
            onKeyDown={handleTabKeyDown}
            className="ml-auto flex h-8 shrink-0 items-center gap-0.5 rounded-full border border-border/60 bg-background/80 p-0.5 shadow-xs sm:ml-0 sm:h-auto sm:justify-self-center sm:gap-1 sm:p-1"
          >
          {SLIDES.map((slide, idx) => {
            const Icon = slide.icon
            const isActive = activeSlide === idx
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  id={`about-tab-${slide.id}`}
                  role="tab"
                  aria-label={slide.label}
                  aria-selected={isActive}
                  aria-controls={`about-panel-${slide.id}`}
                  tabIndex={isActive ? 0 : -1}
                  className={`relative flex h-7 min-h-7 min-w-0 shrink-0 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-semibold transition-colors duration-200 before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-auto sm:min-h-0 sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs ${
                    isActive
                      ? 'border border-border/70 bg-secondary text-secondary-foreground shadow-xs lg:border-transparent lg:bg-primary lg:text-primary-foreground lg:shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className={isActive ? 'inline' : 'hidden sm:inline'}>{idx === 0 ? 'Profile' : 'Story'}</span>
                </button>
              )
            })}
          </div>

          {/* Right: Device OS Live Clock */}
          <div className="hidden shrink-0 items-center justify-self-end gap-1.5 text-[11px] font-mono text-muted-foreground sm:flex">
            <Clock className="w-3 h-3 text-muted-foreground/80 shrink-0" />
            <span>{currentTime || 'Colombo • Local Time'}</span>
          </div>
        </div>

        {/* ── Tablet Inner Screen Content (Slidable) ── */}
        <div className="relative flex min-h-0 flex-1 flex-col sm:min-h-0" aria-busy={aboutQuery.isLoading}>
          {aboutQuery.isLoading && (
            <div role="status" className="mb-3 flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-3 py-2">
              <span className="sr-only">Loading profile details. Showing available information in the meantime.</span>
              <Skeleton className="h-3 w-3 rounded-full bg-muted-foreground/20" />
              <Skeleton className="h-3 w-32 bg-muted-foreground/15" />
              <Skeleton className="h-3 w-20 bg-muted-foreground/10" />
            </div>
          )}
          {aboutQuery.isError && (
            <div
              role="alert"
              className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-muted-foreground"
            >
              <span className="flex min-w-0 items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                <span>Showing available profile details; some live data could not be loaded.</span>
              </span>
              <button
                type="button"
                onClick={() => void aboutQuery.refetch()}
                className="inline-flex shrink-0 items-center gap-1 font-semibold text-foreground hover:text-primary"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          )}
          <div className="min-h-0 flex-1 overflow-hidden p-3 pb-4 sm:min-h-max sm:flex-none sm:overflow-visible sm:p-5 sm:pb-6 md:p-6 lg:p-5">
            <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)] sm:h-auto sm:min-h-max sm:grid-rows-[auto]">
            {/* ── TAB 1 · Profile (The Hook) ── */}
              <motion.div
                key="slide-profile"
                role="tabpanel"
                id="about-panel-profile"
                aria-labelledby="about-tab-profile"
                aria-hidden={activeSlide !== 0}
                inert={activeSlide !== 0}
                initial={false}
                animate={{ opacity: activeSlide === 0 ? 1 : 0 }}
                transition={slideTransition}
                style={{ gridArea: '1 / 1', visibility: activeSlide === 0 ? 'visible' : 'hidden' }}
                className={`min-h-full min-w-0 flex flex-col gap-2 sm:min-h-0 sm:justify-center sm:gap-3 lg:min-h-full overflow-x-hidden overflow-y-auto overscroll-contain scrollbar-none sm:overflow-visible ${activeSlide === 0 ? 'lg:flex' : 'lg:hidden'}`}
              >
                    <div className="grid flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)] gap-3 md:grid-cols-12 md:grid-rows-1 md:items-stretch md:gap-7 lg:items-center lg:gap-6 sm:flex-none">
                  {/* Left Column: Image Card with Badges & Social Links */}
                  <div className="flex flex-col items-center justify-center gap-1.5 self-start md:col-span-5 md:min-h-0 md:self-stretch md:items-stretch md:gap-2.5 lg:items-center">
                    <div className="relative aspect-[4/5] w-full max-w-[210px] max-[419px]:max-w-[165px] md:aspect-auto md:max-w-none md:min-h-[260px] md:flex-1 md:self-stretch md:max-h-[430px] lg:aspect-[4/5] lg:max-h-none lg:max-w-[280px] lg:self-center rounded-2xl overflow-hidden border-2 border-border/70 shadow-xl bg-muted/40 group">
                      {!aboutImageUrl || imageUnavailable ? (
                        <div
                          role="img"
                          aria-label={`${fullName} profile image unavailable`}
                          className="flex h-full w-full items-center justify-center bg-muted text-4xl font-bold text-muted-foreground"
                        >
                          {fullName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('')}
                        </div>
                      ) : (
                        <img
                          src={aboutImageUrl}
                          alt={fullName}
                          onError={() => setImageUnavailable(true)}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                      
                      {/* Floating Badges */}
                      <div className="absolute bottom-2 inset-x-2 flex flex-col gap-1">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2 px-3 py-1.5 max-[419px]:gap-1.5 max-[419px]:px-2 max-[419px]:py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-[11px] max-[419px]:text-[9px] sm:text-xs font-semibold shadow-md">
                          <span className="relative flex h-2 w-2 max-[419px]:h-1.5 max-[419px]:w-1.5 shrink-0">
                            {isAvailable && (
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                            )}
                            <span className={`relative inline-flex rounded-full h-2 w-2 max-[419px]:h-1.5 max-[419px]:w-1.5 ${isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          </span>
                          <span>{isAvailable ? 'Open for Work' : 'Currently Engaged'}</span>
                        </div>

                        {/* Location Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 max-[419px]:gap-1 max-[419px]:px-2 max-[419px]:py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white/90 text-[11px] max-[419px]:text-[9px] sm:text-xs font-medium shadow-md">
                          <MapPin className="w-3 h-3 max-[419px]:h-2.5 max-[419px]:w-2.5 text-blue-400 shrink-0" />
                          <span className="text-left leading-tight">{displayLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Clean Social Connect Buttons */}
                    <div className="flex w-fit max-w-none self-center items-center justify-center gap-1.5 pt-0.5 max-[419px]:gap-4">
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-medium bg-muted/70 hover:bg-muted text-foreground/85 hover:text-foreground border border-border/70 hover:border-primary/50 transition-all flex items-center gap-1 shadow-2xs hover:scale-105"
                        title="GitHub Profile"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-medium bg-muted/70 hover:bg-muted text-foreground/85 hover:text-foreground border border-border/70 hover:border-blue-500/50 transition-all flex items-center gap-1 shadow-2xs hover:scale-105"
                        title="LinkedIn Profile"
                      >
                        <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Bio Hook, Focus Pillars & Primary CTAs */}
                  <div className="flex h-full flex-col justify-start gap-2.5 self-stretch text-left md:col-span-7 md:justify-center md:gap-3 lg:col-span-7 lg:w-full lg:max-w-[560px] lg:justify-self-center lg:gap-3">
                    <div className="space-y-1.5 md:space-y-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="px-2.5 py-0.5 max-[419px]:border-0 max-[419px]:bg-transparent max-[419px]:px-0 max-[419px]:py-0 max-[419px]:text-primary max-[419px]:text-[9px] rounded-full text-[10px] sm:px-3 sm:text-[11px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 font-mono">
                          {roleTitle}
                        </span>
                        <span className="px-2.5 py-0.5 max-[419px]:border-0 max-[419px]:bg-transparent max-[419px]:px-0 max-[419px]:py-0 max-[419px]:text-[9px] rounded-full text-[10px] sm:px-3 sm:text-[11px] font-mono font-medium bg-muted text-muted-foreground border border-border/60 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 max-[419px]:hidden text-primary shrink-0" />
                          <span className="max-[419px]:hidden">BEng (Hons) Software Engineering</span>
                          <span className="hidden max-[419px]:inline">Software Engineering</span>
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg md:text-[clamp(1.25rem,2.7vw,1.65rem)] lg:text-xl font-black text-foreground tracking-tight leading-snug">
                        {headline}
                      </h3>

                      <p className="text-muted-foreground text-sm sm:text-sm md:text-[15px] lg:text-sm leading-relaxed line-clamp-5">
                        {bioText}
                      </p>
                      {bioText.length > 220 && (
                        <Dialog>
                          <DialogTrigger className="mt-1 rounded-sm text-xs font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                            Read more
                          </DialogTrigger>
                          <DialogContent className="flex max-h-[min(88dvh,56rem)] w-[92vw] max-w-none flex-col gap-5 overflow-hidden border border-border/70 bg-card p-4 shadow-2xl sm:max-w-none sm:gap-6 sm:p-6 md:w-[min(90vw,52rem)] lg:w-[min(86vw,64rem)] lg:p-8">
                            <DialogHeader className="pr-8">
                              <DialogTitle className="text-lg font-bold sm:text-xl lg:text-2xl">About {fullName}</DialogTitle>
                            </DialogHeader>
                            <div className="min-h-0 overflow-y-auto overscroll-contain rounded-xl border border-border/60 bg-muted/20 p-4 text-[15px] leading-7 text-foreground/90 sm:p-6 sm:text-base lg:p-8 lg:text-lg lg:leading-8">
                              {bioText}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>

                    {/* 3 Core Focus Pillars with Purpose Context */}
                    <div className="space-y-1.5 md:space-y-1">
                      <div className="flex min-w-0 items-center justify-between gap-1 whitespace-nowrap">
                        <div className="flex min-w-0 items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground md:text-[11px] lg:text-[10px]">
                          <Sparkles className="w-3 h-3 text-primary" />
                          <span className="truncate">Core Engineering Focus</span>
                        </div>
                        <span className="hidden text-[10px] font-mono text-muted-foreground/60 min-[900px]:inline md:text-[11px] lg:text-[10px]">
                          Full-Stack Capabilities
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-1.5 sm:gap-2">
                        <div className="h-full p-1.5 sm:p-2 lg:p-2.5 rounded-xl bg-card border border-border/60 flex flex-col gap-0.5 max-[419px]:flex-row max-[419px]:items-center max-[419px]:justify-between max-[419px]:gap-2 shadow-2xs hover:border-primary/40 transition-colors">
                          <div className="flex items-center gap-1 text-primary text-[9px] sm:text-[10px] font-mono font-bold uppercase">
                            <Cpu className="w-3.5 h-3.5" />
                            <span>Backend</span>
                          </div>
                          <div className="min-w-0 max-[419px]:text-right">
                            <span className="block text-[11px] sm:text-xs font-bold text-foreground">Scalable APIs</span>
                            <span className="block text-[9px] leading-relaxed text-muted-foreground font-mono min-[640px]:text-[10px]">Node • PostgreSQL • Prisma</span>
                          </div>
                        </div>

                        <div className="h-full p-1.5 sm:p-2 lg:p-2.5 rounded-xl bg-card border border-border/60 flex flex-col gap-0.5 max-[419px]:flex-row max-[419px]:items-center max-[419px]:justify-between max-[419px]:gap-2 shadow-2xs hover:border-blue-500/40 transition-colors">
                          <div className="flex items-center gap-1 text-blue-500 text-[9px] sm:text-[10px] font-mono font-bold uppercase">
                            <Rocket className="w-3.5 h-3.5" />
                            <span>Frontend</span>
                          </div>
                          <div className="min-w-0 max-[419px]:text-right">
                            <span className="block text-[11px] sm:text-xs font-bold text-foreground">Fluid UX</span>
                            <span className="block text-[9px] leading-relaxed text-muted-foreground font-mono min-[640px]:text-[10px]">React 19 • Next.js • TS</span>
                          </div>
                        </div>

                        <div className="h-full p-1.5 sm:p-2 lg:p-2.5 rounded-xl bg-card border border-border/60 flex flex-col gap-0.5 max-[419px]:flex-row max-[419px]:items-center max-[419px]:justify-between max-[419px]:gap-2 shadow-2xs hover:border-emerald-500/40 transition-colors">
                          <div className="flex items-center gap-1 text-emerald-500 text-[9px] sm:text-[10px] font-mono font-bold uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Delivery</span>
                          </div>
                          <div className="min-w-0 max-[419px]:text-right">
                            <span className="block text-[11px] sm:text-xs font-bold text-foreground">Production</span>
                            <span className="block text-[9px] leading-relaxed text-muted-foreground font-mono min-[640px]:text-[10px]">Stripe • Docker • CI/CD</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Step CTAs (Directly visible, cohesive spacing) */}
                    <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-1.5 sm:mt-0 sm:gap-2 sm:pt-2 max-[419px]:flex-nowrap">
                      {/* CV Download */}
                      {aboutQuery.isLoading ? (
                        <Skeleton
                          role="status"
                          aria-label="Loading resume availability"
                          className="h-8 w-28 rounded-xl"
                        />
                      ) : primaryResume ? (
                        <Button
                          asChild
                          className="h-8 min-w-0 flex-1 px-2 rounded-xl bg-primary text-primary-foreground font-semibold text-[10px] sm:h-8.5 sm:flex-none sm:px-3.5 sm:text-sm flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-md shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
                        >
                          <a
                            href={cvDownloadUrl}
                            onClick={() => trackEvent('cv_download')}
                            download
                            title="View or download official CV in PDF format"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download CV</span>
                          </a>
                        </Button>
                      ) : (
                        <span
                          aria-disabled="true"
                          title="Upload a resume in the admin About settings to enable downloads."
                          className="inline-flex h-8 items-center justify-center gap-1 rounded-xl border border-border/60 px-2 text-[10px] font-semibold text-muted-foreground/70 cursor-not-allowed sm:h-8.5 sm:px-3.5 sm:text-sm"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Resume unavailable</span>
                        </span>
                      )}

                      {/* Contact Me Button */}
                      <Button
                        asChild
                        variant="outline"
                        className="h-8 min-w-0 flex-1 px-2 rounded-xl border-border/70 hover:bg-muted/60 text-foreground font-semibold text-[10px] sm:h-8.5 sm:flex-none sm:px-3.5 sm:text-sm flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs hover:border-primary/40 transition-all"
                      >
                        <a href="#contact" onClick={handleContactClick}>
                          <Mail className="w-3.5 h-3.5 text-primary" />
                          <span>Contact Me</span>
                        </a>
                      </Button>

                      {/* Explore Engineering Story Tab */}
                    </div>
                  </div>
                </div>
              </motion.div>

            {/* ── TAB 2 · Engineering Story ── */}
              <motion.div
                key="slide-story"
                role="tabpanel"
                id="about-panel-story"
                aria-labelledby="about-tab-story"
                aria-hidden={activeSlide !== 1}
                inert={activeSlide !== 1}
                initial={false}
                animate={{ opacity: activeSlide === 1 ? 1 : 0 }}
                transition={slideTransition}
                style={{ gridArea: '1 / 1', visibility: activeSlide === 1 ? 'visible' : 'hidden' }}
                className={`min-h-0 min-w-0 flex flex-col gap-2.5 overflow-x-hidden overflow-y-auto overscroll-contain scrollbar-none text-left max-w-4xl mx-auto sm:min-h-0 sm:overflow-visible ${activeSlide === 1 ? 'lg:flex' : 'lg:hidden'}`}
              >
                {/* Story Header */}
                <div className="flex items-center pb-2.5 border-b border-border/50 shrink-0">
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-foreground">
                      Engineering Story & Philosophy
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Academic foundation to shipping commercial full-stack systems
                    </p>
                  </div>
                </div>

                {/* Narrative Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                  {/* Left Column: 3 Clean Narrative Beats (7 cols) */}
                  <div className="lg:col-span-7 space-y-3 text-xs leading-relaxed text-muted-foreground bg-muted/20 p-3.5 sm:p-4 rounded-2xl border border-border/50">
                    <div>
                      <span className="font-bold text-foreground block text-xs mb-0.5">
                        01. Academic Foundation & Technical Discipline
                      </span>
                      <p>
                        Earned a BEng (Hons) in Software Engineering from London Metropolitan University at Esoft Metro Campus with Honours, followed by intensive immersion in the modern MERN and TypeScript stacks. Focused on turning complex logic into structured, resilient systems.
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-foreground block text-xs mb-0.5">
                        02. Commercial Team Contributions
                      </span>
                      <p>
                        Worked across frontend and backend in production team settings on commercial platforms including <strong className="text-foreground">Rentzee</strong> (multi-tenant vehicle platform with Fastify, React, and Prisma) and <strong className="text-foreground">Digital Tourism</strong> under senior engineers.
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-foreground block text-xs mb-0.5">
                        03. Flagship Production Builds & Availability
                      </span>
                      <p>
                        Architected standalone platforms like <strong className="text-foreground">DentAssist-LK</strong> (AI-assisted dental booking) and <strong className="text-foreground">Mebius</strong> (e-commerce with Stripe & Cloudflare R2). Now actively seeking a full-stack engineer role to own production features.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Stack & Integrated Action Card (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col gap-2.5">
                    {/* Tech Stack */}
                    <div className="p-3 rounded-2xl bg-card border border-border/60 space-y-1.5 shadow-2xs">
                      <span className="text-[10px] font-bold text-foreground uppercase tracking-wider block font-mono">
                        Core Technical Arsenal
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {['React 19', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'Fastify', 'PostgreSQL', 'MongoDB', 'Prisma', 'Tailwind', 'Stripe', 'Docker', 'Git'].map(tech => (
                          <span 
                            key={tech}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/60 border border-border/60 text-foreground font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Principles Card */}
                    <div className="p-2.5 rounded-2xl bg-muted/30 border border-border/50 space-y-1 text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>Strict TypeScript typing & defensive validation</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>Clean schema design & relational normalization</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-violet-500 shrink-0" />
                        <span>Component modularity & design system fidelity</span>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
          </div>
          </div>
        </div>

        {/* ── Tablet Bottom Dock / Slide Controls (2 Dots) ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2 border-t border-border/50 bg-muted/40 backdrop-blur-md select-none shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="w-7 h-7 rounded-full flex items-center justify-center border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Dots Indicator for 2 Slides */}
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
            className="w-7 h-7 rounded-full flex items-center justify-center border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </ContainerScroll>
    </section>
  )
}
