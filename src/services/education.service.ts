import { apiClient } from './api.client';
import type { ApiEducation } from '@/types/api';

export const educationService = {
  getEducation: async (params?: { showOnHome?: boolean; all?: boolean; home?: boolean }): Promise<ApiEducation[]> => {
    const res = await apiClient.get('/education', { params });
    return res.data.data;
  },
  getEducationById: async (id: string): Promise<ApiEducation> => {
    const res = await apiClient.get(`/education/${id}`);
    return res.data.data;
  },
};
