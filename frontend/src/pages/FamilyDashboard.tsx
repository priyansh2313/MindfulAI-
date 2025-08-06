import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  LogOut,
  MessageCircle,
  Plus,
  Settings
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CareConnectCalendar from '../components/elder/CareConnect/CareConnectCalendar';
import axios from '../hooks/axios/axios';
import styles from '../styles/family.module.css';
import { logout } from '../utils/auth';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  isOnline: boolean;
  lastSeen: Date;
}

interface HealthCheckin {
  id: string;
  question: string;
  response?: string;
  status: 'pending' | 'responded' | 'overdue';
  createdAt: Date;
  dueDate: Date;
  fromUserName?: string;
  timestamp?: Date;
}

interface HealthWin {
  id: string;
  message: string;
  category: string;
  sharedBy: string;
  timestamp: Date;
  celebrations: number;
}

interface HelpRequest {
  id: string;
  title?: string;
  description?: string;
  fromUserName?: string;
  timestamp?: Date;
  status?: string;
}

export default function FamilyDashboard() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user?.user);
  const [activeTab, setActiveTab] = useState<'overview' | 'checkins' | 'wins' | 'help' | 'settings' | 'calendar'>('overview');
  const [showWelcome, setShowWelcome] = useState(true); // Show welcome for new users
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<any>(null);
  const [checkinQuestion, setCheckinQuestion] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  
  // Debug family members state
  console.log('Family members state:', familyMembers);
  console.log('Family members count:', familyMembers.length);
  const [loadingFamilyMembers, setLoadingFamilyMembers] = useState(true);
  const [pendingCheckins, setPendingCheckins] = useState<HealthCheckin[]>([]);
  const [loadingCheckins, setLoadingCheckins] = useState(true);
  const [recentWins, setRecentWins] = useState<HealthWin[]>([]);
  const [loadingWins, setLoadingWins] = useState(true);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loadingHelpRequests, setLoadingHelpRequests] = useState(true);

  // Fetch family members on component mount
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      console.log('fetchFamilyMembers called');
      console.log('User object:', user);
      console.log('User ID:', user?._id);
      
      if (!user?._id) {
        console.log('No user ID available');
        return;
      }
      
      try {
        setLoadingFamilyMembers(true);
        console.log('Fetching family members for user:', user._id);
        const response = await axios.get(`/api/care-connect/family-members?userId=${user._id}`);
        console.log('Family members response:', response.data);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          setFamilyMembers(response.data);
        } else {
          console.error('Response data is not an array:', response.data);
          // Don't set fallback data - let the API handle it
          setFamilyMembers([]);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        toast.error('Failed to load family members');
        // Don't set fallback data - let the API handle it
        setFamilyMembers([]);
      } finally {
        setLoadingFamilyMembers(false);
      }
    };

    fetchFamilyMembers();
  }, [user?._id]);

  // Fetch check-ins for the user
  useEffect(() => {
    const fetchCheckins = async () => {
      if (!user?._id) {
        console.log('No user ID available for check-ins');
        return;
      }
      
      try {
        setLoadingCheckins(true);
        console.log('Fetching check-ins for user:', user._id);
        const response = await axios.get<HealthCheckin[]>(`/api/care-connect/checkins/${user._id}`);
        console.log('Check-ins response:', response.data);
        setPendingCheckins(response.data);
      } catch (error) {
        console.error('Error fetching check-ins:', error);
        // Set empty array if API fails
        setPendingCheckins([]);
      } finally {
        setLoadingCheckins(false);
      }
    };

    fetchCheckins();
  }, [user?._id]);

  // Fetch health wins
  useEffect(() => {
    const fetchWins = async () => {
      if (!user?._id) {
        console.log('No user ID available for wins');
        return;
      }
      
      try {
        setLoadingWins(true);
        console.log('Fetching health wins for user:', user._id);
        const response = await axios.get<HealthWin[]>(`/api/care-connect/health-wins?userId=${user._id}`);
        console.log('Health wins response:', response.data);
        setRecentWins(response.data);
      } catch (error) {
        console.error('Error fetching health wins:', error);
        // Remove fallback to mock data if API fails
        setRecentWins([]);
      } finally {
        setLoadingWins(false);
      }
    };

    fetchWins();
  }, [user?._id]);

  // Fetch help requests
  useEffect(() => {
    const fetchHelpRequests = async () => {
      if (!user?._id) {
        console.log('No user ID available for help requests');
        return;
      }
      
      try {
        setLoadingHelpRequests(true);
        console.log('Fetching help requests for user:', user._id);
        const response = await axios.get<HelpRequest[]>(`/api/care-connect/help-requests?userId=${user._id}`);
        console.log('Help requests response:', response.data);
        setHelpRequests(response.data);
      } catch (error) {
        console.error('Error fetching help requests:', error);
        // Set empty array if API fails
        setHelpRequests([]);
      } finally {
        setLoadingHelpRequests(false);
      }
    };

    fetchHelpRequests();
  }, [user?._id]);

  const handleLogout = () => {
    try {
      logout(navigate);
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback logout
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const sendCheckin = async () => {
    if (!user?._id) {
      toast.error('User not authenticated');
      return;
    }

    if (!selectedFamilyMember || !checkinQuestion.trim()) {
      toast.error('Please select a family member and enter a question');
      return;
    }

    console.log('Sending check-in:', {
      fromUserId: user._id,
      toUserId: selectedFamilyMember.id,
      question: checkinQuestion.trim(),
      responseType: 'text'
    });

    setSending(true);
    try {
      const response = await axios.post('/api/care-connect/send-checkin', {
        fromUserId: user._id,
        toUserId: selectedFamilyMember.id,
        question: checkinQuestion.trim(),
        responseType: 'text'
      });

      console.log('Check-in response:', response.data);

      if ((response.data as { success: boolean }).success) {
        toast.success('Health check-in sent successfully!');
        setShowCheckinModal(false);
        setCheckinQuestion('');
        setSelectedFamilyMember(null);
      } else {
        toast.error('Failed to send check-in. Please try again.');
      }
    } catch (error) {
      console.error('Error sending check-in:', error);
      toast.error('Failed to send check-in. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const sendMessage = async () => {
    if (!user?._id) {
      toast.error('User not authenticated');
      return;
    }

    if (!selectedFamilyMember || !messageText.trim()) {
      toast.error('Please select a family member and enter a message');
      return;
    }

    console.log('Sending message:', {
      fromUserId: user._id,
      toUserId: selectedFamilyMember.id,
      message: messageText.trim(),
      messageType: 'text'
    });

    setSending(true);
    try {
      const response = await axios.post('/api/care-connect/send-message', {
        fromUserId: user._id,
        toUserId: selectedFamilyMember.id,
        message: messageText.trim(),
        messageType: 'text'
      });

      console.log('Message response:', response.data);

      if ((response.data as { success: boolean }).success) {
        toast.success('Message sent successfully!');
        setShowMessageModal(false);
        setMessageText('');
        setSelectedFamilyMember(null);
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const celebrateWin = (winId: string) => {
    if (!winId) return;
    
    setRecentWins(prev => prev.map(win => 
      win.id === winId 
        ? { ...win, celebrations: (win.celebrations || 0) + 1 }
        : win
    ));
  };

  // Don't render if user is not available
  if (!user) {
    return (
      <div className={styles.familyDashboardContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }



  return (
    <div className={styles.familyDashboardContainer}>
      {/* Welcome Modal for New Users */}
      {showWelcome && (
        <div className={styles.welcomeOverlay}>
          <div className={styles.welcomeModal}>
            <div className={styles.welcomeContent}>
              <div className={styles.welcomeIcon}>
                <Heart className={styles.welcomeIconInner} />
              </div>
              
              <h2 className={styles.welcomeTitle}>Welcome to Your Family Dashboard!</h2>
              <p className={styles.welcomeMessage}>
                You've successfully joined the Care Connect family circle. 
                Complete your profile setup to start connecting with your loved ones.
              </p>
              
              <div className={styles.welcomeFeatures}>
                <div className={styles.welcomeFeature}>
                  <CheckCircle className={styles.featureIcon} />
                  <span>Send health check-ins to family members</span>
                </div>
                <div className={styles.welcomeFeature}>
                  <MessageCircle className={styles.featureIcon} />
                  <span>Stay connected through messages and updates</span>
                </div>
                <div className={styles.welcomeFeature}>
                  <Heart className={styles.featureIcon} />
                  <span>Celebrate health wins together</span>
                </div>
              </div>
              
              <div className={styles.welcomeActions}>
                <button 
                  className={styles.completeProfileButton}
                  onClick={() => {
                    setShowWelcome(false);
                    setActiveTab('settings');
                  }}
                >
                  Complete Profile Setup
                </button>
                <button 
                  className={styles.skipButton}
                  onClick={() => setShowWelcome(false)}
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={styles.familyDashboardHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.familyDashboardTitle}>Family Care Dashboard</h1>
          <p className={styles.familyDashboardSubtitle}>Stay connected with your loved ones</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.notificationButton}>
            <Bell className={styles.notificationIcon} />
          </button>
          <button className={styles.settingsButton}>
            <Settings className={styles.settingsIcon} />
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <LogOut className={styles.logoutIcon} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.familyDashboardTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Heart className={styles.tabIcon} />
          Overview
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'checkins' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('checkins')}
        >
          <Calendar className={styles.tabIcon} />
          Check-ins
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'wins' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('wins')}
        >
          <CheckCircle className={styles.tabIcon} />
          Health Wins
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'help' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('help')}
        >
          <MessageCircle className={styles.tabIcon} />
          Help Requests
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'calendar' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar className={styles.tabIcon} />
          Calendar
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'settings' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className={styles.tabIcon} />
          Settings
        </button>
      </div>

      {/* Content */}
      <div className={styles.familyDashboardContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewTab}>
            {/* Quick Actions */}
            <div className={styles.quickActions}>
              <h2 className={styles.sectionTitle}>Quick Actions</h2>
              <div className={styles.actionGrid}>
                <button 
                  className={styles.actionCard} 
                  onClick={() => setShowCheckinModal(true)}
                >
                  <Calendar className={styles.actionIcon} />
                  <h3>Send Check-in</h3>
                  <p>Ask about their well-being</p>
                </button>
                <button 
                  className={styles.actionCard}
                  onClick={() => setShowMessageModal(true)}
                >
                  <MessageCircle className={styles.actionIcon} />
                  <h3>Send Message</h3>
                  <p>Quick family chat</p>
                </button>
                <button className={styles.actionCard}>
                  <Heart className={styles.actionIcon} />
                  <h3>Celebrate Win</h3>
                  <p>Show support and love</p>
                </button>
                <button 
                  className={styles.actionCard}
                  onClick={() => setActiveTab('calendar')}
                >
                  <Calendar className={styles.actionIcon} />
                  <h3>Family Calendar</h3>
                  <p>View shared events</p>
                </button>
              </div>
            </div>

            {/* Family Status */}
            <div className={styles.familyStatus}>
              <h2 className={styles.sectionTitle}>Family Status</h2>
              <div className={styles.familyMembers}>
                {familyMembers.map(member => (
                  <div key={member.id} className={styles.familyMember}>
                    <div className={`${styles.memberAvatar} ${member.isOnline ? styles.online : styles.offline}`}>
                      <span className={styles.memberInitials}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
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
              <h2 className={styles.sectionTitle}>Recent Activity</h2>
              <div className={styles.activityList}>
                {recentWins.map(win => (
                  <div key={win.id || Math.random()} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <Heart className={styles.activityIconInner} />
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityMessage}>{String(win.message || '')}</p>
                      <p className={styles.activityMeta}>
                        {String(win.sharedBy || 'Unknown')} • {win.timestamp ? new Date(win.timestamp).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                    <button 
                      className={styles.celebrateButton}
                      onClick={() => celebrateWin(win.id)}
                    >
                      ❤️ {Number(win.celebrations || 0)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checkins' && (
          <div className={styles.checkinsTab}>
            <div className={styles.checkinsHeader}>
              <h2 className={styles.sectionTitle}>Health Check-ins</h2>
              <button className={styles.newCheckinButton}>
                <Plus className={styles.plusIcon} />
                New Check-in
              </button>
            </div>
            
            {loadingCheckins ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading check-ins...</p>
              </div>
            ) : pendingCheckins.length === 0 ? (
              <div className={styles.emptyState}>
                <Calendar className={styles.emptyIcon} />
                <h3>No Check-ins Yet</h3>
                <p>When family members send you health check-ins, they'll appear here.</p>
              </div>
            ) : (
              <div className={styles.checkinsList}>
                {pendingCheckins.map(checkin => (
                  <div key={checkin.id || Math.random()} className={styles.checkinItem}>
                    <div className={styles.checkinStatus}>
                      {checkin.status === 'pending' && <Clock className={styles.pendingIcon} />}
                      {checkin.status === 'responded' && <CheckCircle className={styles.respondedIcon} />}
                      {checkin.status === 'overdue' && <AlertCircle className={styles.overdueIcon} />}
                    </div>
                    <div className={styles.checkinContent}>
                      <h3 className={styles.checkinQuestion}>{String(checkin.question || '')}</h3>
                      <p className={styles.checkinMeta}>
                        From: {String(checkin.fromUserName || 'Unknown')} • {checkin.timestamp ? new Date(checkin.timestamp).toLocaleDateString() : new Date(checkin.createdAt).toLocaleDateString()}
                      </p>
                      {checkin.response && (
                        <p className={styles.checkinResponse}>
                          Response: {String(checkin.response)}
                        </p>
                      )}
                    </div>
                    <div className={styles.checkinActions}>
                      {checkin.status === 'pending' && (
                        <button className={styles.remindButton}>Respond</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wins' && (
          <div className={styles.winsTab}>
            <h2 className={styles.sectionTitle}>Health Wins</h2>
            <div className={styles.winsList}>
              {loadingWins ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Loading health wins...</p>
                </div>
              ) : recentWins.length === 0 ? (
                <div className={styles.emptyState}>
                  <CheckCircle className={styles.emptyIcon} />
                  <h3>No Health Wins Yet</h3>
                  <p>When family members share their health victories, they'll appear here.</p>
                </div>
              ) : (
                <div className={styles.winsList}>
                  {recentWins.map(win => (
                    <div key={win.id || Math.random()} className={styles.winItem}>
                      <div className={styles.winContent}>
                        <h3 className={styles.winMessage}>{String(win.message || '')}</h3>
                        <p className={styles.winMeta}>
                          {String(win.sharedBy || 'Unknown')} • {win.timestamp ? new Date(win.timestamp).toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                      <div className={styles.winActions}>
                        <button 
                          className={styles.celebrateButton}
                          onClick={() => celebrateWin(win.id)}
                        >
                          ❤️ {Number(win.celebrations || 0)}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'help' && (
          <div className={styles.helpRequestsTab}>
            <h2 className={styles.sectionTitle}>Help Requests</h2>
            <div className={styles.helpRequestsList}>
              {loadingHelpRequests ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Loading help requests...</p>
                </div>
              ) : helpRequests.length === 0 ? (
                <div className={styles.emptyState}>
                  <MessageCircle className={styles.emptyIcon} />
                  <h3>No Help Requests Yet</h3>
                  <p>When family members need assistance, they'll appear here.</p>
                </div>
              ) : (
                <div className={styles.helpRequestsList}>
                  {helpRequests.map(request => (
                    <div key={request.id || Math.random()} className={styles.helpRequestItem}>
                      <div className={styles.helpRequestContent}>
                        <h3 className={styles.helpRequestTitle}>{String(request.title || 'Help Request')}</h3>
                        <p className={styles.helpRequestDescription}>{String(request.description || 'No description available')}</p>
                        <p className={styles.helpRequestMeta}>
                          From: {String(request.fromUserName || 'Unknown')} • {request.timestamp ? new Date(request.timestamp).toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                      <div className={styles.helpRequestActions}>
                        <button className={styles.acceptButton}>Accept</button>
                        <button className={styles.rejectButton}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className={styles.calendarTab}>
            <h2 className={styles.sectionTitle}>Family Calendar</h2>
            <div className={styles.calendarContainer}>
              {user?._id ? (
                <CareConnectCalendar
                  familyCircleId={user.familyCircle || 'default'}
                  userId={user._id}
                />
              ) : (
                <div className={styles.emptyState}>
                  <Calendar className={styles.emptyIcon} />
                  <h3>No Family Circle</h3>
                  <p>Join or create a family circle to access the shared calendar.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={styles.settingsTab}>
            <h2 className={styles.sectionTitle}>Family Settings</h2>
            
            {/* Profile Setup Section */}
            <div className={styles.profileSetupSection}>
              <h3 className={styles.profileSetupTitle}>Complete Your Profile</h3>
              <p className={styles.profileSetupSubtitle}>
                Set up your profile to personalize your Care Connect experience
              </p>
              
              <div className={styles.profileSetupForm}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Profile Picture</label>
                  <div className={styles.profilePictureUpload}>
                    <div className={styles.profilePicturePlaceholder}>
                      <Heart className={styles.profilePictureIcon} />
                    </div>
                    <button className={styles.uploadButton}>Upload Photo</button>
                  </div>
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Relationship to Family</label>
                  <select className={styles.formSelect}>
                    <option value="">Select relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="caregiver">Caregiver</option>
                  </select>
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Phone Number</label>
                  <input 
                    type="tel" 
                    className={styles.formInput}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Emergency Contact</label>
                  <input 
                    type="text" 
                    className={styles.formInput}
                    placeholder="Name of emergency contact"
                  />
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Emergency Contact Phone</label>
                  <input 
                    type="tel" 
                    className={styles.formInput}
                    placeholder="Emergency contact phone number"
                  />
                </div>
                
                <button className={styles.saveProfileButton}>
                  Save Profile
                </button>
              </div>
            </div>
            
            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <h3>Notification Preferences</h3>
                <p>Manage how you receive updates</p>
              </div>
              <div className={styles.settingItem}>
                <h3>Privacy Settings</h3>
                <p>Control your information sharing</p>
              </div>
              <div className={styles.settingItem}>
                <h3>Family Circle</h3>
                <p>Manage family member access</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Check-in Modal */}
      {showCheckinModal && (
        <div style={{ position: 'fixed', top: '10px', right: '10px', background: 'red', color: 'white', padding: '10px', zIndex: 9999 }}>
          Debug: Modal is open, Family members: {familyMembers.length}
          <button 
            onClick={() => {
              console.log('Setting test family members');
              setFamilyMembers([
                { id: '1', name: 'Sarah Johnson', relationship: 'Daughter', isOnline: true, lastSeen: new Date() },
                { id: '2', name: 'Michael Johnson', relationship: 'Son', isOnline: false, lastSeen: new Date() },
                { id: '3', name: 'Emma Johnson', relationship: 'Granddaughter', isOnline: true, lastSeen: new Date() },
              ]);
            }}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            Load Test Data
          </button>
        </div>
      )}
      {showCheckinModal && (
        <div className={styles.welcomeOverlay}>
          <div className={styles.welcomeModal}>
            <div className={styles.welcomeContent}>
              <h2 className={styles.welcomeTitle}>Send Health Check-in</h2>
              <p className={styles.welcomeMessage}>
                Send a caring check-in to your family member
              </p>
              
              <div className={styles.profileSetupForm}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Select Family Member</label>
                  <select 
                    className={styles.formSelect}
                    value={selectedFamilyMember?.id || ''}
                    onChange={(e) => {
                      const member = familyMembers.find(m => m.id === e.target.value);
                      setSelectedFamilyMember(member || null);
                    }}
                  >
                    <option value="">Choose a family member</option>
                    {familyMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Check-in Question</label>
                  <textarea
                    className={styles.formInput}
                    placeholder="e.g., How are you feeling today?"
                    value={checkinQuestion}
                    onChange={(e) => setCheckinQuestion(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              <div className={styles.welcomeActions}>
                <button 
                  className={styles.completeProfileButton}
                  onClick={sendCheckin}
                  disabled={sending}
                >
                  {sending ? 'Sending...' : 'Send Check-in'}
                </button>
                <button 
                  className={styles.skipButton}
                  onClick={() => {
                    setShowCheckinModal(false);
                    setCheckinQuestion('');
                    setSelectedFamilyMember(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className={styles.welcomeOverlay}>
          <div className={styles.welcomeModal}>
            <div className={styles.welcomeContent}>
              <h2 className={styles.welcomeTitle}>Send Message</h2>
              <p className={styles.welcomeMessage}>
                Send a personal message to your family member
              </p>
              
              <div className={styles.profileSetupForm}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Select Family Member</label>
                  <select 
                    className={styles.formSelect}
                    value={selectedFamilyMember?.id || ''}
                    onChange={(e) => {
                      const member = familyMembers.find(m => m.id === e.target.value);
                      setSelectedFamilyMember(member || null);
                    }}
                  >
                    <option value="">Choose a family member</option>
                    {familyMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Message</label>
                  <textarea
                    className={styles.formInput}
                    placeholder="Write your message here..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              
              <div className={styles.welcomeActions}>
                <button 
                  className={styles.completeProfileButton}
                  onClick={sendMessage}
                  disabled={sending}
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
                <button 
                  className={styles.skipButton}
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageText('');
                    setSelectedFamilyMember(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}