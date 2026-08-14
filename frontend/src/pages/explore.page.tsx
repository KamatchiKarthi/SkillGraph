import { useState } from 'react';
import { usePeopleSearch } from '../features/people/hooks';
import { PeopleList } from '../features/people/components/people-list';
import { useDebouncedValue } from '../shared/hooks/use-debounced-value';
import { LoadingState, StatePanel } from '../shared/ui/state-panel';
import styles from './explore.page.module.css';

export function ExplorePage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 280);
  const search = usePeopleSearch(debouncedQuery, { enabled: true });

  return (
    <section className={`page-enter ${styles.page}`}>
      <header className={styles.header}>
        <h1>People directory</h1>
        <p>
          Search by name or job title, then open a profile. Mentor matches on that
          profile are ranked by how many skills they share — more overlap ranks
          higher.
        </p>
      </header>

      <div className={styles.searchPanel}>
        <label htmlFor="people-search" className={styles.label}>
          Search people
        </label>
        <input
          id="people-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name or job title"
          autoComplete="off"
        />
        {query ? (
          <button type="button" className={styles.clear} onClick={() => setQuery('')}>
            Clear
          </button>
        ) : null}
        <p className={styles.count} aria-live="polite">
          {search.isFetching
            ? 'Searching…'
            : `${search.data?.length ?? 0} people`}
        </p>
      </div>

      {search.isLoading ? <LoadingState label="Loading directory…" /> : null}

      {search.isError ? (
        <StatePanel
          tone="danger"
          title="Could not load people"
          message={search.error instanceof Error ? search.error.message : 'Please try again.'}
          actionLabel="Retry"
          onAction={() => {
            void search.refetch();
          }}
        />
      ) : null}

      {search.isSuccess && search.data.length === 0 ? (
        <StatePanel
          title="No people found"
          message="Try another name, or clear search to see the full directory."
          actionLabel="Show all"
          onAction={() => setQuery('')}
        />
      ) : null}

      {search.isSuccess && search.data.length > 0 ? (
        <PeopleList people={search.data} />
      ) : null}
    </section>
  );
}
