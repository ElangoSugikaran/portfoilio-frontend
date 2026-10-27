import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { useThemeStore } from '@/store/theme';
import { useAbout } from '@/hooks/api/useAbout';
import { useSettings } from '@/hooks/api/useSettings';
import { scrollToAnchor, scrollToTop, lockPageScroll, unlockPageScroll } from '@/lib/scroll';

// ── Logo ──────────────────────────────────────
function LogoMark({
  brandName,
  roleTitle,
  isOverDarkHero,
  onClick,
}: {
  brandName: string;
  roleTitle: string;
  isOverDarkHero?: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href="#hero"
      onClick={onClick}
      aria-label="Go to top"
      className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-lg cursor-pointer"
    >
      <div className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-300 group-hover:scale-105 ${
        isOverDarkHero
          ? 'bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25'
          : 'bg-foreground text-background group-hover:bg-primary group-hover:text-primary-foreground'
      }`}>
        {brandName.charAt(0) || 'S'}
      </div>
      {/* Name — hidden on mobile, shown sm+ */}
      <div className="hidden sm:flex flex-col leading-none gap-[3px] text-left">
        <div className="flex items-baseline leading-none">
          <span className={`font-black text-sm tracking-tight transition-colors duration-200 whitespace-nowrap ${
            isOverDarkHero
              ? 'text-white group-hover:text-blue-300'
              : 'text-foreground group-hover:text-primary'
          }`}>
            {brandName}
          </span>
          <span className={`font-black text-sm tracking-tight whitespace-nowrap ${
            isOverDarkHero ? 'text-blue-400' : 'text-primary'
          }`}>
            .dev
          </span>
        </div>
        <span className={`text-[8px] font-bold uppercase tracking-[0.16em] whitespace-nowrap ${
          isOverDarkHero ? 'text-white/70' : 'text-muted-foreground'
        }`}>
          {roleTitle}
        </span>
      </div>
    </a>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: about } = useAbout();
  const { data: settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const { resolvedTheme, toggleTheme } = useThemeStore();

  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<number | null>(null);

  const brandName = 'Sugikaran';
  const roleTitle = about?.title || settings?.roles?.[0] || 'Full Stack Developer';

  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const isOverDarkHero = isHomePage && isOverHero;

  // Handle scroll state for header styling and hero boundary
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero');
      const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : window.innerHeight;
      setIsOverHero(heroBottom > 76);
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll and handle Escape key on mobile drawer
  useEffect(() => {
    if (isOpen) {
      lockPageScroll();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        unlockPageScroll();
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  // Close drawer on route or hash changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  // Active section tracking with scroll-position calculation
  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    const sectionIds = NAV_LINKS.map((link) => link.href.replace('#', '')).filter(Boolean);

    let rafId: number | null = null;

    const handleScrollSpy = () => {
      // Don't override while user clicked a link and page is smooth-scrolling to it
      if (isClickScrollingRef.current) return;
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        rafId = null;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // If user is at or near the bottom of the page, activate the last section
        if (scrollY + windowHeight >= documentHeight - 60) {
          const lastSection = sectionIds[sectionIds.length - 1];
          if (lastSection) {
            setActiveSection(lastSection);
            return;
          }
        }

        // Active trigger line: 200px from top of viewport
        const headerOffset = Math.min(220, windowHeight * 0.35);
        let matchedSection = sectionIds[0] || 'hero';

        for (const id of sectionIds) {
          const element = document.getElementById(id);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= headerOffset && rect.bottom > headerOffset) {
              matchedSection = id;
              break;
            }
          }
        }

        setActiveSection(matchedSection);
      });
    };

    handleScrollSpy();
    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    window.addEventListener('resize', handleScrollSpy, { passive: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScrollSpy);
      window.removeEventListener('resize', handleScrollSpy);
    };
  }, [isHomePage]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    if (!href.startsWith('#')) {
      return;
    }

    e.preventDefault();
    const targetId = href.replace('#', '');
    setActiveSection(targetId);

    // Lock scroll-spy briefly so it doesn't flicker intermediate sections during smooth scroll
    isClickScrollingRef.current = true;
    if (clickTimeoutRef.current) window.clearTimeout(clickTimeoutRef.current);

    if (!isHomePage) {
      navigate(`/${href}`);
      return;
    }

    window.history.pushState(null, '', href);
    scrollToAnchor(href).finally(() => {
      if (clickTimeoutRef.current) window.clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = window.setTimeout(() => {
        isClickScrollingRef.current = false;
      }, 150);
    });

    // Safety fallback
    clickTimeoutRef.current = window.setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 1500);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setIsOpen(false);
    if (!isHomePage) {
      navigate('/');
      return;
    }
    window.history.pushState(null, '', window.location.pathname);
    scrollToTop();
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center pt-4 pointer-events-none"
      >
        <div
          className={`
            pointer-events-auto
            w-[calc(100%-2rem)] max-w-[1200px] h-13
            flex items-center justify-between
            lg:grid lg:grid-cols-[auto_1fr_auto]
            px-4 sm:px-6 rounded-2xl border
            transition-all duration-300
            ${
              isOverDarkHero
                ? 'bg-black/55 backdrop-blur-md border-white/20 text-white shadow-xl shadow-black/20'
                : scrolled
                ? 'bg-background/90 backdrop-blur-2xl border-border shadow-lg shadow-black/10 text-foreground'
                : 'bg-background/80 backdrop-blur-md border-border/70 text-foreground'
            }
          `}
          style={{ height: '52px' }}
        >
          {/* ── ZONE 1 · Logo ── */}
          <LogoMark
            brandName={brandName}
            roleTitle={roleTitle}
            isOverDarkHero={isOverDarkHero}
            onClick={handleLogoClick}
          />

          {/* ── ZONE 2 · Nav links (desktop only) ── */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const targetId = link.href.replace('#', '');
              const isActive = activeSection === targetId && isHomePage;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    relative px-3 py-1.5 rounded-md whitespace-nowrap
                    text-xs font-semibold uppercase tracking-[0.07em]
                    transition-colors duration-200 cursor-pointer
                    focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring
                    ${
                      isActive
                        ? isOverDarkHero
                          ? 'text-white bg-white/20'
                          : 'text-primary bg-primary/10'
                        : isOverDarkHero
                        ? 'text-white/75 hover:text-white hover:bg-white/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <span className="relative">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* ── ZONE 3 · Actions ── */}
          <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
            {/* Real Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                isOverDarkHero
                  ? 'text-white/80 hover:text-white hover:bg-white/15'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className={`w-4 h-4 ${isOverDarkHero ? 'text-blue-300' : 'text-slate-700'}`} />
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className={`lg:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                isOverDarkHero
                  ? 'text-white hover:bg-white/15'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              data-lenis-prevent
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="
                fixed inset-x-4 top-[72px] z-50
                bg-background/95 backdrop-blur-3xl
                rounded-2xl border border-border/80
                shadow-2xl p-4 lg:hidden max-h-[calc(100vh-90px)] overflow-y-auto
              "
            >
              <nav className="flex flex-col gap-1 mt-1" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => {
                  const targetId = link.href.replace('#', '');
                  const isActive = activeSection === targetId && isHomePage;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`
                        w-full text-left px-3.5 py-3 rounded-xl
                        text-sm font-semibold uppercase tracking-widest
                        transition-colors duration-150 cursor-pointer
                        ${
                          isActive
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
