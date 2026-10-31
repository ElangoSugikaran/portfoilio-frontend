import { setGlobalLenis, getGlobalLenis, scrollToAnchor, prefersReducedMotion as getPrefersReducedMotion } from "@/lib/scroll"
import { useCallback, useEffect, useState } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import type Lenis from 'lenis'
import { MotionConfig } from 'framer-motion'
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { AmbientBackground } from "@/components/ui/AmbientBackground"
import { trackPageView } from "@/lib/analytics"

function LenisSync() {
  const syncLenis = useCallback((instance: Lenis | null) => {
    setGlobalLenis(instance)
  }, [])

  useLenis(syncLenis)

  useEffect(() => () => setGlobalLenis(null), [])

  return null
}

function App() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPrefersReducedMotion)
  const location = useLocation()

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    trackPageView(location.pathname, document.title)
  }, [location.pathname])

  // Synchronize Lenis with route changes and anchor navigation (Phase A2.3)
  useEffect(() => {
    if (location.hash) {
      scrollToAnchor(location.hash, { immediate: prefersReducedMotion })
    } else {
      const lenis = getGlobalLenis()
      if (lenis && !prefersReducedMotion) {
        lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
    }
  }, [location.pathname, location.hash, prefersReducedMotion])

  return (
    <ReactLenis
      root
      autoRaf={false}
      options={{
        duration: prefersReducedMotion ? 0 : 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: !prefersReducedMotion,
      }}
    >
      <LenisSync />
      <MotionConfig reducedMotion="user">
        <div className="relative isolate min-h-dvh flex flex-col bg-background text-foreground font-sans antialiased">
          <AmbientBackground />
          <ScrollRestoration />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content" tabIndex={-1} className="relative z-10 flex-1 outline-none">
            <Outlet />
          </main>
          <div className="relative z-10">
            <Footer />
          </div>
        </div>
      </MotionConfig>
    </ReactLenis>
  )
}

export default App
