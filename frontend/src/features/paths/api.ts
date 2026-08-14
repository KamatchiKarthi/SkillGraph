import { httpGet } from '../../shared/http-client';
import type { PathQueryResult } from '../../shared/types/graph';

export const pathsApi = {
  shortest: (from: string, to: string) =>
    httpGet<PathQueryResult>('/api/paths', { from, to }),
};
