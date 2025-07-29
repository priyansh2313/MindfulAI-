import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';

// Add Google Fonts link to index.html for 'Merriweather' if not already present
// <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel="stylesheet">

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>MINDFUL AI</h1>
      
      {/* Desktop Navigation */}
      <div className={styles.controls}>
        <a
          href="https://www.google.com/maps/search/mental+health+professionals+near+me"
          className={styles.link}
          title="Find Support Nearby"
        >
          Find Support Nearby
        </a>
        <button
          onClick={() => handleNavigation('/profile')}
          className={styles.link}
          title="My Wellbeing Profile"
        >
          My Wellbeing Profile
        </button>
        <button
          onClick={() => handleNavigation('/')}
          className={styles.link}
          title="Sign Out"
        >
          Sign Out
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className={`${styles.menuToggle} ${isMobileMenuOpen ? styles.open : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <button
          onClick={() => handleNavigation('/profile')}
          className={styles.mobileMenuItem}
        >
          My Wellbeing Profile
        </button>
        <a
          href="https://www.google.com/maps/search/mental+health+professionals+near+me"
          className={styles.mobileMenuItem}
          target="_blank"
          rel="noopener noreferrer"
        >
          Find Support Nearby
        </a>
        <button
          onClick={() => handleNavigation('/')}
          className={styles.mobileMenuItem}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;