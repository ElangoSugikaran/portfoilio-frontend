import { apiClient } from './api.client';
import type { ApiProject } from '@/types/api';

export const projectService = {
  getProjects: async (params?: { featured?: boolean; status?: string }): Promise<ApiProject[]> => {
    const res = await apiClient.get('/projects', { params });
    return res.data.data;
  },
  getProjectById: async (id: string): Promise<ApiProject> => {
    const res = await apiClient.get(`/projects/${id}`);
    return res.data.data;
  },
};
