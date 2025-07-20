import { TrendingUp } from 'lucide-react';
import React from 'react';
import styles from '../styles/LearningSummaryCard.module.css';
import LearningSummary from './LearningSummary';

export default function LearningSummaryCard() {
  return (
    <div className={styles.card}>
      <h3><TrendingUp /> RL Learning Summary</h3>
      <LearningSummary />
    </div>
  );
}