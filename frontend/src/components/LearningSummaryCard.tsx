import { Activity, Brain, Heart, Target, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from '../hooks/axios/axios';
import styles from '../styles/LearningSummaryCard.module.css';

interface MentalHealthMetrics {
  overallScore: number | null;
  weeklyTrend: number | null;
  moodImprovement: number | null;
  consistency: number | null;
  weeklyProgress: number[];
  insights: string[];
  hasData: boolean;
}

const LearningSummaryCard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<MentalHealthMetrics>({
    overallScore: null,
    weeklyTrend: null,
    moodImprovement: null,
    consistency: null,
    weeklyProgress: [],
    insights: [],
    hasData: false
  });

  useEffect(() => {
    calculateMentalHealthMetrics();
  }, []);

  // Add refresh mechanism when evaluation data changes
  useEffect(() => {
    const handleStorageChange = () => {
      // Refresh when evaluation data changes
      const evaluationScore = localStorage.getItem('evaluationScore');
      if (evaluationScore) {
        calculateMentalHealthMetrics();
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    window.addEventListener('evaluationCompleted', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('evaluationCompleted', handleStorageChange);
    };
  }, []);

  const calculateMentalHealthMetrics = async () => {
    try {
      // First try to get evaluation data from server
      let evaluationData = [];
      try {
        const response = await axios.get('/test', { withCredentials: true });
        console.log('Server evaluation data:', response.data);
        if ((response.data as any).testResults && (response.data as any).testResults.length > 0) {
          evaluationData = (response.data as any).testResults;
          console.log('Found evaluation data from server:', evaluationData);
        }
      } catch (error) {
        console.log('No evaluation data from server:', error);
      }

      // Get user data from localStorage
      const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
      const activityHistory = JSON.parse(localStorage.getItem('activityHistory') || '[]');
      const evaluationHistory = JSON.parse(localStorage.getItem('evaluationHistory') || '[]');
      const todayMood = localStorage.getItem('todayMood') || '😐';

      // Combine server and local evaluation data
      const allEvaluations = [...evaluationData, ...evaluationHistory];
      
      // Check if user has any data
      const hasAnyData = allEvaluations.length > 0 || moodHistory.length > 0 || activityHistory.length > 0;

      if (!hasAnyData) {
        // New user with no data
        setMetrics({
          overallScore: null,
          weeklyTrend: null,
          moodImprovement: null,
          consistency: null,
          weeklyProgress: [],
          insights: ['Complete your first evaluation to see your mental health insights', 'Start tracking your daily mood to see patterns'],
          hasData: false
        });
        setIsLoading(false);
        return;
      }

      // Calculate overall score based on recent evaluations
      const recentEvaluations = allEvaluations.slice(-5);
      console.log('Recent evaluations for overall score:', recentEvaluations);
      const overallScore = recentEvaluations.length > 0 
        ? Math.round(recentEvaluations.reduce((sum: number, evaluation: any) => sum + (evaluation.score || 0), 0) / recentEvaluations.length)
        : null;
      console.log('Calculated overall score:', overallScore);

      // Calculate weekly trend
      const weeklyMoods = moodHistory.slice(-7);
      const weeklyTrend = weeklyMoods.length > 1 
        ? Math.round(((weeklyMoods[weeklyMoods.length - 1]?.score || 0) - (weeklyMoods[0]?.score || 0)) / weeklyMoods.length * 100)
        : null;

      // Calculate mood improvement (comparing current month to previous)
      const currentMonthMoods = moodHistory.filter((mood: any) => {
        const moodDate = new Date(mood.timestamp);
        const now = new Date();
        return moodDate.getMonth() === now.getMonth() && moodDate.getFullYear() === now.getFullYear();
      });
      const previousMonthMoods = moodHistory.filter((mood: any) => {
        const moodDate = new Date(mood.timestamp);
        const now = new Date();
        return moodDate.getMonth() === now.getMonth() - 1 && moodDate.getFullYear() === now.getFullYear();
      });

      const moodImprovement = currentMonthMoods.length > 0 && previousMonthMoods.length > 0
        ? Math.round(((currentMonthMoods.reduce((sum: number, mood: any) => sum + (mood.score || 0), 0) / currentMonthMoods.length) -
                     (previousMonthMoods.reduce((sum: number, mood: any) => sum + (mood.score || 0), 0) / previousMonthMoods.length)) * 100)
        : null;

      // Calculate consistency (daily activity adherence)
      const last30Days = activityHistory.filter((activity: any) => {
        const activityDate = new Date(activity.timestamp);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return activityDate >= thirtyDaysAgo;
      });
      const consistency = last30Days.length > 0 
        ? Math.round((last30Days.length / 30) * 100)
        : null;

      // Generate weekly progress data
      const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
        const dayMoods = moodHistory.filter((mood: any) => {
          const moodDate = new Date(mood.timestamp);
          const targetDate = new Date();
          targetDate.setDate(targetDate.getDate() - (6 - i));
          return moodDate.toDateString() === targetDate.toDateString();
        });
        return dayMoods.length > 0 
          ? Math.round(dayMoods.reduce((sum: number, mood: any) => sum + (mood.score || 0), 0) / dayMoods.length)
          : 0; // Show 0 instead of random fallback
      });

      // Generate insights based on actual data
      const insights = generateInsights(moodHistory, activityHistory, allEvaluations);

      setMetrics({
        overallScore,
        weeklyTrend,
        moodImprovement,
        consistency,
        weeklyProgress,
        insights,
        hasData: true
      });
    } catch (error) {
      console.error('Error calculating metrics:', error);
      setMetrics({
        overallScore: null,
        weeklyTrend: null,
        moodImprovement: null,
        consistency: null,
        weeklyProgress: [],
        insights: ['Unable to load your data. Please try again.'],
        hasData: false
      });
    }

    setTimeout(() => setIsLoading(false), 800);
  };

  const generateInsights = (moodHistory: any[], activityHistory: any[], evaluationHistory: any[]): string[] => {
    const insights: string[] = [];

    // Most effective activity
    const activityEffectiveness = activityHistory.reduce((acc: any, activity: any) => {
      if (!acc[activity.type]) {
        acc[activity.type] = { count: 0, totalMood: 0 };
      }
      acc[activity.type].count++;
      acc[activity.type].totalMood += activity.moodScore || 0;
      return acc;
    }, {});

    const bestActivity = Object.entries(activityEffectiveness)
      .sort(([,a]: any, [,b]: any) => (b.totalMood / b.count) - (a.totalMood / a.count))[0];

    if (bestActivity) {
      insights.push(`${bestActivity[0]} shows the best mood improvement`);
    }

    // Mood trend insight
    if (metrics.moodImprovement !== null && metrics.moodImprovement > 0) {
      insights.push(`Your mood has improved ${Math.abs(metrics.moodImprovement)}% this month`);
    }

    // Consistency insight
    if (metrics.consistency !== null) {
      if (metrics.consistency >= 80) {
        insights.push('Excellent daily activity adherence');
      } else if (metrics.consistency > 60) {
        insights.push('Good consistency with room for improvement');
      } else {
        insights.push('Consider increasing daily activity frequency');
      }
    }

    return insights;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? '#10b981' : '#ef4444';
  };

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Analyzing your mental health data...</p>
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
        <div className={styles.headerActions}>
          <button 
            onClick={() => calculateMentalHealthMetrics()} 
            className={styles.refreshButton}
            title="Refresh data"
          >
            🔄
          </button>
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
          <div className={styles.metricValue} style={{ color: getScoreColor(metrics.overallScore || 0) }}>
            {metrics.overallScore !== null ? `${metrics.overallScore}%` : 'N/A'}
          </div>
          <div className={styles.metricDescription}>
            {metrics.overallScore !== null ? (
              metrics.overallScore >= 80 ? 'Excellent mental wellness' :
              metrics.overallScore >= 60 ? 'Good mental wellness' :
              metrics.overallScore >= 40 ? 'Moderate mental wellness' : 'Needs attention'
            ) : 'No data available'}
          </div>
        </div>

        {/* Weekly Trend */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <TrendingUp className={styles.metricIcon} />
            <span className={styles.metricLabel}>Weekly Trend</span>
          </div>
          <div className={styles.metricValue} style={{ color: getTrendColor(metrics.weeklyTrend || 0) }}>
            {metrics.weeklyTrend !== null ? `${metrics.weeklyTrend >= 0 ? '+' : ''}${metrics.weeklyTrend}%` : 'N/A'}
          </div>
          <div className={styles.metricDescription}>
            {metrics.weeklyTrend !== null ? (
              metrics.weeklyTrend > 0 ? 'Improving this week' :
              metrics.weeklyTrend < 0 ? 'Declining this week' : 'Stable this week'
            ) : 'No data available'}
          </div>
        </div>

        {/* Mood Improvement */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <Heart className={styles.metricIcon} />
            <span className={styles.metricLabel}>Mood Improvement</span>
          </div>
          <div className={styles.metricValue} style={{ color: getTrendColor(metrics.moodImprovement || 0) }}>
            {metrics.moodImprovement !== null ? `${metrics.moodImprovement >= 0 ? '+' : ''}${metrics.moodImprovement}%` : 'N/A'}
          </div>
          <div className={styles.metricDescription}>
            {metrics.moodImprovement !== null ? (
              metrics.moodImprovement > 0 ? 'Better than last month' :
              metrics.moodImprovement < 0 ? 'Lower than last month' : 'Similar to last month'
            ) : 'No data available'}
          </div>
        </div>

        {/* Consistency */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <Activity className={styles.metricIcon} />
            <span className={styles.metricLabel}>Consistency</span>
          </div>
          <div className={styles.metricValue} style={{ color: getScoreColor(metrics.consistency || 0) }}>
            {metrics.consistency !== null ? `${metrics.consistency}%` : 'N/A'}
          </div>
          <div className={styles.metricDescription}>
            {metrics.consistency !== null ? (
              metrics.consistency >= 80 ? 'Excellent adherence' :
              metrics.consistency >= 60 ? 'Good adherence' :
              metrics.consistency >= 40 ? 'Moderate adherence' : 'Needs improvement'
            ) : 'No data available'}
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className={styles.chartSection}>
        <h4 className={styles.sectionTitle}>📈 Weekly Progress</h4>
        <div className={styles.chartContainer}>
          <div className={styles.chartPlaceholder}>
            {metrics.weeklyProgress.map((value, index) => (
              <div 
                key={index}
                className={styles.chartBar} 
                style={{ height: `${value}%` }}
              ></div>
            ))}
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
          {metrics.insights.map((insight, index) => (
            <div key={index} className={styles.insightItem}>
              <span className={styles.insightIcon}>🎯</span>
              <span className={styles.insightText}>{insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningSummaryCard;