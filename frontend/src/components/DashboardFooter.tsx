// src/components/DashboardFooter.tsx
import { Brain, Heart, Sparkles } from "lucide-react";
import React from "react";
import styles from '../styles/DashboardFooter.module.css';

const DashboardFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Main Footer Content */}
        <div className={styles.footerContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.brandHeader}>
              <div className={styles.brandIcon}>
                <Brain className={styles.brandIconInner} />
              </div>
              <div className={styles.brandText}>
                <h3 className={styles.brandTitle}>Mindful</h3>
                <p className={styles.brandSubtitle}>Your path to emotional wellness</p>
              </div>
            </div>
            <p className={styles.brandDescription}>
              Empowering mental wellness through AI-driven personalized care and support. 
              Your journey to emotional wellness begins with a single step, like planting seeds of peace.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.linkSection}>
            <h4 className={styles.linkTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><a href="/dashboard" className={styles.link}>Dashboard</a></li>
              <li><a href="/profile" className={styles.link}>My Profile</a></li>
              <li><a href="/journal" className={styles.link}>Journal</a></li>
              <li><a href="/music" className={styles.link}>Music Therapy</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className={styles.linkSection}>
            <h4 className={styles.linkTitle}>Support</h4>
            <ul className={styles.linkList}>
              <li><a href="/help" className={styles.link}>Help Center</a></li>
              <li><a href="/contact" className={styles.link}>Contact Us</a></li>
              <li><a href="/privacy" className={styles.link}>Privacy Policy</a></li>
              <li><a href="/terms" className={styles.link}>Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={styles.bottomContent}>
            <div className={styles.copyright}>
              © 2024 Mindful. All rights reserved.
            </div>
            
            <div className={styles.developerInfo}>
              <Sparkles className={styles.developerIcon} />
              <span>Developed with</span>
              <Heart className={styles.heartIcon} />
              <span>by Team MindfulAI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
