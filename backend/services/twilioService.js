// services/twilioService.js
require('dotenv').config();                // ← make sure this is at the very top
const twilio = require('twilio');
const cron   = require('node-cron');

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  BASE_URL                              // e.g. https://dc2bd3278ac1.ngrok-free.app
} = process.env;

// Validate Twilio credentials
if (!TWILIO_ACCOUNT_SID?.startsWith('AC') || !TWILIO_AUTH_TOKEN) {
  throw new Error(
    'Invalid Twilio credentials: ensure TWILIO_ACCOUNT_SID (starts with AC) and TWILIO_AUTH_TOKEN are set.'
  );
}
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const scheduledCalls = new Map();

/**
 * Schedule a call to an elder 20 minutes before an event
 */
function scheduleCallForEvent(eventId, elderPhone, eventTitle, eventTime) {
  const callTime = new Date(eventTime.getTime() - 20 * 60 * 1000);
  if (callTime <= new Date()) {
    console.log(`Call time ${callTime} is in the past; skipping event ${eventId}`);
    return;
  }

  // Cron: “min hour day month *”
  const cronExpression = `${callTime.getMinutes()} ${callTime.getHours()} ${callTime.getDate()} ${callTime.getMonth()+1} *`;
  const task = cron.schedule(cronExpression, async () => {
    try {
      await makeCallToElder(elderPhone, eventTitle, eventTime);
      console.log(`✅ Call made for event "${eventTitle}"`);
    } catch (err) {
      console.error('Error making scheduled call:', err);
    }
  }, { scheduled: false });

  task.start();
  scheduledCalls.set(eventId, task);
  console.log(`🗓️  Scheduled call for "${eventTitle}" at ${callTime}`);
}

/**
 * Make a call to an elder
 */
async function makeCallToElder(elderPhone, eventTitle, eventTime) {
  // Build the full TwiML webhook URL including your ngrok BASE_URL
  const voiceWebhook = `${BASE_URL}/api/twilio/voice`
    + `?eventTitle=${encodeURIComponent(eventTitle)}`
    + `&eventTime=${encodeURIComponent(eventTime.toISOString())}`;

  const statusCallback = `${BASE_URL}/api/twilio/status`;

  try {
    const call = await client.calls.create({
      to: elderPhone,
      from: TWILIO_PHONE_NUMBER,
      url: voiceWebhook,                 // ← full https://… URL
      method: 'POST',
      statusCallback,
      statusCallbackEvent: ['completed','failed'],
      statusCallbackMethod: 'POST'
    });
    console.log(`📞 Call initiated to ${elderPhone} for "${eventTitle}"`);
    return call;
  } catch (error) {
    console.error('Error making call:', error);
    throw error;
  }
}

function cancelScheduledCall(eventId) {
  const task = scheduledCalls.get(eventId);
  if (task) {
    task.stop();
    scheduledCalls.delete(eventId);
    console.log(`❌ Cancelled scheduled call for event ${eventId}`);
  }
}

function getScheduledCalls() {
  return Array.from(scheduledCalls.keys());
}

module.exports = {
  scheduleCallForEvent,
  makeCallToElder,
  cancelScheduledCall,
  getScheduledCalls
};
