import React, { useEffect, useState } from 'react';
import EvaluationCard from '../components/EvaluationCard';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LearningSummaryCard from '../components/LearningSummaryCard';
import Recommendations from '../components/Recommendations';
import ServicesGridElder from '../components/ServicesGridElder';
import ActionEffectivenessWidget from '../components/Widgets/ActionEffectivenessWidget';
import MoodWidget from '../components/Widgets/MoodWidget';
import ProgressWidget from '../components/Widgets/ProgressWidget';
import TipWidget from '../components/Widgets/TipWidget';
import FloatingChatbot from './FloatingChatbot';
import FloatingLeaves from './FloatingLeaves';

function VoiceAssistant() {
  const helpText = `Welcome to your dashboard. You can check your mood, view recommendations, or talk to our assistant. If you need help, press this button again.`;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Function to update voices
    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    // Cleanup
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = () => {
    if (!voices.length) return; // Don't speak until voices are loaded
    const utterance = new window.SpeechSynthesisUtterance(helpText);
    // Prefer a soft, female English voice if available
    let preferred = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
    if (!preferred) {
      preferred = voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('microsoft') || v.name.toLowerCase().includes('soft')));
    }
    if (!preferred) {
      preferred = voices.find(v => v.lang.startsWith('en'));
    }
    if (preferred) utterance.voice = preferred;
    utterance.pitch = 1.1;
    utterance.rate = 0.95;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      style={{
        position: 'fixed',
        bottom: 32,
        left: 32,
        zIndex: 1000,
        background: '#111',
        color: '#fff',
        fontSize: '1.5rem',
        padding: '1rem 2rem',
        borderRadius: '2rem',
        border: '2px solid #222',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        cursor: 'pointer',
        fontWeight: 600,
        letterSpacing: 1,
      }}
      aria-label="Voice Help"
      disabled={!voices.length}
    >
      🗣️ Voice Help
    </button>
  );
}

export default function ElderDashboard() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  return (
    <div
      className="min-h-screen bg-white text-black text-2xl"
      style={{ border: '4px solid #222', padding: '2rem 0' }}
    >
      <FloatingLeaves />
      <Header />
      <Hero />
      <ServicesGridElder />
      <section className="flex flex-wrap gap-8 justify-center my-8">
        <EvaluationCard />
        <LearningSummaryCard />
      </section>
      <section className="flex flex-wrap gap-8 justify-center my-8">
        <MoodWidget />
        <ActionEffectivenessWidget />
        <ProgressWidget />
        <TipWidget />
        <Recommendations />
      </section>
      <div className="flex justify-center mt-8">
        <button
          className="py-4 px-6 bg-black text-white text-lg rounded-2xl font-bold border-2 border-gray-800 hover:bg-gray-900 transition-colors mr-4"
        >
          Main Action
        </button>
        <button
          className="py-4 px-6 bg-white text-black text-lg rounded-2xl font-bold border-2 border-gray-800 hover:bg-gray-100 transition-colors"
        >
          Secondary Action
        </button>
      </div>
      <FloatingChatbot
        isOpen={chatbotOpen}
        onToggle={() => setChatbotOpen((open) => !open)}
        hoveredSection={null}
        mode="dashboard"
      />
      <VoiceAssistant />
    </div>
  );
} 