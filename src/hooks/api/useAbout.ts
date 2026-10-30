import { useQuery } from '@tanstack/react-query';
import { aboutService } from '@/services/about.service';
import { queryKeys } from '@/lib/query-keys';

export const useAbout = () => {
  return useQuery({
    queryKey: queryKeys.about.all,
    queryFn: () => aboutService.getAbout(),
  });
};
