type SectionBackgroundProps = {
  variant?: 'grid'
}

export function SectionBackground({ variant = 'grid' }: SectionBackgroundProps) {
  return (
    <div aria-hidden="true" className={`section-background section-background--${variant}`} />
  )
}
