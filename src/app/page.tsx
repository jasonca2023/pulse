import { NewsFeed } from '@/components/NewsFeed';
import { PulseLogo } from '@/components/PulseLogo';
import styles from './page.module.css';

const today = new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
});

export default function Home() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoRow}>
          <div className={styles.logoLeft}>
            <PulseLogo className={styles.logoMark} />
            <div className={styles.logoText}>
              <span className={styles.logoName}>Pulse</span>
              <span className={styles.logoTagline}>Daily News</span>
            </div>
          </div>
          <div className={styles.logoRight}>
            <span className={styles.dateDisplay}>{today}</span>
            <span>US Edition</span>
          </div>
        </div>
      </header>
      <NewsFeed />
    </main>
  );
}