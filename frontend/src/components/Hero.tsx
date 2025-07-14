import { useEffect, useState } from 'react';
import styles from '../styles/Hero.module.css';
export default function Hero() {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const s = localStorage.getItem('evaluationScore');
    setScore(s ? parseInt(s) : null);
  }, []);

  return (
    <section className={styles.hero}>
              <div className={styles.accentBlob} />

     
      <div className={styles.greeting}>
        <h2 >Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},</h2>
        <p >Here’s a quick look at your well-being.</p>
      </div>
    </section>
  );
}