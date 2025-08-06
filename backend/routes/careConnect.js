const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Mock database for family users and check-ins/messages
let familyUsers = new Map();
let checkIns = new Map();
let messages = new Map();

// Get family members for a user
router.get('/family-members', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    console.log('Fetching family members for user:', userId);
    
    // Get the current user to find their inviter
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get all users who have this user as their familyCircle (people they invited)
    const invitedMembers = await User.find({ 
      familyCircle: userId 
    }).select('-password');
    
    // Get the user who invited this user (the inviter)
    let inviter = null;
    if (currentUser.familyCircle) {
      // Check if familyCircle is a valid ObjectId
      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(currentUser.familyCircle)) {
        inviter = await User.findById(currentUser.familyCircle).select('-password');
      } else {
        console.log(`Invalid familyCircle ObjectId: ${currentUser.familyCircle}`);
      }
    }
    
    // Combine both lists
    let allFamilyMembers = [];
    
    // Add inviter if exists
    if (inviter) {
      allFamilyMembers.push({
        id: inviter._id,
        name: inviter.name,
        email: inviter.email,
        role: inviter.role || 'family',
        relationship: currentUser.whoInvited || currentUser.invitedBy || 'Inviter',
        isOnline: true,
        lastSeen: inviter.updatedAt || inviter.createdAt
      });
    }
    
    // Add invited members
    const invitedFormatted = invitedMembers.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'family',
      relationship: 'Invited Member',
      isOnline: true,
      lastSeen: user.updatedAt || user.createdAt
    }));
    
    allFamilyMembers = [...allFamilyMembers, ...invitedFormatted];
    
    console.log('Family members for user:', userId, allFamilyMembers);
    
    res.json(allFamilyMembers);
  } catch (error) {
    console.error('Error getting family members:', error);
    res.status(500).json({ error: 'Failed to get family members' });
  }
});

// Update existing users to add invitedBy field
router.post('/migrate-users', async (req, res) => {
  try {
    console.log('Starting user migration to add invitedBy field...');
    
    // Find all family users that don't have invitedBy field
    const familyUsers = await User.find({ 
      role: 'family',
      invitedBy: { $exists: false }
    });
    
    console.log(`Found ${familyUsers.length} family users to migrate`);
    
    let updatedCount = 0;
    
    for (const user of familyUsers) {
      if (user.familyCircle) {
        // Find the user who invited them
        const inviter = await User.findById(user.familyCircle);
        if (inviter) {
                  // Update the user with the inviter's name
        await User.findByIdAndUpdate(user._id, {
          invitedBy: inviter.name,
          whoInvited: inviter.name
        });
          updatedCount++;
          console.log(`Updated user ${user.name} with invitedBy: ${inviter.name}`);
        }
      }
    }
    
    console.log(`Migration complete. Updated ${updatedCount} users.`);
    res.json({ 
      success: true, 
      message: `Migration complete. Updated ${updatedCount} users.`,
      updatedCount 
    });
  } catch (error) {
    console.error('Error during migration:', error);
    res.status(500).json({ error: 'Migration failed' });
  }
});

// Manually update a specific user's invitedBy field
router.post('/update-user-invitedby', async (req, res) => {
  try {
    const { userId, invitedByName } = req.body;
    
    if (!userId || !invitedByName) {
      return res.status(400).json({ error: 'User ID and invitedBy name are required' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, {
      invitedBy: invitedByName,
      whoInvited: invitedByName
    }, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log(`Updated user ${updatedUser.name} with invitedBy: ${invitedByName}`);
    
    res.json({ 
      success: true, 
      message: `Updated user ${updatedUser.name} with invitedBy: ${invitedByName}`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Get care connect data for a user
router.get('/data', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Mock data for care connect features
    const careConnectData = {
      healthWins: [
        {
          id: '1',
          userId,
          category: 'exercise',
          message: 'Went for a 30-minute walk today',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          recipients: ['family1', 'family2'],
          celebrations: [
            { userId: 'family1', type: 'heart' },
            { userId: 'family2', type: 'clap' }
          ]
        },
        {
          id: '2',
          userId,
          category: 'medication',
          message: 'Took all my medications on time today',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          recipients: ['family1'],
          celebrations: [
            { userId: 'family1', type: 'thumbs_up' }
          ]
        }
      ],
      helpRequests: [
        {
          id: '1',
          userId,
          category: 'medication',
          urgency: 'medium',
          message: 'Need help understanding new medication schedule',
          recipients: ['family1'],
          status: 'pending',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          responses: []
        },
        {
          id: '2',
          userId,
          category: 'appointment',
          urgency: 'low',
          message: 'Can someone help me schedule a doctor appointment?',
          recipients: ['family2'],
          status: 'responded',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          responses: [
            {
              userId: 'family2',
              message: 'I can help you schedule that appointment. What day works best for you?',
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
            }
          ]
        }
      ],
      healthCheckins: [
        {
          id: '1',
          fromUserId: 'family1',
          fromUserName: 'Sarah Johnson',
          question: 'How are you feeling this week?',
          responseType: 'text',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          response: 'Feeling much better, thank you for asking!'
        },
        {
          id: '2',
          fromUserId: 'family2',
          fromUserName: 'Michael Johnson',
          question: 'Are you taking your medications regularly?',
          responseType: 'text',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          response: 'Yes, I\'m being very careful about my medication schedule.'
        }
      ],
      recentActivity: [
        {
          id: '1',
          type: 'health_win',
          message: 'Shared a health win about exercise',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          type: 'help_request',
          message: 'Asked for help with medication',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          id: '3',
          type: 'health_checkin',
          message: 'Responded to health check-in from Sarah',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
        }
      ]
    };
    
    res.json(careConnectData);
  } catch (error) {
    console.error('Error getting care connect data:', error);
    res.status(500).json({ error: 'Failed to get care connect data' });
  }
});

// Send health win
router.post('/health-wins', async (req, res) => {
  try {
    const { userId, category, message, recipients, photo } = req.body;
    
    const healthWin = {
      id: Date.now().toString(),
      userId,
      category,
      message,
      photo,
      timestamp: new Date(),
      recipients,
      celebrations: []
    };
    
    res.json(healthWin);
  } catch (error) {
    console.error('Error sending health win:', error);
    res.status(500).json({ error: 'Failed to send health win' });
  }
});

// Send help request
router.post('/help-requests', async (req, res) => {
  try {
    const { userId, category, urgency, message, recipients, voiceMessage } = req.body;
    
    const helpRequest = {
      id: Date.now().toString(),
      userId,
      category,
      urgency,
      message,
      voiceMessage,
      recipients,
      status: 'pending',
      timestamp: new Date(),
      responses: []
    };
    
    res.json(helpRequest);
  } catch (error) {
    console.error('Error sending help request:', error);
    res.status(500).json({ error: 'Failed to send help request' });
  }
});

// Respond to health checkin
router.post('/health-checkins/:checkinId/respond', async (req, res) => {
  try {
    const { checkinId } = req.params;
    const { response, responseType, rating } = req.body;
    
    const checkinResponse = {
      id: Date.now().toString(),
      checkinId,
      response,
      responseType,
      rating,
      timestamp: new Date()
    };
    
    res.json(checkinResponse);
  } catch (error) {
    console.error('Error responding to health checkin:', error);
    res.status(500).json({ error: 'Failed to respond to health checkin' });
  }
});

// Get health wins for a user
router.get('/health-wins', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Mock health wins data
    const healthWins = [
      {
        id: '1',
        userId,
        category: 'exercise',
        message: 'Went for a 30-minute walk today',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        recipients: ['family1', 'family2'],
        celebrations: [
          { userId: 'family1', type: 'heart' },
          { userId: 'family2', type: 'clap' }
        ]
      },
      {
        id: '2',
        userId,
        category: 'medication',
        message: 'Took all my medications on time today',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        recipients: ['family1'],
        celebrations: [
          { userId: 'family1', type: 'thumbs_up' }
        ]
      }
    ];
    
    res.json(healthWins);
  } catch (error) {
    console.error('Error getting health wins:', error);
    res.status(500).json({ error: 'Failed to get health wins' });
  }
});

// Get help requests for a user
router.get('/help-requests', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Mock help requests data
    const helpRequests = [
      {
        id: '1',
        userId,
        category: 'medication',
        urgency: 'medium',
        message: 'Need help understanding new medication schedule',
        recipients: ['family1'],
        status: 'pending',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        responses: []
      },
      {
        id: '2',
        userId,
        category: 'appointment',
        urgency: 'low',
        message: 'Can someone help me schedule a doctor appointment?',
        recipients: ['family2'],
        status: 'responded',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        responses: [
          {
            userId: 'family2',
            message: 'I can help you schedule that appointment. What day works best for you?',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
          }
        ]
      }
    ];
    
    res.json(helpRequests);
  } catch (error) {
    console.error('Error getting help requests:', error);
    res.status(500).json({ error: 'Failed to get help requests' });
  }
});

// Get health checkins for a user
router.get('/health-checkins', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Mock health checkins data
    const healthCheckins = [
      {
        id: '1',
        fromUserId: 'family1',
        fromUserName: 'Sarah Johnson',
        question: 'How are you feeling this week?',
        responseType: 'text',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        response: 'Feeling much better, thank you for asking!'
      },
      {
        id: '2',
        fromUserId: 'family2',
        fromUserName: 'Michael Johnson',
        question: 'Are you taking your medications regularly?',
        responseType: 'text',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        response: 'Yes, I\'m being very careful about my medication schedule.'
      }
    ];
    
    res.json(healthCheckins);
  } catch (error) {
    console.error('Error getting health checkins:', error);
    res.status(500).json({ error: 'Failed to get health checkins' });
  }
});

// Send health check-in
router.post('/send-checkin', async (req, res) => {
  try {
    const { fromUserId, toUserId, question, responseType = 'text' } = req.body;
    
    // Validate required fields
    if (!fromUserId || !toUserId || !question) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get sender's name
    const sender = await User.findById(fromUserId).select('name');
    if (!sender) {
      return res.status(404).json({ error: 'Sender not found' });
    }
    
    // Create check-in
    const checkInId = `checkin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const checkIn = {
      id: checkInId,
      fromUserId,
      fromUserName: sender.name,
      toUserId,
      question,
      responseType,
      status: 'pending',
      timestamp: new Date(),
      response: null,
      responseTimestamp: null
    };
    
    checkIns.set(checkInId, checkIn);
    
    console.log('Health check-in sent:', checkIn);
    
    res.json({
      success: true,
      message: 'Health check-in sent successfully',
      checkIn
    });
  } catch (error) {
    console.error('Error sending check-in:', error);
    res.status(500).json({ error: 'Failed to send check-in' });
  }
});

// Send message
router.post('/send-message', async (req, res) => {
  try {
    const { fromUserId, toUserId, message, messageType = 'text' } = req.body;
    
    // Validate required fields
    if (!fromUserId || !toUserId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get sender's name
    const sender = await User.findById(fromUserId).select('name');
    if (!sender) {
      return res.status(404).json({ error: 'Sender not found' });
    }
    
    // Create message
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newMessage = {
      id: messageId,
      fromUserId,
      fromUserName: sender.name,
      toUserId,
      message,
      messageType,
      timestamp: new Date(),
      read: false
    };
    
    messages.set(messageId, newMessage);
    
    console.log('Message sent:', newMessage);
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      message: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get check-ins for a user
router.get('/checkins/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get check-ins sent to this user
    const userCheckIns = Array.from(checkIns.values())
      .filter(checkIn => checkIn.toUserId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(userCheckIns);
  } catch (error) {
    console.error('Error getting check-ins:', error);
    res.status(500).json({ error: 'Failed to get check-ins' });
  }
});

// Get messages for a user
router.get('/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get messages sent to this user
    const userMessages = Array.from(messages.values())
      .filter(msg => msg.toUserId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(userMessages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Respond to check-in
router.post('/respond-checkin', async (req, res) => {
  try {
    const { checkInId, response } = req.body;
    
    const checkIn = checkIns.get(checkInId);
    if (!checkIn) {
      return res.status(404).json({ error: 'Check-in not found' });
    }
    
    // Update check-in with response
    checkIn.response = response;
    checkIn.responseTimestamp = new Date();
    checkIn.status = 'responded';
    
    checkIns.set(checkInId, checkIn);
    
    console.log('Check-in responded to:', checkIn);
    
    res.json({
      success: true,
      message: 'Response sent successfully',
      checkIn
    });
  } catch (error) {
    console.error('Error responding to check-in:', error);
    res.status(500).json({ error: 'Failed to respond to check-in' });
  }
});

// Fix user with invalid familyCircle
router.post('/fix-family-circle', async (req, res) => {
  try {
    const { userId, correctFamilyCircleId } = req.body;
    
    if (!userId || !correctFamilyCircleId) {
      return res.status(400).json({ error: 'User ID and correct family circle ID are required' });
    }
    
    // Validate the new family circle ID
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(correctFamilyCircleId)) {
      return res.status(400).json({ error: 'Invalid family circle ID format' });
    }
    
    // Check if the target user exists
    const targetUser = await User.findById(correctFamilyCircleId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Target family circle user not found' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, {
      familyCircle: correctFamilyCircleId
    }, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Family circle updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating family circle:', error);
    res.status(500).json({ error: 'Failed to update family circle' });
  }
});

// List all users for debugging
router.get('/list-users', async (req, res) => {
  try {
    const users = await User.find({}).select('_id name email role familyCircle invitedBy whoInvited');
    res.json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

module.exports = router;