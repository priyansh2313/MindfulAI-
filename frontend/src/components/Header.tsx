import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';

// Add Google Fonts link to index.html for 'Merriweather' if not already present
// <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel="stylesheet">

const elegantFont = {
  fontFamily: "'Merriweather', Georgia, 'Times New Roman', serif",
  fontSize: '1.2rem',
  fontWeight: 600,
  textDecoration: 'underline',
  margin: '0 1rem',
  background: 'none',
  border: 'none',
  padding: 0,
  color: '#222',
  transition: 'color 0.2s',
};

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>MINDFUL AI</h1>
      <div className={styles.controls}>
        <a
          href="https://www.google.com/maps/search/mental+health+professionals+near+me"
          className={styles.link}
          title="Find Support Nearby"
          style={elegantFont}
        >
          Find Support Nearby
        </a>
        <span
          onClick={() => navigate('/elder-profile')}
          className={styles.link}
          title="My Wellbeing Profile"
          style={{ ...elegantFont, cursor: 'pointer' }}
          tabIndex={0}
          role="button"
        >
          My Wellbeing Profile
        </span>
        <span
          onClick={() => navigate('/')}
          className={styles.link}
          title="Sign Out"
          style={{ ...elegantFont, cursor: 'pointer' }}
          tabIndex={0}
          role="button"
        >
          Sign Out
        </span>
      </div>
    </header>
  );
}