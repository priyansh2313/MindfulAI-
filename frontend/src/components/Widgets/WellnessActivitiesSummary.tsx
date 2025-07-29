import { Activity, BookOpen, Heart, Music, Smile, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/Widgets/WellnessActivitiesSummary.module.css';

interface ActivityData {
  name: string;
  icon: React.ReactNode;
  effectiveness: number;
  usage: number;
  lastUsed: string;
  description: string;
}

const WellnessActivitiesSummary: React.FC = () => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockActivities: ActivityData[] = [
        {
          name: 'Breathing Exercises',
          icon: <Activity className={styles.activityIcon} />,
          effectiveness: 85,
          usage: 12,
          lastUsed: '2 hours ago',
          description: 'Deep breathing helps calm your nervous system'
        },
        {
          name: 'Mindful Music',
          icon: <Music className={styles.activityIcon} />,
          effectiveness: 78,
          usage: 8,
          lastUsed: '1 day ago',
          description: 'Soothing sounds to reduce stress and anxiety'
        },
        {
          name: 'Journal Writing',
          icon: <BookOpen className={styles.activityIcon} />,
          effectiveness: 72,
          usage: 15,
          lastUsed: '3 hours ago',
          description: 'Express your thoughts and track your emotions'
        },
        {
          name: 'Positive Affirmations',
          icon: <Smile className={styles.activityIcon} />,
          effectiveness: 68,
          usage: 6,
          lastUsed: '2 days ago',
          description: 'Boost your mood with positive self-talk'
        },
        {
          name: 'Gratitude Practice',
          icon: <Heart className={styles.activityIcon} />,
          effectiveness: 82,
          usage: 10,
          lastUsed: '1 day ago',
          description: 'Focus on what you\'re thankful for'
        },
        {
          name: 'Progress Tracking',
          icon: <TrendingUp className={styles.activityIcon} />,
          effectiveness: 75,
          usage: 20,
          lastUsed: '5 hours ago',
          description: 'Monitor your wellness journey progress'
        }
      ];
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 80) return '#10b981'; // Green
    if (effectiveness >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getEffectivenessLabel = (effectiveness: number) => {
    if (effectiveness >= 80) return 'Very Effective';
    if (effectiveness >= 60) return 'Effective';
    return 'Needs Improvement';
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your wellness activities...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Your Wellness Activities</h3>
        <p className={styles.subtitle}>Based on your feedback and usage patterns</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h4>Total Activities</h4>
            <span className={styles.statValue}>{activities.length}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <h4>Most Effective</h4>
            <span className={styles.statValue}>Breathing</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statContent}>
            <h4>Avg. Effectiveness</h4>
            <span className={styles.statValue}>76%</span>
          </div>
        </div>
      </div>

      <div className={styles.activitiesGrid}>
        {activities.map((activity, index) => (
          <div key={index} className={styles.activityCard}>
            <div className={styles.activityHeader}>
              <div className={styles.activityIconContainer}>
                {activity.icon}
              </div>
              <div className={styles.activityInfo}>
                <h4 className={styles.activityName}>{activity.name}</h4>
                <p className={styles.activityDescription}>{activity.description}</p>
              </div>
            </div>
            
            <div className={styles.activityStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Effectiveness</span>
                <div className={styles.effectivenessBar}>
                  <div 
                    className={styles.effectivenessFill}
                    style={{ 
                      width: `${activity.effectiveness}%`,
                      backgroundColor: getEffectivenessColor(activity.effectiveness)
                    }}
                  ></div>
                </div>
                <span className={styles.effectivenessValue}>
                  {activity.effectiveness}% - {getEffectivenessLabel(activity.effectiveness)}
                </span>
              </div>
              
              <div className={styles.usageInfo}>
                <span className={styles.usageCount}>Used {activity.usage} times</span>
                <span className={styles.lastUsed}>Last: {activity.lastUsed}</span>
              </div>
            </div>

            <div className={styles.activityActions}>
              <button className={styles.tryAgainBtn}>Try Again</button>
              <button className={styles.viewDetailsBtn}>View Details</button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.insightsSection}>
        <h4 className={styles.insightsTitle}>💡 Your Insights</h4>
        <div className={styles.insightsGrid}>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>🎯</div>
            <div className={styles.insightContent}>
              <h5>Best Time for Activities</h5>
              <p>You tend to feel better when doing breathing exercises in the morning</p>
            </div>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>📈</div>
            <div className={styles.insightContent}>
              <h5>Progress Trend</h5>
              <p>Your overall wellness score has improved by 15% this month</p>
            </div>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>🌟</div>
            <div className={styles.insightContent}>
              <h5>Recommendation</h5>
              <p>Try journaling more often - it shows great effectiveness for your mood</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessActivitiesSummary; 