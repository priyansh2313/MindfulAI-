import React from 'react';
import EvaluationGraph from '../pages/EvaluationGraph';
// @ts-ignore
import styles from '../styles/EvaluationCard.module.css';


export default function EvaluationCard() {
  const score = localStorage.getItem('evaluationScore');
  const msg = score && parseInt(score) > 10 ? 'High risk. Please reach out for help.' : 'Your mental health looks good.';
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