import { useQuery } from '@tanstack/react-query';
import { experienceService } from '@/services/experience.service';
import { queryKeys } from '@/lib/query-keys';

export const useExperience = () => {
  return useQuery({
    queryKey: queryKeys.experience.all,
    queryFn: () => experienceService.getExperience(),
  });
};
