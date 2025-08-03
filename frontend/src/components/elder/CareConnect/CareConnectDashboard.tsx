import { Calendar, Heart, HelpCircle, Mic, MicOff, Share2, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useCareConnect } from '../../../hooks/useCareConnect';
import styles from '../../../styles/elder/CareConnect.module.css';
import careConnectAnalytics from '../../../utils/careConnectAnalytics';
import AskForHelp from './AskForHelp/AskForHelpMain';
import FamilyInvitationMain from './FamilyInvitation/FamilyInvitationMain';
import HealthCheckins from './HealthCheckins/CheckinReceiver';
import ShareHealthWin from './ShareHealthWin/ShareHealthWinMain';

interface CareConnectDashboardProps {
  onComplete?: () => void;
}

export default function CareConnectDashboard({ onComplete }: CareConnectDashboardProps) {
  const [activeFeature, setActiveFeature] = useState<'share' | 'help' | 'checkin' | 'invite' | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  
  // Use the Care Connect hook for real data
  const {
    familyMembers,
    recentActivity,
    loading,
    error,
    user,
    subscribeToNotifications,
    refreshData,
  } = useCareConnect();

  // Subscribe to notifications on mount
  useEffect(() => {
    subscribeToNotifications();
  }, [subscribeToNotifications]);

  // Track analytics when component mounts
  useEffect(() => {
    careConnectAnalytics.trackFeatureUsage('dashboard', 'view', true);
  }, []);

  // Voice recognition setup
  const startListening = () => {
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
        setVoiceInput(transcript);
        // Handle voice command
        handleVoiceCommand(transcript.toLowerCase());
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

  const handleVoiceCommand = (command: string) => {
    if (command.includes('share') || command.includes('win')) {
      setActiveFeature('share');
    } else if (command.includes('help') || command.includes('assist')) {
      setActiveFeature('help');
    } else if (command.includes('check') || command.includes('health')) {
      setActiveFeature('checkin');
    } else if (command.includes('back') || command.includes('return')) {
      setActiveFeature(null);
    }
  };

  const handleFeatureComplete = () => {
    setActiveFeature(null);
    if (onComplete) onComplete();
  };

  if (activeFeature === 'share') {
    return <ShareHealthWin onComplete={handleFeatureComplete} />;
  }

  if (activeFeature === 'help') {
    return <AskForHelp onComplete={handleFeatureComplete} />;
  }

  if (activeFeature === 'checkin') {
    return <HealthCheckins onComplete={handleFeatureComplete} />;
  }

  if (activeFeature === 'invite') {
    return <FamilyInvitationMain onComplete={handleFeatureComplete} />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className={styles.careConnectContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading your family connections...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.careConnectContainer}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Connection Issue</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={refreshData}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.careConnectContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Heart className={styles.headerIconInner} />
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.headerTitle}>Care Connect</h1>
            <p className={styles.headerSubtitle}>Stay connected with your family</p>
          </div>
        </div>
        
        {/* Voice Control */}
        <button 
          className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
          onClick={startListening}
          aria-label="Voice control"
        >
          {isListening ? <MicOff className={styles.voiceIcon} /> : <Mic className={styles.voiceIcon} />}
        </button>
      </div>

      {/* Main Action Buttons */}
      <div className={styles.actionButtons}>
        <button 
          className={`${styles.actionButton} ${styles.shareButton}`}
          onClick={() => setActiveFeature('share')}
        >
          <div className={styles.actionIcon}>
            <Share2 className={styles.actionIconInner} />
          </div>
          <div className={styles.actionContent}>
            <h3 className={styles.actionTitle}>Share Health Win</h3>
            <p className={styles.actionDescription}>Celebrate your achievements with family</p>
          </div>
        </button>

        <button 
          className={`${styles.actionButton} ${styles.helpButton}`}
          onClick={() => setActiveFeature('help')}
        >
          <div className={styles.actionIcon}>
            <HelpCircle className={styles.actionIconInner} />
          </div>
          <div className={styles.actionContent}>
            <h3 className={styles.actionTitle}>Ask for Help</h3>
            <p className={styles.actionDescription}>Get support from your family</p>
          </div>
        </button>

        <button 
          className={`${styles.actionButton} ${styles.checkinButton}`}
          onClick={() => setActiveFeature('checkin')}
        >
          <div className={styles.actionIcon}>
            <Calendar className={styles.actionIconInner} />
          </div>
          <div className={styles.actionContent}>
            <h3 className={styles.actionTitle}>Health Check-ins</h3>
            <p className={styles.actionDescription}>Respond to family check-ins</p>
          </div>
        </button>

        <button 
          className={`${styles.actionButton} ${styles.inviteButton}`}
          onClick={() => setActiveFeature('invite')}
        >
          <div className={styles.actionIcon}>
            <Users className={styles.actionIconInner} />
          </div>
          <div className={styles.actionContent}>
            <h3 className={styles.actionTitle}>Invite Family</h3>
            <p className={styles.actionDescription}>Invite family members to join your care circle</p>
          </div>
        </button>
      </div>

      {/* Family Status */}
      <div className={styles.familyStatus}>
        <h2 className={styles.familyStatusTitle}>Family Status</h2>
        <div className={styles.familyMembers}>
          {familyMembers.map(member => (
            <div key={member.id} className={styles.familyMember}>
              <div className={`${styles.memberAvatar} ${member.isOnline ? styles.online : styles.offline}`}>
                <span className={styles.memberInitials}>{member.avatar}</span>
                <div className={styles.onlineIndicator}></div>
              </div>
              <div className={styles.memberInfo}>
                <h4 className={styles.memberName}>{member.name}</h4>
                <p className={styles.memberRelationship}>{member.relationship}</p>
              </div>
              <div className={styles.memberStatus}>
                {member.isOnline ? 'Available' : 'Away'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.recentActivity}>
        <h2 className={styles.recentActivityTitle}>Recent Activity</h2>
        <div className={styles.activityList}>
          {recentActivity.map(activity => (
            <div key={activity.id} className={styles.activityItem}>
              <div className={`${styles.activityIcon} ${styles[`activity${activity.type}`]}`}>
                {activity.type === 'win' && <Share2 className={styles.activityIconInner} />}
                {activity.type === 'help' && <HelpCircle className={styles.activityIconInner} />}
                {activity.type === 'checkin' && <Calendar className={styles.activityIconInner} />}
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityMessage}>{activity.message}</p>
                <p className={styles.activityMeta}>
                  {activity.familyMember} • {activity.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Input Display */}
      {voiceInput && (
        <div className={styles.voiceInput}>
          <p className={styles.voiceInputText}>Voice command: "{voiceInput}"</p>
        </div>
      )}
    </div>
  );
} 