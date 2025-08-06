// services/exotelServices.js
require('dotenv').config();
const axios = require('axios');
const qs = require('querystring');

const {
  EXOTEL_SID,
  EXOTEL_TOKEN,
  EXOTEL_VIRTUAL_NUMBER,
  EXOTEL_SUBDOMAIN,
  BASE_URL
} = process.env;

// Basic Auth header for Exotel
const auth = Buffer.from(`${EXOTEL_SID}:${EXOTEL_TOKEN}`).toString('base64');

// Connect two numbers: From → To (then call flow configured on your ExoPhone)
async function makeCallToElder(to, eventTitle = 'your scheduled event', eventTime = new Date()) {
  // Exotel Connect endpoint (Voice v1) - Fixed URL format
  const url = `https://${EXOTEL_SUBDOMAIN}/v1/Accounts/${EXOTEL_SID}/Calls/connect`;

  // form-data payload - Fixed From field
  const payload = qs.stringify({
    From: EXOTEL_VIRTUAL_NUMBER,             // Your ExoPhone number
    To: to,                                  // Destination number  
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
    console.log('SID:', EXOTEL_SID);
    console.log('Token length:', EXOTEL_TOKEN?.length);
    
    const resp = await axios.post(url, payload, {
      headers: {
        'Authorization': `Basic ${auth}`,
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
    console.error('Auth header:', `Basic ${auth.substring(0, 20)}...`);
    throw error;
  }
}

module.exports = { makeCallToElder };
