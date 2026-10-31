import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { AlertCircle, Download, ArrowRight, Code2, RefreshCw } from 'lucide-react'
import { useAbout } from '@/hooks/api/useAbout'
import { scrollToAnchor } from '@/lib/scroll'
import { Skeleton } from '@/components/ui/skeleton'
import { SITE_ROLE } from '@/lib/brand'
import { getResumeDownloadUrl } from '@/lib/resume-download'

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const LOCAL_HERO_VIDEO = '/images/hero-section/hero-section-video.mp4'

function TypewriterRole({ roles }: { roles: string[] }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayedRole, setDisplayedRole] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const currentRole = roles[roleIndex] || roles[0] || ''

  useEffect(() => {
    let delay = isDeleting ? 40 : 75
    if (!isDeleting && displayedRole === currentRole) {
      delay = 1400
    } else if (isDeleting && displayedRole.length === 0) {
      setRoleIndex((index) => (index + 1) % roles.length)
      setIsDeleting(false)
      return
    }

    const timer = window.setTimeout(() => {
      if (isDeleting) {
        setDisplayedRole((role) => role.slice(0, -1))
      } else if (displayedRole === currentRole) {
        setIsDeleting(true)
      } else {
        setDisplayedRole(currentRole.slice(0, displayedRole.length + 1))
      }
    }, delay)

    return () => window.clearTimeout(timer)
  }, [currentRole, displayedRole, isDeleting, roles.length])

  return (
    <>
      <span className="sr-only">{roles.join(', ')}.</span>
      <span aria-hidden="true">
        {displayedRole}
        <span className="ml-1 inline-block h-[1em] w-px translate-y-[0.12em] bg-white/80 animate-pulse motion-reduce:animate-none" />
      </span>
    </>
  )
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const aboutQuery = useAbout()
  const { data: about, isLoading, isError, refetch } = aboutQuery
  const [videoSrc, setVideoSrc] = useState(LOCAL_HERO_VIDEO)
  const [isVideoLoading, setIsVideoLoading] = useState(true)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax layers
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const videoOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.5, 0])

  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-16%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0])

  const handleProjectsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return
    }
    e.preventDefault()
    window.history.pushState(null, '', '#projects')
    scrollToAnchor('projects')
  }

  const fullName = about?.fullName || 'Elango Sugikaran'
  const nameParts = fullName.trim().split(' ')
  const firstName = nameParts[0] || 'Portfolio'
  const lastName = nameParts.slice(1).join(' ') || ''

  const roleOptions = useMemo(() => {
    const uniqueRoles = new Map<string, string>()
    const configuredTitles = about?.titles?.map((role) => role.trim()).filter(Boolean) || []
    const primaryTitle = about?.title?.trim() || SITE_ROLE
    const titles = configuredTitles.length > 0 ? configuredTitles : [primaryTitle]
    titles.forEach((role) => {
      uniqueRoles.set(role.toLowerCase().replace(/[\s-]/g, ''), role)
    })
    return Array.from(uniqueRoles.values())
  }, [about?.title, about?.titles])
  const rolesKey = roleOptions.join('|')

  // Resume documents are managed with the About profile.
  const primaryResume = about?.resumes?.find(r => r.isPrimary) || about?.resumes?.[0]
  const cvDownloadUrl = primaryResume?.downloadUrl || (
    primaryResume?.fileUrl
      ? getResumeDownloadUrl(primaryResume.fileUrl, primaryResume.fileName)
      : undefined
  )

  // Social links are managed with the About profile.
  const aboutGithub = about?.socialLinks?.find(
    l => l.platform.toLowerCase().includes('github') && l.url
  )
  const aboutLinkedin = about?.socialLinks?.find(
    l => l.platform.toLowerCase().includes('linkedin') && l.url
  )

  const githubLink = aboutGithub
  const linkedinLink = aboutLinkedin

  // Intro video source: Cloudinary video from about API or local fallback
  const heroVideoUrl = about?.introMedia?.type === 'video'
    ? about.introMedia.url
    : LOCAL_HERO_VIDEO

  useEffect(() => {
    setVideoSrc(heroVideoUrl)
    setIsVideoLoading(true)
  }, [heroVideoUrl])

  const handleVideoError = () => {
    if (videoSrc !== LOCAL_HERO_VIDEO) {
      setVideoSrc(LOCAL_HERO_VIDEO)
      setIsVideoLoading(true)
      return
    }

    setIsVideoLoading(false)
  }

  const isHeroVideoLoading = isLoading || isVideoLoading

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-dvh flex items-center overflow-hidden bg-black text-white"
    >
      {/* ── Parallax Background Video Sequence (Cloudinary / Local) ── */}
      <motion.div
        style={{ y: videoY, scale: videoScale, opacity: videoOpacity }}
        className="absolute inset-0 pointer-events-none z-0"
      >
        <video
          key={videoSrc}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          onLoadStart={() => setIsVideoLoading(true)}
          onCanPlay={() => setIsVideoLoading(false)}
          onError={handleVideoError}
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%23000000' width='1920' height='1080'/%3E%3C/svg%3E"
          preload="auto"
          className={`w-full h-full object-cover transition-opacity duration-700 ${isHeroVideoLoading ? 'opacity-0' : 'opacity-100'}`}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {isHeroVideoLoading && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0"
          >
            <span className="sr-only">Loading hero video.</span>
            <Skeleton className="absolute inset-0 rounded-none bg-linear-to-br from-slate-900 via-slate-950 to-blue-950/70" />
            <div className="absolute inset-0 bg-black/35" />
          </div>
        )}
        {/* Dark overlay for contrast - gradient from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </motion.div>

      {/* ── Main Content Container with Parallax Float ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-24"
      >
        {/* Foreground Information */}
        <motion.div 
          className="relative z-10 max-w-3xl flex flex-col gap-6 mt-auto md:my-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.4,
              }
            }
          }}
        >
          
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
          >
            <div aria-busy={isLoading}>
              {isLoading ? (
                <div role="status" className="space-y-5">
                  <span className="sr-only">Loading profile information.</span>
                  <Skeleton className="h-12 w-3/4 max-w-xl rounded-lg bg-white/15 sm:h-16" />
                  <Skeleton className="h-4 w-56 max-w-full bg-white/10" />
                </div>
              ) : (
                <>
                  <h1 className="text-[clamp(2rem,8vw,4rem)] font-black text-white tracking-tighter uppercase leading-[0.9]">
                    {firstName}{lastName && <><br />{lastName}</>}
                  </h1>
                  <h2 className="mt-6 text-[clamp(0.875rem,2vw,1.125rem)] font-light text-white/70 tracking-[0.4em] uppercase">
                    <TypewriterRole key={rolesKey} roles={roleOptions} />
                  </h2>
                </>
              )}
              {isError && (
                <div role="alert" className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/75">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-300" />
                  <span>Profile details could not be loaded. Showing available defaults.</span>
                  <button
                    type="button"
                    onClick={() => void refetch()}
                    className="inline-flex items-center gap-1 font-semibold text-white hover:text-white/80"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="flex flex-wrap items-center gap-3.5 mt-8"
          >
            {/* View Projects Button with Gradient Accent */}
            <a
              href="#projects"
              onClick={handleProjectsClick}
              className="h-12 px-7 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 text-white hover:opacity-95 shadow-lg shadow-indigo-500/30 border border-white/20 flex items-center gap-2 group cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-white/90 group-hover:rotate-12 transition-transform duration-300" />
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform duration-300" />
            </a>

            {/* Resume Button */}
            {isLoading ? (
              <Skeleton
                role="status"
                aria-label="Loading resume availability"
                className="h-12 w-32 rounded-full bg-white/15"
              />
            ) : cvDownloadUrl ? (
              <a
                href={cvDownloadUrl}
                download
                className="h-12 px-6 rounded-full font-semibold text-sm bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-sm cursor-pointer group"
              >
                <Download className="w-4 h-4 text-white/90 group-hover:-translate-y-0.5 transition-transform duration-300" />
                <span>Resume</span>
              </a>
            ) : (
              <span
                aria-disabled="true"
                title="Upload a resume in the admin About settings to enable downloads."
                className="h-12 px-6 rounded-full font-semibold text-sm bg-white/5 border border-white/10 text-white/45 flex items-center gap-2 cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>Resume unavailable</span>
              </span>
            )}

            {/* Subtle separator */}
            {(linkedinLink || githubLink) && (
              <div className="h-6 w-px bg-white/20 mx-0.5 hidden sm:block" />
            )}

            {/* Matching LinkedIn Circle Button (No arrow, circle button with signature gradient) */}
            {linkedinLink && (
              <a
                href={linkedinLink.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-12 h-12 rounded-full p-0 flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-110 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-600 text-white hover:opacity-95 shadow-lg shadow-blue-500/30 border border-white/20 group cursor-pointer"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="w-5 h-5 text-white/95 group-hover:scale-115 transition-transform duration-300" />
              </a>
            )}

            {/* Matching GitHub Circle Button (No arrow, circle button with signature gradient) */}
            {githubLink && (
              <a
                href={githubLink.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-12 h-12 rounded-full p-0 flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-110 bg-linear-to-r from-slate-900 via-indigo-900 to-violet-800 text-white hover:opacity-95 shadow-lg shadow-purple-900/40 border border-white/20 group cursor-pointer"
                title="GitHub Profile"
              >
                <GithubIcon className="w-5 h-5 text-white/95 group-hover:scale-115 transition-transform duration-300" />
              </a>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Scroll to Explore Indicator (Crisp in both light and dark mode) ── */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none select-none"
      >
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 shadow-xl">
          <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/90">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-3.5 h-6 rounded-full border border-white/40 flex items-start justify-center p-0.5"
          >
            <motion.div className="w-1 h-1.5 rounded-full bg-blue-400" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
