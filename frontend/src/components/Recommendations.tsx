import { Activity, BookOpen, Brain, Clock, Heart, Music, Target, TrendingUp, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Recommendations.module.css';
import {
    Action,
    getActionEffectiveness,
    getPersonalizedInsights,
    getRecommendedActionForMood,
    getUserContext,
    Mood
} from '../utils/reinforcement';

const actionsMap: Record<string, { 
  label: string; 
  path: string; 
  icon: React.ReactNode;
  description: string;
  category: 'relaxation' | 'activity' | 'reflection' | 'assessment';
}> = {
  music: { 
    label: 'Peaceful Music', 
    path: '/music',
    icon: <Music size={20} />,
    description: 'Calming melodies to soothe your mind',
    category: 'relaxation'
  },
  journal: { 
    label: 'Journal Writing', 
    path: '/journal',
    icon: <BookOpen size={20} />,
    description: 'Express your thoughts and feelings',
    category: 'reflection'
  },
  breathing: { 
    label: 'Breathing Exercises', 
    path: '/daily-activities',
    icon: <Activity size={20} />,
    description: 'Mindful breathing techniques',
    category: 'relaxation'
  },
  evaluation: { 
    label: 'Mental Health Check', 
    path: '/evaluation',
    icon: <Target size={20} />,
    description: 'Assess your current mental state',
    category: 'assessment'
  },
  'daily-activities': { 
    label: 'Daily Activities', 
    path: '/daily-activities',
    icon: <Activity size={20} />,
    description: 'Structured wellness activities',
    category: 'activity'
  },
  journal_prompt: { 
    label: 'Guided Journaling', 
    path: '/journal',
    icon: <BookOpen size={20} />,
    description: 'Structured writing prompts',
    category: 'reflection'
  }
};

interface Recommendation {
  action: Action;
  confidence: number;
  reason: string;
  timeContext?: string;
  effectiveness?: number;
}

export default function Recommendations() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userContext, setUserContext] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateRecommendations();
  }, []);

  const generateRecommendations = () => {
    setLoading(true);
    
    // Get current mood
    const emoji = localStorage.getItem('todayMood') || '';
    const mood: Mood = emoji === '😄' || emoji === '🙂' ? 'happy' : 
                      emoji === '😐' ? 'neutral' : 
                      emoji === '😕' ? 'anxious' : 'sad';
    
    // Get user context
    const context = getUserContext();
    setUserContext(context);
    
    // Get personalized insights
    const personalInsights = getPersonalizedInsights();
    setInsights(personalInsights);
    
    // Generate recommendations
    const recs: Recommendation[] = [];
    
    // Primary recommendation using RL
    const primaryAction = getRecommendedActionForMood(mood);
    const primaryEffectiveness = getActionEffectiveness(mood, primaryAction);
    
    recs.push({
      action: primaryAction,
      confidence: primaryEffectiveness.overallScore,
      reason: `Based on your ${mood} mood and past interactions`,
      effectiveness: primaryEffectiveness.successRate
    });
    
    // Secondary recommendations based on context
    const timeOfDay = new Date().getHours();
    let secondaryAction: Action;
    
         if (timeOfDay < 12) {
       // Morning: Focus on energy and planning
       secondaryAction = 'daily-activities';
     } else if (timeOfDay < 17) {
      // Afternoon: Focus on productivity and balance
      secondaryAction = 'breathing';
    } else {
      // Evening: Focus on relaxation and reflection
      secondaryAction = 'journal';
    }
    
    if (secondaryAction !== primaryAction) {
      const secondaryEffectiveness = getActionEffectiveness(mood, secondaryAction);
      recs.push({
        action: secondaryAction,
        confidence: secondaryEffectiveness.overallScore,
        reason: `Great for ${timeOfDay < 12 ? 'morning' : timeOfDay < 17 ? 'afternoon' : 'evening'} wellness`,
        timeContext: timeOfDay < 12 ? 'morning' : timeOfDay < 17 ? 'afternoon' : 'evening',
        effectiveness: secondaryEffectiveness.successRate
      });
    }
    
    // Third recommendation based on personal insights
    const bestActionForMood = personalInsights.bestActions[mood];
    if (bestActionForMood && bestActionForMood !== primaryAction && bestActionForMood !== secondaryAction) {
      const bestEffectiveness = getActionEffectiveness(mood, bestActionForMood);
      recs.push({
        action: bestActionForMood,
        confidence: bestEffectiveness.overallScore,
        reason: 'Historically effective for your mood',
        effectiveness: bestEffectiveness.successRate
      });
    }
    
    setRecommendations(recs);
    setLoading(false);
  };

  const handleRecommendationClick = (action: Action) => {
    // Log the recommendation selection
    const context = getUserContext();
    if (context) {
      // You can add analytics here
      console.log('User selected recommendation:', action);
    }
    
    const { path } = actionsMap[action];
    navigate(path);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.7) return '#10b981';
    if (confidence > 0.5) return '#f59e0b';
    return '#ef4444';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence > 0.7) return 'High Match';
    if (confidence > 0.5) return 'Good Match';
    return 'Try This';
  };

  if (loading) {
    return (
      <div className={styles.recommendations}>
        <div className={styles.loadingContainer}>
          <Brain className={styles.loadingIcon} />
          <p>Analyzing your patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.recommendations}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Brain className={styles.titleIcon} />
          <h3 className={styles.title}>AI-Powered Recommendations</h3>
        </div>
        <p className={styles.subtitle}>
          Personalized suggestions based on your mood and patterns
        </p>
      </div>

      <div className={styles.recommendationsGrid}>
        {recommendations.map((rec, index) => {
          const actionData = actionsMap[rec.action];
          
          // Skip rendering if actionData is not found
          if (!actionData) {
            console.warn(`Action data not found for: ${rec.action}`);
            return null;
          }
          
          const confidenceColor = getConfidenceColor(rec.confidence);
          const confidenceText = getConfidenceText(rec.confidence);
          
          return (
            <div 
              key={rec.action}
              className={`${styles.recommendationCard} ${index === 0 ? styles.primary : ''}`}
              onClick={() => handleRecommendationClick(rec.action)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.actionIcon}>
                  {actionData.icon}
                </div>
                <div className={styles.confidenceBadge} style={{ backgroundColor: confidenceColor }}>
                  {confidenceText}
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <h4 className={styles.actionTitle}>{actionData.label}</h4>
                <p className={styles.actionDescription}>{actionData.description}</p>
                <p className={styles.reason}>{rec.reason}</p>
                
                {rec.timeContext && (
                  <div className={styles.timeContext}>
                    <Clock size={14} />
                    <span>Best for {rec.timeContext}</span>
                  </div>
                )}
                
                {rec.effectiveness && (
                  <div className={styles.effectiveness}>
                    <TrendingUp size={14} />
                    <span>{Math.round(rec.effectiveness * 100)}% success rate</span>
                  </div>
                )}
              </div>
              
              <div className={styles.cardFooter}>
                <button className={styles.tryButton}>
                  Try Now
                  <Zap size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {insights && insights.improvementAreas.length > 0 && (
        <div className={styles.insightsSection}>
          <h4 className={styles.insightsTitle}>
            <Heart className={styles.insightsIcon} />
            Personalized Insights
          </h4>
          <div className={styles.insightsList}>
            {insights.improvementAreas.slice(0, 2).map((insight: string, index: number) => (
              <div key={index} className={styles.insightItem}>
                <span className={styles.insightBullet}>💡</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
