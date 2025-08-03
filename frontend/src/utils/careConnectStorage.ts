// Care Connect Storage Utility - Handles offline data persistence

export interface StoredHealthWin {
  id: string;
  category: string;
  message: string;
  photo?: string;
  recipients: string[];
  timestamp: Date;
  synced: boolean;
}

export interface StoredHelpRequest {
  id: string;
  category: 'medication' | 'appointment' | 'health' | 'technology' | 'general';
  urgency: 'low' | 'medium' | 'high';
  message: string;
  voiceMessage?: string;
  recipients: string[];
  timestamp: Date;
  synced: boolean;
}

export interface StoredCheckinResponse {
  checkinId: string;
  response: string;
  responseType: 'voice' | 'text' | 'rating';
  rating?: number;
  timestamp: Date;
  synced: boolean;
}

class CareConnectStorage {
  private readonly KEYS = {
    HEALTH_WINS: 'careConnect_healthWins',
    HELP_REQUESTS: 'careConnect_helpRequests',
    CHECKIN_RESPONSES: 'careConnect_checkinResponses',
    FAMILY_MEMBERS: 'careConnect_familyMembers',
    RECENT_ACTIVITY: 'careConnect_recentActivity',
    SETTINGS: 'careConnect_settings',
  };

  // Health Wins
  saveHealthWin(healthWin: StoredHealthWin): void {
    try {
      const existing = this.getHealthWins();
      const updated = [healthWin, ...existing];
      localStorage.setItem(this.KEYS.HEALTH_WINS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving health win to storage:', error);
    }
  }

  getHealthWins(): StoredHealthWin[] {
    try {
      const data = localStorage.getItem(this.KEYS.HEALTH_WINS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading health wins from storage:', error);
      return [];
    }
  }

  markHealthWinSynced(id: string): void {
    try {
      const healthWins = this.getHealthWins();
      const updated = healthWins.map(win => 
        win.id === id ? { ...win, synced: true } : win
      );
      localStorage.setItem(this.KEYS.HEALTH_WINS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking health win as synced:', error);
    }
  }

  getUnsyncedHealthWins(): StoredHealthWin[] {
    return this.getHealthWins().filter(win => !win.synced);
  }

  // Help Requests
  saveHelpRequest(helpRequest: StoredHelpRequest): void {
    try {
      const existing = this.getHelpRequests();
      const updated = [helpRequest, ...existing];
      localStorage.setItem(this.KEYS.HELP_REQUESTS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving help request to storage:', error);
    }
  }

  getHelpRequests(): StoredHelpRequest[] {
    try {
      const data = localStorage.getItem(this.KEYS.HELP_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading help requests from storage:', error);
      return [];
    }
  }

  markHelpRequestSynced(id: string): void {
    try {
      const helpRequests = this.getHelpRequests();
      const updated = helpRequests.map(req => 
        req.id === id ? { ...req, synced: true } : req
      );
      localStorage.setItem(this.KEYS.HELP_REQUESTS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking help request as synced:', error);
    }
  }

  getUnsyncedHelpRequests(): StoredHelpRequest[] {
    return this.getHelpRequests().filter(req => !req.synced);
  }

  // Check-in Responses
  saveCheckinResponse(response: StoredCheckinResponse): void {
    try {
      const existing = this.getCheckinResponses();
      const updated = [response, ...existing];
      localStorage.setItem(this.KEYS.CHECKIN_RESPONSES, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving check-in response to storage:', error);
    }
  }

  getCheckinResponses(): StoredCheckinResponse[] {
    try {
      const data = localStorage.getItem(this.KEYS.CHECKIN_RESPONSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading check-in responses from storage:', error);
      return [];
    }
  }

  markCheckinResponseSynced(checkinId: string): void {
    try {
      const responses = this.getCheckinResponses();
      const updated = responses.map(resp => 
        resp.checkinId === checkinId ? { ...resp, synced: true } : resp
      );
      localStorage.setItem(this.KEYS.CHECKIN_RESPONSES, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking check-in response as synced:', error);
    }
  }

  getUnsyncedCheckinResponses(): StoredCheckinResponse[] {
    return this.getCheckinResponses().filter(resp => !resp.synced);
  }

  // Family Members
  saveFamilyMembers(familyMembers: any[]): void {
    try {
      localStorage.setItem(this.KEYS.FAMILY_MEMBERS, JSON.stringify(familyMembers));
    } catch (error) {
      console.error('Error saving family members to storage:', error);
    }
  }

  getFamilyMembers(): any[] {
    try {
      const data = localStorage.getItem(this.KEYS.FAMILY_MEMBERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading family members from storage:', error);
      return [];
    }
  }

  // Recent Activity
  saveRecentActivity(activity: any[]): void {
    try {
      localStorage.setItem(this.KEYS.RECENT_ACTIVITY, JSON.stringify(activity));
    } catch (error) {
      console.error('Error saving recent activity to storage:', error);
    }
  }

  getRecentActivity(): any[] {
    try {
      const data = localStorage.getItem(this.KEYS.RECENT_ACTIVITY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading recent activity from storage:', error);
      return [];
    }
  }

  // Settings
  saveSettings(settings: any): void {
    try {
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to storage:', error);
    }
  }

  getSettings(): any {
    try {
      const data = localStorage.getItem(this.KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        notificationsEnabled: true,
        voiceEnabled: true,
        autoSync: true,
      };
    } catch (error) {
      console.error('Error reading settings from storage:', error);
      return {
        notificationsEnabled: true,
        voiceEnabled: true,
        autoSync: true,
      };
    }
  }

  // Sync all unsynced data
  async syncAllData(): Promise<void> {
    try {
      const unsyncedHealthWins = this.getUnsyncedHealthWins();
      const unsyncedHelpRequests = this.getUnsyncedHelpRequests();
      const unsyncedCheckinResponses = this.getUnsyncedCheckinResponses();

      // Sync health wins
      for (const healthWin of unsyncedHealthWins) {
        try {
          await this.syncHealthWin(healthWin);
          this.markHealthWinSynced(healthWin.id);
        } catch (error) {
          console.error('Failed to sync health win:', healthWin.id, error);
        }
      }

      // Sync help requests
      for (const helpRequest of unsyncedHelpRequests) {
        try {
          await this.syncHelpRequest(helpRequest);
          this.markHelpRequestSynced(helpRequest.id);
        } catch (error) {
          console.error('Failed to sync help request:', helpRequest.id, error);
        }
      }

      // Sync check-in responses
      for (const response of unsyncedCheckinResponses) {
        try {
          await this.syncCheckinResponse(response);
          this.markCheckinResponseSynced(response.checkinId);
        } catch (error) {
          console.error('Failed to sync check-in response:', response.checkinId, error);
        }
      }
    } catch (error) {
      console.error('Error syncing all data:', error);
    }
  }

  private async syncHealthWin(healthWin: StoredHealthWin): Promise<void> {
    // This would call the actual API
    const response = await fetch('/api/care-connect/health-wins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(healthWin),
    });

    if (!response.ok) {
      throw new Error('Failed to sync health win');
    }
  }

  private async syncHelpRequest(helpRequest: StoredHelpRequest): Promise<void> {
    // This would call the actual API
    const response = await fetch('/api/care-connect/help-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(helpRequest),
    });

    if (!response.ok) {
      throw new Error('Failed to sync help request');
    }
  }

  private async syncCheckinResponse(response: StoredCheckinResponse): Promise<void> {
    // This would call the actual API
    const apiResponse = await fetch(`/api/care-connect/checkins/${response.checkinId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(response),
    });

    if (!apiResponse.ok) {
      throw new Error('Failed to sync check-in response');
    }
  }

  // Clear all data (for logout)
  clearAllData(): void {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing care connect data:', error);
    }
  }
}

export const careConnectStorage = new CareConnectStorage();
export default careConnectStorage; 