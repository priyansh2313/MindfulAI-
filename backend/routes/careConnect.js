const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Mock database for family users (in production, use MongoDB)
let familyUsers = new Map();

// Get family members for a user
router.get('/family-members', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Get family members from both regular users and family users
    const familyMembers = [];
    
    // Get regular users who are family members
    const regularFamilyMembers = await User.find({ 
      familyCircle: userId 
    }).select('-password');
    
    // Get family users who are connected to this user
    const familyUsersList = Array.from(familyUsers.values())
      .filter(user => user.familyCircle === userId);
    
    // Combine and format the results
    const allFamilyMembers = [
      ...regularFamilyMembers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'family',
        relationship: 'Family Member',
        isActive: true,
        lastSeen: user.updatedAt || user.createdAt
      })),
      ...familyUsersList.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'family',
        relationship: 'Family Member',
        isActive: true,
        lastSeen: user.createdAt
      }))
    ];
    
    res.json(allFamilyMembers);
  } catch (error) {
    console.error('Error getting family members:', error);
    res.status(500).json({ error: 'Failed to get family members' });
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

module.exports = router;