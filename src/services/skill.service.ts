import { apiClient } from './api.client';
import type { ApiSkill } from '@/types/api';

export const skillService = {
  getSkills: async (params?: { all?: boolean }): Promise<ApiSkill[]> => {
    const res = await apiClient.get('/skills', { params });
    return res.data.data;
  },
};
