import { Link } from 'react-router-dom';
import type { Person } from '../../../shared/types/graph';
import styles from './people-list.module.css';

interface PeopleListProps {
  people: Person[];
}

export function PeopleList({ people }: PeopleListProps) {
  return (
    <ul className={styles.list}>
      {people.map((person) => (
        <li key={person.id} className={styles.item}>
          <Link to={`/people/${person.id}`} className={styles.link}>
            <span className={styles.avatar} aria-hidden="true">
              {initials(person.name)}
            </span>
            <span className={styles.copy}>
              <strong>{person.name}</strong>
              <span className={styles.title}>{person.title}</span>
              <span className={styles.bio}>{person.bio}</span>
            </span>
            <span className={styles.cta}>View profile</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
