import { apiClient } from './api.client';
import type { ApiSkill } from '@/types/api';

export const skillService = {
  getSkills: async (params?: { all?: boolean }): Promise<ApiSkill[]> => {
    const res = await apiClient.get('/skills', { params });
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    return [];
  },
};
