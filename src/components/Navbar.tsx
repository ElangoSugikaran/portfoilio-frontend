import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, Sun, Palette } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'

// ── Logo ──────────────────────────────────────
function LogoMark({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Go to top"
      className="flex items-center gap-2.5 group shrink-0"
    >
      <div className="w-8 h-8 shrink-0 rounded-xl bg-foreground text-background flex items-center justify-center font-black text-xs transition-all duration-300 group-hover:bg-primary group-hover:scale-105">
        S
      </div>
      {/* Name — hidden on mobile, shown sm+ */}
      <div className="hidden sm:flex flex-col leading-none gap-[3px] text-left">
        <div className="flex items-baseline leading-none">
          <span className="font-black text-sm tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 whitespace-nowrap">
            Sugikaran
          </span>
          <span className="font-black text-sm tracking-tight text-primary whitespace-nowrap">
            .dev
          </span>
        </div>
        <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground whitespace-nowrap">
          Full Stack Developer
        </span>
      </div>
    </button>
  )
}

// ── NAVBAR ────────────────────────────────────
export default function Navbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const path = window.location.pathname
    setCurrentPage(path === '/' || path === '/home' ? 'home' : path.replace('/', ''))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      if (currentPage !== 'home') return
      const scrollY = window.scrollY + 120
      
      for (const link of NAV_LINKS) {
        if (link.href.startsWith('/')) continue // skip non-hash links
        const sectionId = link.href.slice(1)
        const el = document.getElementById(sectionId)
        if (el) {
          const { offsetTop, offsetHeight } = el
          if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentPage])

  const scrollTo = (href: string) => {
    setIsOpen(false)
    if (href.startsWith('/')) {
      // Handle external routes like /blog
      navigate(href)
      return
    }
    
    const sectionId = href.slice(1)
    if (currentPage !== 'home') { 
      navigate(`/${href}`)
      return 
    }
    
    const el = document.getElementById(sectionId)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
  }

  const scrollToTop = () => {
    if (currentPage !== 'home') { 
      navigate('/')
      return 
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 flex justify-center pt-4"
      >
        <div
          className={`
            w-[calc(100%-2rem)] max-w-[1200px] h-13
            flex items-center justify-between
            lg:grid lg:grid-cols-[auto_1fr_auto]
            px-4 sm:px-6 rounded-2xl border
            transition-all duration-500
            ${scrolled
              ? 'bg-background/90 backdrop-blur-2xl border-border shadow-lg shadow-black/10'
              : 'bg-background/70 backdrop-blur-md border-border/60'
            }
          `}
          style={{ height: '52px' }}
        >
          {/* ── ZONE 1 · Logo ── */}
          <LogoMark onClick={scrollToTop} />

          {/* ── ZONE 2 · Nav links (desktop only) ── */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1) && currentPage === 'home'
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`
                    relative px-3 py-1.5 rounded-md whitespace-nowrap
                    text-xs font-semibold uppercase tracking-[0.07em]
                    transition-colors duration-200
                    ${isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <span className="relative">{link.label}</span>
                </button>
              )
            })}
          </nav>

          {/* ── ZONE 3 · Actions ── */}
          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            
            {/* Static Theme Icons (No logic for now) */}
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Sun className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative">
              <Palette className="w-4 h-4" />
              <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary ring-1 ring-background" />
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {isOpen && (
        <div
          className="
            fixed inset-x-4 top-[72px] z-40
            bg-background/95 backdrop-blur-2xl
            rounded-2xl border border-border
            shadow-2xl shadow-black/12 p-4 lg:hidden
          "
        >

          {/* Nav links */}
          <nav className="flex flex-col gap-1 mt-2">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1) && currentPage === 'home'
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`
                    w-full text-left px-3 py-3 rounded-xl
                    text-sm font-semibold uppercase tracking-widest
                    transition-colors duration-150
                    ${isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>

        </div>
      )}
    </>
  )
}
