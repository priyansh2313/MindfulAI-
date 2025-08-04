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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/elder/CareConnect.module.css';
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
}

interface HealthWin {
  id: string;
  message: string;
  category: string;
  sharedBy: string;
  timestamp: Date;
  celebrations: number;
}

export default function FamilyDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'checkins' | 'wins' | 'settings'>('overview');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'PRIYANHSU Dutta',
      relationship: 'Parent',
      isOnline: true,
      lastSeen: new Date()
    }
  ]);

  const [pendingCheckins, setPendingCheckins] = useState<HealthCheckin[]>([
    {
      id: '1',
      question: 'How are you feeling this week?',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  ]);

  const [recentWins, setRecentWins] = useState<HealthWin[]>([
    {
      id: '1',
      message: 'Went for a walk today and felt great!',
      category: 'exercise',
      sharedBy: 'PRIYANHSU Dutta',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      celebrations: 3
    }
  ]);

  const handleLogout = () => {
    logout(navigate);
  };

  const sendCheckin = () => {
    // TODO: Implement send checkin functionality
    console.log('Sending health checkin...');
  };

  const celebrateWin = (winId: string) => {
    setRecentWins(prev => prev.map(win => 
      win.id === winId 
        ? { ...win, celebrations: win.celebrations + 1 }
        : win
    ));
  };

  return (
    <div className={styles.familyDashboardContainer}>
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
                <button className={styles.actionCard} onClick={sendCheckin}>
                  <Calendar className={styles.actionIcon} />
                  <h3>Send Check-in</h3>
                  <p>Ask about their well-being</p>
                </button>
                <button className={styles.actionCard}>
                  <MessageCircle className={styles.actionIcon} />
                  <h3>Send Message</h3>
                  <p>Quick family chat</p>
                </button>
                <button className={styles.actionCard}>
                  <Heart className={styles.actionIcon} />
                  <h3>Celebrate Win</h3>
                  <p>Show support and love</p>
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
                  <div key={win.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <Heart className={styles.activityIconInner} />
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityMessage}>{win.message}</p>
                      <p className={styles.activityMeta}>
                        {win.sharedBy} • {new Date(win.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      className={styles.celebrateButton}
                      onClick={() => celebrateWin(win.id)}
                    >
                      ❤️ {win.celebrations}
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
            
            <div className={styles.checkinsList}>
              {pendingCheckins.map(checkin => (
                <div key={checkin.id} className={styles.checkinItem}>
                  <div className={styles.checkinStatus}>
                    {checkin.status === 'pending' && <Clock className={styles.pendingIcon} />}
                    {checkin.status === 'responded' && <CheckCircle className={styles.respondedIcon} />}
                    {checkin.status === 'overdue' && <AlertCircle className={styles.overdueIcon} />}
                  </div>
                  <div className={styles.checkinContent}>
                    <h3 className={styles.checkinQuestion}>{checkin.question}</h3>
                    <p className={styles.checkinMeta}>
                      Due: {new Date(checkin.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={styles.checkinActions}>
                    <button className={styles.remindButton}>Remind</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wins' && (
          <div className={styles.winsTab}>
            <h2 className={styles.sectionTitle}>Health Wins</h2>
            <div className={styles.winsList}>
              {recentWins.map(win => (
                <div key={win.id} className={styles.winItem}>
                  <div className={styles.winContent}>
                    <h3 className={styles.winMessage}>{win.message}</h3>
                    <p className={styles.winMeta}>
                      {win.sharedBy} • {new Date(win.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={styles.winActions}>
                    <button 
                      className={styles.celebrateButton}
                      onClick={() => celebrateWin(win.id)}
                    >
                      ❤️ {win.celebrations}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={styles.settingsTab}>
            <h2 className={styles.sectionTitle}>Family Settings</h2>
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
    </div>
  );
}