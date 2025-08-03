import { AlertCircle, AlertTriangle, Clock } from 'lucide-react';
import React from 'react';
import styles from '../../../../styles/elder/CareConnect.module.css';

interface UrgencySelectorProps {
  selectedUrgency: string;
  onUrgencySelect: (urgency: string) => void;
  onNext: () => void;
}

const urgencyLevels = [
  {
    id: 'low',
    name: 'Low Urgency',
    description: 'Can wait a few hours or until tomorrow',
    icon: <Clock className={styles.urgencyIcon} />,
    color: '#16a34a',
    bgColor: '#dcfce7'
  },
  {
    id: 'medium',
    name: 'Medium Urgency',
    description: 'Need help within a few hours',
    icon: <AlertCircle className={styles.urgencyIcon} />,
    color: '#eab308',
    bgColor: '#fef3c7'
  },
  {
    id: 'high',
    name: 'High Urgency',
    description: 'Need immediate assistance',
    icon: <AlertTriangle className={styles.urgencyIcon} />,
    color: '#dc2626',
    bgColor: '#fee2e2'
  }
];

export default function UrgencySelector({ selectedUrgency, onUrgencySelect, onNext }: UrgencySelectorProps) {
  return (
    <div className={styles.urgencySelector}>
      <h2 className={styles.urgencyTitle}>How urgent is your request?</h2>
      <p className={styles.urgencySubtitle}>This helps your family prioritize their response</p>
      
      <div className={styles.urgencyGrid}>
        {urgencyLevels.map(urgency => (
          <button
            key={urgency.id}
            className={`${styles.urgencyButton} ${selectedUrgency === urgency.id ? styles.selected : ''}`}
            onClick={() => onUrgencySelect(urgency.id)}
            style={{ 
              '--urgency-color': urgency.color,
              '--urgency-bg': urgency.bgColor
            } as React.CSSProperties}
          >
            <div className={styles.urgencyButtonIcon}>
              {urgency.icon}
            </div>
            <div className={styles.urgencyButtonContent}>
              <h3 className={styles.urgencyButtonTitle}>{urgency.name}</h3>
              <p className={styles.urgencyButtonDescription}>{urgency.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.urgencyActions}>
        <button 
          className={styles.nextButton}
          onClick={onNext}
          disabled={!selectedUrgency}
        >
          Next
        </button>
      </div>
    </div>
  );
} 