import React from 'react';
import styles from '../../../../styles/elder/CareConnect.module.css';

interface QuickSelectButtonsProps {
  options: string[];
  onSelect: (option: string) => void;
}

export default function QuickSelectButtons({ options, onSelect }: QuickSelectButtonsProps) {
  return (
    <div className={styles.quickSelectSection}>
      <h3 className={styles.quickSelectTitle}>Quick Select:</h3>
      <div className={styles.quickSelectGrid}>
        {options.map((option, index) => (
          <button
            key={index}
            className={styles.quickSelectButton}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
} 