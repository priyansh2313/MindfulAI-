import { AlertCircle, ArrowRight, CheckCircle, Heart, Mail, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setUser } from '../redux/slices/userSlice';
import styles from '../styles/elder/CareConnect.module.css';

interface InvitationData {
  invitationId: string;
  fromName: string;
  fromEmail: string;
  toEmail: string;
  toName: string;
  relationship: string;
  message?: string;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired';
}

export default function InvitationAccept() {
  const { invitationId } = useParams<{ invitationId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  useEffect(() => {
    if (invitationId) {
      loadInvitation();
    }
  }, [invitationId]);

  const loadInvitation = async () => {
    try {
      const baseUrl = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/family/invitations/${invitationId}`);
      if (!response.ok) {
        throw new Error('Invitation not found or expired');
      }
      
      const data = await response.json();
      setInvitation(data);
      
      // Pre-fill email if available
      if (data.toEmail) {
        setFormData(prev => ({ ...prev, email: data.toEmail }));
      }
    } catch (error) {
      setError('This invitation is not valid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    setAccepting(true);
    setError(null);
    
    try {
      const baseUrl = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/family/invitations/${invitationId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept invitation');
      }
      
      const result = await response.json();
      console.log('Invitation acceptance result:', result);
      setAccepted(true);
      
      // Auto-login the user
      localStorage.setItem('token', result.token);
      localStorage.setItem('userId', result.userId);
      
      // Store user data in localStorage and Redux state
      if (result.user) {
        console.log('Setting user data:', result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        dispatch(setUser(result.user));
      }
      
      // Redirect to family dashboard after successful acceptance
      // Small delay to ensure Redux state is updated
      setTimeout(() => {
        console.log('Redirecting to family dashboard...');
        navigate('/family-dashboard');
      }, 100);
      
    } catch (error) {
      setError('Failed to accept invitation. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className={styles.invitationAcceptContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className={styles.invitationAcceptContainer}>
        <div className={styles.errorContainer}>
          <AlertCircle className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Invalid Invitation</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className={styles.invitationAcceptContainer}>
        <div className={styles.successContainer}>
          <div className={styles.successContent}>
            <div className={`${styles.successIcon} ${styles.animate}`}>
              <CheckCircle className={styles.successIconInner} />
            </div>
            
            <h2 className={styles.successTitle}>Welcome to Care Connect!</h2>
            <p className={styles.successMessage}>
              You've successfully joined {invitation?.fromName}'s family circle and created your account. 
              You're being redirected to the Family Dashboard where you can complete your profile setup.
            </p>

            <div className={styles.celebrationIcons}>
              <div className={`${styles.celebrationIcon} ${styles.heart}`}>❤️</div>
              <div className={`${styles.celebrationIcon} ${styles.thumbsUp}`}>👍</div>
              <div className={`${styles.celebrationIcon} ${styles.clap}`}>👏</div>
            </div>

            <button 
              className={styles.backToDashboardButton}
              onClick={() => navigate('/family-dashboard')}
            >
              <ArrowRight className={styles.backIcon} />
              Go to Family Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  const isExpired = new Date(invitation.expiresAt) < new Date();

  if (isExpired) {
    return (
      <div className={styles.invitationAcceptContainer}>
        <div className={styles.errorContainer}>
          <AlertCircle className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Invitation Expired</h2>
          <p className={styles.errorMessage}>
            This invitation has expired. Please ask {invitation.fromName} to send you a new invitation.
          </p>
          <button 
            className={styles.retryButton}
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.invitationAcceptContainer}>
      <div className={styles.invitationAcceptContent}>
        {/* Header */}
        <div className={styles.invitationAcceptHeader}>
          <div className={styles.invitationAcceptHeaderIcon}>
            <Mail className={styles.invitationAcceptHeaderIconInner} />
          </div>
          <div className={styles.invitationAcceptHeaderText}>
            <h1 className={styles.invitationAcceptHeaderTitle}>Accept Invitation</h1>
            <p className={styles.invitationAcceptHeaderSubtitle}>
              Join {invitation.fromName}'s Care Connect family circle
            </p>
          </div>
        </div>

        {/* Invitation Details */}
        <div className={styles.invitationDetails}>
          <div className={styles.invitationDetailCard}>
            <h3 className={styles.invitationDetailTitle}>Invitation from {invitation.fromName}</h3>
            <p className={styles.invitationDetailText}>
              You've been invited to join their Care Connect family circle to stay connected and support each other's health and well-being.
            </p>
            
            {invitation.message && (
              <div className={styles.invitationMessage}>
                <h4 className={styles.invitationMessageTitle}>Personal Message:</h4>
                <p className={styles.invitationMessageText}>"{invitation.message}"</p>
              </div>
            )}

            <div className={styles.invitationFeatures}>
              <h4 className={styles.invitationFeaturesTitle}>What you can do with Care Connect:</h4>
              <div className={styles.invitationFeature}>
                <Heart className={styles.invitationFeatureIcon} />
                <span>Share health wins and achievements</span>
              </div>
              <div className={styles.invitationFeature}>
                <Users className={styles.invitationFeatureIcon} />
                <span>Ask for help when you need support</span>
              </div>
              <div className={styles.invitationFeature}>
                <Mail className={styles.invitationFeatureIcon} />
                <span>Respond to health check-ins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className={styles.registrationForm}>
          <h3 className={styles.registrationFormTitle}>Create Your Account</h3>
          
          {error && (
            <div className={styles.errorMessage}>
              <AlertCircle className={styles.errorIcon} />
              {error}
            </div>
          )}

          <form onSubmit={handleAcceptInvitation} className={styles.form}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a password"
                className={styles.formInput}
                required
                minLength={8}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Confirm Password *</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                className={styles.formInput}
                required
                minLength={8}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className={styles.checkbox}
                  required
                />
                <span className={styles.checkboxText}>
                  I agree to the <a href="/terms" className={styles.link}>Terms of Service</a> and <a href="/privacy" className={styles.link}>Privacy Policy</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={accepting}
              className={styles.acceptInvitationButton}
            >
              {accepting ? (
                <div className={styles.loadingSpinner}></div>
              ) : (
                <>
                  <CheckCircle className={styles.acceptIcon} />
                  Accept Invitation & Join Care Connect
                </>
              )}
            </button>
          </form>
        </div>

        {/* Expiry Notice */}
        <div className={styles.expiryNotice}>
          <AlertCircle className={styles.expiryIcon} />
          <p className={styles.expiryText}>
            This invitation expires on {new Date(invitation.expiresAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
} 