import { Brain, Heart, Shield, Sparkles, Target, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';

// Add Google Fonts link to index.html for 'Merriweather' if not already present
// <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel="stylesheet">

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, life: number}>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 80; // Header height

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;

        if (particle.life > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(127, 142, 252, ${particle.life * 0.6})`;
          ctx.fill();
        } else {
          particles.splice(index, 1);
        }
      });

      // Add new particles
      if (particles.length < 15) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          life: 1
        });
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [particles]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      {/* Animated Background Canvas */}
      <canvas ref={canvasRef} className={styles.backgroundCanvas} />
      
      {/* Floating Icons */}
      <div className={styles.floatingIcons}>
        <div className={styles.floatingIcon} style={{ animationDelay: '0s' }}>
          <Sparkles size={16} />
        </div>
        <div className={styles.floatingIcon} style={{ animationDelay: '2s' }}>
          <Zap size={16} />
        </div>
        <div className={styles.floatingIcon} style={{ animationDelay: '4s' }}>
          <Brain size={16} />
        </div>
      </div>

      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <Brain className={styles.logoBrain} />
            <div className={styles.logoGlow}></div>
          </div>
          <div className={styles.logoTextContainer}>
            <h1 className={styles.logo}>MINDFUL AI</h1>
            <span className={styles.logoTagline}>Mental Wellness Revolution</span>
          </div>
        </div>
      </div>
      
      {/* Desktop Navigation */}
      <div className={styles.controls}>
        <a
          href="https://www.google.com/maps/search/mental+health+professionals+near+me"
          className={styles.link}
          title="Find Support Nearby"
        >
          <Shield size={16} />
          <span>Find Support Nearby</span>
        </a>
        <button
          onClick={() => handleNavigation('/profile')}
          className={styles.link}
          title="My Wellbeing Profile"
        >
          <Heart size={16} />
          <span>My Wellbeing Profile</span>
        </button>
        <button
          onClick={() => handleNavigation('/')}
          className={styles.link}
          title="Sign Out"
        >
          <Target size={16} />
          <span>Sign Out</span>
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
          <Heart size={18} />
          <span>My Wellbeing Profile</span>
        </button>
        <a
          href="https://www.google.com/maps/search/mental+health+professionals+near+me"
          className={styles.mobileMenuItem}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Shield size={18} />
          <span>Find Support Nearby</span>
        </a>
        <button
          onClick={() => handleNavigation('/')}
          className={styles.mobileMenuItem}
        >
          <Target size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;