import { useQuery } from '@tanstack/react-query';
import { skillService } from '@/services/skill.service';
import { queryKeys } from '@/lib/query-keys';

export const useSkills = (params?: { all?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.skills.all,
    queryFn: () => skillService.getSkills(params),
  });
};
