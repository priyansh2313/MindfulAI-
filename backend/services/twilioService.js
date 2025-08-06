const twilio = require('twilio');
const cron = require('node-cron');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Store scheduled calls
const scheduledCalls = new Map();

/**
 * Schedule a call to an elder 20 minutes before an event
 * @param {string} eventId - The event ID
 * @param {string} elderPhone - Elder's phone number
 * @param {string} eventTitle - Title of the event
 * @param {Date} eventTime - When the event starts
 */
const scheduleCallForEvent = (eventId, elderPhone, eventTitle, eventTime) => {
  // Calculate call time (20 minutes before event)
  const callTime = new Date(eventTime.getTime() - 20 * 60 * 1000);
  
  // Only schedule if call time is in the future
  if (callTime <= new Date()) {
    console.log(`Call time ${callTime} is in the past, not scheduling call for event ${eventId}`);
    return;
  }

  // Schedule the call using cron
  const cronExpression = `${callTime.getMinutes()} ${callTime.getHours()} ${callTime.getDate()} ${callTime.getMonth() + 1} *`;
  
  const task = cron.schedule(cronExpression, async () => {
    try {
      await makeCallToElder(elderPhone, eventTitle, eventTime);
      console.log(`Call made to elder for event: ${eventTitle}`);
    } catch (error) {
      console.error('Error making call to elder:', error);
    }
  }, {
    scheduled: false
  });

  // Start the task
  task.start();
  
  // Store the task for potential cancellation
  scheduledCalls.set(eventId, task);
  
  console.log(`Call scheduled for event ${eventId} at ${callTime}`);
};

/**
 * Make a call to an elder
 * @param {string} elderPhone - Elder's phone number
 * @param {string} eventTitle - Title of the event
 * @param {Date} eventTime - When the event starts
 */
const makeCallToElder = async (elderPhone, eventTitle, eventTime) => {
  try {
    const call = await client.calls.create({
      url: `${process.env.BASE_URL}/api/twilio/voice`, // We'll create this endpoint
      to: elderPhone,
      from: process.env.TWILIO_PHONE_NUMBER,
      method: 'POST',
      statusCallback: `${process.env.BASE_URL}/api/twilio/status`,
      statusCallbackEvent: ['completed', 'failed'],
      statusCallbackMethod: 'POST'
    });
    
    console.log(`Call initiated to ${elderPhone} for event: ${eventTitle}`);
    return call;
  } catch (error) {
    console.error('Error making call:', error);
    throw error;
  }
};

/**
 * Cancel a scheduled call
 * @param {string} eventId - The event ID
 */
const cancelScheduledCall = (eventId) => {
  const task = scheduledCalls.get(eventId);
  if (task) {
    task.stop();
    scheduledCalls.delete(eventId);
    console.log(`Call cancelled for event: ${eventId}`);
  }
};

/**
 * Get all scheduled calls
 */
const getScheduledCalls = () => {
  return Array.from(scheduledCalls.keys());
};

module.exports = {
  scheduleCallForEvent,
  makeCallToElder,
  cancelScheduledCall,
  getScheduledCalls
};