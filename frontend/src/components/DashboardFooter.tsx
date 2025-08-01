// src/components/DashboardFooter.tsx
import { Brain, Github, Heart, Instagram, Linkedin, Sparkles, Twitter } from "lucide-react";
import React from "react";
import styles from "../styles/DashboardFooter.module.css";

const DashboardFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Main Footer Section */}
        <div className={styles.mainSection}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logoContainer}>
              <Brain className={styles.logoIcon} />
              <h3 className={styles.brandTitle}>Mindful AI</h3>
            </div>
            <p className={styles.brandDescription}>
              Empowering mental wellness through AI-driven personalized care and support.
            </p>
            <div className={styles.socialLinks}>
              <a
                href="https://github.com/your-profile"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                title="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com/your-handle"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                title="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com/your-handle"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com/in/your-profile"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <ul className={styles.linksList}>
              <li><a href="/dashboard" className={styles.footerLink}>Dashboard</a></li>
              <li><a href="/profile" className={styles.footerLink}>My Profile</a></li>
              <li><a href="/journal" className={styles.footerLink}>Journal</a></li>
              <li><a href="/music" className={styles.footerLink}>Music Therapy</a></li>
            </ul>
          </div>

          {/* Features Section */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Features</h4>
            <ul className={styles.linksList}>
              <li><a href="/chat" className={styles.footerLink}>AI Chat Support</a></li>
              <li><a href="/mood-tracking" className={styles.footerLink}>Mood Tracking</a></li>
              <li><a href="/meditation" className={styles.footerLink}>Meditation</a></li>
              <li><a href="/community" className={styles.footerLink}>Community</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Support</h4>
            <ul className={styles.linksList}>
              <li><a href="/help" className={styles.footerLink}>Help Center</a></li>
              <li><a href="/contact" className={styles.footerLink}>Contact Us</a></li>
              <li><a href="/privacy" className={styles.footerLink}>Privacy Policy</a></li>
              <li><a href="/terms" className={styles.footerLink}>Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={styles.bottomContent}>
            <div className={styles.copyright}>
              <p>© 2024 Mindful AI. All rights reserved.</p>
            </div>
            
            <div className={styles.developerCredit}>
              <div className={styles.creditContainer}>
                <Sparkles className={styles.creditIcon} />
                <span className={styles.creditText}>
                  Developed with <Heart className={styles.heartIcon} /> by 
                  <span className={styles.teamName}> Team MindfulAI</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
