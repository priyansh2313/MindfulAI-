import React, { useState } from 'react';
import styles from '../../styles/Widgets/MoodWidget.module.css';


const emojis = ['😄','🙂','😐','😕','😢'];
export default function MoodWidget() {
  const [mood, setMood] = useState(localStorage.getItem('todayMood') || '');
  const [history] = useState<string[]>(JSON.parse(localStorage.getItem('moodHistory')||'[]'));

  const handle = (e:string) => {
    setMood(e);
    localStorage.setItem('todayMood', e);
    const h = [...history, e].slice(-5);
    localStorage.setItem('moodHistory', JSON.stringify(h));
    window.location.reload();
  };

  return (
    <div className={styles.widget}>
      <h4>Select your current mood</h4>
      <div className={styles.emojis}>
        {emojis.map(e => <button key={e} className={mood===e?styles.active:''} onClick={()=>handle(e)}>{e}</button>)}
      </div>
      <p>Today's Mood: <strong>{mood||'Not set'}</strong></p>
      {history.length>0 && <p>Last Moods: {history.map((m,i)=><span key={i}>{m}</span>)}</p>}
      </div>
    );
  }