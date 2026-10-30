import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface SectionHeadingProps {
  icon: LucideIcon
  pillText: string
  title: string
  highlight?: string
  subtitle?: string
  align?: 'left' | 'center'
  children?: React.ReactNode
}

export function SectionHeading({
  icon: Icon,
  pillText,
  title,
  highlight,
  subtitle,
  align = 'left',
  children
}: SectionHeadingProps) {
  const alignClasses = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  
  const innerContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex flex-col gap-4 ${alignClasses} ${!children ? 'mb-16 md:mb-20' : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest w-fit ${align === 'center' ? 'mx-auto' : ''}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {pillText}
      </motion.div>
      
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter uppercase leading-[1.1]">
        {title && <span>{title} </span>}
        {highlight && <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">{highlight}</span>}
      </h2>
      
      {subtitle && (
        <p className={`text-muted-foreground text-lg leading-relaxed max-w-2xl mt-2 ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )

  if (children) {
    return (
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20 w-full">
        {innerContent}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="shrink-0"
        >
          {children}
        </motion.div>
      </div>
    )
  }

  return innerContent
}
