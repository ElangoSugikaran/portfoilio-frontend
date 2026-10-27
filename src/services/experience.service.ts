import { apiClient } from './api.client';
import type { ApiExperience } from '@/types/api';

export const experienceService = {
  getExperience: async (): Promise<ApiExperience[]> => {
    const res = await apiClient.get('/experience');
    return res.data.data;
  },
  getExperienceById: async (id: string): Promise<ApiExperience> => {
    const res = await apiClient.get(`/experience/${id}`);
    return res.data.data;
  },
};
