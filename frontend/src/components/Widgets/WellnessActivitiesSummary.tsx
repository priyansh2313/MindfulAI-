import { Activity, BookOpen, Brain, Heart, Music, Quote } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/Widgets/WellnessActivitiesSummary.module.css';
import {
  Action,
  getActionEffectiveness,
  getPersonalizedInsights,
  getUserContext,
  Mood
} from '../../utils/reinforcement';

interface ActivityData {
  name: string;
  action: Action;
  icon: React.ReactNode;
  effectiveness: number;
  usage: number;
  lastUsed: string;
  description: string;
  successRate: number;
  timeEffectiveness: Record<string, number>;
}

const WellnessActivitiesSummary: React.FC = () => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);
  const [userContext, setUserContext] = useState<any>(null);

  // Activity mapping with descriptions
  const activityMap = {
    'breathing': {
      name: 'Breathing Exercises',
      icon: <Activity className={styles.activityIcon} />,
      description: 'Deep breathing techniques to calm your nervous system'
    },
    'music': {
      name: 'Mindful Music',
      icon: <Music className={styles.activityIcon} />,
      description: 'Soothing sounds and melodies to reduce stress'
    },
    'journal': {
      name: 'Journal Writing',
      icon: <BookOpen className={styles.activityIcon} />,
      description: 'Express your thoughts and track your emotions'
    },
    'quote': {
      name: 'Inspirational Quotes',
      icon: <Quote className={styles.activityIcon} />,
      description: 'Uplifting quotes to boost your mood and motivation'
    },
    'evaluation': {
      name: 'Mood Evaluation',
      icon: <Brain className={styles.activityIcon} />,
      description: 'Regular mood check-ins and self-assessment'
    },
    'daily-activities': {
      name: 'Daily Wellness Activities',
      icon: <Heart className={styles.activityIcon} />,
      description: 'Structured wellness routines and exercises'
    },
    'journal_prompt': {
      name: 'Guided Journaling',
      icon: <BookOpen className={styles.activityIcon} />,
      description: 'Prompted journaling for deeper self-reflection'
    }
  };

  useEffect(() => {
    const loadRealData = () => {
      try {
        // Get user context
        const context = getUserContext();
        setUserContext(context);

        // Get personalized insights
        const personalizedInsights = getPersonalizedInsights();
        setInsights(personalizedInsights);

        // Generate real activity data
        const moods: Mood[] = ['happy', 'neutral', 'sad', 'anxious', 'angry', 'burnt_out'];
        const actions: Action[] = ['music', 'quote', 'breathing', 'journal', 'evaluation', 'daily-activities', 'journal_prompt'];
        
        const realActivities: ActivityData[] = actions.map(action => {
          // Get effectiveness data for this action across all moods
          const effectivenessData = moods.map(mood => getActionEffectiveness(mood, action));
          
          // Calculate average effectiveness
          const avgEffectiveness = effectivenessData.reduce((sum, data) => sum + data.overallScore, 0) / moods.length;
          
          // Get total usage across all moods
          const totalUsage = effectivenessData.reduce((sum, data) => sum + data.totalUses, 0);
          
          // Get success rate (average)
          const avgSuccessRate = effectivenessData.reduce((sum, data) => sum + data.successRate, 0) / moods.length;
          
          // Get time effectiveness
          const timeEffectiveness = effectivenessData[0]?.timeEffectiveness || {};
          
          // Calculate last used (simulate based on total uses)
          const lastUsed = totalUsage > 0 ? 
            (totalUsage > 10 ? '2 hours ago' : 
             totalUsage > 5 ? '1 day ago' : 
             totalUsage > 2 ? '3 days ago' : '1 week ago') : 
            'Never used';

          return {
            name: activityMap[action].name,
            action,
            icon: activityMap[action].icon,
            effectiveness: Math.round(avgEffectiveness * 100),
            usage: totalUsage,
            lastUsed,
            description: activityMap[action].description,
            successRate: avgSuccessRate,
            timeEffectiveness
          };
        }).filter(activity => activity.usage > 0 || activity.effectiveness > 30); // Only show activities with some usage or decent effectiveness

        // Sort by effectiveness and usage
        realActivities.sort((a, b) => {
          const aScore = (a.effectiveness * 0.7) + (a.usage * 0.3);
          const bScore = (b.effectiveness * 0.7) + (b.usage * 0.3);
          return bScore - aScore;
        });

        setActivities(realActivities);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading wellness data:', error);
        setIsLoading(false);
      }
    };

    // Simulate loading time for better UX
    setTimeout(loadRealData, 800);
  }, []);

  // Add real-time refresh mechanism
  useEffect(() => {
    const handleStorageChange = () => {
      // Refresh data when feedback is logged (feedback_log changes)
      const feedbackLog = localStorage.getItem('feedback_log');
      if (feedbackLog) {
        // Reload data after a short delay to ensure feedback is processed
        setTimeout(() => {
          const loadRealData = () => {
            try {
              // Get user context
              const context = getUserContext();
              setUserContext(context);

              // Get personalized insights
              const personalizedInsights = getPersonalizedInsights();
              setInsights(personalizedInsights);

              // Generate real activity data
              const moods: Mood[] = ['happy', 'neutral', 'sad', 'anxious', 'angry', 'burnt_out'];
              const actions: Action[] = ['music', 'quote', 'breathing', 'journal', 'evaluation', 'daily-activities', 'journal_prompt'];
              
              const realActivities: ActivityData[] = actions.map(action => {
                // Get effectiveness data for this action across all moods
                const effectivenessData = moods.map(mood => getActionEffectiveness(mood, action));
                
                // Calculate average effectiveness
                const avgEffectiveness = effectivenessData.reduce((sum, data) => sum + data.overallScore, 0) / moods.length;
                
                // Get total usage across all moods
                const totalUsage = effectivenessData.reduce((sum, data) => sum + data.totalUses, 0);
                
                // Get success rate (average)
                const avgSuccessRate = effectivenessData.reduce((sum, data) => sum + data.successRate, 0) / moods.length;
                
                // Get time effectiveness
                const timeEffectiveness = effectivenessData[0]?.timeEffectiveness || {};
                
                // Calculate last used (simulate based on total uses)
                const lastUsed = totalUsage > 0 ? 
                  (totalUsage > 10 ? '2 hours ago' : 
                   totalUsage > 5 ? '1 day ago' : 
                   totalUsage > 2 ? '3 days ago' : '1 week ago') : 
                  'Never used';

                return {
                  name: activityMap[action].name,
                  action,
                  icon: activityMap[action].icon,
                  effectiveness: Math.round(avgEffectiveness * 100),
                  usage: totalUsage,
                  lastUsed,
                  description: activityMap[action].description,
                  successRate: avgSuccessRate,
                  timeEffectiveness
                };
              }).filter(activity => activity.usage > 0 || activity.effectiveness > 30);

              // Sort by effectiveness and usage
              realActivities.sort((a, b) => {
                const aScore = (a.effectiveness * 0.7) + (a.usage * 0.3);
                const bScore = (b.effectiveness * 0.7) + (b.usage * 0.3);
                return bScore - aScore;
              });

              setActivities(realActivities);
            } catch (error) {
              console.error('Error refreshing wellness data:', error);
            }
          };
          loadRealData();
        }, 1000);
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when feedback is given
    const handleFeedbackGiven = () => {
      setTimeout(handleStorageChange, 500);
    };
    
    window.addEventListener('feedback-given', handleFeedbackGiven);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('feedback-given', handleFeedbackGiven);
    };
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

  const getTimeEffectiveness = (timeEffectiveness: Record<string, number>) => {
    const currentTime = new Date().getHours();
    let timeOfDay = 'morning';
    if (currentTime >= 12 && currentTime < 17) timeOfDay = 'afternoon';
    else if (currentTime >= 17 && currentTime < 22) timeOfDay = 'evening';
    else if (currentTime >= 22 || currentTime < 5) timeOfDay = 'night';
    
    return timeEffectiveness[timeOfDay] || 0;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Analyzing your wellness activities...</p>
      </div>
    );
  }

  const totalActivities = activities.length;
  const mostEffective = activities.length > 0 ? activities[0] : null;
  const avgEffectiveness = activities.length > 0 ? 
    Math.round(activities.reduce((sum, activity) => sum + activity.effectiveness, 0) / activities.length) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Your Wellness Journey</h3>
        <p className={styles.subtitle}>Based on your actual usage patterns and feedback</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h4>Active Activities</h4>
            <span className={styles.statValue}>{totalActivities}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <h4>Most Effective</h4>
            <span className={styles.statValue}>{mostEffective?.name || 'None'}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statContent}>
            <h4>Avg. Effectiveness</h4>
            <span className={styles.statValue}>{avgEffectiveness}%</span>
          </div>
        </div>
      </div>

      {activities.length > 0 ? (
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
                  <span className={styles.successRate}>
                    Success Rate: {Math.round(activity.successRate * 100)}%
                  </span>
                </div>
              </div>

              <div className={styles.activityActions}>
                <button className={styles.tryAgainBtn}>Try Again</button>
                <button className={styles.viewDetailsBtn}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🌟</div>
          <h4>No Activity Data Yet</h4>
          <p>Start using wellness activities to see your personalized insights here!</p>
        </div>
      )}

      {insights && (
        <div className={styles.insightsSection}>
          <h4 className={styles.insightsTitle}>💡 AI Insights</h4>
          <div className={styles.insightsGrid}>
            {insights.improvementAreas.length > 0 ? (
              insights.improvementAreas.slice(0, 3).map((insight: string, index: number) => (
                <div key={index} className={styles.insightCard}>
                  <div className={styles.insightIcon}>🎯</div>
                  <div className={styles.insightContent}>
                    <h5>Personalized Tip</h5>
                    <p>{insight}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.insightCard}>
                <div className={styles.insightIcon}>🌟</div>
                <div className={styles.insightContent}>
                  <h5>Great Progress!</h5>
                  <p>You're doing well with your wellness activities. Keep up the good work!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WellnessActivitiesSummary; 