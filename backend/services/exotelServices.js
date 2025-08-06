require('dotenv').config();
const axios = require('axios');
const qs    = require('querystring');
const schedule = require('node-schedule');

// Load and trim environment variables
let { EXOTEL_SID, EXOTEL_TOKEN, EXOTEL_VIRTUAL_NUMBER, EXOTEL_SUBDOMAIN, BASE_URL } = process.env;
EXOTEL_SID = EXOTEL_SID?.trim();
EXOTEL_TOKEN = EXOTEL_TOKEN?.trim();
EXOTEL_VIRTUAL_NUMBER = EXOTEL_VIRTUAL_NUMBER?.trim();
EXOTEL_SUBDOMAIN = EXOTEL_SUBDOMAIN?.trim();
// Strip any "key=value" if mistakenly included in the var
if (EXOTEL_SUBDOMAIN?.includes('=')) {
  EXOTEL_SUBDOMAIN = EXOTEL_SUBDOMAIN.split('=').pop().trim();
  console.log('Sanitized EXOTEL_SUBDOMAIN:', EXOTEL_SUBDOMAIN);
}
BASE_URL = BASE_URL?.trim();

// Basic Auth header for Exotel
const auth = Buffer.from(`${EXOTEL_SID}:${EXOTEL_TOKEN}`).toString('base64');

  // Connect two numbers: From → To (then call flow configured on your ExoPhone)
async function makeCallToElder(to, eventTitle = 'your scheduled event', eventTime = new Date()) {
  // Exotel Connect endpoint (Voice v1)
  // Use credentials in URL to ensure correct basic auth
// Use Twilix host for voice connect API
const voiceDomain = EXOTEL_SUBDOMAIN.startsWith('api')
  ? EXOTEL_SUBDOMAIN.replace(/^api\./, 'twilix.')
  : EXOTEL_SUBDOMAIN;
const url = `https://${EXOTEL_SID}:${EXOTEL_TOKEN}@${voiceDomain}/v1/Accounts/${EXOTEL_SID}/Calls/connect`;
  // form-data payload: virtual number must be 'From', destination number 'To'
  const payload = qs.stringify({
    From: EXOTEL_VIRTUAL_NUMBER,             // Your ExoPhone number (originate call)
    To: to,                                  // Destination number (elder)
    CallerId: EXOTEL_VIRTUAL_NUMBER,         // your ExoPhone
    StatusCallback: `${BASE_URL}/api/exotel/status`,
    'StatusCallbackEvents[0]': 'terminal',   // when call ends
    'StatusCallbackContentType': 'application/json',
    Record: 'false'                          // or 'true' to record
  });

  try {
    console.log('Making Exotel API call...');
    console.log('URL:', url);
    console.log('Payload:', payload);
    
    const resp = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Exotel API Response:', resp.data);
    return resp.data;
  } catch (error) {
    console.error('Exotel API Error Details:');
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
    console.error('Response Data:', error.response?.data);
    console.error('URL used:', url);
    // Don't log tokens in production — this is just for debugging
    console.error('SID:', EXOTEL_SID);
    console.error('Token length:', EXOTEL_TOKEN?.length);
    throw error;
  }
}

// In-memory store for scheduled jobs
const scheduledJobs = {};

/**
 * Schedule a call for an event at a specified time (20 minutes before event)
 * @param {string} eventId - Unique event identifier
 * @param {string} phoneNumber - Destination phone number (elder)
 * @param {string} eventTitle - Title or description of the event
 * @param {Date|string} eventTime - Original event time
 */
function scheduleCallForEvent(eventId, phoneNumber, eventTitle, eventTime) {
  const time = new Date(eventTime);
  const callTime = new Date(time.getTime() - 20 * 60 * 1000); // 20 minutes before
  console.log(`Scheduling Exotel call for event ${eventId} at ${callTime}`);
  const job = schedule.scheduleJob(callTime, () => {
    makeCallToElder(phoneNumber, eventTitle, time)
      .then(() => console.log(`Exotel call executed for event ${eventId}`))
      .catch(err => console.error(`Exotel call failed for event ${eventId}:`, err));
  });
  scheduledJobs[eventId] = job;
}

/**
 * Cancel a previously scheduled call for an event
 * @param {string} eventId - Unique event identifier
 */
function cancelScheduledCall(eventId) {
  const job = scheduledJobs[eventId];
  if (job) {
    job.cancel();
    delete scheduledJobs[eventId];
    console.log(`Canceled Exotel call for event ${eventId}`);
  }
}

module.exports = { makeCallToElder, scheduleCallForEvent, cancelScheduledCall };
