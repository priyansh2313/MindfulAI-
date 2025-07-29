import { Activity, Brain, Heart, Target, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styles from '../styles/LearningSummaryCard.module.css';

const LearningSummaryCard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your mental health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <Brain className={styles.titleIcon} />
          <h3 className={styles.title}>Mental Health Analytics</h3>
        </div>
        <p className={styles.subtitle}>Your wellness journey insights</p>
      </div>

      <div className={styles.analyticsGrid}>
        {/* Overall Score */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <Target className={styles.metricIcon} />
            <span className={styles.metricLabel}>Overall Score</span>
          </div>
          <div className={styles.metricValue} style={{ color: '#10b981' }}>
            78%
          </div>
          <div className={styles.metricDescription}>
            Excellent mental wellness
          </div>
        </div>

        {/* Weekly Trend */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <TrendingUp className={styles.metricIcon} />
            <span className={styles.metricLabel}>Weekly Trend</span>
          </div>
          <div className={styles.metricValue} style={{ color: '#10b981' }}>
            +12%
          </div>
          <div className={styles.metricDescription}>
            Improving this week
          </div>
        </div>

        {/* Mood Improvement */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <Heart className={styles.metricIcon} />
            <span className={styles.metricLabel}>Mood Improvement</span>
          </div>
          <div className={styles.metricValue} style={{ color: '#10b981' }}>
            +23%
          </div>
          <div className={styles.metricDescription}>
            Better than last month
          </div>
        </div>

        {/* Consistency */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <Activity className={styles.metricIcon} />
            <span className={styles.metricLabel}>Consistency</span>
          </div>
          <div className={styles.metricValue} style={{ color: '#10b981' }}>
            85%
          </div>
          <div className={styles.metricDescription}>
            Daily activity adherence
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className={styles.chartSection}>
        <h4 className={styles.sectionTitle}>📈 Weekly Progress</h4>
        <div className={styles.chartContainer}>
          <div className={styles.chartPlaceholder}>
            <div className={styles.chartBar} style={{ height: '60%' }}></div>
            <div className={styles.chartBar} style={{ height: '75%' }}></div>
            <div className={styles.chartBar} style={{ height: '85%' }}></div>
            <div className={styles.chartBar} style={{ height: '70%' }}></div>
            <div className={styles.chartBar} style={{ height: '90%' }}></div>
            <div className={styles.chartBar} style={{ height: '80%' }}></div>
            <div className={styles.chartBar} style={{ height: '95%' }}></div>
          </div>
          <div className={styles.chartLabels}>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className={styles.insightsSection}>
        <h4 className={styles.sectionTitle}>💡 Quick Insights</h4>
        <div className={styles.insightsList}>
          <div className={styles.insightItem}>
            <span className={styles.insightIcon}>🎯</span>
            <span className={styles.insightText}>Breathing exercises work best in the morning</span>
          </div>
          <div className={styles.insightItem}>
            <span className={styles.insightIcon}>📈</span>
            <span className={styles.insightText}>Your mood has improved 23% this month</span>
          </div>
          <div className={styles.insightItem}>
            <span className={styles.insightIcon}>🌟</span>
            <span className={styles.insightText}>Journal writing shows great effectiveness</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningSummaryCard;