import React, { useState } from 'react';
import EvaluationCard from '../components/EvaluationCard';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LearningSummaryCard from '../components/LearningSummaryCard';
import PersonalizedInsights from '../components/PersonalizedInsights';
import Recommendations from '../components/Recommendations';
import ServicesGrid from '../components/ServicesGrid';
import MoodWidget from '../components/Widgets/MoodWidget';
import ProgressWidget from '../components/Widgets/ProgressWidget';
import TipWidget from '../components/Widgets/TipWidget';
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
          <div className={styles.analyticsGrid}>
            <EvaluationCard />
            <LearningSummaryCard />
          </div>
        </section>

        {/* Progress Tracking Section */}
        <section className={styles.progressSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🎯 Progress Tracking</h2>
            <p className={styles.sectionSubtitle}>Monitor your daily progress and mood patterns</p>
          </div>
          <div className={styles.progressGrid}>
            <MoodWidget />
            <ProgressWidget />
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

        {/* Personalized Insights Section */}
        <section className={styles.insightsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>💡 Personalized Insights</h2>
            <p className={styles.sectionSubtitle}>Discover patterns and get personalized recommendations based on your usage</p>
          </div>
          <PersonalizedInsights />
        </section>

        {/* Tips & Recommendations Section */}
        <section className={styles.tipsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🌟 Tips & Recommendations</h2>
            <p className={styles.sectionSubtitle}>Get personalized tips and recommendations for your wellness journey</p>
          </div>
          <div className={styles.tipsGrid}>
            <TipWidget />
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
