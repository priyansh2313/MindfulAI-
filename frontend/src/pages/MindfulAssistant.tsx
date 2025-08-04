import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import AssistantResponseLauncher from "../components/AssistantResponseLauncher";
import EmotionClassifierFaceAPI from "../components/EmotionClassifierFaceMood";
import TextSentiment from "../components/TextSentiment";
import VoiceSentiment from "../components/VoiceSentiment";
import FloatingChatbot from "../pages/FloatingChatbot";
import styles from "../styles/MindfulAssistant.module.css";
import { FusedMood, fuseFuzzyMood } from "../utils/fuseFuzzyMood";

const steps = ["Face", "Voice", "Text", "Result"];

const MindfulAssistantFusion = () => {
  const [step, setStep] = useState(1);
  const [showTransition, setShowTransition] = useState(false);

  const [faceMood, setFaceMood] = useState("neutral");
  const [voiceMood, setVoiceMood] = useState("neutral");
  const [textMood, setTextMood] = useState("neutral");
  const [finalMood, setFinalMood] = useState<FusedMood | null>(null);
  const [hasFaceInput, setHasFaceInput] = useState(false);
  const [hasVoiceInput, setHasVoiceInput] = useState(false);
  const [hasTextInput, setHasTextInput] = useState(false);
  const [chatbotMessages, setChatbotMessages] = useState<string[]>([]);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    if (chatbotMessages.length > 0 && !chatbotOpen) {
      const delay = setTimeout(() => {
        setChatbotOpen(true);
      }, 1500);
      return () => clearTimeout(delay);
    }
  }, [chatbotMessages, chatbotOpen]);

  if (!chatbotMessages.includes("🎭 Great! We've captured your facial mood. Now let's analyze your voice!")) {
    setChatbotMessages(prev => [...prev, "🎭 Great! We've captured your facial mood. Now let's analyze your voice!"]);
  }

  const handleFaceDetected = (mood: string) => {
    setFaceMood(mood);
    setHasFaceInput(true);

    const guideMsg = "🎭 Great! We've captured your facial mood. Now let's analyze your voice!";
    setChatbotMessages((prev) => {
      if (!prev.includes(guideMsg)) return [...prev, guideMsg];
      return prev;
    });
  };

  const handleVoiceDetected = (mood: string) => {
    setVoiceMood(mood);
    setHasVoiceInput(true);
    const guideMsg = "🎤 Awesome! Voice mood detected. Now express yourself through text!";

    setChatbotMessages((prev) => {
      if (!prev.includes(guideMsg)) return [...prev, guideMsg];
      return prev;
    });
  };

  const handleTextDetected = (mood: string) => {
    setTextMood(mood);
    const result = fuseFuzzyMood(
      { neutral: faceMood === 'neutral' ? 1 : 0, happy: faceMood === 'happy' ? 1 : 0, sad: faceMood === 'sad' ? 1 : 0, angry: faceMood === 'angry' ? 1 : 0, anxious: faceMood === 'anxious' ? 1 : 0, calm: 0 },
      { neutral: voiceMood === 'neutral' ? 1 : 0, happy: voiceMood === 'happy' ? 1 : 0, sad: voiceMood === 'sad' ? 1 : 0, angry: voiceMood === 'angry' ? 1 : 0, anxious: voiceMood === 'anxious' ? 1 : 0, calm: 0 },
      { neutral: mood === 'neutral' ? 1 : 0, happy: mood === 'happy' ? 1 : 0, sad: mood === 'sad' ? 1 : 0, angry: mood === 'angry' ? 1 : 0, anxious: mood === 'anxious' ? 1 : 0, calm: mood === 'calm' ? 1 : 0 }
    );
    setFinalMood(result);
    setHasTextInput(true);
    setChatbotMessages(prev => [...prev, "📝 Wonderful! All inputs captured. Calculating your emotional insights..."]);
  };

  const handleContinue = () => {
    setShowTransition(true);
    setTimeout(() => {
      setShowTransition(false);
      setStep((prev) => prev + 1);
    }, 2500);
  };

  return (
    <div className={styles.container}>
      <FloatingChatbot
        isOpen={chatbotOpen}
        onToggle={() => setChatbotOpen(prev => !prev)}
        hoveredSection={null}
        mode="assistant"
        chatbotMessages={chatbotMessages}
        setChatbotMessages={setChatbotMessages}
      />

      <div className={styles.contentWrapper}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          🧘 Mindful Assistant
        </motion.h1>

        <motion.div 
          className={styles.progressBar}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {steps.map((label, index) => (
            <motion.div
              key={index}
              className={`${styles.progressStep} ${
                step - 1 >= index ? styles.activeStep : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{label}</span>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {showTransition ? (
            <motion.div
              key="transition"
              className={styles.transitionScreen}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.breathingCircle}>
                <motion.div
                  className={styles.pulse}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <p className={styles.transitionText}>Breathing in... Breathing out...</p>
              </div>
            </motion.div>
          ) : (
            <>
              {step === 1 && (
                <motion.div 
                  key="step1" 
                  className={styles.moduleBox}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className={styles.prompt}>🧠 Show us how you feel</p>
                  <EmotionClassifierFaceAPI onMoodDetected={handleFaceDetected} />
                  {hasFaceInput && (
                    <motion.button 
                      className={styles.continueButton}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleContinue}
                    >
                      Continue
                    </motion.button>
                  )}
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div 
                  key="step2" 
                  className={styles.moduleBox}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className={styles.prompt}>🎤 Tell us how you feel</p>
                  <VoiceSentiment onMoodDetected={handleVoiceDetected} />
                  {hasVoiceInput && (
                    <motion.button 
                      className={styles.continueButton}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleContinue}
                    >
                      Continue
                    </motion.button>
                  )}
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div 
                  key="step3" 
                  className={styles.moduleBox}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className={styles.prompt}>📝 Write how you feel</p>
                  <TextSentiment onMoodDetected={handleTextDetected} />
                  {hasTextInput && finalMood && (
                    <motion.button 
                      className={styles.continueButton}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleContinue}
                    >
                      See Your Insights
                    </motion.button>
                  )}
                </motion.div>
              )}
              
              {step === 4 && finalMood && (
                <motion.div 
                  key="step4" 
                  className={styles.moduleBox}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={styles.fusedResult}>
                    <h2>🧬 Fused Mood: <span>{finalMood}</span></h2>
                    <p>This is your combined emotion based on face, voice, and text.</p>
                  </div>
                  <AssistantResponseLauncher mood={finalMood} />
                  <div className={styles.reportBox}>
                    <h3>🧾 Emotional Insight Report</h3>
                    <ul>
                      <li><strong>🎭 Face Mood:</strong> {faceMood}</li>
                      <li><strong>🔊 Voice Mood:</strong> {voiceMood}</li>
                      <li><strong>📝 Text Mood:</strong> {textMood}</li>
                      <li><strong>🧬 Fused Mood:</strong> {finalMood}</li>
                    </ul>
                    <p className={styles.tipText}>
                      🌸 Emotions are visitors. Breathe, observe, and let them flow.
                    </p>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MindfulAssistantFusion;
