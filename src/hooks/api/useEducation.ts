import { useQuery } from '@tanstack/react-query';
import { educationService } from '@/services/education.service';
import { queryKeys } from '@/lib/query-keys';

export const useEducation = (params?: { showOnHome?: boolean; all?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.education.list(params),
    queryFn: () => educationService.getEducation(params),
  });
};
