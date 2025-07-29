import { Mic, MicOff } from "lucide-react";
import React, { useRef, useState } from "react";
import styles from "../styles/MindfulChat.module.css";

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    setIsListening(true);
    setTranscript("");

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      onTranscription(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div className={styles.voiceInputContainer}>
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      {isListening && (
        <div className={styles.listeningIndicator}>
          <span>🎤 Listening...</span>
        </div>
      )}
      {transcript && (
        <div className={styles.transcript}>
          <span>🎯 "{transcript}"</span>
        </div>
      )}
    </div>
  );
};

export default VoiceInput; 