import { useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}
import { NAV_LINKS } from '@/lib/constants'

export default function Footer() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLinkClick = (href: string) => {
    if (href.startsWith('/')) {
      navigate(href)
      return
    }
    
    const sectionId = href.slice(1)
    const el = document.getElementById(sectionId)
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
    }
  }

  return (
    <footer className="w-full relative mt-20">
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
      
      <div className="bg-muted/40 backdrop-blur-xl border-t border-border/50 rounded-t-3xl sm:rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            
            {/* Brand Section */}
            <div className="space-y-6 xl:col-span-1">
              <button
                onClick={scrollToTop}
                aria-label="Go to top"
                className="flex items-center gap-2.5 group shrink-0"
              >
                <div className="w-8 h-8 shrink-0 rounded-xl bg-foreground text-background flex items-center justify-center font-black text-xs transition-all duration-300 group-hover:bg-primary group-hover:scale-105">
                  S
                </div>
                <div className="flex flex-col leading-none gap-[3px] text-left">
                  <div className="flex items-baseline leading-none">
                    <span className="font-black text-lg tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
                      Sugikaran
                    </span>
                    <span className="font-black text-lg tracking-tight text-primary">
                      .dev
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Full Stack Developer
                  </span>
                </div>
              </button>
              <p className="text-sm leading-6 text-muted-foreground max-w-sm">
                Building digital experiences with modern web technologies. Focused on creating elegant, efficient, and user-centric solutions.
              </p>
              <div className="flex gap-x-2">
                <a href="https://github.com/ElangoSugikaran" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors group p-2 -ml-2 rounded-lg hover:bg-muted">
                  <span className="sr-only">GitHub</span>
                  <GithubIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors group p-2 rounded-lg hover:bg-muted">
                  <span className="sr-only">LinkedIn</span>
                  <LinkedinIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="mailto:contact@sugikaran.dev" className="text-muted-foreground hover:text-foreground transition-colors group p-2 rounded-lg hover:bg-muted">
                  <span className="sr-only">Email</span>
                  <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
            
            {/* Links Section */}
            <div className="mt-16 xl:col-span-2 xl:mt-0 flex flex-col md:items-end">
              <div className="w-full md:w-[70%] lg:w-[50%]">
                <h3 className="text-sm font-semibold leading-6 text-foreground uppercase tracking-wider mb-6">Navigation</h3>
                <ul role="list" className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {NAV_LINKS.map((link) => (
                    <li key={link.label}>
                      <button 
                        onClick={() => handleLinkClick(link.href)}
                        className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 transform inline-block duration-200"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Bottom section */}
          <div className="mt-16 border-t border-border/40 pt-8 sm:mt-20 lg:mt-24 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs leading-5 text-muted-foreground">
              &copy; {currentYear} Sugikaran. All rights reserved.
            </p>
            <p className="text-xs leading-5 text-muted-foreground flex items-center gap-1">
              Designed & Built with <span className="text-destructive animate-pulse">❤️</span> in React
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
