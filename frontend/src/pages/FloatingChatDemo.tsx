import { Play, X } from "lucide-react";
import React, { useState } from "react";
import FloatingBubbleChat from "../components/FloatingBubbleChat";
import styles from "../styles/FloatingChatDemo.module.css";

const FloatingChatDemo: React.FC = () => {
  const [isFloatingChatActive, setIsFloatingChatActive] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const startFloatingChat = () => {
    setIsFloatingChatActive(true);
    setShowIntro(false);
  };

  const stopFloatingChat = () => {
    setIsFloatingChatActive(false);
  };

  if (isFloatingChatActive) {
    return (
      <div className={styles.demoContainer}>
        <button onClick={stopFloatingChat} className={styles.closeButton}>
          <X size={24} />
        </button>
        <FloatingBubbleChat />
      </div>
    );
  }

  return (
    <div className={styles.introContainer}>
      <div className={styles.introContent}>
        <h1 className={styles.title}>🌊 Floating Bubble Chat</h1>
        <p className={styles.subtitle}>
          Experience the future of conversational AI with floating, emotion-aware chat bubbles
        </p>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🎨</span>
            <h3>Emotion-Based Colors</h3>
            <p>Bubbles change color and animation based on detected emotions</p>
          </div>
          
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🌊</span>
            <h3>Physics-Like Movement</h3>
            <p>Bubbles float naturally with gravity and bounce effects</p>
          </div>
          
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🎯</span>
            <h3>Interactive Experience</h3>
            <p>Click bubbles to interact and drag them around the screen</p>
          </div>
          
          <div className={styles.feature}>
            <span className={styles.featureIcon}>✨</span>
            <h3>Glass Morphism Design</h3>
            <p>Modern blur effects and transparent elements</p>
          </div>
        </div>

        <button onClick={startFloatingChat} className={styles.startButton}>
          <Play size={20} />
          Start Floating Chat Experience
        </button>

        <div className={styles.instructions}>
          <h3>How it works:</h3>
          <ul>
            <li>💬 Type messages in the input at the bottom</li>
            <li>🎨 Bubbles appear with colors matching your emotions</li>
            <li>🖱️ Click bubbles to interact with them</li>
            <li>🎮 Use quick action buttons for instant responses</li>
            <li>🌊 Watch bubbles float and move naturally</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FloatingChatDemo; 