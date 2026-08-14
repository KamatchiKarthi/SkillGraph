import { Link, useParams } from 'react-router-dom';
import { useMentors, usePerson, useRelatedSkills } from '../features/people/hooks';
import { MentorList } from '../features/mentors/components/mentor-list';
import { Chip } from '../shared/ui/chip';
import { Button } from '../shared/ui/button';
import { LoadingState, StatePanel } from '../shared/ui/state-panel';
import styles from './person.page.module.css';

export function PersonPage() {
  const { id = '' } = useParams();
  const personQuery = usePerson(id);
  const relatedQuery = useRelatedSkills(id, Boolean(personQuery.data));
  const mentorsQuery = useMentors(id, Boolean(personQuery.data));

  if (personQuery.isLoading) {
    return <LoadingState label="Loading profile…" />;
  }

  if (personQuery.isError) {
    return (
      <StatePanel
        tone="danger"
        title="Could not open profile"
        message={
          personQuery.error instanceof Error
            ? personQuery.error.message
            : 'Please try again.'
        }
        actionLabel="Retry"
        onAction={() => {
          void personQuery.refetch();
        }}
      />
    );
  }

  if (!personQuery.data) {
    return (
      <StatePanel
        title="Person not found"
        message="This profile is not in the directory."
        actionLabel="Back to directory"
        onAction={() => {
          window.location.href = '/explore';
        }}
      />
    );
  }

  const person = personQuery.data;

  return (
    <section className={`page-enter ${styles.page}`}>
      <Link to="/explore" className={styles.back}>
        ← Back to directory
      </Link>

      <header className={styles.hero}>
        <div className={styles.avatar} aria-hidden="true">
          {initials(person.name)}
        </div>
        <div className={styles.heroCopy}>
          <h1>{person.name}</h1>
          <p className={styles.title}>{person.title}</p>
          <p className={styles.bio}>{person.bio}</p>
          {person.company ? (
            <p className={styles.company}>
              Works at <strong>{person.company.name}</strong>
            </p>
          ) : null}
        </div>
      </header>

      <div className={styles.actions}>
        <a href="#mentors" className={styles.fullButton}>
          <Button>See mentor matches</Button>
        </a>
        <Link to={`/paths?from=${person.id}`} className={styles.fullButton}>
          <Button variant="secondary">How they connect to someone</Button>
        </Link>
      </div>

      <div className={styles.section}>
        <h2>Skills</h2>
        <p className={styles.hint}>What they can teach or already practice.</p>
        <div className={styles.chips}>
          {person.skills.map((skill) => (
            <Chip key={skill.id} tone="teal">
              {skill.name}
            </Chip>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Good next skills to learn</h2>
        <p className={styles.hint}>Related to skills they already have.</p>
        {relatedQuery.isLoading ? <LoadingState label="Loading related skills…" /> : null}
        {relatedQuery.isError ? (
          <StatePanel
            tone="danger"
            title="Could not load related skills"
            message={
              relatedQuery.error instanceof Error
                ? relatedQuery.error.message
                : 'Please try again.'
            }
            actionLabel="Retry"
            onAction={() => {
              void relatedQuery.refetch();
            }}
          />
        ) : null}
        {relatedQuery.isSuccess && relatedQuery.data.skills.length === 0 ? (
          <p className={styles.empty}>No related skills yet.</p>
        ) : null}
        {relatedQuery.isSuccess && relatedQuery.data.skills.length > 0 ? (
          <div className={styles.chips}>
            {relatedQuery.data.skills.map((item) => (
              <Chip key={`${item.skill.id}-${item.via}`} tone="accent">
                {item.skill.name}
              </Chip>
            ))}
          </div>
        ) : null}
      </div>

      <div className={styles.section}>
        <h2>Roles they want</h2>
        <div className={styles.chips}>
          {person.roles.length === 0 ? (
            <p className={styles.empty}>No target roles listed.</p>
          ) : (
            person.roles.map((role) => (
              <Chip key={role.id} tone="accent">
                {role.name}
              </Chip>
            ))
          )}
        </div>
      </div>

      <div className={styles.section} id="mentors">
        <h2>Mentor matches</h2>
        <p className={styles.hint}>
          Assessed by skill overlap with {person.name}. Rank 1 shares the most
          skills. Company and title are context only — they do not change rank.
        </p>

        {mentorsQuery.isLoading ? (
          <LoadingState label="Finding mentors…" />
        ) : null}

        {mentorsQuery.isError ? (
          <StatePanel
            tone="danger"
            title="Could not find mentors"
            message={
              mentorsQuery.error instanceof Error
                ? mentorsQuery.error.message
                : 'Please try again.'
            }
            actionLabel="Retry"
            onAction={() => {
              void mentorsQuery.refetch();
            }}
          />
        ) : null}

        {mentorsQuery.isSuccess && mentorsQuery.data.matches.length === 0 ? (
          <StatePanel
            title="No mentors yet"
            message="Nobody else in the directory shares these skills."
          />
        ) : null}

        {mentorsQuery.isSuccess && mentorsQuery.data.matches.length > 0 ? (
          <>
            <p className={styles.resultMeta}>
              {mentorsQuery.data.matches.length} mentor
              {mentorsQuery.data.matches.length === 1 ? '' : 's'}
            </p>
            <MentorList mentors={mentorsQuery.data.matches} />
          </>
        ) : null}
      </div>
    </section>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
