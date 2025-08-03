import { Heart, Mail, Mic, MicOff, Plus, Send, User, Users } from 'lucide-react';
import React, { useState } from 'react';
import { FamilyMemberInvite } from '../../../../services/familyInvitationService';
import styles from '../../../../styles/elder/CareConnect.module.css';

interface InvitationFormProps {
  onSendInvitation: (invite: FamilyMemberInvite) => Promise<void>;
  onSendBulkInvitations: (invites: FamilyMemberInvite[]) => Promise<void>;
  onShowTemplates: () => void;
  onShowPending: () => void;
  loading: boolean;
  invitationsCount: number;
}

export default function InvitationForm({
  onSendInvitation,
  onSendBulkInvitations,
  onShowTemplates,
  onShowPending,
  loading,
  invitationsCount
}: InvitationFormProps) {
  const [invites, setInvites] = useState<FamilyMemberInvite[]>([
    { email: '', name: '', relationship: '', message: '' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [currentVoiceField, setCurrentVoiceField] = useState<string | null>(null);

  const relationshipOptions = [
    'Spouse', 'Son', 'Daughter', 'Grandson', 'Granddaughter',
    'Brother', 'Sister', 'Nephew', 'Niece', 'Cousin',
    'Friend', 'Caregiver', 'Other'
  ];

  const quickMessages = [
    'I\'d love to have you join my Care Connect family circle!',
    'This will help us stay connected and support each other better.',
    'I\'m using Care Connect to track my health and would appreciate your support.',
    'Let\'s stay connected through Care Connect for better health monitoring.',
  ];

  const addInvite = () => {
    setInvites(prev => [...prev, { email: '', name: '', relationship: '', message: '' }]);
  };

  const removeInvite = (index: number) => {
    if (invites.length > 1) {
      setInvites(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateInvite = (index: number, field: keyof FamilyMemberInvite, value: string) => {
    setInvites(prev => prev.map((invite, i) => 
      i === index ? { ...invite, [field]: value } : invite
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validInvites = invites.filter(invite => 
      invite.email && invite.name && invite.relationship
    );

    if (validInvites.length === 0) {
      alert('Please fill in at least one complete invitation.');
      return;
    }

    if (validInvites.length === 1) {
      await onSendInvitation(validInvites[0]);
    } else {
      await onSendBulkInvitations(validInvites);
    }
  };

  const startVoiceInput = (fieldName: string) => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setCurrentVoiceField(fieldName);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Find the current invite being edited
        const currentIndex = invites.findIndex(invite => 
          invite.email || invite.name || invite.relationship || invite.message
        );
        if (currentIndex !== -1) {
          updateInvite(currentIndex, fieldName as keyof FamilyMemberInvite, transcript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setCurrentVoiceField(null);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setCurrentVoiceField(null);
      };
      
      recognition.start();
    } else {
      alert('Voice recognition is not supported in this browser.');
    }
  };

  return (
    <div className={styles.invitationForm}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Invite Family Members</h2>
        <p className={styles.formSubtitle}>
          Add family members to your Care Connect circle
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {invites.map((invite, index) => (
          <div key={index} className={styles.inviteCard}>
            <div className={styles.inviteCardHeader}>
              <h3 className={styles.inviteCardTitle}>Family Member {index + 1}</h3>
              {invites.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInvite(index)}
                  className={styles.removeInviteButton}
                >
                  Remove
                </button>
              )}
            </div>

            <div className={styles.formFields}>
              {/* Name Field */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  <User className={styles.fieldIcon} />
                  Full Name *
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={invite.name}
                    onChange={(e) => updateInvite(index, 'name', e.target.value)}
                    placeholder="Enter full name"
                    className={styles.formInput}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => startVoiceInput('name')}
                    className={`${styles.voiceButton} ${currentVoiceField === 'name' && isListening ? styles.listening : ''}`}
                  >
                    {isListening && currentVoiceField === 'name' ? <MicOff /> : <Mic />}
                  </button>
                </div>
              </div>

              {/* Email Field */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  <Mail className={styles.fieldIcon} />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={invite.email}
                  onChange={(e) => updateInvite(index, 'email', e.target.value)}
                  placeholder="Enter email address"
                  className={styles.formInput}
                  required
                />
              </div>

              {/* Relationship Field */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  <Heart className={styles.fieldIcon} />
                  Relationship *
                </label>
                <select
                  value={invite.relationship}
                  onChange={(e) => updateInvite(index, 'relationship', e.target.value)}
                  className={styles.formSelect}
                  required
                >
                  <option value="">Select relationship</option>
                  {relationshipOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Message Field */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Personal Message (Optional)
                </label>
                <div className={styles.inputWrapper}>
                  <textarea
                    value={invite.message}
                    onChange={(e) => updateInvite(index, 'message', e.target.value)}
                    placeholder="Add a personal message..."
                    className={styles.formTextarea}
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={() => startVoiceInput('message')}
                    className={`${styles.voiceButton} ${currentVoiceField === 'message' && isListening ? styles.listening : ''}`}
                  >
                    {isListening && currentVoiceField === 'message' ? <MicOff /> : <Mic />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Quick Message Suggestions */}
        <div className={styles.quickMessages}>
          <h4 className={styles.quickMessagesTitle}>Quick Message Suggestions:</h4>
          <div className={styles.quickMessageButtons}>
            {quickMessages.map((message, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  const currentIndex = invites.findIndex(invite => 
                    invite.email || invite.name || invite.relationship
                  );
                  if (currentIndex !== -1) {
                    updateInvite(currentIndex, 'message', message);
                  }
                }}
                className={styles.quickMessageButton}
              >
                {message}
              </button>
            ))}
          </div>
        </div>

        {/* Add Another Invite */}
        <button
          type="button"
          onClick={addInvite}
          className={styles.addInviteButton}
        >
          <Plus className={styles.addIcon} />
          Add Another Family Member
        </button>

        {/* Action Buttons */}
        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={loading}
            className={styles.sendInvitationButton}
          >
            {loading ? (
              <div className={styles.loadingSpinner}></div>
            ) : (
              <>
                <Send className={styles.sendIcon} />
                Send {invites.length > 1 ? 'Invitations' : 'Invitation'}
              </>
            )}
          </button>

          <div className={styles.secondaryActions}>
            <button
              type="button"
              onClick={onShowTemplates}
              className={styles.templateButton}
            >
              <Users className={styles.templateIcon} />
              Use Templates
            </button>

            {invitationsCount > 0 && (
              <button
                type="button"
                onClick={onShowPending}
                className={styles.pendingButton}
              >
                View Pending ({invitationsCount})
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
} 