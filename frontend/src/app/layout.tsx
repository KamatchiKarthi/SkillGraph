import { NavLink, Outlet } from 'react-router-dom';
import { HealthBanner } from '../shared/ui/health-banner';
import styles from './layout.module.css';

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.topBar}>
          <NavLink to="/" className={styles.brand}>
            SkillGraph
          </NavLink>
          <p className={styles.tagline}>Internal mentor matching</p>
        </div>
        <nav className={styles.nav} aria-label="Primary">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/explore" className={navClass}>
            Directory
          </NavLink>
          <NavLink to="/paths" className={navClass}>
            Connect
          </NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <HealthBanner />
        <Outlet />
      </main>
    </div>
  );
}

function navClass({ isActive }: { isActive: boolean }): string {
  const base = styles.navLink ?? '';
  const active = styles.active ?? '';
  return isActive ? `${base} ${active}` : base;
}
