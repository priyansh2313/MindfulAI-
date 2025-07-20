import { Lightbulb } from 'lucide-react';
import React, { useState } from 'react';
import styles from '../../styles/Widgets/TipWidget.module.css';


const tips = [
  'Take a 10-minute walk to clear your mind.',
  'Practice deep breathing for 2 minutes.',
  'Journal your thoughts before bed.',
  'Drink a full glass of water to reset.',
  'Check in with a friend today.',
];
export default function TipWidget() {
  const [tip, setTip] = useState(tips[Math.floor(Math.random()*tips.length)]);
  return (
    <div className={styles.widget}>
      <h4 className={styles.tipH4}><Lightbulb/> Mental Health Tip</h4>
      <p className={styles.tip}>{tip}</p>
      <button onClick={()=>{let t=tip;while(t===tip) t=tips[Math.floor(Math.random()*tips.length)];setTip(t);}} className={styles.btn}>Refresh Tip</button>
    </div>
  );
}