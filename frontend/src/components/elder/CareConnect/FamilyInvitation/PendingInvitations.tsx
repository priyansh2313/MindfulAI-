import React from 'react';
import { ArrowLeft, Mail, Clock, CheckCircle, X, RefreshCw } from 'lucide-react';
import styles from '../../../../styles/elder/CareConnect.module.css';
import { FamilyInvitation } from '../../../../services/familyInvitationService';

interface PendingInvitationsProps {
  invitations: FamilyInvitation[];
  onCancelInvitation: (invitationId: string) => Promise<void>;
  onResendInvitation: (invitationId: string) => Promise<void>;
  onBack: () => void;
}

export default function PendingInvitations({
  invitations,
  onCancelInvitation,
  onResendInvitation,
  onBack
}: PendingInvitationsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'accepted':
        return '#10b981';
      case 'declined':
        return '#ef4444';
      case 'expired':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className={styles.statusIcon} />;
      case 'accepted':
        return <CheckCircle className={styles.statusIcon} />;
      case 'declined':
        return <X className={styles.statusIcon} />;
      case 'expired':
        return <Clock className={styles.statusIcon} />;
      default:
        return <Clock className={styles.statusIcon} />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt: Date) => {
    return new Date(expiresAt) < new Date();
  };

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  const otherInvitations = invitations.filter(inv => inv.status !== 'pending');

  return (
    <div className={styles.pendingInvitationsContainer}>
      <div className={styles.pendingHeader}>
        <button 
          className={styles.backButton}
          onClick={onBack}
        >
          <ArrowLeft className={styles.backIcon} />
          Back
        </button>
        
        <div className={styles.pendingHeaderContent}>
          <h2 className={styles.pendingHeaderTitle}>Pending Invitations</h2>
          <p className={styles.pendingHeaderSubtitle}>
            Track and manage your family invitations
          </p>
        </div>
      </div>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <div className={styles.pendingSection}>
          <h3 className={styles.pendingSectionTitle}>
            <Clock className={styles.pendingSectionIcon} />
            Pending ({pendingInvitations.length})
          </h3>
          
          <div className={styles.invitationsList}>
            {pendingInvitations.map((invitation) => (
              <div key={invitation.id} className={styles.invitationCard}>
                <div className={styles.invitationCardHeader}>
                  <div className={styles.invitationInfo}>
                    <h4 className={styles.invitationName}>{invitation.toName}</h4>
                    <p className={styles.invitationEmail}>{invitation.toEmail}</p>
                    <p className={styles.invitationRelationship}>{invitation.relationship}</p>
                  </div>
                  
                  <div className={styles.invitationStatus}>
                    <div 
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(invitation.status) }}
                    >
                      {getStatusIcon(invitation.status)}
                      <span className={styles.statusText}>
                        {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {invitation.message && (
                  <div className={styles.invitationMessage}>
                    <p className={styles.messageText}>{invitation.message}</p>
                  </div>
                )}

                <div className={styles.invitationMeta}>
                  <div className={styles.invitationDate}>
                    <Mail className={styles.metaIcon} />
                    Sent: {formatDate(invitation.createdAt)}
                  </div>
                  
                  <div className={styles.invitationExpiry}>
                    <Clock className={styles.metaIcon} />
                    {isExpired(invitation.expiresAt) ? (
                      <span className={styles.expiredText}>Expired</span>
                    ) : (
                      <span>Expires: {formatDate(invitation.expiresAt)}</span>
                    )}
                  </div>
                </div>

                <div className={styles.invitationActions}>
                  {!isExpired(invitation.expiresAt) && (
                    <button
                      className={styles.resendButton}
                      onClick={() => onResendInvitation(invitation.id)}
                    >
                      <RefreshCw className={styles.resendIcon} />
                      Resend
                    </button>
                  )}
                  
                  <button
                    className={styles.cancelButton}
                    onClick={() => onCancelInvitation(invitation.id)}
                  >
                    <X className={styles.cancelIcon} />
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Invitations */}
      {otherInvitations.length > 0 && (
        <div className={styles.otherSection}>
          <h3 className={styles.otherSectionTitle}>
            <CheckCircle className={styles.otherSectionIcon} />
            Other Invitations ({otherInvitations.length})
          </h3>
          
          <div className={styles.invitationsList}>
            {otherInvitations.map((invitation) => (
              <div key={invitation.id} className={styles.invitationCard}>
                <div className={styles.invitationCardHeader}>
                  <div className={styles.invitationInfo}>
                    <h4 className={styles.invitationName}>{invitation.toName}</h4>
                    <p className={styles.invitationEmail}>{invitation.toEmail}</p>
                    <p className={styles.invitationRelationship}>{invitation.relationship}</p>
                  </div>
                  
                  <div className={styles.invitationStatus}>
                    <div 
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(invitation.status) }}
                    >
                      {getStatusIcon(invitation.status)}
                      <span className={styles.statusText}>
                        {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {invitation.message && (
                  <div className={styles.invitationMessage}>
                    <p className={styles.messageText}>{invitation.message}</p>
                  </div>
                )}

                <div className={styles.invitationMeta}>
                  <div className={styles.invitationDate}>
                    <Mail className={styles.metaIcon} />
                    Sent: {formatDate(invitation.createdAt)}
                  </div>
                  
                  {invitation.acceptedAt && (
                    <div className={styles.invitationAccepted}>
                      <CheckCircle className={styles.metaIcon} />
                      Accepted: {formatDate(invitation.acceptedAt)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {invitations.length === 0 && (
        <div className={styles.emptyState}>
          <Mail className={styles.emptyStateIcon} />
          <h3 className={styles.emptyStateTitle}>No Invitations Yet</h3>
          <p className={styles.emptyStateMessage}>
            You haven't sent any invitations yet. Start by inviting your family members to join your Care Connect circle.
          </p>
        </div>
      )}

      {/* Summary */}
      {invitations.length > 0 && (
        <div className={styles.invitationsSummary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total:</span>
            <span className={styles.summaryValue}>{invitations.length}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Pending:</span>
            <span className={styles.summaryValue}>{pendingInvitations.length}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Accepted:</span>
            <span className={styles.summaryValue}>
              {invitations.filter(inv => inv.status === 'accepted').length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 