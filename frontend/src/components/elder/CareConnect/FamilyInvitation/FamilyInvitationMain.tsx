import { ArrowLeft, Clock, Mail, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import familyInvitationService, { FamilyInvitation, FamilyMemberInvite } from '../../../../services/familyInvitationService';
import styles from '../../../../styles/elder/CareConnect.module.css';
import InvitationForm from './InvitationForm';
import InvitationSuccess from './InvitationSuccess';
import InvitationTemplates from './InvitationTemplates';
import PendingInvitations from './PendingInvitations';

interface FamilyInvitationMainProps {
  onComplete?: () => void;
}

type InvitationStep = 'form' | 'templates' | 'pending' | 'success';

export default function FamilyInvitationMain({ onComplete }: FamilyInvitationMainProps) {
  const [currentStep, setCurrentStep] = useState<InvitationStep>('form');
  const [invitations, setInvitations] = useState<FamilyInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load pending invitations on mount
  useEffect(() => {
    loadPendingInvitations();
  }, []);

  const loadPendingInvitations = async () => {
    try {
      const pendingInvitations = await familyInvitationService.getPendingInvitations();
      setInvitations(pendingInvitations);
    } catch (error) {
      console.error('Error loading pending invitations:', error);
    }
  };

  const handleSendInvitation = async (invite: FamilyMemberInvite) => {
    setLoading(true);
    setError(null);

    try {
      const newInvitation = await familyInvitationService.sendInvitation(invite);
      setInvitations(prev => [newInvitation, ...prev]);
      setCurrentStep('success');
    } catch (error) {
      setError('Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendBulkInvitations = async (invites: FamilyMemberInvite[]) => {
    setLoading(true);
    setError(null);

    try {
      const newInvitations = await familyInvitationService.sendBulkInvitations(invites);
      setInvitations(prev => [...newInvitations, ...prev]);
      setCurrentStep('success');
    } catch (error) {
      setError('Failed to send invitations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await familyInvitationService.cancelInvitation(invitationId);
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (error) {
      console.error('Error canceling invitation:', error);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      await familyInvitationService.resendInvitation(invitationId);
      // Update the invitation with new expiry date
      setInvitations(prev => prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
          : inv
      ));
    } catch (error) {
      console.error('Error resending invitation:', error);
    }
  };

  const handleBack = () => {
    if (currentStep === 'success') {
      setCurrentStep('form');
    } else if (currentStep === 'templates') {
      setCurrentStep('form');
    } else if (currentStep === 'pending') {
      setCurrentStep('form');
    }
  };

  const handleComplete = () => {
    if (onComplete) onComplete();
  };

  return (
    <div className={styles.familyInvitationContainer}>
      {/* Header */}
      <div className={styles.invitationHeader}>
        <button 
          className={styles.backButton}
          onClick={currentStep === 'form' ? handleComplete : handleBack}
        >
          <ArrowLeft className={styles.backIcon} />
          Back
        </button>
        
        <div className={styles.invitationHeaderContent}>
          <div className={styles.invitationHeaderIcon}>
            <Mail className={styles.invitationHeaderIconInner} />
          </div>
          <div className={styles.invitationHeaderText}>
            <h1 className={styles.invitationHeaderTitle}>Invite Family Members</h1>
            <p className={styles.invitationHeaderSubtitle}>
              Connect with your family to share health updates and get support
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className={styles.progressSteps}>
        <div className={`${styles.progressStep} ${currentStep === 'form' ? styles.active : ''}`}>
          <div className={styles.progressNumber}>1</div>
          <div className={styles.progressLabel}>Invite Family</div>
        </div>
        <div className={`${styles.progressStep} ${currentStep === 'templates' ? styles.active : ''}`}>
          <div className={styles.progressNumber}>2</div>
          <div className={styles.progressLabel}>Choose Template</div>
        </div>
        <div className={`${styles.progressStep} ${currentStep === 'pending' ? styles.active : ''}`}>
          <div className={styles.progressNumber}>3</div>
          <div className={styles.progressLabel}>Track Invites</div>
        </div>
        <div className={`${styles.progressStep} ${currentStep === 'success' ? styles.active : ''}`}>
          <div className={styles.progressNumber}>4</div>
          <div className={styles.progressLabel}>Success</div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className={styles.errorMessage}>
          <X className={styles.errorIcon} />
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className={styles.stepContent}>
        {currentStep === 'form' && (
          <InvitationForm
            onSendInvitation={handleSendInvitation}
            onSendBulkInvitations={handleSendBulkInvitations}
            onShowTemplates={() => setCurrentStep('templates')}
            onShowPending={() => setCurrentStep('pending')}
            loading={loading}
            invitationsCount={invitations.length}
          />
        )}

        {currentStep === 'templates' && (
          <InvitationTemplates
            onSelectTemplate={(template) => {
              setCurrentStep('form');
              // Pass template to form
            }}
            onBack={() => setCurrentStep('form')}
          />
        )}

        {currentStep === 'pending' && (
          <PendingInvitations
            invitations={invitations}
            onCancelInvitation={handleCancelInvitation}
            onResendInvitation={handleResendInvitation}
            onBack={() => setCurrentStep('form')}
          />
        )}

        {currentStep === 'success' && (
          <InvitationSuccess
            onInviteMore={() => setCurrentStep('form')}
            onViewPending={() => setCurrentStep('pending')}
            onComplete={handleComplete}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button 
          className={styles.quickActionButton}
          onClick={() => setCurrentStep('pending')}
        >
          <Clock className={styles.quickActionIcon} />
          View Pending ({invitations.filter(inv => inv.status === 'pending').length})
        </button>
        
        <button 
          className={styles.quickActionButton}
          onClick={() => setCurrentStep('templates')}
        >
          <Users className={styles.quickActionIcon} />
          Invitation Templates
        </button>
      </div>
    </div>
  );
} 