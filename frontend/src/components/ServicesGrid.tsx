import { Activity, Book, Brain, ClipboardCheck, MessageSquareHeart, Music, Users } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import styles from '../styles/ServicesGrid.module.css';

const services = [
  { title: 'Evaluation Test', desc: 'Take an assessment', icon: <ClipboardCheck />, path: '/evaluation' },
  { title: 'Journal', desc: 'Record your thoughts', icon: <Book />, path: '/journal' },
  { title: 'Community Chat', desc: 'Connect with others', icon: <Users />, path: '/community' },
  { title: 'Peaceful Music', desc: 'Listen to calming sounds', icon: <Music />, path: '/music' },
  { title: 'Mindful Assistant', desc: 'Get AI support', icon: <MessageSquareHeart />, path: '/assistant' },
  { title: 'Encyclopedia', desc: 'Learn about mental health', icon: <Brain />, path: '/encyclopedia' },
  { title: 'Daily Activities', desc: 'Mindfulness exercises', icon: <Activity />, path: '/daily-activities' },
];

export default function ServicesGrid({ onCardHover, onCardLeave }: { onCardHover?: (title: string) => void, onCardLeave?: () => void }) {
  const navigate = useNavigate();
  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>Our Features</h2>
        <div className={styles.subheading}>Explore what Mindful AI offers</div>
        <div className={styles.divider}></div>
      </div>
      <section className={styles.grid}>
        {services.map(s => (
          <div
            key={s.title}
            className={styles.card}
            onClick={() => navigate(s.path)}
            title={s.desc} // Tooltip for accessibility
            style={{ fontSize: '1.25rem' }} // Increase font size
            onMouseEnter={() => onCardHover && onCardHover(s.title)}
            onMouseLeave={() => onCardLeave && onCardLeave()}
          >
            <div className={styles.icon}>{s.icon}</div>
            <h4 style={{ fontSize: '1.3rem' }}>{s.title}</h4>
            <p style={{ fontSize: '1.1rem' }}>{s.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}