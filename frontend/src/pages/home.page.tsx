import { Link } from 'react-router-dom';
import { Button } from '../shared/ui/button';
import styles from './home.page.module.css';

export function HomePage() {
  return (
    <section className={`page-enter ${styles.page}`}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Internal mentor matching</p>
        <h1 className={styles.brand}>Find a mentor at work</h1>
        <p className={styles.lede}>
          New hires and juniors often do not know who to ask. SkillGraph looks at
          skills people already have, then ranks teammates who share those skills
          as mentor matches.
        </p>
        <div className={styles.actions}>
          <Link to="/explore" className={styles.actionLink}>
            <Button>Open people directory</Button>
          </Link>
          <Link to="/paths" className={styles.actionLink}>
            <Button variant="secondary">See how two people connect</Button>
          </Link>
        </div>
      </div>

      <div className={styles.howBox}>
        <h2>How to use this app</h2>
        <ol className={styles.steps}>
          <li>
            <span className={styles.stepNum}>1</span>
            <div>
              <strong>Open Directory</strong>
              <p>
                Search by name or job title. Pick the employee who needs a mentor
                (for example a junior or a new hire).
              </p>
            </div>
          </li>
          <li>
            <span className={styles.stepNum}>2</span>
            <div>
              <strong>Read their profile</strong>
              <p>
                Skills, company, and roles they want. Related skills are ideas for
                what to learn next — they are not part of the mentor rank.
              </p>
            </div>
          </li>
          <li>
            <span className={styles.stepNum}>3</span>
            <div>
              <strong>Review mentor matches</strong>
              <p>
                Matches are ranked automatically. Rank 1 has the most shared
                skills. Open a mentor, or use Connect to see a warm intro path.
              </p>
            </div>
          </li>
        </ol>
      </div>

      <div className={styles.assessBox}>
        <h2>How mentor matching is assessed</h2>
        <p className={styles.assessLead}>
          Assessment here means skill overlap, not interviews, star ratings, or
          manager reviews. The graph counts how many skills two people both have.
        </p>
        <ul className={styles.assessList}>
          <li>
            <strong>Who can be a mentor</strong>
            Anyone else in the directory who shares at least one skill with the
            person on the profile. A person is never matched to themselves.
          </li>
          <li>
            <strong>How rank is calculated</strong>
            More distinct shared skills means a higher rank. Rank 1 is labeled
            Best match. If two people have the same overlap, names are sorted
            alphabetically.
          </li>
          <li>
            <strong>Why this mentor</strong>
            The card lists the overlapping skill names. That list is the reason
            they appear — not company, title, or how close they sit.
          </li>
          <li>
            <strong>What is not scored</strong>
            Company and role are shown for context only. Related skills and the
            Connect trail are learning and intro tools. They do not change rank.
          </li>
        </ul>
      </div>

      <div className={styles.screens}>
        <h2>What each screen is for</h2>
        <div className={styles.screenGrid}>
          <article className={styles.screenCard}>
            <h3>Directory</h3>
            <p>
              Company people list. Search, then open a profile to start matching.
            </p>
          </article>
          <article className={styles.screenCard}>
            <h3>Profile</h3>
            <p>
              One employee: skills, related skills to learn, and ranked mentors.
            </p>
          </article>
          <article className={styles.screenCard}>
            <h3>Connect</h3>
            <p>
              Shortest workplace link between two people — a map for a warm intro.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
