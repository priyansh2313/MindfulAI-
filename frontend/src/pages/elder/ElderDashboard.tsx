import { AlertCircle, Brain, Flower2, Heart, Leaf, Sparkles, Sun, TreePine } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../../components/elder/header';
import Hero from '../../components/elder/hero';
import ServicesGrid from '../../components/elder/servicesGrid';
import Recommendations from '../../components/Recommendations';
import WellnessActivitiesSummary from '../../components/Widgets/WellnessActivitiesSummary';
import styles from '../../styles/elder/dashboard.module.css';
import FloatingChatbot from '../FloatingChatbot';
import FloatingLeaves from '../FloatingLeaves';

export default function Dashboard() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showCaseHistoryAlert, setShowCaseHistoryAlert] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={styles.container}>
      {showCaseHistoryAlert && (
        <div style={{
          position: "relative",
          background: "#f0fff4",
          color: "#17803c",
          padding: "18px 32px",
          borderRadius: "13px",
          border: "1.5px solid #82d8a5",
          display: "flex",
          alignItems: "center",
          gap: "1.2rem",
          marginBottom: "32px",
          marginTop: "16px",
          fontWeight: 500,
          fontSize: "1.15rem",
          boxShadow: "0 2px 10px 0 #b0f2ce4b",
          zIndex: 100
        }}>
          <AlertCircle style={{ marginRight: 12, color: "#17803c" }} />
          <span>
            <b>Action Required:</b> The <b>Case History</b> form must be filled by the <b>guardian</b> of the elder for complete medical safety and personalized care.
          </span>
          <button
            style={{
              marginLeft: "auto",
              background: "#15bb6f",
              color: "#fff",
              border: "none",
              borderRadius: "7px",
              padding: "8px 22px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 15,
              transition: "background 0.18s"
            }}
            onClick={() => navigate("/profile")}
          >
            Fill Now
          </button>
          <button
            style={{
              marginLeft: "12px",
              background: "#fff",
              color: "#17803c",
              border: "1.5px solid #a8f2c9",
              borderRadius: "7px",
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 14,
              transition: "background 0.18s"
            }}
            onClick={() => setShowCaseHistoryAlert(false)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className={styles.backgroundPattern}></div>
      <div className={`${styles.floatingElement} ${styles.leaf}`}>
        <Leaf className={styles.floatingIcon} />
      </div>
      <div className={`${styles.floatingElement} ${styles.flower}`}>
        <Flower2 className={styles.floatingIcon} />
      </div>
      <div className={`${styles.floatingElement} ${styles.tree}`}>
        <TreePine className={styles.floatingIcon} />
      </div>
      <FloatingLeaves />
      <Header />
      <Hero />

      <section className={styles.servicesSection}>
        <ServicesGrid
          onCardHover={setHoveredService}
          onCardLeave={() => setHoveredService(null)}
        />
      </section>

      <div className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.heroCard}>
            <div className={styles.heroBackground}></div>
            <div className={styles.heroCircle1}></div>
            <div className={styles.heroCircle2}></div>
            <div className={styles.heroContent}>
              <div className={styles.heroIconContainer}>
                <div className={styles.heroIcon}>
                  <Heart className={styles.heroHeart} />
                </div>
              </div>
              <h1 className={styles.heroTitle}>Find Your Inner Peace</h1>
              <p className={styles.heroSubtitle}>
                Your journey to emotional wellness begins with a single step. Discover a calmer, more balanced you through our guided mindfulness practices.
              </p>
              <div className={styles.heroButtons}>
                <button className={styles.primaryButton}>
                  <Sparkles className={styles.buttonIcon} />
                  Get Started
                </button>
                <button className={styles.secondaryButton}>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.thriveSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              How We Help You Thrive
            </h2>
            <p className={styles.sectionSubtitle}>
              Our holistic approach to emotional wellness combines modern techniques with ancient wisdom,
              creating a nurturing environment for your mental health journey.
            </p>
          </div>
          <div className={styles.thriveGrid}>
            <div className={styles.thriveCard}>
              <div className={styles.thriveIcon}>
                <Sun className={styles.thriveIconInner} />
              </div>
              <h3 className={styles.thriveCardTitle}>Mindfulness Practices</h3>
              <p className={styles.thriveCardText}>
                Guided meditation and breathing exercises to help you stay present and reduce anxiety.
                Connect with your inner self through nature-inspired practices.
              </p>
            </div>
            <div className={styles.thriveCard}>
              <div className={styles.thriveIcon}>
                <Brain className={styles.thriveIconInner} />
              </div>
              <h3 className={styles.thriveCardTitle}>Reflective Journaling</h3>
              <p className={styles.thriveCardText}>
                Document your thoughts and feelings to gain insights into your emotional patterns.
                Track your growth like the changing seasons.
              </p>
            </div>
            <div className={styles.thriveCard}>
              <div className={styles.thriveIcon}>
                <TreePine className={styles.thriveIconInner} />
              </div>
              <h3 className={styles.thriveCardTitle}>Progress Tracking</h3>
              <p className={styles.thriveCardText}>
                Visualize your emotional wellness journey with intuitive analytics and insights.
                Watch your progress grow like a flourishing garden.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.wellnessSection}>
          <div className={styles.wellnessCard}>
            <div className={styles.wellnessHeader}>
              <div className={styles.wellnessIcon}>
                <Heart className={styles.wellnessIconInner} />
              </div>
              <h2 className={styles.wellnessTitle}>
                🌟 Your Wellness Journey
              </h2>
              <p className={styles.wellnessSubtitle}>
                Discover which activities work best for you and track your wellness patterns
              </p>
            </div>
            <WellnessActivitiesSummary />
          </div>
        </section>

        <section className={styles.testimonialSection}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialBackground}></div>
            <div className={styles.testimonialCircle1}></div>
            <div className={styles.testimonialCircle2}></div>
            <div className={styles.testimonialContent}>
              <div className={styles.testimonialQuote}>"</div>
              <blockquote className={styles.testimonialText}>
                Since I started using Mindful, I've noticed a significant improvement in how I handle stress.
                The daily mindfulness exercises have become an essential part of my routine, like tending to a garden.
              </blockquote>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>
                  <span className={styles.testimonialInitials}>SJ</span>
                </div>
                <div className={styles.testimonialInfo}>
                  <div className={styles.testimonialName}>Sarah Johnson</div>
                  <div className={styles.testimonialRole}>Wellness Enthusiast</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.recommendationsSection}>
          <div className={styles.recommendationsCard}>
            <div className={styles.recommendationsHeader}>
              <div className={styles.recommendationsIcon}>
                <Brain className={styles.recommendationsIconInner} />
              </div>
              <h2 className={styles.recommendationsTitle}>
                🌟 AI Recommendations
              </h2>
              <p className={styles.recommendationsSubtitle}>
                Get personalized recommendations for your wellness journey
              </p>
            </div>
            <Recommendations />
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaBackground}></div>
            <div className={styles.ctaCircle1}></div>
            <div className={styles.ctaCircle2}></div>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Begin Your Wellness Journey Today
              </h2>
              <p className={styles.ctaSubtitle}>
                Join thousands who have transformed their emotional well-being with our science-backed approach.
                Your path to inner peace starts here.
              </p>
              <button className={styles.ctaButton}>
                <Sparkles className={styles.ctaButtonIcon} />
                Get Started Now
              </button>
            </div>
          </div>
        </section>
      </div>

      <FloatingChatbot
        isOpen={chatbotOpen}
        onToggle={() => setChatbotOpen(!chatbotOpen)}
        mode="dashboard"
        hoveredSection={hoveredService}
      />
    </div>
  );
}
