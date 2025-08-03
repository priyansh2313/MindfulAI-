import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import careConnectService, {
    FamilyMember,
    HealthCheckin,
    HelpRequest,
    RecentActivity
} from '../services/careConnectService';

export const useCareConnect = () => {
  const user = useSelector((state: any) => state.user);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [members, activity] = await Promise.all([
        careConnectService.getFamilyMembers(),
        careConnectService.getRecentActivity(),
      ]);
      
      setFamilyMembers(members);
      setRecentActivity(activity);
    } catch (err) {
      setError('Failed to load family data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Share Health Win
  const shareHealthWin = useCallback(async (data: {
    category: string;
    message: string;
    photo?: string;
    recipients: string[];
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const healthWin = await careConnectService.shareHealthWin(data);
      
      // Track analytics
      await careConnectService.trackEvent('health_win_shared', {
        category: data.category,
        recipientsCount: data.recipients.length,
      });
      
      // Update recent activity
      setRecentActivity(prev => [{
        id: healthWin.id,
        type: 'win',
        message: data.message,
        timestamp: new Date(),
        familyMember: 'You',
      }, ...prev.slice(0, 9)]);
      
      return healthWin;
    } catch (err) {
      setError('Failed to share health win');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Ask for Help
  const createHelpRequest = useCallback(async (data: {
    category: HelpRequest['category'];
    urgency: HelpRequest['urgency'];
    message: string;
    voiceMessage?: string;
    recipients: string[];
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const helpRequest = await careConnectService.createHelpRequest(data);
      
      // Track analytics
      await careConnectService.trackEvent('help_request_created', {
        category: data.category,
        urgency: data.urgency,
        recipientsCount: data.recipients.length,
      });
      
      // Update recent activity
      setRecentActivity(prev => [{
        id: helpRequest.id,
        type: 'help',
        message: data.message,
        timestamp: new Date(),
        familyMember: 'You',
      }, ...prev.slice(0, 9)]);
      
      return helpRequest;
    } catch (err) {
      setError('Failed to create help request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get Health Check-ins
  const getHealthCheckins = useCallback(async (): Promise<HealthCheckin[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const checkins = await careConnectService.getHealthCheckins();
      return checkins;
    } catch (err) {
      setError('Failed to load health check-ins');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Respond to Check-in
  const respondToCheckin = useCallback(async (checkinId: string, response: {
    response: string;
    responseType: 'voice' | 'text' | 'rating';
    rating?: number;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCheckin = await careConnectService.respondToCheckin(checkinId, response);
      
      // Track analytics
      await careConnectService.trackEvent('checkin_responded', {
        responseType: response.responseType,
        hasRating: !!response.rating,
      });
      
      return updatedCheckin;
    } catch (err) {
      setError('Failed to respond to check-in');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to notifications
  const subscribeToNotifications = useCallback(async () => {
    try {
      await careConnectService.subscribeToNotifications();
    } catch (err) {
      console.error('Failed to subscribe to notifications:', err);
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    // State
    familyMembers,
    recentActivity,
    loading,
    error,
    user,
    
    // Actions
    shareHealthWin,
    createHelpRequest,
    getHealthCheckins,
    respondToCheckin,
    subscribeToNotifications,
    refreshData,
  };
}; 