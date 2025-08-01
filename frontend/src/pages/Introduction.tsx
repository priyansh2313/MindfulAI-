import { ArrowRight, Brain, Heart, Shield, Sparkles, Target, Zap } from "lucide-react";
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from "../styles/Introduction.module.css";

export default function Introduction() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showConsent, setShowConsent] = useState(false);
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, life: number}>>([]);

  // Animated background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.01;

        if (particle.life > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(102, 126, 234, ${particle.life})`;
          ctx.fill();
        } else {
          particles.splice(index, 1);
        }
      });

      // Add new particles
      if (particles.length < 50) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1
        });
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [particles]);

  const steps = [
    {
      icon: <Brain className={styles.stepIcon} />,
      title: "AI-Powered Insights",
      description: "Advanced machine learning analyzes your patterns to provide personalized recommendations"
    },
    {
      icon: <Heart className={styles.stepIcon} />,
      title: "Emotional Intelligence",
      description: "Understand your emotions with cutting-edge sentiment analysis and mood tracking"
    },
    {
      icon: <Shield className={styles.stepIcon} />,
      title: "Privacy First",
      description: "Your data is encrypted and secure. Your mental health journey is private"
    },
    {
      icon: <Target className={styles.stepIcon} />,
      title: "Personalized Care",
      description: "Get recommendations tailored specifically to your unique needs and preferences"
    }
  ];

  const handleStart = () => {
    setShowConsent(true);
  };

  const handleConsent = () => {
    // Create burst effect
    const burst = () => {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1
        });
      }
    };
    burst();
    
    setTimeout(() => navigate("/questionnaire"), 800);
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <div className={styles.container}>
      {/* Animated Background */}
      <canvas ref={canvasRef} className={styles.backgroundCanvas} />
      
      {/* Floating Elements */}
      <div className={styles.floatingElements}>
        <div className={styles.floatingCard} style={{ animationDelay: '0s' }}>
          <Sparkles className={styles.floatingIcon} />
        </div>
        <div className={styles.floatingCard} style={{ animationDelay: '2s' }}>
          <Zap className={styles.floatingIcon} />
        </div>
        <div className={styles.floatingCard} style={{ animationDelay: '4s' }}>
          <Brain className={styles.floatingIcon} />
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Header - Logo Only */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <Brain className={styles.logoBrain} />
              <div className={styles.logoGlow}></div>
            </div>
            <div className={styles.logoTextContainer}>
              <h1 className={styles.logoText}>Mindful AI</h1>
              <span className={styles.logoTagline}>Mental Wellness Revolution</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Your Mental Health
              <span className={styles.highlight}> Revolutionized</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Experience the future of mental wellness with AI-powered insights, 
              personalized care, and cutting-edge technology designed just for you.
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>99.9%</span>
                <span className={styles.statLabel}>Accuracy</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>24/7</span>
                <span className={styles.statLabel}>Support</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>AI</span>
                <span className={styles.statLabel}>Powered</span>
              </div>
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
                <div className={styles.stepIconContainer}>
                  {step.icon}
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
                <div className={styles.stepProgress}>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
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
          <button className={styles.ctaButton} onClick={handleStart}>
            <span>Begin Your Journey</span>
            <ArrowRight className={styles.ctaIcon} />
          </button>
          <p className={styles.ctaSubtext}>
            Join thousands of users who have transformed their mental wellness
          </p>
        </div>
      </div>

      {/* Consent Modal */}
      {showConsent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <Shield className={styles.modalIcon} />
              <h3 className={styles.modalTitle}>Privacy & Consent</h3>
            </div>
            <div className={styles.modalContent}>
              <p className={styles.modalText}>
                We're committed to protecting your privacy. Your data is encrypted and secure. 
                This assessment helps us provide personalized care while maintaining complete confidentiality.
              </p>
              <div className={styles.modalFeatures}>
                <div className={styles.feature}>
                  <div className={styles.featureIcon}>🔒</div>
                  <span>End-to-end encryption</span>
                </div>
                <div className={styles.feature}>
                  <div className={styles.featureIcon}>👤</div>
                  <span>Anonymous assessment</span>
                </div>
                <div className={styles.feature}>
                  <div className={styles.featureIcon}>⚡</div>
                  <span>Instant insights</span>
                </div>
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
