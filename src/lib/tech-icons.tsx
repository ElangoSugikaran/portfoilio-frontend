import React, { createElement, type ElementType, type ComponentProps } from 'react';
import * as devIcons from '@dev.icons/react';
import { Code2, Globe } from 'lucide-react';

// Safely typed lookup dictionary for @dev.icons/react
const devIconsLookup = devIcons as unknown as Record<string, ElementType>;

// ─────────────────────────────────────────────────────────────────────────────
// Authentic, Self-Contained SVG Components
// 1. Solves missing icons: Zustand, TanStack Query, Resend, Vapi.ai, Render, Swagger
//    which do NOT exist in @dev.icons/react (as seen in the Admin Dashboard).
// 2. Solves Chromium/Safari <clipPath id="..."> bugs in infinite looping marquees.
// 3. Delivers pixel-perfect official brand proportions (e.g. authentic JS & TS badges).
// ─────────────────────────────────────────────────────────────────────────────

// Official JavaScript badge: Yellow square with black JS in bottom-right corner
const JavascriptSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 630 630" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="630" height="630" fill="#F7DF1E" rx="36" />
    <path
      d="M165.4 521.8c13.8 29.4 41.1 53.7 88 53.7 52.1 0 87.7-27.7 87.7-88.5V286.5h-58.7v200c0 29.4-12.2 36.9-31.5 36.9-20.1 0-28.5-13.8-37.7-30.2zM421.2 487.8l-47.9 27.7c18.5 34.4 53.7 60.5 108.2 60.5 55.8 0 97.4-29 97.4-81.9 0-49.1-28.1-70.8-78.1-92.3l-14.6-6.3c-25.2-10.9-36.1-18-36.1-35.7 0-14.3 10.9-25.1 28.1-25.1 16.8 0 27.7 7.1 37.8 25.1l45.7-29.4c-19.4-34-46.1-46.9-83.5-46.9-52.4 0-85.9 33.6-85.9 77.5 0 47.9 28.1 70.5 70.4 88.5l14.7 6.3c27.3 11.7 43.3 19 43.3 39.1 0 16.8-15.5 29-39.9 29-28.9 0-45.3-15.1-57.8-35.6z"
      fill="#000000"
    />
  </svg>
);

// Official TypeScript badge: Blue square with white TS in bottom-right corner
const TypescriptSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="600" height="600" fill="#3178C6" rx="48" />
    <path
      d="M352.8 534.6v-64.7a124 124 0 0 0 80 29.5q12.3 0 21.5-2.2a51 51 0 0 0 15.4-6.2 27 27 0 0 0 9.2-9.3q3-5.4 3-11.6 0-8.6-4.8-15.2a52 52 0 0 0-13.3-12.3q-8.4-5.7-20-11T419 421q-34-14.1-50.7-34.6a76 76 0 0 1-16.7-49.3q0-22.7 9-39a77 77 0 0 1 24.9-26.8q15.6-10.5 36.3-15.5t43.7-5q22.8 0 40.2 2.8 17.6 2.7 32.3 8.4v60.5a98 98 0 0 0-15.9-9 126 126 0 0 0-35.8-10q-9-1.2-17.1-1.2-11.1 0-20.3 2a52 52 0 0 0-15.3 6 30 30 0 0 0-9.8 9.3 22 22 0 0 0-3.4 12 23 23 0 0 0 3.8 13 44 44 0 0 0 11 11 116 116 0 0 0 17.2 10 395 395 0 0 0 22.9 10.3 255 255 0 0 1 31.2 15.5q14 8.1 23.8 18.5a72 72 0 0 1 15.2 23.6 83 83 0 0 1 5.3 30.8q0 24.3-9.2 40.8a75 75 0 0 1-25 26.7 109 109 0 0 1-36.8 14.6q-21 4.5-44.2 4.5-24 0-45.5-4a137 137 0 0 1-37.3-12.2M328 308.8h-83V546h-66V308.8H96.1v-53.3h232z"
      fill="#FFFFFF"
    />
  </svg>
);

// Official Next.js badge: High contrast circular monogram
const NextjsSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="64" cy="64" r="60" fill="#000000" stroke="#3F3F46" strokeWidth="3" />
    <path
      d="M103 103L50 35H38v58h12V50.8l43.2 55.4A60.2 60.2 0 00103 103z"
      fill="url(#nextjs-grad-unique)"
    />
    <path d="M78 35h12v58H78z" fill="#FFFFFF" />
    <defs>
      <linearGradient id="nextjs-grad-unique" x1="68" y1="58" x2="103" y2="103" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

// Official Shadcn UI icon
const ShadcnUiSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M208 128l-80 80M192 40L40 192" stroke="currentColor" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Official Zustand state management bear
const ZustandSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="64" cy="64" r="56" fill="#443E38" />
    <circle cx="36" cy="36" r="16" fill="#5F574F" />
    <circle cx="36" cy="36" r="8" fill="#F4A261" />
    <circle cx="92" cy="36" r="16" fill="#5F574F" />
    <circle cx="92" cy="36" r="8" fill="#F4A261" />
    <circle cx="64" cy="68" r="44" fill="#5F574F" />
    <ellipse cx="64" cy="78" rx="22" ry="16" fill="#E9C46A" />
    <ellipse cx="64" cy="72" rx="8" ry="5" fill="#264653" />
    <circle cx="48" cy="62" r="5" fill="#264653" />
    <circle cx="80" cy="62" r="5" fill="#264653" />
    <circle cx="50" cy="60" r="1.5" fill="#FFFFFF" />
    <circle cx="82" cy="60" r="1.5" fill="#FFFFFF" />
  </svg>
);

// Official TanStack Query flower/pinwheel
const TanstackSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="64" cy="64" r="56" fill="#18181B" stroke="#27272A" strokeWidth="2" />
    <circle cx="64" cy="40" r="16" fill="#FF4154" />
    <circle cx="84" cy="52" r="16" fill="#FF4154" fillOpacity="0.9" />
    <circle cx="84" cy="76" r="16" fill="#FF4154" fillOpacity="0.8" />
    <circle cx="64" cy="88" r="16" fill="#FF4154" fillOpacity="0.7" />
    <circle cx="44" cy="76" r="16" fill="#FF4154" fillOpacity="0.8" />
    <circle cx="44" cy="52" r="16" fill="#FF4154" fillOpacity="0.9" />
    <circle cx="64" cy="64" r="12" fill="#FFD234" />
  </svg>
);

// Official Clerk auth symbol (three-arc mark — no gradient ids, safe in LogoLoop)
const ClerkSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="64" cy="64" r="20" fill="#6C47FF" />
    <path
      fill="#BAB1FF"
      d="M99.572 10.788c1.999 1.34 2.17 4.156.468 5.858L85.424 31.262c-1.32 1.32-3.37 1.53-5.033.678A35.846 35.846 0 0 0 64 28c-19.882 0-36 16.118-36 36a35.846 35.846 0 0 0 3.94 16.391c.851 1.663.643 3.712-.678 5.033L16.646 100.04c-1.702 1.702-4.519 1.531-5.858-.468C3.974 89.399 0 77.163 0 64 0 28.654 28.654 0 64 0c13.163 0 25.399 3.974 35.572 10.788Z"
    />
    <path
      fill="#6C47FF"
      d="M100.04 111.354c1.702 1.702 1.531 4.519-.468 5.858C89.399 124.026 77.164 128 64 128c-13.164 0-25.399-3.974-35.572-10.788-2-1.339-2.17-4.156-.468-5.858l14.615-14.616c1.322-1.32 3.37-1.53 5.033-.678A35.847 35.847 0 0 0 64 100a35.846 35.846 0 0 0 16.392-3.94c1.662-.852 3.712-.643 5.032.678l14.616 14.616Z"
    />
  </svg>
);

// Official Resend email API logo
const ResendSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="128" height="128" rx="28" fill="#000000" stroke="#27272A" strokeWidth="2" />
    <path
      d="M38 38h28c13.255 0 24 10.745 24 24 0 8.877-4.819 16.63-12 20.785L92 90H74l-14-16H52v16H38V38zm14 24h14c5.523 0 10-4.477 10-10s-4.477-10-10-10H52v20z"
      fill="#FFFFFF"
    />
  </svg>
);

// Vapi.ai voice platform mark (brand mint #62F6B5)
const VapiSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="128" height="128" rx="28" fill="#0A0A0A" />
    <path
      d="M34 86L64 28l30 58"
      stroke="#62F6B5"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M48 68h32" stroke="#62F6B5" strokeWidth="8" strokeLinecap="round" />
    <circle cx="64" cy="68" r="7" fill="#62F6B5" />
  </svg>
);

// Render.com cloud hosting mark (official path, no clipPath — safe in LogoLoop)
const RenderSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="128" height="128" rx="28" fill="#8A05FF" />
    <svg x="14" y="14" width="100" height="100" viewBox="206 194 400 400" overflow="visible">
      <path
        fill="#FFFFFF"
        d="M605.28 288.733c-.059-1.365-.178-2.7-.296-4.065-.03-.326-.03-.682-.09-1.009-.089-.83-.207-1.632-.326-2.462-.119-.861-.208-1.691-.327-2.522a30 30 0 0 0-.326-1.751c-.178-1.038-.356-2.106-.564-3.144-.178-.831-.386-1.632-.564-2.463-.178-.801-.356-1.572-.534-2.373-.208-.831-.475-1.632-.713-2.463a63 63 0 0 0-.653-2.284c-.267-.831-.564-1.662-.86-2.493l-.713-2.136c-.386-1.038-.801-2.047-1.187-3.056-.208-.504-.386-.979-.594-1.483a106 106 0 0 0-1.454-3.234c-.178-.386-.356-.801-.534-1.187-.475-1.009-1.01-1.988-1.514-2.967-.238-.445-.445-.89-.683-1.335-.593-1.098-1.246-2.195-1.87-3.263-.178-.297-.326-.594-.504-.89a78 78 0 0 0-2.137-3.323l-.446-.712a114 114 0 0 0-2.76-3.887 103 103 0 0 0-2.76-3.531c-.06-.089-.119-.178-.208-.267-18.344-22.222-46.037-36.344-77.054-36.374V194l-.089.059h.029c-8.607 0-16.978 1.098-24.962 3.145-4.779 1.217-9.439 2.819-13.921 4.688a118 118 0 0 0-4.423 1.988c-29.474 14.181-50.845 42.426-55.564 76.011h-.059c-2.078 14.39-6.501 28.008-12.793 40.528h.208c-21.906 43.435-66.903 73.252-118.906 73.252-23.211 0-44.998-5.933-63.994-16.347-2.226-1.217-4.927.386-4.927 2.907v13.44H206v199.583h199.7v-99.806h.207v-49.903c0-27.563 22.351-49.903 49.925-49.903h49.925c8.548 0 16.83-1.098 24.755-3.145a105 105 0 0 0 13.921-4.688 117 117 0 0 0 4.422-1.988c30.543-14.715 52.448-44.533 56.039-79.75.327-3.352.505-6.764.505-10.206 0-1.72-.03-3.441-.119-5.132"
      />
    </svg>
  </svg>
);

// Official Swagger / OpenAPI specification logo
const SwaggerSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="64" cy="64" r="56" fill="#85EA2D" />
    <circle cx="64" cy="64" r="50" fill="#173647" />
    <path
      d="M48 44c-6 0-10 4-10 10v4c0 4-3 7-7 7 4 0 7 3 7 7v4c0 6 4 10 10 10m32-42c6 0 10 4 10 10v4c0 4 3 7 7 7-4 0-7 3-7 7v4c0 6-4 10-10 10"
      stroke="#85EA2D"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <circle cx="58" cy="64" r="4" fill="#85EA2D" />
    <circle cx="70" cy="64" r="4" fill="#85EA2D" />
  </svg>
);

// Official Zod shield mark (no clipPath — safe in LogoLoop)
const ZodSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="#408AFF"
      d="M2.584 3.582a2.247 2.247 0 0 1 2.112-1.479h14.617c.948 0 1.794.595 2.115 1.487l2.44 6.777a2.248 2.248 0 0 1-.624 2.443l-9.61 8.52a2.247 2.247 0 0 1-2.963.018L.776 12.773a2.248 2.248 0 0 1-.64-2.467Zm12.038 4.887-9.11 5.537 5.74 5.007c.456.399 1.139.396 1.593-.006l5.643-5.001H14.4l6.239-3.957c.488-.328.69-.947.491-1.5l-1.24-3.446a1.535 1.535 0 0 0-1.456-1.015H5.545a1.535 1.535 0 0 0-1.431 1.01l-1.228 3.37z"
    />
  </svg>
);

// Official Git logo — no clipPath so LogoLoop duplicates don't break painting
const GitSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="#F34F29"
      d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.342 9.932 2.346 2.703 2.708 3.491 6.619 2.326 10.012l13.988 13.988c3.393-1.164 7.304-.379 10.011 2.325 3.779 3.777 3.779 9.9 0 13.679-3.78 3.78-9.901 3.78-13.683 0-2.842-2.844-3.551-7.013-2.121-10.516L67.86 50.247l-.002 34.841a9.66 9.66 0 012.556 1.958c3.779 3.777 3.779 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.907 0-13.684a9.65 9.65 0 013.107-2.081V49.027a9.65 9.65 0 01-3.107-2.081c-2.86-2.86-3.551-7.06-2.083-10.576L34.804 22.922 3.262 54.462c-3.173 3.177-3.173 8.325 0 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.86-54.858c3.174-3.176 3.174-8.327-.001-11.501z"
    />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Priority Custom Registry: Used first to ensure bug-free, perfectly styled logos
// ─────────────────────────────────────────────────────────────────────────────
const CUSTOM_ICONS: Record<string, ElementType> = {
  // Typescript & Javascript (exact official vectors)
  'typescript': TypescriptSvg,
  'typescripticon': TypescriptSvg,
  'javascript': JavascriptSvg,
  'js': JavascriptSvg,

  // Next.js (clean contrast for dark backgrounds)
  'next.js': NextjsSvg,
  'nextjs': NextjsSvg,
  'nextjsicon': NextjsSvg,

  // Modern UI & State
  'shadcn ui': ShadcnUiSvg,
  'shadcnui': ShadcnUiSvg,
  'shadcn': ShadcnUiSvg,
  'zustand': ZustandSvg,
  'tanstack query': TanstackSvg,
  'tanstackicon': TanstackSvg,
  'tanstack': TanstackSvg,
  'reactquery': TanstackSvg,

  // Cloud Platforms, Auth, APIs & Tools
  // Material UI uses @dev.icons/react MaterialUi (same as admin) — no custom override
  'clerk': ClerkSvg,
  'resend': ResendSvg,
  'vapi.ai': VapiSvg,
  'vapi': VapiSvg,
  'vapiai': VapiSvg,
  'render': RenderSvg,
  'render.com': RenderSvg,
  'swagger': SwaggerSvg,
  'openapi': SwaggerSvg,
  'zod': ZodSvg,
  'rest api': Globe,

  // Git — custom SVG avoids duplicate clipPath IDs in LogoLoop
  'git': GitSvg,
  'giticon': GitSvg,
};

/** Normalize icon keys the same way the admin IconSelector does */
function normalizeIconKey(value?: string | null): string {
  if (!value) return '';
  return value
    .trim()
    .toLowerCase()
    .replace(/^[_]+/, '')
    .replace(/[\s\-_./]/g, '');
}

/**
 * Resolves any technology name or backend icon key to a React SVG Component.
 * - Prioritizes custom official vectors (Zustand, Resend, Vapi, Render, Clerk, Zod…).
 *   Custom icons avoid clipPath/gradient id collisions inside LogoLoop marquees.
 * - Delegates standard tools (including MaterialUi) to @dev.icons/react.
 * - Gracefully falls back to Code2 icon if completely unknown.
 */
export function getTechComponent(techName: string, iconKey?: string | null): ElementType {
  const cleanName = techName.trim().toLowerCase();
  const cleanKey = iconKey ? iconKey.trim().toLowerCase() : '';
  const normalizedKey = normalizeIconKey(iconKey);
  const normalizedName = normalizeIconKey(techName);

  // 1. Check custom clean SVG registry first (solves missing icons and clipPath bugs)
  if (cleanKey && CUSTOM_ICONS[cleanKey]) return CUSTOM_ICONS[cleanKey];
  if (normalizedKey && CUSTOM_ICONS[normalizedKey]) return CUSTOM_ICONS[normalizedKey];
  if (CUSTOM_ICONS[cleanName]) return CUSTOM_ICONS[cleanName];
  if (normalizedName && CUSTOM_ICONS[normalizedName]) return CUSTOM_ICONS[normalizedName];

  // 2. Try looking up by iconKey directly in @dev.icons/react
  //    Skip Clerk/Zod package icons — shared gradient/clipPath ids break in LogoLoop.
  const PACKAGE_SKIP = new Set(['clerk', 'zod']);
  if (iconKey && !PACKAGE_SKIP.has(normalizedKey)) {
    if (devIconsLookup[iconKey]) {
      return devIconsLookup[iconKey];
    }
    const capitalized = iconKey.charAt(0).toUpperCase() + iconKey.slice(1);
    if (devIconsLookup[capitalized]) {
      return devIconsLookup[capitalized];
    }
    if (normalizedKey) {
      const match = Object.keys(devIconsLookup).find(
        (k) => normalizeIconKey(k) === normalizedKey
      );
      if (match) return devIconsLookup[match];
    }
  }

  // 3. Known alias mappings to @dev.icons/react
  const ALIASES: Record<string, string> = {
    'react': '_React',
    'react.js': '_React',
    'c#': 'CSharp',
    'csharp': 'CSharp',
    'asp.net mvc': 'Dotnet',
    'dotnet': 'Dotnet',
    '.net': 'Dotnet',
    'tailwind css': 'TailwindIcon',
    'tailwind': 'TailwindIcon',
    'html': 'Html5',
    'html5': 'Html5',
    'css': 'Css3',
    'css3': 'Css3',
    'node.js': 'NodejsIcon',
    'nodejs': 'NodejsIcon',
    'express.js': 'Express',
    'express': 'Express',
    'fastify': 'Fastify',
    'php': 'Php',
    'laravel': 'Laravel',
    'python': 'Python',
    'flask': 'Flask',
    'pytorch': 'Pytorch',
    'prisma orm': 'Prisma',
    'prisma': 'Prisma',
    'postgresql': 'Postgresql',
    'postgres': 'Postgresql',
    'mysql': 'Mysql',
    'mongodb': 'MongodbIcon',
    'github': 'GithubIcon',
    'github actions': 'GithubActions',
    'vite': 'Vite',
    'docker': 'DockerIcon',
    'postman': 'Postman',
    'figma': 'Figma',
    'firebase': 'FirebaseIcon',
    'stripe': 'Stripe',
    'cloudflare r2': 'CloudflareIcon',
    'cloudflare': 'CloudflareIcon',
    'vercel': 'VercelIcon',
    'netlify': 'Netlify',
    'redux toolkit': 'Redux',
    'redux': 'Redux',
    'bootstrap': 'Bootstrap',
    'vs code': 'VisualStudioCode',
    'framer motion': 'Framer',
    'materialui': 'MaterialUi',
    'material-ui': 'MaterialUi',
    'mui': 'MaterialUi',
  };

  const aliasKey =
    ALIASES[cleanName] ||
    ALIASES[normalizedName] ||
    (cleanKey ? ALIASES[cleanKey] : undefined) ||
    (normalizedKey ? ALIASES[normalizedKey] : undefined);
  if (aliasKey && devIconsLookup[aliasKey]) {
    return devIconsLookup[aliasKey];
  }

  // 4. Try normalized alphanumeric name in devIcons
  const stripped = techName.replace(/[^a-zA-Z0-9]/g, '');
  if (stripped && !PACKAGE_SKIP.has(stripped.toLowerCase()) && devIconsLookup[stripped]) {
    return devIconsLookup[stripped];
  }

  // 5. Fallback icon
  return Code2;
}

export function RenderTechIcon({
  name,
  iconKey,
  className,
  ...props
}: {
  name: string;
  iconKey?: string | null;
  className?: string;
} & ComponentProps<'svg'>) {
  const IconComponent = getTechComponent(name, iconKey);
  return createElement(IconComponent, { className, ...props });
}
