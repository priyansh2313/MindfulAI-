import { Activity, Apple, BookOpen, Brain, Heart, Music, Pill, Users } from 'lucide-react';
import React from 'react';
import styles from '../../../../styles/elder/CareConnect.module.css';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onNext: () => void;
}

const categories = [
  { id: 'exercise', name: 'Exercise & Activity', icon: <Activity className={styles.categoryIcon} />, color: '#16a34a' },
  { id: 'medication', name: 'Medication', icon: <Pill className={styles.categoryIcon} />, color: '#2563eb' },
  { id: 'social', name: 'Social Connection', icon: <Users className={styles.categoryIcon} />, color: '#7c3aed' },
  { id: 'nutrition', name: 'Healthy Eating', icon: <Apple className={styles.categoryIcon} />, color: '#ea580c' },
  { id: 'mental', name: 'Mental Wellness', icon: <Brain className={styles.categoryIcon} />, color: '#dc2626' },
  { id: 'relaxation', name: 'Relaxation', icon: <Music className={styles.categoryIcon} />, color: '#0891b2' },
  { id: 'learning', name: 'Learning', icon: <BookOpen className={styles.categoryIcon} />, color: '#059669' },
  { id: 'general', name: 'General Wellness', icon: <Heart className={styles.categoryIcon} />, color: '#be185d' },
];

export default function CategorySelector({ selectedCategory, onCategorySelect, onNext }: CategorySelectorProps) {
  return (
    <div className={styles.categorySelector}>
      <h2 className={styles.categoryTitle}>What type of health win?</h2>
      <p className={styles.categorySubtitle}>Choose a category that best describes your achievement</p>
      
      <div className={styles.categoryGrid}>
        {categories.map(category => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.selected : ''}`}
            onClick={() => onCategorySelect(category.id)}
            style={{ '--category-color': category.color } as React.CSSProperties}
          >
            <div className={styles.categoryButtonIcon}>
              {category.icon}
            </div>
            <span className={styles.categoryButtonText}>{category.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.categoryActions}>
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