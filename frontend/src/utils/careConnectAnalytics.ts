// Care Connect Analytics - Tracks user interactions and feature usage

export interface AnalyticsEvent {
  event: string;
  data?: any;
  timestamp: Date;
  userId: string;
  sessionId: string;
}

export interface UserInteraction {
  feature: string;
  action: string;
  duration?: number;
  success: boolean;
  error?: string;
}

class CareConnectAnalytics {
  private sessionId: string;
  private userId: string;
  private startTime: number;
  private interactions: UserInteraction[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = localStorage.getItem('userId') || 'anonymous';
    this.startTime = Date.now();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Track feature usage
  trackFeatureUsage(feature: string, action: string, success: boolean, error?: string, duration?: number): void {
    const interaction: UserInteraction = {
      feature,
      action,
      duration,
      success,
      error,
    };

    this.interactions.push(interaction);
    this.sendAnalyticsEvent('feature_usage', interaction);
  }

  // Track voice interactions
  trackVoiceInteraction(action: string, success: boolean, duration?: number, error?: string): void {
    this.trackFeatureUsage('voice', action, success, error, duration);
  }

  // Track family interactions
  trackFamilyInteraction(action: string, familyMemberId?: string, success: boolean, error?: string): void {
    this.trackFeatureUsage('family', action, success, error);
  }

  // Track health win sharing
  trackHealthWinSharing(category: string, recipientsCount: number, hasPhoto: boolean, success: boolean): void {
    this.trackFeatureUsage('health_win', 'share', success, undefined, undefined);
    this.sendAnalyticsEvent('health_win_shared', {
      category,
      recipientsCount,
      hasPhoto,
      success,
    });
  }

  // Track help request creation
  trackHelpRequestCreation(category: string, urgency: string, recipientsCount: number, success: boolean): void {
    this.trackFeatureUsage('help_request', 'create', success);
    this.sendAnalyticsEvent('help_request_created', {
      category,
      urgency,
      recipientsCount,
      success,
    });
  }

  // Track check-in responses
  trackCheckinResponse(responseType: string, hasRating: boolean, success: boolean): void {
    this.trackFeatureUsage('checkin', 'respond', success);
    this.sendAnalyticsEvent('checkin_responded', {
      responseType,
      hasRating,
      success,
    });
  }

  // Track navigation patterns
  trackNavigation(fromFeature: string, toFeature: string, duration: number): void {
    this.sendAnalyticsEvent('navigation', {
      fromFeature,
      toFeature,
      duration,
    });
  }

  // Track accessibility usage
  trackAccessibilityUsage(feature: string, action: string): void {
    this.sendAnalyticsEvent('accessibility_usage', {
      feature,
      action,
    });
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number): void {
    this.sendAnalyticsEvent('performance', {
      metric,
      value,
    });
  }

  // Track error events
  trackError(error: string, context: string, stack?: string): void {
    this.sendAnalyticsEvent('error', {
      error,
      context,
      stack,
    });
  }

  // Track user engagement
  trackEngagement(engagementType: string, duration: number): void {
    this.sendAnalyticsEvent('engagement', {
      type: engagementType,
      duration,
    });
  }

  // Get session summary
  getSessionSummary(): any {
    const sessionDuration = Date.now() - this.startTime;
    const successfulInteractions = this.interactions.filter(i => i.success).length;
    const totalInteractions = this.interactions.length;
    const successRate = totalInteractions > 0 ? (successfulInteractions / totalInteractions) * 100 : 0;

    return {
      sessionId: this.sessionId,
      userId: this.userId,
      sessionDuration,
      totalInteractions,
      successfulInteractions,
      successRate,
      interactions: this.interactions,
    };
  }

  // Send analytics event to server
  private async sendAnalyticsEvent(event: string, data?: any): Promise<void> {
    try {
      const analyticsEvent: AnalyticsEvent = {
        event,
        data,
        timestamp: new Date(),
        userId: this.userId,
        sessionId: this.sessionId,
      };

      // Send to analytics server
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(analyticsEvent),
      });

      // Also store locally for offline analysis
      this.storeAnalyticsEvent(analyticsEvent);
    } catch (error) {
      console.error('Failed to send analytics event:', error);
      // Store locally for later sync
      this.storeAnalyticsEvent({
        event,
        data,
        timestamp: new Date(),
        userId: this.userId,
        sessionId: this.sessionId,
      });
    }
  }

  // Store analytics event locally
  private storeAnalyticsEvent(event: AnalyticsEvent): void {
    try {
      const existingEvents = this.getStoredAnalyticsEvents();
      const updatedEvents = [event, ...existingEvents].slice(0, 1000); // Keep last 1000 events
      localStorage.setItem('careConnect_analytics', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Failed to store analytics event:', error);
    }
  }

  // Get stored analytics events
  private getStoredAnalyticsEvents(): AnalyticsEvent[] {
    try {
      const data = localStorage.getItem('careConnect_analytics');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get stored analytics events:', error);
      return [];
    }
  }

  // Sync stored analytics events
  async syncStoredAnalyticsEvents(): Promise<void> {
    try {
      const storedEvents = this.getStoredAnalyticsEvents();
      
      for (const event of storedEvents) {
        try {
          await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(event),
          });
        } catch (error) {
          console.error('Failed to sync analytics event:', error);
        }
      }

      // Clear stored events after successful sync
      localStorage.removeItem('careConnect_analytics');
    } catch (error) {
      console.error('Failed to sync stored analytics events:', error);
    }
  }

  // Generate analytics report
  generateReport(): any {
    const summary = this.getSessionSummary();
    const featureUsage = this.getFeatureUsageStats();
    const errorSummary = this.getErrorSummary();

    return {
      summary,
      featureUsage,
      errorSummary,
      recommendations: this.generateRecommendations(summary, featureUsage, errorSummary),
    };
  }

  private getFeatureUsageStats(): any {
    const stats: any = {};
    
    this.interactions.forEach(interaction => {
      if (!stats[interaction.feature]) {
        stats[interaction.feature] = {
          total: 0,
          successful: 0,
          averageDuration: 0,
          totalDuration: 0,
        };
      }
      
      stats[interaction.feature].total++;
      if (interaction.success) {
        stats[interaction.feature].successful++;
      }
      
      if (interaction.duration) {
        stats[interaction.feature].totalDuration += interaction.duration;
      }
    });

    // Calculate averages
    Object.keys(stats).forEach(feature => {
      if (stats[feature].total > 0) {
        stats[feature].averageDuration = stats[feature].totalDuration / stats[feature].total;
        stats[feature].successRate = (stats[feature].successful / stats[feature].total) * 100;
      }
    });

    return stats;
  }

  private getErrorSummary(): any {
    const errors: any = {};
    
    this.interactions.forEach(interaction => {
      if (interaction.error) {
        if (!errors[interaction.error]) {
          errors[interaction.error] = 0;
        }
        errors[interaction.error]++;
      }
    });

    return errors;
  }

  private generateRecommendations(summary: any, featureUsage: any, errorSummary: any): string[] {
    const recommendations: string[] = [];

    // Success rate recommendations
    if (summary.successRate < 80) {
      recommendations.push('Consider improving error handling and user guidance');
    }

    // Feature usage recommendations
    const underusedFeatures = Object.keys(featureUsage).filter(feature => 
      featureUsage[feature].total < 3
    );
    
    if (underusedFeatures.length > 0) {
      recommendations.push(`Promote usage of: ${underusedFeatures.join(', ')}`);
    }

    // Error-based recommendations
    const commonErrors = Object.keys(errorSummary).filter(error => 
      errorSummary[error] > 2
    );
    
    if (commonErrors.length > 0) {
      recommendations.push(`Address common errors: ${commonErrors.join(', ')}`);
    }

    // Performance recommendations
    const slowFeatures = Object.keys(featureUsage).filter(feature => 
      featureUsage[feature].averageDuration > 5000
    );
    
    if (slowFeatures.length > 0) {
      recommendations.push(`Optimize performance for: ${slowFeatures.join(', ')}`);
    }

    return recommendations;
  }
}

export const careConnectAnalytics = new CareConnectAnalytics();
export default careConnectAnalytics; 