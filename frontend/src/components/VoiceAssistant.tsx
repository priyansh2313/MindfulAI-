import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function VoiceAssistant() {
  const location = useLocation();
  const [selectedLang, setSelectedLang] = useState('en');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [answer, setAnswer] = useState('');
  // Always show voice buttons
  const showVoiceButtons = true;

  // Context-aware help text (with translations)
  let helpText = "Welcome to your dashboard. You can check your mood, view recommendations, or talk to our assistant. If you need help, press this button again.";
  if (selectedLang === 'hi') {
    helpText = "आपके डैशबोर्ड में आपका स्वागत है। आप अपना मूड देख सकते हैं, सिफारिशें देख सकते हैं, या हमारे सहायक से बात कर सकते हैं। यदि आपको मदद चाहिए, तो फिर से इस बटन को दबाएं।";
  } else if (selectedLang === 'bn') {
    helpText = "আপনার ড্যাশবোর্ডে স্বাগতম। আপনি আপনার মুড দেখতে পারেন, সুপারিশ দেখতে পারেন, অথবা আমাদের সহকারীর সাথে কথা বলতে পারেন। যদি আপনার সাহায্য দরকার হয়, আবার এই বোতামটি চাপুন।";
  }
  if (location.pathname.includes('journal')) {
    helpText = selectedLang === 'hi'
      ? "आप अपनी डायरी में हैं। आप अपने विचार लिख सकते हैं या शांतिपूर्ण संगीत सुन सकते हैं।"
      : selectedLang === 'bn'
        ? "আপনি আপনার জার্নালে আছেন। আপনি আপনার চিন্তা লিখতে পারেন বা শান্তিপূর্ণ সঙ্গীত শুনতে পারেন।"
        : "You are in your journal. You can write your thoughts or listen to calming music.";
  } else if (location.pathname.includes('community')) {
    helpText = selectedLang === 'hi'
      ? "आप कम्युनिटी चैट में हैं। आप दूसरों से जुड़ सकते हैं या सहायता मांग सकते हैं।"
      : selectedLang === 'bn'
        ? "আপনি কমিউনিটি চ্যাটে আছেন। আপনি অন্যদের সাথে সংযোগ করতে পারেন বা সহায়তা চাইতে পারেন।"
        : "You are in the community chat. You can connect with others or ask for support.";
  } else if (location.pathname.includes('evaluation')) {
    helpText = selectedLang === 'hi'
      ? "आप मूल्यांकन पृष्ठ पर हैं। आप अपनी भलाई की जांच के लिए त्वरित मूल्यांकन ले सकते हैं।"
      : selectedLang === 'bn'
        ? "আপনি মূল্যায়ন পৃষ্ঠায় আছেন। আপনি আপনার মঙ্গল যাচাই করতে একটি দ্রুত মূল্যায়ন নিতে পারেন।"
        : "You are on the evaluation page. You can take a quick assessment to check your well-being.";
  }

  // Polly TTS function
  const playPollyTTS = async (text: string, lang: string) => {
    try {
      const res = await fetch('http://localhost:5001/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang })
      });
      if (!res.ok) throw new Error('Polly error');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      alert('Could not play audio. Please check your connection to the TTS server.');
    }
  };

  // Speak helper (now uses Polly)
  const speak = (text: string) => {
    playPollyTTS(text, selectedLang);
  };

  // Voice Q&A logic (English only for now)
  const commonQuestions: { [key: string]: string } = {
    'how do i check my mood': 'To check your mood, press the Mood Check button in the features section.',
    'how do i talk to assistant': 'To talk to the assistant, press the chat icon at the bottom right.',
    'how do i write journal': 'To write in your journal, press the Journal button in the features section.',
    'how do i listen to music': 'To listen to music, press the Peaceful Music button in the features section.',
    'how do i join community': 'To join the community chat, press the Community Chat button in the features section.'
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setAnswer('Sorry, your browser does not support speech recognition.');
      return;
    }
    setAnswer('');
    setListening(true);
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang === 'en' ? 'en-US' : selectedLang === 'hi' ? 'hi-IN' : 'bn-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      let found = false;
      for (const q in commonQuestions) {
        if (transcript.includes(q)) {
          setAnswer(commonQuestions[q]);
          speak(commonQuestions[q]);
          found = true;
          break;
        }
      }
      if (!found) {
        setAnswer('Sorry, I did not understand. Please try again or ask a different question.');
        speak('Sorry, I did not understand. Please try again or ask a different question.');
      }
      setListening(false);
    };
    recognition.onerror = () => {
      setAnswer('Sorry, there was a problem with speech recognition.');
      setListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div>
      {/* Show voice buttons and dropdown only after scroll */}
      {showVoiceButtons && (
        <>
          {/* Language selection dropdown only */}
          <div style={{ position: 'fixed', left: 32, bottom: 110, zIndex: 1000, background: '#fff', borderRadius: 12, padding: 8, border: '2px solid #222' }}>
            <label htmlFor="lang-select" style={{ fontWeight: 600, marginRight: 8 }}>Language:</label>
            <select
              id="lang-select"
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value)}
              style={{ fontSize: '1rem', padding: 4 }}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
            </select>
          </div>
          {/* Main Voice Help button */}
          <button
            onClick={() => speak(helpText)}
            style={{
              position: 'fixed',
              bottom: 32,
              left: 32,
              zIndex: 1000,
              background: '#111',
              color: '#fff',
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '1rem',
              border: '2px solid #222',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              cursor: 'pointer',
              fontWeight: 600,
              letterSpacing: 1,
            }}
            aria-label="Voice Help"
          >
            🗣️ Voice Help
          </button>
          {/* Voice Q&A button */}
          
        </>
      )}
      {/* Q&A answer display */}
      {answer && (
        <div style={{
          position: 'fixed',
          left: 15,
          bottom: 90,
          zIndex: 1000,
          background: '#fff',
          color: '#222',
          fontSize: '1.1rem',
          padding: '0.8rem 1.5rem',
          borderRadius: '1rem',
          border: '2px solid #222',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          fontWeight: 500,
          maxWidth: 400,
        }}>
          {answer}
        </div>
      )}
    </div>
  );
} 