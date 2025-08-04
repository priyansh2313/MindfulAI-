import React, { useEffect, useState } from 'react';
import axios from '../../hooks/axios/axios';
import styles from '../../styles/elder/hero.module.css';

export default function Hero() {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First try to get from localStorage (for immediate display)
    const localScore = localStorage.getItem('evaluationScore');
    if (localScore) {
      setScore(parseInt(localScore));
    }

    // Then fetch from server to get the most up-to-date data
    axios.get('/test', { withCredentials: true })
      .then(({ data }: any) => {
        if (data.testResults && data.testResults.length > 0) {
          // Get the most recent score
          const latestScore = data.testResults[data.testResults.length - 1].score;
          setScore(latestScore);
          // Update localStorage with the latest score
          localStorage.setItem('evaluationScore', latestScore.toString());
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching evaluation data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroGrid}>
          {/* Left Side - Main Content */}
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Find Your Inner Peace in a Busy World
            </h1>
            <p className={styles.heroSubtitle}>
              Your journey to emotional wellness begins with a single step. Discover a calmer, more balanced you through our guided mindfulness practices.
            </p>
            <div className={styles.heroButtons}>
              
              
            </div>
          </div>

          {/* Right Side - Wellness Score (if available) */}
          {score !== null && (
            <div className={styles.scoreContainer}>
              <div className={styles.scoreCard}>
                <div className={styles.scoreContent}>
                  <div className={styles.scoreCircle}>
                    <span className={styles.scoreNumber}>{score}</span>
                  </div>
                  <h3 className={styles.scoreTitle}>Your Wellness Score</h3>
                  <p className={styles.scoreDescription}>
                    {score >= 80 ? 'Excellent - You\'re flourishing!' : 
                     score >= 60 ? 'Good - Keep growing!' : 
                     score >= 40 ? 'Fair - Every step counts.' : 'Let\'s nurture your wellness together.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}