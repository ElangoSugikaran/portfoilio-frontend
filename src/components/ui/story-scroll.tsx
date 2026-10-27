'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getGlobalLenis } from '@/lib/scroll';

gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

export interface FlowSectionProps {
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
  themeColor?: string;
  index?: number;
  total?: number;
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  innerClassName,
  style = {},
  children,
  'aria-label': ariaLabel,
  themeColor,
}) => (
  <section
    data-flow-section
    aria-label={ariaLabel}
    className={cx('relative min-h-screen w-full overflow-hidden', className)}
  >
    <div
      data-flow-inner
      className={cx(
        'flow-art-container relative flex min-h-screen w-full flex-col justify-between gap-6 px-[4vw] pt-[clamp(4.5rem,8vw,6rem)] pb-[4vw]',
        'will-change-transform bg-background/95 dark:bg-[#0B101E]/95 backdrop-blur-md border-t border-border/40',
        innerClassName,
      )}
      style={{ transformOrigin: 'bottom left', ...style }}
    >
      {themeColor && (
        <div
          className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full blur-[120px] pointer-events-none opacity-20 dark:opacity-30"
          style={{ background: themeColor }}
        />
      )}
      {children}
    </div>
  </section>
);

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
  as?: 'div' | 'main' | 'section';
  totalCards?: number;
  projectTitles?: string[];
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

export const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  'aria-label': ariaLabel = 'Story scroll',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Sync GSAP ScrollTrigger with Lenis virtual scroll loop
  useEffect(() => {
    const lenis = getGlobalLenis();
    if (!lenis) return;
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on('scroll', handleScroll);
    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              pin: true,
              pinSpacing: false,
            }),
          );
        }
      });

      ScrollTrigger.refresh();

      // Ensure trigger calculations update after fonts / assets settle
      const timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 350);

      return () => {
        window.clearTimeout(timer);
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [childCount(children), reducedMotion] },
  );

  return (
    <div
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx('w-full overflow-x-hidden', className)}
    >
      {children}
    </div>
  );
};

// Backwards-compatible aliases
export const StoryScroll = FlowArt;
export const StorySection = FlowSection;
export type StoryScrollProps = FlowArtProps;
export type StorySectionProps = FlowSectionProps;

export default FlowArt;
