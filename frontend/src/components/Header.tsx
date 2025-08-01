import { Heart, Leaf, Menu, Shield, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleFindSupportNearby = () => {
    // Open Google Maps with mental health professionals search
    const searchQuery = encodeURIComponent('mental health professionals near me');
    window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
  };

  const handleMyProfile = () => {
    navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerContainer}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <Leaf className={styles.logoLeaf} />
            </div>
            <h1 className={styles.logoTitle}>Mindful AI</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <a href="#" className={styles.navLink}>Home</a>
            <button 
              onClick={() => handleNavigation('/how-it-works')}
              className={styles.navButton}
            >
              How It Works
            </button>
            <a href="#" className={styles.navLink}>Features</a>
            <a href="#" className={styles.navLink}>Contact</a>
          </nav>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button 
              onClick={handleFindSupportNearby}
              className={styles.actionButton}
            >
              <Shield size={16} />
              <span>Find Support Nearby</span>
            </button>
            <button 
              onClick={handleMyProfile}
              className={styles.actionButton}
            >
              <Heart size={16} />
              <span>My Profile</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={styles.mobileMenuButton}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <a href="#" className={styles.mobileNavLink}>Home</a>
            <button 
              onClick={() => handleNavigation('/how-it-works')}
              className={styles.mobileNavButton}
            >
              How It Works
            </button>
            <a href="#" className={styles.mobileNavLink}>Features</a>
            <a href="#" className={styles.mobileNavLink}>Contact</a>
            <div className={styles.mobileActionSection}>
              <button 
                onClick={handleFindSupportNearby}
                className={styles.mobileActionButton}
              >
                <Shield size={20} />
                <span>Find Support Nearby</span>
              </button>
              <button 
                onClick={handleMyProfile}
                className={styles.mobileActionButton}
              >
                <Heart size={20} />
                <span>My Profile</span>
              </button>
              <button className={styles.mobileActionButton}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;