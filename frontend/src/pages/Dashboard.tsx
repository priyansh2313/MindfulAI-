import React, { useState } from 'react';
import EvaluationCard from '../components/EvaluationCard';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LearningSummaryCard from '../components/LearningSummaryCard';
import Recommendations from '../components/Recommendations';
import ServicesGrid from '../components/ServicesGrid';
import WellnessActivitiesSummary from '../components/Widgets/WellnessActivitiesSummary';
// @ts-ignore
import styles from '../styles/Dashboard.module.css';
import FloatingChatbot from './FloatingChatbot';
import FloatingLeaves from './FloatingLeaves';

export default function Dashboard() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile on mount
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={styles.page}>
      <FloatingLeaves />
      <Header />
      <Hero />
      
      {/* Services Section */}
      <section className={styles.servicesSection}>
        <ServicesGrid
          onCardHover={setHoveredService}
          onCardLeave={() => setHoveredService(null)}
        />
      </section>

      {/* Main Dashboard Content */}
      <div className={styles.dashboardContent}>
        
        {/* Analytics & Insights Section */}
        <section className={styles.analyticsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>📊 Analytics & Insights</h2>
            <p className={styles.sectionSubtitle}>Track your mental wellness journey with detailed analytics</p>
          </div>
          <div className={styles.analyticsContent}>
            <div className={styles.analyticsLeft}>
              <div className={styles.evaluationSummary}>
                <h3 className={styles.analyticsTitle}>Your Evaluation Summary</h3>
                <div className={styles.evaluationGraph}>
                  <EvaluationCard />
                </div>
              </div>
            </div>
            <div className={styles.analyticsRight}>
              <div className={styles.learningSummary}>
                <h3 className={styles.analyticsTitle}>Mental Health Analytics</h3>
                <LearningSummaryCard />
              </div>
            </div>
          </div>
        </section>

        {/* Wellness Activities Summary Section */}
        <section className={styles.wellnessSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🌟 Your Wellness Journey</h2>
            <p className={styles.sectionSubtitle}>Discover which activities work best for you and track your wellness patterns</p>
          </div>
          <WellnessActivitiesSummary />
        </section>

        {/* Recommendations Section */}
        <section className={styles.tipsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🌟 AI Recommendations</h2>
            <p className={styles.sectionSubtitle}>Get personalized recommendations for your wellness journey</p>
          </div>
          <div className={styles.tipsGrid}>
            <Recommendations />
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
