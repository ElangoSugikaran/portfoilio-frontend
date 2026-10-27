import { setGlobalLenis, getGlobalLenis, scrollToAnchor } from "@/lib/scroll"
import { useEffect, useState } from 'react'
import { ReactLenis } from 'lenis/react'
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

function App() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

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
      autoRaf={!prefersReducedMotion}
      options={{
        duration: prefersReducedMotion ? 0 : 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: !prefersReducedMotion,
      }}
      ref={(lenisRef) => {
        if (lenisRef?.lenis) {
          setGlobalLenis(lenisRef.lenis)
        }
      }}
    >
      <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
        <ScrollRestoration />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  )
}

export default App
