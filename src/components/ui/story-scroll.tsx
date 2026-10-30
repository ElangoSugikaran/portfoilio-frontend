'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getGlobalLenis, prefersReducedMotion, subscribeGlobalLenis } from '@/lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MEDIA = '(min-width: 1024px)';
const COMPACT_MEDIA = '(max-width: 1023px)';
const PHONE_MEDIA = '(max-width: 639px)';
const REDUCE_MEDIA = '(prefers-reduced-motion: reduce)';

const DESKTOP = {
  rotation: 30,
  gap: 12,
  activeProjectProgress: 0.52,
} as const;

const COMPACT = {
  start: 'top 85%',
  y: 24,
  scale: 0.98,
  rotation: 5,
  duration: 0.6,
  phoneY: 16,
  phoneRotation: 2.5,
  phoneDuration: 0.45,
  stagger: 0.05,
  imageScale: 1.04,
} as const;

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
    className={cx(
      'relative flex w-full items-center justify-center overflow-visible px-2 py-3 sm:px-3 md:px-4 lg:sticky lg:top-[var(--flow-stage-offset,144px)] lg:h-[calc(100dvh-var(--flow-stage-offset,144px))] lg:min-h-0 lg:px-0 lg:py-0',
      className,
    )}
  >
    <div
      data-flow-inner
      className={cx(
        'flow-art-container relative flex h-auto w-full max-w-full min-h-0 flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-lg shadow-black/25 sm:gap-5 sm:rounded-3xl sm:shadow-xl md:gap-5 lg:h-full lg:max-w-[1160px] lg:gap-5 lg:p-6 dark:border-white/10 dark:bg-[#0B101E] xl:p-7',
        'p-3 sm:p-5 md:p-6 [@media(min-width:1024px)_and_(max-height:720px)]:gap-3 [@media(min-width:1024px)_and_(max-height:720px)]:p-4',
        innerClassName,
      )}
      style={style}
    >
      {themeColor && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-30"
          style={{
            background: `radial-gradient(circle at 100% 0%, ${themeColor} 0%, transparent 62%)`,
          }}
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
  showProgress?: boolean;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

export const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  'aria-label': ariaLabel = 'Story scroll',
  totalCards = 0,
  projectTitles = [],
  showProgress = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLElement>(null);
  const refreshTimer = useRef<number | null>(null);
  const refreshAfterScrollRef = useRef(false);
  const sectionCount = childCount(children);
  const cardCount = totalCards || projectTitles.length;
  const shouldShowProgress = showProgress && cardCount > 1;

  const scheduleRefresh = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (refreshTimer.current !== null) {
      window.clearTimeout(refreshTimer.current);
    }

    refreshTimer.current = window.setTimeout(() => {
      refreshTimer.current = null;
      if (ScrollTrigger.isScrolling()) {
        refreshAfterScrollRef.current = true;
        return;
      }
      ScrollTrigger.refresh();
    }, 150);
  }, []);

  const setProgressIndex = useCallback((index: number) => {
    const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>(
      '[data-project-index]',
    );
    buttons?.forEach((button) => {
      const active = Number(button.dataset.projectIndex) === index;
      button.dataset.active = String(active);
      if (active) {
        button.setAttribute('aria-current', 'step');
      } else {
        button.removeAttribute('aria-current');
      }
    });
  }, []);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const navbar = document.querySelector<HTMLElement>('[data-site-navbar]');
    const progress = progressRef.current;
    const updateStageOffset = () => {
      const navbarHeight = navbar?.offsetHeight ?? 68;
      const progressHeight = progress?.offsetHeight ?? 0;
      const titleBarTop = navbarHeight + DESKTOP.gap;
      const stageOffset = titleBarTop + progressHeight + DESKTOP.gap;
      const nextValue = `${Math.ceil(stageOffset)}px`;

      if (root.style.getPropertyValue('--flow-stage-offset') !== nextValue) {
        root.style.setProperty('--flow-stage-offset', nextValue);
        scheduleRefresh();
      }
      if (progress) {
        if (window.innerWidth >= 1024) {
          progress.style.top = `${titleBarTop}px`;
        } else {
          progress.style.removeProperty('top');
        }
      }
    };

    updateStageOffset();

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updateStageOffset);
    if (navbar) resizeObserver?.observe(navbar);
    if (progress) resizeObserver?.observe(progress);

    window.addEventListener('resize', updateStageOffset);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateStageOffset);
    };
  }, [scheduleRefresh, sectionCount]);

  useEffect(() => {
    const refreshAfterScroll = () => {
      if (!refreshAfterScrollRef.current) return;
      refreshAfterScrollRef.current = false;
      scheduleRefresh();
    };

    ScrollTrigger.addEventListener('scrollEnd', refreshAfterScroll);
    return () => {
      ScrollTrigger.removeEventListener('scrollEnd', refreshAfterScroll);
    };
  }, [scheduleRefresh]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    let cancelled = false;
    const requestRefresh = () => {
      if (!cancelled) scheduleRefresh();
    };

    const images = Array.from(root.querySelectorAll('img'));
    images.forEach((image) => {
      if (image.complete) return;
      image.addEventListener('load', requestRefresh, { once: true });
      image.addEventListener('error', requestRefresh, { once: true });
    });

    document.fonts?.ready.then(requestRefresh).catch(() => undefined);
    window.addEventListener('orientationchange', requestRefresh);
    const unsubscribe = subscribeGlobalLenis(requestRefresh);

    scheduleRefresh();

    return () => {
      cancelled = true;
      if (refreshTimer.current !== null) {
        window.clearTimeout(refreshTimer.current);
        refreshTimer.current = null;
      }
      images.forEach((image) => {
        image.removeEventListener('load', requestRefresh);
        image.removeEventListener('error', requestRefresh);
      });
      window.removeEventListener('orientationchange', requestRefresh);
      unsubscribe();
    };
  }, [scheduleRefresh, sectionCount]);

  const scrollToSection = useCallback((index: number) => {
    const root = containerRef.current;
    if (!root) return;

    const section = root.querySelectorAll<HTMLElement>('[data-flow-section]')[index];
    if (!section) return;

    const deck = root.querySelector<HTMLElement>('[data-flow-deck]');
    const stageOffset = Number.parseFloat(
      root.style.getPropertyValue('--flow-stage-offset') || '144',
    );

    let top: number;
    if (window.matchMedia(DESKTOP_MEDIA).matches && deck) {
      const deckTop = deck.getBoundingClientRect().top + window.scrollY;
      top = deckTop + index * section.offsetHeight - stageOffset;
    } else {
      const progress = progressRef.current;
      const stickyTop = progress
        ? Number.parseFloat(window.getComputedStyle(progress).top) || 0
        : 0;
      const progressOffset = progress?.offsetHeight ?? 0;
      top =
        section.getBoundingClientRect().top +
        window.scrollY -
        (stickyTop + progressOffset + DESKTOP.gap);
    }

    const lenis = getGlobalLenis();
    if (lenis && !prefersReducedMotion()) {
      lenis.scrollTo(top, { duration: 0.9 });
      return;
    }

    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, []);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;

      ScrollTrigger.config({ ignoreMobileResize: true });

      const sections = Array.from(
        root.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: DESKTOP_MEDIA,
          isCompact: COMPACT_MEDIA,
          isPhone: PHONE_MEDIA,
          reduce: REDUCE_MEDIA,
        },
        (context) => {
          const conditions = context.conditions ?? {};
          const isDesktop = Boolean(conditions.isDesktop);
          const isCompact = Boolean(conditions.isCompact);
          const isPhone = Boolean(conditions.isPhone);
          const reduce = Boolean(conditions.reduce);
          const triggers: ScrollTrigger[] = [];
          const timelines: gsap.core.Timeline[] = [];

          const clearFlowStyles = () => {
            sections.forEach((section) => {
              section.removeAttribute('inert');
              gsap.set(section, { clearProps: 'zIndex' });

              const inner = section.querySelector<HTMLElement>('[data-flow-inner]');
              if (!inner) return;

              gsap.set(inner, {
                clearProps: 'transform,transformOrigin,opacity,visibility,willChange',
              });
              gsap.set(inner.querySelectorAll<HTMLElement>('[data-anim]'), {
                clearProps: 'transform,opacity,visibility,willChange',
              });
            });
          };

          if (isDesktop) {
            const deck = root.querySelector<HTMLElement>('[data-flow-deck]');
            const stageOffsetValue = () =>
              root.style.getPropertyValue('--flow-stage-offset') || '144px';
            const sectionHeight = () => sections[0]?.offsetHeight || window.innerHeight;
            const segmentCount = sections.length - 1;

            sections.forEach((section, index) => {
              gsap.set(section, { zIndex: index + 1 });
            });

            if (segmentCount > 0) {
              let activeIndex = 0;
              const resolveActiveIndex = (progress: number) =>
                Math.min(
                  sections.length - 1,
                  Math.max(
                    0,
                    Math.floor(progress * segmentCount + (1 - DESKTOP.activeProjectProgress)),
                  ),
                );

              const rotationTimeline = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                  trigger: deck ?? sections[0],
                  start: () => `top ${stageOffsetValue()}`,
                  end: () => `+=${segmentCount * sectionHeight()}`,
                  scrub: true,
                  invalidateOnRefresh: true,
                  id: 'featured-projects-stack',
                  onUpdate: (self) => {
                    const next = resolveActiveIndex(self.progress);
                    if (next === activeIndex) return;
                    activeIndex = next;
                    setProgressIndex(next);
                  },
                  onRefresh: (self) => {
                    activeIndex = resolveActiveIndex(self.progress);
                    setProgressIndex(activeIndex);
                  },
                },
              });

              sections.forEach((section, index) => {
                if (index === 0) return;

                const inner = section.querySelector<HTMLElement>('[data-flow-inner]');
                if (!inner) return;

                gsap.set(inner, {
                  rotation: DESKTOP.rotation,
                  transformOrigin: 'bottom left',
                });

                rotationTimeline.fromTo(
                  inner,
                  { rotation: DESKTOP.rotation },
                  { rotation: 0, duration: 1, ease: 'none', force3D: true },
                  index - 1,
                );
              });

              timelines.push(rotationTimeline);
              if (rotationTimeline.scrollTrigger) {
                triggers.push(rotationTimeline.scrollTrigger);
              }
            }
          } else if (reduce) {
            sections.forEach((section) => {
              const inner = section.querySelector<HTMLElement>('[data-flow-inner]');
              if (!inner) return;

              gsap.set(inner, { autoAlpha: 0, y: 8 });
              triggers.push(
                ScrollTrigger.create({
                  trigger: section,
                  start: COMPACT.start,
                  once: true,
                  invalidateOnRefresh: true,
                  onEnter: () => {
                    gsap.to(inner, {
                      autoAlpha: 1,
                      y: 0,
                      duration: 0.3,
                      ease: 'power1.out',
                      overwrite: true,
                    });
                  },
                  onRefresh: (self) => {
                    if (self.progress > 0) gsap.set(inner, { autoAlpha: 1, y: 0 });
                  },
                }),
              );
              triggers.push(
                ScrollTrigger.create({
                  trigger: section,
                  start: 'top 50%',
                  end: 'bottom 50%',
                  invalidateOnRefresh: true,
                  onEnter: () => setProgressIndex(sections.indexOf(section)),
                  onEnterBack: () => setProgressIndex(sections.indexOf(section)),
                  onRefresh: (self) => {
                    if (self.isActive) setProgressIndex(sections.indexOf(section));
                  },
                }),
              );
            });
          } else if (isCompact) {
            sections.forEach((section) => {
              section.removeAttribute('inert');

              const inner = section.querySelector<HTMLElement>('[data-flow-inner]');
              if (!inner) return;

              const meta = inner.querySelector<HTMLElement>('[data-anim="meta"]');
              const title = inner.querySelector<HTMLElement>('[data-anim="title"]');
              const tagline = inner.querySelector<HTMLElement>('[data-anim="tagline"]');
              const summary = inner.querySelector<HTMLElement>('[data-anim="summary"]');
              const chips = inner.querySelector<HTMLElement>('[data-anim="chips"]');
              const ctaGroup = inner.querySelector<HTMLElement>('[data-anim="cta-group"]');
              const mockup = inner.querySelector<HTMLElement>('[data-anim="mockup"]');
              const mockupImage = inner.querySelector<HTMLElement>('[data-anim="mockup-image"]');
              const groups = [meta, title, tagline, summary, chips, ctaGroup, mockup].filter(
                (element): element is HTMLElement => Boolean(element),
              );
              const rest = [tagline, summary, chips, ctaGroup, mockup].filter(
                (element): element is HTMLElement => Boolean(element),
              );
              const animated = [
                inner,
                ...(isPhone ? [meta, title, ...rest] : groups),
                ...(mockupImage ? [mockupImage] : []),
              ].filter((element): element is HTMLElement => Boolean(element));

              if (isPhone) {
                gsap.set(inner, {
                  autoAlpha: 0,
                  y: COMPACT.phoneY,
                  scale: 1,
                  rotation: COMPACT.phoneRotation,
                  transformOrigin: 'bottom left',
                });
                gsap.set(
                  [meta, title, ...rest].filter(
                    (element): element is HTMLElement => Boolean(element),
                  ),
                  { autoAlpha: 0, y: 10 },
                );
                if (mockupImage) gsap.set(mockupImage, { scale: 1 });
              } else {
                gsap.set(inner, {
                  autoAlpha: 0,
                  y: COMPACT.y,
                  scale: COMPACT.scale,
                  rotation: COMPACT.rotation,
                  transformOrigin: 'bottom left',
                });
                gsap.set(groups, { autoAlpha: 0, y: 12 });
                if (mockupImage) gsap.set(mockupImage, { scale: COMPACT.imageScale });
              }

              const timeline = gsap.timeline({
                paused: true,
                defaults: { ease: 'power2.out' },
                onStart: () => gsap.set(animated, { willChange: 'transform, opacity' }),
                onComplete: () => gsap.set(animated, { willChange: 'auto' }),
              });

              timeline.to(
                inner,
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  rotation: 0,
                  duration: isPhone ? COMPACT.phoneDuration : COMPACT.duration,
                },
                0,
              );

              if (isPhone) {
                if (meta) timeline.to(meta, { autoAlpha: 1, y: 0, duration: 0.28 }, 0.08);
                if (title) timeline.to(title, { autoAlpha: 1, y: 0, duration: 0.28 }, 0.13);
                if (rest.length > 0) {
                  timeline.to(rest, { autoAlpha: 1, y: 0, duration: 0.28 }, 0.18);
                }
              } else {
                if (groups.length > 0) {
                  timeline.to(
                    groups,
                    {
                      autoAlpha: 1,
                      y: 0,
                      duration: 0.32,
                      stagger: COMPACT.stagger,
                    },
                    0.18,
                  );
                }
                if (mockupImage) {
                  timeline.to(
                    mockupImage,
                    { scale: 1, duration: 0.7 },
                    0.2,
                  );
                }
              }

              timelines.push(timeline);

              triggers.push(
                ScrollTrigger.create({
                  trigger: section,
                  start: COMPACT.start,
                  invalidateOnRefresh: true,
                  onEnter: () => {
                    timeline.restart();
                  },
                  onEnterBack: () => {
                    timeline.restart();
                  },
                  onLeaveBack: () => {
                    timeline.pause(0);
                  },
                  onRefresh: (self) => {
                    if (self.progress > 0) timeline.progress(1).pause();
                  },
                }),
              );
              triggers.push(
                ScrollTrigger.create({
                  trigger: section,
                  start: 'top 55%',
                  end: 'bottom 45%',
                  onEnter: () => setProgressIndex(sections.indexOf(section)),
                  onEnterBack: () => setProgressIndex(sections.indexOf(section)),
                  invalidateOnRefresh: true,
                }),
              );
            });
          }

          scheduleRefresh();

          return () => {
            timelines.forEach((timeline) => timeline.kill());
            triggers.forEach((trigger) => trigger.kill());
            clearFlowStyles();
          };
        },
      );

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef, dependencies: [sectionCount, scheduleRefresh, setProgressIndex] },
  );

  return (
    <div ref={containerRef} className={cx('relative w-full', className)}>
      {shouldShowProgress && (
        <nav
          ref={progressRef}
          data-project-progress
          aria-label="Featured projects progress"
          className="sticky top-16 z-40 mx-auto mb-4 w-fit max-w-6xl px-2 sm:mb-5 lg:w-full lg:px-4"
        >
          <ol className="flex items-center justify-center gap-1 rounded-full border border-border/70 bg-background p-1.5 shadow-lg lg:rounded-2xl">
            {projectTitles.slice(0, cardCount).map((title, index) => {
              const isActive = index === 0;

              return (
                <li key={`${index}-${title}`} className="min-w-0 shrink-0 lg:flex-1">
                  <button
                    type="button"
                    data-project-index={index}
                    data-active={index === 0}
                    onClick={() => scrollToSection(index)}
                    aria-label={`Go to project ${index + 1}: ${title || `Project ${index + 1}`}`}
                    aria-current={isActive ? 'step' : undefined}
                    className={cx(
                      'group flex min-h-10 min-w-10 items-center justify-center rounded-full text-left text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary lg:w-full lg:justify-start lg:gap-2 lg:rounded-xl lg:px-2.5 lg:py-1.5',
                    )}
                  >
                    <span className="hidden shrink-0 font-mono text-[11px] font-bold tabular-nums lg:inline">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cx(
                        'h-2 w-2 rounded-full bg-muted-foreground/50 transition-all duration-200 group-data-[active=true]:w-5 group-data-[active=true]:bg-primary lg:hidden',
                      )}
                    />
                    <span className="hidden min-w-0 truncate text-[11px] font-semibold uppercase tracking-wider lg:inline">
                      {title || `Project ${index + 1}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <div
        data-flow-deck
        role="region"
        aria-label={ariaLabel}
        className="w-full overflow-x-clip"
      >
        {children}
      </div>
    </div>
  );
};

// Backwards-compatible aliases
export const StoryScroll = FlowArt;
export const StorySection = FlowSection;
export type StoryScrollProps = FlowArtProps;
export type StorySectionProps = FlowSectionProps;

export default FlowArt;
