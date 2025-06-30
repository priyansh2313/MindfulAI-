import EvaluationGraph from '../pages/EvaluationGraph';
import styles from '../styles/EvaluationCard.module.css';

export default function EvaluationCard() {
  const score = localStorage.getItem('evaluationScore');
  const msg = score && parseInt(score) > 10 ? 'High risk. Please reach out for help.' : 'Your mental health looks good.';
  return (
    <div className={styles.card}>
      <h3>Your Evaluation Summary</h3>
      <div className={styles.graphWrapper}>
        <EvaluationGraph />
      </div>
      <p className={styles.message}>{msg}</p>
    </div>
  );
}