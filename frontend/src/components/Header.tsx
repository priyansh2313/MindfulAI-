import { LogOut, MapPin, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>MINDFUL AI</h1>
      <div className={styles.controls}>
        <a href="https://www.google.com/maps/search/mental+health+professionals+near+me">
          <button className={styles.btn} title="Find Nearby Professionals">
            <MapPin size={20} />
          </button>
        </a>
        <button onClick={() => navigate('/profile')} className={styles.btn} title="My Profile">
          <Smile size={20} />
        </button>
        <button onClick={() => navigate('/')} className={styles.btn} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}