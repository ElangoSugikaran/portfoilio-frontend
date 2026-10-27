import { apiClient } from './api.client';
import type { ApiSettings } from '@/types/api';

export const settingsService = {
  getSettings: async (): Promise<ApiSettings> => {
    const res = await apiClient.get('/settings');
    return res.data.data;
  },
};
