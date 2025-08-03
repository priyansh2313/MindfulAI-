import React from 'react';
import { Pill, Calendar, Heart, Smartphone, HelpCircle } from 'lucide-react';
import styles from '../../../../styles/elder/CareConnect.module.css';

interface HelpCategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onNext: () => void;
}

const helpCategories = [
  { 
    id: 'medication', 
    name: 'Medication Questions', 
    description: 'Help with prescriptions, dosages, or side effects',
    icon: <Pill className={styles.helpCategoryIcon} />, 
    color: '#2563eb' 
  },
  { 
    id: 'appointment', 
    name: 'Appointment Help', 
    description: 'Scheduling, transportation, or preparation',
    icon: <Calendar className={styles.helpCategoryIcon} />, 
    color: '#7c3aed' 
  },
  { 
    id: 'health', 
    name: 'Health Concerns', 
    description: 'Symptoms, pain, or general health questions',
    icon: <Heart className={styles.helpCategoryIcon} />, 
    color: '#dc2626' 
  },
  { 
    id: 'technology', 
    name: 'Technology Support', 
    description: 'Help with devices, apps, or online services',
    icon: <Smartphone className={styles.helpCategoryIcon} />, 
    color: '#0891b2' 
  },
  { 
    id: 'general', 
    name: 'General Support', 
    description: 'Other questions or assistance needed',
    icon: <HelpCircle className={styles.helpCategoryIcon} />, 
    color: '#059669' 
  },
];

export default function HelpCategorySelector({ selectedCategory, onCategorySelect, onNext }: HelpCategorySelectorProps) {
  return (
    <div className={styles.helpCategorySelector}>
      <h2 className={styles.helpCategoryTitle}>What type of help do you need?</h2>
      <p className={styles.helpCategorySubtitle}>Choose the category that best describes your request</p>
      
      <div className={styles.helpCategoryGrid}>
        {helpCategories.map(category => (
          <button
            key={category.id}
            className={`${styles.helpCategoryButton} ${selectedCategory === category.id ? styles.selected : ''}`}
            onClick={() => onCategorySelect(category.id)}
            style={{ '--category-color': category.color } as React.CSSProperties}
          >
            <div className={styles.helpCategoryButtonIcon}>
              {category.icon}
            </div>
            <div className={styles.helpCategoryButtonContent}>
              <h3 className={styles.helpCategoryButtonTitle}>{category.name}</h3>
              <p className={styles.helpCategoryButtonDescription}>{category.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.helpCategoryActions}>
        <button 
          className={styles.nextButton}
          onClick={onNext}
          disabled={!selectedCategory}
        >
          Next
        </button>
      </div>
    </div>
  );
} 