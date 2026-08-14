import { useQuery } from '@tanstack/react-query';
import { httpGet } from '../http-client';
import styles from './health-banner.module.css';

interface HealthData {
  status: 'ok' | 'degraded';
  app: 'up';
  cognodb: 'up' | 'down';
}

export function HealthBanner() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: () => httpGet<HealthData>('/api/health'),
    refetchInterval: 30_000,
    retry: 1,
  });

  if (health.isLoading || (health.isSuccess && health.data.cognodb === 'up')) {
    return null;
  }

  const message = health.isError
    ? 'We cannot reach the server. Please try again.'
    : 'We cannot load data right now. Please try again.';

  return (
    <div className={styles.banner} role="status">
      <strong>Connection issue</strong>
      <span>{message}</span>
      <button type="button" onClick={() => void health.refetch()}>
        Retry
      </button>
    </div>
  );
}
