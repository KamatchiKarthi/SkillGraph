import { useMemo, useState } from 'react';
import type { MentorMatch } from '../../../shared/types/graph';
import { Chip } from '../../../shared/ui/chip';
import { Link } from 'react-router-dom';
import styles from './mentor-list.module.css';

interface MentorListProps {
  mentors: MentorMatch[];
}

export function MentorList({ mentors }: MentorListProps) {
  return (
    <ul className={styles.list}>
      {mentors.map((mentor, index) => (
        <MentorCard key={mentor.person.id} mentor={mentor} rank={index + 1} />
      ))}
    </ul>
  );
}

function MentorCard({ mentor, rank }: { mentor: MentorMatch; rank: number }) {
  const [showAll, setShowAll] = useState(false);
  const sharedNames = useMemo(
    () => mentor.sharedSkills.map((skill) => skill.name),
    [mentor.sharedSkills],
  );
  const visibleSkills = showAll ? sharedNames : sharedNames.slice(0, 3);
  const hiddenCount = sharedNames.length - visibleSkills.length;
  const matchLabel = rank === 1 ? 'Best match' : `${sharedNames.length} shared skills`;

  return (
    <li className={styles.item}>
      <div className={styles.top}>
        <span className={styles.rank}>{rank}</span>
        <div className={styles.copy}>
          <Link to={`/people/${mentor.person.id}`} className={styles.name}>
            {mentor.person.name}
          </Link>
          <p className={styles.title}>{mentor.person.title}</p>
          {mentor.company ? <p className={styles.meta}>{mentor.company.name}</p> : null}
        </div>
        <Chip tone="teal">{matchLabel}</Chip>
      </div>

      <div className={styles.why}>
        <p className={styles.whyLabel}>Why this mentor</p>
        <p className={styles.whyText}>
          Assessed on {sharedNames.length} shared skill
          {sharedNames.length === 1 ? '' : 's'}: {visibleSkills.join(', ')}
          {hiddenCount > 0 ? `, plus ${hiddenCount} more` : ''}.
        </p>
        <div className={styles.chips}>
          {visibleSkills.map((skillName) => (
            <Chip key={skillName} tone="accent">
              {skillName}
            </Chip>
          ))}
        </div>
        {sharedNames.length > 3 ? (
          <button
            type="button"
            className={styles.more}
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? 'Show less' : 'Show all shared skills'}
          </button>
        ) : null}
      </div>

      <div className={styles.actions}>
        <Link to={`/people/${mentor.person.id}`}>View profile</Link>
        <Link to={`/paths?from=${mentor.person.id}`}>How you connect</Link>
      </div>
    </li>
  );
}
