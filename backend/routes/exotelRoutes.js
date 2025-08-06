
const express = require('express');
const router  = express.Router();
const { makeCallToElder } = require('../services/exotelServices');

// trigger a test call
router.post('/test-call-now', async (req, res) => {
  const { phoneNumber, eventTitle, eventTime } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: 'phoneNumber is required' });

  try {
    const result = await makeCallToElder(
      phoneNumber,
      eventTitle || 'Test Event',
      eventTime ? new Date(eventTime) : new Date()
    );
    res.json({ success: true, result });
  } catch (err) {
    console.error('Exotel call error', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to make test call', details: err.response?.data || err.message });
  }
});

// status webhook
router.post('/status', (req, res) => {
  console.log('📞 Exotel status callback:', req.body);
  res.sendStatus(200);
});

module.exports = router;
