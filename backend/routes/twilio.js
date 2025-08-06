const express = require('express');
const router = express.Router();

const twiml = require('twilio').twiml;

// Voice endpoint that Twilio calls when making a call
router.post('/voice', (req, res) => {
  const VoiceResponse = twiml.VoiceResponse;
  const response = new VoiceResponse();
  
  // Get event details from the call
  const eventTitle = req.body.eventTitle || 'your scheduled event';
  const eventTime = req.body.eventTime || 'soon';
  
  // Create the message
  const message = `Hello! This is a reminder that you have an event called ${eventTitle} starting in 20 minutes. Please prepare for your event. Thank you!`;
  
  // Say the message
  response.say({
    voice: 'alice',
    language: 'en-US'
  }, message);
  
  // Add a pause
  response.pause({ length: 1 });
  
  // Repeat the message
  response.say({
    voice: 'alice',
    language: 'en-US'
  }, message);
  
  res.type('text/xml');
  res.send(response.toString());
});

// Status callback endpoint
router.post('/status', (req, res) => {
  const callSid = req.body.CallSid;
  const callStatus = req.body.CallStatus;
  const callDuration = req.body.CallDuration;
  
  console.log(`Call ${callSid} status: ${callStatus}, duration: ${callDuration} seconds`);
  
  res.status(200).send('OK');
});

// Test endpoint to manually trigger a call
router.post('/test-call', async (req, res) => {
  try {
    const { phoneNumber, eventTitle } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    const { makeCallToElder } = require('../services/twilioService');
    await makeCallToElder(phoneNumber, eventTitle || 'Test Event', new Date());
    
    res.json({ success: true, message: 'Test call initiated' });
  } catch (error) {
    console.error('Test call error:', error);
    res.status(500).json({ error: 'Failed to make test call' });
  }
});

// Immediate test call endpoint
router.post('/test-call-now', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    console.log('Making immediate test call to:', phoneNumber);
    
    const { makeCallToElder } = require('../services/twilioService');
    await makeCallToElder(phoneNumber, 'Test Event - Immediate Call', new Date());
    
    res.json({ success: true, message: 'Test call initiated immediately' });
  } catch (error) {
    console.error('Immediate test call error:', error);
    res.status(500).json({ error: 'Failed to make test call', details: error.message });
  }
});

// Simple test endpoint (no Twilio dependency)
router.get('/test', (req, res) => {
  res.json({ message: 'Twilio routes are working!', timestamp: new Date() });
});

// Simple POST test endpoint
router.post('/test-post', (req, res) => {
  res.json({ 
    message: 'POST to Twilio routes is working!', 
    body: req.body,
    timestamp: new Date() 
  });
});

module.exports = router; 