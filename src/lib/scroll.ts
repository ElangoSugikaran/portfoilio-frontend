import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const HEADER_OFFSET = 0; // Sections already have internal py-24/py-32 providing perfect clearance

type LenisListener = (instance: Lenis | null) => void;

let lenisInstance: Lenis | null = null;
let loopLenis: Lenis | null = null;
let scrollHandler: (() => void) | null = null;
let tickerHandler: ((time: number) => void) | null = null;
const lenisListeners = new Set<LenisListener>();

function detachLenisLoop() {
  if (!loopLenis) return;

  if (scrollHandler) loopLenis.off('scroll', scrollHandler);
  if (tickerHandler) gsap.ticker.remove(tickerHandler);

  loopLenis = null;
  scrollHandler = null;
  tickerHandler = null;
}

function attachLenisLoop(instance: Lenis) {
  detachLenisLoop();

  loopLenis = instance;
  scrollHandler = () => ScrollTrigger.update();
  tickerHandler = (time) => instance.raf(time * 1000);

  instance.on('scroll', scrollHandler);
  gsap.ticker.add(tickerHandler);
  gsap.ticker.lagSmoothing(0);
}

export function setGlobalLenis(instance: Lenis | null) {
  if (lenisInstance === instance) return;

  detachLenisLoop();
  lenisInstance = instance;

  if (instance) {
    attachLenisLoop(instance);
  }

  lenisListeners.forEach((listener) => listener(instance));
}

export function getGlobalLenis(): Lenis | null {
  return lenisInstance;
}

export function subscribeGlobalLenis(listener: LenisListener) {
  lenisListeners.add(listener);
  listener(lenisInstance);
  return () => {
    lenisListeners.delete(listener);
  };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface ScrollToOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
}

/**
 * Deterministically waits for an element with the given ID to exist in the DOM
 * and then scrolls to it using Lenis (or native scrollTo fallback).
 */
export function scrollToAnchor(targetId: string, options: ScrollToOptions = {}): Promise<boolean> {
  const cleanId = targetId.replace(/^#/, '');
  const offset = options.offset ?? HEADER_OFFSET;
  const isReduced = prefersReducedMotion();
  const immediate = options.immediate ?? isReduced;

  return new Promise((resolve) => {
    const startTime = performance.now();
    const MAX_WAIT_MS = 2000;

    function checkAndScroll() {
      const el = document.getElementById(cleanId);
      if (el) {
        // Wait one frame to ensure layout computation has settled
        requestAnimationFrame(() => {
          const lenis = getGlobalLenis();
          if (lenis && !isReduced) {
            lenis.scrollTo(el, {
              offset,
              immediate,
              duration: options.duration ?? 0.9,
              onComplete: () => {
                resolve(true);
              },
            });
          } else {
            const top = el.getBoundingClientRect().top + window.scrollY + offset;
            window.scrollTo({
              top: Math.max(0, top),
              behavior: immediate ? 'auto' : 'smooth',
            });
            resolve(true);
          }
        });
        return;
      }

      if (performance.now() - startTime < MAX_WAIT_MS) {
        requestAnimationFrame(checkAndScroll);
      } else {
        resolve(false);
      }
    }

    checkAndScroll();
  });
}

/**
 * Scroll to top helper with Lenis / native fallback.
 */
export function scrollToTop(options: ScrollToOptions = {}) {
  const isReduced = prefersReducedMotion();
  const immediate = options.immediate ?? isReduced;
  const lenis = getGlobalLenis();

  if (lenis && !isReduced) {
    lenis.scrollTo(0, {
      immediate,
      duration: options.duration ?? 1.0,
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior: immediate ? 'auto' : 'smooth',
    });
  }
}

/**
 * Lock page scroll (for modal or mobile menu).
 */
export function lockPageScroll() {
  const lenis = getGlobalLenis();
  if (lenis) {
    lenis.stop();
  }
  document.documentElement.classList.add('overflow-hidden');
  document.body.classList.add('overflow-hidden');
}

/**
 * Unlock page scroll.
 */
export function unlockPageScroll() {
  const lenis = getGlobalLenis();
  if (lenis) {
    lenis.start();
  }
  document.documentElement.classList.remove('overflow-hidden');
  document.body.classList.remove('overflow-hidden');
}
