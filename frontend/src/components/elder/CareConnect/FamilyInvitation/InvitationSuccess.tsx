import React from 'react';
import { CheckCircle, Mail, Users, ArrowLeft } from 'lucide-react';
import styles from '../../../../styles/elder/CareConnect.module.css';

interface InvitationSuccessProps {
  onInviteMore: () => void;
  onViewPending: () => void;
  onComplete: () => void;
}

export default function InvitationSuccess({
  onInviteMore,
  onViewPending,
  onComplete
}: InvitationSuccessProps) {
  return (
    <div className={styles.successContainer}>
      <div className={styles.successContent}>
        <div className={`${styles.successIcon} ${styles.animate}`}>
          <CheckCircle className={styles.successIconInner} />
        </div>
        
        <h2 className={styles.successTitle}>Invitations Sent Successfully!</h2>
        <p className={styles.successMessage}>
          Your family members will receive email invitations to join your Care Connect circle. 
          They can accept the invitation to start staying connected with you.
        </p>

        <div className={styles.celebrationIcons}>
          <div className={`${styles.celebrationIcon} ${styles.heart}`}>❤️</div>
          <div className={`${styles.celebrationIcon} ${styles.thumbsUp}`}>👍</div>
          <div className={`${styles.celebrationIcon} ${styles.clap}`}>👏</div>
        </div>

        <div className={styles.successActions}>
          <button 
            className={styles.successActionButton}
            onClick={onInviteMore}
          >
            <Users className={styles.successActionIcon} />
            Invite More Family
          </button>

          <button 
            className={styles.successActionButton}
            onClick={onViewPending}
          >
            <Mail className={styles.successActionIcon} />
            View Pending Invitations
          </button>

          <button 
            className={styles.backToDashboardButton}
            onClick={onComplete}
          >
            <ArrowLeft className={styles.backIcon} />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
} 