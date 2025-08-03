import { ArrowLeft, CheckCircle, HelpCircle } from 'lucide-react';
import React, { useState } from 'react';
import styles from '../../../../styles/elder/CareConnect.module.css';
import HelpCategorySelector from '../AskForHelp/HelpCategorySelector';
import MessageComposer from '../AskForHelp/MessageComposer';
import UrgencySelector from '../AskForHelp/UrgencySelector';
import FamilyMemberSelector from '../ShareHealthWin/FamilyMemberSelector';

interface HelpRequest {
  id: string;
  userId: string;
  category: 'medication' | 'appointment' | 'health' | 'technology' | 'general';
  urgency: 'low' | 'medium' | 'high';
  message: string;
  voiceMessage?: string;
  recipients: string[];
  responses: { userId: string; message: string; timestamp: Date }[];
  status: 'pending' | 'responded' | 'resolved';
  timestamp: Date;
}

interface AskForHelpMainProps {
  onComplete?: () => void;
}

export default function AskForHelpMain({ onComplete }: AskForHelpMainProps) {
  const [step, setStep] = useState<'category' | 'urgency' | 'message' | 'family' | 'success'>('category');
  const [category, setCategory] = useState<HelpRequest['category'] | ''>('');
  const [urgency, setUrgency] = useState<HelpRequest['urgency'] | ''>('');
  const [message, setMessage] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Mock family members
  const familyMembers = [
    { id: '1', name: 'Sarah Johnson', relationship: 'Daughter', isOnline: true },
    { id: '2', name: 'Michael Johnson', relationship: 'Son', isOnline: false },
    { id: '3', name: 'Emma Johnson', relationship: 'Granddaughter', isOnline: true },
  ];

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Voice recognition is not supported in this browser.');
    }
  };

  const handleSubmit = () => {
    // Mock API call to save help request
    const helpRequest: HelpRequest = {
      id: Date.now().toString(),
      userId: 'elder-user',
      category: category as HelpRequest['category'],
      urgency: urgency as HelpRequest['urgency'],
      message,
      recipients: selectedFamily,
      responses: [],
      status: 'pending',
      timestamp: new Date(),
    };

    console.log('Help request sent:', helpRequest);
    setStep('success');
  };

  const handleBack = () => {
    if (step === 'category') {
      if (onComplete) onComplete();
    } else if (step === 'urgency') {
      setStep('category');
    } else if (step === 'message') {
      setStep('urgency');
    } else if (step === 'family') {
      setStep('message');
    }
  };

  if (step === 'success') {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>
            <CheckCircle className={styles.successIconInner} />
          </div>
          <h1 className={styles.successTitle}>Help Request Sent!</h1>
          <p className={styles.successMessage}>
            Your family has been notified and will respond soon.
          </p>
          <button 
            className={styles.backToDashboardButton}
            onClick={onComplete}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.askForHelpContainer}>
      {/* Header */}
      <div className={styles.askHeader}>
        <button 
          className={styles.backButton}
          onClick={handleBack}
          aria-label="Go back"
        >
          <ArrowLeft className={styles.backIcon} />
        </button>
        <div className={styles.askHeaderContent}>
          <div className={styles.askHeaderIcon}>
            <HelpCircle className={styles.askHeaderIconInner} />
          </div>
          <div className={styles.askHeaderText}>
            <h1 className={styles.askHeaderTitle}>Ask for Help</h1>
            <p className={styles.askHeaderSubtitle}>Get support from your family</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className={styles.progressSteps}>
        <div className={`${styles.progressStep} ${step === 'category' ? styles.active : ''}`}>
          <div className={styles.progressNumber}>1</div>
          <span className={styles.progressLabel}>Category</span>
        </div>
        <div className={`${styles.progressStep} ${step === 'urgency' ? styles.active : ''}`}>
          <div className={styles.progressNumber}>2</div>
          <span className={styles.progressLabel}>Urgency</span>
        </div>
        <div className={`${styles.progressStep} ${step === 'message' ? styles.active : ''}`}>
          <div className={styles.progressNumber}>3</div>
          <span className={styles.progressLabel}>Message</span>
        </div>
        <div className={`${styles.progressStep} ${step === 'family' ? styles.active : ''}`}>
          <div className={styles.progressNumber}>4</div>
          <span className={styles.progressLabel}>Family</span>
        </div>
      </div>

      {/* Step Content */}
      {step === 'category' && (
        <div className={styles.stepContent}>
          <HelpCategorySelector 
            selectedCategory={category}
            onCategorySelect={setCategory}
            onNext={() => setStep('urgency')}
          />
        </div>
      )}

      {step === 'urgency' && (
        <div className={styles.stepContent}>
          <UrgencySelector
            selectedUrgency={urgency}
            onUrgencySelect={setUrgency}
            onNext={() => setStep('message')}
          />
        </div>
      )}

      {step === 'message' && (
        <div className={styles.stepContent}>
          <MessageComposer
            message={message}
            onMessageChange={setMessage}
            onVoiceInput={handleVoiceInput}
            isListening={isListening}
            onNext={() => setStep('family')}
          />
        </div>
      )}

      {step === 'family' && (
        <div className={styles.stepContent}>
          <FamilyMemberSelector
            familyMembers={familyMembers}
            selectedMembers={selectedFamily}
            onSelectionChange={setSelectedFamily}
            onComplete={handleSubmit}
          />
        </div>
      )}
    </div>
  );
} 