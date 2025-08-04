import React, { useEffect, useState } from 'react';
import axios from '../hooks/axios/axios';
import EvaluationGraph from '../pages/EvaluationGraph';
// @ts-ignore
import styles from '../styles/EvaluationCard.module.css';

export default function EvaluationCard() {
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

  const msg = score && score > 10 ? 'High risk. Please reach out for help.' : 'Your mental health looks good.';
  
  return (
    <div className={styles.card} title="This shows your latest evaluation summary" style={{ fontSize: '1.2rem' }}>
      <h3 style={{ fontSize: '1.5rem' }}>Your Evaluation Summary</h3>
      <div className={styles.graphWrapper}>
        <EvaluationGraph />
      </div>
      <p className={styles.message} style={{ fontSize: '1.1rem' }}>{msg}</p>
    </div>
  );
}