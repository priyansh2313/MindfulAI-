import { ArrowRight, Brain, CheckCircle, Flower2, Heart, Leaf, Shield, Sparkles, Star, Target, TreePine } from "lucide-react";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from "../styles/Introduction.module.css";

export default function Introduction() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showConsent, setShowConsent] = useState(false);

  const steps = [
    {
      icon: <Brain className={styles.stepIcon} />,
      title: "AI-Powered Insights",
      description: "Advanced machine learning analyzes your patterns to provide personalized recommendations",
      color: "step1"
    },
    {
      icon: <Heart className={styles.stepIcon} />,
      title: "Emotional Intelligence",
      description: "Understand your emotions with cutting-edge sentiment analysis and mood tracking",
      color: "step2"
    },
    {
      icon: <Shield className={styles.stepIcon} />,
      title: "Privacy First",
      description: "Your data is encrypted and secure. Your mental health journey is private",
      color: "step3"
    },
    {
      icon: <Target className={styles.stepIcon} />,
      title: "Personalized Care",
      description: "Get recommendations tailored specifically to your unique needs and preferences",
      color: "step4"
    }
  ];

  const handleStart = () => {
    setShowConsent(true);
  };

  const handleConsent = () => {
    setTimeout(() => navigate("/questionnaire"), 500);
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <div className={styles.container}>
      {/* Nature Background Elements */}
      <div className={styles.backgroundPattern}></div>
      
      {/* Floating Nature Elements */}
      <div className={`${styles.floatingElement} ${styles.leaf}`}>
        <Leaf className={styles.floatingIcon} />
      </div>
      <div className={`${styles.floatingElement} ${styles.flower}`}>
        <Flower2 className={styles.floatingIcon} />
      </div>
      <div className={`${styles.floatingElement} ${styles.tree}`}>
        <TreePine className={styles.floatingIcon} />
      </div>
      <div className={`${styles.floatingElement} ${styles.sparkle}`}>
        <Sparkles className={styles.floatingIcon} />
      </div>
      <div className={`${styles.floatingElement} ${styles.star}`}>
        <Star className={styles.floatingIcon} />
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>
                <Brain className={styles.logoBrain} />
              </div>
              <div className={styles.logoText}>
                <h1 className={styles.logoTitle}>Mindful AI</h1>
                <p className={styles.logoSubtitle}>Mental Wellness Revolution</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            {/* Main Hero */}
            <div className={styles.heroMain}>
              <div className={styles.heroIconContainer}>
                <div className={styles.heroIcon}>
                  <Heart className={styles.heroHeart} />
                </div>
              </div>
              
              <h1 className={styles.heroTitle}>
                Your Mental Health
                <span className={styles.heroHighlight}> Revolutionized</span>
              </h1>
              
              <p className={styles.heroSubtitle}>
                Experience the future of mental wellness with AI-powered insights, 
                personalized care, and cutting-edge technology designed just for you.
              </p>

              {/* Stats */}
              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>99.9%</div>
                  <div className={styles.statLabel}>Accuracy</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>24/7</div>
                  <div className={styles.statLabel}>Support</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>AI</div>
                  <div className={styles.statLabel}>Powered</div>
                </div>
              </div>
            </div>

            {/* Interactive Steps */}
            <div className={styles.stepsSection}>
              <h2 className={styles.stepsTitle}>How It Works</h2>
              <div className={styles.stepsGrid}>
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`${styles.stepCard} ${currentStep === index ? styles.active : ''}`}
                    onClick={() => handleStepClick(index)}
                  >
                    <div className={`${styles.stepIconContainer} ${styles[step.color]}`}>
                      {step.icon}
                    </div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                    
                    {/* Progress Indicator */}
                    <div className={styles.progressContainer}>
                      <div className={styles.progressBar}>
                        <div 
                          className={`${styles.progressFill} ${styles[step.color]}`}
                          style={{ width: currentStep === index ? '100%' : '0%' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className={styles.ctaSection}>
              <div className={styles.ctaCard}>
                <div className={styles.ctaContent}>
                  <h3 className={styles.ctaTitle}>
                    Ready to Transform Your Mental Wellness?
                  </h3>
                  <p className={styles.ctaSubtitle}>
                    Join thousands of users who have discovered inner peace and emotional balance 
                    through our revolutionary AI-powered platform.
                  </p>
                  
                  <button 
                    className={styles.ctaButton}
                    onClick={handleStart}
                  >
                    <span>Begin Your Journey</span>
                    <ArrowRight className={styles.ctaIcon} />
                  </button>
                  
                  <p className={styles.ctaTagline}>
                    Free • Secure • Personalized
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consent Modal */}
      {showConsent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>
                <Shield className={styles.modalShield} />
              </div>
              <h3 className={styles.modalTitle}>Privacy & Consent</h3>
              <p className={styles.modalSubtitle}>
                We're committed to protecting your privacy. Your data is encrypted and secure.
              </p>
            </div>
            
            <div className={styles.modalFeatures}>
              <div className={styles.modalFeature}>
                <CheckCircle className={styles.featureIcon} />
                <span>End-to-end encryption</span>
              </div>
              <div className={styles.modalFeature}>
                <CheckCircle className={styles.featureIcon} />
                <span>Anonymous assessment</span>
              </div>
              <div className={styles.modalFeature}>
                <CheckCircle className={styles.featureIcon} />
                <span>Instant insights</span>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.modalCancel}
                onClick={() => setShowConsent(false)}
              >
                Learn More
              </button>
              <button 
                className={styles.modalConfirm}
                onClick={handleConsent}
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
