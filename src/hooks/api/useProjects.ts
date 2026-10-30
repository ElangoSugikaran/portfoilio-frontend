import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import { queryKeys } from '@/lib/query-keys';
import type { ProjectListParams } from '@/types/api';

export const useProjects = (params?: ProjectListParams) => {
  return useQuery({
    queryKey: queryKeys.projects.list(params),
    queryFn: () => projectService.getProjects(params),
  });
};

export const useProject = (slugOrId?: string) => {
  return useQuery({
    queryKey: queryKeys.projects.detail(slugOrId || ''),
    queryFn: () => (slugOrId ? projectService.getProjectById(slugOrId) : null),
    enabled: !!slugOrId,
  });
};
