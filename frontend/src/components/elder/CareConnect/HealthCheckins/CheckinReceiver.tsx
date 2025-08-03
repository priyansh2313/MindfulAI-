import { ArrowLeft, Calendar, Frown, Heart, Meh, MessageSquare, Mic, MicOff, Smile } from 'lucide-react';
import React, { useState } from 'react';
import styles from '../../../../styles/elder/CareConnect.module.css';

interface HealthCheckin {
  id: string;
  fromUserId: string;
  fromUserName: string;
  question: string;
  response?: string;
  responseType: 'voice' | 'text' | 'rating';
  rating?: number;
  timestamp: Date;
  respondedAt?: Date;
}

interface CheckinReceiverProps {
  onComplete?: () => void;
}

export default function CheckinReceiver({ onComplete }: CheckinReceiverProps) {
  const [activeCheckin, setActiveCheckin] = useState<HealthCheckin | null>(null);
  const [response, setResponse] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [responseType, setResponseType] = useState<'text' | 'voice' | 'rating'>('text');
  const [isListening, setIsListening] = useState(false);

  // Mock check-ins
  const mockCheckins: HealthCheckin[] = [
    {
      id: '1',
      fromUserId: '1',
      fromUserName: 'Sarah Johnson',
      question: 'How are you feeling this week?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      fromUserId: '2',
      fromUserName: 'Michael Johnson',
      question: 'Any health concerns lately?',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      fromUserId: '3',
      fromUserName: 'Emma Johnson',
      question: 'How\'s your energy level?',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
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
        setResponse(transcript);
        setResponseType('voice');
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

  const handleSubmitResponse = () => {
    if (activeCheckin) {
      // Mock API call to submit response
      const updatedCheckin: HealthCheckin = {
        ...activeCheckin,
        response: responseType === 'rating' ? `Rating: ${rating}/5` : response,
        responseType,
        rating: rating || undefined,
        respondedAt: new Date(),
      };

      console.log('Check-in response submitted:', updatedCheckin);
      setActiveCheckin(null);
      setResponse('');
      setRating(null);
      setResponseType('text');
    }
  };

  const handleBack = () => {
    if (activeCheckin) {
      setActiveCheckin(null);
      setResponse('');
      setRating(null);
      setResponseType('text');
    } else {
      if (onComplete) onComplete();
    }
  };

  if (activeCheckin) {
    return (
      <div className={styles.checkinResponseContainer}>
        {/* Header */}
        <div className={styles.checkinResponseHeader}>
          <button 
            className={styles.backButton}
            onClick={handleBack}
            aria-label="Go back"
          >
            <ArrowLeft className={styles.backIcon} />
          </button>
          <div className={styles.checkinResponseHeaderContent}>
            <div className={styles.checkinResponseHeaderIcon}>
              <Calendar className={styles.checkinResponseHeaderIconInner} />
            </div>
            <div className={styles.checkinResponseHeaderText}>
              <h1 className={styles.checkinResponseHeaderTitle}>Health Check-in</h1>
              <p className={styles.checkinResponseHeaderSubtitle}>From {activeCheckin.fromUserName}</p>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className={styles.checkinQuestion}>
          <h2 className={styles.checkinQuestionText}>{activeCheckin.question}</h2>
          <p className={styles.checkinQuestionMeta}>
            {activeCheckin.timestamp.toLocaleDateString()} at {activeCheckin.timestamp.toLocaleTimeString()}
          </p>
        </div>

        {/* Response Options */}
        <div className={styles.responseOptions}>
          <h3 className={styles.responseOptionsTitle}>How would you like to respond?</h3>
          
          <div className={styles.responseTypeButtons}>
            <button
              className={`${styles.responseTypeButton} ${responseType === 'text' ? styles.selected : ''}`}
              onClick={() => setResponseType('text')}
            >
              <MessageSquare className={styles.responseTypeIcon} />
              <span>Text</span>
            </button>
            <button
              className={`${styles.responseTypeButton} ${responseType === 'voice' ? styles.selected : ''}`}
              onClick={() => setResponseType('voice')}
            >
              <Mic className={styles.responseTypeIcon} />
              <span>Voice</span>
            </button>
            <button
              className={`${styles.responseTypeButton} ${responseType === 'rating' ? styles.selected : ''}`}
              onClick={() => setResponseType('rating')}
            >
              <Heart className={styles.responseTypeIcon} />
              <span>Rating</span>
            </button>
          </div>
        </div>

        {/* Response Input */}
        {responseType === 'text' && (
          <div className={styles.textResponseSection}>
            <textarea
              className={styles.textResponseInput}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response..."
              rows={4}
            />
          </div>
        )}

        {responseType === 'voice' && (
          <div className={styles.voiceResponseSection}>
            <button 
              className={`${styles.voiceResponseButton} ${isListening ? styles.listening : ''}`}
              onClick={handleVoiceInput}
            >
              {isListening ? <MicOff className={styles.voiceIcon} /> : <Mic className={styles.voiceIcon} />}
              {isListening ? 'Stop Recording' : 'Start Recording'}
            </button>
            {response && (
              <div className={styles.voiceResponsePreview}>
                <p className={styles.voiceResponseText}>"{response}"</p>
              </div>
            )}
          </div>
        )}

        {responseType === 'rating' && (
          <div className={styles.ratingResponseSection}>
            <h3 className={styles.ratingTitle}>Rate how you're feeling:</h3>
            <div className={styles.ratingButtons}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className={`${styles.ratingButton} ${rating === value ? styles.selected : ''}`}
                  onClick={() => setRating(value)}
                >
                  {value === 1 && <Frown className={styles.ratingIcon} />}
                  {value === 2 && <Meh className={styles.ratingIcon} />}
                  {value === 3 && <Meh className={styles.ratingIcon} />}
                  {value === 4 && <Smile className={styles.ratingIcon} />}
                  {value === 5 && <Smile className={styles.ratingIcon} />}
                  <span className={styles.ratingValue}>{value}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className={styles.checkinResponseActions}>
          <button 
            className={styles.submitResponseButton}
            onClick={handleSubmitResponse}
            disabled={
              (responseType === 'text' && !response.trim()) ||
              (responseType === 'voice' && !response.trim()) ||
              (responseType === 'rating' && rating === null)
            }
          >
            Send Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkinReceiverContainer}>
      {/* Header */}
      <div className={styles.checkinReceiverHeader}>
        <button 
          className={styles.backButton}
          onClick={handleBack}
          aria-label="Go back"
        >
          <ArrowLeft className={styles.backIcon} />
        </button>
        <div className={styles.checkinReceiverHeaderContent}>
          <div className={styles.checkinReceiverHeaderIcon}>
            <Calendar className={styles.checkinReceiverHeaderIconInner} />
          </div>
          <div className={styles.checkinReceiverHeaderText}>
            <h1 className={styles.checkinReceiverHeaderTitle}>Health Check-ins</h1>
            <p className={styles.checkinReceiverHeaderSubtitle}>Respond to family check-ins</p>
          </div>
        </div>
      </div>

      {/* Check-ins List */}
      <div className={styles.checkinsList}>
        {mockCheckins.length === 0 ? (
          <div className={styles.noCheckins}>
            <Calendar className={styles.noCheckinsIcon} />
            <h2 className={styles.noCheckinsTitle}>No pending check-ins</h2>
            <p className={styles.noCheckinsMessage}>
              Your family will send you health check-ins here when they want to know how you're doing.
            </p>
          </div>
        ) : (
          <>
            <h2 className={styles.checkinsListTitle}>Pending Check-ins</h2>
            {mockCheckins.map(checkin => (
              <button
                key={checkin.id}
                className={styles.checkinItem}
                onClick={() => setActiveCheckin(checkin)}
              >
                <div className={styles.checkinItemIcon}>
                  <Calendar className={styles.checkinItemIconInner} />
                </div>
                <div className={styles.checkinItemContent}>
                  <h3 className={styles.checkinItemQuestion}>{checkin.question}</h3>
                  <p className={styles.checkinItemMeta}>
                    From {checkin.fromUserName} • {checkin.timestamp.toLocaleDateString()}
                  </p>
                </div>
                <div className={styles.checkinItemStatus}>
                  <span className={styles.checkinItemStatusText}>Pending</span>
                </div>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
} 