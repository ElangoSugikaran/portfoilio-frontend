import { apiClient } from './api.client';
import type { ApiProject, ApiProjectList, ProjectListParams } from '@/types/api';

export const projectService = {
  getProjects: async (params?: ProjectListParams): Promise<ApiProjectList> => {
    const res = await apiClient.get('/projects', { params });
    return {
      projects: res.data.data,
      pagination: res.data.meta?.pagination,
      filters: res.data.meta?.filters,
    };
  },
  getProjectById: async (id: string): Promise<ApiProject> => {
    const res = await apiClient.get(`/projects/${id}`);
    return res.data.data;
  },
};
