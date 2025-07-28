const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configure AWS Polly
AWS.config.update({ region: 'ap-south-1' }); // Use Mumbai region for Bengali
const polly = new AWS.Polly({
  accessKeyId: 'AKIAXL6V2UTPZA6GSCPY', // <-- Fill in your AWS credentials
  secretAccessKey: 'etTuVSyYIbLKaxoyYqoZRks4eJREpLqW5ysKmwXD'
});

// Map language to Polly voice
const getVoiceId = (lang) => {
  if (lang === 'hi') return 'Aditi';    // Hindi (Aditi supports both en-IN and hi-IN)
  if (lang === 'bn') return 'Bidisha';  // Bengali
  return 'Joanna';                      // English (US)
};

const getLanguageCode = (lang) => {
  if (lang === 'hi') return 'hi-IN';
  if (lang === 'bn') return 'bn-IN';
  return 'en-US';
};

app.post('/tts', async (req, res) => {
  const { text, lang } = req.body;
  const voiceId = getVoiceId(lang);
  const languageCode = getLanguageCode(lang);

  const params = {
    OutputFormat: 'mp3',
    Text: text,
    VoiceId: voiceId,
    LanguageCode: languageCode
  };

  polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      console.error('Polly error:', err);
      return res.status(500).send('Polly error');
    }
    res.set('Content-Type', 'audio/mpeg');
    res.send(data.AudioStream);
  });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Polly TTS server running on port ${PORT}`));
 