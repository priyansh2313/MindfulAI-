import { ArrowLeft, CheckCircle, Heart, ThumbsUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styles from '../../../../styles/elder/CareConnect.module.css';

interface SuccessConfirmationProps {
  onComplete?: () => void;
}

export default function SuccessConfirmation({ onComplete }: SuccessConfirmationProps) {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    setShowCelebration(true);
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={styles.successContainer}>
      <div className={styles.successContent}>
        <div className={`${styles.successIcon} ${showCelebration ? styles.animate : ''}`}>
          <CheckCircle className={styles.successIconInner} />
        </div>
        
        <h1 className={styles.successTitle}>Health Win Shared!</h1>
        <p className={styles.successMessage}>
          Your family has been notified of your achievement. They'll be so proud of you!
        </p>

        <div className={styles.celebrationIcons}>
          <Heart className={`${styles.celebrationIcon} ${styles.heart}`} />
          <ThumbsUp className={`${styles.celebrationIcon} ${styles.thumbsUp}`} />
          <Clap className={`${styles.celebrationIcon} ${styles.clap}`} />
        </div>

        <div className={styles.successActions}>
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