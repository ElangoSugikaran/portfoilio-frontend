import { useQuery } from '@tanstack/react-query';
import { certificateService } from '@/services/certificate.service';
import { queryKeys } from '@/lib/query-keys';

export const useCertificates = (params?: { category?: string }) => {
  return useQuery({
    queryKey: queryKeys.certificates.list(params),
    queryFn: () => certificateService.getCertificates(params),
  });
};
