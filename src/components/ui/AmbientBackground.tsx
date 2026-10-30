import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

type AmbientTone = 'about' | 'experience' | 'projects' | 'skills' | 'education' | 'certifications' | 'contact'

function getRouteTone(pathname: string): AmbientTone {
  if (pathname.startsWith('/projects')) return 'projects'
  if (pathname.startsWith('/education')) return 'education'
  if (pathname.startsWith('/certifications')) return 'certifications'
  return 'about'
}

function getTone(value: string | undefined, fallback: AmbientTone): AmbientTone {
  switch (value) {
    case 'about':
    case 'experience':
    case 'projects':
    case 'skills':
    case 'education':
    case 'certifications':
    case 'contact':
      return value
    default:
      return fallback
  }
}

export function AmbientBackground() {
  const { pathname } = useLocation()
  const routeTone = getRouteTone(pathname)
  const [tone, setTone] = useState<AmbientTone>(routeTone)

  useEffect(() => {
    setTone(routeTone)

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-ambient]'))
    if (sections.length === 0 || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(() => {
      const viewportCenter = window.innerHeight / 2
      const activeBand = window.innerHeight * 0.05
      const activeSection = sections
        .map((section) => ({ section, bounds: section.getBoundingClientRect() }))
        .filter(
          ({ bounds }) =>
            bounds.bottom >= viewportCenter - activeBand &&
            bounds.top <= viewportCenter + activeBand,
        )
        .sort(
          (a, b) =>
            Math.abs((a.bounds.top + a.bounds.bottom) / 2 - viewportCenter) -
            Math.abs((b.bounds.top + b.bounds.bottom) / 2 - viewportCenter),
        )[0]?.section

      if (activeSection) setTone(getTone(activeSection.dataset.ambient, routeTone))
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 })

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname, routeTone])

  return (
    <div aria-hidden="true" className="ambient-background" data-tone={tone}>
      <div className="ambient-background__orb ambient-background__orb--a" />
      <div className="ambient-background__orb ambient-background__orb--b" />
      <div className="ambient-background__orb ambient-background__orb--c" />
    </div>
  )
}
