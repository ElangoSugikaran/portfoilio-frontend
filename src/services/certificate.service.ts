import { apiClient } from './api.client';
import type { ApiCertificate } from '@/types/api';

export const certificateService = {
  getCertificates: async (params?: { category?: string }): Promise<ApiCertificate[]> => {
    const res = await apiClient.get('/certificates', { params });
    return res.data.data;
  },
  getCertificateById: async (id: string): Promise<ApiCertificate> => {
    const res = await apiClient.get(`/certificates/${id}`);
    return res.data.data;
  },
};
