// Care Connect Service - Handles all data operations for the Care Connect feature
 // Care Connect Service - Handles all data operations for the Care Connect feature

export interface FamilyMember {
    id: string;
    name: string;
    relationship: string;
    isOnline: boolean;
    avatar: string;
    lastSeen?: Date;
  }
  
  export interface HealthWin {
    id: string;
    userId: string;
    category: string;
    message: string;
    photo?: string;
    timestamp: Date;
    recipients: string[];
    celebrations: { userId: string; type: 'heart' | 'clap' | 'thumbs_up' }[];
  }
  
  export interface HelpRequest {
    id: string;
    userId: string;
    category: 'medication' | 'appointment' | 'health' | 'technology' | 'general';
    urgency: 'low' | 'medium' | 'high';
    message: string;
    voiceMessage?: string;
    recipients: string[];
    responses: { userId: string; message: string; timestamp: Date }[];
    status: 'pending' | 'responded' | 'resolved';
    timestamp: Date;
  }
  
  export interface HealthCheckin {
    id: string;
    fromUserId: string;
    fromUserName: string;
    question: string;
    response?: string;
    responseType: 'voice' | 'text' | 'rating';
    rating?: number;
    timestamp: Date;
    respondedAt?: Date;
  }
  
  export interface RecentActivity {
    id: string;
    type: 'win' | 'help' | 'checkin';
    message: string;
    timestamp: Date;
    familyMember: string;
  }
  
  class CareConnectService {
  private baseUrl = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 'http://localhost:5000';
  
  private getUserId(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user._id) {
      throw new Error('No valid user ID found. Please log in again.');
    }
    return user._id;
  }
  
    // Family Members
    async getFamilyMembers(): Promise<FamilyMember[]> {
      try {
        const response = await fetch(`${this.baseUrl}/api/care-connect/family-members?userId=${this.getUserId()}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch family members');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching family members:', error);
        // Fallback to mock data
        return [
          { id: '1', name: 'Sarah Johnson', relationship: 'Daughter', isOnline: true, avatar: 'SJ' },
          { id: '2', name: 'Michael Johnson', relationship: 'Son', isOnline: false, avatar: 'MJ' },
          { id: '3', name: 'Emma Johnson', relationship: 'Granddaughter', isOnline: true, avatar: 'EJ' },
        ];
      }
    }
  
    // Health Wins
    async shareHealthWin(healthWin: Omit<HealthWin, 'id' | 'timestamp'>): Promise<HealthWin> {
      try {
        const response = await fetch(`${this.baseUrl}/api/care-connect/health-wins`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...healthWin,
            userId: this.getUserId(),
            timestamp: new Date(),
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to share health win');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error sharing health win:', error);
        // Mock success response
        return {
          id: Date.now().toString(),
          userId: this.getUserId(),
          category: healthWin.category,
          message: healthWin.message,
          photo: healthWin.photo,
          timestamp: new Date(),
          recipients: healthWin.recipients,
          celebrations: [],
        };
      }
    }
  
    async getHealthWins(): Promise<HealthWin[]> {
      try {
        const response = await fetch(`${this.baseUrl}/api/care-connect/health-wins?userId=${this.getUserId()}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch health wins');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching health wins:', error);
        return [];
      }
    }
  
    // Help Requests
    async createHelpRequest(helpRequest: Omit<HelpRequest, 'id' | 'timestamp' | 'responses' | 'status'>): Promise<HelpRequest> {
      try {
        const response = await fetch(`${this.baseUrl}/api/care-connect/help-requests`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...helpRequest,
            userId: this.getUserId(),
            timestamp: new Date(),
            responses: [],
            status: 'pending',
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create help request');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error creating help request:', error);
        // Mock success response
        return {
          id: Date.now().toString(),
          userId: this.getUserId(),
          category: helpRequest.category,
          urgency: helpRequest.urgency,
          message: helpRequest.message,
          voiceMessage: helpRequest.voiceMessage,
          recipients: helpRequest.recipients,
          responses: [],
          status: 'pending',
          timestamp: new Date(),
        };
      }
    }
  
    async getHelpRequests(): Promise<HelpRequest[]> {
      try {
        const response = await fetch(`${this.baseUrl}/api/care-connect/help-requests?userId=${this.getUserId()}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch help requests');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching help requests:', error);
        return [];
      }
    }
  
    // Health Check-ins
    async getHealthCheckins(): Promise<HealthCheckin[]> {
      try {
        const response = await fetch(`${this.baseUrl}/api/care-connect/health-checkins?userId=${this.getUserId()}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch health check-ins');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching health check-ins:', error);
        // Only return an empty array on error, no mock data
        return [];
      }
    }
  
    async respondToCheckin(checkinId: string, response: {
      response: string;
      responseType: 'voice' | 'text' | 'rating';
      rating?: number;
    }): Promise<HealthCheckin> {
      try {
        const responseData = await fetch(`${this.baseUrl}/api/care-connect/health-checkins/${checkinId}/respond`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...response,
            respondedAt: new Date(),
          }),
        });
        
        if (!responseData.ok) {
          throw new Error('Failed to respond to check-in');
        }
        
        return await responseData.json();
      } catch (error) {
        console.error('Error responding to check-in:', error);
        // Mock success response
        return {
          id: checkinId,
          fromUserId: '1',
          fromUserName: 'Sarah Johnson',
          question: 'How are you feeling this week?',
          response: response.response,
          responseType: response.responseType,
          rating: response.rating,
          timestamp: new Date(),
          respondedAt: new Date(),
        };
      }
    }
  
    // Recent Activity
    async getRecentActivity(): Promise<RecentActivity[]> {
      try {
        const response = await fetch(`${this.baseUrl}/api/care-connect/data?userId=${this.getUserId()}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch recent activity');
        }
        
        const data = await response.json();
        return data.recentActivity || [];
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        // Mock data
        return [
          { id: '1', type: 'win', message: 'Went for a walk today', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), familyMember: 'Sarah Johnson' },
          { id: '2', type: 'help', message: 'Need help with medication schedule', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), familyMember: 'Michael Johnson' },
          { id: '3', type: 'checkin', message: 'Weekly health check-in', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), familyMember: 'Emma Johnson' },
        ];
      }
    }
  
    // Push Notifications
    async subscribeToNotifications(): Promise<void> {
      try {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          const registration = await navigator.serviceWorker.register('/sw.js');
                  const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: (typeof process !== 'undefined' && process.env?.REACT_APP_VAPID_PUBLIC_KEY) || '',
        });
  
          await fetch(`${this.baseUrl}/api/care-connect/notifications/subscribe`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              subscription,
              userId: this.getUserId(),
            }),
          });
        }
      } catch (error) {
        console.error('Error subscribing to notifications:', error);
      }
    }
  
    // Analytics
    async trackEvent(event: string, data?: any): Promise<void> {
      try {
        await fetch(`${this.baseUrl}/analytics/track`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event,
            data,
            userId: this.getUserId(),
            timestamp: new Date(),
          }),
        });
      } catch (error) {
        console.error('Error tracking event:', error);
      }
    }
  }
  
  export const careConnectService = new CareConnectService();
  export default careConnectService;