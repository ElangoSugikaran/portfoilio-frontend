import { createElement, type ElementType, type ComponentProps } from 'react';
import * as devIcons from '@dev.icons/react';
import { 
  Code2, 
  Layers, 
  Cpu, 
  Database, 
  Lock, 
  Mail, 
  Bot, 
  Globe 
} from 'lucide-react';

// Safely typed lookup dictionary for devIcons
const devIconsLookup = devIcons as unknown as Record<string, ElementType>;

// Specific custom fallbacks for services / tools that are not in devicons
const SPECIAL_ICONS: Record<string, ElementType> = {
  'Shadcn UI': Layers,
  'ShadcnUi': Layers,
  'Zustand': Cpu,
  'zustand': Cpu,
  'TanStack Query': Database,
  'ReactQuery': Database,
  'Clerk': Lock,
  'Resend': Mail,
  'resend': Mail,
  'Vapi.ai': Bot,
  'vapi': Bot,
  'REST API': Globe,
};

export function getTechComponent(techName: string, iconKey?: string | null): ElementType {
  // 1. Check special fallback first
  if (iconKey && SPECIAL_ICONS[iconKey]) return SPECIAL_ICONS[iconKey];
  if (SPECIAL_ICONS[techName]) return SPECIAL_ICONS[techName];

  // 2. Try looking up by iconKey directly in @dev.icons/react
  if (iconKey) {
    if (devIconsLookup[iconKey]) {
      return devIconsLookup[iconKey];
    }
    // Try uppercase first letter
    const capitalized = iconKey.charAt(0).toUpperCase() + iconKey.slice(1);
    if (devIconsLookup[capitalized]) {
      return devIconsLookup[capitalized];
    }
  }

  // 3. Known alias mappings
  const clean = techName.trim().toLowerCase();
  const ALIASES: Record<string, string> = {
    'next.js': 'Nextjs',
    'nextjs': 'Nextjs',
    'react': '_React',
    'react.js': '_React',
    'c#': 'CSharp',
    'csharp': 'CSharp',
    'asp.net mvc': 'Dotnet',
    'dotnet': 'Dotnet',
    '.net': 'Dotnet',
    'tailwind css': 'Tailwind',
    'tailwind': 'Tailwind',
    'html': 'Html5',
    'html5': 'Html5',
    'css': 'Css3',
    'css3': 'Css3',
    'node.js': 'Nodejs',
    'nodejs': 'Nodejs',
    'express.js': 'Express',
    'express': 'Express',
    'pytorch': 'Pytorch',
    'prisma orm': 'Prisma',
    'prisma': 'Prisma',
    'redux toolkit': 'Redux',
    'redux': 'Redux',
    'cloudflare r2': 'Cloudflare',
    'cloudflare': 'Cloudflare',
    'github actions': 'GithubActions',
    'vs code': 'VisualStudioCode',
    'framer motion': 'Framer',
  };

  const aliasKey = ALIASES[clean];
  if (aliasKey && devIconsLookup[aliasKey]) {
    return devIconsLookup[aliasKey];
  }

  // 4. Try normalized alphanumeric name in devIcons
  const stripped = techName.replace(/[^a-zA-Z0-9]/g, '');
  if (devIconsLookup[stripped]) {
    return devIconsLookup[stripped];
  }

  // 5. Fallback
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

