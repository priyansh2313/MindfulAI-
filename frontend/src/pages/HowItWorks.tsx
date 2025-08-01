import {
  Activity,
  ArrowRight,
  Book, Brain,
  CheckCircle,
  ClipboardCheck,
  Heart,
  Lightbulb,
  MessageSquareHeart, Music,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/HowItWorks.module.css';

const HowItWorks = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('assessment');

  const features = {
    assessment: {
      title: "Assessment & Analysis",
      subtitle: "Understand Your Mental Wellness Journey",
      icon: <Sparkles className={styles.sectionIcon} />,
      color: "assessment",
      features: [
        {
          title: "Evaluation Test",
          description: "Take a comprehensive mental wellness assessment to understand your current state",
          benefits: [
            "Identify areas of strength and growth",
            "Get personalized insights about your mental health",
            "Track your progress over time",
            "Receive evidence-based recommendations"
          ],
          icon: <ClipboardCheck className={styles.featureIcon} />,
          action: () => navigate('/evaluation')
        },
        {
          title: "Mindful Assistant",
          description: "Get personalized AI support and guidance for your mental wellness journey",
          benefits: [
            "24/7 AI-powered mental health support",
            "Personalized conversations and guidance",
            "Crisis intervention and immediate help",
            "Evidence-based therapeutic techniques"
          ],
          icon: <MessageSquareHeart className={styles.featureIcon} />,
          action: () => navigate('/assistant')
        }
      ]
    },
    wellness: {
      title: "Wellness & Healing",
      subtitle: "Nurture Your Mental Health Through Guided Practices",
      icon: <Heart className={styles.sectionIcon} />,
      color: "wellness",
      features: [
        {
          title: "Journal",
          description: "Record your thoughts and track your emotional journey",
          benefits: [
            "Express and process your emotions safely",
            "Track patterns in your mood and thoughts",
            "Gain insights into your mental health journey",
            "Build self-awareness and emotional intelligence"
          ],
          icon: <Book className={styles.featureIcon} />,
          action: () => navigate('/journal')
        },
        {
          title: "Community Chat",
          description: "Connect with others on similar mental wellness journeys",
          benefits: [
            "Find support from people who understand",
            "Share experiences and learn from others",
            "Build meaningful connections",
            "Reduce feelings of isolation"
          ],
          icon: <Users className={styles.featureIcon} />,
          action: () => navigate('/community')
        },
        {
          title: "Peaceful Music",
          description: "Listen to calming sounds and guided meditation",
          benefits: [
            "Reduce stress and anxiety instantly",
            "Improve sleep quality and relaxation",
            "Enhance focus and concentration",
            "Create a peaceful environment"
          ],
          icon: <Music className={styles.featureIcon} />,
          action: () => navigate('/music')
        },
        {
          title: "Encyclopedia",
          description: "Learn about mental health and wellness topics",
          benefits: [
            "Understand mental health conditions",
            "Learn coping strategies and techniques",
            "Access evidence-based information",
            "Empower yourself with knowledge"
          ],
          icon: <Brain className={styles.featureIcon} />,
          action: () => navigate('/encyclopedia')
        },
        {
          title: "Daily Activities",
          description: "Practice mindfulness exercises and therapeutic activities",
          benefits: [
            "Build healthy daily routines",
            "Develop mindfulness and presence",
            "Improve emotional regulation",
            "Enhance overall well-being"
          ],
          icon: <Activity className={styles.featureIcon} />,
          action: () => navigate('/daily-activities')
        }
      ]
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.headerTitle}>
              How Mindful AI Works
            </h1>
            <p className={styles.headerSubtitle}>
              Discover how each feature of Mindful AI is designed to support your mental wellness journey 
              and help you find inner peace in a busy world.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.navigation}>
        <div className={styles.navigationContent}>
          <div className={styles.tabContainer}>
            {Object.entries(features).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`${styles.tab} ${activeSection === key ? styles.activeTab : ''}`}
              >
                <div className={styles.tabContent}>
                  {section.icon}
                  <span>{section.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        <div>
          {/* Section Header */}
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconContainer}>
              <div className={`${styles.sectionIcon} ${styles[features[activeSection].color]}`}>
                {features[activeSection].icon}
              </div>
            </div>
            <h2 className={styles.sectionTitle}>
              {features[activeSection].title}
            </h2>
            <p className={styles.sectionSubtitle}>
              {features[activeSection].subtitle}
            </p>
          </div>

          {/* Features Grid */}
          <div className={styles.featuresGrid}>
            {features[activeSection].features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                {/* Feature Header */}
                <div className={styles.featureHeader}>
                  <div className={styles.featureIconContainer}>
                    <div className={styles.featureIconInner}>
                      {feature.icon}
                    </div>
                  </div>
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>
                      {feature.title}
                    </h3>
                    <p className={styles.featureDescription}>
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Benefits List */}
                <div className={styles.benefitsSection}>
                  <h4 className={styles.benefitsTitle}>
                    <CheckCircle className={styles.benefitsIcon} />
                    How This Helps You:
                  </h4>
                  <ul className={styles.benefitsList}>
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className={styles.benefitItem}>
                        <div className={styles.benefitBullet}></div>
                        <span className={styles.benefitText}>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  onClick={feature.action}
                  className={styles.actionButton}
                >
                  <span>Try {feature.title}</span>
                  <ArrowRight className={styles.actionIcon} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* How It All Works Together */}
        <div className={styles.togetherSection}>
          <div className={styles.togetherHeader}>
            <div className={styles.togetherIconContainer}>
              <div className={styles.togetherIcon}>
                <Lightbulb className={styles.togetherIconInner} />
              </div>
            </div>
            <h3 className={styles.togetherTitle}>
              How It All Works Together
            </h3>
            <p className={styles.togetherDescription}>
              Mindful AI is designed as a comprehensive mental wellness ecosystem. Start with assessment to understand your needs, 
              then use our healing tools to nurture your mental health. Each feature complements the others to provide 
              a complete wellness experience.
            </p>
          </div>

          {/* Journey Flow */}
          <div className={styles.journeyFlow}>
            <div className={styles.journeyStep}>
              <div className={styles.journeyIcon}>
                <Target className={styles.journeyIconInner} />
              </div>
              <h4 className={styles.journeyTitle}>1. Assess</h4>
              <p className={styles.journeyDescription}>Understand your current mental wellness state</p>
            </div>
            <div className={styles.journeyStep}>
              <div className={styles.journeyIcon}>
                <TrendingUp className={styles.journeyIconInner} />
              </div>
              <h4 className={styles.journeyTitle}>2. Heal</h4>
              <p className={styles.journeyDescription}>Use our tools to nurture your mental health</p>
            </div>
            <div className={styles.journeyStep}>
              <div className={styles.journeyIcon}>
                <Zap className={styles.journeyIconInner} />
              </div>
              <h4 className={styles.journeyTitle}>3. Thrive</h4>
              <p className={styles.journeyDescription}>Build lasting wellness habits and grow</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 