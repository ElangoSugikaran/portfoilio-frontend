import { apiClient } from './api.client';
import type { ApiAbout } from '@/types/api';

export const aboutService = {
  getAbout: async (): Promise<ApiAbout> => {
    const res = await apiClient.get('/about');
    return res.data.data;
  },
};
