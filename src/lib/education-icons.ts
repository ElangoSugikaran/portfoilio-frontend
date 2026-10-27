import {
  GraduationCap,
  Award,
  BookOpen,
  Code,
  Code2,
  Languages,
  Monitor,
  Palette,
  FileText,
  School,
  Briefcase,
  Laptop,
  Cpu,
  Layers,
  Terminal,
  Globe,
  Sparkles,
  Binary,
  Database,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Code2,
  GraduationCap,
  BookOpen,
  Languages,
  Monitor,
  Palette,
  FileText,
  School,
  Award,
  Briefcase,
  Laptop,
  Cpu,
  Layers,
  Terminal,
  Globe,
  Sparkles,
  Binary,
  Database,
};

/**
 * Resolves a Lucide icon component by name string (from the backend API),
 * with case-insensitive and punctuation-tolerant matching and fallback based on education type.
 */
export function getEducationIcon(iconName?: string | null, type?: string | null): LucideIcon {
  if (iconName) {
    const trimmed = iconName.trim();
    if (ICON_MAP[trimmed]) return ICON_MAP[trimmed];

    // Normalize: remove dashes, underscores, spaces and lowercase
    const normalized = trimmed.toLowerCase().replace(/[-_\s]/g, '');
    const foundKey = Object.keys(ICON_MAP).find(
      (k) => k.toLowerCase().replace(/[-_\s]/g, '') === normalized
    );
    if (foundKey) return ICON_MAP[foundKey];
  }

  const normalizedType = type?.toUpperCase();
  if (normalizedType === 'DEGREE') return GraduationCap;
  if (normalizedType === 'DIPLOMA') return BookOpen;
  if (normalizedType === 'CERTIFICATE') return Award;
  if (normalizedType === 'SCHOOL') return School;
  if (normalizedType === 'TRAINING') return Terminal;
  return GraduationCap;
}

