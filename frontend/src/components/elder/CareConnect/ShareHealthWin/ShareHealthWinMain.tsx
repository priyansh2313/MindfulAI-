import { ArrowLeft, Camera, Mic, MicOff, Share2 } from 'lucide-react';
import React, { useState } from 'react';
import { FamilyMember } from '../../../../services/careConnectService';
import styles from '../../../../styles/elder/CareConnect.module.css';
import CategorySelector from './CategorySelector';
import FamilyMemberSelector from './FamilyMemberSelector';
import QuickSelectButtons from './QuickSelectButtons';
import SuccessConfirmation from './SuccessConfirmation';

interface HealthWin {
  id: string;
  userId: string;
  category: string;
  message: string;
  photo?: string;
  timestamp: Date;
  recipients: string[];
  celebrations: { userId: string; type: 'heart' | 'clap' | 'thumbs_up' }[];
}

interface ShareHealthWinMainProps {
  onComplete?: () => void;
  familyMembers?: FamilyMember[];
}

export default function ShareHealthWinMain({ onComplete, familyMembers = [] }: ShareHealthWinMainProps) {
  const [step, setStep] = useState<'category' | 'message' | 'family' | 'success'>('category');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  const quickSelectOptions = [
    'Went for a walk today',
    'Took all my medications',
    'Had a great day',
    'Visited with friends',
    'Ate healthy meals',
    'Did my exercises',
    'Read a book',
    'Called a friend',
  ];

  const handleQuickSelect = (option: string) => {
    setMessage(option);
    setStep('family');
  };

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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Mock API call to save health win
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user._id) {
      alert('No valid user ID found. Please log in again.');
      return;
    }
    const healthWin: HealthWin = {
      id: Date.now().toString(),
      userId: user._id,
      category,
      message,
      photo: photo || undefined,
      timestamp: new Date(),
      recipients: selectedFamily,
      celebrations: [],
    };

    console.log('Health win shared:', healthWin);
    setStep('success');
  };

  const handleBack = () => {
    if (step === 'category') {
      if (onComplete) onComplete();
    } else if (step === 'message') {
      setStep('category');
    } else if (step === 'family') {
      setStep('message');
    }
  };

  if (step === 'success') {
    return <SuccessConfirmation onComplete={onComplete} />;
  }

  return (
    <div className={styles.shareHealthWinContainer}>
      {/* Header */}
      <div className={styles.shareHeader}>
        <button 
          className={styles.backButton}
          onClick={handleBack}
          aria-label="Go back"
        >
          <ArrowLeft className={styles.backIcon} />
        </button>
        <div className={styles.shareHeaderContent}>
          <div className={styles.shareHeaderIcon}>
            <Share2 className={styles.shareHeaderIconInner} />
          </div>
          <div className={styles.shareHeaderText}>
            <h1 className={styles.shareHeaderTitle}>Share Health Win</h1>
            <p className={styles.shareHeaderSubtitle}>Celebrate your achievements with family</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className={styles.progressSteps}>
        <div className={`${styles.progressStep} ${step === 'category' ? styles.active : ''}`}>
          <div className={styles.progressNumber}>1</div>
          <span className={styles.progressLabel}>Category</span>
        </div>
        <div className={`${styles.progressStep} ${step === 'message' ? styles.active : ''}`}>
          <div className={styles.progressNumber}>2</div>
          <span className={styles.progressLabel}>Message</span>
        </div>
        <div className={`${styles.progressStep} ${step === 'family' ? styles.active : ''}`}>
          <div className={styles.progressNumber}>3</div>
          <span className={styles.progressLabel}>Family</span>
        </div>
      </div>

      {/* Step Content */}
      {step === 'category' && (
        <div className={styles.stepContent}>
          <CategorySelector 
            selectedCategory={category}
            onCategorySelect={setCategory}
            onNext={() => setStep('message')}
          />
        </div>
      )}

      {step === 'message' && (
        <div className={styles.stepContent}>
          <div className={styles.messageSection}>
            <h2 className={styles.messageTitle}>What would you like to share?</h2>
            
            {/* Quick Select Buttons */}
            <QuickSelectButtons 
              options={quickSelectOptions}
              onSelect={handleQuickSelect}
            />

            {/* Custom Message Input */}
            <div className={styles.customMessageSection}>
              <h3 className={styles.customMessageTitle}>Or write your own message:</h3>
              
              <div className={styles.messageInputContainer}>
                <textarea
                  className={styles.messageInput}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell your family about your health win..."
                  rows={4}
                />
                
                <div className={styles.messageInputActions}>
                  <button 
                    className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
                    onClick={handleVoiceInput}
                    type="button"
                    aria-label="Voice input"
                  >
                    {isListening ? <MicOff className={styles.voiceIcon} /> : <Mic className={styles.voiceIcon} />}
                  </button>
                  
                  <label className={styles.photoButton}>
                    <Camera className={styles.photoIcon} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Photo Preview */}
              {photo && (
                <div className={styles.photoPreview}>
                  <img src={photo} alt="Health win photo" className={styles.photoPreviewImage} />
                  <button 
                    className={styles.removePhotoButton}
                    onClick={() => setPhoto(null)}
                    aria-label="Remove photo"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div className={styles.messageActions}>
              <button 
                className={styles.nextButton}
                onClick={() => setStep('family')}
                disabled={!message.trim()}
              >
                Next
              </button>
            </div>
          </div>
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