import type { ReactNode } from 'react';
import styles from './chip.module.css';

interface ChipProps {
  children: ReactNode;
  tone?: 'default' | 'accent' | 'teal';
}

export function Chip({ children, tone = 'default' }: ChipProps) {
  return <span className={`${styles.chip} ${styles[tone]}`}>{children}</span>;
}
