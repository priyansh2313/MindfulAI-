import { useEffect, useState } from 'react';
import styles from '../../styles/Widgets/ProgressWidget.module.css';

export default function ProgressWidget() {
  const [progress,set] = useState(0);
  useEffect(()=>{
    let v=0; const i=setInterval(()=>{v++; if(v<=70)set(v); else clearInterval(i)},20);
  },[]);
  return (
    <div className={styles.widget}>
      <h4>Daily Progress</h4>
      <div className={styles.circle}>
        <svg viewBox="0 0 36 36">
          <path className={styles.bg} d="M18 2.08a15.92 15.92 0 0 1 0 31.84 a15.92 15.92 0 0 1 0-31.84" />
          <path className={styles.fill} strokeDasharray={`${progress},100`} d="M18 2.08a15.92 15.92 0 0 1 0 31.84 a15.92 15.92 0 0 1 0-31.84" />
        </svg>
        <span className={styles.label}>{progress}%</span>
      </div>
      <p>You're doing great! Keep it up 💪</p>
    </div>
  );
}
