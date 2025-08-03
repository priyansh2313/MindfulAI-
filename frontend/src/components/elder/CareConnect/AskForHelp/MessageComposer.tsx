import { MessageSquare, Mic, MicOff } from 'lucide-react';
import React from 'react';
import styles from '../../../../styles/elder/CareConnect.module.css';

interface MessageComposerProps {
  message: string;
  onMessageChange: (message: string) => void;
  onVoiceInput: () => void;
  isListening: boolean;
  onNext: () => void;
}

const messageTemplates = [
  'I need help with my medication schedule',
  'Can someone help me schedule an appointment?',
  'I\'m having trouble with my device',
  'I have a health question',
  'I need assistance with transportation',
  'Can someone help me with online services?',
];

export default function MessageComposer({ 
  message, 
  onMessageChange, 
  onVoiceInput, 
  isListening, 
  onNext 
}: MessageComposerProps) {
  const handleTemplateSelect = (template: string) => {
    onMessageChange(template);
  };

  return (
    <div className={styles.messageComposer}>
      <h2 className={styles.messageComposerTitle}>What do you need help with?</h2>
      <p className={styles.messageComposerSubtitle}>Describe your request in detail</p>
      
      {/* Message Templates */}
      <div className={styles.messageTemplatesSection}>
        <h3 className={styles.messageTemplatesTitle}>Quick Templates:</h3>
        <div className={styles.messageTemplatesGrid}>
          {messageTemplates.map((template, index) => (
            <button
              key={index}
              className={styles.messageTemplateButton}
              onClick={() => handleTemplateSelect(template)}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Message Input */}
      <div className={styles.customMessageSection}>
        <h3 className={styles.customMessageTitle}>Or write your own message:</h3>
        
        <div className={styles.messageInputContainer}>
          <div className={styles.messageInputWrapper}>
            <MessageSquare className={styles.messageInputIcon} />
            <textarea
              className={styles.messageInput}
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Describe what you need help with..."
              rows={4}
            />
          </div>
          
          <div className={styles.messageInputActions}>
            <button 
              className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
              onClick={onVoiceInput}
              type="button"
              aria-label="Voice input"
            >
              {isListening ? <MicOff className={styles.voiceIcon} /> : <Mic className={styles.voiceIcon} />}
            </button>
          </div>
        </div>

        {isListening && (
          <div className={styles.listeningIndicator}>
            <div className={styles.listeningAnimation}></div>
            <p className={styles.listeningText}>Listening... Speak now</p>
          </div>
        )}
      </div>

      <div className={styles.messageComposerActions}>
        <button 
          className={styles.nextButton}
          onClick={onNext}
          disabled={!message.trim()}
        >
          Next
        </button>
      </div>
    </div>
  );
} 