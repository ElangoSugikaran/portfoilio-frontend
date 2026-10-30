import type { ProjectListParams } from '@/types/api';

/**
 * Centralized Query Key Factory
 * Ensures consistent cache invalidation and prefetching across the entire application.
 */
export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    list: (params?: ProjectListParams) =>
      ['projects', 'list', params] as const,
    detail: (slugOrId: string) => ['projects', 'detail', slugOrId] as const,
  },
  skills: {
    all: ['skills'] as const,
  },
  experience: {
    all: ['experience'] as const,
    detail: (id: string) => ['experience', 'detail', id] as const,
  },
  education: {
    all: ['education'] as const,
    list: (params?: { showOnHome?: boolean; all?: boolean; home?: boolean }) => ['education', 'list', params] as const,
    detail: (id: string) => ['education', 'detail', id] as const,
  },
  certificates: {
    all: ['certificates'] as const,
    list: (params?: { category?: string }) => ['certificates', 'list', params] as const,
    detail: (id: string) => ['certificates', 'detail', id] as const,
  },
  settings: {
    all: ['settings'] as const,
  },
  about: {
    all: ['about'] as const,
  },
} as const;
