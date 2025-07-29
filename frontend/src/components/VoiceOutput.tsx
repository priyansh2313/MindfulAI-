import { Volume2, VolumeX } from "lucide-react";
import React, { useState } from "react";
import styles from "../styles/MindfulChat.module.css";

interface VoiceOutputProps {
  text: string;
  disabled?: boolean;
}

const VoiceOutput: React.FC<VoiceOutputProps> = ({ text, disabled = false }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const speak = (textToSpeak: string) => {
    if (!isEnabled || disabled) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleVoice = () => {
    if (isEnabled) {
      stopSpeaking();
    }
    setIsEnabled(!isEnabled);
  };

  return (
    <div className={styles.voiceOutputContainer}>
      <button
        onClick={toggleVoice}
        disabled={disabled}
        className={`${styles.voiceToggle} ${isEnabled ? styles.enabled : styles.disabled}`}
        title={isEnabled ? 'Disable voice output' : 'Enable voice output'}
      >
        {isEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
      
      {isEnabled && (
        <button
          onClick={isSpeaking ? stopSpeaking : () => speak(text)}
          disabled={disabled}
          className={`${styles.speakButton} ${isSpeaking ? styles.speaking : ''}`}
          title={isSpeaking ? 'Stop speaking' : 'Speak this message'}
        >
          {isSpeaking ? '🔇 Stop' : '🔊 Speak'}
        </button>
      )}
    </div>
  );
};

export default VoiceOutput; 