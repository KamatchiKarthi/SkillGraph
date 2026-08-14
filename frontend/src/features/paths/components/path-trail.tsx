import type { GraphPath } from '../../../shared/types/graph';
import styles from './path-trail.module.css';

interface PathTrailProps {
  path: GraphPath;
}

const RELATION_LABELS: Record<string, string> = {
  HAS_SKILL: 'knows skill',
  WORKS_AT: 'works at',
  INTERESTED_IN: 'interested in',
  HIRES_FOR: 'hires for',
  RELATED_TO: 'related to',
};

export function PathTrail({ path }: PathTrailProps) {
  return (
    <ol className={styles.trail} aria-label="Connection steps">
      {path.hops.map((hop, index) => (
        <li key={`${hop.id}-${index}`} className={styles.hop}>
          <div className={styles.node}>
            <span className={styles.type}>{friendlyType(hop.type)}</span>
            <strong>{hop.name}</strong>
            {hop.relationship ? (
              <span className={styles.rel}>
                {RELATION_LABELS[hop.relationship] ?? hop.relationship}
              </span>
            ) : null}
          </div>
          {index < path.hops.length - 1 ? (
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function friendlyType(type: string): string {
  if (type === 'Person') return 'Person';
  if (type === 'Skill') return 'Skill';
  if (type === 'Company') return 'Company';
  if (type === 'Role') return 'Role';
  return type;
}
