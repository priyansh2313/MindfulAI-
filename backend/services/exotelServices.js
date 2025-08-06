// services/exotelService.js
require('dotenv').config();
const axios = require('axios');
const qs    = require('querystring');

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
  // Exotel Connect endpoint (Voice v1)
  const url =
    `https://${EXOTEL_SID}:${EXOTEL_TOKEN}@${EXOTEL_SUBDOMAIN}/v1/Accounts/${EXOTEL_SID}/Calls/connect`;

  // form-data payload
  const payload = qs.stringify({
    From: to,                                // call elder first
    To: to,                                  // then “connect” them back to the same number
    CallerId: EXOTEL_VIRTUAL_NUMBER,         // your ExoPhone
    StatusCallback: `${BASE_URL}/api/exotel/status`,
    'StatusCallbackEvents[0]': 'terminal',   // when call ends
    'StatusCallbackContentType': 'application/json',
    Record: 'false'                          // or 'true' to record
  });

  const resp = await axios.post(url, payload, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return resp.data;
}

module.exports = { makeCallToElder };
