import { useQuery } from '@tanstack/react-query';
import { pathsApi } from './api';

export function useShortestPath(fromId: string, toId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['paths', fromId, toId],
    queryFn: () => pathsApi.shortest(fromId, toId),
    enabled: enabled && fromId.length > 0 && toId.length > 0 && fromId !== toId,
  });
}
