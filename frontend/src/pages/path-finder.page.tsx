import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePeopleSearch } from '../features/people/hooks';
import { useShortestPath } from '../features/paths/hooks';
import { PathTrail } from '../features/paths/components/path-trail';
import { Button } from '../shared/ui/button';
import { LoadingState, StatePanel } from '../shared/ui/state-panel';
import styles from './path-finder.page.module.css';

export function PathFinderPage() {
  const [searchParams] = useSearchParams();
  const directory = usePeopleSearch('');
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [run, setRun] = useState(false);

  useEffect(() => {
    const fromParam = searchParams.get('from');
    if (fromParam) {
      setFromId(fromParam);
    }
  }, [searchParams]);

  const people = useMemo(() => directory.data ?? [], [directory.data]);
  const pathQuery = useShortestPath(fromId, toId, run);
  const fromName = people.find((person) => person.id === fromId)?.name ?? 'First person';
  const toName = people.find((person) => person.id === toId)?.name ?? 'Second person';

  return (
    <section className={`page-enter ${styles.page}`}>
      <header className={styles.header}>
        <h1>How you&apos;re connected</h1>
        <p>
          Pick two employees to see the shortest workplace link (shared skill,
          same company, or related skill). This is a warm-intro map, not a mentor
          quality score. Mentor rank still comes from shared skills on a profile.
        </p>
      </header>

      {directory.isLoading ? <LoadingState label="Loading people…" /> : null}

      {directory.isError ? (
        <StatePanel
          tone="danger"
          title="Could not load people"
          message={
            directory.error instanceof Error
              ? directory.error.message
              : 'Please try again.'
          }
          actionLabel="Retry"
          onAction={() => {
            void directory.refetch();
          }}
        />
      ) : null}

      {directory.isSuccess ? (
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            setRun(true);
          }}
        >
          <label className={styles.field}>
            <span>Employee</span>
            <select
              value={fromId}
              onChange={(event) => {
                setFromId(event.target.value);
                setRun(false);
              }}
            >
              <option value="">Select a person</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={styles.swap}
            onClick={() => {
              setFromId(toId);
              setToId(fromId);
              setRun(false);
            }}
            disabled={!fromId && !toId}
          >
            Swap
          </button>

          <label className={styles.field}>
            <span>Other employee</span>
            <select
              value={toId}
              onChange={(event) => {
                setToId(event.target.value);
                setRun(false);
              }}
            >
              <option value="">Select a person</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>

          <Button type="submit" disabled={!fromId || !toId || fromId === toId}>
            Show how they connect
          </Button>
        </form>
      ) : null}

      {!run && directory.isSuccess ? (
        <StatePanel
          title="Pick two teammates"
          message="Use this when you want a warm intro, not a cold message."
        />
      ) : null}

      {run && pathQuery.isLoading ? (
        <LoadingState label="Finding connection…" />
      ) : null}

      {run && pathQuery.isError ? (
        <StatePanel
          tone="danger"
          title="No connection found"
          message="These two people are not linked through skills, company, or role yet."
          actionLabel="Retry"
          onAction={() => {
            void pathQuery.refetch();
          }}
        />
      ) : null}

      {run && pathQuery.isSuccess ? (
        <div className={styles.result}>
          <h2>
            {fromName} and {toName}
          </h2>
          <p className={styles.meta}>
            Connected in {pathQuery.data.path.length} step
            {pathQuery.data.path.length === 1 ? '' : 's'}
          </p>
          <PathTrail path={pathQuery.data.path} />
        </div>
      ) : null}
    </section>
  );
}
