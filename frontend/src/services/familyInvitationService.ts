// Family Invitation Service - Handles inviting family members to the Care Connect platform

export interface FamilyInvitation {
  id: string;
  fromUserId: string;
  toEmail: string;
  toName: string;
  relationship: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
}

export interface FamilyMemberInvite {
  email: string;
  name: string;
  relationship: string;
  message?: string;
}

export interface InvitationTemplate {
  id: string;
  title: string;
  message: string;
  category: 'general' | 'health' | 'care' | 'support';
}

class FamilyInvitationService {
  private baseUrl = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 'http://localhost:5000';
  
  private getUserId(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user._id) {
      throw new Error('No valid user ID found. Please log in again.');
    }
    return user._id;
  }

  // Send invitation to family member
  async sendInvitation(invite: FamilyMemberInvite): Promise<FamilyInvitation> {
    try {
      // Generate unique invitation ID
      const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create invitation link
      const invitationLink = `${window.location.origin}/invitation/${invitationId}`;
      
      // Get current user info
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const fromName = currentUser.name || 'Your Family Member';
      
      const response = await fetch(`${this.baseUrl}/api/family/invitations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...invite,
          fromUserId: this.getUserId(),
          invitationId,
          invitationLink,
          fromName,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }

      const invitation = await response.json();
      
      // Send email invitation
      await this.sendEmailInvitation({
        toEmail: invite.email,
        toName: invite.name,
        fromName,
        invitationLink,
        message: invite.message,
        expiresAt: invitation.expiresAt,
      });

      return invitation;
    } catch (error) {
      console.error('Error sending invitation:', error);
      // Mock success response for demo
      return {
        id: Date.now().toString(),
        fromUserId: this.getUserId(),
        toEmail: invite.email,
        toName: invite.name,
        relationship: invite.relationship,
        message: invite.message,
        status: 'pending',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
    }
  }

  // Send email invitation
  private async sendEmailInvitation(emailData: {
    toEmail: string;
    toName: string;
    fromName: string;
    invitationLink: string;
    message?: string;
    expiresAt: Date;
  }) {
    try {
              const response = await fetch(`${this.baseUrl}/api/family/email/send-invitation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('Failed to send email invitation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending email invitation:', error);
      // In demo mode, log the email details
      console.log('Email invitation would be sent:', emailData);
    }
  }

  // Get pending invitations
  async getPendingInvitations(): Promise<FamilyInvitation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/family/invitations?fromUserId=${this.getUserId()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending invitations');
      }

      const invitations = await response.json();
      return invitations.filter(inv => inv.status === 'pending');
    } catch (error) {
      console.error('Error fetching pending invitations:', error);
      return [];
    }
  }

  // Cancel invitation
  async cancelInvitation(invitationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/family/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel invitation');
      }
    } catch (error) {
      console.error('Error canceling invitation:', error);
    }
  }

  // Resend invitation
  async resendInvitation(invitationId: string): Promise<FamilyInvitation> {
    try {
      const response = await fetch(`${this.baseUrl}/api/family/invitations/${invitationId}/resend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to resend invitation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error resending invitation:', error);
      throw error;
    }
  }

  // Get invitation templates
  async getInvitationTemplates(): Promise<InvitationTemplate[]> {
    // Return default templates (backend doesn't have this endpoint yet)
    return [
      {
        id: '1',
        title: 'General Care Support',
        message: 'Hi! I\'d love to have you join my Care Connect family circle. This will help us stay connected and support each other better.',
        category: 'general',
      },
      {
        id: '2',
        title: 'Health Monitoring',
        message: 'I\'m using Care Connect to track my health and would appreciate your support. You can help me stay on top of my health goals.',
        category: 'health',
      },
      {
        id: '3',
        title: 'Daily Check-ins',
        message: 'I\'d like to set up regular check-ins through Care Connect. This will help us stay connected and ensure I\'m doing well.',
        category: 'care',
      },
      {
        id: '4',
        title: 'Emergency Support',
        message: 'I\'m setting up emergency contacts in Care Connect and would like to add you. This will help in case I need assistance.',
        category: 'support',
      },
    ];
  }

  // Send bulk invitations
  async sendBulkInvitations(invites: FamilyMemberInvite[]): Promise<FamilyInvitation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/family/invitations/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invites: invites.map(invite => ({
            ...invite,
            fromUserId: this.getUserId(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send bulk invitations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending bulk invitations:', error);
      // Mock success responses
      return invites.map((invite, index) => ({
        id: (Date.now() + index).toString(),
        fromUserId: this.getUserId(),
        toEmail: invite.email,
        toName: invite.name,
        relationship: invite.relationship,
        message: invite.message,
        status: 'pending',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }));
    }
  }

  // Get invitation statistics
  async getInvitationStats(): Promise<{
    total: number;
    pending: number;
    accepted: number;
    declined: number;
    expired: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/family/invitations/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invitation stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching invitation stats:', error);
      return {
        total: 0,
        pending: 0,
        accepted: 0,
        declined: 0,
        expired: 0,
      };
    }
  }
}

export const familyInvitationService = new FamilyInvitationService();
export default familyInvitationService; 