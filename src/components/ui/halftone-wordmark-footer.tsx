'use client';

// Halftone Wordmark Footer — a site footer whose wordmark is set enormous and
// cropped by the bottom edge, printed as a field of halftone dots. Each dot is
// sized by how much of the letter covers its cell, so the type keeps its edges
// at any scale. Move across it and the dots part around the pointer on springs,
// warming in colour as they are pushed off their place; click and a shock ring
// runs through the word. Above it sit the studio line, tracked link columns and
// a back-to-top, separated by a hairline, all over a fine print grain.

import * as React from 'react';
import { scrollToTop } from '@/lib/scroll';
import { ApiImage } from '@/components/ui/ApiImage';

export interface HalftonePalette {
  /** The footer background. */
  background: string;
  /** The dots at rest, and the text. */
  ink: string;
  /** The colour a dot warms toward as it is pushed off its place. */
  warm: string;
}

export type HalftonePreset = 'night' | 'paper' | 'ember' | 'cobalt';

export interface FooterLink {
  label: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialItem {
  icon: React.ReactNode;
  href: string;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface HalftoneWordmarkFooterProps {
  /** The giant word printed in dots. Lowercase reads best. */
  wordmark?: string;
  /** Top-left studio line / owner name. */
  label?: string;
  /** Profile image shown beside the studio line. */
  avatarUrl?: string;
  /** Local profile image used if the uploaded image cannot be loaded. */
  avatarFallbackUrl?: string;
  /** Keeps the logo skeleton visible until settings data is available. */
  avatarLoading?: boolean;
  /** The muted line under it. */
  meta?: string;
  /** Brief bio or summary statement. */
  description?: string;
  /** Social links under the brand. */
  socials?: FooterSocialItem[];
  /** Link columns along the top. */
  columns?: FooterColumn[];
  /** Show the back-to-top link. It scrolls the window to 0. Defaults to true. */
  backToTop?: boolean;
  /** Custom copyright text. */
  copyright?: string;
  /** Custom credit text. */
  credit?: string;
  /** Starting colours. Defaults to "night". */
  preset?: HalftonePreset;
  /** Colour overrides, merged over the preset. */
  palette?: { background?: string; ink?: string; warm?: string };
  /** Distance between dot centres, in CSS px. Defaults to 6. */
  dotGap?: number;
  /** How far the pointer pushes, in CSS px. Defaults to 115. */
  radius?: number;
  /** Hover sensitivity multiplier. Defaults to 1.6. Higher = more visible movement. */
  sensitivity?: number;
  /** How much of the word's cap height hangs below the bottom edge, 0–0.6. Defaults to 0.14. */
  crop?: number;
  /** Print grain over everything, 0–1. Defaults to 0.3. */
  grain?: number;
  /** Pointer and click response. Defaults to true. */
  interactive?: boolean;
  /** Face for the wordmark. Heavy grotesks print best. */
  fontFamily?: string;
  /** Weight of the wordmark. Defaults to 800. */
  fontWeight?: number;
  /** Face for the body/link type. */
  sansFamily?: string;
  /** Face for small mono labels. */
  monoFamily?: string;
  /** Root height. A definite length, never a percentage. */
  height?: string;
  /** Extra root class names. */
  className?: string;
}

const PRESETS: { [K in HalftonePreset]: HalftonePalette } = {
  night: { background: '#070a14', ink: '#94a3b8', warm: '#38bdf8' },
  paper: { background: '#f8fafc', ink: '#475569', warm: '#0284c7' },
  ember: { background: '#080e22', ink: '#93c5fd', warm: '#38bdf8' },
  cobalt: { background: '#050b1e', ink: '#bfdbfe', warm: '#60a5fa' },
};

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: 'Navigation',
    links: [
      { label: 'Home', href: '#hero' },
      { label: 'About', href: '#about' },
      { label: 'Experience', href: '#experience' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Skills', href: '#skills' },
      { label: 'Education', href: '#education' },
      { label: 'Certifications', href: '#certifications' },
      { label: 'All Projects', href: '/projects' },
    ],
  },
];

const SANS_STACK =
  '"Geist Variable", "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const MONO_STACK =
  '"Geist Mono", "JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace';

/** Hex → [r, g, b] in 0–255, or null for anything that isn't #rgb / #rrggbb. */
export function hwfHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Dot radius for a cell coverage in [0, 1]: area-true, so tone stays even. */
export function hwfRadius(coverage: number, gap: number): number {
  const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage;
  return Math.sqrt(c) * gap * 0.58;
}

/**
 * One step of a dot's spring back to home, plus the push from a pointer at
 * (px, py) within radius r. Returns [x, y, vx, vy].
 */
export function hwfStep(
  x: number,
  y: number,
  vx: number,
  vy: number,
  hx: number,
  hy: number,
  px: number,
  py: number,
  r: number,
  sensitivity: number = 1.6,
): [number, number, number, number] {
  const dx = x - px;
  const dy = y - py;
  const d2 = dx * dx + dy * dy;
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + 0.001;
    // Smooth quadratic ease-out decay for natural magnetic displacement
    const norm = d / r;
    const f = (1 - norm) * (1 - norm) * 6.5 * sensitivity;
    vx += (dx / d) * f;
    vy += (dy / d) * f;
  }
  // Responsive damped spring back to anchor home
  vx = (vx + (hx - x) * 0.05) * 0.86;
  vy = (vy + (hy - y) * 0.05) * 0.86;
  return [x + vx, y + vy, vx, vy];
}

/** How warm a dot is drawn: combining displacement from home and proximity to pointer. */
export function hwfWarmth(
  x: number,
  y: number,
  hx: number,
  hy: number,
  px: number,
  py: number,
  r: number,
  span: number = 40,
): number {
  const disp = Math.hypot(x - hx, y - hy);
  const dispK = span > 0 ? Math.min(1, disp / span) : 0;

  const d2 = (x - px) * (x - px) + (y - py) * (y - py);
  const proxK = r > 0 && d2 < r * r ? Math.pow(1 - Math.sqrt(d2) / r, 1.4) : 0;

  return Math.min(1, Math.max(dispK, proxK * 0.95));
}

/** Font size that sets `measured` (width at 100px) to fill `width` exactly. */
export function hwfFitSize(measured: number, width: number): number {
  return measured > 0 ? (width / measured) * 100 : 0;
}

const HWF_CSS = `
.hwf-root {
  position: relative; width: 100%; overflow: hidden; isolation: isolate;
  background: var(--hwf-bg); color: var(--hwf-ink); -webkit-font-smoothing: antialiased;
  border-radius: inherit;
  --hwf-word-h: 90px;
}
.hwf-root canvas {
  position: absolute; inset: 0; width: 100%; height: 100%; display: block; max-width: none;
  z-index: 1; pointer-events: auto; touch-action: pan-y;
}
.hwf-top {
  position: relative; z-index: 10; display: grid; grid-template-columns: minmax(0, 1.8fr) repeat(2, minmax(0, 1fr));
  gap: clamp(24px, 4vw, 48px); padding: clamp(28px, 4vw, 48px) clamp(24px, 4vw, 56px) 0;
  line-height: 1.6;
}
.hwf-brand { display: flex; flex-direction: column; gap: 12px; max-width: 440px; }
.hwf-brand-header { display: flex; align-items: center; gap: 12px; }
.hwf-brand-badge {
  width: 40px; height: 40px; border-radius: 50%; padding: 2px;
  background: linear-gradient(135deg, #38bdf8 0%, #2563eb 55%, #6366f1 100%);
  color: #ffffff; display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 15px; font-family: var(--hwf-sans);
  box-shadow: 0 4px 14px rgba(56, 189, 248, 0.35);
  flex-shrink: 0;
}
.hwf-brand-badge img { display: block; width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.hwf-brand-text { display: flex; flex-direction: column; }
.hwf-brand-text strong {
  font-family: var(--hwf-sans); font-weight: 700; font-size: 16px;
  letter-spacing: -0.01em; color: color-mix(in srgb, var(--hwf-ink) 95%, white);
}
.hwf-brand-text span {
  font-family: var(--hwf-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--hwf-warm); font-weight: 600; opacity: 0.9;
}
.hwf-brand-desc {
  font-family: var(--hwf-sans); font-size: 13px; line-height: 1.6;
  color: var(--hwf-ink); opacity: 0.72; margin: 0;
}
.hwf-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 4px; }
.hwf-socials { display: flex; align-items: center; gap: 10px; }
.hwf-socials a {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 10px;
  background: color-mix(in srgb, var(--hwf-ink) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--hwf-ink) 14%, transparent);
  color: inherit; opacity: 0.8; transition: all .2s cubic-bezier(0.16, 1, 0.3, 1);
}
.hwf-socials a:hover, .hwf-socials a:focus-visible {
  opacity: 1; transform: translateY(-2px);
  color: var(--hwf-warm);
  background: color-mix(in srgb, var(--hwf-warm) 15%, transparent);
  border-color: color-mix(in srgb, var(--hwf-warm) 40%, transparent);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--hwf-warm) 25%, transparent);
}
.hwf-socials a:focus-visible {
  outline: 1px solid var(--hwf-warm); outline-offset: 3px;
}
.hwf-col h3 {
  margin: 0 0 14px; font-family: var(--hwf-mono); font-size: 11px;
  letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700;
  color: color-mix(in srgb, var(--hwf-ink) 90%, white); opacity: 0.7;
}
.hwf-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.hwf-col a, .hwf-up {
  color: var(--hwf-ink); text-decoration: none; opacity: 0.75; background: none; border: 0; padding: 0;
  font-family: var(--hwf-sans); font-size: 13.5px; font-weight: 500; letter-spacing: -0.01em; cursor: pointer;
  transition: all .2s ease; display: inline-block;
}
.hwf-col a:hover, .hwf-up:hover {
  opacity: 1; color: var(--hwf-warm); transform: translateX(3px);
}
.hwf-col a:focus-visible, .hwf-up:focus-visible { outline: 1px solid var(--hwf-warm); outline-offset: 3px; opacity: 1; }
.hwf-rule {
  position: relative; z-index: 10; display: flex; justify-content: space-between;
  align-items: center; gap: 16px;
  margin: clamp(28px, 4vw, 48px) clamp(24px, 4vw, 56px) 0; padding-top: 18px;
  border-top: 1px solid color-mix(in srgb, var(--hwf-ink) 12%, transparent);
  font-family: var(--hwf-mono); font-size: 12px; letter-spacing: 0.08em;
}
.hwf-rule-left { opacity: 0.78; }
.hwf-rule-right { display: flex; align-items: center; gap: 16px; }
.hwf-rule-credit { opacity: 0.72; font-size: 12px; white-space: nowrap; }
.hwf-up {
  font-family: var(--hwf-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;
  font-weight: 600; color: var(--hwf-warm); opacity: 0.85;
}
.hwf-up:hover, .hwf-up:focus-visible { opacity: 1; transform: translateY(-1px); }
.hwf-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.hwf-word {
  position: relative; z-index: 5; display: block; width: 100%; height: var(--hwf-word-h);
  flex-shrink: 0; pointer-events: none;
}

@media (max-width: 860px) {
  .hwf-top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); row-gap: 28px; }
  .hwf-brand { grid-column: 1 / -1; max-width: none; }
}

@media (max-width: 640px) {
  .hwf-rule {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 12px;
  }
  .hwf-rule-left { opacity: 0.78; }
  .hwf-rule-credit { white-space: normal; opacity: 0.72; }
  .hwf-rule-right { flex-direction: column; align-items: flex-start; gap: 10px; }
}
`;

export function HalftoneWordmarkFooter({
  wordmark = 'sugikaran',
  label = 'Sugikaran.dev',
  avatarUrl,
  avatarFallbackUrl,
  avatarLoading = false,
  meta = 'Full Stack Developer',
  description = 'Building responsive web applications and scalable backends with React, Node.js and TypeScript.',
  socials,
  columns = DEFAULT_COLUMNS,
  backToTop = true,
  copyright,
  credit = 'React · TypeScript · Canvas',
  preset = 'night',
  palette,
  dotGap = 6,
  radius = 115,
  sensitivity = 1.6,
  crop = 0.14,
  grain = 0.28,
  interactive = true,
  fontFamily = SANS_STACK,
  fontWeight = 800,
  sansFamily = SANS_STACK,
  monoFamily = MONO_STACK,
  height = '560px',
  className = '',
}: HalftoneWordmarkFooterProps) {
  const colors = React.useMemo(
    () => ({ ...(PRESETS[preset] || PRESETS.night), ...(palette || {}) }),
    [preset, palette]
  );
  const rootRef = React.useRef<HTMLElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const opts = React.useRef({
    colors,
    dotGap,
    radius,
    sensitivity,
    crop,
    grain,
    interactive,
    fontFamily,
    fontWeight,
    wordmark,
  });
  React.useEffect(() => {
    opts.current = {
      colors,
      dotGap,
      radius,
      sensitivity,
      crop,
      grain,
      interactive,
      fontFamily,
      fontWeight,
      wordmark,
    };
  }, [colors, dotGap, radius, sensitivity, crop, grain, interactive, fontFamily, fontWeight, wordmark]);
  const key = [
    wordmark,
    dotGap,
    sensitivity,
    crop,
    grain,
    fontFamily,
    fontWeight,
    colors.background,
    colors.ink,
    colors.warm,
  ].join('|');

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let px = -1e5;
    let py = -1e5;
    let raf = 0;
    let awake = true;
    let ring = { x: 0, y: 0, t: -1 };
    // Flat arrays: x, y, vx, vy, hx, hy, r per dot.
    let dots = new Float32Array(0);
    let count = 0;
    let grainTile: HTMLCanvasElement | null = null;
    const ink = hwfHex(opts.current.colors.ink) || [148, 163, 184];
    const warm = hwfHex(opts.current.colors.warm) || [56, 189, 248];

    const layout = () => {
      const o = opts.current;
      const rect = root.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // Set the word once, at a size that fills the width, on a 1x mask.
      const mask = document.createElement('canvas');
      mask.width = w;
      mask.height = h;
      const m = mask.getContext('2d', { willReadFrequently: true });
      if (!m) return;
      const face = o.fontWeight + ' 100px ' + o.fontFamily;
      m.font = face;
      const word = o.wordmark || ' ';
      const fit = hwfFitSize(m.measureText(word).width, w * 1.02);
      m.font = o.fontWeight + ' ' + fit + 'px ' + o.fontFamily;
      const box = m.measureText(word);
      const cap = box.actualBoundingBoxAscent || fit * 0.72;
      const c = Math.max(0, Math.min(0.6, o.crop));
      m.fillStyle = '#000';
      m.textBaseline = 'alphabetic';
      m.fillText(word, (w - box.width) / 2, h + cap * c);
      const img = m.getImageData(0, 0, w, h).data;

      const gap = Math.max(3, o.dotGap);
      const cols = Math.ceil(w / gap);
      const rows = Math.ceil(h / gap);
      const tmp: number[] = [];
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          // Coverage: average alpha over a 3×3 sample of the cell.
          let sum = 0;
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3));
              const y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3));
              sum += img[(y * w + x) * 4 + 3];
            }
          }
          const cov = sum / (9 * 255);
          if (cov < 0.05) continue;
          const hx = gx * gap + gap / 2;
          const hy = gy * gap + gap / 2;
          tmp.push(hx, hy, 0, 0, hx, hy, hwfRadius(cov, gap));
        }
      }
      dots = new Float32Array(tmp);
      count = tmp.length / 7;

      // Fixed tile of fine print grain
      grainTile = document.createElement('canvas');
      grainTile.width = 256;
      grainTile.height = 256;
      const g = grainTile.getContext('2d');
      if (g) {
        const id = g.createImageData(256, 256);
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255;
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255;
        }
        g.putImageData(id, 0, 0);
      }

      // Set CSS variable for wordmark band height (gap + word height below crop)
      const gap_px = Math.max(28, Math.min(40, w * 0.05)); // 28-40px gap
      const bandH = Math.ceil(cap * (1 - c) + gap_px);
      const minBandH = Math.max(90, Math.min(240, w * 0.2)); // Mobile min 90px, up to 240px
      const finalBandH = Math.max(minBandH, bandH);
      
      // Only update CSS variable if it changed significantly to avoid ResizeObserver loops
      const currentH = parseInt(root.style.getPropertyValue('--hwf-word-h') || '90');
      if (Math.abs(currentH - finalBandH) > 1) {
        root.style.setProperty('--hwf-word-h', finalBandH + 'px');
      }

      awake = true;
    };

    const draw = (now: number) => {
      const o = opts.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = o.colors.background;
      ctx.fillRect(0, 0, w, h);

      // Reduce pointer radius intensity if motion is reduced (but keep hover working at 0.5x)
      const radiusIntensity = reduceMotion ? 0.5 : 1;
      const r = o.interactive ? Math.max(0, o.radius * radiusIntensity) : 0;
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t;
      const ringR = ringAge * 0.95;
      let moving = false;

      for (let i = 0; i < count; i++) {
        const j = i * 7;
        let x = dots[j];
        let y = dots[j + 1];
        let vx = dots[j + 2];
        let vy = dots[j + 3];
        const hx = dots[j + 4];
        const hy = dots[j + 5];

        // Disable shock ring if prefers-reduced-motion, but keep hover displacement gentle
        if (ringAge < 950 && !reduceMotion) {
          const dx = hx - ring.x;
          const dy = hy - ring.y;
          const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const band = 1 - Math.min(1, Math.abs(d - ringR) / 28);
          if (band > 0) {
            const f = band * 3.5 * (1 - ringAge / 950);
            vx += (dx / d) * f;
            vy += (dy / d) * f;
          }
        }

        const s = hwfStep(x, y, vx, vy, hx, hy, px, py, r, o.sensitivity);
        x = s[0];
        y = s[1];
        vx = s[2];
        vy = s[3];

        if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.04) {
          moving = true;
        } else {
          x = hx;
          y = hy;
          vx = 0;
          vy = 0;
        }

        dots[j] = x;
        dots[j + 1] = y;
        dots[j + 2] = vx;
        dots[j + 3] = vy;

        const k = hwfWarmth(x, y, hx, hy, px, py, r, 40);
        let dotR = dots[j + 6];

        if (k > 0.02) {
          // Luminous lens enlargement on active dots
          dotR = dotR * (1 + k * 0.4);
          ctx.fillStyle =
            'rgb(' +
            Math.round(ink[0] + (warm[0] - ink[0]) * k) +
            ',' +
            Math.round(ink[1] + (warm[1] - ink[1]) * k) +
            ',' +
            Math.round(ink[2] + (warm[2] - ink[2]) * k) +
            ')';
        } else {
          ctx.fillStyle = o.colors.ink;
        }

        ctx.beginPath();
        ctx.arc(x, y, dotR, 0, 6.2832);
        ctx.fill();
      }

      if (grainTile && o.grain > 0) {
        ctx.globalAlpha = Math.min(1, o.grain) * 0.08;
        ctx.globalCompositeOperation = 'overlay';
        const pattern = ctx.createPattern(grainTile, 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }

      // Sleep once resting and no pointer pushing
      awake = moving || ringAge < 950;
    };

    const loop = (now: number) => {
      raf = 0;
      draw(now);
      if (awake) raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      awake = true;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    type PointerEv = PointerEvent;
    const toLocal = (e: PointerEv) => {
      const b = canvas.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };

    const onMove = (e: PointerEv) => {
      if (!opts.current.interactive) return;
      const p = toLocal(e);
      px = p[0];
      py = p[1];
      wake();
    };

    const onEnter = (e: PointerEv) => {
      if (!opts.current.interactive) return;
      const p = toLocal(e);
      px = p[0];
      py = p[1];
      wake();
    };

    const onLeave = () => {
      px = -1e5;
      py = -1e5;
      wake();
    };

    const onDown = (e: PointerEv) => {
      if (!opts.current.interactive) return;
      if ((e.target as HTMLElement).closest('a,button')) return;
      const p = toLocal(e);
      ring = { x: p[0], y: p[1], t: performance.now() };
      wake();
    };

    layout();
    draw(performance.now());
    wake();

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerenter', onEnter);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointerdown', onDown);

    const ro = new ResizeObserver(() => {
      layout();
      wake();
    });
    ro.observe(root);

    const io = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting) {
        wake();
      }
    });
    io.observe(root);

    let alive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!alive) return;
        layout();
        wake();
      });
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerenter', onEnter);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerdown', onDown);
    };
  }, [key]);

  const toTop = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTop({ duration: 1.2 });
  };

  const currentYear = new Date().getFullYear();
  const displayCopyright = copyright || `© ${currentYear} ${label}`;

  return (
    <footer
      ref={rootRef}
      className={'hwf-root ' + className}
      style={
        {
          height,
          '--hwf-bg': colors.background,
          '--hwf-ink': colors.ink,
          '--hwf-warm': colors.warm,
          '--hwf-sans': sansFamily,
          '--hwf-mono': monoFamily,
        } as React.CSSProperties
      }
    >
      <style>{HWF_CSS}</style>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="hwf-sr">{wordmark}</span>
      <div className="hwf-top">
        <div className="hwf-brand">
          <div className="hwf-brand-header">
            <div className="hwf-brand-badge">
              {avatarUrl ? (
                <ApiImage
                  src={avatarUrl}
                  fallbackSrc={avatarFallbackUrl}
                  loading={avatarLoading}
                />
              ) : 'S'}
            </div>
            <div className="hwf-brand-text">
              <strong>{label}</strong>
              <span>{meta}</span>
            </div>
          </div>
          {description && <p className="hwf-brand-desc">{description}</p>}
          {socials && socials.length > 0 && (
            <div className="hwf-actions">
              <div className="hwf-socials">
                {socials.map((s) => {
                  const isExternal = /^https?:/i.test(s.href);
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      onClick={s.onClick}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      aria-label={s.label}
                      title={s.label}
                    >
                      {s.icon}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {columns.map((col) => (
          <nav className="hwf-col" key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href || '#'}
                    onClick={l.onClick}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener noreferrer' : undefined}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="hwf-rule">
        <span className="hwf-rule-left">{displayCopyright}</span>
        <div className="hwf-rule-right">
          {credit && <span className="hwf-rule-credit">{credit}</span>}
          {backToTop ? (
            <button type="button" className="hwf-up" onClick={toTop}>
              Back to top ↑
            </button>
          ) : null}
        </div>
      </div>
      <div className="hwf-word" aria-hidden="true" />
    </footer>
  );
}

export default HalftoneWordmarkFooter;
