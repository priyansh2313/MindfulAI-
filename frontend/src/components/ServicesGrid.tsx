import { Activity, Book, Brain, ClipboardCheck, Heart, MessageSquareHeart, Music, Sparkles, Users } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ServicesGrid.module.css';

const assessmentServices = [
  { title: 'Evaluation Test', desc: 'Take a comprehensive mental wellness assessment', icon: <ClipboardCheck className={styles.serviceIcon} />, path: '/evaluation' },
  { title: 'Mindful Test', desc: 'A unique blend of face,text and voice analysis', icon: <MessageSquareHeart className={styles.serviceIcon} />, path: '/assistant' },
];

const wellnessServices = [
  { title: 'Journal', desc: 'Record your thoughts and track your journey', icon: <Book className={styles.serviceIcon} />, path: '/journal' },
  { title: 'Community Chat', desc: 'Connect with others on similar paths', icon: <Users className={styles.serviceIcon} />, path: '/community' },
  { title: 'Peaceful Music', desc: 'Listen to calming sounds and meditation', icon: <Music className={styles.serviceIcon} />, path: '/music' },
  { title: 'Encyclopedia', desc: 'Learn about mental health and wellness', icon: <Brain className={styles.serviceIcon} />, path: '/encyclopedia' },
  { title: 'Daily Activities', desc: 'Mindfulness exercises and practices', icon: <Activity className={styles.serviceIcon} />, path: '/daily-activities' },
];

export default function ServicesGrid({ onCardHover, onCardLeave }: { onCardHover?: (title: string) => void, onCardLeave?: () => void }) {
  const navigate = useNavigate();
  
  return (
    <div className={styles.servicesContainer}>
      {/* Assessment & Analysis Section */}
      <div className={styles.serviceSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIconContainer}>
            <div className={styles.sectionIcon}>
              <Sparkles className={styles.sectionIconInner} />
            </div>
          </div>
          <h2 className={styles.sectionTitle}>
            Assessment & Analysis
          </h2>
          <p className={styles.sectionSubtitle}>
            Understand your mental wellness journey through comprehensive assessments and AI-powered insights
          </p>
        </div>
        
        <div className={styles.assessmentGrid}>
          {assessmentServices.map(service => (
            <div
              key={service.title}
              className={styles.serviceCard}
              onClick={() => navigate(service.path)}
              onMouseEnter={() => onCardHover && onCardHover(service.title)}
              onMouseLeave={() => onCardLeave && onCardLeave()}
            >
              <div className={styles.serviceIconWrapper}>
                <div className={styles.serviceIconInner}>
                  {service.icon}
                </div>
              </div>
              <h3 className={styles.serviceCardTitle}>{service.title}</h3>
              <p className={styles.serviceCardText}>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness & Healing Section */}
      <div className={styles.serviceSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIconContainer}>
            <div className={styles.sectionIcon}>
              <Heart className={styles.sectionIconInner} />
            </div>
          </div>
          <h2 className={styles.sectionTitle}>
            Wellness & Healing
          </h2>
          <p className={styles.sectionSubtitle}>
            Nurture your mental health through guided practices, community support, and therapeutic activities
          </p>
        </div>
        
        <div className={styles.wellnessGrid}>
          {wellnessServices.map(service => (
            <div
              key={service.title}
              className={styles.serviceCard}
              onClick={() => navigate(service.path)}
              onMouseEnter={() => onCardHover && onCardHover(service.title)}
              onMouseLeave={() => onCardLeave && onCardLeave()}
            >
              <div className={styles.serviceIconWrapper}>
                <div className={styles.serviceIconInner}>
                  {service.icon}
                </div>
              </div>
              <h3 className={styles.serviceCardTitle}>{service.title}</h3>
              <p className={styles.serviceCardText}>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}