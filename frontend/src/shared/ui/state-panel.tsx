import styles from './state-panel.module.css';
import { Button } from './button';

interface StatePanelProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'muted' | 'danger';
}

export function StatePanel({
  title,
  message,
  actionLabel,
  onAction,
  tone = 'muted',
}: StatePanelProps) {
  return (
    <div className={`${styles.panel} ${styles[tone]}`} role="status">
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && onAction ? (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
