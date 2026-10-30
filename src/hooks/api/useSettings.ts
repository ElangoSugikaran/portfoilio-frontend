import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settings.service';
import { queryKeys } from '@/lib/query-keys';

export const useSettings = () => {
  return useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: () => settingsService.getSettings(),
  });
};
