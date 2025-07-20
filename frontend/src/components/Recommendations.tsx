import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Recommendations.module.css';
import { chooseAction, initQTable } from '../utils/reinforcement';

const actionsMap: Record<string, { label: string; path: string }> = {
  music: { label: 'Peaceful Music', path: '/music' },
  quote: { label: 'Journal', path: '/journal' },
  breathing: { label: 'Daily Activities', path: '/daily-activities' },
  journal_prompt: { label: 'Evaluation Test', path: '/evaluation' },
};

export default function Recommendations() {
  const navigate = useNavigate();
  const [rec, setRec] = useState<string | null>(null);

  useEffect(() => {
    const emoji = localStorage.getItem('todayMood') || '';
    const mood = emoji === '😄' || emoji === '🙂' ? 'happy' : emoji === '😐' ? 'neutral' : emoji === '😕' ? 'anxious' : 'sad';
    const table = initQTable();
    setRec(chooseAction(mood, table));
  }, []);

  if (!rec || !actionsMap[rec]) return null;
  const { label, path } = actionsMap[rec];

  return (
    <section className={styles.recommendations}>
      <h3>Recommended for you</h3>
      <div className={styles.card} onClick={() => navigate(path)}>
        <p>{label}</p>
        <button></button>
      </div>
    </section>
  );
}
